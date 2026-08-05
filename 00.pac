// ============================================================
// 🎮 GAME BOOSTER ALPHA v6.1 — FIXED PURE JORDAN 2026
// ═══════════════════════════════════════════════════════════
// إصلاح مشكلة: اللاعبين من برا الأردن (روسيا وغيرها)
//
// السبب الحقيقي:
//   بروكسيات الداتا سنتر (46.185.131.218 / 212.35.66.45)
//   تينسنت تصنّفها على أنها VPN/بروكسي ⇐ تنقل المستخدم
//   إلى "حوض اللاعبين الدولي" فيختلط معه الروس وغيرهم.
//
// الحل في هذه النسخة:
//   ★ حركة المباراة + التجنيد + الصوت = DIRECT
//     (تمر عبر IP الأردني الحقيقي لخطك ⇐ حوض أردني)
//   ★ اللوبي/المتجر/الحساب فقط = بروكسي أردني (اختياري)
//   ★ إصلاح كل أخطاء الصياغة (ماركداپ، روابط CONFIG،
//     new Date()..getTime، إلخ)
//
// ملاحظة تقنية:
//   ملف PAC يتحكم بـ HTTP/HTTPS فقط عبر HTTP CONNECT (TCP).
//   حركة PUBG الحقيقية UDP لا تمر عبر بروكسي PAC أصلًا.
// ============================================================
var VERSION = "6.1";
var BUILD_DATE = "2026-08-06";

// ============================================================
// ⚙️ الإعدادات الرئيسية
// ============================================================
var CONFIG = {
  // ═══════════════════════════════════════════════════════════
  // سيرفرات MATCH — Orange Jordan / Umniah (أردنية)
  // ملاحظة: تم ضبط المباريات على DIRECT لتفادي حوض الـ VPN
  // ═══════════════════════════════════════════════════════════
  MATCH_TIER1: "PROXY 46.185.131.218:8443",
  MATCH_TIER2: "PROXY 212.35.66.45:20005",
  MATCH_TIER3: "PROXY 46.185.131.218:20001",
  MATCH_TIER4: "PROXY 212.35.66.45:8085",

  LOBBY_FAST: [
    "PROXY 46.185.131.218:8443",
    "PROXY 212.35.66.45:20005",
    "PROXY 46.185.131.218:20001",
    "PROXY 212.35.66.45:8085"
  ],

  VOICE_SEND: "PROXY 46.185.131.218:20001",
  VOICE_RECV: "PROXY 212.35.66.45:8085",
  VOICE_FALLBACK: "PROXY 46.185.131.218:8443",

  CDN_DIRECT: "DIRECT",
  BLOCK: "PROXY 127.0.0.1:9",
  DIRECT: "DIRECT",

  DNS_CACHE_TIME: 300000,
  DNS_PREFETCH_ENABLED: true,
  STICKY_SESSION_TIME: 3600000,
  AGGRESSIVE_BLOCK: true,
  ANTI_JITTER: true,
  ADAPTIVE_FAILOVER: true,
  LOW_LATENCY_MODE: true,
  DUPLEX_MODE: true,

  // ═══════════════════════════════════════════════════════════
  // ★★★ مفتاح الإصلاح ★★★
  // المباراة/التجنيد/الصوت تذهب مباشرة (IP أردني حقيقي)
  // حتى لا يضعك السيرفر في حوض مستخدمي الـ VPN الدولي.
  // ═══════════════════════════════════════════════════════════
  FORCE_MATCH_DIRECT: true,       // المباراة مباشرة
  FORCE_RECRUIT_DIRECT: true,     // التجنيد مباشر
  FORCE_VOICE_DIRECT: true,       // الصوت مباشر
  FORCE_LOBBY_THROUGH_PROXY: true,
  FORCE_SOCIAL_THROUGH_PROXY: false,
  FORCE_ALL_THROUGH_PROXY: false, // معطّل عمدًا — هو سبب المشكلة

  MAX_MATCH_LATENCY: 80,
  JITTER_THRESHOLD: 15,
  FAILOVER_TIMEOUT: 2000,
  HEALTH_CHECK_INTERVAL: 30000
};

// ============================================================
// 🇯🇴 نطاقات IP الأردنية
// ============================================================
var JORDAN_TIER1 = [
  ["46.185.0.0","255.255.0.0"],
  ["212.35.64.0","255.255.224.0"],
  ["212.34.0.0","255.255.0.0"],
  ["212.118.0.0","255.255.0.0"],
  ["46.32.0.0","255.255.0.0"],
  ["194.165.130.0","255.255.255.0"]
];
var JORDAN_TIER2 = [
  ["178.77.0.0","255.255.0.0"],
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
  ["93.93.0.0","255.255.0.0"],["93.95.0.0","255.255.0.0"],
  ["94.127.0.0","255.255.0.0"],["79.134.0.0","255.255.0.0"],
  ["79.173.0.0","255.255.0.0"],["85.159.0.0","255.255.0.0"],
  ["77.245.0.0","255.255.0.0"],["217.23.0.0","255.255.0.0"],
  ["185.162.0.0","255.255.0.0"],["185.80.0.0","255.255.0.0"],
  ["185.170.0.0","255.255.0.0"],["185.53.0.0","255.255.0.0"],
  ["45.155.0.0","255.255.0.0"],["149.200.0.0","255.255.0.0"],
  ["149.201.0.0","255.255.0.0"],["5.45.128.0","255.255.128.0"],
  ["5.198.0.0","255.255.0.0"],["31.5.0.0","255.255.0.0"],
  ["31.14.0.0","255.255.0.0"],["195.8.0.0","255.255.0.0"]
];
var JORDAN_RANGES = [].concat(
  JORDAN_TIER1, JORDAN_TIER2, JORDAN_TIER3,
  JORDAN_TIER4, JORDAN_TIER5
);

// ============================================================
// نطاقات بطيئة — حجب
// ============================================================
var HIGH_LATENCY_RANGES = [
  ["197.0.0.0","255.0.0.0"],["41.0.0.0","255.0.0.0"],
  ["102.0.0.0","255.0.0.0"],["196.0.0.0","255.0.0.0"],
  ["14.0.0.0","255.0.0.0"],["27.0.0.0","255.0.0.0"],
  ["49.0.0.0","255.0.0.0"],["58.0.0.0","255.0.0.0"],
  ["59.0.0.0","255.0.0.0"],["60.0.0.0","255.0.0.0"],
  ["61.0.0.0","255.0.0.0"],["106.0.0.0","255.0.0.0"],
  ["110.0.0.0","255.0.0.0"],["111.0.0.0","255.0.0.0"],
  ["112.0.0.0","255.0.0.0"],["113.0.0.0","255.0.0.0"],
  ["114.0.0.0","255.0.0.0"],["115.0.0.0","255.0.0.0"],
  ["116.0.0.0","255.0.0.0"],["117.0.0.0","255.0.0.0"],
  ["118.0.0.0","255.0.0.0"],["119.0.0.0","255.0.0.0"],
  ["120.0.0.0","255.0.0.0"],["121.0.0.0","255.0.0.0"],
  ["122.0.0.0","255.0.0.0"],["123.0.0.0","255.0.0.0"],
  ["124.0.0.0","255.0.0.0"],["125.0.0.0","255.0.0.0"],
  ["126.0.0.0","255.0.0.0"],["175.0.0.0","255.0.0.0"],
  ["180.0.0.0","255.0.0.0"],["103.0.0.0","255.0.0.0"],
  ["177.0.0.0","255.0.0.0"],["179.0.0.0","255.0.0.0"],
  ["181.0.0.0","255.0.0.0"],["186.0.0.0","255.0.0.0"],
  ["187.0.0.0","255.0.0.0"],["189.0.0.0","255.0.0.0"],
  ["190.0.0.0","255.0.0.0"],["191.0.0.0","255.0.0.0"],
  ["200.0.0.0","255.0.0.0"],["201.0.0.0","255.0.0.0"],
  ["104.16.0.0","255.240.0.0"],["172.64.0.0","255.248.0.0"],
  ["104.24.0.0","255.252.0.0"]
];

// ============================================================
// نطاقات خاصة
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
// 🎯 أنماط ترافيك PUBG — شاملة
// ============================================================
var MATCH_PATTERNS = [
  "*match*.pubgmobile.com","*match*.tencentigame.com",
  "*game*.pubgmobile.com","*game*.tencent.com",
  "*battle*.pubgmobile.com","*arena*.pubgmobile.com",
  "*ranked*.pubgmobile.com","*classic*.pubgmobile.com",
  "*tdm*.pubgmobile.com","*payload*.pubgmobile.com",
  "*livik*.pubgmobile.com","*erangel*.pubgmobile.com",
  "*miramar*.pubgmobile.com","*sanhok*.pubgmobile.com",
  "*vikendi*.pubgmobile.com","*karakin*.pubgmobile.com",
  "*nusa*.pubgmobile.com","*aftermath*.pubgmobile.com",
  "*server*.pubgmobile.com","*gate*.pubgmobile.com",
  "*gateway*.pubgmobile.com","*connect*.pubgmobile.com",
  "*session*.pubgmobile.com","*realtime*.pubgmobile.com",
  "*sync*.pubgmobile.com","*play*.pubgmobile.com",
  "*enter*.pubgmobile.com","*start*.pubgmobile.com",
  "*.igamecj.com","*.proximabeta.com",
  "*.proximabeta.net","*.gcloudcs.com"
];

var LOBBY_PATTERNS = [
  "*lobby*.pubgmobile.com","*lobby*.tencent.com",
  "*lobby*.tencentigame.com","*main*.pubgmobile.com",
  "*home*.pubgmobile.com","*menu*.pubgmobile.com",
  "*hub*.pubgmobile.com","*ready*.pubgmobile.com",
  "*waiting*.pubgmobile.com"
];

var RECRUIT_PATTERNS = [
  "*recruit*.pubgmobile.com","*team*.pubgmobile.com",
  "*matchmake*.pubgmobile.com","*queue*.pubgmobile.com",
  "*invite*.pubgmobile.com","*group*.pubgmobile.com",
  "*squad*.pubgmobile.com","*duo*.pubgmobile.com",
  "*party*.pubgmobile.com","*find*.pubgmobile.com",
  "*search*.pubgmobile.com","*join*.pubgmobile.com"
];

var VOICE_PATTERNS = [
  "*voice*.pubgmobile.com","*rtc*.tencent.com",
  "*trtc*.com","*trtc*.tencent.com",
  "*voip*.pubgmobile.com","*audio*.pubgmobile.com",
  "*speak*.pubgmobile.com","*mic*.pubgmobile.com",
  "*talk*.pubgmobile.com","*call*.pubgmobile.com",
  "*media*.pubgmobile.com","*stream*.pubgmobile.com",
  "*rtc*.gcloudcs.com","*av*.tencent.com",
  "*imservice*.tencent.com"
];

var UPLOAD_PATTERNS = [
  "*upload*.pubgmobile.com","*upload*.tencent.com",
  "*put*.pubgmobile.com","*post*.pubgmobile.com",
  "*submit*.pubgmobile.com","*send*.pubgmobile.com",
  "*input*.pubgmobile.com","*action*.pubgmobile.com",
  "*cmd*.pubgmobile.com","*position*.pubgmobile.com"
];

var DOWNLOAD_PATTERNS = [
  "*download*.pubgmobile.com","*download*.tencent.com",
  "*get*.pubgmobile.com","*fetch*.pubgmobile.com",
  "*receive*.pubgmobile.com","*payload*.pubgmobile.com",
  "*data*.pubgmobile.com","*response*.pubgmobile.com",
  "*tick*.pubgmobile.com","*snapshot*.pubgmobile.com"
];

var SOCIAL_PATTERNS = [
  "*social*.pubgmobile.com","*chat*.pubgmobile.com",
  "*message*.pubgmobile.com","*msg*.pubgmobile.com",
  "*friend*.pubgmobile.com","*mail*.pubgmobile.com",
  "*inbox*.pubgmobile.com","*gift*.pubgmobile.com"
];

var CLAN_PATTERNS = [
  "*clan*.pubgmobile.com","*crew*.pubgmobile.com",
  "*guild*.pubgmobile.com","*war*.pubgmobile.com",
  "*clash*.pubgmobile.com","*versus*.pubgmobile.com"
];

var SHOP_PATTERNS = [
  "*shop*.pubgmobile.com","*store*.pubgmobile.com",
  "*buy*.pubgmobile.com","*purchase*.pubgmobile.com",
  "*payment*.pubgmobile.com","*uc*.pubgmobile.com",
  "*bp*.pubgmobile.com","*crate*.pubgmobile.com",
  "*spin*.pubgmobile.com","*royal*.pubgmobile.com",
  "*pass*.pubgmobile.com","*skin*.pubgmobile.com"
];

var EVENT_PATTERNS = [
  "*event*.pubgmobile.com","*mission*.pubgmobile.com",
  "*task*.pubgmobile.com","*challenge*.pubgmobile.com",
  "*reward*.pubgmobile.com","*daily*.pubgmobile.com",
  "*weekly*.pubgmobile.com","*bonus*.pubgmobile.com",
  "*special*.pubgmobile.com","*promo*.pubgmobile.com"
];

var RANK_PATTERNS = [
  "*rank*.pubgmobile.com","*leaderboard*.pubgmobile.com",
  "*rating*.pubgmobile.com","*tier*.pubgmobile.com",
  "*score*.pubgmobile.com","*stat*.pubgmobile.com",
  "*stats*.pubgmobile.com","*history*.pubgmobile.com",
  "*achievement*.pubgmobile.com"
];

var AUTH_PATTERNS = [
  "*auth*.pubgmobile.com","*login*.pubgmobile.com",
  "*token*.pubgmobile.com","*verify*.pubgmobile.com",
  "*session*.pubgmobile.com","*passport*.pubgmobile.com",
  "*anticheat*.pubgmobile.com","*security*.pubgmobile.com"
];

var REPLAY_PATTERNS = [
  "*replay*.pubgmobile.com","*record*.pubgmobile.com",
  "*highlight*.pubgmobile.com","*clip*.pubgmobile.com"
];

var SPECTATE_PATTERNS = [
  "*spectate*.pubgmobile.com","*watch*.pubgmobile.com",
  "*live*.pubgmobile.com","*broadcast*.pubgmobile.com"
];

var PROFILE_PATTERNS = [
  "*profile*.pubgmobile.com","*user*.pubgmobile.com",
  "*account*.pubgmobile.com","*player*.pubgmobile.com",
  "*avatar*.pubgmobile.com","*setting*.pubgmobile.com"
];

var PUSH_PATTERNS = [
  "*push*.pubgmobile.com","*notify*.pubgmobile.com",
  "*notification*.pubgmobile.com","*alert*.pubgmobile.com",
  "*announce*.pubgmobile.com","*ping*.pubgmobile.com"
];

var CDN_PATTERNS = [
  "*.cdn.pubgmobile.com","*.static.pubgmobile.com",
  "*.assets.pubgmobile.com","*.resource.pubgmobile.com",
  "*.update.pubgmobile.com","*.patch.pubgmobile.com",
  "*.download.pubgmobile.com","*.content.pubgmobile.com",
  "*.img*.pubgmobile.com","*.bundle*.pubgmobile.com",
  "*.pak*.pubgmobile.com"
];

var ANALYTICS_PATTERNS = [
  "*analytics*","*telemetry*","*metrics*",
  "*tracking*","*crash*","*log*.pubgmobile.com",
  "*report*.pubgmobile.com","*monitor*",
  "*diagnostic*","*survey*"
];

var TELEMETRY_DOMAINS = [
  "*app-measurement.com","*firebase*",
  "*google-analytics*","*crashlytics*",
  "*adjust.com","*appsflyer.com",
  "*branch.io","*singular.net",
  "*amplitude.com","*mixpanel.com"
];

var TENCENT_PATTERNS = [
  "*.tencent.com","*.qq.com",
  "*.gcloudlb.com","*.tencentyun.com",
  "*.qcloud.com","*.qpic.cn",
  "*.gtimg.cn","*.idqqimg.com",
  "*.qlogo.cn","*.gtimg.com",
  "*.myqcloud.com","*.tencent-cloud.net"
];

// ============================================================
// نظام التخزين المؤقت
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
    quality: 100,
    serverTier: 0
  },
  lobby: {
    primaryProxy: "",
    lastSwitch: 0,
    affinityMap: {}
  },
  counters: {
    totalRequests: 0,
    matchRequests: 0,
    lobbyRequests: 0,
    voiceRequests: 0,
    uploadRequests: 0,
    downloadRequests: 0,
    socialRequests: 0,
    clanRequests: 0,
    shopRequests: 0,
    eventRequests: 0,
    rankRequests: 0,
    replayRequests: 0,
    spectateRequests: 0,
    profileRequests: 0,
    authRequests: 0,
    pushRequests: 0,
    cdnRequests: 0,
    blockedRequests: 0,
    forcedProxy: 0,
    directMatch: 0,
    failovers: 0,
    dnsCacheHits: 0,
    dnsCacheMisses: 0,
    latencyBlocked: 0,
    analyticsBlocked: 0,
    tier1Hits: 0, tier2Hits: 0, tier3Hits: 0,
    tier4Hits: 0, tier5Hits: 0
  },
  dnsCache: {},
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
// دوال المساعدة
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
  return (ipToLong(ip) & ipToLong(mask)) === (ipToLong(rangeStart) & ipToLong(mask));
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
// DNS ذكي
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
    SESSION.dnsCache[host] = { ip: ip, time: now, hits: 1, tier: getJordanTier(ip) };
    var prefix = getNetworkPrefix(ip);
    if (prefix) {
      if (!SESSION.networkMap[prefix]) {
        SESSION.networkMap[prefix] = { host: host, ip: ip, count: 1, tier: getJordanTier(ip) };
      } else {
        SESSION.networkMap[prefix].count++;
      }
    }
  }
  return ip;
}

function prefetchDNS() {
  if (!CONFIG.DNS_PREFETCH_ENABLED) return;
  var list = [
    "match.pubgmobile.com","game.pubgmobile.com",
    "lobby.pubgmobile.com","voice.pubgmobile.com",
    "login.pubgmobile.com","shop.pubgmobile.com",
    "social.pubgmobile.com","rank.pubgmobile.com"
  ];
  for (var i = 0; i < list.length; i++) fastResolve(list[i]);
}

function cleanDNSCache() {
  var now = new Date().getTime();
  for (var host in SESSION.dnsCache) {
    if (now - SESSION.dnsCache[host].time > CONFIG.DNS_CACHE_TIME) delete SESSION.dnsCache[host];
  }
}

// ============================================================
// تصنيف الترافيك
// ============================================================
function isPUBGTraffic(host) {
  if (!host) return false;
  var domains = [
    "pubgmobile.com","tencentigame.com","igamecj.com",
    "proximabeta.com","proximabeta.net","gcloudcs.com",
    "tencent.com","qq.com","gcloudlb.com",
    "tencentyun.com","qcloud.com","qpic.cn",
    "gtimg.cn","idqqimg.com","qlogo.cn",
    "gtimg.com","myqcloud.com","tencent-cloud.net"
  ];
  for (var i = 0; i < domains.length; i++) {
    if (host === domains[i] || host.indexOf("." + domains[i]) !== -1) return true;
  }
  return false;
}

function matchesPattern(url, host, patterns) {
  var target = (host + url).toLowerCase();
  for (var i = 0; i < patterns.length; i++) {
    var p = patterns[i].toLowerCase().replace(/\*/g, "");
    if (p && target.indexOf(p) !== -1) return true;
  }
  return false;
}

function isMatchTraffic(u, h)     { return matchesPattern(u, h, MATCH_PATTERNS); }
function isLobbyTraffic(u, h)     { return matchesPattern(u, h, LOBBY_PATTERNS); }
function isRecruitTraffic(u, h)   { return matchesPattern(u, h, RECRUIT_PATTERNS); }
function isVoiceTraffic(u, h)     { return matchesPattern(u, h, VOICE_PATTERNS); }
function isUploadTraffic(u, h)    { return matchesPattern(u, h, UPLOAD_PATTERNS); }
function isDownloadTraffic(u, h)  { return matchesPattern(u, h, DOWNLOAD_PATTERNS); }
function isSocialTraffic(u, h)    { return matchesPattern(u, h, SOCIAL_PATTERNS); }
function isClanTraffic(u, h)      { return matchesPattern(u, h, CLAN_PATTERNS); }
function isShopTraffic(u, h)      { return matchesPattern(u, h, SHOP_PATTERNS); }
function isEventTraffic(u, h)     { return matchesPattern(u, h, EVENT_PATTERNS); }
function isRankTraffic(u, h)      { return matchesPattern(u, h, RANK_PATTERNS); }
function isReplayTraffic(u, h)    { return matchesPattern(u, h, REPLAY_PATTERNS); }
function isSpectateTraffic(u, h)  { return matchesPattern(u, h, SPECTATE_PATTERNS); }
function isProfileTraffic(u, h)   { return matchesPattern(u, h, PROFILE_PATTERNS); }
function isAuthTraffic(u, h)      { return matchesPattern(u, h, AUTH_PATTERNS); }
function isPushTraffic(u, h)      { return matchesPattern(u, h, PUSH_PATTERNS); }
function isCDNTraffic(u, h)       { return matchesPattern(u, h, CDN_PATTERNS); }
function isAnalyticsTraffic(u, h) { return matchesPattern(u, h, ANALYTICS_PATTERNS) || matchesPattern(u, h, TELEMETRY_DOMAINS); }
function isTencentTraffic(u, h)   { return matchesPattern(u, h, TENCENT_PATTERNS); }

// ============================================================
// نظام البروكسي
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
  var preferred;
  switch(tier) {
    case 1: preferred = CONFIG.LOBBY_FAST[0]; break;
    case 2: preferred = CONFIG.LOBBY_FAST[1]; break;
    case 3: preferred = CONFIG.LOBBY_FAST[2]; break;
    default: preferred = CONFIG.LOBBY_FAST[3]; break;
  }
  if (!SESSION.lobby.affinityMap[prefix]) SESSION.lobby.affinityMap[prefix] = preferred;
  var current = SESSION.lobby.affinityMap[prefix];
  var health = SESSION.proxyHealth[current];
  if (health && health.score > 50) return current;
  var best = getBestProxy(CONFIG.LOBBY_FAST);
  SESSION.lobby.affinityMap[prefix] = best;
  return best;
}

// سلاسل الفشل
function buildMatchChain()    { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3 + "; " + CONFIG.MATCH_TIER4; }
function buildLobbyChain(p)   { var c = p; for (var i = 0; i < CONFIG.LOBBY_FAST.length; i++) { if (CONFIG.LOBBY_FAST[i] !== p) c += "; " + CONFIG.LOBBY_FAST[i]; } return c; }
function buildVoiceChain()    { return CONFIG.VOICE_SEND + "; " + CONFIG.VOICE_RECV + "; " + CONFIG.VOICE_FALLBACK; }
function buildUploadChain()   { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3 + "; " + CONFIG.MATCH_TIER4; }
function buildDownloadChain() { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3 + "; " + CONFIG.MATCH_TIER4; }
function buildSocialChain()   { return CONFIG.LOBBY_FAST[0] + "; " + CONFIG.LOBBY_FAST[1] + "; " + CONFIG.LOBBY_FAST[2]; }
function buildClanChain()     { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3; }
function buildShopChain()     { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2; }
function buildEventChain()    { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2; }
function buildRankChain()     { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2; }
function buildAuthChain()     { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2; }
function buildReplayChain()   { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2; }
function buildSpectateChain() { return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2; }
function buildForcedJordanChain() {
  return CONFIG.MATCH_TIER1 + "; " +
         CONFIG.MATCH_TIER2 + "; " +
         CONFIG.MATCH_TIER3 + "; " +
         CONFIG.MATCH_TIER4;
}

// ============================================================
// مكافحة الذبذبة
// ============================================================
function updateConnectionQuality() {
  var now = new Date().getTime();
  if (SESSION.match.locked) {
    if (now - SESSION.match.lastActivity > 120000) { resetMatchSession(); return; }
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
  var all = [CONFIG.MATCH_TIER1, CONFIG.MATCH_TIER2, CONFIG.MATCH_TIER3, CONFIG.MATCH_TIER4];
  var np = getBestProxy(all);
  SESSION.match.proxy = np;
  SESSION.match.failCount = 0;
  SESSION.match.quality = 80;
  return np;
}

// ============================================================
// الصيانة
// ============================================================
function performMaintenance() {
  var now = new Date().getTime();
  if (now - SESSION.lastCleanup < 300000) return;
  SESSION.lastCleanup = now;
  cleanDNSCache();
  var lobbyMap = SESSION.lobby.affinityMap;
  for (var key in lobbyMap) {
    var h = SESSION.proxyHealth[lobbyMap[key]];
    if (h && h.score < 30) delete lobbyMap[key];
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
    for (var kk in SESSION.networkMap) sorted.push({ key: kk, count: SESSION.networkMap[kk].count });
    sorted.sort(function(a, b) { return a.count - b.count; });
    for (var j = 0; j < sorted.length - 100; j++) delete SESSION.networkMap[sorted[j].key];
  }
}

// ============================================================
// معالجة المباراة — إرسال + استقبال
// في هذه النسخة: DIRECT (IP أردني حقيقي)
// ============================================================
function handleMatchTraffic(url, host, ip) {
  var prefix = getNetworkPrefix(ip);
  var tier = getJordanTier(ip);

  if (tier > 0) {
    switch(tier) {
      case 1: SESSION.counters.tier1Hits++; break;
      case 2: SESSION.counters.tier2Hits++; break;
      case 3: SESSION.counters.tier3Hits++; break;
      case 4: SESSION.counters.tier4Hits++; break;
      case 5: SESSION.counters.tier5Hits++; break;
    }
  }

  // ★★★ الإصلاح: المباراة مباشرة على IP الأردن الحقيقي ★★★
  SESSION.counters.directMatch++;
  SESSION.match.locked = true;
  SESSION.match.networkPrefix = prefix;
  SESSION.match.hostname = host;
  SESSION.match.proxy = CONFIG.DIRECT;
  SESSION.match.startTime = new Date().getTime();
  SESSION.match.lastActivity = new Date().getTime();
  SESSION.match.serverTier = tier;
  return CONFIG.DIRECT;
}

// ============================================================
// ★★★ الدالة الرئيسية — الإصلاح الكامل ★★★
// ============================================================
function FindProxyForURL(url, host) {
  SESSION.counters.totalRequests++;
  host = cleanHost(host.toLowerCase());
  performMaintenance();

  // 1) التحليلات/التتبع — حجب (تُوهم الموقع)
  if (isAnalyticsTraffic(url, host)) {
    SESSION.counters.analyticsBlocked++;
    return CONFIG.BLOCK;
  }

  // 2) ليس ترافيك PUBG
  if (!isPUBGTraffic(host)) return CONFIG.DIRECT;

  // 3) حل DNS
  var ip = fastResolve(host);

  // إذا فشل تحليل DNS (أو IPv6) لا نحجب — نمرّر مباشرة لتفادي قطع اللعبة
  if (!ip || ip.indexOf(":") !== -1) {
    return CONFIG.DIRECT;
  }

  // 4) IP محظور (نطاقات خاصة) — نادر الحدوث
  if (isInRangeList(ip, BLOCKED_RANGES)) {
    SESSION.counters.blockedRequests++;
    return CONFIG.BLOCK;
  }

  // 5) تحديث جودة الاتصال
  updateConnectionQuality();

  // ═══════════════════════════════════════════
  // CDN — مباشر (تحديثات كبيرة)
  // ═══════════════════════════════════════════
  if (isCDNTraffic(url, host)) {
    SESSION.counters.cdnRequests++;
    return CONFIG.CDN_DIRECT;
  }

  // ═══════════════════════════════════════════
  // ★★★ MATCH — مباراة: مباشر (أردني حقيقي) ★★★
  // هذا هو الإصلاح الجوهري لمنع الاختلاط بالروس
  // ═══════════════════════════════════════════
  if (isMatchTraffic(url, host)) {
    SESSION.counters.matchRequests++;
    if (CONFIG.FORCE_MATCH_DIRECT) {
      SESSION.counters.directMatch++;
      return CONFIG.DIRECT;
    }
    return handleMatchTraffic(url, host, ip);
  }

  // ═══════════════════════════════════════════
  // ★★★ RECRUIT — تجنيد: مباشر ★★★
  // ═══════════════════════════════════════════
  if (isRecruitTraffic(url, host)) {
    SESSION.counters.lobbyRequests++;
    if (CONFIG.FORCE_RECRUIT_DIRECT) return CONFIG.DIRECT;
    SESSION.counters.forcedProxy++;
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  // ═══════════════════════════════════════════
  // ★★★ VOICE — صوت: مباشر ★★★
  // (UDP غالبًا ولا يمر عبر بروكسي PAC أصلًا)
  // ═══════════════════════════════════════════
  if (isVoiceTraffic(url, host)) {
    SESSION.counters.voiceRequests++;
    if (CONFIG.FORCE_VOICE_DIRECT) return CONFIG.DIRECT;
    SESSION.counters.forcedProxy++;
    return buildVoiceChain();
  }

  // UPLOAD — إرسال بيانات
  if (isUploadTraffic(url, host)) {
    SESSION.counters.uploadRequests++;
    if (CONFIG.FORCE_MATCH_DIRECT) return CONFIG.DIRECT;
    SESSION.counters.forcedProxy++;
    return buildUploadChain();
  }

  // DOWNLOAD — استقبال بيانات
  if (isDownloadTraffic(url, host)) {
    SESSION.counters.downloadRequests++;
    if (CONFIG.FORCE_MATCH_DIRECT) return CONFIG.DIRECT;
    SESSION.counters.forcedProxy++;
    return buildDownloadChain();
  }

  // AUTH — مصادقة
  if (isAuthTraffic(url, host)) {
    SESSION.counters.authRequests++;
    SESSION.counters.forcedProxy++;
    return buildAuthChain();
  }

  // CLAN — كلان
  if (isClanTraffic(url, host)) {
    SESSION.counters.clanRequests++;
    if (CONFIG.FORCE_SOCIAL_THROUGH_PROXY) { SESSION.counters.forcedProxy++; return buildClanChain(); }
    return CONFIG.DIRECT;
  }

  // SHOP — متجر
  if (isShopTraffic(url, host)) {
    SESSION.counters.shopRequests++;
    SESSION.counters.forcedProxy++;
    return buildShopChain();
  }

  // EVENTS — أحداث
  if (isEventTraffic(url, host)) {
    SESSION.counters.eventRequests++;
    SESSION.counters.forcedProxy++;
    return buildEventChain();
  }

  // RANK — ترتيب
  if (isRankTraffic(url, host)) {
    SESSION.counters.rankRequests++;
    if (CONFIG.FORCE_MATCH_DIRECT) return CONFIG.DIRECT;
    SESSION.counters.forcedProxy++;
    return buildRankChain();
  }

  // REPLAY — إعادة
  if (isReplayTraffic(url, host)) {
    SESSION.counters.replayRequests++;
    return CONFIG.DIRECT;
  }

  // SPECTATE — مشاهدة
  if (isSpectateTraffic(url, host)) {
    SESSION.counters.spectateRequests++;
    return CONFIG.DIRECT;
  }

  // PUSH — إشعارات
  if (isPushTraffic(url, host)) {
    SESSION.counters.pushRequests++;
    return CONFIG.DIRECT;
  }

  // PROFILE — ملف شخصي
  if (isProfileTraffic(url, host)) {
    SESSION.counters.profileRequests++;
    if (CONFIG.FORCE_LOBBY_THROUGH_PROXY) { SESSION.counters.forcedProxy++; return buildLobbyChain(selectLobbyProxy(host, ip)); }
    return CONFIG.DIRECT;
  }

  // SOCIAL — اجتماعي
  if (isSocialTraffic(url, host)) {
    SESSION.counters.socialRequests++;
    if (CONFIG.FORCE_SOCIAL_THROUGH_PROXY) { SESSION.counters.forcedProxy++; return buildSocialChain(); }
    return CONFIG.DIRECT;
  }

  // LOBBY — لوبي
  if (isLobbyTraffic(url, host)) {
    SESSION.counters.lobbyRequests++;
    if (CONFIG.FORCE_LOBBY_THROUGH_PROXY) { SESSION.counters.forcedProxy++; return buildLobbyChain(selectLobbyProxy(host, ip)); }
    return CONFIG.DIRECT;
  }

  // TENCENT — أي شي تنسنت
  if (isTencentTraffic(url, host)) {
    if (CONFIG.FORCE_ALL_THROUGH_PROXY) { SESSION.counters.forcedProxy++; return buildForcedJordanChain(); }
    // غير مصنّف: مباشر لتفادي حوض الـ VPN
    return CONFIG.DIRECT;
  }

  // أي ترافيك PUBG مجهول — مباشر (أردني حقيقي)
  return CONFIG.DIRECT;
}

// ============================================================
// جلب DNS مسبق
// ============================================================
prefetchDNS();
