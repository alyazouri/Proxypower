// PAC: تصفية حسب نوع الخدمة (MATCH / LOBBY / RECRUIT / REQUESTS / UPDATES)
// - البروكسي واحد (ثابت).
// - لكل فئة مسموح فقط نطاقات IPv6 معيّنة (Allowed ranges).
// - لو السيرفر مش داخل النطاق المسموح لها -> بلوك.
//
// الفكرة: كل خدمة في اللعبة تروح على سيرفرات IPv6 معينة أنت تحددها.
// هذا بيسمحلك تقول: الماتش بس على نطاق X، اللوبي بس على نطاق Y، وهكذا.

(function() {

  // ---------------------------------
  // إعداد البروكسي الثابت (نفسه لكل شيء)
  // إذا بدك بورتات مختلفة لكل فئة ممكن، بس حسب كلامك: "البروكسي خليه واحد"
  // نخلي البورت الرئيسي 443 (HTTPS) عشان iOS ما يزعل.
  // لو عندك بورتات ثانية حاب تستخدمها للماتش مثلاً، بنقدر نرجعها.
  // ---------------------------------
  var PROXY_HOST = "91.106.109.12";
  var PROXY_PORT_DEFAULT = 443;

  function proxyReturn() {
    return "PROXY " + PROXY_HOST + ":" + PROXY_PORT_DEFAULT;
  }

  var BLOCK_REPLY = "PROXY 0.0.0.0:0";

  // ---------------------------------
  // TTL للكاش الداخلي للـDNS
  // ---------------------------------
  var DST_RESOLVE_TTL_MS = 15 * 1000;

  // كاش DNS بسيط
  var globalRoot = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!globalRoot._PAC_RANGE_CACHE) globalRoot._PAC_RANGE_CACHE = {};
  var CACHE = globalRoot._PAC_RANGE_CACHE;
  if (!CACHE.dns) CACHE.dns = {};

  function resolveCached(host) {
    if (!host) return "";
    var now = (new Date()).getTime();
    var e = CACHE.dns[host];
    if (e && (now - e.t) < DST_RESOLVE_TTL_MS) return e.ip;
    var ip = "";
    try { ip = dnsResolve(host) || ""; } catch (err) { ip = ""; }
    CACHE.dns[host] = { ip: ip, t: now };
    return ip;
  }

  // ---------------------------------
  // دوال مساعدة لIPv6
  // ---------------------------------
  function expandIPv6(addr) {
    if (!addr) return "";
    if (addr.indexOf(":") === -1) return addr; // مش IPv6، ممكن IPv4
    if (addr.indexOf("::") === -1) return addr.toLowerCase();

    var parts = addr.split(":");
    var left = [], right = [];
    var hitEmpty = false;
    for (var i=0;i<parts.length;i++) {
      if (parts[i] === "") {
        hitEmpty = true;
        continue;
      }
      if (!hitEmpty) left.push(parts[i]); else right.push(parts[i]);
    }
    var missing = 8 - (left.length + right.length);
    var zeros = [];
    for (var j=0;j<missing;j++) zeros.push("0");
    var full = left.concat(zeros).concat(right).join(":");
    return full.toLowerCase();
  }

  // هل عنوان IPv6 ينتمي لنطاق مسموح
  // allowedPrefixes: Array of strings مثل ["2a03:6b00", "2a03:b640:1234"]
  function ipv6Allowed(ip, allowedPrefixes) {
    if (!ip) return false;
    // لو طلع IPv4، نرفضه (إلا لو مستقبلاً بدك تضيف IPv4 معينة، ساعتها منعدل)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
      return false;
    }

    var full = expandIPv6(ip);  // توسعة كاملة
    var lowerRaw = ip.toLowerCase();

    for (var i=0;i<allowedPrefixes.length;i++) {
      var pref = allowedPrefixes[i].toLowerCase().replace(/:+$/,'');
      // لو العنوان الموسّع يبدأ بالبادئة
      if (full.indexOf(pref) === 0) return true;
      // لو النسخة المختصرة تبدأ بالبادئة
      if (lowerRaw.indexOf(pref) === 0) return true;
    }
    return false;
  }

  // ---------------------------------
  // تحديد نوع الترافيك حسب URL/host
  // NOTE:
  // - MATCH: كل شيء له علاقة بالانضمام للعبة الفعلية / matchmaking / mms / game/start
  // - LOBBY: تسجيل الدخول / الـpresence / الأصدقاء / heartbeat
  // - RECRUIT: teamfinder / clan / recruit / البحث عن سكواد
  // - REQUESTS: أشياء API أو طلبات اجتماعية / إحصائيات / وغيرها لو بدك تفصلها عن RECRUIT
  // - UPDATES: تحميل ملفات، patch, CDN
  //
  // في حالتك حكيت "طلبات عنوان لحال" -> رح نعمل فئة REQUESTS لحال
  //
  // تقدر تغيّر التصنيف الحر حسب وين ببجي تبعت.
  // ---------------------------------

  // أنماط URL
  var URL_CLASS = {
    MATCH: [
      "*/matchmaking/*",
      "*/mms/*",
      "*/game/start*",
      "*/game/join*",
      "*/report/battle*"
    ],
    LOBBY: [
      "*/account/login*",
      "*/client/version*",
      "*/status/heartbeat*",
      "*/presence/*",
      "*/friends/*"
    ],
    RECRUIT: [
      "*/teamfinder/*",
      "*/recruit/*",
      "*/clan/*",
      "*/social/*",
      "*/search/*"
    ],
    REQUESTS: [
      // هون بتحط أي endpoints تعتبرهم "requests / API calls / ارسال طلبات"
      // مثلاً إحصائيات، profile pull, ranking ... الخ
      "*/profile/*",
      "*/stats/*",
      "*/rank/*",
      "*/season/*",
      "*/mail/*"
    ],
    UPDATES: [
      "*/patch*",
      "*/hotfix*",
      "*/update*",
      "*/download*",
      "*/assets/*",
      "*/assetbundle*",
      "*/obb*",
      "*/cdn/*",
      "*/static/*",
      "*/image/*",
      "*/media/*",
      "*/video/*",
      "*/res/*",
      "*/pkg/*"
    ]
  };

  // أنماط host / domains
  var HOST_CLASS = {
    MATCH: [
      "*.gcloud.qq.com",
      "gpubgm.com"
    ],
    LOBBY: [
      "*.pubgmobile.com",
      "*.pubgmobile.net",
      "*.proximabeta.com",
      "*.igamecj.com"
    ],
    RECRUIT: [
      "teamfinder.igamecj.com",
      "teamfinder.proximabeta.com",
      "match.igamecj.com",
      "match.proximabeta.com"
    ],
    REQUESTS: [
      // لو اللعبة تستخدم دومينات API أو احصائيات مختلفة عن اللوبي
      "api.pubgmobile.com",
      "stats.pubgmobile.com",
      "mail.pubgmobile.com"
    ],
    UPDATES: [
      "cdn.pubgmobile.com",
      "updates.pubgmobile.com",
      "patch.igamecj.com",
      "hotfix.proximabeta.com",
      "dlied1.qq.com",
      "dlied2.qq.com",
      "cdn.proximabeta.com",
      "cdn.tencentgames.com",
      "*.qcloudcdn.com",
      "*.cloudfront.net",
      "*.edgesuite.net"
    ]
  };

  // ---------------------------------
  // الآن أهم جزء:
  // ALLOWED_V6: لكل فئة تضع فيها البادئات IPv6 اللي إنت راضي إنها تستخدم لهذي الخدمة
  // يعني: الماتش له بادئته الخاصة (سيرفر ماتش محلي معيّن).
  // اللوبي له بادئة ثانية (سيرفر presence محلي ثانوي).
  // التجنيد له بادئة ثالثة.
  // الإرسال/الطلبات له بادئة رابعة.
  // التحديثات له بادئة خامسة (أو أوسع عشان ما يوقف تحميل اللعبة بالكامل).
  //
  // هون بتحط ranges اللي بدك كل فئة ترتبط فيها.
  // مبدئياً بحط أمثلة placeholders. استبدلهم بالقيم الحقيقية لما تجمعها.
  // ---------------------------------
  var ALLOWED_V6 = {
    MATCH: [
      // نطاق السيرفرات تبعون الماتش/اللعبة الفعلية
      // حط هون الـprefix اللي إنت متأكد إنه يعطيك أردنيين أو محلي
      "2a03:b640",         // مثال سيرفر ماتش
      // ضيف كمان prefix ثاني لو عندك سيرفر ماتش ثاني
    ],
    LOBBY: [
      // نطاق السيرفرات تبعون اللوبي / login / presence
      "2a03:6b00",         // مثال سيرفر لوبي
    ],
    RECRUIT: [
      // نطاق السيرفرات تبعون teamfinder / clan / recruit
      "2a03:6b00:abcd",    // مجرد مثال أكثر تحديد
    ],
    REQUESTS: [
      // نطاق السيرفرات تبعون الrequests/API/الاحصائيات اللي انت بدك تسمح لها
      "2a01:9700",         // مثال: مسار إحصائيات/بروفايل
    ],
    UPDATES: [
      // نطاق سيرفرات الـCDN / الـpatch
      // غالباً هذول مش دايم أردنيين. انت حر:
      // إذا حطيتها ضيقة كثير اللعبة ممكن ما تنزل تحديث.
      "2a03:6b00",
      "2a03:b640"
    ]
  };

  // ---------------------------------
  // Helpers لتصنيف الـURL / host لأي فئة
  // ---------------------------------
  function classify(url, host) {
    // ترتيب مهم: الماتش أول شي لأنه الأهم عندك من حيث اللاعبين
    if (isMatch(url, URL_CLASS.MATCH) || isHostMatch(host, HOST_CLASS.MATCH)) return "MATCH";
    if (isMatch(url, URL_CLASS.LOBBY) || isHostMatch(host, HOST_CLASS.LOBBY)) return "LOBBY";
    if (isMatch(url, URL_CLASS.RECRUIT) || isHostMatch(host, HOST_CLASS.RECRUIT)) return "RECRUIT";
    if (isMatch(url, URL_CLASS.REQUESTS) || isHostMatch(host, HOST_CLASS.REQUESTS)) return "REQUESTS";
    if (isMatch(url, URL_CLASS.UPDATES) || isHostMatch(host, HOST_CLASS.UPDATES)) return "UPDATES";
    return null;
  }

  function isMatch(url, arr) {
    if (!url) return false;
    for (var i=0;i<arr.length;i++) {
      if (shExpMatch(url, arr[i])) return true;
    }
    return false;
  }

  function isHostMatch(h, arr) {
    if (!h) return false;
    h = h.toLowerCase();
    for (var i=0;i<arr.length;i++) {
      var pat = arr[i];
      if (shExpMatch(h, pat)) return true;
      if (pat.indexOf("*.")===0) {
        var suf = pat.substring(1);
        if (h.length >= suf.length && h.substring(h.length - suf.length) === suf) return true;
      }
    }
    return false;
  }

  // ---------------------------------
  // الدالة الأساسية اللي iOS / النظام بناديها
  // ---------------------------------
  function FindProxyForURL(url, host) {
    // 1. صنّف نوع الترافيك (أي فئة هو؟)
    var cat = classify(url, host);
    if (!cat) {
      // مش تابع ولا فئة؟ إحنا ما بدنا نتكلم معاه -> بلوك
      return BLOCK_REPLY;
    }

    // 2. حل الـhost إلى IP
    var ip = resolveCached(host);
    if (!ip) {
      // ما عرفنا نجيب IP؟ بلوك
      return BLOCK_REPLY;
    }

    // 3. هل الـIP يقع داخل الـprefixات المسموحة لهاي "الفئة"؟
    var allowedList = ALLOWED_V6[cat];
    if (!ipv6Allowed(ip, allowedList)) {
      // يعني اللعبة بدها تروح لسيرفر مش من المجموعة اللي انت حددتها لهاي الخدمة
      return BLOCK_REPLY;
    }

    // 4. إذا وصلنا لهون -> مسموح نكمّل عبر البروكسي الثابت
    return proxyReturn();
  }

  // لازم نصدّر الدالة
  this.FindProxyForURL = FindProxyForURL;

})();
