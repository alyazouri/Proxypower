// ============================================================================
// Jordan Game Performance Pro PAC
// Version: 3.0.0-JORDAN-BEAST-MODE (PURE JORDAN ONLY)
// Purpose: Aggressive Jordan Routing for Instant Matchmaking & Recruitment.
// ============================================================================

var CONFIG = {
  VERSION: "3.0.0-jordan-beast-mode",

  // "JORDAN_PREFERRED" => FORCE pure Jordan proxy chain for all game/matchmaking traffic.
  MODE: "JORDAN_PREFERRED",

  // The ultimate primary route (Orange Jordan High-Speed).
  PRIMARY_ROUTE: "PROXY 46.185.131.218:8443",

  // Game auth/session MUST go through Jordan proxy to lock geo-location.
  PROXY_GAME_AUTH: true,

  // Keep heavy downloads direct to prevent proxy congestion (keeps ping stable!).
  DIRECT_CDN_AND_UPDATES: true,

  // Bypass local configurations.
  BYPASS_PRIVATE_AND_LOCAL: true,
  BYPASS_PLAIN_HOSTS: true,

  // Top tier Jordan routes, optimized for gaming (Orange & Zain first).
  PROXIES: [
    { name: "ORANGE_PRIMARY", host: "46.185.131.218", port: 8443, enabled: true, priority: 100 },
    { name: "ZAIN_PRIMARY", host: "109.237.193.45", port: 443, enabled: true, priority: 98 },
    { name: "UMNIAH_PRIMARY", host: "212.35.66.45", port: 20005, enabled: true, priority: 90 },
    { name: "ORANGE_BACKUP", host: "46.185.139.47", port: 443, enabled: true, priority: 85 },
    { name: "ZAIN_BACKUP", host: "79.173.240.10", port: 8080, enabled: true, priority: 80 },
    { name: "UMNIAH_BACKUP", host: "82.212.77.242", port: 3128, enabled: true, priority: 70 }
  ],

  // Jordan IP ranges validator.
  JORDAN_CIDRS: [
    "46.185.128.0/17",
    "94.127.208.0/20",
    "212.35.64.0/18",
    "79.173.192.0/18",
    "109.237.192.0/18",
    "176.28.0.0/15",
    "82.212.0.0/16"
  ],

  // General non-gaming apps (Direct for speed).
  ALWAYS_DIRECT_DOMAINS: [
    "apple.com",
    "icloud.com",
    "google.com",
    "gstatic.com",
    "googleapis.com",
    "youtube.com",
    "ytimg.com",
    "facebook.com",
    "fbcdn.net",
    "instagram.com",
    "whatsapp.com",
    "telegram.org",
    "twitter.com",
    "x.com",
    "tiktok.com",
    "microsoft.com",
    "windowsupdate.com",
    "office.com",
    "live.com",
    "netflix.com",
    "spotify.com",
    "cloudflare.com",
    "amazon.com",
    "aws.amazon.com"
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

  // MATCHMAKING & RECRUITMENT DOMAINS (FORCED TO JORDAN PROXY)
  GAME_DOMAINS: [
    // Tencent Matchmaking & Core
    "pubgmobile.com",
    "igamecj.com",
    "proximabeta.com",
    "levelinfinite.com",
    "tencentgames.com",
    "tencent.com",
    "intlgame.com",         // crucial for global lobby / recruitment
    "gcloudsdk.com",        // matchmaking voice & team discovery
    "wetest.net",           // latency testing / ping matching
    "tgpa.qq.com",
    
    // Regional & Krafton
    "battlegroundsmobileindia.com",
    "krafton.com",
    "bluehole.net",
    
    // Wildcard matching keywords for lobbies
    "*matchmaker*",
    "*lobby*",
    "*recruitment*"
  ],

  // AUTH & SESSION (Forces Jordan IP Geolocation immediately upon login)
  GAME_AUTH_DOMAINS: [
    "qq.com",
    "midasbuy.com",
    "unipay.com",
    "tpns.tencent.com",
    "passport.com",
    "account.levelinfinite.com"
  ],

  CUSTOM_LOW_LATENCY_DOMAINS: [
    "gcloudvoice.com",      // In-game voice server for fast coordination
    "vivox.com"             // Positional voice chat
  ]
};

function toLowerSafe(s) {
  return s ? String(s).toLowerCase() : "";
}

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
    "0": 0, "8": 4278190080, "9": 4286578688, "10": 4290772992,
    "11": 4292870144, "12": 4293918720, "13": 4294443008, "14": 4294705152,
    "15": 4294836224, "16": 4294901760, "17": 4294934528, "18": 4294950912,
    "19": 4294959104, "20": 4294963200, "21": 4294965248, "22": 4294966272,
    "23": 4294966784, "24": 4294967040, "25": 4294967168, "26": 4294967232,
    "27": 4294967264, "28": 4294967280, "29": 4294967288, "30": 4294967292,
    "31": 4294967294, "32": 4294967295
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
  var i;
  if (!isIPv4(ip)) return false;
  for (i = 0; i < CONFIG.JORDAN_CIDRS.length; i++) {
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
  return dnsDomainIs(host, suffix) || shExpMatch(host, "*." + suffix) || shExpMatch(host, suffix);
}

function listMatch(host, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (domainMatch(host, list[i])) return true;
  }
  return false;
}

function patternMatch(url, patterns) {
  var i;
  for (i = 0; i < patterns.length; i++) {
    if (shExpMatch(url, patterns[i])) return true;
  }
  return false;
}

function sortProxiesByPriority(arr) {
  var i, j, tmp;
  var copy = [];
  for (i = 0; i < arr.length; i++) copy.push(arr[i]);
  for (i = 0; i < copy.length - 1; i++) {
    for (j = i + 1; j < copy.length; j++) {
      if ((copy[j].priority || 0) > (copy[i].priority || 0)) {
        tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
      }
    }
  }
  return copy;
}

// Generates the strict Jordan route chain with NO immediate direct fallback.
function buildJordanChain() {
  var chain = [];
  var proxies = sortProxiesByPriority(CONFIG.PROXIES);
  var i, p;

  for (i = 0; i < proxies.length; i++) {
    p = proxies[i];
    if (!p.enabled) continue;
    if (!isJordanIp(p.host)) continue;
    chain.push("PROXY " + p.host + ":" + p.port);
  }

  // We keep DIRECT as a absolute final failsafe so your connection doesn't drop completely if servers go down.
  chain.push("DIRECT");
  return chain.join("; ");
}

function getSelectedGameRoute() {
  // Overruled CONFIG.MODE to force Jordan Preferred.
  return buildJordanChain();
}

function classify(url, host) {
  if (CONFIG.BYPASS_PLAIN_HOSTS && isPlainHostName(host)) return "DIRECT";

  if (CONFIG.BYPASS_PRIVATE_AND_LOCAL) {
    if (isIPv4(host) && isPrivateIp(host)) return "DIRECT";
    if (isResolvable(host)) {
      var ip = dnsResolve(host);
      if (ip && isIPv4(ip) && isPrivateIp(ip)) return "DIRECT";
    }
  }

  // Check game domains FIRST to give them maximum routing priority
  if (listMatch(host, CONFIG.GAME_DOMAINS)) return "GAME";
  if (CONFIG.PROXY_GAME_AUTH && listMatch(host, CONFIG.GAME_AUTH_DOMAINS)) return "AUTH";
  if (listMatch(host, CONFIG.CUSTOM_LOW_LATENCY_DOMAINS)) return "GAME";
  
  // Downloads and web traffic stay DIRECT to preserve proxy bandwidth for low-latency gaming
  if (listMatch(host, CONFIG.ALWAYS_DIRECT_DOMAINS)) return "DIRECT";
  if (CONFIG.DIRECT_CDN_AND_UPDATES && patternMatch(url, CONFIG.DIRECT_URL_PATTERNS)) return "DIRECT";
  
  return "DIRECT"; // Default other traffic to direct
}

function routeForClass(cls) {
  if (cls === "GAME" || cls === "AUTH") return getSelectedGameRoute();
  return "DIRECT";
}

function FindProxyForURL(url, host) {
  host = toLowerSafe(host);
  url = url || "";
  return routeForClass(classify(url, host));
}
