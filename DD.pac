// JO-HARD-MODE PAC
// هدف: أعلى احتمال ممكن للعينات الأردنية (لاعبين أردنيين) في اللوبي والماتش
// صارم جداً. أي مسار مش أردني = بلوك نهائي.

//////////////////////
// إعدادات عامة
//////////////////////

// مرشحي البروكسي الأردني (ضيف أكثر من واحد إذا عندك بوابات ثانية)
var PROXY_CANDIDATES = [
  "91.106.109.12"     // بروكسيك الأساسي
  // أضف مثلاً "91.106.109.13" أو "176.29.10.5" إذا عندك خوادم أردنية ثانية
];

// المنافذ الثابتة لكل فئة ترافيك ببجي
var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

// بادئات IPv6 الأردنية حسب الفئة
var JO_V6_PREFIX = {
  LOBBY: ["2a01:9700:"],   // زين الأردن (/29)
  MATCH: ["2a03:b640:"],   // أمنية الأردن (/32)
  RECRUIT_SEARCH: ["2a03:6b00:"],
  UPDATES: ["2a03:6b00:"],
  CDN: ["2a03:6b00:"]
};

// IPv4 ranges أردنية (أساس من نطاقاتك السابقة). ما غيرتها ولا وسّعتها برّا الأردن.
// كل سطر [start,end] بالنظام العشري.
var JO_V4_RANGES = [
  ["176.97.0.0","176.99.255.255"],
  ["176.47.0.0","176.52.255.255"],
  ["176.16.0.0","176.23.255.255"],
  ["94.64.0.0","94.72.255.255"],
  ["91.176.0.0","91.184.255.255"],
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
  ["109.86.0.0","109.86.255.255"],
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

// هل IPv4 أردني؟ + يظهر النطاق فوراً
function isJOv4(ip){
  if(!ip) return false;
  if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
  var n = ip4ToInt(ip);
  for(var i=0;i<JO_V4_RANGES.length;i++){
    var s = ip4ToInt(JO_V4_RANGES[i][0]);
    var e = ip4ToInt(JO_V4_RANGES[i][1]);
    if(n>=s && n<=e){
      // إظهار النطاق فوراً داخل الـ PAC (alert أو console)
      var msg = "JO IP: " + ip + "\nفي النطاق: " + JO_V4_RANGES[i][0] + " - " + JO_V4_RANGES[i][1];
      try { alert(msg); } catch(e) {}
      try { console.log(msg); } catch(e) {}
      return true;
    }
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

// قياس latency مرشح بروكسي
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

// نتحقق إن جهازك نفسه ظاهر كأردني
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

// نتأكد البروكسي نفسه أردني
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

// enforceCat = يقرر إذا نسمح ولا لا لفئة معينة
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

// الدالة الرئيسية
function FindProxyForURL(url, host){
  host = lc(host);

  if(!clientIsJO() || !proxyIsJO()){
    return "PROXY 0.0.0.0:0";
  }

  if( urlMatch(url,URL_PATTERNS.MATCH) ||
      hostMatch(host,PUBG_DOMAINS.MATCH) ||
      shExpMatch(url,"*/game/join*") ||
      shExpMatch(url,"*/game/start*") ||
      shExpMatch(url,"*/matchmaking/*") ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH", host);
  }

  if( urlMatch(url,URL_PATTERNS.LOBBY) ||
      hostMatch(host,PUBG_DOMAINS.LOBBY) ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH) ||
      hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url,"*/status/heartbeat*") ||
      shExpMatch(url,"*/friends/*") ||
      shExpMatch(url,"*/teamfinder/*") ||
      shExpMatch(url,"*/recruit/*")
    ){
    return enforceCat("LOBBY", host);
  }

  if( urlMatch(url,URL_PATTERNS.UPDATES) ||
      urlMatch(url,URL_PATTERNS.CDN) ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) ||
      hostMatch(host,PUBG_DOMAINS.CDN)
    ){
    return enforceCat("LOBBY", host);
  }

  return "PROXY 0.0.0.0:0";
}
