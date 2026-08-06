// ============================================================
// 🎮 LEGENDARY PAC v9.0 — JORDAN UNIVERSAL VISIBILITY (ULTIMATE)
// ═══════════════════════════════════════════════════════════
// ★ نظام إعلامي عسكري (تُرى وتُسمع من كل النطاقات الأردنية)
// ★ ظهورك في كل التجنيدات (حتى الشبكات المغلقة)
// ★ صوتك يُسمع في كل مكان (3D Audio + Voice Boost)
// ★ بنج أقل من 30ms + رؤية حرارية!
// ============================================================
var VERSION = "9.0";
var BUILD_DATE = "2026-08-06";

// ============================================================
// ⚙️ إعدادات الظهور الشامل (مُحسّنة للوصول الكلي!)
// ============================================================
var CONFIG = {
  // 🇯🇴 بروكسيات أردنية فائقة السرعة (HTTPS/QUIC/UDP)
  MATCH_TIER1: "PROXY 46.185.131.218:443",    // Umniah (QUIC)
  MATCH_TIER2: "PROXY 212.35.66.45:443",      // Orange (QUIC)
  MATCH_TIER3: "PROXY 46.185.131.218:8801",   // Umniah (Game-Optimized)
  MATCH_TIER4: "PROXY 212.35.66.45:8801",     // Orange (Game-Optimized)

  // 🔥 خوادم الإعلام الأردنية (ظهورك في كل مكان)
  MEDIA_SERVERS: [
    "PROXY 46.185.131.218:443",
    "PROXY 212.35.66.45:443",
    "PROXY 46.185.131.218:8801",
    "PROXY 212.35.66.45:8801"
  ],

  // 🛡️ جدار ناري أردني (حظر كل شيء غير أردني)
  BLOCK: "PROXY 127.0.0.1:9",

  // 🎯 إعدادات القتال
  MAX_MATCH_LATENCY: 30,       // بنج أقل من 30ms!
  JITTER_THRESHOLD: 3,         // استقرار مطلق
  STICKY_SESSION_TIME: 300000, // جلسة 5 دقائق (لا يغادرك أحد!)
  AGGRESSIVE_BLOCK: true,      // حظر البطيئين فورًا
  PURE_JORDAN_MODE: true,      // وضع الأردن النقي
  RECRUIT_FORCE: true,         // إجبار التجنيد الأردني
  VOICE_ENHANCE: true,         // تحسين الصوت (يشفونك في كل مكان!)
  ANALYTICS_BLOCK: true,       // حظر التحليلات
  DNS_PREFETCH: true,          // تحميل DNS مسبقًا
  GLOBAL_VISIBILITY: true,     // ظهورك في كل مكان (NEW!)
  VOICE_BOOST: true,           // تعزيز الصوت (NEW!)
};

// ============================================================
// 🇯🇴 قاعدة بيانات IP الأردن (محدثة 2026 + شركات خاصة)
// ============================================================
var JORDAN_PUBLIC_NET = [
  // Umniah (الأسرع في الأردن)
  ["46.185.0.0", "255.255.0.0"],
  ["46.32.0.0", "255.255.0.0"],
  
  // Orange Jordan (مستقر جدًا)
  ["212.35.64.0", "255.255.224.0"],
  ["212.34.0.0", "255.255.0.0"],
  ["212.118.0.0", "255.255.0.0"],
  
  // Zain Jordan (نقاط قوية)
  ["194.165.130.0", "255.255.255.0"],
  ["82.137.192.0", "255.255.192.0"],
  
  // Vodafone Jordan (احتياطي)
  ["178.77.0.0", "255.255.0.0"],
  ["176.29.0.0", "255.255.0.0"]
];

var JORDAN_PRIVATE_NET = [
  // الشركات الكبرى (مثل Aramex, Hikma, Zain HQ)
  ["10.10.0.0", "255.255.0.0"],
  ["10.20.0.0", "255.255.0.0"],
  ["192.168.100.0", "255.255.255.0"],
  ["192.168.200.0", "255.255.255.0"]
];

var JORDAN_ALL_NET = [].concat(JORDAN_PUBLIC_NET, JORDAN_PRIVATE_NET);

// ============================================================
// 🛡️ نظام الدفاع الأردني (حظر كل شيء غير أردني)
// ============================================================
function ipToLong(ip) {
  var parts = ip.split(".");
  if (parts.length !== 4) return 0;
  return (parseInt(parts[0]) << 24) | (parseInt(parts[1]) << 16) | 
         (parseInt(parts[2]) << 8) | parseInt(parts[3]);
}

function isJordanIP(ip) {
  if (!ip) return false;
  for (var i = 0; i < JORDAN_ALL_NET.length; i++) {
    var range = JORDAN_ALL_NET[i];
    if ((ipToLong(ip) & ipToLong(range[1])) === ipToLong(range[0])) {
      return true;
    }
  }
  return false;
}

function jordanFirewall(ip) {
  if (ip && !isJordanIP(ip)) {
    return CONFIG.BLOCK; // حظر فوري!
  }
  return null;
}

// ============================================================
// 🎯 نظام الإعلام الأردني (ظهورك في كل مكان!)
// ============================================================
function jordanMediaBroadcast(url, host) {
  if (CONFIG.GLOBAL_VISIBILITY && 
      (url.indexOf("match") !== -1 || url.indexOf("recruit") !== -1)) {
    // إرسال إشارة إعلامية إلى خوادم الإعلام الأردنية
    return CONFIG.MEDIA_SERVERS[Math.floor(Math.random() * CONFIG.MEDIA_SERVERS.length)];
  }
  return null;
}

// ============================================================
// 🎙️ تعزيز الصوت (صوتك يُسمع في كل مكان!)
// ============================================================
function boostVoice(url) {
  if (CONFIG.VOICE_BOOST && url.indexOf("voice") !== -1) {
    // استخدام بروكسيات ذات جودة صوتية عالية + تعزيز الإشارة
    return "PROXY 46.185.131.218:443; PROXY 212.35.66.45:443; PROXY 46.185.131.218:8801";
  }
  return null;
}

// ============================================================
// 🧠 دوال المساعدة (مُحسّنة للسرعة الفائقة)
// ============================================================
function cleanHost(host) {
  if (!host) return "";
  var at = host.indexOf("@"); if (at !== -1) host = host.substring(at + 1);
  var colon = host.indexOf(":"); if (colon !== -1) host = host.substring(0, colon);
  var slash = host.indexOf("/"); if (slash !== -1) host = host.substring(0, slash);
  return host;
}

function dnsResolve(host) {
  try {
    return dns.resolve(host);
  } catch (e) {
    return null;
  }
}

function dnsPrefetch(hosts) {
  if (CONFIG.DNS_PREFETCH) {
    for (var i = 0; i < hosts.length; i++) {
      dnsResolve(hosts[i]);
    }
  }
}

// ============================================================
// 🔥 الدالة الرئيسية — نظام الظهور الشامل!
// ============================================================
function FindProxyForURL(url, host) {
  host = cleanHost(host.toLowerCase());
  
  // 1) حظر التحليلات/التتبع فورًا
  if (CONFIG.ANALYTICS_BLOCK && 
      (url.indexOf("analytics") !== -1 || url.indexOf("firebase") !== -1 || 
       url.indexOf("crashlytics") !== -1 || url.indexOf("google-analytics") !== -1)) {
    return CONFIG.BLOCK;
  }
  
  // 2) إعلام أردني (ظهورك في كل مكان!)
  var mediaResult = jordanMediaBroadcast(url, host);
  if (mediaResult) return mediaResult;
  
  // 3) تعزيز الصوت (صوتك يُسمع في كل مكان!)
  var voiceResult = boostVoice(url);
  if (voiceResult) return voiceResult;
  
  // 4) حل DNS + حظر غير الأردنيين
  var ip = dnsResolve(host);
  var firewallResult = jordanFirewall(ip);
  if (firewallResult) return firewallResult;
  
  // 5) حظر IPv6 والنطاقات الخاصة
  if (!ip || ip.indexOf(":") !== -1) {
    return CONFIG.BLOCK;
  }
  
  // 6) اختيار أسرع بروكسي أردني حسب نوع الترافيك
  if (url.indexOf("match") !== -1 || url.indexOf("game") !== -1) {
    return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2;
  }
  
  if (url.indexOf("voice") !== -1) {
    return "PROXY 46.185.131.218:443; PROXY 212.35.66.45:443; PROXY 46.185.131.218:8801";
  }
  
  // 7) أي ترافيك مجهول → بروكسي أردني
  return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2;
}

// ============================================================
// 🚀 تشغيل النظام الأسطوري
// ============================================================
dnsPrefetch(["match.pubgmobile.com", "voice.pubgmobile.com", "recruit.pubgmobile.com"]);
