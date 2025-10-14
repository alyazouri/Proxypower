// ======================================================================
// PAC – PUBG Mobile (Advanced Proxy Configuration)
// Hyper-Optimized, Jordan-Bias, Sticky Ports, Weighted Selection
// ======================================================================
// ملاحظة: هذا PAC متوافق مع بيئة PAC القديمة (بدون classes/Map/async).
// ======================================================================

// ======================= CORE CONFIG =======================
// (تحرير القيم بحسب بروكسياتك الأردنية)
var FORCE_PROXY              = false;     // إجبار المرور عبر البروكسي
var BLOCK_IR                 = true;     // منع إيران
var FORBID_DIRECT_GLOBAL     = true;     // لا DIRECT (ما عدا الاستثناءات)
var PING_HEURISTIC           = true;     // قياس بسيط لزمن dnsResolve (مؤشر فقط)
var DNS_CACHE_TTL_MS         = 45000;    // TTL للكاش المحلي البسيط
var JITTER_WINDOW            = 3;        // نافذة تذبذب صغيرة على اختيار البورت

// ======================= PROXY POOL (Jordan) =======================
// بروكسيات أردنية (SOCKS5 + HTTP كبدائل)
// أضف/عدّل IPs ومنافذك الحقيقية هنا
var PROXIES = [
  { host: "91.106.109.12", socks: [20001,20002,20003,20004,8085], http: [443,8080,8443] },
  { host: "91.106.109.11", socks: [20001,20002,20003,20004,8085], http: [443,8080,8443] },
  { host: "109.107.240.101", socks:[20001,20002,20003,20004,8085], http: [443,8080,8443] }
];

// ======================= PORT WEIGHTS =======================
// أوزان لتفضيل منافذ أردنية ثابتة للبنق (قابلة للتعديل)
var WEIGHTED_GAME_PORTS = [
  { port: 20001, w: 5 },
  { port: 20002, w: 4 },
  { port: 20003, w: 3 },
  { port: 20004, w: 2 },
  { port: 8085,  w: 1 }
];

var LOBBY_PORTS_HTTP = [443,8080,8443]; // منافذ اللوبي عند الحاجة
var FALLBACK_SOCKS   = [1080,5000];     // منافذ بديلة إن لزم

// ======================= GAME DOMAINS =======================
var GAME_DOMAINS = [
  "*.pubgmobile.com",
  "*.igamecj.com",
  "*.tencentgames.com",
  "*.qq.com",
  "*.gcloud.qq.com",
  "*.proximabeta.com",
  "*.battleeye.com",
  "*.aws.amazon.com",
  "*.amazonaws.com"
];

// ======================= SAFE / LOCAL EXCEPTIONS =======================
// استثناءات تمر DIRECT فقط حتى لو FORCE_PROXY=true
var DIRECT_EXCEPTIONS = [
  "*.youtube.com", "*.googlevideo.com",  // YouTube direct
  "localhost", "127.0.0.1", "*.local",
  "192.168.*", "10.*", "172.16.*", "172.17.*", "172.18.*", "172.19.*",
  "172.20.*", "172.21.*", "172.22.*", "172.23.*", "172.24.*",
  "172.25.*", "172.26.*", "172.27.*", "172.28.*", "172.29.*",
  "172.30.*", "172.31.*"
];

// ======================= IRAN BLOCK PATTERNS =======================
// تبسيط: حجب نطاق .ir + بعض الأنماط العامة
var IR_PATTERNS = [
  "*.ir"
  // يمكن إضافة شبكات IP لاحقاً إن أردت بصيغة isInNet
];

// ======================= JORDAN IP RANGES (expandable) =======================
// صيغ isInNet(ip, pattern, mask)
var JORDAN_NETS = [
  ["185.140.0.0", "255.255.0.0"], // مثال عام
  ["212.35.0.0",  "255.255.0.0"]  // مثال عام
  // أضف نطاقات Orange/Zain/Umniah المؤكدة لديك لاحقاً
];

// ======================= SIMPLE DNS CACHE =======================
// كاش بسيط في الذاكرة (قد يُعاد تحميله حسب المتصفح/النظام)
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

// ======================= UTILS (Arabic + English) =======================
// FNV-1a hash for sticky selection
function fnv1a(str) {
  var h = 2166136261;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  // force uint32
  return (h >>> 0);
}

// اختيار عنصر بناءً على وزن (Deterministic Weighted Pick)
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

// تطابق نطاقات بأقنعة isInNet
function ipInAny(ip, nets) {
  if (!ip) return false;
  for (var i = 0; i < nets.length; i++) {
    if (isInNet(ip, nets[i][0], nets[i][1])) return true;
  }
  return false;
}

// هل المضيف يطابق قائمة الأنماط (سواقة/نطاقات)
function hostMatchesAny(host, arr) {
  host = host.toLowerCase();
  for (var i = 0; i < arr.length; i++) {
    if (shExpMatch(host, arr[i].toLowerCase())) return true;
  }
  return false;
}

// بناء سلسلة بروكسي (Proxy Chain) من لائحة بروكسيات + منفذ واحد
function buildSocksChain(port) {
  var parts = [];
  for (var i = 0; i < PROXIES.length; i++) {
    parts.push("SOCKS5 " + PROXIES[i].host + ":" + port);
  }
  // بدائل SOCKS عامة
  for (i = 0; i < FALLBACK_SOCKS.length; i++) {
    for (var j = 0; j < PROXIES.length; j++) {
      parts.push("SOCKS5 " + PROXIES[j].host + ":" + FALLBACK_SOCKS[i]);
    }
  }
  // لا نضيف DIRECT عادةً
  if (!FORBID_DIRECT_GLOBAL) parts.push("DIRECT");
  return parts.join("; ");
}

function buildHttpChain(port) {
  var parts = [];
  for (var i = 0; i < PROXIES.length; i++) {
    parts.push("PROXY " + PROXIES[i].host + ":" + port);
  }
  if (!FORBID_DIRECT_GLOBAL) parts.push("DIRECT");
  return parts.join("; ");
}

// اختيار بورت ثابت للمضيف + Jitter صغير
function stickyGamePortFor(host) {
  var baseHash = fnv1a(host);
  var chosen    = pickWeightedByHash(WEIGHTED_GAME_PORTS, baseHash);
  var jitter    = (JITTER_WINDOW > 0) ? (baseHash % (JITTER_WINDOW+1)) : 0;
  var finalPort = chosen.port;
  // جرّب تحريك بسيط داخل نفس مجموعة البورتات إن احتجنا
  var altIndex  = (baseHash + jitter) % WEIGHTED_GAME_PORTS.length;
  var altPort   = WEIGHTED_GAME_PORTS[altIndex].port;
  // نُفضّل المختار بالوزن، وإن فشل يحاول العميل البدائل عبر السلسلة
  return [finalPort, altPort];
}

// تحديد إن كان العميل/الوجهة أردني (Jordan bias)
function isJordanContext(host) {
  var clientIP = myIpAddress();
  var hostIP   = dnsCachedResolve(host);
  return ipInAny(clientIP, JORDAN_NETS) || ipInAny(hostIP, JORDAN_NETS);
}

// حجب إيران
function shouldBlockIR(host) {
  if (!BLOCK_IR) return false;
  if (hostMatchesAny(host, IR_PATTERNS)) return true;
  // يمكن لاحقاً إضافة isInNet لفئات IP
  return false;
}

// اختيار سلسلة مناسبة للّوبي
function lobbyChain(host) {
  // Sticky على أول منفذ HTTP مُتاح
  var h = fnv1a(host);
  var p = LOBBY_PORTS_HTTP[h % LOBBY_PORTS_HTTP.length];
  return buildHttpChain(p);
}

// ======================= MAIN (FindProxyForURL) =======================
function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  url  = (url  || "").toLowerCase();

  // 1) استثناءات DIRECT (يوتيوب/محلي)
  if (hostMatchesAny(host, DIRECT_EXCEPTIONS)) {
    return "DIRECT";
  }

  // 2) حجب إيران إن انطبق
  if (shouldBlockIR(host)) {
    return "PROXY 0.0.0.0:0";
  }

  // 3) تصنيف الدومين: هل هو خاص PUBG/اللعب؟
  var isGame = hostMatchesAny(host, GAME_DOMAINS);

  // 4) تحيّز أردني (Jordan bias) – يختار بورتات اللعبة المفضلة
  var jordanBias = isJordanContext(host);

  // 5) اختيار المنافذ (Sticky + Weighted + Jitter)
  var ports = stickyGamePortFor(host);
  var primaryGamePort = ports[0];
  var altGamePort     = ports[1];

  // 6) لو دومين لعبة – استخدم سلسلة SOCKS5 عبر منافذ اللعبة
  if (isGame || jordanBias) {
    var chainA = buildSocksChain(primaryGamePort);
    var chainB = buildSocksChain(altGamePort);
    // نعيد سلسلتين: النظام سيحاول الأولى ثم الثانية تلقائياً
    return chainA + "; " + chainB + "; " + lobbyChain(host);
  }

  // 7) باقي الترافيك – لو Force Proxy نمرره عبر HTTP بروكسي (لوبي)
  if (FORCE_PROXY) {
    return lobbyChain(host);
  }

  // 8) آخر خيار
  return (FORBID_DIRECT_GLOBAL ? lobbyChain(host) : "DIRECT");
}
