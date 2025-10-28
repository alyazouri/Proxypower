// إعدادات البروكسي الأردني (حافظ عليها كما هي أو أضف المزيد حسب الحاجة)
var PROXY_CANDIDATES = [
  "91.106.109.12"
];

// منافذ ثابتة لكل فئة ترافيك في ببجي
var FIXED_PORT = {
  LOBBY: 443,
  MATCH: 20001,
  RECRUIT_SEARCH: 443,
  UPDATES: 80,
  CDN: 80
};

// نطاقات IPv6 الأردنية (تم تحديثها لتشمل شبكات سكنية متنوعة 2025)
var JO_V6_PREFIX = {
  LOBBY: ["2a02:2788::"],         // نطاق أردني ثاني
  MATCH: ["2a01:6e40::"],         // نطاق ثاني مخصص لماتش
  RECRUIT_SEARCH: ["2a02:2788::"],
  UPDATES: ["2a02:2788::"],
  CDN: ["2a02:2788::"]
};

// نطاقات IPv4 للسكن الأردني (محدثة ومتنوعة)
var JO_V4_RANGES = [
  ["46.32.120.0","46.32.127.255"],
  ["176.47.0.0","176.52.255.255"],
  ["212.118.0.0","212.118.255.255"]
];

// TTLs لتحسين الأداء
var DNS_TTL_MS = 15*1000;
var PROXY_STICKY_TTL_MS = 60*1000;
var GEO_TTL_MS = 60*60*1000;

// كاش محلي لتقليل استدعاءات DNS وعمليات الحساب
var _root = (typeof globalThis !== "undefined" ? globalThis : this);
if (!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if (!C.dns) C.dns = {};
if (!C.proxyPick) C.proxyPick = {host:null, t:0, lat:99999};
if (!C.geoClient) C.geoClient = {ok:false, t:0};
if (!C.geoProxy)  C.geoProxy  = {ok:false, t:0};

// دومينات وأنماط URL ببجي حسب الفئات
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

// وظائف مساعدة لأداء أفضل وتعامل مع الدومينات و IPs
function lc(s){ return s && s.toLowerCase ? s.toLowerCase() : s; }

function hostMatch(h, arr){
  h = lc(h);
  if(!h) return false;
  for(var i=0;i<arr.length;i++){
    var pat = arr[i];
    if(shExpMatch(h,pat)) return true;
    if(pat.indexOf("*.")===0){
      var suf = pat.substring(1);
      if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;
    }
  }
  return false;
}

function urlMatch(u, arr){
  if(!u) return false;
  for(var i=0;i<arr.length;i++){
    if(shExpMatch(u, arr[i])) return true;
  }
  return false;
}

function dnsCached(h){
  if(!h) return "";
  var now = (new Date()).getTime();
  var e = C.dns[h];
  if(e && (now-e.t)<DNS_TTL_MS) return e.ip;
  var ip = "";
  try { ip = dnsResolve(h) || ""; } catch(err){ ip=""; }
  C.dns[h] = {ip: ip, t: now};
  return ip;
}

function ip4ToInt(ip){
  var p = ip.split(".");
  return ( (parseInt(p[0])<<24)>>>0 ) +
         ( (parseInt(p[1])<<16)>>>0 ) +
         ( (parseInt(p[2])<<8)>>>0 ) +
         ( parseInt(p[3])>>>0 );
}

function isJOv4(ip){
  if(!ip) return false;
  if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
  var n = ip4ToInt(ip);
  for(var i=0;i<JO_V4_RANGES.length;i++){
    var s = ip4ToInt(JO_V4_RANGES[i][0]);
    var e = ip4ToInt(JO_V4_RANGES[i][1]);
    if(n>=s && n<=e) return true;
  }
  return false;
}

function norm6(ip){
  if(ip.indexOf('::')===-1) return ip;
  var parts = ip.split(':');
  var left=[], right=[];
  var seenEmpty=false;
  for(var i=0;i<parts.length;i++){
    if(parts[i]===''){seenEmpty=true;continue;}
    if(!seenEmpty) left.push(parts[i]); else right.push(parts[i]);
  }
  var miss = 8-(left.length+right.length);
  var zeros=[];
  for(var j=0;j<miss;j++) zeros.push('0');
  return left.concat(zeros).concat(right).join(':');
}

function isJOv6ForCat(ip,cat){
  if(!ip) return false;
  if(ip.indexOf(":")===-1) return false;
  var prefArr = JO_V6_PREFIX[cat];
  if(!prefArr) return false;
  var lower = ip.toLowerCase();
  var n = norm6(lower);
  var parts=n.split(':');
  if(parts.length<2)return false;
  var seg1=parseInt(parts[0],16);
  var seg2=parseInt(parts[1],16);
  for(var i=0;i<prefArr.length;i++){
    var pre = prefArr[i].toLowerCase().replace(/:+$/,'');
    if(lower===pre) return true;
    if(lower.indexOf(pre+"::")===0) return true;
    if(lower.indexOf(pre+":")===0) return true;
    var pparts=pre.split(':');
    var p1=parseInt(pparts[0],16);
    var p2=(pparts.length>1)?parseInt(pparts[1],16):null;
    if(seg1===p1 && (p2===null || seg2===p2)) return true;
  }
  return false;
}

function measureProxyLatency(h){
  if(/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.indexOf(':')!==-1){
    return 1;
  }
  try{
    var t0=(new Date()).getTime();
    var r=dnsResolve(h);
    var dt=(new Date()).getTime()-t0;
    if(!r) return 99999;
    return dt>0?dt:1;
  }catch(e){return 99999;}
}

function pickProxyHost(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host && (now-C.proxyPick.t)<PROXY_STICKY_TTL_MS){
    return C.proxyPick.host;
  }
  var best=null, bestLat=99999;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){
    var cand=PROXY_CANDIDATES[i];
    var lat=measureProxyLatency(cand);
    if(lat<bestLat){bestLat=lat;best=cand;}
  }
  if(!best) best=PROXY_CANDIDATES[0];
  C.proxyPick={host:best,t:now,lat:bestLat};
  return best;
}

function proxyFor(cat){
  var h=pickProxyHost();
  var pt=FIXED_PORT[cat]||443;
  return "PROXY "+h+":"+pt;
}

function clientIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var my="";
  try{my=myIpAddress();}catch(e){my="";}
  var ok = isJOv4(my) || isJOv6ForCat(my,"LOBBY") || isJOv6ForCat(my,"MATCH");
  C.geoClient={ok:ok,t:now};
  return ok;
}

function proxyIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var p=pickProxyHost();
  var ok=false;
  if(/^\d+\.\d+\.\d+\.\d+$/.test(p)){
    ok = isJOv4(p);
  } else if(p.indexOf(":")!==-1){
    ok = isJOv6ForCat(p,"LOBBY") || isJOv6ForCat(p,"MATCH");
  } else {
    var pip=dnsCached(p);
    ok = isJOv4(pip) || isJOv6ForCat(pip,"LOBBY") || isJOv6ForCat(pip,"MATCH");
  }
  C.geoProxy={ok:ok,t:now};
  return ok;
}

function enforceCat(cat, host){
  var ip = host;
  if(ip.indexOf(':')===-1 && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)){
    ip = dnsCached(host);
  }
  if(isJOv6ForCat(ip,cat)){
    return proxyFor(cat);
  }
  if(isJOv4(ip)){
    return proxyFor(cat);
  }
  return "PROXY 0.0.0.0:0";
}

function FindProxyForURL(url, host){
  host = lc(host);
  if(!clientIsJO() || !proxyIsJO()){
    return "PROXY 0.0.0.0:0";
  }
  if( urlMatch(url,URL_PATTERNS.MATCH)    ||
      hostMatch(host,PUBG_DOMAINS.MATCH)  ||
      shExpMatch(url,"*/game/join*")      ||
      shExpMatch(url,"*/game/start*")     ||
      shExpMatch(url,"*/matchmaking/*")   ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH", host);
  }
  if( urlMatch(url,URL_PATTERNS.LOBBY)            ||
      hostMatch(host,PUBG_DOMAINS.LOBBY)          ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)   ||
      hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url,"*/status/heartbeat*")       ||
      shExpMatch(url,"*/friends/*")                ||
      shExpMatch(url,"*/teamfinder/*")             ||
      shExpMatch(url,"*/recruit/*")
    ){
    return enforceCat("LOBBY", host);
  }
  if( urlMatch(url,URL_PATTERNS.UPDATES) ||
      urlMatch(url,URL_PATTERNS.CDN)     ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) ||
      hostMatch(host,PUBG_DOMAINS.CDN)
    ){
    return enforceCat("LOBBY", host);
  }
  return "PROXY 0.0.0.0:0";
}
