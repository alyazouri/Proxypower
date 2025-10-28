// PAC Script Ultra Pro Max 🚀
// النسخة النهائية المطورة للتوجيه الذكي

// ===== إعدادات متقدمة =====
var SCRIPT_VERSION = "3.5.ULTIMATE";
var DEBUG_MODE = false;  // للتشخيص والتتبع

// مجموعة بروكسيات متطورة
var PROXY_CANDIDATES = [
  {host: "91.106.109.12", weight: 1, region: "JO", type: "residential"},
  {host: "185.141.39.25", weight: 1.2, region: "JO", type: "mobile"},
  {host: "213.215.220.130", weight: 0.9, region: "JO", type: "fiber"}
];

// نطاقات IPv6 الأردنية المتقدمة
var JO_V6_PREFIX = {
  LOBBY: [
    "2a02:2788::", "2a01:6e40::", 
    "2a0b:1c00::", "2a0c:8c00::", 
    "2a0d:4c00::"
  ],
  MATCH: [
    "2a01:6e40::", "2a02:2788::", 
    "2a0b:1c00::", "2a0c:8c00::", 
    "2a0d:4c00::"
  ]
};

// نطاقات IPv4 الأردنية الموسعة
var JO_V4_RANGES = [
  ["46.32.120.0", "46.32.127.255"],
  ["176.47.0.0", "176.52.255.255"],
  ["212.118.0.0", "212.118.255.255"],
  ["185.8.104.0", "185.8.107.255"],
  ["185.140.90.0", "185.140.93.255"]
];

// إعدادات متقدمة للأداء
var PERFORMANCE_CONFIG = {
  DNS_TTL_MS: 15 * 1000,
  PROXY_STICKY_TTL_MS: 60 * 1000,
  GEO_TTL_MS: 60 * 60 * 1000,
  MAX_PROXY_FAIL_COUNT: 3,
  MAX_ACCEPTABLE_LATENCY_MS: 250
};

// دومينات PUBG المتقدمة
var PUBG_DOMAINS = {
  LOBBY: [
    "*.pubgmobile.com", "*.pubgmobile.net", 
    "*.proximabeta.com", "*.igamecj.com"
  ],
  MATCH: [
    "*.gcloud.qq.com", "gpubgm.com", 
    "*.pubgmobile.com/match"
  ]
};

// أنماط URL المتطورة
var URL_PATTERNS = {
  MATCH: [
    "*/matchmaking/*", "*/mms/*", 
    "*/game/start*", "*/game/join*", 
    "*/report/battle*"
  ],
  LOBBY: [
    "*/account/login*", "*/client/version*", 
    "*/status/heartbeat*", "*/presence/*", 
    "*/friends/*"
  ]
};

// كاش متطور للذاكرة
var _root = typeof globalThis !== "undefined" ? globalThis : this;
_root._PAC_HARDCACHE = _root._PAC_HARDCACHE || {};
var C = _root._PAC_HARDCACHE;

// وظائف مساعدة متطورة
function advancedLog(message, level = "INFO") {
  if (DEBUG_MODE) {
    var timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function measureProxyPerformance(proxyHost) {
  var startTime = Date.now();
  try {
    var resolvedIP = dnsResolve(proxyHost);
    var endTime = Date.now();
    return {
      latency: endTime - startTime,
      ip: resolvedIP,
      status: resolvedIP ? "ACTIVE" : "INACTIVE"
    };
  } catch (error) {
    return {
      latency: 9999,
      ip: null,
      status: "ERROR",
      error: error.toString()
    };
  }
}

function selectOptimalProxy(candidates) {
  var sortedProxies = candidates
    .map(proxy => {
      var performance = measureProxyPerformance(proxy.host);
      return {
        ...proxy,
        ...performance
      };
    })
    .filter(p => p.status === "ACTIVE")
    .sort((a, b) => a.latency - b.latency);

  advancedLog(`Proxy Performance: ${JSON.stringify(sortedProxies)}`);
  
  return sortedProxies[0] || candidates[0];
}

function isJordanianNetwork(ip, type = "ANY") {
  // التحقق المتقدم من الشبكات الأردنية
  const jordanianNetworks = {
    V4: JO_V4_RANGES,
    V6: Object.values(JO_V6_PREFIX).flat(),
    MOBILE: ["185.141.0.0/16"],
    FIBER: ["213.215.0.0/16"]
  };

  function checkIPv4(ip) {
    return jordanianNetworks.V4.some(range => 
      ip4ToInt(ip) >= ip4ToInt(range[0]) && 
      ip4ToInt(ip) <= ip4ToInt(range[1])
    );
  }

  function checkIPv6(ip) {
    return jordanianNetworks.V6.some(prefix => 
      ip.startsWith(prefix)
    );
  }

  if (type === "V4") return checkIPv4(ip);
  if (type === "V6") return checkIPv6(ip);
  
  return checkIPv4(ip) || checkIPv6(ip);
}

function findProxyForCategory(category) {
  var selectedProxy = selectOptimalProxy(PROXY_CANDIDATES);
  return `PROXY ${selectedProxy.host}:${FIXED_PORT[category] || 443}`;
}

function FindProxyForURL(url, host) {
  advancedLog(`Processing URL: ${url}, Host: ${host}`);

  // التحقق من الشبكة
  var clientIP = myIpAddress();
  if (!isJordanianNetwork(clientIP)) {
    advancedLog("Non-Jordanian Network Detected", "WARNING");
    return "DIRECT";
  }

  // فحص فئات المباريات والبث
  if (
    URL_PATTERNS.MATCH.some(pattern => shExpMatch(url, pattern)) ||
    PUBG_DOMAINS.MATCH.some(domain => hostMatch(host, [domain]))
  ) {
    advancedLog("Match Category Detected");
    return findProxyForCategory("MATCH");
  }

  // فحص فئات اللوبي والتسجيل
  if (
    URL_PATTERNS.LOBBY.some(pattern => shExpMatch(url, pattern)) ||
    PUBG_DOMAINS.LOBBY.some(domain => hostMatch(host, [domain]))
  ) {
    advancedLog("Lobby Category Detected");
    return findProxyForCategory("LOBBY");
  }

  // الإعدادات الافتراضية
  advancedLog("Default Route Selected");
  return "DIRECT";
}
