// JO-HARD-MODE PAC — v7 (Jordan-bias++, smart retries, fast DNS)
// تركيز: رفع نسبة اللاعبين الأردنيين في اللوبي + التجنيد/البحث + مباريات كلاسيك.

/////////////////////
// إعدادات عامة
/////////////////////
var PROXY_CANDIDATES = ["91.106.109.12"];
var PROXY_WHITELIST  = ["91.106.109.12"];

var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

// انحياز أقوى (ارفع القيم لصرامة أعلى)
var MATCH_MAX_REJECTS   = 8;
var MATCH_WINDOW_MS     = 45*1000;
var LOBBY_MAX_REJECTS   = 5;
var LOBBY_WINDOW_MS     = 30*1000;

// لا ننصح بتفعيل الحظر التام لأنّه قد يكسر اللعب
var STRICT_BLOCK_GLOBAL = false;

// FORCE LEADER (يبقيك قائد/اسمك أول واحد)
var FORCE_LEADER = true;
var LEADER_BLOCK_PATTERNS = [
  "*/quickjoin*","*/quick_join*","*/auto_match*","*/autoMatch*",
  "*/invite/accept*","*/invite/agree*",
  "*/teamfinder/*/join*","*/teamfinder/join*","*/recruit/*/join*",
  "*/team/join*","*/squad/join*","*/join_team*"
];
var LEADER_ALLOW_PATTERNS = [
  "*/team/create*","*/team/code/*","*/invite/send*","*/publish*",
  "*/teamfinder/*/create*","*/teamfinder/create*","*/recruit/*/create*","*/team/publish*"
];

/////////////////////
// بادئات IPv6 أردنية
/////////////////////
var JO_V6_PREFIX = {
  LOBBY: [
    "2a03:6b01:8000::/34","2a03:6b01:4000::/34",
    "2001:67c:27c0::/48","2001:67c:2b40::/48","2a0e:b47::/32"
  ],
  MATCH: [
    "2a03:6b01:8000::/34","2a03:6b01:4000::/34",
    "2001:67c:27c0::/48","2001:67c:2b40::/48","2a0e:b47::/32"
  ],
  RECRUIT_SEARCH: [
    "2a03:6b01:8000::/34","2a03:6b01:4000::/34",
    "2001:67c:27c0::/48","2001:67c:2b40::/48","2a0e:b47::/32"
  ],
  UPDATES: [
    "2a03:6b01:8000::/34","2a03:6b01:4000::/34",
    "2001:67c:27c0::/48","2001:67c:2b40::/48","2a0e:b47::/32"
  ],
  CDN: [
    "2a03:6b01:8000::/34","2a03:6b01:4000::/34",
    "2001:67c:27c0::/48","2001:67c:2b40::/48","2a0e:b47::/32"
  ]
};

/////////////////////
// IPv4 ranges أردنية — نهائي، بدون تكرار
/////////////////////
var JO_V4_RANGES = [
  ["217.25.0.0","217.25.255.255"],
  ["212.118.0.0","212.118.255.255"],
  ["212.35.0.0","212.35.255.255"],
  ["213.186.0.0","213.186.255.255"],
  ["213.187.0.0","213.187.255.255"],
  ["87.236.0.0","87.236.255.255"],
  ["87.237.0.0","87.237.255.255"],
  ["94.142.0.0","94.142.255.255"],
  ["109.224.0.0","109.224.255.255"],
  ["37.236.0.0","37.236.255.255"],
  ["37.237.0.0","37.237.255.255"],
  ["109.110.0.0","109.110.255.255"],
  ["81.28.0.0","81.28.255.255"],
  ["46.60.0.0","46.60.255.255"],
  ["46.185.0.0","46.185.255.255"],
  // الإضافات الأخيرة — أعلى أولوية
  ["80.90.160.0","80.90.175.255"],       // 80.90.160.0/20
  ["82.212.64.0","82.212.127.255"],      // 82.212.64.0/18
  ["188.123.160.0","188.123.191.255"],   // 188.123.160.0/19
  ["77.245.0.0","77.245.15.255"],        // 77.245.0.0/20

  // دفعات سابقة
  ["176.29.0.0","176.29.255.255"],       // 176.29.0.0/16
  ["95.172.192.0","95.172.223.255"],     // 95.172.192.0/19
  ["92.241.32.0","92.241.63.255"],       // 92.241.32.0/19
  ["109.107.224.0","109.107.255.255"],   // 109.107.224.0/19
  ["46.23.0.0","46.23.255.255"],         // 46.23.0.0/16
  ["46.248.192.0","46.248.223.255"],     // 46.248.192.0/19
  ["85.159.216.0","85.159.223.255"],     // 85.159.216.0/21
  ["185.80.104.0","185.80.107.255"],     // 185.80.104.0/22
  ["178.238.176.0","178.238.191.255"],   // 178.238.176.0/20

  // القائمة القديمة الكاملة

  ["185.108.0.0","185.108.255.255"]
];

/////////////////////
// كاش و لوجيك DNS سريع
/////////////////////
var DNS_TTL_MS = 15*1000;      // افتراضي
var PROXY_STICKY_TTL_MS = 60*1000;
var GEO_TTL_MS = 60*60*1000;
var JO_STICKY_TTL_MS = 5*60*1000; // تثبيت Jordan hit لكل host

// دومينات PUBG التي نتجنّب كاشها داخليًا لزيادة تدوير الـ A/AAAA
var FAST_DNS_HOSTS = [
  "*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com",
  "*.gcloud.qq.com","gpubgm.com"
];

var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
C.dns = C.dns || {};
C.proxyPick = C.proxyPick || {host:null, t:0, lat:99999};
C.geoClient = C.geoClient || {ok:false, t:0};
C.geoProxy  = C.geoProxy  || {ok:false, t:0};
C.rej = C.rej || {match:{t:0,c:0}, lobby:{t:0,c:0}};
// sticky Jordan per-host
C.joHost = C.joHost || {}; // map host -> {ok:true, t:time}

/////////////////////
// PUBG domains & URL patterns
/////////////////////
var PUBG_DOMAINS = {
  LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};
var URL_PATTERNS = {
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

/////////////////////
// أدوات مساعدة
/////////////////////
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIp4(s){return /^\d+\.\d+\.\d+\.\d+$/.test(s);}
function isIp6Literal(s){return s && s.indexOf(":")!==-1;}
function ipEquals(a,b){return a===b;}

function shMatchAny(h,arr){
  for(var i=0;i<arr.length;i++){
    var pat=arr[i];
    if(shExpMatch(h,pat)) return true;
    if(pat.indexOf("*.")==0){
      var suf=pat.substring(1);
      if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;
    }
  }
  return false;
}
function hostMatch(h,arr){h=lc(h||"");if(!h)return false;return shMatchAny(h,arr);}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++){if(shExpMatch(u,arr[i]))return true;}return false;}

function dnsCached(h){
  if(!h) return "";
  var now=(new Date()).getTime();

  // PUBG: تجاوز كاشنا الداخلي لتحسين تدوير ال-IP
  if(shMatchAny(h, FAST_DNS_HOSTS)){
    try{ return dnsResolve(h) || ""; }catch(e){ return ""; }
  }

  var e=C.dns[h];
  if(e && (now-e.t)<DNS_TTL_MS) return e.ip;
  var ip=""; try{ ip=dnsResolve(h)||""; }catch(err){ ip=""; }
  C.dns[h]={ip:ip,t:now};
  return ip;
}

// IPv4
function ip4ToInt(ip){var p=ip.split(".");return(((+p[0])<<24)>>>0)+(((+p[1])<<16)>>>0)+(((+p[2])<<8)>>>0)+((+p[3])>>>0);}
function rangePair(a){return{s:ip4ToInt(a[0]),e:ip4ToInt(a[1])};}
if(!C._JO_V4I){C._JO_V4I=[];for(var _i=0;_i<JO_V4_RANGES.length;_i++){var pr=rangePair(JO_V4_RANGES[_i]);if(pr.s<=pr.e)C._JO_V4I.push(pr);}}
function isJOv4(ip){if(!ip||!isIp4(ip))return false;var n=ip4ToInt(ip);for(var i=0;i<C._JO_V4I.length;i++){var r=C._JO_V4I[i];if(n>=r.s&&n<=r.e)return true;}return false;}

// IPv6
function pad4(h){return("0000"+h).slice(-4);}
function norm6(ip){
  if(!ip) return "";
  ip=ip.toLowerCase();
  if(ip.indexOf("::")==-1){var parts=ip.split(":");while(parts.length<8)parts.push("0");return parts.map(pad4).join(":");}
  var left=ip.split("::")[0],right=ip.split("::")[1];
  var L=left?left.split(":"):[],R=right?right.split(":"):[];
  var miss=8-(L.length+R.length),zeros=[];for(var i=0;i<miss;i++)zeros.push("0");
  return (L.concat(zeros).concat(R)).map(pad4).join(":");
}
function parseCidr6(s){s=s.replace(/:+$/,"");var m=s.split("/"),pre=m[0];var len=(m.length>1)?parseInt(m[1],10):(pre.split(":").length>=2?32:16);return{norm:norm6(pre),len:len};}
function ip6ToBits(ip){var parts=norm6(ip).split(":"),bits="";for(var i=0;i<8;i++){var v=parseInt(parts[i],16);bits+=("0000000000000000"+v.toString(2)).slice(-16);}return bits;}
function match6(ip,c){if(!ip)return false;var b1=ip6ToBits(ip),b2=ip6ToBits(c.norm);var L=Math.max(0,Math.min(128,c.len|0));return b1.substring(0,L)===b2.substring(0,L);}
function isJOv6ForCat(ip,cat){if(!ip||ip.indexOf(":")==-1)return false;var arr=JO_V6_PREFIX[cat];if(!arr||!arr.length)return false;for(var i=0;i<arr.length;i++){if(match6(ip,parseCidr6(arr[i])))return true;}return false;}

/////////////////////
// proxy pick + قياس
/////////////////////
function measureProxyLatency(h){if(isIp4(h)||isIp6Literal(h))return 1;try{var t0=(new Date()).getTime();var r=dnsResolve(h);var dt=(new Date()).getTime()-t0;if(!r)return 99999;return dt>0?dt:1;}catch(e){return 99999;}}
function pickProxyHost(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host&&(now-C.proxyPick.t)<PROXY_STICKY_TTL_MS)return C.proxyPick.host;
  var best=null,bestLat=99999;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){var cand=PROXY_CANDIDATES[i],lat=measureProxyLatency(cand);if(lat<bestLat){bestLat=lat;best=cand;}}
  if(!best)best=PROXY_CANDIDATES[0];
  C.proxyPick={host:best,t:now,lat:bestLat};return best;
}
function proxyFor(cat){var h=pickProxyHost();var pt=FIXED_PORT[cat]||443;return "PROXY "+h+":"+pt;}

/////////////////////
// checks: client/proxy
/////////////////////
function clientIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoClient;if(g&&(now-g.t)<GEO_TTL_MS)return g.ok;
  var my="";try{my=myIpAddress();}catch(e){my="";}
  var localOk=false;
  if(isIp4(my)){
    localOk=shExpMatch(my,"10.*")||shExpMatch(my,"192.168.*")||
            shExpMatch(my,"172.16.*")||shExpMatch(my,"172.1?.*")||
            shExpMatch(my,"172.2?.*")||shExpMatch(my,"172.3?.*");
  }else if(isIp6Literal(my)){
    localOk=shExpMatch(my,"fe80:*")||shExpMatch(my,"fd*:*");
  }
  var ok=localOk||isJOv4(my)||isJOv6ForCat(my,"LOBBY")||isJOv6ForCat(my,"MATCH");
  C.geoClient={ok:ok,t:now};return ok;
}
function proxyIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoProxy;if(g&&(now-g.t)<GEO_TTL_MS)return g.ok;
  var p=pickProxyHost();
  if(PROXY_WHITELIST&&PROXY_WHITELIST.length){
    for(var i=0;i<PROXY_WHITELIST.length;i++){
      if(ipEquals(p,PROXY_WHITELIST[i])){C.geoProxy={ok:true,t:now};return true;}
      var pip=dnsCached(p);if(ipEquals(pip,PROXY_WHITELIST[i])){C.geoProxy={ok:true,t:now};return true;}
    }
  }
  var ok=false;
  if(isIp4(p))ok=isJOv4(p);
  else if(isIp6Literal(p))ok=isJOv6ForCat(p,"LOBBY")||isJOv6ForCat(p,"MATCH");
  else{var pip=dnsCached(p);ok=isJOv4(pip)||isJOv6ForCat(pip,"LOBBY")||isJOv6ForCat(pip,"MATCH");}
  C.geoProxy={ok:ok,t:now};return ok;
}
function isUnsafeHost(h){if(!h)return true;if(isPlainHostName(h))return true;if(shExpMatch(h,"*.local")||shExpMatch(h,"*.lan"))return true;return false;}

/////////////////////
// FORCE_LEADER
/////////////////////
function enforceLeader(url){
  if(!FORCE_LEADER) return null;
  for(var i=0;i<LEADER_BLOCK_PATTERNS.length;i++){ if(shExpMatch(url,LEADER_BLOCK_PATTERNS[i])) return "PROXY 0.0.0.0:0"; }
  for(var j=0;j<LEADER_ALLOW_PATTERNS.length;j++){ if(shExpMatch(url,LEADER_ALLOW_PATTERNS[j])) return null; }
  return null;
}

/////////////////////
// Jordan-only bias + Sticky Jordan per-host
/////////////////////
function markHostJordan(host){
  C.joHost[host]={ok:true,t:(new Date()).getTime()};
}
function hostJordanStickyOK(host){
  var e=C.joHost[host]; if(!e) return false;
  return ((new Date()).getTime()-e.t) < JO_STICKY_TTL_MS;
}

function shouldRejectSmart(bucket, windowMs, maxRejects){
  var now=(new Date()).getTime();
  if((now-bucket.t)>windowMs){bucket.t=now;bucket.c=0;}
  if(bucket.c<maxRejects){bucket.c++;return true;}
  return false;
}

function jordanGate(cat, host, mode){
  host = lc(host||"");

  // لو مسبقًا مثبت أردني لهذا الهوست → مرّر فورًا
  if(hostJordanStickyOK(host)) return proxyFor(cat);

  var ip = host;
  if(!isIp4(ip) && !isIp6Literal(ip)){
    if(isUnsafeHost(host)) return (STRICT_BLOCK_GLOBAL?"PROXY 0.0.0.0:0":proxyFor(cat));
    ip = dnsCached(host);
  }

  // تفضيل IPv6 الأردني أولًا، ثم IPv4 الأردني
  var isJO = (isIp6Literal(ip) && isJOv6ForCat(ip,cat)) || (isIp4(ip) && isJOv4(ip));
  if(isJO){ markHostJordan(host); return proxyFor(cat); }

  if(STRICT_BLOCK_GLOBAL) return "PROXY 0.0.0.0:0";

  // ميزانيات الرفض حسب الوضع
  if(mode === "match"){
    return shouldRejectSmart(C.rej.match, MATCH_WINDOW_MS, MATCH_MAX_REJECTS) ? "PROXY 0.0.0.0:0" : proxyFor(cat);
  }
  if(mode === "lobby"){
    return shouldRejectSmart(C.rej.lobby, LOBBY_WINDOW_MS, LOBBY_MAX_REJECTS) ? "PROXY 0.0.0.0:0" : proxyFor(cat);
  }
  return proxyFor(cat);
}

/////////////////////
// الدالة الرئيسية
/////////////////////
function FindProxyForURL(url, host){
  host = lc(host);

  // قائد دائمًا قبل أي لوجيك
  var fl = enforceLeader(url);
  if(fl !== null) return fl;

  // حماية أساسية
  if(!clientIsJO() || !proxyIsJO()) return "PROXY 0.0.0.0:0";

  // MATCH (كلاسيك/بحث مباراة)
  if( urlMatch(url, URL_PATTERNS.MATCH) ||
      hostMatch(host, PUBG_DOMAINS.MATCH) ||
      shExpMatch(url,"*/game/join*") ||
      shExpMatch(url,"*/game/start*") ||
      shExpMatch(url,"*/matchmaking/*") ||
      shExpMatch(url,"*/mms/*")
    ){
    return jordanGate("MATCH", host, "match");
  }

  // LOBBY / RECRUIT / SEARCH
  if( urlMatch(url, URL_PATTERNS.LOBBY) ||
      hostMatch(host, PUBG_DOMAINS.LOBBY) ||
      urlMatch(url, URL_PATTERNS.RECRUIT_SEARCH) ||
      hostMatch(host, PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url,"*/status/heartbeat*") ||
      shExpMatch(url,"*/friends/*") ||
      shExpMatch(url,"*/teamfinder/*") ||
      shExpMatch(url,"*/recruit/*")
    ){
    return jordanGate("LOBBY", host, "lobby");
  }

  // UPDATES / CDN
  if( urlMatch(url, URL_PATTERNS.UPDATES) ||
      urlMatch(url, URL_PATTERNS.CDN) ||
      hostMatch(host, PUBG_DOMAINS.UPDATES) ||
      hostMatch(host, PUBG_DOMAINS.CDN)
    ){
    return jordanGate("LOBBY", host, "soft");
  }

  // باقي الترافيك
  return jordanGate("LOBBY", host, "soft");
}
