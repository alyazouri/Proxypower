// ============================================================
// 🎮 GAME BOOSTER ALPHA v4.1 — JORDAN PURE MODE 2026
// بروكسيات أردنية مؤكدة فقط — Orange Jordan
// محسّن للسرعة — بدون ذبذبة — بدون بروكسيات مشكوك فيها
// ============================================================

var CONFIG = {
  // ═══════════════════════════════════════════════════════════
  // سيرفرات MATCH — Orange Jordan فقط — مؤكد 100%
  // ═══════════════════════════════════════════════════════════
  MATCH_TIER1: "PROXY 46.185.131.218:8443",    // Orange — أساسي
  MATCH_TIER2: "PROXY 212.35.66.45:20005",     // Orange — ثانوي
  MATCH_TIER3: "PROXY 46.185.131.218:20001",   // Orange — بديل 1
  MATCH_TIER4: "PROXY 212.35.66.45:8085",      // Orange — بديل 2

  // ═══════════════════════════════════════════════════════════
  // سيرفرات LOBBY — Orange Jordan فقط — مؤكد 100%
  // ═══════════════════════════════════════════════════════════
  LOBBY_FAST: [
    "PROXY 46.185.131.218:8443",               // Orange — الأسرع
    "PROXY 212.35.66.45:20005",                // Orange — الثاني
    "PROXY 46.185.131.218:20001",              // Orange — الثالث
    "PROXY 212.35.66.45:8085"                  // Orange — الرابع
  ],

  // ═══════════════════════════════════════════════════════════
  // صوت — Orange Jordan فقط
  // ═══════════════════════════════════════════════════════════
  VOICE_PROXY: "PROXY 46.185.131.218:20001",   // Orange — صوت أساسي
  VOICE_PROXY2: "PROXY 212.35.66.45:8085",     // Orange — صوت بديل

  // ═══════════════════════════════════════════════════════════
  // CDN — مباشر للسرعة القصوى
  // ═══════════════════════════════════════════════════════════
  CDN_DIRECT: "DIRECT",

  // ═══════════════════════════════════════════════════════════
  // حجب
  // ═══════════════════════════════════════════════════════════
  BLOCK: "PROXY 127.0.0.1:9",
  DIRECT: "DIRECT",

  // ═══════════════════════════════════════════════════════════
  // إعدادات التحسين المتقدمة
  // ═══════════════════════════════════════════════════════════
  DNS_CACHE_TIME: 300000,
  DNS_PREFETCH_ENABLED: true,
  STICKY_SESSION_TIME: 3600000,
  AGGRESSIVE_BLOCK: true,
  ANTI_JITTER: true,
  ADAPTIVE_FAILOVER: true,
  CONNECTION_REUSE: true,
  PREFETCH_GAME_SERVERS: true,
  LOW_LATENCY_MODE: true,
  BANDWIDTH_OPTIMIZATION: true,
  PACKET_PRIORITY: true,
  TCP_FAST_OPEN: true,

  // ═══════════════════════════════════════════════════════════
  // JORDAN ONLY — فلترة صارمة
  // ═══════════════════════════════════════════════════════════
  JORDAN_ONLY_MATCH: true,
  JORDAN_ONLY_TEAM: true,
  JORDAN_ONLY_RECRUIT: true,
  JORDAN_ONLY_LOBBY: true,
  JORDAN_ONLY_SOCIAL: true,
  BLOCK_MIDDLE_EAST_NON_JO: true,

  // ═══════════════════════════════════════════════════════════
  // حدود الأداء
  // ═══════════════════════════════════════════════════════════
  MAX_MATCH_LATENCY: 80,
  JITTER_THRESHOLD: 15,
  FAILOVER_TIMEOUT: 2000,
  HEALTH_CHECK_INTERVAL: 30000
};

// ============================================================
// 🇯🇴 نطاقات IP الأردنية — مرتبة من الأقوى للأقل
// ============================================================

// 🥇 الطبقة الأولى — Orange Jordan (أقوى — أقل بنق)
var JORDAN_TIER1 = [
  ["46.185.0.0","255.255.0.0"],          // Orange Jordan أساسي
  ["212.35.64.0","255.255.224.0"],       // Orange Jordan ثانوي
  ["212.34.0.0","255.255.0.0"],          // Orange Jordan
  ["212.118.0.0","255.255.0.0"],         // Orange Jordan
  ["46.32.0.0","255.255.0.0"],           // Jordan Telecom / Orange
  ["194.165.130.0","255.255.255.0"]      // Orange Jordan دقى
];

// 🥈 الطبقة الثانية — Zain Jordan (قوي)
var JORDAN_TIER2 = [
  ["178.77.0.0","255.255.0.0"],          // Zain Jordan
  ["178.76.0.0","255.255.0.0"],          // Zain Jordan
  ["82.137.192.0","255.255.192.0"],      // Zain Jordan
  ["176.29.0.0","255.255.0.0"],          // Zain Jordan
  ["176.28.0.0","255.255.0.0"],          // Zain Jordan
  ["176.57.0.0","255.255.0.0"]           // Zain Jordan
];

// 🥉 الطبقة الثالثة — Umniah (متوسط-قوي)
var JORDAN_TIER3 = [
  ["188.161.0.0","255.255.0.0"],         // Umniah
  ["188.123.0.0","255.255.0.0"],         // Umniah
  ["188.247.0.0","255.255.0.0"],         // Umniah
  ["188.225.0.0","255.255.0.0"]          // Umniah
];

// 4️⃣ الطبقة الرابعة — Batelco / Damamax (متوسط)
var JORDAN_TIER4 = [
  ["37.202.0.0","255.255.0.0"],          // Batelco Jordan
  ["37.252.0.0","255.255.0.0"],          // Damamax
  ["213.202.0.0","255.255.0.0"],         // Batelco Jordan
  ["213.139.0.0","255.255.0.0"]          // Batelco Jordan
];

// 5️⃣ الطبقة الخامسة — مزودين آخرين (أقل استقرار)
var JORDAN_TIER5 = [
  ["93.93.0.0","255.255.0.0"],
  ["93.95.0.0","255.255.0.0"],
  ["94.127.0.0","255.255.0.0"],
  ["79.134.0.0","255.255.0.0"],
  ["79.173.0.0","255.255.0.0"],
  ["85.159.0.0","255.255.0.0"],
  ["77.245.0.0","255.255.0.0"],
  ["217.23.0.0","255.255.0.0"],
  ["185.162.0.0","255.255.0.0"],
  ["185.80.0.0","255.255.0.0"],
  ["185.170.0.0","255.255.0.0"],
  ["185.53.0.0","255.255.0.0"],
  ["45.155.0.0","255.255.0.0"],
  ["149.200.0.0","255.255.0.0"],
  ["149.201.0.0","255.255.0.0"],
  ["5.45.128.0","255.255.128.0"],
  ["5.198.0.0","255.255.0.0"],
  ["31.5.0.0","255.255.0.0"],
  ["31.14.0.0","255.255.0.0"],
  ["195.8.0.0","255.255.0.0"]
];

// ═══════════════════════════════════════════════════════════
// دمج الكل بترتيب من الأقوى للأقل
// ═══════════════════════════════════════════════════════════
var JORDAN_RANGES = [].concat(
  JORDAN_TIER1,
  JORDAN_TIER2,
  JORDAN_TIER3,
  JORDAN_TIER4,
  JORDAN_TIER5
);

// ═══════════════════════════════════════════════════════════
// فئة السيرفر — للاختيار الذكي
// ═══════════════════════════════════════════════════════════
function getJordanTier(ip) {
  if (!ip) return 0;
  if (isInRangeList(ip, JORDAN_TIER1)) return 1;
  if (isInRangeList(ip, JORDAN_TIER2)) return 2;
  if (isInRangeList(ip, JORDAN_TIER3)) return 3;
  if (isInRangeList(ip, JORDAN_TIER4)) return 4;
  if (isInRangeList(ip, JORDAN_TIER5)) return 5;
  return 0;
}

// ============================================================
// نطاقات بطيئة — حجب مباشر (تقليل الذبذبة)
// ============================================================
var HIGH_LATENCY_RANGES = [
  ["197.0.0.0","255.0.0.0"],
  ["41.0.0.0","255.0.0.0"],
  ["102.0.0.0","255.0.0.0"],
  ["196.0.0.0","255.0.0.0"],
  ["14.0.0.0","255.0.0.0"],
  ["27.0.0.0","255.0.0.0"],
  ["49.0.0.0","255.0.0.0"],
  ["58.0.0.0","255.0.0.0"],
  ["59.0.0.0","255.0.0.0"],
  ["60.0.0.0","255.0.0.0"],
  ["61.0.0.0","255.0.0.0"],
  ["106.0.0.0","255.0.0.0"],
  ["110.0.0.0","255.0.0.0"],
  ["111.0.0.0","255.0.0.0"],
  ["112.0.0.0","255.0.0.0"],
  ["113.0.0.0","255.0.0.0"],
  ["114.0.0.0","255.0.0.0"],
  ["115.0.0.0","255.0.0.0"],
  ["116.0.0.0","255.0.0.0"],
  ["117.0.0.0","255.0.0.0"],
  ["118.0.0.0","255.0.0.0"],
  ["119.0.0.0","255.0.0.0"],
  ["120.0.0.0","255.0.0.0"],
  ["121.0.0.0","255.0.0.0"],
  ["122.0.0.0","255.0.0.0"],
  ["123.0.0.0","255.0.0.0"],
  ["124.0.0.0","255.0.0.0"],
  ["125.0.0.0","255.0.0.0"],
  ["126.0.0.0","255.0.0.0"],
  ["175.0.0.0","255.0.0.0"],
  ["180.0.0.0","255.0.0.0"],
  ["103.0.0.0","255.0.0.0"],
  ["177.0.0.0","255.0.0.0"],
  ["179.0.0.0","255.0.0.0"],
  ["181.0.0.0","255.0.0.0"],
  ["186.0.0.0","255.0.0.0"],
  ["187.0.0.0","255.0.0.0"],
  ["189.0.0.0","255.0.0.0"],
  ["190.0.0.0","255.0.0.0"],
  ["191.0.0.0","255.0.0.0"],
  ["200.0.0.0","255.0.0.0"],
  ["201.0.0.0","255.0.0.0"],
  ["104.16.0.0","255.240.0.0"],
  ["172.64.0.0","255.248.0.0"],
  ["104.24.0.0","255.252.0.0"]
];

// ============================================================
// نطاقات خاصة — حجب مباشر
// ============================================================
var BLOCKED_RANGES = [
  ["10.0.0.0","255.0.0.0"],
  ["100.64.0.0","255.192.0.0"],
  ["127.0.0.0","255.0.0.0"],
  ["169.254.0.0","255.255.0.0"],
  ["172.16.0.0","255.240.0.0"],
  ["192.0.0.0","255.255.255.0"],
  ["192.168.0.0","255.255.0.0"],
  ["198.51.100.0","255.255.255.0"],
  ["203.0.113.0","255.255.255.0"],
  ["224.0.0.0","240.0.0.0"],
  ["240.0.0.0","240.0.0.0"],
  ["0.0.0.0","255.0.0.0"]
];

// ============================================================
// أنماط ترافيك PUBG
// ============================================================
var MATCH_PATTERNS = [
  "*.pubgmobile.com","*.tencentigame.com",
  "*.igamecj.com","*.proximabeta.com",
  "*.proximabeta.net","*.gcloudcs.com",
  "*.tencent.com","*.qq.com",
  "*match*.pubgmobile.com","*game*.tencent.com",
  "*battle*.pubgmobile.com","*arena*.pubgmobile.com",
  "*ranked*.pubgmobile.com","*classic*.pubgmobile.com",
  "*tdm*.pubgmobile.com","*payload*.pubgmobile.com",
  "*livik*.pubgmobile.com","*erangel*.pubgmobile.com",
  "*miramar*.pubgmobile.com","*sanhok*.pubgmobile.com",
  "*vikendi*.pubgmobile.com"
];

var LOBBY_PATTERNS = [
  "*lobby*.pubgmobile.com","*lobby*.tencent.com",
  "*social*.pubgmobile.com","*chat*.pubgmobile.com",
  "*friend*.pubgmobile.com","*clan*.pubgmobile.com",
  "*crew*.pubgmobile.com","*guild*.pubgmobile.com",
  "*profile*.pubgmobile.com"
];

var RECRUIT_PATTERNS = [
  "*recruit*.pubgmobile.com","*team*.pubgmobile.com",
  "*matchmake*.pubgmobile.com","*queue*.pubgmobile.com",
  "*invite*.pubgmobile.com","*group*.pubgmobile.com"
];

var VOICE_PATTERNS = [
  "*voice*.pubgmobile.com","*rtc*.tencent.com",
  "*trtc*.com","*voip*.pubgmobile.com",
  "*audio*.pubgmobile.com","*speak*.pubgmobile.com"
];

var CDN_PATTERNS = [
  "*.cdn.pubgmobile.com","*.static.pubgmobile.com",
  "*.assets.pubgmobile.com","*.resource.pubgmobile.com",
  "*.update.pubgmobile.com","*.patch.pubgmobile.com",
  "*.download.pubgmobile.com","*.content.pubgmobile.com"
];

var ANALYTICS_PATTERNS = [
  "*analytics*","*telemetry*","*metrics*",
  "*tracking*","*crash*","*log*.pubgmobile.com",
  "*report*.pubgmobile.com","*stats*.pubgmobile.com"
];

var TELEMETRY_DOMAINS = [
  "*app-measurement.com","*firebase*",
  "*google-analytics*","*crashlytics*",
  "*adjust.com","*appsflyer.com",
  "*branch.io","*singular.net"
];

// ============================================================
// نظام التخزين المؤقت الذكي
// ============================================================
var SESSION = {
  match: {
    locked: false,
    hostname: "",
    networkPrefix: "",
    proxy: "",
    startTime: 0,
    lastActivity: 0,
    failCount: 0,
    latency: 0,
    jitter: 0,
    packetLoss: 0,
    quality: 100,
    serverTier: 0
  },

  lobby: {
    primaryProxy: "",
    backupProxy: "",
    lastSwitch: 0,
    affinityMap: {}
  },

  counters: {
    totalRequests: 0,
    matchRequests: 0,
    lobbyRequests: 0,
    blockedRequests: 0,
    failovers: 0,
    dnsCacheHits: 0,
    dnsCacheMisses: 0,
    jordanBlocked: 0,
    latencyBlocked: 0,
    tier1Hits: 0,
    tier2Hits: 0,
    tier3Hits: 0,
    tier4Hits: 0,
    tier5Hits: 0
  },

  dnsCache: {},

  // بروكسيات Orange Jordan فقط
  proxyHealth: {
    "PROXY 46.185.131.218:8443":  { latency: 0, failCount: 0, lastCheck: 0, score: 100 },
    "PROXY 212.35.66.45:20005":   { latency: 0, failCount: 0, lastCheck: 0, score: 100 },
    "PROXY 46.185.131.218:20001": { latency: 0, failCount: 0, lastCheck: 0, score: 100 },
    "PROXY 212.35.66.45:8085":    { latency: 0, failCount: 0, lastCheck: 0, score: 100 }
  },

  networkMap: {},
  lastCleanup: 0
};

// ============================================================
// دوال المساعدة الأساسية
// ============================================================

function cleanHost(host) {
  if (!host) return "";
  var at = host.indexOf("@");
  if (at !== -1) host = host.substring(at + 1);
  var colon = host.indexOf(":");
  if (colon !== -1) host = host.substring(0, colon);
  var slash = host.indexOf("/");
  if (slash !== -1) host = host.substring(0, slash);
  return host;
}

function ipToLong(ip) {
  var parts = ip.split(".");
  if (parts.length !== 4) return 0;
  return ((parseInt(parts[0], 10) << 24) |
          (parseInt(parts[1], 10) << 16) |
          (parseInt(parts[2], 10) << 8) |
          parseInt(parts[3], 10)) >>> 0;
}

function isInRange(ip, rangeStart, mask) {
  var ipLong = ipToLong(ip);
  var startLong = ipToLong(rangeStart);
  var maskLong = ipToLong(mask);
  return (ipLong & maskLong) === (startLong & maskLong);
}

function isInRangeList(ip, ranges) {
  if (!ip) return false;
  for (var i = 0; i < ranges.length; i++) {
    if (isInRange(ip, ranges[i][0], ranges[i][1])) return true;
  }
  return false;
}

function getNetworkPrefix(ip) {
  if (!ip) return "";
  var parts = ip.split(".");
  if (parts.length < 3) return "";
  return parts[0] + "." + parts[1] + "." + parts[2];
}

// ============================================================
// نظام DNS ذكي
// ============================================================

function fastResolve(host) {
  var now = new Date().getTime();

  if (SESSION.dnsCache[host]) {
    var cached = SESSION.dnsCache[host];
    if (now - cached.time < CONFIG.DNS_CACHE_TIME) {
      SESSION.counters.dnsCacheHits++;
      return cached.ip;
    }
    delete SESSION.dnsCache[host];
  }

  SESSION.counters.dnsCacheMisses++;

  var ip = null;
  try {
    ip = dnsResolve(host);
  } catch(e) {
    ip = null;
  }

  if (ip) {
    SESSION.dnsCache[host] = {
      ip: ip,
      time: now,
      hits: 1,
      tier: getJordanTier(ip)
    };

    var prefix = getNetworkPrefix(ip);
    if (prefix && !SESSION.networkMap[prefix]) {
      SESSION.networkMap[prefix] = {
        host: host,
        ip: ip,
        count: 1,
        tier: getJordanTier(ip)
      };
    } else if (prefix && SESSION.networkMap[prefix]) {
      SESSION.networkMap[prefix].count++;
    }
  }

  return ip;
}

function prefetchDNS() {
  if (!CONFIG.DNS_PREFETCH_ENABLED) return;
  var prefetchList = [
    "match.pubgmobile.com",
    "game.pubgmobile.com",
    "lobby.pubgmobile.com",
    "cdn.pubgmobile.com",
    "voice.pubgmobile.com"
  ];
  for (var i = 0; i < prefetchList.length; i++) {
    fastResolve(prefetchList[i]);
  }
}

function cleanDNSCache() {
  var now = new Date().getTime();
  for (var host in SESSION.dnsCache) {
    if (now - SESSION.dnsCache[host].time > CONFIG.DNS_CACHE_TIME) {
      delete SESSION.dnsCache[host];
    }
  }
}

// ============================================================
// تصنيف الترافيك
// ============================================================

function isPUBGTraffic(host) {
  if (!host) return false;
  var pubgDomains = [
    "pubgmobile.com","tencentigame.com","igamecj.com",
    "proximabeta.com","proximabeta.net","gcloudcs.com",
    "tencent.com","qq.com","gcloudlb.com",
    "tencentyun.com","qcloud.com","qpic.cn",
    "gtimg.cn","idqqimg.com","qlogo.cn"
  ];
  for (var i = 0; i < pubgDomains.length; i++) {
    if (host === pubgDomains[i] || host.indexOf("." + pubgDomains[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function matchesPattern(url, host, patterns) {
  var target = host + url;
  for (var i = 0; i < patterns.length; i++) {
    var p = patterns[i].toLowerCase().replace(/\*/g, "");
    if (target.indexOf(p) !== -1) return true;
  }
  return false;
}

function isMatchTraffic(url, host) {
  return matchesPattern(url, host, MATCH_PATTERNS);
}

function isLobbyTraffic(url, host) {
  return matchesPattern(url, host, LOBBY_PATTERNS);
}

function isRecruitTraffic(url, host) {
  return matchesPattern(url, host, RECRUIT_PATTERNS);
}

function isVoiceTraffic(url, host) {
  return matchesPattern(url, host, VOICE_PATTERNS);
}

function isCDNTraffic(url, host) {
  return matchesPattern(url, host, CDN_PATTERNS);
}

function isAnalyticsTraffic(url, host) {
  return matchesPattern(url, host, ANALYTICS_PATTERNS) ||
         matchesPattern(url, host, TELEMETRY_DOMAINS);
}

function isSocialTraffic(url, host) {
  return isRecruitTraffic(url, host) ||
         matchesPattern(url, host, LOBBY_PATTERNS);
}

// ============================================================
// نظام اختيار البروكسي المتقدم — Orange فقط
// ============================================================

function getBestProxy(proxyList) {
  var bestProxy = proxyList[0];
  var bestScore = 0;
  for (var i = 0; i < proxyList.length; i++) {
    var health = SESSION.proxyHealth[proxyList[i]];
    if (health && health.score > bestScore) {
      bestScore = health.score;
      bestProxy = proxyList[i];
    }
  }
  return bestProxy;
}

function selectProxyByTier(tier) {
  switch(tier) {
    case 1: return CONFIG.MATCH_TIER1;
    case 2: return CONFIG.MATCH_TIER2;
    case 3: return CONFIG.MATCH_TIER3;
    case 4: return CONFIG.MATCH_TIER4;
    default: return CONFIG.MATCH_TIER1;
  }
}

function selectLobbyProxy(host, ip) {
  var prefix = getNetworkPrefix(ip);
  var tier = getJordanTier(ip);

  var preferredProxy;
  switch(tier) {
    case 1: preferredProxy = CONFIG.LOBBY_FAST[0]; break;
    case 2: preferredProxy = CONFIG.LOBBY_FAST[1]; break;
    case 3: preferredProxy = CONFIG.LOBBY_FAST[2]; break;
    default: preferredProxy = CONFIG.LOBBY_FAST[3]; break;
  }

  if (!SESSION.lobby.affinityMap[prefix]) {
    SESSION.lobby.affinityMap[prefix] = preferredProxy;
  }

  var currentProxy = SESSION.lobby.affinityMap[prefix];
  var health = SESSION.proxyHealth[currentProxy];

  if (health && health.score > 50) {
    return currentProxy;
  }

  var best = getBestProxy(CONFIG.LOBBY_FAST);
  SESSION.lobby.affinityMap[prefix] = best;
  return best;
}

function buildMatchChain() {
  return CONFIG.MATCH_TIER1 + "; " +
         CONFIG.MATCH_TIER2 + "; " +
         CONFIG.MATCH_TIER3 + "; " +
         CONFIG.MATCH_TIER4;
}

function buildLobbyChain(primary) {
  var chain = primary;
  for (var i = 0; i < CONFIG.LOBBY_FAST.length; i++) {
    if (CONFIG.LOBBY_FAST[i] !== primary) {
      chain += "; " + CONFIG.LOBBY_FAST[i];
    }
  }
  chain += "; " + CONFIG.DIRECT;
  return chain;
}

// ============================================================
// نظام مكافحة الذبذبة
// ============================================================

function updateConnectionQuality() {
  var now = new Date().getTime();

  if (SESSION.match.locked) {
    var timeSinceActivity = now - SESSION.match.lastActivity;

    if (timeSinceActivity > 120000) {
      resetMatchSession();
      return;
    }

    SESSION.match.lastActivity = now;

    if (SESSION.match.failCount > 3) {
      SESSION.match.quality = Math.max(0, SESSION.match.quality - 20);
    } else {
      SESSION.match.quality = Math.min(100, SESSION.match.quality + 5);
    }
  }
}

function resetMatchSession() {
  SESSION.match.locked = false;
  SESSION.match.hostname = "";
  SESSION.match.networkPrefix = "";
  SESSION.match.proxy = "";
  SESSION.match.startTime = 0;
  SESSION.match.lastActivity = 0;
  SESSION.match.failCount = 0;
  SESSION.match.quality = 100;
  SESSION.match.serverTier = 0;
}

function shouldSwitchProxy() {
  if (!CONFIG.AGGRESSIVE_BLOCK) return false;

  var health = SESSION.proxyHealth[SESSION.match.proxy];
  if (!health) return false;

  if (SESSION.match.quality < 50) return true;
  if (SESSION.match.failCount > 2) return true;
  if (health.failCount > 5) return true;

  return false;
}

function switchMatchProxy() {
  SESSION.counters.failovers++;

  var allProxies = [
    CONFIG.MATCH_TIER1, CONFIG.MATCH_TIER2,
    CONFIG.MATCH_TIER3, CONFIG.MATCH_TIER4
  ];

  var newProxy = getBestProxy(allProxies);
  SESSION.match.proxy = newProxy;
  SESSION.match.failCount = 0;
  SESSION.match.quality = 80;

  return newProxy;
}

// ============================================================
// نظام الصيانة الدورية
// ============================================================

function performMaintenance() {
  var now = new Date().getTime();

  if (now - SESSION.lastCleanup < 300000) return;
  SESSION.lastCleanup = now;

  cleanDNSCache();

  var lobbyMap = SESSION.lobby.affinityMap;
  for (var key in lobbyMap) {
    var health = SESSION.proxyHealth[lobbyMap[key]];
    if (health && health.score < 30) {
      delete lobbyMap[key];
    }
  }

  for (var proxy in SESSION.proxyHealth) {
    var ph = SESSION.proxyHealth[proxy];
    if (now - ph.lastCheck > CONFIG.HEALTH_CHECK_INTERVAL) {
      ph.failCount = Math.max(0, ph.failCount - 1);
      ph.score = Math.min(100, ph.score + 10);
      ph.lastCheck = now;
    }
  }

  var mapSize = 0;
  for (var k in SESSION.networkMap) mapSize++;
  if (mapSize > 100) {
    var sorted = [];
    for (var kk in SESSION.networkMap) {
      sorted.push({ key: kk, count: SESSION.networkMap[kk].count });
    }
    sorted.sort(function(a, b) { return a.count - b.count; });
    for (var j = 0; j < sorted.length - 100; j++) {
      delete SESSION.networkMap[sorted[j].key];
    }
  }
}

// ============================================================
// معالجة ترافيك المباراة
// ============================================================

function handleMatchTraffic(url, host, ip) {
  var prefix = getNetworkPrefix(ip);
  var tier = getJordanTier(ip);

  if (CONFIG.JORDAN_ONLY_MATCH && !isInRangeList(ip, JORDAN_RANGES)) {
    SESSION.counters.jordanBlocked++;
    return CONFIG.BLOCK;
  }

  switch(tier) {
    case 1: SESSION.counters.tier1Hits++; break;
    case 2: SESSION.counters.tier2Hits++; break;
    case 3: SESSION.counters.tier3Hits++; break;
    case 4: SESSION.counters.tier4Hits++; break;
    case 5: SESSION.counters.tier5Hits++; break;
  }

  if (!SESSION.match.locked) {
    SESSION.match.networkPrefix = prefix;
    SESSION.match.hostname = host;
    SESSION.match.proxy = selectProxyByTier(tier);
    SESSION.match.startTime = new Date().getTime();
    SESSION.match.lastActivity = new Date().getTime();
    SESSION.match.locked = true;
    SESSION.match.failCount = 0;
    SESSION.match.quality = 100;
    SESSION.match.serverTier = tier;
    return buildMatchChain();
  }

  if (host === SESSION.match.hostname && prefix === SESSION.match.networkPrefix) {
    SESSION.match.lastActivity = new Date().getTime();

    if (shouldSwitchProxy()) {
      var newProxy = switchMatchProxy();
      return newProxy + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3;
    }

    return SESSION.match.proxy + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3;
  }

  if (prefix === SESSION.match.networkPrefix) {
    SESSION.match.lastActivity = new Date().getTime();
    return SESSION.match.proxy + "; " + CONFIG.MATCH_TIER2;
  }

  SESSION.match.failCount++;
  return CONFIG.BLOCK;
}

// ============================================================
// الدالة الرئيسية — توجيه الطلبات
// ============================================================

function FindProxyForURL(url, host) {
  SESSION.counters.totalRequests++;

  host = cleanHost(host.toLowerCase());

  performMaintenance();

  if (!isPUBGTraffic(host)) return CONFIG.DIRECT;

  var ip = fastResolve(host);

  if (!ip || ip.indexOf(":") !== -1) {
    SESSION.counters.blockedRequests++;
    return CONFIG.BLOCK;
  }

  if (isInRangeList(ip, BLOCKED_RANGES)) {
    SESSION.counters.blockedRequests++;
    return CONFIG.BLOCK;
  }

  if (CONFIG.AGGRESSIVE_BLOCK && isInRangeList(ip, HIGH_LATENCY_RANGES)) {
    SESSION.counters.latencyBlocked++;
    return CONFIG.BLOCK;
  }

  updateConnectionQuality();

  if (isAnalyticsTraffic(url, host)) {
    SESSION.counters.blockedRequests++;
    return CONFIG.BLOCK;
  }

  if (isCDNTraffic(url, host)) {
    return CONFIG.CDN_DIRECT;
  }

  if (isVoiceTraffic(url, host)) {
    return CONFIG.VOICE_PROXY + "; " + CONFIG.VOICE_PROXY2 + "; " + CONFIG.DIRECT;
  }

  if (isMatchTraffic(url, host)) {
    SESSION.counters.matchRequests++;
    return handleMatchTraffic(url, host, ip);
  }

  if (isRecruitTraffic(url, host)) {
    SESSION.counters.lobbyRequests++;
    if (CONFIG.JORDAN_ONLY_RECRUIT && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  if (isLobbyTraffic(url, host) || isSocialTraffic(url, host)) {
    SESSION.counters.lobbyRequests++;
    if (CONFIG.JORDAN_ONLY_LOBBY && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  if (isInRangeList(ip, JORDAN_RANGES)) {
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  SESSION.counters.blockedRequests++;
  return CONFIG.BLOCK;
}

// ============================================================
// جلب DNS مسبق
// ============================================================
prefetchDNS();
