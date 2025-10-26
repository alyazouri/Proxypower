// JO-ULTRA-FORCE.pac
// تصميم: يمنع أي اتصال مش على مسار أردني أصلي.
// ذكي + صارم + ثابت. الهدف: ترفع نسبة اللاعبين الأردنيين فعلياً.
// المطوّر: إلك ❤️

// ---------------------------
// إعدادات أساسية
// ---------------------------

// بروكسي أردني ثابت (إنت حدّدته)
var PROXY_HOST = "91.106.109.12";
// منفذ البروكسي (نختار 443 لأنه آمن وتقبله معظم الترافيك)
var PROXY_PORT = 443;

// الردود الجاهزة
var BLOCK = "PROXY 0.0.0.0:0";
function ALLOW_PROXY() {
  return "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
}

// مدة الكاش للـDNS (ms)
var DST_RESOLVE_TTL_MS = 15 * 1000;
// مدة تثبيت اختيار المزود الأفضل (ms) عشان الاستقرار
var ISP_STICKY_TTL_MS = 60 * 1000;

// كاش عام داخل سياق الـPAC
var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
if (!ROOT._JO_ULTRA_CACHE) ROOT._JO_ULTRA_CACHE = {};
var CACHE = ROOT._JO_ULTRA_CACHE;
if (!CACHE.dns) CACHE.dns = {};
if (!CACHE.bestISP) CACHE.bestISP = { name: null, t: 0 };

// ---------------------------
// تعريف مزودي الأردن (IPv6 prefixes)
// هاي ranges محجوزة رسمياً داخل الأردن
// ---------------------------
var ISP_LIST = [
  {
    name: "Zain_JO",
    prefixes: [
      "2a03:6b00"  // Zain Jordan IPv6 allocation
    ]
  },
  {
    name: "Umniah_JO",
    prefixes: [
      "2a03:b640" // Umniah / Batelco Jordan IPv6 allocation
    ]
  },
  {
    name: "Orange_JO",
    prefixes: [
      "2a00:18d8" // Orange Jordan IPv6 allocation
    ]
  },
  {
    name: "JDC_GO_JO",
    prefixes: [
      "2a01:9700" // Jordan Data Communication / GO
    ]
  },
  {
    name: "Mada_JO",
    prefixes: [
      "2a0a:8c40" // Mada Jordan wireless
    ]
  }
];

// ---------------------------
// PUBG تصنيف الترافيك (مهم للوضوح، وممكن تستخدمه لاحقاً للتشديد/التوسيع لو بدك)
// حالياً كل الفئات بتمر بنفس البروكسي، بس نحددهم للمستقبل
// ---------------------------
var URL_PATTERNS = {
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

var HOST_PATTERNS = {
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

// ---------------------------
// دوال مساعدة
// ---------------------------

// مقارنة wildcard للهوست
function hostMatchesAny(h, arr) {
  if (!h) return false;
  h = h.toLowerCase();
  for (var i=0;i<arr.length;i++) {
    var pat = arr[i];
    if (shExpMatch(h, pat)) return true;
    if (pat.indexOf("*.") === 0) {
      var suf = pat.substring(1); // ".pubgmobile.com"
      if (h.length >= suf.length &&
          h.substring(h.length - suf.length) === suf) {
        return true;
      }
    }
  }
  return false;
}

// مقارنة URL مع patterns
function urlMatchesAny(u, arr) {
  if (!u) return false;
  for (var i=0;i<arr.length;i++) {
    if (shExpMatch(u, arr[i])) return true;
  }
  return false;
}

// صنّف نوع الترافيك (مستقبلاً إذا حاب تعمل سياسات مختلفة لكل نوع)
function classifyTraffic(url, host) {
  if (urlMatchesAny(url, URL_PATTERNS.MATCH) || hostMatchesAny(host, HOST_PATTERNS.MATCH)) return "MATCH";
  if (urlMatchesAny(url, URL_PATTERNS.LOBBY) || hostMatchesAny(host, HOST_PATTERNS.LOBBY)) return "LOBBY";
  if (urlMatchesAny(url, URL_PATTERNS.RECRUIT) || hostMatchesAny(host, HOST_PATTERNS.RECRUIT)) return "RECRUIT";
  if (urlMatchesAny(url, URL_PATTERNS.UPDATES) || hostMatchesAny(host, HOST_PATTERNS.UPDATES)) return "UPDATES";
  return "OTHER";
}

// كاش dnsResolve
function resolveCached(h) {
  if (!h) return "";
  var now = (new Date()).getTime();
  var entry = CACHE.dns[h];
  if (entry && (now - entry.t) < DST_RESOLVE_TTL_MS) return entry.ip;
  var ip = "";
  try {
    ip = dnsResolve(h) || "";
  } catch(e) {
    ip = "";
  }
  CACHE.dns[h] = { ip: ip, t: now };
  return ip;
}

// توسعة IPv6 إلى 8 بلوكات كاملة (عشان المقارنة تكون ثابتة)
function expandIPv6(ip) {
  if (!ip) return "";
  if (ip.indexOf(':') === -1) return ip; // IPv4, بنرجعه زي ما هو
  if (ip.indexOf("::") === -1) return ip.toLowerCase();

  var parts = ip.split(":");
  var left = [], right = [];
  var hitEmpty = false;
  for (var i=0; i<parts.length; i++) {
    if (parts[i] === "") { hitEmpty = true; continue; }
    if (!hitEmpty) left.push(parts[i]); else right.push(parts[i]);
  }

  var missing = 8 - (left.length + right.length);
  var zeros = [];
  for (var j=0; j<missing; j++) zeros.push("0");

  var full = left.concat(zeros).concat(right).join(":");
  return full.toLowerCase();
}

// هل الـIP داخل نطاق ISP أردني معتمد؟
function whichISP(ip) {
  if (!ip) return null;

  // ممنوع IPv4: بدنا أردن أصلي IPv6 فقط
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
    return null;
  }

  var full = expandIPv6(ip); // ex: 2a03:6b00:abcd:1234:0000:0000:0000:0001
  for (var i=0;i<ISP_LIST.length;i++) {
    var isp = ISP_LIST[i];
    for (var k=0;k<isp.prefixes.length;k++) {
      var pref = isp.prefixes[k].toLowerCase().replace(/:+$/,'');
      // نعتبر match لو الfull يبدأ بالبادئة
      if (full.indexOf(pref) === 0) {
        return isp.name;
      }
    }
  }
  return null;
}

// اختيار أفضل ISP أردني (Sticky)
// الفكرة: لو اللعبة عم تتصل بسيرفرات من أكثر من مزود أردني، إحنا منثبّت واحد لفترة
// حتى ما يبين اتصالك كل لحظة يبدل core ISP.
function pickBestISP(currentISP) {
  var now = (new Date()).getTime();
  var slot = CACHE.bestISP;

  // لو أصلاً فيه ISP مثبت ولسا عمره أقل من TTL، خليك عليه
  if (slot.name && (now - slot.t) < ISP_STICKY_TTL_MS) {
    return slot.name;
  }

  // ما في sticky أو خلص وقته → ثبت اللي شايفه الآن
  if (currentISP) {
    CACHE.bestISP = { name: currentISP, t: now };
    return currentISP;
  }

  // ما في ISP معروف بهالاتصال؟ خليه null (رح ينحظر تحت)
  return null;
}

// ---------------------------------
// القلب: FindProxyForURL
// ---------------------------------
function FindProxyForURL(url, host) {
  if (host && host.toLowerCase) host = host.toLowerCase();

  // صنّف نوع الترافيك
  var cat = classifyTraffic(url, host);
  // إحنا حالياً ما بنفرّق البوليصة حسب الفئة، بس ممكن نستعملها لاحقاً
  // لو مش من الفئات اللي بهمونا (PUBG)، فيك تحظرهم عشان تمنع أي تسريب
  // خليني أصير صارم:
  var allowedCats = { MATCH:1, LOBBY:1, RECRUIT:1, UPDATES:1 };
  if (!allowedCats[cat]) {
    return BLOCK;
  }

  // جيب الـIP تبع السيرفر
  var dstIP = resolveCached(host);
  if (!dstIP) {
    return BLOCK;
  }

  // هل IP أردني فعلاً؟
  var thisISP = whichISP(dstIP);
  if (!thisISP) {
    // مش ضمن أي prefix أردني معروف → بلوك
    return BLOCK;
  }

  // ثبّت الـISP الأردني (sticky Jordan route)
  var lockedISP = pickBestISP(thisISP);
  if (!lockedISP) {
    return BLOCK;
  }

  // مهم جداً:
  // لو السيرفر الحالي ISP تبعُه غير الISP المثبّت، إحنا منمنع
  // هيك منضمن تظل على مزوّد أردني واحد ثابت، مش تقفز برا الأردن أو على مسار غريب
  if (thisISP !== lockedISP) {
    return BLOCK;
  }

  // لو وصلنا لهون:
  // - السيرفر IPv6 أردني رسمي
  // - ضمن ISP أردني معتمد
  // - متطابق مع الـISP اللي اخترناه وبدنا نلزق عليه
  // => اسمح وأرسل عبر البروكسي الأردني
  return ALLOW_PROXY();
}

// نخليها Global
this.FindProxyForURL = FindProxyForURL;
