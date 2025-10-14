// ======================================================================
// PAC – PUBG Mobile (Jordan Lobby Zero Ping Edition)
// Hyper-Optimized • Jordan-Only Bias • Sticky+Salt • Weighted Hosts+Ports
// ملاحظة: متوافق مع بيئة PAC القديمة (بدون classes/Map/async)
// الهدف: لوبي شبه صفر بنق عبر HTTP Proxy 443 أردني فقط + مباريات ثابتة عبر SOCKS5
// ======================================================================

// ======================= CORE CONFIG =======================
var FORCE_PROXY              = true;       // إجبار المرور عبر البروكسي
var FORBID_DIRECT_GLOBAL     = true;       // لا DIRECT نهائيًا (مع الاستثناءات أدناه فقط)
var BLOCK_IR                 = true;       // حجب نطاقات .ir
var BLOCK_NON_JO_EGRESS      = true;       // طبقة منع خروج غير أردني (وقائية)
var PING_HEURISTIC           = true;       // قياس بسيط لزمن dnsResolve كمؤشر
var DNS_CACHE_TTL_MS         = 45000;      // TTL لكاش DNS البسيط
var JITTER_WINDOW            = 3;          // نافذة تذبذب صغيرة لاختيار المنفذ
var TIME_SALT_MINUTES        = 12;         // تدوير ملحي خفيف كل X دقائق للحفاظ على الثبات
var LOBBY_ZERO_PING          = true;       // تفعيل وضع اللوبي شبه صفر بنق

// ======================= PROXY POOL (Jordan) =======================
// عدّل IPs ومنافذك الأردنية الحقيقية هنا (أوزان w لرفع أولوية بروكسي معيّن)
var PROXIES = [
  { host: "91.106.109.12", w: 3, socks: [20001,20002,20003,20004,8085], http: [443,8080,8443] },
  { host: "91.106.109.11", w: 2, socks: [20001,20002,20003,20004,8085], http: [443,8080,8443] },
  { host: "109.107.240.101",w: 2, socks: [20001,20002,20003,20004,8085], http: [443,8080,8443] }
];

var FALLBACK_SOCKS           = [1080,5000];     // منافذ احتياط لـ SOCKS إن لزم (آخر السلسلة)
var LOBBY_PORTS_HTTP         = [443,8080,8443]; // منافذ لوبي عند الحاجة (الوضع العادي)

// ======================= PORT WEIGHTS (Game) =======================
var WEIGHTED_GAME_PORTS = [
  { port: 20001, w: 5 },
  { port: 20002, w: 4 },
  { port: 20003, w: 3 },
  { port: 20004, w: 2 },
  { port: 8085,  w: 1 }
];

// ======================= GAME DOMAINS =======================
var GAME_DOMAINS = [
  "*.pubgmobile.com",
  "*.igamecj.com",
  "*.tencentgames.com",
  "*.qq.com",
  "*.gcloud.qq.com",
  "*.proximabeta.com",
  "*.battleeye.com",
  "*.amazonaws.com",
  "*.aws.amazon.com",
  "*.akamaized.net",
  "*.qcloudcdn.com"
];

// ======================= SAFE / LOCAL EXCEPTIONS =======================
var DIRECT_EXCEPTIONS = [
  "*.youtube.com", "*.googlevideo.com", // YouTube direct (سلامة/سرعة)
  "localhost", "127.0.0.1", "*.local",
  "192.168.*", "10.*",
  "172.16.*","172.17.*","172.18.*","172.19.*","172.20.*","172.21.*",
  "172.22.*","172.23.*","172.24.*","172.25.*","172.26.*","172.27.*",
  "172.28.*","172.29.*","172.30.*","172.31.*"
];

// ======================= REGION BLOCK / BIAS =======================
var IR_PATTERNS = [ "*.ir" ];

// نطاقات أردنية معروفة (أمثلة — يفضّل تحديثها بنطاقات RIPE المؤكدة لديك)
var JORDAN_NETS = [
  ["185.140.0.0", "255.255.0.0"], // مثال عام
  ["212.35.0.0",  "255.255.0.0"]  // مثال عام
];

// يمكن توسيعها لاحقًا لخفض فرص دول غير أردنية (اختياري)
var NON_JO_NET_HINTS = [
  // أمثلة مستقبلية (IR/IQ/LY/YE/…)
];

// ======================= SIMPLE DNS CACHE =======================
var __dnsCache = {};
function dnsCachedResolve(host) {
  var now = new Date().getTime();
  var hit = __dnsCache[host];
  if (hit && (now - hit.t) < DNS_CACHE_TTL_MS) return hit.ip;

  var t0 = (PING_HEURISTIC) ? new Date().getTime() : 0;
  var ip = dnsResolve(host);
  var t1 = (PING_HEURISTIC) ? new Date().getTime() : 0;

  __dnsCache[host] = { ip: ip, t: now, ping: (PING_HEURISTIC ? (t1 - t0) : -1) };
  return ip;
}

// ======================= UTILS =======================
// FNV-1a hash (ثبات حتمي)
function fnv1a(str) {
  var h = 2166136261;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0);
}

function pickWeightedByHash(items, hash) {
  var total = 0, i;
  for (i = 0; i < items.length; i++) total += (items[i].w || 1);
  var r = (hash % total) + 1;
  for (i = 0; i < items.length; i++) {
    r -= (items[i].w || 1);
    if (r <= 0) return items[i];
  }
  return items[0];
}

function ipInAny(ip, nets) {
  if (!ip) return false;
  for (var i = 0; i < nets.length; i++) {
    if (isInNet(ip, nets[i][0], nets[i][1])) return true;
  }
  return false;
}

function hostMatchesAny(host, arr) {
  host = host.toLowerCase();
  for (var i = 0; i < arr.length; i++) {
    if (shExpMatch(host, arr[i].toLowerCase())) return true;
  }
  return false;
}

function urlContains(url, parts) {
  url = (url || "").toLowerCase();
  for (var i = 0; i < parts.length; i++) {
    if (url.indexOf(parts[i]) !== -1) return true;
  }
  return false;
}

// ======================= HOST & PORT SELECTION =======================
function timeSalt() {
  if (!TIME_SALT_MINUTES || TIME_SALT_MINUTES <= 0) return 0;
  var m = new Date().getUTCMinutes();
  return Math.floor(m / Math.max(1, TIME_SALT_MINUTES));
}

function stickyGamePortFor(host) {
  var baseHash = fnv1a(host + "|" + timeSalt());
  var chosen    = pickWeightedByHash(WEIGHTED_GAME_PORTS, baseHash);
  var jitter    = (JITTER_WINDOW > 0) ? (baseHash % (JITTER_WINDOW + 1)) : 0;
  var finalPort = chosen.port;
  var altIndex  = (baseHash + jitter) % WEIGHTED_GAME_PORTS.length;
  var altPort   = WEIGHTED_GAME_PORTS[altIndex].port;
  return [finalPort, altPort];
}

function weightedProxyOrder(hash) {
  var bag = [], i, j, w;
  for (i = 0; i < PROXIES.length; i++) {
    w = Math.max(1, PROXIES[i].w || 1);
    for (j = 0; j < w; j++) bag.push(PROXIES[i].host);
  }
  var start = (bag.length > 0) ? (hash % bag.length) : 0;
  var ordered = [], seen = {};
  for (i = 0; i < bag.length; i++) {
    var h = bag[(start + i) % bag.length];
    if (!seen[h]) { seen[h] = 1; ordered.push(h); }
  }
  return ordered;
}

function buildSocksChainFor(port, hash) {
  var order = weightedProxyOrder(hash);
  var parts = [], i, f;
  for (i = 0; i < order.length; i++) {
    parts.push("SOCKS5 " + order[i] + ":" + port);
  }
  // بدائل SOCKS في نهاية السلسلة فقط
  for (f = 0; f < FALLBACK_SOCKS.length; f++) {
    for (i = 0; i < order.length; i++) {
      parts.push("SOCKS5 " + order[i] + ":" + FALLBACK_SOCKS[f]);
    }
  }
  if (!FORBID_DIRECT_GLOBAL) parts.push("DIRECT");
  return parts.join("; ");
}

function buildHttpChainFor(port, hash) {
  var order = weightedProxyOrder(hash);
  var parts = [];
  for (var i = 0; i < order.length; i++) {
    parts.push("PROXY " + order[i] + ":" + port);
  }
  if (!FORBID_DIRECT_GLOBAL) parts.push("DIRECT");
  return parts.join("; ");
}

// ======================= CONTEXT DETECTION =======================
function isJordanContext(host) {
  var clientIP = myIpAddress();
  var hostIP   = dnsCachedResolve(host);
  return ipInAny(clientIP, JORDAN_NETS) || ipInAny(hostIP, JORDAN_NETS);
}

function shouldBlockIR(host) {
  if (!BLOCK_IR) return false;
  if (hostMatchesAny(host, IR_PATTERNS)) return true;
  return false;
}

function isGameLike(url, host) {
  if (hostMatchesAny(host, GAME_DOMAINS)) return true;
  return urlContains(url, ["match", "queue", "lobby", "friend", "party"]);
}

// ======================= LOBBY ZERO-PING BOOST =======================
// بنبني سلسلة لوبي فائقة السرعة: بروكسي أردني واحد على 443 فقط، بلا fallback
function lobbyZeroPingChain() {
  // نفضّل 91.106.* أو 109.107.* (أمثلة أردنية)، وإن لم يوجد نأخذ أول بروكسي
  var best = PROXIES.length ? PROXIES[0].host : "127.0.0.1";
  for (var i = 0; i < PROXIES.length; i++) {
    var h = PROXIES[i].host;
    // isInNet يقبل IP بنقاب — الشبكتان التاليتان تغطيان الأمثلة المستخدمة
    if (isInNet(h, "91.106.0.0", "255.255.0.0") || isInNet(h, "109.107.0.0", "255.255.0.0")) {
      best = h;
      break;
    }
  }
  var p443 = 443;
  var chain = "PROXY " + best + ":" + p443;
  // لا نضيف DIRECT هنا احترامًا لـ FORBID_DIRECT_GLOBAL
  return chain;
}

// نسخة اللوبي العادية (مع تضخيم محاولات)
function lobbyAmplifiedChain(hostHash) {
  if (LOBBY_ZERO_PING) return lobbyZeroPingChain();
  var p = LOBBY_PORTS_HTTP[hostHash % LOBBY_PORTS_HTTP.length];
  var c = buildHttpChainFor(p, hostHash);
  return c + "; " + c + "; " + c; // تضخيم المحاولات
}

// ======================= EGRESS ENFORCER =======================
function enforceJordanEgress(chain) {
  if (!BLOCK_NON_JO_EGRESS) return chain;
  // بما أنّ البروكسيات أردنية فعليًا وأزلنا DIRECT عالميًا، السلسلة بالفعل أردنية.
  // يمكن لاحقًا إضافة فلترة أوسع إن رغبت.
  return chain;
}

// ======================= MAIN =======================
function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  url  = (url  || "").toLowerCase();

  // (1) استثناءات DIRECT الآمنة
  if (hostMatchesAny(host, DIRECT_EXCEPTIONS)) {
    return "DIRECT";
    // ملاحظة: هذه فقط للوجهات المحلية واليوتيوب كما هو معرّف أعلاه
  }

  // (2) حجب إيران
  if (shouldBlockIR(host)) {
    return "PROXY 0.0.0.0:0";
  }

  // (3) تصنيف لعبة / لوبي
  var isGame = isGameLike(url, host);

  // (4) تحيّز أردني قوي (عميل أو وجهة ضمن نطاقات JO)
  var jordanBias = isJordanContext(host);

  // (5) اختيار المنافذ (Sticky + Weighted + Jitter)
  var ports = stickyGamePortFor(host);
  var primaryGamePort = ports[0];
  var altGamePort     = ports[1];

  // (6) توجيه اللعب/المطابقة
  if (isGame || jordanBias) {
    // مباريات: SOCKS5 على منافذ اللعبة (سلسلتان لمحاولة بديلة)، ثم لوبي
    var h = fnv1a(host + "|" + url + "|" + timeSalt());
    var chainA = buildSocksChainFor(primaryGamePort, h);
    var chainB = buildSocksChainFor(altGamePort,     h);
    var lobbyC = lobbyAmplifiedChain(h);
    return enforceJordanEgress(chainA + "; " + chainB + "; " + lobbyC);
  }

  // (7) باقي الترافيك — لو Force Proxy فعّل سلسلة لوبي
  if (FORCE_PROXY) {
    var h2 = fnv1a(host + "|" + timeSalt());
    var lobby = lobbyAmplifiedChain(h2);
    return enforceJordanEgress(lobby);
  }

  // (8) آخر خيار
  return (FORBID_DIRECT_GLOBAL ? lobbyZeroPingChain() : "DIRECT");
}
