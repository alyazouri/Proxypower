// pubg_lobby_match_logic.pac
// منطق:
// - LOBBY الأردني فقط يمر DIRECT
// - MATCH الأجنبي فقط يمر عبر البروكسي 91.106.109.12
// - كل شيء آخر DIRECT

// بروكسي للمباريات الأجنبية
var PROXY = "PROXY 91.106.109.12";
var DIRECT = "DIRECT";

// نطاقات أردنية
var JO_CIDRS = [
["176.16.0.0","176.23.255.255"],
  "109.107.32.0/20",
  "109.107.48.0/21",
  "109.107.64.0/21",
  "109.107.80.0/21",
  "109.107.128.0/23",
  "109.107.130.0/24"
];

// بورتات PUBG
var PORTS = {
  LOBBY:           [443, 8443],
  MATCH:           [20001, 20003],
  RECRUIT_SEARCH:  [10012, 10013],
  UPDATES:         [80, 443, 8443],
  CDNs:            [80, 443]
};

// دومينات PUBG (تُساعدنا نعرف نوع الخدمة)
var PUBG_DOMAINS = {
  LOBBY:           ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:           ["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH:  ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:         ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDNs:            ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};

// ----------------- دوال مساعدة -----------------

function ipToLong(ip) {
  var p = ip.split('.');
  if (p.length != 4) return null;
  return ((parseInt(p[0],10) << 24) >>> 0) |
         ((parseInt(p[1],10) << 16) >>> 0) |
         ((parseInt(p[2],10) << 8) >>> 0) |
         (parseInt(p[3],10) >>> 0);
}

// حضّر شبكات الأردن للـ bitwise match
var JO_PARSED = (function(){
  var out = [];
  for (var i=0;i<JO_CIDRS.length;i++){
    var parts = JO_CIDRS[i].split('/');
    var baseLong = ipToLong(parts[0]);
    if (baseLong === null) continue;
    var prefix = parseInt(parts[1],10);
    var maskLong = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
    var net = (baseLong & maskLong) >>> 0;
    out.push({ net: net, mask: maskLong });
  }
  return out;
})();

// هل IP داخل نطاق أردني؟
function isJordanIP(ip){
  var ipL = ipToLong(ip);
  if (ipL === null) return false;
  for (var i=0;i<JO_PARSED.length;i++){
    var e = JO_PARSED[i];
    if ( (ipL & e.mask) >>> 0 === e.net ) {
      return true;
    }
  }
  return false;
}

// host شكله IPv4 جاهز؟
function isIPv4Literal(h){
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(h);
}

// تطابق دومين مع لستة دومينات بنمط wildcards
function matchDomainList(host, list){
  for (var i=0;i<list.length;i++){
    if (shExpMatch(host, list[i])) return true;
  }
  return false;
}

// استخراج المنفذ من الURL
function extractPort(url){
  // أمثلة: http://host:20001/  https://host/ (443 ضمني)
  var m = url.match(/^[a-z]+:\/\/[^\/:]+:(\d+)/i);
  if (m && m.length > 1) {
    var pr = parseInt(m[1],10);
    if (!isNaN(pr)) return pr;
  }
  return 0;
}

// ----------------- المنطق الرئيسي -----------------

function FindProxyForURL(url, host) {

  // أسماء محلية بدون نقطة (مثلاً intranet) -> DIRECT
  if (isPlainHostName(host)) {
    return DIRECT;
  }

  // حل الـ IP
  var ip = null;
  if (isIPv4Literal(host)) {
    ip = host;
  } else {
    try { ip = dnsResolve(host); } catch(e) { ip = null; }
  }

  // نحدد المنفذ
  var port = extractPort(url);

  // --------- حالة LOBBY ---------
  // if host looks like lobby domains OR port matches lobby ports
  var isLobbyDomain = matchDomainList(host, PUBG_DOMAINS.LOBBY);
  var isLobbyPort   = (PORTS.LOBBY.indexOf(port) !== -1);

  if (isLobbyDomain || isLobbyPort) {
    // اللوبـي الأردني فقط يمر DIRECT
    if (ip && isJordanIP(ip)) {
      return DIRECT; // لُوبي محلي أردني
    } else {
      return DIRECT; // لُوبي غير أردني: حسب طلبك، إحنا ما بنوجهه بروكسي، يعني عادي DIRECT
    }
  }

  // --------- حالة MATCH ---------
  // if host looks like match domains OR port matches match ports
  var isMatchDomain = matchDomainList(host, PUBG_DOMAINS.MATCH);
  var isMatchPort   = (PORTS.MATCH.indexOf(port) !== -1);

  if (isMatchDomain || isMatchPort) {
    // مباريات من برا الأردن فقط تتوجّه عبر البروكسي
    if (ip && !isJordanIP(ip)) {
      return PROXY; // سيرفر أجنبي -> استخدم البروكسي
    } else {
      return DIRECT; // سيرفر أردني (لو حصل) -> بدون بروكسي
    }
  }

  // --------- باقي الأشياء ---------
  // انت ما قلت تبغى يمروا على البروكسي، فبنخليهم DIRECT
  return DIRECT;
}
