function FindProxyForURL(url, host) {
  // -------- إعدادات أساسية --------
  // بروكسي أردني للخروج (TCP/SOCKS5H المفروض يكون أردني فعلياً)
  var PROXY_HOST = "91.106.109.12";

  // بورت ثابت لكل فئة (بدون عشوائية)
  // الهدف: استقرار الهوية و المسار
  var FIXED_PORT = {
    LOBBY:            443,     // تسجيل دخول / حضور / أصدقاء
    MATCH:            20001,   // بدء الماتش / الماتش فعلي
    RECRUIT_SEARCH:   10012,   // البحث عن فريق / تجنيد
    UPDATES:          80,      // تنزيل التحديثات / موارد
    CDN:              80       // CDN أصول اللعبة
  };

  // هذا البلوك يجبر كل شيء يخص ببجي يمر عبر أردن فقط
  // لو الوجهة مش أردنية: نمنع
  var FORBID_IF_NOT_JORDAN = true;

  // البادئة الأردنية الوحيدة (IPv6) اللي بدنا نعتمدها
  // يعني فعلياً معاملة هذا كـ "هذا أردن وهذا اللي بسمحله"
  var JO_V6_PREFIXES = [
    "2a01:9700:1"   // يغطي 2a01:9700:1::/?? (مطابقة بادئة)
  ];

  // TTL لكاش الـ DNS
  var DST_RESOLVE_TTL_MS = 15 * 1000;

  // TTL لكاش "هل أنا أردني" و "هل البروكسي أردني"
  var GEO_TTL_MS = 60 * 60 * 1000; // ساعة

  // كاش مشترك على مستوى الجلوبال
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;

  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE.GEO_CACHE) CACHE.GEO_CACHE = {};

  // -------- قوائم الدومينات / المسارات الخاصة بببجي --------

  var PUBG_DOMAINS = {
    LOBBY: [
      "*.pubgmobile.com",
      "*.pubgmobile.net",
      "*.proximabeta.com",
      "*.igamecj.com"
    ],
    MATCH: [
      "*.gcloud.qq.com",
      "gpubgm.com"
    ],
    RECRUIT_SEARCH: [
      "match.igamecj.com",
      "match.proximabeta.com",
      "teamfinder.igamecj.com",
      "teamfinder.proximabeta.com"
    ],
    UPDATES: [
      "cdn.pubgmobile.com",
      "updates.pubgmobile.com",
      "patch.igamecj.com",
      "hotfix.proximabeta.com",
      "dlied1.qq.com",
      "dlied2.qq.com",
      "gpubgm.com"
    ],
    CDN: [
      "cdn.igamecj.com",
      "cdn.proximabeta.com",
      "cdn.tencentgames.com",
      "*.qcloudcdn.com",
      "*.cloudfront.net",
      "*.edgesuite.net"
    ]
  };

  var URL_PATTERNS = {
    LOBBY: [
      "*/account/login*",
      "*/client/version*",
      "*/status/heartbeat*",
      "*/presence/*",
      "*/friends/*"
    ],
    MATCH: [
      "*/matchmaking/*",
      "*/mms/*",
      "*/game/start*",
      "*/game/join*",
      "*/report/battle*"
    ],
    RECRUIT_SEARCH: [
      "*/teamfinder/*",
      "*/clan/*",
      "*/social/*",
      "*/search/*",
      "*/recruit/*"
    ],
    UPDATES: [
      "*/patch*",
      "*/hotfix*",
      "*/update*",
      "*/download*",
      "*/assets/*",
      "*/assetbundle*",
      "*/obb*"
    ],
    CDN: [
      "*/cdn/*",
      "*/static/*",
      "*/image/*",
      "*/media/*",
      "*/video/*",
      "*/res/*",
      "*/pkg/*"
    ]
  };

  // -------- أدوات صغيرة --------

  // نخلي host lowercase
  if (host && host.toLowerCase) {
    host = host.toLowerCase();
  }

  function shHostMatch(h, patterns) {
    if (!h) return false;
    for (var i = 0; i < patterns.length; i++) {
      var pat = patterns[i];
      if (shExpMatch(h, pat)) return true;

      // دعم نمط "*.example.com" كـ suffix match
      if (pat.indexOf("*.") === 0) {
        var suf = pat.substring(1); // ".example.com"
        if (h.length >= suf.length && h.substring(h.length - suf.length) === suf) {
          return true;
        }
      }
    }
    return false;
  }

  function shURLMatch(u, patterns) {
    if (!u) return false;
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(u, patterns[i])) return true;
    }
    return false;
  }

  // كاش dnsResolve() لتخفيف الضغط (أفضل ممارسة بحسب توصيات PAC لأن dnsResolve ممكن يعلّق لو DNS مش يرد)
  // المصدر يحذر من الإفراط في dnsResolve و isInNet لأنه يسبب بطء وتعليق إذا DNS ما برد، فلازم نعمل كاش ونعيد استخدامه بدل تكرار الطلب كل مرة. هذا أسلوب موصى فيه لتحسين أداء PAC وتخفيف التأخير في التصفح/الاتصال [oai_citation:0‡localhost](http://localhost:8451/https://help.forcepoint.com/websec/en-us/on-prem/85/pac_file_best_practices/wsop_85x_pacfbp_en-us.pdf) [oai_citation:1‡localhost](http://localhost:8451/https://help.forcepoint.com/websec/en-us/on-prem/85/pac_file_best_practices/wsop_85x_pacfbp_en-us.pdf).
  function resolveDstCached(h, ttl_ms) {
    if (!h) return "";

    // إذا h شكله IPv6 جاهز (يحتوي :)
    // ملاحظة خفيفة: ما نحاول نعمل parsing كامل، بس نرفض الأسماء اللي فيها حروف a-f و : لأنه طبيعي لـIPv6
    // وبنفس الوقت ما نروح لdnsResolve على الفاضي.
    if (h.indexOf(":") !== -1 && h.indexOf(".") === -1) {
      // شكله IPv6 literal
      return h;
    }

    var now = (new Date()).getTime();
    var hit = CACHE.DST_RESOLVE_CACHE[h];
    if (hit && (now - hit.t) < ttl_ms) {
      return hit.ip;
    }

    var ip = "";
    try {
      var r = dnsResolve(h);
      if (r && r !== "0.0.0.0") {
        ip = r;
      }
    } catch (e) {
      // نخلي ip فاضي
    }

    CACHE.DST_RESOLVE_CACHE[h] = {ip: ip, t: now};
    return ip;
  }

  // هل IP هذا (IPv6) داخل البادئة الأردنية؟
  // منطق المطابقة: إذا العنوان يبدأ بـ "2a01:9700:1" أو "2a01:9700:1::"
  // نخفّض للحروف الصغيرة لتجنب مشاكل الشكل.
  function ipIsInAnyJordanV6(ip) {
    if (!ip) return false;
    var lower = ip.toLowerCase();

    // لازم يكون IPv6 (يعني يحتوي :)
    if (lower.indexOf(":") === -1) return false;

    for (var i = 0; i < JO_V6_PREFIXES.length; i++) {
      var pref = JO_V6_PREFIXES[i].toLowerCase().replace(/:+$/, "");
      // نسمح:
      // - يبدأ بالبادئة + "::"
      // - يبدأ بالبادئة + ":"
      // - يساويها بالضبط
      if (lower === pref) return true;
      if (lower.indexOf(pref + "::") === 0) return true;
      if (lower.indexOf(pref + ":") === 0) return true;
    }
    return false;
  }

  // يبني ستـرنج البروكسي لفئة معيّنة ببورتها الثابت
  function proxyFor(cat) {
    var p = FIXED_PORT[cat];
    if (!p) {
      // fallback احتياطي لو صار نقص تعريف
      p = 443;
    }
    return "PROXY " + PROXY_HOST + ":" + p;
  }

  // قرار "اسمح أو امنع" حسب إذا المسار أردني ولا لا.
  // إذا الوجهة مش أردنية و FORBID_IF_NOT_JORDAN = true → رجّع بلوك.
  // البلوك هنا: "PROXY 0.0.0.0:0" (يعني ممنوع عملياً)
  function requireJordan(cat, h) {
    var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    var ok = ipIsInAnyJordanV6(ip);

    if (!ok && FORBID_IF_NOT_JORDAN) {
      return "PROXY 0.0.0.0:0";
    }

    return proxyFor(cat);
  }

  // -------- فحص هوية الطرفين (جهازك والبروكسي) أنها أردنية --------
  // الهدف: لو جهازك نفسه مش ظاهر كأردني أو البروكسي مش أردني، نوقف كل شيء.
  // هاد السلوك يخلي اللعبة تشوفك دايم أردني، ومش تسمحلك تبني سيشن عالمسار الخطأ بالغلط.

  function getClientIPv6Cached() {
    var now = (new Date()).getTime();
    var hit = CACHE.GEO_CACHE["CLIENT"];
    if (hit && (now - hit.t) < GEO_TTL_MS) {
      return hit.isJO;
    }

    // myIpAddress() ممكن يرجّع IPv4 ببعض الأنظمة
    // نحاول نحصل عليه ونشوف إذا IPv6 وبنفس البادئة
    var myip = "";
    try {
      myip = myIpAddress(); // ملاحظة: بعض الـPAC على iOS/Android ممكن يرجع v4
    } catch(e) {
      myip = "";
    }
    var isJO = ipIsInAnyJordanV6(myip);
    CACHE.GEO_CACHE["CLIENT"] = {isJO: isJO, t: now};
    return isJO;
  }

  function getProxyIPv6Cached() {
    var now = (new Date()).getTime();
    var hit = CACHE.GEO_CACHE["PROXY"];
    if (hit && (now - hit.t) < GEO_TTL_MS) {
      return hit.isJO;
    }

    // البروكسي معرف كـ IP/اسم. إذا كان IPv6 أردني من نفس البادئة رح ينقبل.
    // لو كان IPv4 رح يطلع false، يعني بنمنع (صارم جدًا).
    var isJO = ipIsInAnyJordanV6(PROXY_HOST);
    CACHE.GEO_CACHE["PROXY"] = {isJO: isJO, t: now};
    return isJO;
  }

  // لو أي واحد (الجهاز أو البروكسي) مش أردني حسب تعريفنا → بلوك كامل
  var clientOK = getClientIPv6Cached();
  var proxyOK  = getProxyIPv6Cached();
  if (!(clientOK && proxyOK)) {
    return "PROXY 0.0.0.0:0";
  }

  // -------- منطق القرار الحقيقي --------

  // 1) أولاً: لو الـURL نفسه يطابق أحد الأنماط
  //    (زي heartbeat, matchmaking, teamfinder...)
  //    → نوجّه حسب الفئة
  //    مع requireJordan() عشان الفئة ما تروح إلا لو السيرفر أردني
  if (shURLMatch(url, URL_PATTERNS.LOBBY)) {
    return requireJordan("LOBBY", host);
  }
  if (shURLMatch(url, URL_PATTERNS.MATCH)) {
    return requireJordan("MATCH", host);
  }
  if (shURLMatch(url, URL_PATTERNS.RECRUIT_SEARCH)) {
    return requireJordan("RECRUIT_SEARCH", host);
  }
  if (shURLMatch(url, URL_PATTERNS.UPDATES)) {
    return requireJordan("UPDATES", host);
  }
  if (shURLMatch(url, URL_PATTERNS.CDN)) {
    return requireJordan("CDN", host);
  }

  // 2) إذا الـhost (الدومين) يقع ضمن دومينات ببجي
  //    (pubgmobile.com, proximabeta.com, gcloud.qq.com, ...)
  //    نفس القصة: نستخدم الفئة المناسبة
  if (shHostMatch(host, PUBG_DOMAINS.LOBBY)) {
    return requireJordan("LOBBY", host);
  }
  if (shHostMatch(host, PUBG_DOMAINS.MATCH)) {
    return requireJordan("MATCH", host);
  }
  if (shHostMatch(host, PUBG_DOMAINS.RECRUIT_SEARCH)) {
    return requireJordan("RECRUIT_SEARCH", host);
  }
  if (shHostMatch(host, PUBG_DOMAINS.UPDATES)) {
    return requireJordan("UPDATES", host);
  }
  if (shHostMatch(host, PUBG_DOMAINS.CDN)) {
    return requireJordan("CDN", host);
  }

  // 3) حالة استثنائية:
  //    لو الـhost نفسه عنوان IP (مش دومين)، وطلع أردني بالـIPv6
  //    → اعتبره لَبّي (LOBBY) وامشي عليه.
  //    هذا بيغطي اتصالات مباشرة على IP بدون دومين.
  var directIP = host;
  // لو host مش IPv6 literal (يعني دومين), resolve
  if (directIP.indexOf(":") === -1 && directIP.indexOf(".") !== -1) {
    // host شكله IPv4 → ما يعنينا، ما رح نعتبره أردني، راح ينمنع لاحقاً لو دخل بالفئة
  } else if (directIP.indexOf(":") === -1 && directIP.indexOf(".") === -1) {
    // host شكل دومين عادي، نحاول نجيب IP الفعلي
    directIP = resolveDstCached(host, DST_RESOLVE_TTL_MS);
  }

  if (ipIsInAnyJordanV6(directIP)) {
    return requireJordan("LOBBY", host);
  }

  // 4) أي شيء مش PUBG أو مش أردني → بلوك صارم.
  //    هذا يمنع إنه اللعبة تفتح سيشن matchmaking على مسار غير أردني بالغلط،
  //    ويقلل احتمال يرميك سيرفر مش أردني.
  return "PROXY 0.0.0.0:0";
}
