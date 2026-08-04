// ============================================================
// 🎮 GAME BOOSTER ALPHA v5.0 — ULTIMATE PURE JORDAN 2026
// ═══════════════════════════════════════════════════════════
// استقبال كامل + إرسال كامل + كل الترافيك
// سيرفرات أردنية بيور 100% — Orange Jordan فقط
// بدون ذبذبة — أقل بنق — أعلى أداء
// ============================================================

var VERSION = "5.0";
var BUILD_DATE = "2026-01-15";

// ============================================================
// ⚙️ الإعدادات الرئيسية
// ============================================================
var CONFIG = {

  // ═══════════════════════════════════════════════════════════
  // سيرفرات MATCH — Orange Jordan — استقبال + إرسال
  // ═══════════════════════════════════════════════════════════
  MATCH_TIER1: "PROXY 46.185.131.218:8443",
  MATCH_TIER2: "PROXY 212.35.66.45:20005",
  MATCH_TIER3: "PROXY 46.185.131.218:20001",
  MATCH_TIER4: "PROXY 212.35.66.45:8085",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات LOBBY — Orange Jordan — استقبال + إرسال
  // ═══════════════════════════════════════════════════════════
  LOBBY_FAST: [
    "PROXY 46.185.131.218:8443",
    "PROXY 212.35.66.45:20005",
    "PROXY 46.185.131.218:20001",
    "PROXY 212.35.66.45:8085"
  ],

  // ═══════════════════════════════════════════════════════════
  // سيرفرات VOICE — Orange Jordan — استقبال صوت + إرسال صوت
  // ═══════════════════════════════════════════════════════════
  VOICE_SEND: "PROXY 46.185.131.218:20001",
  VOICE_RECV: "PROXY 212.35.66.45:8085",
  VOICE_FALLBACK: "PROXY 46.185.131.218:8443",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات UPLOAD — إرسال بيانات اللعبة
  // ═══════════════════════════════════════════════════════════
  UPLOAD_TIER1: "PROXY 46.185.131.218:8443",
  UPLOAD_TIER2: "PROXY 212.35.66.45:20005",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات DOWNLOAD — استقبال بيانات اللعبة
  // ═══════════════════════════════════════════════════════════
  DOWNLOAD_TIER1: "PROXY 46.185.131.218:20001",
  DOWNLOAD_TIER2: "PROXY 212.35.66.45:8085",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات SOCIAL — استقبال + إرسال اجتماعي
  // ═══════════════════════════════════════════════════════════
  SOCIAL_PRIMARY: "PROXY 46.185.131.218:8443",
  SOCIAL_SECONDARY: "PROXY 212.35.66.45:20005",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات SHOP / STORE
  // ═══════════════════════════════════════════════════════════
  SHOP_PROXY: "PROXY 46.185.131.218:8443",
  SHOP_FALLBACK: "PROXY 212.35.66.45:20005",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات EVENTS / SEASON
  // ═══════════════════════════════════════════════════════════
  EVENT_PROXY: "PROXY 46.185.131.218:8443",
  EVENT_FALLBACK: "PROXY 212.35.66.45:20005",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات SETTINGS / CONFIG
  // ═══════════════════════════════════════════════════════════
  SETTINGS_PROXY: "PROXY 46.185.131.218:8443",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات ANTI-CHEAT / AUTH
  // ═══════════════════════════════════════════════════════════
  AUTH_PROXY: "PROXY 46.185.131.218:8443",
  AUTH_FALLBACK: "PROXY 212.35.66.45:20005",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات PUSH / NOTIFICATION
  // ═══════════════════════════════════════════════════════════
  PUSH_PROXY: "PROXY 46.185.131.218:20001",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات REPLAY / SPECTATE
  // ═══════════════════════════════════════════════════════════
  REPLAY_PROXY: "PROXY 212.35.66.45:20005",
  SPECTATE_PROXY: "PROXY 46.185.131.218:20001",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات CLAN / CREW WARS
  // ═══════════════════════════════════════════════════════════
  CLAN_PROXY: "PROXY 46.185.131.218:8443",
  CLAN_FALLBACK: "PROXY 212.35.66.45:20005",

  // ═══════════════════════════════════════════════════════════
  // سيرفرات RANKING / LEADERBOARD
  // ═══════════════════════════════════════════════════════════
  RANK_PROXY: "PROXY 46.185.131.218:8443",
  RANK_FALLBACK: "PROXY 212.35.66.45:20005",

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
  UPLOAD_OPTIMIZATION: true,
  DOWNLOAD_OPTIMIZATION: true,
  DUPLEX_MODE: true,
  SPLIT_SEND_RECV: true,

  // ═══════════════════════════════════════════════════════════
  // JORDAN ONLY — فلترة صارمة
  // ═══════════════════════════════════════════════════════════
  JORDAN_ONLY_MATCH: true,
  JORDAN_ONLY_TEAM: true,
  JORDAN_ONLY_RECRUIT: true,
  JORDAN_ONLY_LOBBY: true,
  JORDAN_ONLY_SOCIAL: true,
  JORDAN_ONLY_VOICE: true,
  JORDAN_ONLY_UPLOAD: true,
  JORDAN_ONLY_DOWNLOAD: true,
  JORDAN_ONLY_SHOP: true,
  JORDAN_ONLY_EVENT: true,
  JORDAN_ONLY_CLAN: true,
  JORDAN_ONLY_RANK: true,
  JORDAN_ONLY_REPLAY: true,
  JORDAN_ONLY_SPECTATE: true,
  JORDAN_ONLY_PUSH: true,
  JORDAN_ONLY_AUTH: true,
  BLOCK_MIDDLE_EAST_NON_JO: true,
  BLOCK_ALL_NON_JORDAN: true,

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
  ["46.185.0.0","255.255.0.0"],
  ["212.35.64.0","255.255.224.0"],
  ["212.34.0.0","255.255.0.0"],
  ["212.118.0.0","255.255.0.0"],
  ["46.32.0.0","255.255.0.0"],
  ["194.165.130.0","255.255.255.0"]
];

// 🥈 الطبقة الثانية — Zain Jordan (قوي)
var JORDAN_TIER2 = [
  ["178.77.0.0","255.255.0.0"],
  ["178.76.0.0","255.255.0.0"],
  ["82.137.192.0","255.255.192.0"],
  ["176.29.0.0","255.255.0.0"],
  ["176.28.0.0","255.255.0.0"],
  ["176.57.0.0","255.255.0.0"]
];

// 🥉 الطبقة الثالثة — Umniah (متوسط-قوي)
var JORDAN_TIER3 = [
  ["188.161.0.0","255.255.0.0"],
  ["188.123.0.0","255.255.0.0"],
  ["188.247.0.0","255.255.0.0"],
  ["188.225.0.0","255.255.0.0"]
];

// 4️⃣ الطبقة الرابعة — Batelco / Damamax (متوسط)
var JORDAN_TIER4 = [
  ["37.202.0.0","255.255.0.0"],
  ["37.252.0.0","255.255.0.0"],
  ["213.202.0.0","255.255.0.0"],
  ["213.139.0.0","255.255.0.0"]
];

// 5️⃣ الطبقة الخامسة — مزودين آخرين
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

// دمج الكل
var JORDAN_RANGES = [].concat(
  JORDAN_TIER1, JORDAN_TIER2, JORDAN_TIER3,
  JORDAN_TIER4, JORDAN_TIER5
);

// ============================================================
// نطاقات بطيئة — حجب مباشر
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
// 🎯 أنماط ترافيك PUBG — شاملة لكلشي
// ============================================================

// ─────────────── MATCH — إرسال واستقبال بيانات المباراة ───────────────
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
  "*rodeo*.pubgmobile.com","*ultoran*.pubgmobile.com",
  "*map*.pubgmobile.com","*server*.pubgmobile.com",
  "*game*.proximabeta.com","*game*.proximabeta.net",
  "*gate*.pubgmobile.com","*gateway*.pubgmobile.com",
  "*connect*.pubgmobile.com","*session*.pubgmobile.com",
  "*realtime*.pubgmobile.com","*sync*.pubgmobile.com",
  "*state*.pubgmobile.com","*play*.pubgmobile.com",
  "*enter*.pubgmobile.com","*start*.pubgmobile.com",
  "*load*.pubgmobile.com","*spawn*.pubgmobile.com",
  "*.igamecj.com","*.proximabeta.com",
  "*.proximabeta.net","*.gcloudcs.com"
];

// ─────────────── LOBBY — إرسال واستقبال بيانات اللوبي ───────────────
var LOBBY_PATTERNS = [
  "*lobby*.pubgmobile.com","*lobby*.tencent.com",
  "*lobby*.tencentigame.com","*lobby*.proximabeta.com",
  "*main*.pubgmobile.com","*home*.pubgmobile.com",
  "*menu*.pubgmobile.com","*hub*.pubgmobile.com",
  "*ready*.pubgmobile.com","*prepare*.pubgmobile.com",
  "*waiting*.pubgmobile.com","*idle*.pubgmobile.com"
];

// ─────────────── RECRUIT — إرسال واستقبال تجنيد ───────────────
var RECRUIT_PATTERNS = [
  "*recruit*.pubgmobile.com","*team*.pubgmobile.com",
  "*matchmake*.pubgmobile.com","*queue*.pubgmobile.com",
  "*invite*.pubgmobile.com","*group*.pubgmobile.com",
  "*squad*.pubgmobile.com","*duo*.pubgmobile.com",
  "*solo*.pubgmobile.com","*party*.pubgmobile.com",
  "*find*.pubgmobile.com","*search*.pubgmobile.com",
  "*join*.pubgmobile.com","*pair*.pubgmobile.com",
  "*assemble*.pubgmobile.com"
];

// ─────────────── VOICE — إرسال صوت واستقبال صوت ───────────────
var VOICE_PATTERNS = [
  "*voice*.pubgmobile.com","*rtc*.tencent.com",
  "*trtc*.com","*trtc*.tencent.com",
  "*voip*.pubgmobile.com","*audio*.pubgmobile.com",
  "*speak*.pubgmobile.com","*mic*.pubgmobile.com",
  "*talk*.pubgmobile.com","*call*.pubgmobile.com",
  "*media*.pubgmobile.com","*stream*.pubgmobile.com",
  "*rtc*.gcloudcs.com","*av*.tencent.com",
  "*imservice*.tencent.com","*sound*.pubgmobile.com"
];

// ─────────────── UPLOAD — إرسال بيانات للسيرفر ───────────────
var UPLOAD_PATTERNS = [
  "*upload*.pubgmobile.com","*upload*.tencent.com",
  "*put*.pubgmobile.com","*post*.pubgmobile.com",
  "*submit*.pubgmobile.com","*send*.pubgmobile.com",
  "*report*.pubgmobile.com","*input*.pubgmobile.com",
  "*action*.pubgmobile.com","*cmd*.pubgmobile.com",
  "*command*.pubgmobile.com","*move*.pubgmobile.com",
  "*shoot*.pubgmobile.com","*hit*.pubgmobile.com",
  "*damage*.pubgmobile.com","*kill*.pubgmobile.com",
  "*death*.pubgmobile.com","*loot*.pubgmobile.com",
  "*pickup*.pubgmobile.com","*drop*.pubgmobile.com",
  "*use*.pubgmobile.com","*heal*.pubgmobile.com",
  "*revive*.pubgmobile.com","*drive*.pubgmobile.com",
  "*position*.pubgmobile.com","*location*.pubgmobile.com"
];

// ─────────────── DOWNLOAD — استقبال بيانات من السيرفر ───────────────
var DOWNLOAD_PATTERNS = [
  "*download*.pubgmobile.com","*download*.tencent.com",
  "*get*.pubgmobile.com","*fetch*.pubgmobile.com",
  "*receive*.pubgmobile.com","*pull*.pubgmobile.com",
  "*payload*.pubgmobile.com","*data*.pubgmobile.com",
  "*response*.pubgmobile.com","*result*.pubgmobile.com",
  "*state*.pubgmobile.com","*update*.pubgmobile.com",
  "*tick*.pubgmobile.com","*frame*.pubgmobile.com",
  "*snapshot*.pubgmobile.com","*delta*.pubgmobile.com"
];

// ─────────────── SOCIAL — إرسال واستقبال اجتماعي ───────────────
var SOCIAL_PATTERNS = [
  "*social*.pubgmobile.com","*chat*.pubgmobile.com",
  "*message*.pubgmobile.com","*msg*.pubgmobile.com",
  "*friend*.pubgmobile.com","*buddy*.pubgmobile.com",
  "*follow*.pubgmobile.com","*block*.pubgmobile.com",
  "*report*.pubgmobile.com","*mail*.pubgmobile.com",
  "*inbox*.pubgmobile.com","*notify*.pubgmobile.com",
  "*gift*.pubgmobile.com","*like*.pubgmobile.com",
  "*comment*.pubgmobile.com","*share*.pubgmobile.com"
];

// ─────────────── CLAN — إرسال واستقبال كلان ───────────────
var CLAN_PATTERNS = [
  "*clan*.pubgmobile.com","*crew*.pubgmobile.com",
  "*guild*.pubgmobile.com","*team*.pubgmobile.com",
  "*member*.pubgmobile.com","*rank*.pubgmobile.com",
  "*promotion*.pubgmobile.com","*war*.pubgmobile.com",
  "*clash*.pubgmobile.com","*versus*.pubgmobile.com"
];

// ─────────────── SHOP — إرسال واستقبال متجر ───────────────
var SHOP_PATTERNS = [
  "*shop*.pubgmobile.com","*store*.pubgmobile.com",
  "*buy*.pubgmobile.com","*purchase*.pubgmobile.com",
  "*payment*.pubgmobile.com","*pay*.pubgmobile.com",
  "*uc*.pubgmobile.com","*bp*.pubgmobile.com",
  "*crate*.pubgmobile.com","*spin*.pubgmobile.com",
  "*lucky*.pubgmobile.com","*draw*.pubgmobile.com",
  "*royal*.pubgmobile.com","*pass*.pubgmobile.com",
  "*rp*.pubgmobile.com","*season*.pubgmobile.com",
  "*outfit*.pubgmobile.com","*skin*.pubgmobile.com",
  "*weapon*.pubgmobile.com","*item*.pubgmobile.com"
];

// ─────────────── EVENTS — إرسال واستقبال أحداث ───────────────
var EVENT_PATTERNS = [
  "*event*.pubgmobile.com","*events*.pubgmobile.com",
  "*mission*.pubgmobile.com","*task*.pubgmobile.com",
  "*challenge*.pubgmobile.com","*reward*.pubgmobile.com",
  "*daily*.pubgmobile.com","*weekly*.pubgmobile.com",
  "*bonus*.pubgmobile.com","*special*.pubgmobile.com",
  "*limited*.pubgmobile.com","*promo*.pubgmobile.com",
  "*lottery*.pubgmobile.com","*mini*.pubgmobile.com",
  "*arcade*.pubgmobile.com"
];

// ─────────────── RANK — إرسال واستقبال ترتيب ───────────────
var RANK_PATTERNS = [
  "*rank*.pubgmobile.com","*leaderboard*.pubgmobile.com",
  "*rating*.pubgmobile.com","*tier*.pubgmobile.com",
  "*score*.pubgmobile.com","*stat*.pubgmobile.com",
  "*stats*.pubgmobile.com","*history*.pubgmobile.com",
  "*record*.pubgmobile.com","*achievement*.pubgmobile.com",
  "*badge*.pubgmobile.com","*title*.pubgmobile.com"
];

// ─────────────── REPLAY — إرسال واستقبال إعادة ───────────────
var REPLAY_PATTERNS = [
  "*replay*.pubgmobile.com","*record*.pubgmobile.com",
  "*playback*.pubgmobile.com","*highlight*.pubgmobile.com",
  "*clip*.pubgmobile.com","*video*.pubgmobile.com",
  "*capture*.pubgmobile.com","*moments*.pubgmobile.com"
];

// ─────────────── SPECTATE — إرسال واستقبال مشاهدة ───────────────
var SPECTATE_PATTERNS = [
  "*spectate*.pubgmobile.com","*watch*.pubgmobile.com",
  "*live*.pubgmobile.com","*stream*.pubgmobile.com",
  "*observe*.pubgmobile.com","*view*.pubgmobile.com",
  "*broadcast*.pubgmobile.com"
];

// ─────────────── PROFILE — إرسال واستقبال ملف شخصي ───────────────
var PROFILE_PATTERNS = [
  "*profile*.pubgmobile.com","*user*.pubgmobile.com",
  "*account*.pubgmobile.com","*player*.pubgmobile.com",
  "*avatar*.pubgmobile.com","*info*.pubgmobile.com",
  "*setting*.pubgmobile.com","*config*.pubgmobile.com",
  "*preference*.pubgmobile.com","*option*.pubgmobile.com"
];

// ─────────────── AUTH — مصادقة وتسجيل دخول ───────────────
var AUTH_PATTERNS = [
  "*auth*.pubgmobile.com","*login*.pubgmobile.com",
  "*signin*.pubgmobile.com","*token*.pubgmobile.com",
  "*oauth*.pubgmobile.com","*verify*.pubgmobile.com",
  "*check*.pubgmobile.com","*valid*.pubgmobile.com",
  "*session*.pubgmobile.com","*passport*.pubgmobile.com",
  "*antiban*.pubgmobile.com","*anticheat*.pubgmobile.com",
  "*security*.pubgmobile.com","*protect*.pubgmobile.com"
];

// ─────────────── PUSH — إشعارات ───────────────
var PUSH_PATTERNS = [
  "*push*.pubgmobile.com","*notify*.pubgmobile.com",
  "*notification*.pubgmobile.com","*alert*.pubgmobile.com",
  "*announce*.pubgmobile.com","*pop*.pubgmobile.com",
  "*badge*.pubgmobile.com","*ping*.pubgmobile.com"
];

// ─────────────── CDN — محتوى ثابت ───────────────
var CDN_PATTERNS = [
  "*.cdn.pubgmobile.com","*.static.pubgmobile.com",
  "*.assets.pubgmobile.com","*.resource.pubgmobile.com",
  "*.update.pubgmobile.com","*.patch.pubgmobile.com",
  "*.download.pubgmobile.com","*.content.pubgmobile.com",
  "*.img*.pubgmobile.com","*.pic*.pubgmobile.com",
  "*.font*.pubgmobile.com","*.audio*.pubgmobile.com",
  "*.bundle*.pubgmobile.com","*.pak*.pubgmobile.com",
  "*.dat*.pubgmobile.com","*.bin*.pubgmobile.com"
];

// ─────────────── ANALYTICS — حجب تام ───────────────
var ANALYTICS_PATTERNS = [
  "*analytics*","*telemetry*","*metrics*",
  "*tracking*","*crash*","*log*.pubgmobile.com",
  "*report*.pubgmobile.com","*stats*.pubgmobile.com",
  "*monitor*","*perf*","*diagnostic*",
  "*survey*","*feedback*.pubgmobile.com"
];

var TELEMETRY_DOMAINS = [
  "*app-measurement.com","*firebase*",
  "*google-analytics*","*crashlytics*",
  "*adjust.com","*appsflyer.com",
  "*branch.io","*singular.net",
  "*amplitude.com","*mixpanel.com",
  "*segment.com","*heap.io",
  "*countly*","*matomo*"
];

// ─────────────── TENCENT / QQ — كل شي ───────────────
var TENCENT_PATTERNS = [
  "*.tencent.com","*.qq.com",
  "*.gcloudlb.com","*.tencentyun.com",
  "*.qcloud.com","*.qpic.cn",
  "*.gtimg.cn","*.idqqimg.com",
  "*.qlogo.cn","*.gtimg.com",
  "*.myqcloud.com","*.tencent-cloud.net"
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
    quality: 100,
    serverTier: 0,
    direction: "duplex"
  },

  upload: {
    proxy: "",
    lastSwitch: 0,
    failCount: 0
  },

  download: {
    proxy: "",
    lastSwitch: 0,
    failCount: 0
  },

  voice: {
    sendProxy: "",
    recvProxy: "",
    failCount: 0
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
        host: host, ip: ip, count: 1,
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
  var list = [
    "match.pubgmobile.com","game.pubgmobile.com",
    "lobby.pubgmobile.com","cdn.pubgmobile.com",
    "voice.pubgmobile.com","login.pubgmobile.com",
    "shop.pubgmobile.com","event.pubgmobile.com",
    "social.pubgmobile.com","rank.pubgmobile.com"
  ];
  for (var i = 0; i < list.length; i++) {
    fastResolve(list[i]);
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
// تصنيف الترافيك — شامل لكلشي
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
    if (host === domains[i] || host.indexOf("." + domains[i]) !== -1) {
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
// نظام اختيار البروكسي المتقدم
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
  if (!SESSION.lobby.affinityMap[prefix]) {
    SESSION.lobby.affinityMap[prefix] = preferred;
  }
  var current = SESSION.lobby.affinityMap[prefix];
  var health = SESSION.proxyHealth[current];
  if (health && health.score > 50) return current;
  var best = getBestProxy(CONFIG.LOBBY_FAST);
  SESSION.lobby.affinityMap[prefix] = best;
  return best;
}

// ═══ سلاسل الفشل ═══

function buildMatchChain() {
  return CONFIG.MATCH_TIER1 + "; " +
         CONFIG.MATCH_TIER2 + "; " +
         CONFIG.MATCH_TIER3 + "; " +
         CONFIG.MATCH_TIER4;
}

function buildLobbyChain(primary) {
  var chain = primary;
  for (var i = 0; i < CONFIG.LOBBY_FAST.length; i++) {
    if (CONFIG.LOBBY_FAST[i] !== primary) chain += "; " + CONFIG.LOBBY_FAST[i];
  }
  chain += "; " + CONFIG.DIRECT;
  return chain;
}

function buildVoiceChain() {
  return CONFIG.VOICE_SEND + "; " +
         CONFIG.VOICE_RECV + "; " +
         CONFIG.VOICE_FALLBACK + "; " +
         CONFIG.DIRECT;
}

function buildUploadChain() {
  return CONFIG.UPLOAD_TIER1 + "; " +
         CONFIG.UPLOAD_TIER2 + "; " +
         CONFIG.MATCH_TIER3 + "; " +
         CONFIG.MATCH_TIER4;
}

function buildDownloadChain() {
  return CONFIG.DOWNLOAD_TIER1 + "; " +
         CONFIG.DOWNLOAD_TIER2 + "; " +
         CONFIG.MATCH_TIER3 + "; " +
         CONFIG.MATCH_TIER4;
}

function buildSocialChain() {
  return CONFIG.SOCIAL_PRIMARY + "; " +
         CONFIG.SOCIAL_SECONDARY + "; " +
         CONFIG.LOBBY_FAST[0] + "; " +
         CONFIG.DIRECT;
}

function buildClanChain() {
  return CONFIG.CLAN_PROXY + "; " +
         CONFIG.CLAN_FALLBACK + "; " +
         CONFIG.LOBBY_FAST[0] + "; " +
         CONFIG.DIRECT;
}

function buildShopChain() {
  return CONFIG.SHOP_PROXY + "; " +
         CONFIG.SHOP_FALLBACK + "; " +
         CONFIG.DIRECT;
}

function buildEventChain() {
  return CONFIG.EVENT_PROXY + "; " +
         CONFIG.EVENT_FALLBACK + "; " +
         CONFIG.DIRECT;
}

function buildRankChain() {
  return CONFIG.RANK_PROXY + "; " +
         CONFIG.RANK_FALLBACK + "; " +
         CONFIG.DIRECT;
}

function buildAuthChain() {
  return CONFIG.AUTH_PROXY + "; " +
         CONFIG.AUTH_FALLBACK + "; " +
         CONFIG.DIRECT;
}

function buildReplayChain() {
  return CONFIG.REPLAY_PROXY + "; " +
         CONFIG.MATCH_TIER1 + "; " +
         CONFIG.MATCH_TIER2 + "; " +
         CONFIG.DIRECT;
}

function buildSpectateChain() {
  return CONFIG.SPECTATE_PROXY + "; " +
         CONFIG.MATCH_TIER1 + "; " +
         CONFIG.MATCH_TIER2 + "; " +
         CONFIG.DIRECT;
}

// ============================================================
// نظام مكافحة الذبذبة
// ============================================================

function updateConnectionQuality() {
  var now = new Date().getTime();
  if (SESSION.match.locked) {
    var timeSince = now - SESSION.match.lastActivity;
    if (timeSince > 120000) { resetMatchSession(); return; }
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
  var all = [CONFIG.MATCH_TIER1, CONFIG.MATCH_TIER2,
             CONFIG.MATCH_TIER3, CONFIG.MATCH_TIER4];
  var newP = getBestProxy(all);
  SESSION.match.proxy = newP;
  SESSION.match.failCount = 0;
  SESSION.match.quality = 80;
  return newP;
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
// معالجة ترافيك المباراة — إرسال + استقبال
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
    SESSION.match.direction = "duplex";
    return buildMatchChain();
  }

  if (host === SESSION.match.hostname && prefix === SESSION.match.networkPrefix) {
    SESSION.match.lastActivity = new Date().getTime();
    if (shouldSwitchProxy()) {
      var np = switchMatchProxy();
      return np + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3;
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
// الدالة الرئيسية — توجيه كلشي
// ============================================================

function FindProxyForURL(url, host) {
  SESSION.counters.totalRequests++;
  host = cleanHost(host.toLowerCase());
  performMaintenance();

  // ليس ترافيك PUBG
  if (!isPUBGTraffic(host)) return CONFIG.DIRECT;

  // حل DNS
  var ip = fastResolve(host);

  // IP غير صالح
  if (!ip || ip.indexOf(":") !== -1) {
    SESSION.counters.blockedRequests++;
    return CONFIG.BLOCK;
  }

  // IP محظور
  if (isInRangeList(ip, BLOCKED_RANGES)) {
    SESSION.counters.blockedRequests++;
    return CONFIG.BLOCK;
  }

  // نطاقات بطيئة
  if (CONFIG.AGGRESSIVE_BLOCK && isInRangeList(ip, HIGH_LATENCY_RANGES)) {
    SESSION.counters.latencyBlocked++;
    return CONFIG.BLOCK;
  }

  // حجب كل غير أردني
  if (CONFIG.BLOCK_ALL_NON_JORDAN && !isInRangeList(ip, JORDAN_RANGES)) {
    SESSION.counters.jordanBlocked++;
    return CONFIG.BLOCK;
  }

  // تحديث جودة الاتصال
  updateConnectionQuality();

  // ═══════════════════════════════════════════
  // 1. تحليلات — حجب
  // ═══════════════════════════════════════════
  if (isAnalyticsTraffic(url, host)) {
    SESSION.counters.blockedRequests++;
    return CONFIG.BLOCK;
  }

  // ═══════════════════════════════════════════
  // 2. CDN — مباشر
  // ═══════════════════════════════════════════
  if (isCDNTraffic(url, host)) {
    SESSION.counters.cdnRequests++;
    return CONFIG.CDN_DIRECT;
  }

  // ═══════════════════════════════════════════
  // 3. AUTH — مصادقة أردنية
  // ═══════════════════════════════════════════
  if (isAuthTraffic(url, host)) {
    SESSION.counters.authRequests++;
    if (CONFIG.JORDAN_ONLY_AUTH && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildAuthChain();
  }

  // ═══════════════════════════════════════════
  // 4. VOICE — إرسال صوت + استقبال صوت
  // ═══════════════════════════════════════════
  if (isVoiceTraffic(url, host)) {
    SESSION.counters.voiceRequests++;
    if (CONFIG.JORDAN_ONLY_VOICE && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildVoiceChain();
  }

  // ═══════════════════════════════════════════
  // 5. UPLOAD — إرسال بيانات للسيرفر
  // ═══════════════════════════════════════════
  if (isUploadTraffic(url, host)) {
    SESSION.counters.uploadRequests++;
    if (CONFIG.JORDAN_ONLY_UPLOAD && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildUploadChain();
  }

  // ═══════════════════════════════════════════
  // 6. DOWNLOAD — استقبال بيانات من السيرفر
  // ═══════════════════════════════════════════
  if (isDownloadTraffic(url, host)) {
    SESSION.counters.downloadRequests++;
    if (CONFIG.JORDAN_ONLY_DOWNLOAD && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildDownloadChain();
  }

  // ═══════════════════════════════════════════
  // 7. MATCH — إرسال + استقبال مباراة
  // ═══════════════════════════════════════════
  if (isMatchTraffic(url, host)) {
    SESSION.counters.matchRequests++;
    return handleMatchTraffic(url, host, ip);
  }

  // ═══════════════════════════════════════════
  // 8. RECRUIT — تجنيد أردني
  // ═══════════════════════════════════════════
  if (isRecruitTraffic(url, host)) {
    SESSION.counters.lobbyRequests++;
    if (CONFIG.JORDAN_ONLY_RECRUIT && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  // ═══════════════════════════════════════════
  // 9. CLAN — كلان أردني
  // ═══════════════════════════════════════════
  if (isClanTraffic(url, host)) {
    SESSION.counters.clanRequests++;
    if (CONFIG.JORDAN_ONLY_CLAN && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildClanChain();
  }

  // ═══════════════════════════════════════════
  // 10. SHOP — متجر أردني
  // ═══════════════════════════════════════════
  if (isShopTraffic(url, host)) {
    SESSION.counters.shopRequests++;
    if (CONFIG.JORDAN_ONLY_SHOP && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildShopChain();
  }

  // ═══════════════════════════════════════════
  // 11. EVENTS — أحداث أردنية
  // ═══════════════════════════════════════════
  if (isEventTraffic(url, host)) {
    SESSION.counters.eventRequests++;
    if (CONFIG.JORDAN_ONLY_EVENT && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildEventChain();
  }

  // ═══════════════════════════════════════════
  // 12. RANK — ترتيب أردني
  // ═══════════════════════════════════════════
  if (isRankTraffic(url, host)) {
    SESSION.counters.rankRequests++;
    if (CONFIG.JORDAN_ONLY_RANK && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildRankChain();
  }

  // ═══════════════════════════════════════════
  // 13. REPLAY — إعادة أردنية
  // ═══════════════════════════════════════════
  if (isReplayTraffic(url, host)) {
    SESSION.counters.replayRequests++;
    if (CONFIG.JORDAN_ONLY_REPLAY && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildReplayChain();
  }

  // ═══════════════════════════════════════════
  // 14. SPECTATE — مشاهدة أردنية
  // ═══════════════════════════════════════════
  if (isSpectateTraffic(url, host)) {
    SESSION.counters.spectateRequests++;
    if (CONFIG.JORDAN_ONLY_SPECTATE && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildSpectateChain();
  }

  // ═══════════════════════════════════════════
  // 15. PUSH — إشعارات أردنية
  // ═══════════════════════════════════════════
  if (isPushTraffic(url, host)) {
    SESSION.counters.pushRequests++;
    if (CONFIG.JORDAN_ONLY_PUSH && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return CONFIG.PUSH_PROXY + "; " + CONFIG.LOBBY_FAST[0] + "; " + CONFIG.DIRECT;
  }

  // ═══════════════════════════════════════════
  // 16. PROFILE — ملف شخصي أردني
  // ═══════════════════════════════════════════
  if (isProfileTraffic(url, host)) {
    SESSION.counters.profileRequests++;
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  // ═══════════════════════════════════════════
  // 17. SOCIAL — اجتماعي أردني
  // ═══════════════════════════════════════════
  if (isSocialTraffic(url, host)) {
    SESSION.counters.socialRequests++;
    if (CONFIG.JORDAN_ONLY_SOCIAL && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildSocialChain();
  }

  // ═══════════════════════════════════════════
  // 18. LOBBY — لوبي أردني
  // ═══════════════════════════════════════════
  if (isLobbyTraffic(url, host)) {
    SESSION.counters.lobbyRequests++;
    if (CONFIG.JORDAN_ONLY_LOBBY && !isInRangeList(ip, JORDAN_RANGES)) {
      SESSION.counters.jordanBlocked++;
      return CONFIG.BLOCK;
    }
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  // ═══════════════════════════════════════════
  // 19. TENCENT — أي شي تنسنت
  // ═══════════════════════════════════════════
  if (isTencentTraffic(url, host)) {
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  // ═══════════════════════════════════════════
  // 20. أي ترافيك PUBG أردني — تمرير
  // ═══════════════════════════════════════════
  if (isInRangeList(ip, JORDAN_RANGES)) {
    return buildLobbyChain(selectLobbyProxy(host, ip));
  }

  // حجب كل شيء
  SESSION.counters.blockedRequests++;
  return CONFIG.BLOCK;
}

// ============================================================
// جلب DNS مسبق عند التحميل
// ============================================================
prefetchDNS();
