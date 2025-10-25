// PAC ذكي: يختار أسرع بوابة أردنية تلقائياً عبر قياس dnsResolve (iOS friendly).
// - LOBBY → 2a03:6b00::/29 (Zain)
// - MATCH → 2a03:b640::/32 (Umniah/Orbitel)
// - البروكسي الافتراضي (احتياطي): 91.106.109.12
// - لكل فئة بورت ثابت (LOBBY=443, MATCH=20001)
// ملاحظة: لإضافة بوابات أردنية أكثر، اضفها إلى PROXY_CANDIDATES (يمكن أن تكون أسماء أو عناوين IP).

var PROXY_CANDIDATES = [
  // يمكن إضافة المزيد مثل "proxy2.example.jo" أو "91.106.109.13"
  "91.106.109.12"
];

// بورت لكل فئة
var FIXED_PORT = {
  LOBBY: 443,
  MATCH: 20001,
  RECRUIT_SEARCH: 443,
  UPDATES: 80,
  CDN: 80
};

// التهيئة: وقت صلاحية الاختيار الأسرع (ms)
var PROXY_STICKY_TTL_MS = 60 * 1000; // 60 ثانية (عدل إذا تحب أطول: 5*60*1000 = 5 دقائق)

// dnsResolve cache TTL عند التحقق من الوجهة
var DST_RESOLVE_TTL_MS = 15 * 1000; // 15s

// الكاش العام داخل سياق PAC
var root = (typeof globalThis !== "undefined" ? globalThis : this);
if (!root._PAC_SMART_CACHE) root._PAC_SMART_CACHE = {};
var CACHE = root._PAC_SMART_CACHE;
if (!CACHE.dnsResCache) CACHE.dnsResCache = {};
if (!CACHE.proxyPick) CACHE.proxyPick = {host: null, t: 0, latency: Infinity};

// دومينات وباترنات ببجي (كما سبق)
var PUBG_DOMAINS = {
  LOBBY: ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH: ["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES: ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN: ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};

var URL_PATTERNS = {
  LOBBY: ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH: ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES: ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN: ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

// بادئات IPv6 لكل فئة
var JO_V6_PREFIXES_PER_CAT = {
  LOBBY: ["2a03:6b00"],
  MATCH: ["2a03:b640"],
  RECRUIT_SEARCH: ["2a03:6b00"],
  UPDATES: ["2a03:6b00"],
  CDN: ["2a03:6b00"]
};

// وظيفة مساعدة: shExpMatch variant + suffix check
function hostMatches(h, patterns) {
  if (!h) return false;
  h = h.toLowerCase();
  for (var i=0;i<patterns.length;i++) {
    var p = patterns[i];
    if (shExpMatch(h, p)) return true;
    if (p.indexOf("*.")===0) {
      var suf = p.substring(1);
      if (h.length >= suf.length && h.substring(h.length-suf.length) === suf) return true;
    }
  }
  return false;
}

// dnsResolve مع كاش بسيط
function resolveDstCached(h, ttl) {
  if (!h) return "";
  var now = (new Date()).getTime();
  var c = CACHE.dnsResCache[h];
  if (c && (now - c.t) < ttl) return c.ip;
  var ip = "";
  try {
    ip = dnsResolve(h) || "";
  } catch(e) {
    ip = "";
  }
  CACHE.dnsResCache[h] = {ip: ip, t: now};
  return ip;
}

// expand IPv6 '::' تقريبياً لتحليل أول مقطعين (تكتيك بسيط)
function normalizeIPv6(ip) {
  if (!ip) return "";
  if (ip.indexOf('::') === -1) return ip;
  var parts = ip.split(':');
  // تعويض :: بصف من الأصفار للوصول إلى 8 مجموعات
  var left = [], right = [];
  var sepFound = false;
  for (var i=0;i<parts.length;i++) {
    if (parts[i]==='') { sepFound = true; continue; }
    if (!sepFound) left.push(parts[i]); else right.push(parts[i]);
  }
  var missing = 8 - (left.length + right.length);
  var zeros = [];
  for (var j=0;j<missing;j++) zeros.push('0');
  var combined = left.concat(zeros).concat(right);
  return combined.join(':');
}

// تحقق ما إذا كان الـIPv6 يبدأ بالبادئة المطلوبة
function ipMatchesCategoryPrefixes(ip, cat) {
  if (!ip) return false;
  if (ip.indexOf(':') === -1) return false;
  var ipn = normalizeIPv6(ip.toLowerCase());
  var parts = ipn.split(':');
  if (parts.length < 2) return false;
  var firstSeg = parseInt(parts[0], 16);
  var secondSeg = parseInt(parts[1], 16);
  var prefs = JO_V6_PREFIXES_PER_CAT[cat];
  if (!prefs) return false;
  for (var i=0;i<prefs.length;i++) {
    var pref = prefs[i].toLowerCase().replace(/:+$/,'');
    // مطابقة مباشرة أو pref::
    if (ip.toLowerCase() === pref) return true;
    if (ip.toLowerCase().indexOf(pref + '::') === 0) return true;
    if (ip.toLowerCase().indexOf(pref + ':') === 0) return true;
    // بديل: تحقق ثنائي بتفسير ثنائي بسيط:
    var prefParts = pref.split(':');
    var p0 = parseInt(prefParts[0],16);
    var p1 = prefParts.length>1? parseInt(prefParts[1],16) : null;
    if (p0 === firstSeg && (p1===null || p1 === secondSeg)) return true;
  }
  return false;
}

// قياس وقت dnsResolve لاسم البروكسي (ms). لو كانت القيمة IP literal نرجع 1ms (قيمة منخفضة).
function measureDnsLatency(host) {
  var now = (new Date()).getTime();
  // لو هو IP literal (IPv4/IPv6) → اعتبره فوري تقريباً
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.indexOf(':') !== -1) {
    return 1;
  }
  // تجنب استدعاء متكرر جداً لنفس الاسم (cache داخلي)
  try {
    var start = (new Date()).getTime();
    var r = dnsResolve(host);
    var delta = (new Date()).getTime() - start;
    if (!r) return 10000; // unresolved -> كبير
    return delta>0? delta : 1;
  } catch(e) {
    return 10000;
  }
}

// اختيار أسرع بروكسي (مع Sticky cache)
function pickBestProxy() {
  var now = (new Date()).getTime();
  var slot = CACHE.proxyPick;
  if (slot.host && (now - slot.t) < PROXY_STICKY_TTL_MS) {
    return slot.host; // reuse sticky
  }
  // نفحص كل المرشحين
  var best = null;
  var bestLatency = Infinity;
  for (var i=0;i<PROXY_CANDIDATES.length;i++) {
    var candidate = PROXY_CANDIDATES[i];
    var lat = measureDnsLatency(candidate);
    if (lat < bestLatency) {
      bestLatency = lat;
      best = candidate;
    }
  }
  if (!best) best = PROXY_CANDIDATES[0]; // fallback
  CACHE.proxyPick = {host: best, t: now, latency: bestLatency};
  return best;
}

// بناء استجابة البروكسي حسب الفئة
function proxyForCategory(cat) {
  var proxyHost = pickBestProxy();
  var port = FIXED_PORT[cat] || 443;
  return "PROXY " + proxyHost + ":" + port;
}

// دالة مساعدة للـURL pattern
function urlMatches(url, patterns) {
  if (!url) return false;
  for (var i=0;i<patterns.length;i++) if (shExpMatch(url, patterns[i])) return true;
  return false;
}

// دالة مساعدة للـhost pattern
function hostMatchesPatterns(h, patterns) {
  if (!h) return false;
  h = h.toLowerCase();
  for (var i=0;i<patterns.length;i++) {
    var p = patterns[i];
    if (shExpMatch(h, p)) return true;
    if (p.indexOf("*.")===0) {
      var suf = p.substring(1);
      if (h.length >= suf.length && h.substring(h.length-suf.length) === suf) return true;
    }
  }
  return false;
}

// القرار الرئيسي
function FindProxyForURL(url, host) {
  if (host && host.toLowerCase) host = host.toLowerCase();

  // منع IPv4 فورياً
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return "PROXY 0.0.0.0:0";

  // URL patterns أولاً (قصر الشرط)
  if (urlMatches(url, URL_PATTERNS.MATCH) || hostMatchesPatterns(host, PUBG_DOMAINS.MATCH)) {
    var ip = resolveDstCached(host, DST_RESOLVE_TTL_MS);
    if (!ip) return "PROXY 0.0.0.0:0";
    if (!ipMatchesCategoryPrefixes(ip, "MATCH")) return "PROXY 0.0.0.0:0";
    return proxyForCategory("MATCH");
  }

  if (urlMatches(url, URL_PATTERNS.LOBBY) || hostMatchesPatterns(host, PUBG_DOMAINS.LOBBY)) {
    var ip2 = resolveDstCached(host, DST_RESOLVE_TTL_MS);
    if (!ip2) return "PROXY 0.0.0.0:0";
    if (!ipMatchesCategoryPrefixes(ip2, "LOBBY")) return "PROXY 0.0.0.0:0";
    return proxyForCategory("LOBBY");
  }

  if (urlMatches(url, URL_PATTERNS.RECRUIT_SEARCH) || hostMatchesPatterns(host, PUBG_DOMAINS.RECRUIT_SEARCH)) {
    var ip3 = resolveDstCached(host, DST_RESOLVE_TTL_MS);
    if (!ip3) return "PROXY 0.0.0.0:0";
    if (!ipMatchesCategoryPrefixes(ip3, "RECRUIT_SEARCH")) return "PROXY 0.0.0.0:0";
    return proxyForCategory("RECRUIT_SEARCH");
  }

  if (urlMatches(url, URL_PATTERNS.UPDATES) || hostMatchesPatterns(host, PUBG_DOMAINS.UPDATES)) {
    var ip4 = resolveDstCached(host, DST_RESOLVE_TTL_MS);
    if (!ip4) return "PROXY 0.0.0.0:0";
    if (!ipMatchesCategoryPrefixes(ip4, "UPDATES")) return "PROXY 0.0.0.0:0";
    return proxyForCategory("UPDATES");
  }

  if (urlMatches(url, URL_PATTERNS.CDN) || hostMatchesPatterns(host, PUBG_DOMAINS.CDN)) {
    var ip5 = resolveDstCached(host, DST_RESOLVE_TTL_MS);
    if (!ip5) return "PROXY 0.0.0.0:0";
    if (!ipMatchesCategoryPrefixes(ip5, "CDN")) return "PROXY 0.0.0.0:0";
    return proxyForCategory("CDN");
  }

  // فحص مباشر للـhost لو كان IPv6 literal
  var direct = host;
  if (direct.indexOf(':') === -1) direct = resolveDstCached(host, DST_RESOLVE_TTL_MS);
  if (ipMatchesCategoryPrefixes(direct, "MATCH")) return proxyForCategory("MATCH");
  if (ipMatchesCategoryPrefixes(direct, "LOBBY")) return proxyForCategory("LOBBY");

  // باقي الاتصالات → بلوك صارم
  return "PROXY 0.0.0.0:0";
}
