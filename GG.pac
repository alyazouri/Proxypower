/* ==== PAC: Jordan-Only PUBG v6+v4 (JO-only, per-category ports) ==== */
/* عدّل قائمة البروكسيات إن لزم */
var PROXY_CANDIDATES = ["91.106.109.12"];

/* بورتات ثابتة لكل تصنيف */
var FIXED_PORT = {
  LOBBY: 443,
  MATCH: 20001,
  RECRUIT_SEARCH: 443,
  UPDATES: 80,
  CDN: 80
};

/* نطاقات IPv4 الأردنية (from-to) */
var JO_V4_RANGES = [
  ["2.59.52.0","2.59.55.255"],["5.45.128.0","5.45.143.255"],["5.198.240.0","5.198.247.255"],["5.199.184.0","5.199.187.255"],
  ["37.17.192.0","37.17.207.255"],["37.44.32.0","37.44.39.255"],["37.75.144.0","37.75.151.255"],["37.123.64.0","37.123.95.255"],
  ["37.152.0.0","37.152.7.255"],["37.202.64.0","37.202.127.255"],["37.220.112.0","37.220.127.255"],["37.252.222.0","37.252.222.255"],
  ["45.142.196.0","45.142.199.255"],["46.23.112.0","46.23.127.255"],["46.32.96.0","46.32.127.255"],["46.185.128.0","46.185.255.255"],
  ["46.248.192.0","46.248.223.255"],["62.72.160.0","62.72.191.255"],["77.245.0.0","77.245.15.255"],["79.134.128.0","79.134.159.255"],
  ["79.173.192.0","79.173.255.255"],["80.90.160.0","80.90.175.255"],["81.21.0.0","81.21.15.255"],["81.28.112.0","81.28.127.255"],
  ["82.212.64.0","82.212.127.255"],["84.18.32.0","84.18.63.255"],["84.18.64.0","84.18.95.255"],["84.252.106.0","84.252.106.255"],
  ["85.159.216.0","85.159.223.255"],["86.108.0.0","86.108.127.255"],["87.236.232.0","87.236.239.255"],["87.238.128.0","87.238.135.255"],
  ["89.20.49.0","89.20.49.255"],["89.28.216.0","89.28.223.255"],["91.106.96.0","91.106.111.255"],["91.132.100.0","91.132.100.255"],
  ["91.186.224.0","91.186.255.255"],["91.212.0.0","91.212.0.255"],["91.223.202.0","91.223.202.255"],["92.241.32.0","92.241.63.255"],
  ["92.253.0.0","92.253.127.255"],["93.93.144.0","93.93.151.255"],["93.95.200.0","93.95.207.255"],["93.115.2.0","93.115.2.255"],
  ["93.115.3.0","93.115.3.255"],["93.115.15.0","93.115.15.255"],["93.191.176.0","93.191.183.255"],["94.127.208.0","94.127.215.255"],
  ["94.142.32.0","94.142.63.255"],["94.249.0.0","94.249.127.255"],["95.141.208.0","95.141.223.255"],["95.172.192.0","95.172.223.255"],
  ["109.107.224.0","109.107.255.255"],["109.237.192.0","109.237.207.255"],["141.0.0.0","141.0.7.255"],["141.98.64.0","141.98.67.255"],
  ["141.105.56.0","141.105.63.255"],["146.19.239.0","146.19.239.255"],["146.19.246.0","146.19.246.255"],["149.200.128.0","149.200.255.255"],
  ["176.28.128.0","176.28.255.255"],["176.29.0.0","176.29.255.255"],["176.57.0.0","176.57.31.255"],["176.57.48.0","176.57.63.255"],
  ["176.118.39.0","176.118.39.255"],["176.241.64.0","176.241.71.255"],["178.20.184.0","178.20.191.255"],["178.77.128.0","178.77.191.255"],
  ["178.238.176.0","178.238.191.255"],["185.10.216.0","185.10.219.255"],["185.12.244.0","185.12.247.255"],["185.14.132.0","185.14.135.255"],
  ["185.19.112.0","185.19.115.255"],["185.24.128.0","185.24.131.255"],["185.30.248.0","185.30.251.255"],["185.33.28.0","185.33.31.255"],
  ["185.40.19.0","185.40.19.255"],["185.43.146.0","185.43.146.255"],["185.51.212.0","185.51.215.255"],["185.57.120.0","185.57.123.255"],
  ["185.80.24.0","185.80.27.255"],["185.80.104.0","185.80.107.255"],["185.98.220.0","185.98.223.255"],["185.98.224.0","185.98.227.255"],
  ["185.109.120.0","185.109.123.255"],["185.109.192.0","185.109.195.255"],["185.135.200.0","185.135.203.255"],["185.139.220.0","185.139.223.255"],
  ["185.159.180.0","185.159.183.255"],["185.160.236.0","185.160.239.255"],["185.163.205.0","185.163.205.255"],["185.173.56.0","185.173.59.255"],
  ["185.175.248.0","185.175.251.255"],["185.176.44.0","185.176.47.255"],["185.180.80.0","185.180.83.255"],["185.182.136.0","185.182.139.255"],
  ["185.193.176.0","185.193.179.255"],["185.197.176.0","185.197.179.255"],["185.200.128.0","185.200.131.255"],["185.234.111.0","185.234.111.255"],
  ["185.241.62.0","185.241.62.255"],["185.253.112.0","185.253.115.255"],["188.123.160.0","188.123.191.255"],["188.247.64.0","188.247.95.255"],
  ["193.17.53.0","193.17.53.255"],["193.108.134.0","193.108.135.255"],["193.111.29.0","193.111.29.255"],["193.188.64.0","193.188.95.255"],
  ["193.189.148.0","193.189.148.255"],["193.203.24.0","193.203.25.255"],["193.203.110.0","193.203.111.255"],["194.104.95.0","194.104.95.255"],
  ["194.110.236.0","194.110.236.255"],["194.165.128.0","194.165.159.255"],["195.18.9.0","195.18.9.255"],["212.34.0.0","212.34.31.255"],
  ["212.35.64.0","212.35.95.255"],["212.118.0.0","212.118.31.255"],["213.139.32.0","213.139.63.255"],["213.186.160.0","213.186.191.255"],
  ["217.23.32.0","217.23.47.255"],["217.29.240.0","217.29.255.255"],["217.144.0.0","217.144.15.255"],["91.209.248.0","91.209.248.255"],
  ["91.220.195.0","91.220.195.255"]
];

/* نطاقات IPv6 الأردنية (CIDR) — كما طلبت */
var JO_V6_PREFIXES = [
  "2a03:6b01:4000::/38",
  "2a03:6b01:4000::/34",
  "2a03:6b01:4400::/38",
  "2a03:6b01:6000::/38",
  "2a03:6b01:6400::/38",
  "2a03:6b01:8000::/34",
  "2a03:6b01:8000::/40",
  "2a03:6b02:2000::/48"
];

/* جداول الدومينات/المسارات */
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

/* استثناءات دايركت */
var EXCLUDE_HOSTS = ["youtube.com","youtu.be","ytimg.com","googleapis.com","shahid.mbc.net","whatsapp.com","whatsapp.net","snapchat.com","sc-cdn.net"];

/* كاش وتهيئة */
var DNS_TTL_MS = 15000, PROXY_STICKY_TTL_MS = 60000, GEO_TTL_MS = 3600000;
var _root = (typeof globalThis!=="undefined") ? globalThis : this;
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if(!C.dns) C.dns = {};
if(!C.proxyPick) C.proxyPick = {host:null,t:0,lat:99999};
if(!C.geoClient) C.geoClient = {ok:false,t:0};
if(!C.geoProxy) C.geoProxy = {ok:false,t:0};

/* === أدوات مساعدة (IPv4/IPv6) === */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIPv4(s){return /^\d+\.\d+\.\d+\.\d+$/.test(s||"");}
function isIPv6(s){return /^[0-9a-fA-F:]+$/.test(s||"") && s.indexOf(":")>=0;}

function ip4ToInt(ip){var p=ip.split(".");return ((parseInt(p[0])<<24)>>>0)+((parseInt(p[1])<<16)>>>0)+((parseInt(p[2])<<8)>>>0)+(parseInt(p[3])>>>0);}

function isJOv4(ip){
  if(!isIPv4(ip)) return false;
  var n=ip4ToInt(ip);
  for(var i=0;i<JO_V4_RANGES.length;i++){
    var s=ip4ToInt(JO_V4_RANGES[i][0]), e=ip4ToInt(JO_V4_RANGES[i][1]);
    if(n>=s && n<=e) return true;
  }
  return false;
}

/* parse IPv6 to 8 words (16-bit) handling :: */
function parseIPv6Words(addr){
  // Normalize IPv4-mapped tail if present
  if(/:.*\./.test(addr)){ // has dotted quad at end
    var i = addr.lastIndexOf(":");
    var head = addr.substring(0,i);
    var v4 = addr.substring(i+1);
    var p = v4.split(".");
    if(p.length===4){
      var w6 = ((parseInt(p[0])<<8) | parseInt(p[1])) & 0xffff;
      var w7 = ((parseInt(p[2])<<8) | parseInt(p[3])) & 0xffff;
      addr = head + ":" + w6.toString(16) + ":" + w7.toString(16);
    }
  }
  var parts = addr.split("::");
  var left = parts[0] ? parts[0].split(":") : [];
  var right = parts.length>1 && parts[1] ? parts[1].split(":") : [];
  if(parts.length===1){ // no ::
    if(left.length!==8) return null;
    return left.map(function(h){ return parseInt(h||"0",16)&0xffff; });
  }else{
    var fill = 8 - (left.length + right.length);
    if(fill<0) return null;
    var arr = [];
    for(var i1=0;i1<left.length;i1++) arr.push(parseInt(left[i1]||"0",16)&0xffff);
    for(var j=0;j<fill;j++) arr.push(0);
    for(var k=0;k<right.length;k++) arr.push(parseInt(right[k]||"0",16)&0xffff);
    if(arr.length!==8) return null;
    return arr;
  }
}

/* check if IPv6 words in given prefix words/length */
function ipv6InPrefix(words, prefWords, prefLenBits){
  var full = Math.floor(prefLenBits/16);
  var rem = prefLenBits%16;
  for(var i=0;i<full;i++) if(words[i]!==prefWords[i]) return false;
  if(rem===0) return true;
  var mask = (0xffff << (16-rem)) & 0xffff;
  return (words[full] & mask) === (prefWords[full] & mask);
}

/* Precompute v6 prefixes into (words,len) */
if(!C.v6pref) {
  C.v6pref = [];
  for(var i=0;i<JO_V6_PREFIXES.length;i++){
    var pr = JO_V6_PREFIXES[i];
    var sp = pr.split("/");
    var base = sp[0];
    var plen = parseInt(sp[1],10);
    var w = parseIPv6Words(base);
    if(w && plen>=0 && plen<=128) C.v6pref.push({w:w,len:plen});
  }
}

function isJOv6(ip){
  if(!isIPv6(ip)) return false;
  var w = parseIPv6Words(ip);
  if(!w) return false;
  for(var i=0;i<C.v6pref.length;i++){
    if(ipv6InPrefix(w, C.v6pref[i].w, C.v6pref[i].len)) return true;
  }
  return false;
}

/* DNSCache: v4/v6 (dnsResolveEx/myIpAddressEx إن وُجدت) */
function dnsResolveAny(host){
  var now=(new Date()).getTime();
  var e=C.dns[host];
  if(e && (now-e.t)<DNS_TTL_MS) return e.list; // list of IPs (strings)
  var lst = [];
  try{
    if(typeof dnsResolveEx === "function"){
      // Usually returns array of addresses (v4/v6)
      lst = dnsResolveEx(host) || [];
    }else{
      var r = dnsResolve(host) || "";
      if(r) lst = [r];
    }
  }catch(_){}
  C.dns[host] = {list:lst,t:now};
  return lst;
}

function myIpAny(){
  try{
    if(typeof myIpAddressEx === "function"){
      var a = myIpAddressEx(); // array (v4/v6)
      if(a && a.length) return a;
    }
  }catch(_){}
  try{
    var v4 = myIpAddress();
    if(v4) return [v4];
  }catch(_){}
  return [];
}

function firstJordIPFromList(list){
  // prefer v6 if JO, then v4 if JO
  for(var i=0;i<list.length;i++) if(isJOv6(list[i])) return {ip:list[i], ver:6};
  for(i=0;i<list.length;i++) if(isJOv4(list[i])) return {ip:list[i], ver:4};
  return null;
}

function firstJOipForHost(host){
  if(isIPv4(host) && isJOv4(host)) return {ip:host,ver:4};
  if(isIPv6(host) && isJOv6(host)) return {ip:host,ver:6};
  var lst = dnsResolveAny(host);
  return firstJordIPFromList(lst);
}

function measureProxyLatency(h){
  // DNS time as rough latency
  if(isIPv4(h) || isIPv6(h)) return 1;
  try{
    var t0=(new Date()).getTime(); var _r=dnsResolveAny(h);
    var dt=(new Date()).getTime()-t0;
    return dt>0?dt:1;
  }catch(_){ return 99999; }
}

function pickProxyHost(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host && (now-C.proxyPick.t)<PROXY_STICKY_TTL_MS) return C.proxyPick.host;
  var best=null, bestLat=99999;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){
    var c=PROXY_CANDIDATES[i]; var l=measureProxyLatency(c);
    if(l<bestLat){ bestLat=l; best=c; }
  }
  if(!best) best = PROXY_CANDIDATES[0];
  C.proxyPick = {host:best,t:now,lat:bestLat};
  return best;
}

function bracketIfV6(h){ return isIPv6(h) ? ("["+h+"]") : h; }

function proxyFor(cat){
  var h = pickProxyHost();
  var p = FIXED_PORT[cat] || 443;
  return "PROXY " + bracketIfV6(h) + ":" + p;
}

function clientIsJO(){
  var now=(new Date()).getTime(), g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var ips = myIpAny();
  var ok = !!firstJordIPFromList(ips);
  C.geoClient = {ok:ok,t:now}; return ok;
}

function proxyIsJO(){
  var now=(new Date()).getTime(), g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var ph = pickProxyHost();
  var verdict = false;
  if(isIPv4(ph)) verdict = isJOv4(ph);
  else if(isIPv6(ph)) verdict = isJOv6(ph);
  else {
    var lst = dnsResolveAny(ph);
    verdict = !!firstJordIPFromList(lst);
  }
  C.geoProxy = {ok:verdict,t:now}; return verdict;
}

function hostMatch(h,arr){
  h = lc(h); if(!h) return false;
  for(var i=0;i<arr.length;i++){
    var p = lc(arr[i]);
    if(shExpMatch(h,p)) return true;
    if(p.indexOf("*.")===0){
      var suf = p.substring(1);
      if(h.length>=suf.length && h.substring(h.length - suf.length)===suf) return true;
    }
  }
  return false;
}
function urlMatch(u,arr){ if(!u) return false; for(var i=0;i<arr.length;i++) if(shExpMatch(u,arr[i])) return true; return false; }

function isExcluded(host){
  host = lc(host);
  for(var i=0;i<EXCLUDE_HOSTS.length;i++){
    var e = lc(EXCLUDE_HOSTS[i]);
    if(shExpMatch(host,"*"+e) || host===e) return true;
  }
  return false;
}

/* تمرير فقط إذا الـIP أردني (v6 أو v4) */
function enforceCat(cat, host){
  var jo = firstJOipForHost(host);
  if(jo) return proxyFor(cat);
  return "PROXY 0.0.0.0:0"; // حظر لو مش أردني
}

/* === المنطق الرئيسي === */
function FindProxyForURL(url, host){
  host = lc(host);
  if(isExcluded(host)) return "DIRECT";
  if(!clientIsJO() || !proxyIsJO()) return "PROXY 0.0.0.0:0";

  // MATCH (الانضمام والجيم)
  if (urlMatch(url, URL_PATTERNS.MATCH) || hostMatch(host, PUBG_DOMAINS.MATCH)
      || shExpMatch(url,"*/game/join*") || shExpMatch(url,"*/game/start*")
      || shExpMatch(url,"*/matchmaking/*") || shExpMatch(url,"*/mms/*"))
    return enforceCat("MATCH", host);

  // LOBBY
  if (urlMatch(url, URL_PATTERNS.LOBBY) || hostMatch(host, PUBG_DOMAINS.LOBBY)
      || shExpMatch(url,"*/status/heartbeat*") || shExpMatch(url,"*/friends/*"))
    return enforceCat("LOBBY", host);

  // RECRUIT_SEARCH
  if (urlMatch(url, URL_PATTERNS.RECRUIT_SEARCH) || hostMatch(host, PUBG_DOMAINS.RECRUIT_SEARCH)
      || shExpMatch(url,"*/teamfinder/*") || shExpMatch(url,"*/recruit/*"))
    return enforceCat("RECRUIT_SEARCH", host);

  // UPDATES
  if (urlMatch(url, URL_PATTERNS.UPDATES) || hostMatch(host, PUBG_DOMAINS.UPDATES))
    return enforceCat("UPDATES", host);

  // CDN
  if (urlMatch(url, URL_PATTERNS.CDN) || hostMatch(host, PUBG_DOMAINS.CDN))
    return enforceCat("CDN", host);

  // غير مصنّف → حظر (لو بدك تغيّرها إلى LOBBY بدّل السطر التالي)
  return "PROXY 0.0.0.0:0";
}
