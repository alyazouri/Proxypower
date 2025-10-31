// JO-HARD-MODE PAC (نسخة نهائية محسّنة)
// الهدف: أعلى احتمال ممكن للعينات الأردنية (لاعبين أردنيين) في اللوبي والماتش
// صارم جداً. أي مسار مش أردني = بلوك نهائي.

//////////////////////
// إعدادات عامة
//////////////////////

// مرشحي البروكسي الأردني (من مختلف مزودي الخدمة)
var PROXY_CANDIDATES = [
  "91.106.109.12",    // Batelco Jordan
  "176.29.10.5",      // Linkdotnet-Jordan
  "94.127.213.119"    // Batelco Jordan
];

// المنافذ الثابتة لكل فئة ترافيك ببجي
var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

// بادئات IPv6 الأردنية حسب الفئة (محدّثة ومؤكدة)
var JO_V6_PREFIX = {
  LOBBY: ["2a01:9700::/29"],   // Zain Jordan
  MATCH: ["2a03:b640::/32"],   // Umniah/Batelco Jordan
  RECRUIT_SEARCH: ["2a03:6b00::/29"], // Linkdotnet-Jordan
  UPDATES: ["2a03:6b00::/29"],       // Linkdotnet-Jordan
  CDN: ["2a03:6b00::/29"]            // Linkdotnet-Jordan
};

// نطاقات IPv4 الأردنية (مستقاة من NIRSoft) - محدّثة وشاملة
var JO_V4_RANGES = [
  ["5.45.128.0","5.45.143.255"],
  ["37.17.192.0","37.17.207.255"],
  ["37.123.64.0","37.123.95.255"],
  ["37.202.64.0","37.202.127.255"],
  ["37.220.112.0","37.220.127.255"],
  ["46.23.112.0","46.23.127.255"],
  ["46.32.96.0","46.32.127.255"],
  ["46.185.128.0","46.185.255.255"],
  ["46.248.192.0","46.248.223.255"],
  ["62.72.160.0","62.72.191.255"],
  ["77.245.0.0","77.245.15.255"],
  ["79.134.128.0","79.134.159.255"],
  ["79.173.192.0","79.173.255.255"],
  ["80.90.160.0","80.90.175.255"],
  ["81.21.0.0","81.21.15.255"],
  ["81.28.112.0","81.28.127.255"],
  ["82.212.64.0","82.212.127.255"],
  ["84.18.32.0","84.18.63.255"],
  ["84.18.64.0","84.18.95.255"],
  ["86.108.0.0","86.108.127.255"],
  ["91.106.96.0","91.106.111.255"],
  ["91.186.224.0","91.186.255.255"],
  ["92.241.32.0","92.241.63.255"],
  ["92.253.0.0","92.253.127.255"],
  ["94.142.32.0","94.142.63.255"],
  ["94.249.0.0","94.249.127.255"],
  ["95.141.208.0","95.141.223.255"],
  ["95.172.192.0","95.172.223.255"],
  ["109.107.224.0","109.107.255.255"],
  ["109.237.192.0","109.237.207.255"],
  ["149.200.128.0","149.200.255.255"],
  ["176.28.128.0","176.28.255.255"],
  ["176.29.0.0","176.29.255.255"],
  ["176.57.0.0","176.57.31.255"],
  ["176.57.48.0","176.57.63.255"],
  ["178.77.128.0","178.77.191.255"],
  ["178.238.176.0","178.238.191.255"],
  ["188.123.160.0","188.123.191.255"],
  ["188.247.64.0","188.247.95.255"],
  ["193.188.64.0","193.188.95.255"],
  ["194.165.128.0","194.165.159.255"],
  ["212.34.0.0","212.34.31.255"],
  ["212.35.64.0","212.35.95.255"],
  ["212.118.0.0","212.118.31.255"],
  ["213.139.32.0","213.139.63.255"],
  ["213.186.160.0","213.186.191.255"],
  ["217.23.32.0","217.23.47.255"],
  ["217.29.240.0","217.29.255.255"],
  ["217.144.0.0","217.144.15.255"]
];

// TTLs
var DNS_TTL_MS = 15*1000;
var PROXY_STICKY_TTL_MS = 60*1000;
var GEO_TTL_MS = 60*60*1000;

// كاش داخلي
var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if(!C.dns) C.dns = {};
if(!C.proxyPick) C.proxyPick = {host:null, t:0, lat:99999};
if(!C.geoClient) C.geoClient = {ok:false, t:0};
if(!C.geoProxy)  C.geoProxy  = {ok:false, t:0};

// دومينات و URL patterns الخاصة بببجي
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

// ---------- أدوات أساسية ----------

// lower-case host
function lc(s){ return s && s.toLowerCase ? s.toLowerCase() : s; }

// match host مع أنماط
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

// match url مع patterns
function urlMatch(u, arr){
  if(!u) return false;
  for(var i=0;i<arr.length;i++){
    if(shExpMatch(u, arr[i])) return true;
  }
  return false;
}

// dnsResolve مع كاش
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

// حول IPv4 string -> رقم 32بت
function ip4ToInt(ip){
  var p = ip.split(".");
  return ( (parseInt(p[0])<<24)>>>0 ) +
         ( (parseInt(p[1])<<16)>>>0 ) +
         ( (parseInt(p[2])<<8)>>>0 ) +
         ( parseInt(p[3])>>>0 );
}

// هل IPv4 أردني؟
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

// expand IPv6 تقريباً
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

// هل IPv6 مطابق للبادئة الأردنية لهالفئة؟
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

// قياس latency مرشح بروكسي (باستخدام dnsResolve timing شايفينه كـ pseudo-ping)
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

// اختيار أسرع بروكسي أردني مع sticky
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

// يبني سترنج البروكسي لفئة معينة
function proxyFor(cat){
  var h=pickProxyHost();
  var pt=FIXED_PORT[cat]||443;
  return "PROXY "+h+":"+pt;
}

// نتحقق إن جهازك نفسه ظاهر كأردني (IPv6 أردني أو IPv4 أردني)
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

// نتأكد البروكسي نفسه أردني (مش واحد برا البلد)
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

// enforceCat = يقرر إذا نسمح ولا لا لفئة معينة (LOBBY/MATCH/...)
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

// الدالة الرئيسية اللي iOS ينفذها
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
      shExpMatch(url,"*/friends/*")               ||
      shExpMatch(url,"*/teamfinder/*")            ||
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
