// ============================================================
// 🎮 GAME BOOSTER v7.1 — PURE JORDAN FORCE (GEOIP BLOCKED)
// ═══════════════════════════════════════════════════════════
// ★ كل الترافيك يمر عبر البروكسي الأردني النقي
// ★ حظر فوري لأي اتصال غير أردني (GeoIP)
// ★ تجنيد سريع + مطابقة أردنية بنسبة 100%
// ============================================================
var VERSION = "7.1";
var BUILD_DATE = "2026-08-06";

// ============================================================
// ⚙️ الإعدادات الرئيسية (مُحسّنة للسرعة والنقاء)
// ============================================================
var CONFIG = {
  // 🇯🇴 بروكسيات أردنية نقية (Umniah/Orange)
  MATCH_TIER1: "PROXY 46.185.131.218:8443",  // Umniah
  MATCH_TIER2: "PROXY 212.35.66.45:20005",   // Orange
  MATCH_TIER3: "PROXY 46.185.131.218:20001", // Umniah
  MATCH_TIER4: "PROXY 212.35.66.45:8085",    // Orange

  LOBBY_FAST: [
    "PROXY 46.185.131.218:8443",
    "PROXY 212.35.66.45:20005",
    "PROXY 46.185.131.218:20001",
    "PROXY 212.35.66.45:8085"
  ],

  VOICE_SEND:    "PROXY 46.185.131.218:20001",
  VOICE_RECV:    "PROXY 212.35.66.45:8085",
  VOICE_FALLBACK:"PROXY 46.185.131.218:8443",

  // ★★★ حظر كل شيء غير أردني ★★★
  BLOCK: "PROXY 127.0.0.1:9",

  DNS_CACHE_TIME: 300000,
  DNS_PREFETCH_ENABLED: true,
  STICKY_SESSION_TIME: 3600000,
  AGGRESSIVE_BLOCK: true,
  ANTI_JITTER: true,
  ADAPTIVE_FAILOVER: true,
  LOW_LATENCY_MODE: true,
  DUPLEX_MODE: true,

  MAX_MATCH_LATENCY: 80,
  JITTER_THRESHOLD: 15,
  FAILOVER_TIMEOUT: 1000, // تم التحسين (1000ms)
  HEALTH_CHECK_INTERVAL: 30000
};

// ============================================================
// 🇯🇴 نطاقات IP الأردنية (محدثة)
// ============================================================
var JORDAN_TIER1 = [
  ["46.185.0.0","255.255.0.0"],    // Umniah
  ["212.35.64.0","255.255.224.0"], // Orange
  ["212.34.0.0","255.255.0.0"],    // Orange
  ["212.118.0.0","255.255.0.0"],   // Orange
  ["46.32.0.0","255.255.0.0"],     // Zain Jordan
  ["194.165.130.0","255.255.255.0"] // Damamax
];
var JORDAN_TIER2 = [
  ["178.77.0.0","255.255.0.0"],    // Vodafone Jordan
  ["178.76.0.0","255.255.0.0"],
  ["82.137.192.0","255.255.192.0"],
  ["176.29.0.0","255.255.0.0"],
  ["176.28.0.0","255.255.0.0"],
  ["176.57.0.0","255.255.0.0"]
];
var JORDAN_TIER3 = [
  ["188.161.0.0","255.255.0.0"],
  ["188.123.0.0","255.255.0.0"],
  ["188.247.0.0","255.255.0.0"],
  ["188.225.0.0","255.255.0.0"]
];
var JORDAN_TIER4 = [
  ["37.202.0.0","255.255.0.0"],
  ["37.252.0.0","255.255.0.0"],
  ["213.202.0.0","255.255.0.0"],
  ["213.139.0.0","255.255.0.0"]
];
var JORDAN_TIER5 = [
  ["93.93.0.0","255.255.0.0"], ["93.95.0.0","255.255.0.0"],
  ["94.127.0.0","255.255.0.0"], ["79.134.0.0","255.255.0.0"],
  ["79.173.0.0","255.255.0.0"], ["85.159.0.0","255.255.0.0"],
  ["77.245.0.0","255.255.0.0"], ["217.23.0.0","255.255.0.0"],
  ["185.162.0.0","255.255.0.0"], ["185.80.0.0","255.255.0.0"],
  ["185.170.0.0","255.255.0.0"], ["185.53.0.0","255.255.0.0"],
  ["45.155.0.0","255.255.0.0"], ["149.200.0.0","255.255.0.0"],
  ["149.201.0.0","255.255.0.0"], ["5.45.128.0","255.255.128.0"],
  ["5.198.0.0","255.255.0.0"],  ["31.5.0.0","255.255.0.0"],
  ["31.14.0.0","255.255.0.0"],  ["195.8.0.0","255.255.0.0"]
];
var JORDAN_RANGES = [].concat(
  JORDAN_TIER1, JORDAN_TIER2, JORDAN_TIER3,
  JORDAN_TIER4, JORDAN_TIER5
);

// ============================================================
// نطاقات خاصة — حجب
// ============================================================
var BLOCKED_RANGES = [
  ["10.0.0.0","255.0.0.0"],    ["100.64.0.0","255.192.0.0"],
  ["127.0.0.0","255.0.0.0"],   ["169.254.0.0","255.255.0.0"],
  ["172.16.0.0","255.240.0.0"], ["192.0.0.0","255.255.255.0"],
  ["192.168.0.0","255.255.0.0"], ["198.51.100.0","255.255.255.0"],
  ["203.0.113.0","255.255.255.0"], ["224.0.0.0","240.0.0.0"],
  ["240.0.0.0","240.0.0.0"],   ["0.0.0.0","255.0.0.0"]
];

// ============================================================
// 🎯 أنماط ترافيك PUBG (مُحدَّثة)
// ============================================================
var MATCH_PATTERNS = [
  "*match*.pubgmobile.com", "*match*.tencentigame.com",
  "*game*.pubgmobile.com", "*game*.tencent.com",
  "*battle*.pubgmobile.com", "*arena*.pubgmobile.com",
  "*ranked*.pubgmobile.com", "*classic*.pubgmobile.com",
  "*tdm*.pubgmobile.com", "*payload*.pubgmobile.com",
  "*livik*.pubgmobile.com", "*erangel*.pubgmobile.com",
  "*miramar*.pubgmobile.com", "*sanhok*.pubgmobile.com",
  "*vikendi*.pubgmobile.com", "*karakin*.pubgmobile.com",
  "*nusa*.pubgmobile.com", "*aftermath*.pubgmobile.com",
  "*server*.pubgmobile.com", "*gate*.pubgmobile.com",
  "*gateway*.pubgmobile.com", "*connect*.pubgmobile.com",
  "*session*.pubgmobile.com", "*realtime*.pubgmobile.com",
  "*sync*.pubgmobile.com", "*play*.pubgmobile.com",
  "*enter*.pubgmobile.com", "*start*.pubgmobile.com",
  "*.igamecj.com", "*.proximabeta.com",
  "*.proximabeta.net", "*.gcloudcs.com"
];

var RECRUIT_PATTERNS = [
  "*recruit*.pubgmobile.com", "*team*.pubgmobile.com",
  "*matchmake*.pubgmobile.com", "*queue*.pubgmobile.com",
  "*invite*.pubgmobile.com", "*group*.pubgmobile.com",
  "*squad*.pubgmobile.com", "*duo*.pubgmobile.com",
  "*party*.pubgmobile.com", "*find*.pubgmobile.com",
  "*search*.pubgmobile.com", "*join*.pubgmobile.com"
];

// ... (باقي الأنماط مثل VOICE_PATTERNS, SHOP_PATTERNS, إلخ تبقى كما هي)

// ============================================================
// 🔥 حظر كل شيء غير أردني (GeoIP Block)
// ============================================================
function isJordanIP(ip) {
  if (!ip) return false;
  return isInRangeList(ip, JORDAN_RANGES);
}

function blockNonJordan(url, host, ip) {
  if (ip && !isJordanIP(ip)) {
    return CONFIG.BLOCK; // حظر الاتصال إذا لم يكن أردنيًا
  }
  return null; // السماح إذا كان أردنيًا
}

// ============================================================
// دوال المساعدة (مُحسَّنة)
// ============================================================
function cleanHost(host) {
  if (!host) return "";
  var at = host.indexOf("@"); if (at !== -1) host = host.substring(at + 1);
  var colon = host.indexOf(":"); if (colon !== -1) host = host.substring(0, colon);
  var slash = host.indexOf("/"); if (slash !== -1) host = host.substring(0, slash);
  return host;
}

function ipToLong(ip) {
  var parts = ip.split(".");
  if (parts.length !== 4) return 0;
  return ((parseInt(parts[0], 10) << 24) | (parseInt(parts[1], 10) << 16) |
          (parseInt(parts[2], 10) << 8) | parseInt(parts[3], 10)) >>> 0;
}

function isInRange(ip, rangeStart, mask) {
  return (ipToLong(ip) & ipToLong(mask)) === (ipToLong(rangeStart) & ipToLong(mask));
}

function isInRangeList(ip, ranges) {
  if (!ip) return false;
  for (var i = 0; i < ranges.length; i++) {
    if (isInRange(ip, ranges[i][0], ranges[i][1])) return true;
  }
  return false;
}

// ============================================================
// DNS ذكي + تخزين مؤقت
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
  try { ip = dnsResolve(host); } catch(e) { ip = null; }
  if (ip) {
    SESSION.dnsCache[host] = { ip: ip, time: now, hits: 1 };
  }
  return ip;
}

function prefetchDNS() {
  if (!CONFIG.DNS_PREFETCH_ENABLED) return;
  var list = [
    "match.pubgmobile.com", "game.pubgmobile.com",
    "lobby.pubgmobile.com", "voice.pubgmobile.com",
    "login.pubgmobile.com", "shop.pubgmobile.com",
    "social.pubgmobile.com", "rank.pubgmobile.com"
  ];
  for (var i = 0; i < list.length; i++) fastResolve(list[i]);
}

// ============================================================
// تصنيف الترافيك
// ============================================================
function matchesPattern(url, host, patterns) {
  var target = (host + url).toLowerCase();
  for (var i = 0; i < patterns.length; i++) {
    var p = patterns[i].toLowerCase().replace(/\*/g, "");
    if (p && target.indexOf(p) !== -1) return true;
  }
  return false;
}

function isRecruitTraffic(u, h) { return matchesPattern(u, h, RECRUIT_PATTERNS); }
function isMatchTraffic(u, h)   { return matchesPattern(u, h, MATCH_PATTERNS); }
// ... (باقي الدوال مثل isVoiceTraffic, isShopTraffic, إلخ)

// ============================================================
// نظام البروكسي (مُحسَّن للسرعة)
// ============================================================
function getBestProxy(proxyList) {
  var best = proxyList[0];
  var bestScore = 0;
  for (var i = 0; i < proxyList.length; i++) {
    var h = SESSION.proxyHealth[proxyList[i]];
    if (h && h.score > bestScore) { bestScore = h.score; best = proxyList[i]; }
  }
  return best;
}

function buildJordanChain() {
  return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3 + "; " + CONFIG.MATCH_TIER4;
}

// ============================================================
// ★★★ الدالة الرئيسية — كل شي بروكسي أردني + حظر غير الأردني ★★★
// ============================================================
function FindProxyForURL(url, host) {
  SESSION.counters.totalRequests++;
  host = cleanHost(host.toLowerCase());

  // 1) حظر التحليلات/التتبع
  if (isAnalyticsTraffic(url, host)) {
    SESSION.counters.analyticsBlocked++;
    return CONFIG.BLOCK;
  }

  // 2) ليس ترافيك PUBG — بروكسي أردني (مش DIRECT)
  if (!isPUBGTraffic(host)) return buildJordanChain();

  // 3) حل DNS
  var ip = fastResolve(host);

  // 🔥 حظر غير الأردنيين فورًا
  var blockResult = blockNonJordan(url, host, ip);
  if (blockResult) return blockResult;

  // 4) فشل DNS أو IPv6 — بروكسي أردني
  if (!ip || ip.indexOf(":") !== -1) {
    SESSION.counters.forcedProxy++;
    return buildJordanChain();
  }

  // 5) IP محظور (نطاقات خاصة)
  if (isInRangeList(ip, BLOCKED_RANGES)) {
    SESSION.counters.blockedRequests++;
    return CONFIG.BLOCK;
  }

  // 6) تحسين التجنيد (أسرع بروكسي أردني)
  if (isRecruitTraffic(url, host)) {
    SESSION.counters.lobbyRequests++;
    SESSION.counters.forcedProxy++;
    return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2; // أسرع بروكسي
  }

  // 7) المباريات (مع مكافحة الذبذبة)
  if (isMatchTraffic(url, host)) {
    SESSION.counters.matchRequests++;
    SESSION.counters.forcedProxy++;
    return handleMatchTraffic(url, host, ip);
  }

  // 8) باقي الترافيك (صوت، متجر، إلخ) — بروكسي أردني
  if (isVoiceTraffic(url, host)) {
    SESSION.counters.voiceRequests++;
    return buildVoiceChain();
  }

  // ... (باقي الشروط مثل isShopTraffic, isAuthTraffic, إلخ)

  // 9) أي ترافيك مجهول — بروكسي أردني
  SESSION.counters.forcedProxy++;
  return buildJordanChain();
}

// ============================================================
// جلب DNS مسبق
// ============================================================
prefetchDNS();
