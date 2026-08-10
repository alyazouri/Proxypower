// ============================================================================
// Jordan Game Performance Pro PAC
// Version: 2.0.0
// Purpose: performance-focused routing for latency-sensitive game traffic.
// Notes:
// - This PAC improves route selection structure and stability logic.
// - It does NOT force matchmaking, recruitment visibility, or region bypass.
// - Edit the CONFIG section only.
// ============================================================================

var CONFIG = {
  VERSION: "2.0.0-jordan-performance-pro",

  // Route mode:
  //   "DIRECT_ONLY"        => everything direct except explicit proxy rules
  //   "JORDAN_PREFERRED"   => use Jordan proxy chain for game domains
  //   "MEASURED_PRIMARY"   => use PRIMARY_ROUTE for game domains
  MODE: "MEASURED_PRIMARY",

  // Last known best route from measurement.
  PRIMARY_ROUTE: "DIRECT",

  // Whether auth/login traffic for game services should follow the same game chain.
  PROXY_GAME_AUTH: true,

  // Whether update/download/CDN traffic should stay direct.
  DIRECT_CDN_AND_UPDATES: true,

  // If true, local/private/reserved ranges are always direct.
  BYPASS_PRIVATE_AND_LOCAL: true,

  // If true, plain host names stay direct.
  BYPASS_PLAIN_HOSTS: true,

  // Preferred Jordan exits. Keep the fastest first.
  PROXIES: [
    { name: "ORANGE_PRIMARY", host: "46.185.131.218", port: 8443, enabled: true, priority: 100 },
    { name: "ZAIN_PRIMARY", host: "109.237.193.45", port: 443, enabled: true, priority: 96 },
    { name: "UMNIAH_PRIMARY", host: "212.35.66.45", port: 20005, enabled: true, priority: 92 },
    { name: "ORANGE_BACKUP", host: "46.185.139.47", port: 443, enabled: true, priority: 88 },
    { name: "ZAIN_BACKUP", host: "79.173.240.10", port: 8080, enabled: true, priority: 84 },
    { name: "UMNIAH_BACKUP", host: "82.212.77.242", port: 3128, enabled: true, priority: 80 }
  ],

  // Jordan network ranges used only to validate configured exit IPs.
  JORDAN_CIDRS: [
    "46.185.128.0/17",
    "94.127.208.0/20",
    "212.35.64.0/18",
    "79.173.192.0/18",
    "109.237.192.0/18",
    "176.28.0.0/15",
    "82.212.0.0/16"
  ],

  // Always direct — common platforms and general traffic.
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

  // These patterns should stay direct for large downloads and CDNs.
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

  // Game realtime domains — route these with the chosen low-latency chain.
  GAME_DOMAINS: [
    "pubgmobile.com",
    "igamecj.com",
    "proximabeta.com",
    "levelinfinite.com",
    "tencentgames.com",
    "tencent.com",
    "battlegroundsmobileindia.com",
    "krafton.com",
    "bluehole.net"
  ],

  // Game auth/session domains.
  GAME_AUTH_DOMAINS: [
    "qq.com",
    "midasbuy.com",
    "unipay.com",
    "tpns.tencent.com",
    "passport.com",
    "account.levelinfinite.com"
  ],

  // Optional domains you explicitly want to push through the selected route.
  CUSTOM_LOW_LATENCY_DOMAINS: [
    "example-game-service.com",
    "example-latency-sensitive.com"
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
    "0": 0,
    "8": 4278190080,
    "9": 4286578688,
    "10": 4290772992,
    "11": 4292870144,
    "12": 4293918720,
    "13": 4294443008,
    "14": 4294705152,
    "15": 4294836224,
    "16": 4294901760,
    "17": 4294934528,
    "18": 4294950912,
    "19": 4294959104,
    "20": 4294963200,
    "21": 4294965248,
    "22": 4294966272,
    "23": 4294966784,
    "24": 4294967040,
    "25": 4294967168,
    "26": 4294967232,
    "27": 4294967264,
    "28": 4294967280,
    "29": 4294967288,
    "30": 4294967292,
    "31": 4294967294,
    "32": 4294967295
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
  return dnsDomainIs(host, suffix) || shExpMatch(host, "*." + suffix);
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

  chain.push("DIRECT");
  return chain.join("; ");
}

function buildMeasuredPrimaryChain() {
  var i, p, chain;

  if (CONFIG.PRIMARY_ROUTE === "DIRECT") {
    return "DIRECT";
  }

  chain = [CONFIG.PRIMARY_ROUTE];
  for (i = 0; i < CONFIG.PROXIES.length; i++) {
    p = CONFIG.PROXIES[i];
    if (!p.enabled) continue;
    chain.push("PROXY " + p.host + ":" + p.port);
  }
  chain.push("DIRECT");
  return uniqueChain(chain).join("; ");
}

function uniqueChain(arr) {
  var out = [];
  var seen = {};
  var i, key;
  for (i = 0; i < arr.length; i++) {
    key = arr[i];
    if (!seen[key]) {
      seen[key] = true;
      out.push(key);
    }
  }
  return out;
}

function getSelectedGameRoute() {
  if (CONFIG.MODE === "DIRECT_ONLY") return "DIRECT";
  if (CONFIG.MODE === "JORDAN_PREFERRED") return buildJordanChain();
  return buildMeasuredPrimaryChain();
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

  if (listMatch(host, CONFIG.ALWAYS_DIRECT_DOMAINS)) return "DIRECT";
  if (CONFIG.DIRECT_CDN_AND_UPDATES && patternMatch(url, CONFIG.DIRECT_URL_PATTERNS)) return "DIRECT";
  if (listMatch(host, CONFIG.CUSTOM_LOW_LATENCY_DOMAINS)) return "GAME";
  if (listMatch(host, CONFIG.GAME_DOMAINS)) return "GAME";
  if (CONFIG.PROXY_GAME_AUTH && listMatch(host, CONFIG.GAME_AUTH_DOMAINS)) return "AUTH";
  return "DEFAULT";
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
