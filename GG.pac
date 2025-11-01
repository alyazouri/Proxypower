/**** PAC: PUBG — Jordan-Only (LAN+LL first, Strict JO) v11 ****/
/* الملخص:
   1) استثناءات LAN/Link-Local أولاً (APIPA, RFC1918, CGNAT, loopback, .local/.lan, IPv6 link-local/ULA، وبروكسي-نفسه)
   2) فرض هوية أردنية:
      - اللوبي + الماتش: لازم الوجهة أردنية + ضمن 109.107.0.0/17 حصراً
      - التجنيد/البحث: أردني + ضمن RECRUIT_PRIORITY
      - التحديثات/CDN: أردني عام
   3) أي شيء خارج الأردن = BLOCK_REPLY
*/

/* === عدّل عنوان بروكسيك هنا === */
var PROXY_HOST = "91.106.109.12";

/* === منافذ حسب الفئة === */
var PORTS = {
  LOBBY:           [443, 8443],
  MATCH:           [20001, 20003],
  RECRUIT_SEARCH:  [10012, 10013],
  UPDATES:         [80, 443, 8443],
  CDNS:            [80, 443]
};

/* === أوزان اختيار المنافذ === */
var PORT_WEIGHTS = {
  LOBBY:           [5, 3],
  MATCH:           [3, 2],
  RECRUIT_SEARCH:  [3, 2],
  UPDATES:         [5, 3, 2],
  CDNS:            [3, 2]
};

/* === نطاقات أردنية عامة (للتحقق العام) === */
var JO_IP_RANGES = [
  ["176.16.0.0","176.23.255.255"],
  ["176.47.0.0","176.52.255.255"],
  ["91.176.0.0","91.184.255.255"],
  ["109.86.0.0","109.86.255.255"],
  ["176.97.0.0","176.99.255.255"],
  ["94.64.0.0","94.72.255.255"],
  ["94.104.0.0","94.111.255.255"],
  ["109.128.0.0","109.132.255.255"],
  ["176.40.0.0","176.43.255.255"],
  ["217.96.0.1","217.99.255.255"],
  ["94.56.0.0","94.59.255.255"],
  ["91.93.0.0","91.95.255.255"],
  ["91.109.0.0","91.111.255.255"],
  ["91.191.0.0","91.193.255.255"],
  ["217.20.0.1","217.22.255.255"],
  ["217.52.0.1","217.54.255.255"],
  ["217.136.0.1","217.138.255.255"],
  ["217.142.0.1","217.144.255.255"],
  ["217.163.0.1","217.165.255.255"],
  ["109.82.0.0","109.83.255.255"],
  ["91.86.0.0","91.87.255.255"],
  ["91.132.0.0","91.133.255.255"],
  ["91.198.0.0","91.199.255.255"],
  ["91.227.0.0","91.228.255.255"],
  ["91.230.0.0","91.231.255.255"],
  ["91.244.0.0","91.245.255.255"],
  ["176.12.0.0","176.13.255.255"],
  ["176.54.0.0","176.55.255.255"],
  ["217.12.0.1","217.13.255.255"],
  ["217.30.0.1","217.31.255.255"],
  ["217.72.0.1","217.73.255.255"],
  ["217.156.0.1","217.157.255.255"],
  ["94.50.0.0","94.51.255.255"],
  ["94.128.0.0","94.129.255.255"],
  ["94.134.0.0","94.135.255.255"],
  ["91.84.0.0","91.84.255.255"],
  ["91.104.0.0","91.104.255.255"],
  ["91.107.0.0","91.107.255.255"],
  ["91.120.0.0","91.120.255.255"],
  ["91.122.0.0","91.122.255.255"],
  ["91.126.0.0","91.126.255.255"],
  ["91.135.0.0","91.135.255.255"],
  ["91.143.0.0","91.143.255.255"],
  ["91.147.0.0","91.147.255.255"],
  ["91.149.0.0","91.149.255.255"],
  ["91.186.0.0","91.186.255.255"],
  ["91.189.0.0","91.189.255.255"],
  ["91.204.0.0","91.204.255.255"],
  ["91.206.0.0","91.206.255.255"],
  ["91.209.0.0","91.209.255.255"],
  ["91.225.0.0","91.225.255.255"],
  ["91.235.0.0","91.235.255.255"],
  ["91.238.0.0","91.238.255.255"],
  ["91.252.0.0","91.252.255.255"],
  ["109.104.0.0","109.104.255.255"],
  ["109.125.0.0","109.125.255.255"],
  ["176.8.0.0","176.8.255.255"],
  ["176.33.0.0","176.33.255.255"],
  ["176.58.0.0","176.58.255.255"],
  ["176.65.0.0","176.65.255.255"],
  ["176.67.0.0","176.67.255.255"],
  ["176.72.0.0","176.72.255.255"],
  ["176.81.0.0","176.81.255.255"],
  ["176.88.0.0","176.88.255.255"],
  ["176.93.0.0","176.93.255.255"],
  ["176.115.0.0","176.115.255.255"],
  ["217.8.0.1","217.8.255.255"],
  ["217.18.0.1","217.18.255.255"],
  ["217.27.0.1","217.27.255.255"],
  ["217.61.0.1","217.61.255.255"],
  ["217.64.0.1","217.64.255.255"],
  ["217.70.0.1","217.70.255.255"],
  ["217.79.0.1","217.79.255.255"],
  ["217.119.0.1","217.119.255.255"],
  ["217.129.0.1","217.129.255.255"],
  ["217.132.0.1","217.132.255.255"],
  ["217.147.0.1","217.147.255.255"],
  ["217.154.0.1","217.154.255.255"],
  ["217.160.0.1","217.160.255.255"],
  ["217.168.0.1","217.168.255.255"],
  ["217.170.0.1","217.170.255.255"],
  ["217.175.0.1","217.175.255.255"],
  ["217.178.0.1","217.178.255.255"],
  ["94.16.0.0","94.16.255.255"],
  ["94.20.0.0","94.20.255.255"],
  ["94.25.0.0","94.25.255.255"],
  ["94.27.0.0","94.27.255.255"],
  ["94.77.0.0","94.77.255.255"],
  ["94.102.0.0","94.102.255.255"],
  ["94.119.0.0","94.119.255.255"]
];

/* ـــ نطاق أولوية قصوى للّوبي/الماتش فقط — لرفع نسبة الأردنيين ـــ */
var LOBBY_MATCH_PRIORITY = [
  ["109.107.0.0", "109.107.127.255"]  // 109.107.0.0/17
];

/* ـــ نطاق أولوية للتجنيد/البحث داخل الأردن ـــ */
var RECRUIT_PRIORITY = [
  ["109.107.0.0","109.107.127.255"],
  ["176.16.0.0","176.23.255.255"],
  ["94.64.0.0","94.72.255.255"],
  ["217.96.0.1","217.99.255.255"],
  ["217.20.0.1","217.22.255.255"],
  ["94.104.0.0","94.111.255.255"],
  ["94.56.0.0","94.59.255.255"]
];

/* === سياسات === */
var STRICT_JO_FOR = { LOBBY:true, MATCH:true, RECRUIT_SEARCH:true, UPDATES:true, CDNS:true };
var FORBID_NON_JO = true;
var BLOCK_REPLY = "PROXY 0.0.0.0:0";

/* === Sticky/Cache === */
var STICKY_SALT = "JO_STICKY";
var STICKY_TTL_MINUTES = 60;
var DST_RESOLVE_TTL_MS = 15 * 1000;
var now = new Date().getTime();
var root = (typeof globalThis !== "undefined" ? globalThis : this);
if (!root._PAC_CACHE) root._PAC_CACHE = {};
var CACHE = root._PAC_CACHE;
if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};

/* === نطاقات/نقوش PUBG === */
var PUBG_DOMAINS = {
  LOBBY:          ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:          ["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:        ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDNS:           ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};
var URL_PATTERNS = {
  LOBBY:          ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:          ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:        ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDNS:           ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

/* === دوال مساعدة عامة === */
function isPlainHostName(h){ return (h && h.indexOf('.') == -1); }
function dnsDomainIs_(h, suf){ return (h && h.length >= suf.length && h.substring(h.length - suf.length) == suf); }
function sh(s,p){ return shExpMatch(s,p); }
function isInNet_(host, pattern, mask){
  var ip = null;
  try { ip = dnsResolve(host); } catch(e) { ip = null; }
  if (!ip) return false;
  return isInNet(ip, pattern, mask);
}
function isIPv6LocalLiteral(h){
  if(!h || h.charAt(0) !== "[") return false;
  var x = h.substring(1, h.length-1).toLowerCase();
  if (x === "::1") return true;     // loopback
  if (x.indexOf("fe80:") === 0) return true; // link-local
  if (x.indexOf("fc") === 0 || x.indexOf("fd") === 0) return true; // ULA
  return false;
}
/* استثناءات LAN/Link-Local أولاً */
function isBypass(host){
  if(!host) return true;
  var h = host.toLowerCase();

  // 0) Link-Local IPv4 (APIPA)
  if (isInNet_(h, "169.254.0.0", "255.255.0.0")) return true;

  // 1) محلي/بدون نقطة + نطاقات محلية
  if (isPlainHostName(h)) return true;
  if (dnsDomainIs_(h, ".local") || dnsDomainIs_(h, ".lan")) return true;

  // 2) loopback و IPv6 محلي
  if (sh(h, "localhost") || sh(h, "localhost.*")) return true;
  if (sh(h, "127.*") || sh(h, "[::1]")) return true;
  if (isIPv6LocalLiteral(h)) return true;

  // 3) شبكات داخلية/خاصة
  if (isInNet_(h, "10.0.0.0",    "255.0.0.0"))      return true; // 10/8
  if (isInNet_(h, "172.16.0.0",  "255.240.0.0"))    return true; // 172.16/12
  if (isInNet_(h, "192.168.0.0", "255.255.0.0"))    return true; // 192.168/16
  if (isInNet_(h, "100.64.0.0",  "255.192.0.0"))    return true; // CGNAT 100.64/10
  if (isInNet_(h, "198.18.0.0",  "255.254.0.0"))    return true; // 198.18/15 اختبار

  // 4) لا نعيد توجيه اتصال البروكسي لنفسه
  if (sh(h, PROXY_HOST) || sh(h, "[::ffff:" + PROXY_HOST + "]")) return true;

  return false;
}

/* أدوات شبكية */
function ipToInt(ip){ var p = ip.split("."); return (parseInt(p[0])<<24) + (parseInt(p[1])<<16) + (parseInt(p[2])<<8) + parseInt(p[3]); }
function ipInRangeList(ip, rangeList){
  if (!ip) return false;
  var n = ipToInt(ip);
  for (var i=0;i<rangeList.length;i++){
    var s = ipToInt(rangeList[i][0]), e = ipToInt(rangeList[i][1]);
    if (n >= s && n <= e) return true;
  }
  return false;
}
function ipInJordan(ip){ return ipInRangeList(ip, JO_IP_RANGES); }
function hostMatchesAnyDomain(h, patterns){
  for (var i=0;i<patterns.length;i++){
    if (shExpMatch(h, patterns[i])) return true;
    var p = patterns[i].replace(/^\*\./, ".");
    if (h.slice(-p.length) === p) return true;
  }
  return false;
}
function pathMatches(u, patterns){
  for (var i=0;i<patterns.length;i++){ if (shExpMatch(u, patterns[i])) return true; }
  return false;
}
function weightedPick(ports, weights){
  var sum=0; for (var i=0;i<weights.length;i++) sum += (weights[i]||1);
  var r = Math.floor(Math.random()*sum)+1, acc=0;
  for (var k=0;k<ports.length;k++){ acc += (weights[k]||1); if (r<=acc) return ports[k]; }
  return ports[0];
}
function proxyForCategory(cat){
  var key = STICKY_SALT+"_PORT_"+cat;
  var ttl = STICKY_TTL_MINUTES*60*1000;
  var e   = CACHE._PORT_STICKY[key];
  if (e && (now-e.t)<ttl) return "PROXY "+PROXY_HOST+":"+e.p;
  var p = weightedPick(PORTS[cat], PORT_WEIGHTS[cat]);
  CACHE._PORT_STICKY[key] = {p:p, t:now};
  return "PROXY "+PROXY_HOST+":"+p;
}
function resolveDstCached(h, ttl){
  if (!h) return "";
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
  var c = CACHE.DST_RESOLVE_CACHE[h];
  if (c && (now-c.t)<ttl) return c.ip;
  var r = dnsResolve(h);
  var ip = (r && r !== "0.0.0.0") ? r : "";
  CACHE.DST_RESOLVE_CACHE[h] = {ip:ip,t:now};
  return ip;
}

/* === التحقّق من هوية العميل والبروكسي (أردنيين) === */
function clientIsJO(){
  var geoTTL = STICKY_TTL_MINUTES*60*1000;
  var key = STICKY_SALT+"_CLIENT_JO";
  var e = CACHE[key];
  if (e && (now-e.t)<geoTTL) return e.ok;
  var ok = ipInJordan(resolveDstCached(myIpAddress(), DST_RESOLVE_TTL_MS));
  CACHE[key] = {ok:ok,t:now};
  return ok;
}
function proxyIsJO(){ return ipInJordan(PROXY_HOST); }

/* === قرارات حسب الفئة === */
function requireLobbyMatchPriority(cat, h){
  var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
  if (!ipInJordan(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  if (!ipInRangeList(ip, LOBBY_MATCH_PRIORITY)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  return proxyForCategory(cat);
}
function requireRecruitPriority(h){
  var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
  if (!ipInJordan(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  if (!ipInRangeList(ip, RECRUIT_PRIORITY)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  return proxyForCategory("RECRUIT_SEARCH");
}
function requireJordanGeneric(cat, h){
  var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
  if (!ipInJordan(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  return proxyForCategory(cat);
}

/* === القرار النهائي === */
function FindProxyForURL(url, host){
  host = host || "";

  /* 0) استثناءات LAN/Link-Local أولاً (يبدأ من APIPA 169.254/16) */
  if (isBypass(host)) return "DIRECT";

  /* 1) العميل والبروكسي لازم أردنيين */
  if (!(clientIsJO() && proxyIsJO())) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";

  /* 2) القرار حسب الـURL */
  if (pathMatches(url, URL_PATTERNS.LOBBY))          return requireLobbyMatchPriority("LOBBY", host);
  if (pathMatches(url, URL_PATTERNS.MATCH))          return requireLobbyMatchPriority("MATCH", host);
  if (pathMatches(url, URL_PATTERNS.RECRUIT_SEARCH)) return requireRecruitPriority(host);
  if (pathMatches(url, URL_PATTERNS.UPDATES))        return requireJordanGeneric("UPDATES", host);
  if (pathMatches(url, URL_PATTERNS.CDNS))           return requireJordanGeneric("CDNS", host);

  /* 3) القرار حسب الدومينات */
  var h = host.toLowerCase();
  if (hostMatchesAnyDomain(h, PUBG_DOMAINS.LOBBY))          return requireLobbyMatchPriority("LOBBY", host);
  if (hostMatchesAnyDomain(h, PUBG_DOMAINS.MATCH))          return requireLobbyMatchPriority("MATCH", host);
  if (hostMatchesAnyDomain(h, PUBG_DOMAINS.RECRUIT_SEARCH)) return requireRecruitPriority(host);
  if (hostMatchesAnyDomain(h, PUBG_DOMAINS.UPDATES))        return requireJordanGeneric("UPDATES", host);
  if (hostMatchesAnyDomain(h, PUBG_DOMAINS.CDNS))           return requireJordanGeneric("CDNS", host);

  /* 4) فحص الهدف إذا IP مباشر */
  var dst = /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS);
  if (dst && ipInRangeList(dst, LOBBY_MATCH_PRIORITY)) return proxyForCategory("LOBBY");
  if (dst && ipInRangeList(dst, RECRUIT_PRIORITY))     return proxyForCategory("RECRUIT_SEARCH");
  if (dst && ipInJordan(dst))                          return proxyForCategory("UPDATES");

  /* 5) أي شيء غير أردني: بلوك (غيره إلى "DIRECT" إذا بدك تسمح) */
  return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
}
