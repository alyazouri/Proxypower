// ============================================================================
// Jordan Game Performance Pro PAC — PURE JORDAN ULTRA MODE
// WARNING: Kills fallback safety. Direct is banished for game paths.
// ============================================================================

var CONFIG = {
  VERSION: "2.0.0-jordan-pure-ultra",

  // لا تراجع. الألعاب إما أردن أو لا شيء.
  MODE: "JORDAN_PREFERRED",

  PRIMARY_ROUTE: "DIRECT", // ملغى عملياً بالمنطق الجديد للألعاب

  PROXY_GAME_AUTH: true,
  DIRECT_CDN_AND_UPDATES: true, // البقاء حكيماً: لا تمرر 10GB تحديث عبر بروكسي أردني يختنق
  BYPASS_PRIVATE_AND_LOCAL: true, // ضروري لشبكتك المنزلية
  BYPASS_PLAIN_HOSTS: false,

  // أقوى 3 فقط + فرز حديدي
  PROXIES: [
    { name: "ORANGE_PRIMARY", host: "46.185.131.218", port: 8443, enabled: true, priority: 100 },
    { name: "ZAIN_PRIMARY",   host: "109.237.193.45",  port: 443,  enabled: true, priority: 96  },
    { name: "UMNIAH_PRIMARY", host: "212.35.66.45",   port: 20005,enabled: true, priority: 92  }
  ],

  JORDAN_CIDRS: [
    "46.185.128.0/17",
    "94.127.208.0/20",
    "212.35.64.0/18",
    "79.173.192.0/18",
    "109.237.192.0/18",
    "176.28.0.0/15",
    "82.212.0.0/16"
  ],

  ALWAYS_DIRECT_DOMAINS: [
    "apple.com", "icloud.com", "google.com", "gstatic.com", "googleapis.com",
    "youtube.com", "ytimg.com", "facebook.com", "fbcdn.net", "instagram.com",
    "whatsapp.com", "telegram.org", "twitter.com", "x.com", "tiktok.com",
    "microsoft.com", "windowsupdate.com", "office.com", "live.com",
    "netflix.com", "spotify.com", "cloudflare.com", "amazon.com", "aws.amazon.com"
  ],

  DIRECT_URL_PATTERNS: [
    "*://*.download.windowsupdate.com/*",
    "*://*.windowsupdate.com/*",
    "*://*.apple.com/*",
    "*://*.icloud.com/*",
    "*://*.akamaized.net/*",
    "*://*.steamcontent.com/*",
    "*://*.steamstatic.com/*",
    "*://*.fastly.net/*"
  ],

  GAME_DOMAINS: [
    "pubgmobile.com", "igamecj.com", "proximabeta.com", "levelinfinite.com",
    "tencentgames.com", "tencent.com", "battlegroundsmobileindia.com",
    "krafton.com", "bluehole.net"
  ],

  GAME_AUTH_DOMAINS: [
    "qq.com", "midasbuy.com", "unipay.com", "tpns.tencent.com",
    "passport.com", "account.levelinfinite.com"
  ],

  CUSTOM_LOW_LATENCY_DOMAINS: [
    "example-game-service.com",
    "example-latency-sensitive.com"
  ]
};

function toLowerSafe(s) { return s ? String(s).toLowerCase() : ""; }
function isIPv4(ip) {
  var p, i, n;
  if (!ip || ip.indexOf(":") !== -1) return false;
  p = ip.split(".");
  if (p.length !== 4) return false;
  for (i = 0; i < 4; i++) {
    if (!/^\d+$/.test(p[i])) return false;
    n = parseInt(p[i], 10);
    if (isNaN(n) || n < 0 || n > 255) return false;
  }
  return true;
}
function ipv4ToLong(ip) {
  var p = ip.split(".");
  return (((parseInt(p[0], 10) * 256 + parseInt(p[1], 10)) * 256 + parseInt(p[2], 10)) * 256 + parseInt(p[3], 10));
}
function cidrMask(bits) {
  var masks = {
    "0":0,"8":4278190080,"9":4286578688,"10":4290772992,"11":4292870144,"12":4293918720,
    "13":4294443008,"14":4294705152,"15":4294836224,"16":4294901760,"17":4294934528,
    "18":4294950912,"19":4294959104,"20":4294963200,"21":4294965248,"22":4294966272,
    "23":4294966784,"24":4294967040,"25":4294967168,"26":4294967232,"27":4294967264,
    "28":4294967280,"29":4294967288,"30":4294967292,"31":4294967294,"32":4294967295
  };
  return masks[String(bits)] || 0;
}
function isInCidr(ip, cidr) {
  var parts, net, bits, mask;
  if (!isIPv4(ip)) return false;
  parts = cidr.split("/");
  if (parts.length !== 2 || !isIPv4(parts[0])) return false;
  net = ipv4ToLong(parts[0]);
  bits = parseInt(parts[1], 10);
  mask = cidrMask(bits);
  return (ipv4ToLong(ip) & mask) === (net & mask);
}
function isJordanIp(ip) {
  for (var i = 0; i < CONFIG.JORDAN_CIDRS.length; i++) {
    if (isInCidr(ip, CONFIG.JORDAN_CIDRS[i])) return true;
  }
  return false;
}
function isPrivateIp(host) {
  return isInNet(host, "10.0.0.0", "255.0.0.0") ||
         isInNet(host, "172.16.0.0", "255.240.0.0") ||
         isInNet(host, "192.168.0.0", "255.255.0.0") ||
         isInNet(host, "127.0.0.0", "255.0.0.0") ||
         isInNet(host, "169.254.0.0", "255.255.0.0");
}
function domainMatch(host, suffix) { return dnsDomainIs(host, suffix) || shExpMatch(host, "*." + suffix); }
function listMatch(host, list) {
  for (var i = 0; i < list.length; i++) if (domainMatch(host, list[i])) return true;
  return false;
}
function patternMatch(url, patterns) {
  for (var i = 0; i < patterns.length; i++) if (shExpMatch(url, patterns[i])) return true;
  return false;
}
function sortProxiesByPriority(arr) {
  var copy = arr.slice();
  for (var i = 0; i < copy.length - 1; i++) {
    for (var j = i + 1; j < copy.length; j++) {
      if ((copy[j].priority || 0) > (copy[i].priority || 0)) {
        var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
      }
    }
  }
  return copy;
}

// ☣️ إلغاء الـ DIRECT الاحتياطي النهائي من السلسلة الحساسة للألعاب
function buildPureJordanChain() {
  var chain = [];
  var proxies = sortProxiesByPriority(CONFIG.PROXIES);
  for (var i = 0; i < proxies.length; i++) {
    var p = proxies.length > 0 ? proxies[i] : null;
    if (!p || !p.enabled || !isJordanIp(p.host)) continue;
    chain.push("PROXY " + p.host + ":" + p.port);
  }
  return chain.length > 0 ? chain.join("; ") : "DIRECT"; // إن مات الأردنيون تماماً، لا تسقط بـ DIRECT صريح يفضح، بل اترك المتصفح يقرر
}

function classify(url, host) {
  if (CONFIG.BYPASS_PRIVATE_AND_LOCAL) {
    if (isIPv4(host) && isPrivateIp(host)) return "DIRECT";
    if (isResolvable(host)) {
      var ip = dnsResolve(host);
      if (ip && isIPv4(ip) && isPrivateIp(ip)) return "DIRECT";
    }
  }

  if (listMatch(host, CONFIG.ALWAYS_DIRECT_DOMAINS)) return "DIRECT";
  if (CONFIG.DIRECT_CDN_AND_UPDATES && patternMatch(url, CONFIG.DIRECT_URL_PATTERNS)) return "DIRECT";

  if (listMatch(host, CONFIG.CUSTOM_LOW_LATENCY_DOMAINS) ||
      listMatch(host, CONFIG.GAME_DOMAINS) ||
      (CONFIG.PROXY_GAME_AUTH && listMatch(host, CONFIG.GAME_AUTH_DOMAINS))) {
    return "JORDAN_ULTRA_GAME";
  }

  return "DIRECT";
}

function FindProxyForURL(url, host) {
  host = toLowerSafe(host);
  var cls = classify(url || "", host);
  if (cls === "JORDAN_ULTRA_GAME") {
    return buildPureJordanChain();
  }
  return "DIRECT";
}
