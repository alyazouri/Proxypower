/**** PAC: PUBG — Zain + Umniah Residential (Final v3, Media Exclusions + Full Logic) ****/
/* - Zain + Umniah IPv4 ranges only
   - Media exclusions: YouTube, WhatsApp, Snapchat => DIRECT
   - LAN/Link-Local bypass first
   - All PUBG categories routed through the Jordan-only proxy if destination IP ∈ JO_IP_RANGES
   - If destination not in JO_IP_RANGES => PROXY 0.0.0.0:0 (blocked) or DIRECT if FORBID_NON_JO=false
*/

var PROXY_HOST       = "91.106.109.12";   // ← بدّل للـ proxy عندك
var FORBID_NON_JO    = true;              // true => حظر أي هدف خارج JO ranges (PROXY 0.0.0.0:0)
var TRUST_PROXY_IS_JO = false;            // لو متأكد بروكسيك JO ضع true لتفضيل المرور

/* === Media exclusions (DIRECT) === */
var MEDIA_DOMAINS = [
  // YouTube / Google Video
  "*.youtube.com","*.googlevideo.com","*.ytimg.com","youtube.com","youtubei.googleapis.com",
  // WhatsApp
  "*.whatsapp.net","*.whatsapp.com","whatsapp.com","whatsapp.net",
  // Snapchat
  "*.snapchat.com","*.sc-cdn.net","*.snapcdn.io","*.snap-dev.net"
];

/* === Ports & weights === */
var PORTS = {
  LOBBY:           [443, 8443],
  MATCH:           [20001, 20003],
  RECRUIT_SEARCH:  [10012, 10013],
  UPDATES:         [80, 443, 8443],
  CDNS:            [80, 443]
};
var PORT_WEIGHTS = {
  LOBBY:           [5,3],
  MATCH:           [3,2],
  RECRUIT_SEARCH:  [3,2],
  UPDATES:         [5,3,2],
  CDNS:            [3,2]
};

/* === JO IP ranges: Zain (AS48832) + Umniah/Batelco (AS9038) === */
var JO_IP_RANGES = [
  /* Zain */
  ["46.32.96.0","46.32.127.255"],
  ["77.245.0.0","77.245.15.255"],
  ["80.90.160.0","80.90.175.255"],
  ["87.238.128.0","87.238.135.255"],
  ["94.142.32.0","94.142.63.255"],
  ["176.28.128.0","176.28.255.255"],
  ["176.29.0.0","176.29.31.255"],
  ["176.29.128.0","176.29.255.255"],
  ["185.109.192.0","185.109.195.255"],
  ["188.247.64.0","188.247.95.255"],
  ["46.32.101.0","46.32.101.255"],
  ["46.32.100.0","46.32.100.255"],

  /* Umniah / Batelco */
  ["37.152.0.0","37.152.7.255"],
  ["37.220.112.0","37.220.127.255"],
  ["37.220.120.0","37.220.127.255"],
  ["46.23.112.0","46.23.127.255"],
  ["46.248.192.0","46.248.223.255"],
  ["85.159.216.0","85.159.223.255"],
  ["91.106.96.0","91.106.111.255"],
  ["91.186.224.0","91.186.239.255"],
  ["5.45.128.0","5.45.143.255"],
  ["212.35.64.0","212.35.79.255"],
  ["212.118.0.0","212.118.15.255"]
];

/* === PUBG domains & URL patterns === */
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

/* === Helpers === */
function sh(s,p){ return shExpMatch(s,p); }
function dnsDomainIs_(h,suf){ return (h && h.length>=suf.length && h.substring(h.length - suf.length)==suf); }
function isPlainHostName_(h){ return (h && h.indexOf('.')==-1); }
function isIPv6LocalLiteral(h){ if(!h||h.charAt(0)!=="[") return false; var x=h.substring(1,h.length-1).toLowerCase(); if(x==="::1") return true; if(x.indexOf("fe80:")===0) return true; if(x.indexOf("fc")===0||x.indexOf("fd")===0) return true; return false; }
function isInNet_(host, pattern, mask){ var ip=null; try{ ip=dnsResolve(host); }catch(e){ ip=null; } if(!ip) return false; return isInNet(ip, pattern, mask); }

/* check media domain list */
function isMediaHost(host){
  if(!host) return false;
  var h = host.toLowerCase();
  for(var i=0;i<MEDIA_DOMAINS.length;i++){ if (sh(h, MEDIA_DOMAINS[i])) return true; }
  return false;
}

/* LAN / link-local / local names / proxy-self, and media bypass */
function isBypass(host){
  if(!host) return true;
  var h = host.toLowerCase();

  // Media exceptions first
  if (isMediaHost(h)) return true;

  // Link-local IPv4 (APIPA)
  if (isInNet_(h,"169.254.0.0","255.255.0.0")) return true;

  // local names
  if (isPlainHostName_(h)) return true;
  if (dnsDomainIs_(h, ".local") || dnsDomainIs_(h, ".lan")) return true;

  // loopback / IPv6 local
  if (sh(h,"localhost") || sh(h,"localhost.*")) return true;
  if (sh(h,"127.*") || sh(h, "[::1]")) return true;
  if (isIPv6LocalLiteral(h)) return true;

  // RFC1918 / CGNAT / test ranges
  if (isInNet_(h,"10.0.0.0","255.0.0.0")) return true;
  if (isInNet_(h,"172.16.0.0","255.240.0.0")) return true;
  if (isInNet_(h,"192.168.0.0","255.255.0.0")) return true;
  if (isInNet_(h,"100.64.0.0","255.192.0.0")) return true;
  if (isInNet_(h,"198.18.0.0","255.254.0.0")) return true;

  // avoid proxy loop
  if (sh(h, PROXY_HOST) || sh(h, "[::ffff:" + PROXY_HOST + "]")) return true;

  return false;
}

/* IP helpers */
function ipToInt(ip){ var p = ip.split("."); return (parseInt(p[0])<<24) + (parseInt(p[1])<<16) + (parseInt(p[2])<<8) + parseInt(p[3]); }
function ipInRangeList(ip, list){
  if(!ip) return false;
  var n = ipToInt(ip);
  for(var i=0;i<list.length;i++){ var s = ipToInt(list[i][0]), e = ipToInt(list[i][1]); if(n>=s && n<=e) return true; }
  return false;
}
function ipInJordan(ip){ return ipInRangeList(ip, JO_IP_RANGES); }

function hostMatchesAnyDomain(h, patterns){
  if(!h) return false;
  for(var i=0;i<patterns.length;i++){
    if (shExpMatch(h, patterns[i])) return true;
    var p = patterns[i].replace(/^\*\./, ".");
    if (h.slice(-p.length) === p) return true;
  }
  return false;
}
function pathMatches(u, patterns){
  if(!u) return false;
  for(var i=0;i<patterns.length;i++){ if (shExpMatch(u, patterns[i])) return true; }
  return false;
}

/* Cache / Sticky ports */
var STICKY_SALT = "JO_STICKY", STICKY_TTL_MINUTES = 60, DST_RESOLVE_TTL_MS = 15*1000;
var now = new Date().getTime(), root = (typeof globalThis !== "undefined" ? globalThis : this);
if (!root._PAC_CACHE) root._PAC_CACHE = {};
var CACHE = root._PAC_CACHE; if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {}; if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};

function weightedPick(ports, weights){
  var sum = 0;
  for(var i=0;i<weights.length;i++) sum += (weights[i]||1);
  var r = Math.floor(Math.random()*sum) + 1, acc = 0;
  for(var k=0;k<ports.length;k++){ acc += (weights[k]||1); if (r<=acc) return ports[k]; }
  return ports[0];
}
function proxyForCategory(cat){
  var key = STICKY_SALT + "_PORT_" + cat;
  var ttl = STICKY_TTL_MINUTES * 60 * 1000;
  var e = CACHE._PORT_STICKY[key];
  if (e && (now - e.t) < ttl) return "PROXY " + PROXY_HOST + ":" + e.p;
  var p = weightedPick(PORTS[cat], PORT_WEIGHTS[cat]);
  CACHE._PORT_STICKY[key] = {p: p, t: now};
  return "PROXY " + PROXY_HOST + ":" + p;
}
function resolveDstCached(h, ttl){
  if(!h) return "";
  if(/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
  var c = CACHE.DST_RESOLVE_CACHE[h];
  if (c && (now - c.t) < ttl) return c.ip;
  var r = dnsResolve(h);
  var ip = (r && r !== "0.0.0.0") ? r : "";
  CACHE.DST_RESOLVE_CACHE[h] = {ip: ip, t: now};
  return ip;
}

/* === Decision (final) === */
function FindProxyForURL(url, host){
  host = host || "";

  // 0) bypass for LAN / link-local / media / local names
  if (isBypass(host)) return "DIRECT";

  // 1) If user trusts proxy is JO, prefer proxy for PUBG-related domains immediately
  if (TRUST_PROXY_IS_JO){
    if (pathMatches(url, URL_PATTERNS.LOBBY) || hostMatchesAnyDomain(host, PUBG_DOMAINS.LOBBY)) return proxyForCategory("LOBBY");
    if (pathMatches(url, URL_PATTERNS.MATCH) || hostMatchesAnyDomain(host, PUBG_DOMAINS.MATCH)) return proxyForCategory("MATCH");
    if (pathMatches(url, URL_PATTERNS.RECRUIT_SEARCH) || hostMatchesAnyDomain(host, PUBG_DOMAINS.RECRUIT_SEARCH)) return proxyForCategory("RECRUIT_SEARCH");
    if (pathMatches(url, URL_PATTERNS.UPDATES) || hostMatchesAnyDomain(host, PUBG_DOMAINS.UPDATES)) return proxyForCategory("UPDATES");
    if (pathMatches(url, URL_PATTERNS.CDNS) || hostMatchesAnyDomain(host, PUBG_DOMAINS.CDNS)) return proxyForCategory("CDNS");
  }

  // 2) resolve destination and ensure it's within JO IP ranges (Zain/Umniah)
  var dst = (/^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS));
  if (!dst || !ipInJordan(dst)) {
    return FORBID_NON_JO ? "PROXY 0.0.0.0:0" : "DIRECT";
  }

  // 3) Route PUBG categories via proxy with sticky ports
  if (pathMatches(url, URL_PATTERNS.LOBBY) || hostMatchesAnyDomain(host, PUBG_DOMAINS.LOBBY)) return proxyForCategory("LOBBY");
  if (pathMatches(url, URL_PATTERNS.MATCH) || hostMatchesAnyDomain(host, PUBG_DOMAINS.MATCH)) return proxyForCategory("MATCH");
  if (pathMatches(url, URL_PATTERNS.RECRUIT_SEARCH) || hostMatchesAnyDomain(host, PUBG_DOMAINS.RECRUIT_SEARCH)) return proxyForCategory("RECRUIT_SEARCH");
  if (pathMatches(url, URL_PATTERNS.UPDATES) || hostMatchesAnyDomain(host, PUBG_DOMAINS.UPDATES)) return proxyForCategory("UPDATES");
  if (pathMatches(url, URL_PATTERNS.CDNS) || hostMatchesAnyDomain(host, PUBG_DOMAINS.CDNS)) return proxyForCategory("CDNS");

  // 4) Default: any other JO IP -> send via UPDATES category (keeps within JO pool)
  return proxyForCategory("UPDATES");
}
