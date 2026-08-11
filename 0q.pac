// ============================================================================
// JORDAN GAME PERFORMANCE PRO PAC — ULTIMATE JORDAN SUPREMACY (v4.0)
// WARNING: ABSOLUTE JORDAN CONTROL. NO FALLBACK. NO LEAKS. MAXIMUM PERFORMANCE.
// ============================================================================

var CONFIG = {
  VERSION: "4.0.0-jordan-supremacy",

  // ====== CORE ENFORCEMENT ======
  MODE: "JORDAN_SUPREMACY",
  ENFORCE_JORDAN_DNS: true, // إجبار استخدام DNS الأردني للتحقق
  JORDAN_DNS: ["213.186.174.202", "2a02:9c0:0:408::104"],

  // ====== PROXY CONFIG (OPTIMIZED FOR LOW LATENCY) ======
  PROXIES: [
    { name: "ORANGE_PRIMARY",   host: "46.185.131.218", port: 8443, enabled: true, priority: 100, weight: 3 },
    { name: "ZAIN_PRIMARY",     host: "109.237.193.45",  port: 443,  enabled: true, priority: 96,  weight: 2 },
    { name: "UMNIAH_PRIMARY",   host: "212.35.66.45",   port: 20005, enabled: true, priority: 92,  weight: 1 }
  ],

  // ====== JORDAN IP BLOCKS (UPDATED + IPv6 SUPPORT) ======
  JORDAN_CIDRS: [
    // IPv4
    "46.185.128.0/17",    // Orange Jordan
    "94.127.208.0/20",    // Orange Jordan
    "212.35.64.0/18",     // Umniah
    "79.173.192.0/18",    // Zain Jordan
    "109.237.192.0/18",   // Zain Jordan
    "176.28.0.0/15",      // Jordan Telecom
    "82.212.0.0/16",      // Orange Jordan
    "188.119.64.0/18",    // Zain Additional
    "213.186.174.0/24",   // Your DNS Server
    // IPv6
    "2a02:9c0::/32"       // Umniah IPv6 Block
  ],

  // ====== DOMAINS THAT MUST GO DIRECT (NO PROXY) ======
  ALWAYS_DIRECT_DOMAINS: [
    "apple.com", "icloud.com", "google.com", "gstatic.com", "googleapis.com",
    "youtube.com", "ytimg.com", "facebook.com", "fbcdn.net", "instagram.com",
    "whatsapp.com", "telegram.org", "twitter.com", "x.com", "tiktok.com",
    "microsoft.com", "windowsupdate.com", "office.com", "live.com",
    "netflix.com", "spotify.com", "cloudflare.com", "amazon.com", "aws.amazon.com",
    "akamaihd.net", "akamaized.net", "fastly.net", "steamcontent.com", "steamstatic.com",
    "github.com", "gitlab.com", "stackoverflow.com" // إضافة مواقع تقنية شائعة
  ],

  DIRECT_URL_PATTERNS: [
    "*://*.download.windowsupdate.com/*",
    "*://*.windowsupdate.com/*",
    "*://*.apple.com/*",
    "*://*.icloud.com/*",
    "*://*.akamaized.net/*",
    "*://*.steamcontent.com/*",
    "*://*.steamstatic.com/*",
    "*://*.fastly.net/*",
    "*://*.apple-dns.net/*",
    "*://*.github.io/*"
  ],

  // ====== PUBG & ALL MODS DOMAINS (COMPREHENSIVE LIST) ======
  GAME_DOMAINS: [
    // Official PUBG Mobile & Tencent
    "pubgmobile.com", "igamecj.com", "proximabeta.com", "levelinfinite.com",
    "tencentgames.com", "tencent.com", "battlegroundsmobileindia.com",
    "krafton.com", "bluehole.net", "pubg.com", "pubg.net",

    // Payment & Auth (Critical)
    "qq.com", "midasbuy.com", "unipay.com", "tpns.tencent.com",
    "passport.com", "account.levelinfinite.com", "igame.igamecj.com",

    // Common Mod Domains (ReX, Magic, etc.)
    "rexmods.com", "magicmods.net", "pubgmods.org", "modpubg.com",
    "gameguardian.net", "ggapp.co", "pubgmodapk.com", "moddroid.com",
    "apkmirror.com", "uptodown.com", "apkcombo.com", "apkpure.com",
    "modyolo.com", "androeed.com", "an1.com", "happymod.com",

    // Game Update & CDN
    "dl.google.com", "update.googleapis.com", "play.googleapis.com",
    "gvt1.com", "gvt2.com", "gvt3.com"
  ],

  // ====== LOW LATENCY DOMAINS (PRIORITIZED) ======
  CUSTOM_LOW_LATENCY_DOMAINS: [
    "pubgmobile.com", "igamecj.com", "proximabeta.com", "levelinfinite.com"
  ]
};

// ====== ADVANCED UTILITY FUNCTIONS ======
function toLowerSafe(s) { return s ? String(s).toLowerCase() : ""; }

function isIPv4(ip) {
  if (!ip || ip.indexOf(":") !== -1) return false;
  var p = ip.split(".");
  if (p.length !== 4) return false;
  for (var i = 0; i < 4; i++) {
    if (!/^\d+$/.test(p[i])) return false;
    var n = parseInt(p[i], 10);
    if (isNaN(n) || n < 0 || n > 255) return false;
  }
  return true;
}

function isIPv6(ip) {
  return /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(ip);
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
  if (isIPv4(ip)) {
    var parts = cidr.split("/");
    if (parts.length !== 2 || !isIPv4(parts[0])) return false;
    var net = ipv4ToLong(parts[0]);
    var bits = parseInt(parts[1], 10);
    var mask = cidrMask(bits);
    return (ipv4ToLong(ip) & mask) === (net & mask);
  }
  // TODO: Add IPv6 CIDR support if needed
  return false;
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

function domainMatch(host, suffix) {
  return dnsDomainIs(host, suffix) || shExpMatch(host, "*." + suffix);
}

function listMatch(host, list) {
  for (var i = 0; i < list.length; i++) {
    if (domainMatch(host, list[i])) return true;
  }
  return false;
}

function patternMatch(url, patterns) {
  for (var i = 0; i < patterns.length; i++) {
    if (shExpMatch(url, patterns[i])) return true;
  }
  return false;
}

// ====== JORDAN DNS ENFORCEMENT ======
function resolveWithJordanDNS(host) {
  if (!CONFIG.ENFORCE_JORDAN_DNS) return dnsResolve(host);
  
  // Simulate DNS resolution with Jordan DNS (PAC has no native DNS override)
  // In practice, this relies on system DNS being set to Jordan DNS
  var ip = dnsResolve(host);
  if (ip && (isJordanIp(ip) || isIPv6(ip))) return ip;
  return null;
}

// ====== PROXY SELECTION ALGORITHM ======
function selectBestJordanProxy() {
  var available = [];
  for (var i = 0; i < CONFIG.PROXIES.length; i++) {
    var p = CONFIG.PROXIES[i];
    if (!p.enabled) continue;
    
    // Verify proxy IP is Jordan-based
    if (isJordanIp(p.host)) {
      available.push({
        host: p.host,
        port: p.port,
        priority: p.priority || 0,
        weight: p.weight || 1
      });
    }
  }
  
  if (available.length === 0) return null;
  
  // Sort by priority (descending), then by weight (descending)
  available.sort(function(a, b) {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return b.weight - a.weight;
  });
  
  // Return highest priority proxy
  return "PROXY " + available[0].host + ":" + available[0].port;
}

// ====== CLASSIFICATION ENGINE ======
function classify(url, host) {
  host = toLowerSafe(host);

  // 1. Bypass local/private IPs
  if (isIPv4(host) && isPrivateIp(host)) return "DIRECT";
  if (isResolvable(host)) {
    var ip = resolveWithJordanDNS(host);
    if (ip && isIPv4(ip) && isPrivateIp(ip)) return "DIRECT";
  }

  // 2. Always-direct domains (updates, social media, etc.)
  if (listMatch(host, CONFIG.ALWAYS_DIRECT_DOMAINS)) return "DIRECT";
  if (patternMatch(url, CONFIG.DIRECT_URL_PATTERNS)) return "DIRECT";

  // 3. Game traffic → MUST go through Jordan proxy
  if (
    listMatch(host, CONFIG.CUSTOM_LOW_LATENCY_DOMAINS) ||
    listMatch(host, CONFIG.GAME_DOMAINS)
  ) {
    return "JORDAN_SUPREMACY_GAME";
  }

  return "DIRECT";
}

// ====== MAIN PAC FUNCTION ======
function FindProxyForURL(url, host) {
  var cls = classify(url || "", host);
  
  if (cls === "JORDAN_SUPREMACY_GAME") {
    var proxy = selectBestJordanProxy();
    if (proxy) return proxy;
    
    // ABSOLUTELY NO DIRECT FALLBACK
    // Force failure to prevent leaks
    return "PROXY 0.0.0.0:1"; // Invalid proxy = connection blocked
  }
  
  return "DIRECT";
}
