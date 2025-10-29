// pubg_jo_hop6.pac
// PAC script — تطبيق "حيلة 3": تقريب hop-6 عبر CIDR قائمة (HOP6_PREFIXES).
// سياسة:
//  - استثناءات محددة (YouTube/Shahid/Facebook/Messenger/WhatsApp) => DIRECT
//  - إذا الوجهة داخل HOP6_PREFIXES (شبكات تمثل hop-6) => DIRECT
//  - بقية PUBG (دومينات/منافذ) => PROXY 91.106.109.12
//  - أي حركة أخرى => PROXY 91.106.109.12

var PROXY = "PROXY 91.106.109.12"; // بدون بورت
var DIRECT = "DIRECT"; // نستخدمه فقط للحالات المستثناة أو hop6

// --- منافذ PUBG ---
var PORTS = {
  LOBBY:           [443, 8443],
  MATCH:           [20001, 20003],
  RECRUIT_SEARCH:  [10012, 10013],
  UPDATES:         [80, 443, 8443],
  CDNs:            [80, 443]
};

// --- دومينات PUBG ---
var PUBG_DOMAINS = {
  LOBBY:           ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:           ["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH:  ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:         ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDNs:            ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};

// --- استثناءات لا تمر عبر البروكسي إطلاقاً ---
var EXCLUDED_DOMAINS = [
  "*.youtube.com","*.ytimg.com","*.googlevideo.com",
  "*.shahid.net","*.mbc.net",
  "*.facebook.com","*.fbcdn.net","*.messenger.com","*.whatsapp.net"
];

// --- نطاقات أردنية (كما عندك) ---
var JO_CIDRS = [
  "109.107.32.0/20",
  "109.107.48.0/21",
  "109.107.64.0/21",
  "109.107.80.0/21",
  "109.107.128.0/23",
  "109.107.130.0/24"
];

// --- HOP6_PREFIXES: مجموعات CIDR نعتبرها مؤشرًا لوجود "hop-6" محلي/مزوّد وسيط
// (هي قائمة تقريبية — إن عندك CIDR محدد للـ hop6 الي تريده ضيفه هنا)
var HOP6_PREFIXES = [
  "94.249.0.0/16",     // مثال: شبكات backbone محلية معروفة (أدخل أي CIDR آخر تعرفه)
  "109.107.224.0/19",  // مثال آخر (إذا عندك CIDR hop6 محدد ضيفه)
  "109.107.32.0/20"    // مكرر من JO_CIDRS إن أردت، لا يؤذي (تمثيل hop-6 محلي)
];

// =====================
// دوال مساعدة قياسية
// =====================
function ipToLong(ip) {
  var p = ip.split('.');
  if (p.length != 4) return null;
  return ((parseInt(p[0],10) << 24) >>> 0) |
         ((parseInt(p[1],10) << 16) >>> 0) |
         ((parseInt(p[2],10) << 8) >>> 0) |
         (parseInt(p[3],10) >>> 0);
}

function parseCidrs(list){
  var out = [];
  for (var i=0;i<list.length;i++){
    var c = list[i].trim();
    if (!c) continue;
    var parts = c.split('/');
    if (parts.length !== 2) continue;
    var base = ipToLong(parts[0]);
    if (base === null) continue;
    var prefix = parseInt(parts[1],10);
    var mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
    var net = (base & mask) >>> 0;
    out.push({net: net, mask: mask});
  }
  return out;
}

var JO_PARSED   = parseCidrs(JO_CIDRS);
var HOP6_PARSED = parseCidrs(HOP6_PREFIXES);

function ipInList(ip, parsedList){
  var ipL = ipToLong(ip);
  if (ipL === null) return false;
  for (var i=0;i<parsedList.length;i++){
    var e = parsedList[i];
    if ((ipL & e.mask) >>> 0 === e.net) return true;
  }
  return false;
}

function isIPv4Literal(h){
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(h);
}

function matchDomainList(host, list){
  for (var i=0;i<list.length;i++){
    if (shExpMatch(host, list[i])) return true;
  }
  return false;
}

// =====================
// المنطق الرئيسي
// =====================
function FindProxyForURL(url, host) {

  // 1) استثناءات (YouTube / Shahid / Facebook / Messenger / WhatsApp)
  if (matchDomainList(host, EXCLUDED_DOMAINS)) {
    return DIRECT;
  }

  // 2) نحاول حل الـ host إلى IP (إن أمكن)
  var ip = null;
  if (isIPv4Literal(host)) {
    ip = host;
  } else {
    try { ip = dnsResolve(host); } catch(e){ ip = null; }
  }

  // 3) إذا الـ IP داخل HOP6_PREFIXES => نعتبرها محلية/قريبة => DIRECT
  if (ip && ipInList(ip, HOP6_PARSED)) {
    return DIRECT;
  }

  // 4) قواعد PUBG (الدومينات)
  for (var cat in PUBG_DOMAINS){
    if (matchDomainList(host, PUBG_DOMAINS[cat])) return PROXY;
  }

  // 5) فحص المنافذ في URL (محاولة استخراج آمنة)
  var port = 0;
  try {
    // نحاول استخراج البورت من URL إن وُجد
    var m = url.match(/^[a-z]+:\/\/[^\/:]+:(\d+)/i);
    if (m && m.length > 1) port = parseInt(m[1],10);
  } catch(e){ port = 0; }

  for (var key in PORTS){
    if (PORTS[key].indexOf(port) !== -1) return PROXY;
  }

  // 6) إذا الوجهة ضمن JO_CIDRS (شبكات أردنية معروفة) -> PROXY (المنطق الأسبق لديك)
  if (ip && ipInList(ip, JO_PARSED)) {
    return PROXY;
  }

  // 7) افتراضيًا: مرر عبر البروكسي (لا يوجد DIRECT افتراضي)
  return PROXY;
}
