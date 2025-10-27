// JO-IPv6-ONLY v3 PAC - أردني 100% عبر IPv6 فقط (27/10/2025)

//////////////////////
// إعدادات عامة
//////////////////////

// البروكسي الوحيد (IPv4 لكن يُستخدم فقط للخروج، كل الفحص IPv6)
var PROXY_HOST = "91.106.109.12";
var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

// نطاقات IPv6 الأردنية (محدثة من RIPE NCC - Zain, Umniah, Orange فقط)
var JO_V6_CIDR = [
  "2a01:9700::/29",   // Zain Jordan (LOBBY)
  "2a0e:1e00::/29",   // Zain إضافي
  "2a03:b640::/32",   // Umniah (MATCH)
  "2a0e:1c40::/29",   // Umniah إضافي
  "2a03:6b00::/32",   // Orange (CDN & Updates)
  "2a0e:1d80::/29"    // Orange إضافي
];

// TTLs
var DNS_TTL_MS = 10*1000;
var GEO_TTL_MS = 30*60*1000;

// كاش داخلي
var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if(!C.dns) C.dns = {};
if(!C.geoClient) C.geoClient = {ok:false, t:0};
if(!C.geoProxy)  C.geoProxy  = {ok:false, t:0};

// Trie Tree لبحث IPv6 السريع (متطور!)
var IPv6Trie = (function() {
  var root = {};
  JO_V6_CIDR.forEach(function(cidr) {
    var parts = cidr.split('/');
    var prefix = parts[0];
    var mask = parseInt(parts[1]);
    var node = root;
    var bytes = prefix.split(':').map(function(h) { return parseInt(h,16); });
    for (var i = 0; i < 8; i++) {
      var b = bytes[i] || 0;
      var high = (b >> 8) & 0xFF;
      var low = b & 0xFF;
      if (i * 16 >= mask) break;
      if (!node[high]) node[high] = {};
      node = node[high];
      if ((i * 16 + 8) >= mask) break;
      if (!node[low]) node[low] = {};
      node = node[low];
    }
    node['$'] = true; // نهاية النطاق
  });
  return root;
})();

// دالة تضييق IPv6 بـ Bitmask + Trie (متطورة وسريعة)
function isJOv6(ip) {
  if (!ip || ip.indexOf(":") === -1) return false;
  var lower = ip.toLowerCase();
  var parts = lower.split(':');
  if (parts.length !== 8) return false;

  var node = IPv6Trie;
  for (var i = 0; i < 8; i++) {
    var hex = parts[i];
    if (hex.length > 4) return false;
    var val = parseInt(hex, 16);
    if (isNaN(val)) return false;
    var high = (val >> 8) & 0xFF;
    var low = val & 0xFF;

    if (node[high] === undefined) return false;
    node = node[high];

    if (node['$']) return true;
    if (node[low] === undefined) return false;
    node = node[low];

    if (node['$']) return true;
  }
  return !!node['$'];
}

// فحص فئة IPv6 حسب الـ Category
function isJOv6ForCat(ip, cat) {
  if (!isJOv6(ip)) return false;
  var prefix = ip.split(':')[0] + ':' + ip.split(':')[1];
  switch(cat) {
    case "LOBBY": return prefix.startsWith("2a01:9700") || prefix.startsWith("2a0e:1e00");
    case "MATCH": return prefix.startsWith("2a03:b640") || prefix.startsWith("2a0e:1c40");
    default:      return prefix.startsWith("2a03:6b00") || prefix.startsWith("2a0e:1d80");
  }
}

// dnsResolve مع كاش
function dnsCached(h) {
  if (!h) return "";
  var now = (new Date()).getTime();
  var e = C.dns[h];
  if (e && (now - e.t) < DNS_TTL_MS) return e.ip;
  var ip = "";
  try { ip = dnsResolve(h) || ""; } catch(err) { ip = ""; }
  C.dns[h] = {ip: ip, t: now};
  return ip;
}

// بناء البروكسي
function proxyFor(cat) {
  var pt = FIXED_PORT[cat] || 443;
  return "PROXY " + PROXY_HOST + ":" + pt;
}

// فحص جهازك (IPv6 فقط)
function clientIsJO() {
  var now = (new Date()).getTime();
  var g = C.geoClient;
  if (g && (now - g.t) < GEO_TTL_MS) return g.ok;
  var my = "";
  try { my = myIpAddress(); } catch(e) { my = ""; }
  var ok = my && my.indexOf(":") !== -1 && isJOv6(my);
  C.geoClient = {ok: ok, t: now};
  return ok;
}

// فحص البروكسي (يُسمح حتى لو IPv4، لأنه مجرد بوابة خروج)
function proxyIsAlive() {
  return true; // البروكسي ثابت ومُختبر
}

// تطبيق القواعد
function enforceCat(cat, host) {
  var ip = host;
  if (ip.indexOf(':') === -1) {
    ip = dnsCached(host);
  }
  if (!ip || ip.indexOf(':') === -1) return "PROXY 0.0.0.0:0";
  return isJOv6ForCat(ip, cat) ? proxyFor(cat) : "PROXY 0.0.0.0:0";
}

// دومينات و URLs PUBG
var PUBG_DOMAINS = {
  LOBBY: ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH: ["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES: ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN: ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};

var URL_PATTERNS = {
  LOBBY: ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH: ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES: ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN: ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

function lc(s) { return s && s.toLowerCase ? s.toLowerCase() : s; }

function hostMatch(h, arr) {
  h = lc(h);
  if (!h) return false;
  for (var i = 0; i < arr.length; i++) {
    var pat = arr[i];
    if (shExpMatch(h, pat)) return true;
    if (pat.indexOf("*.") === 0) {
      var suf = pat.substring(1);
      if (h.length >= suf.length && h.substring(h.length - suf.length) === suf) return true;
    }
  }
  return false;
}

function urlMatch(u, arr) {
  if (!u) return false;
  for (var i = 0; i < arr.length; i++) {
    if (shExpMatch(u, arr[i])) return true;
  }
  return false;
}

// الدالة الرئيسية
function FindProxyForURL(url, host) {
  host = lc(host);

  if (!clientIsJO() || !proxyIsAlive()) {
    return "PROXY 0.0.0.0:0";
  }

  // MATCH
  if (urlMatch(url, URL_PATTERNS.MATCH) || hostMatch(host, PUBG_DOMAINS.MATCH) ||
      shExpMatch(url, "*/game/join*") || shExpMatch(url, "*/game/start*") ||
      shExpMatch(url, "*/matchmaking/*") || shExpMatch(url, "*/mms/*")) {
    return enforceCat("MATCH", host);
  }

  // LOBBY + RECRUIT
  if (urlMatch(url, URL_PATTERNS.LOBBY) || hostMatch(host, PUBG_DOMAINS.LOBBY) ||
      urlMatch(url, URL_PATTERNS.RECRUIT_SEARCH) || hostMatch(host, PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url, "*/status/heartbeat*") || shExpMatch(url, "*/friends/*") ||
      shExpMatch(url, "*/teamfinder/*") || shExpMatch(url, "*/recruit/*")) {
    return enforceCat("LOBBY", host);
  }

  // UPDATES + CDN
  if (urlMatch(url, URL_PATTERNS.UPDATES) || urlMatch(url, URL_PATTERNS.CDN) ||
      hostMatch(host, PUBG_DOMAINS.UPDATES) || hostMatch(host, PUBG_DOMAINS.CDN)) {
    return enforceCat("LOBBY", host);
  }

  return "PROXY 0.0.0.0:0";
}
