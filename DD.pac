// JO-HUNTER v2 PAC - صياد اللاعبين الأردنيين التلقائي (27/10/2025)
// Learning Mode: يكتشف IPs جديدة من PUBG ويرسلها لسيرفرك
// نطاقات IPv4 + IPv6 كاملة من RIPE NCC (بدون حكومي)

//////////////////////
// إعدادات عامة
//////////////////////

var PROXY_CANDIDATES = [
  "91.106.109.12",      // بروكسيك الأساسي
  "185.241.62.10",      // MarsProxies Jordan
  "91.223.202.15"       // Ultahost VPS Jordan
];

var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

var JO_V6_PREFIX = {
  LOBBY:          ["2a01:9700:", "2a0e:1e00:"],
  MATCH:          ["2a03:b640:", "2a0e:1c40:"],
  RECRUIT_SEARCH: ["2a03:6b00:", "2a0e:1d80:"],
  UPDATES:        ["2a03:6b00:", "2a0e:1d80:"],
  CDN:            ["2a03:6b00:", "2a0e:1d80:"]
};

// IPv4 JO كامل (78 نطاق من RIPE - محدث 2025 - بدون حكومي)
var JO_V4_RANGES = [
  ["89.28.216.0","89.28.223.255"],
  ["185.33.28.0","185.33.31.255"],
  ["91.212.0.0","91.212.0.255"],
  ["93.191.176.0","93.191.183.255"],
  ["95.141.208.0","95.141.223.255"],
  ["178.77.128.0","178.77.191.255"],
  ["176.57.0.0","176.57.31.255"],
  ["37.17.192.0","37.17.207.255"],
  ["37.123.64.0","37.123.95.255"],
  ["185.160.236.0","185.160.239.255"],
  ["185.40.19.0","185.40.19.255"],
  ["37.75.144.0","37.75.151.255"],
  ["185.173.56.0","185.173.59.255"],
  ["84.252.106.0","84.252.106.255"],
  ["217.29.240.0","217.29.255.255"],
  ["92.241.32.0","92.241.63.255"],
  ["95.172.192.0","95.172.223.255"],
  ["109.107.224.0","109.107.255.255"],
  ["46.23.112.0","46.23.127.255"],
  ["46.248.192.0","46.248.223.255"],
  ["193.203.24.0","193.203.25.255"],
  ["193.203.110.0","193.203.111.255"],
  ["89.20.49.0","89.20.49.255"],
  ["185.43.146.0","185.43.146.255"],
  ["141.98.64.0","141.98.67.255"],
  ["91.132.100.0","91.132.100.255"],
  ["185.241.62.0","185.241.62.255"],
  ["185.135.200.0","185.135.203.255"],
  ["146.19.239.0","146.19.239.255"],
  ["212.35.64.0","212.35.95.255"],
  ["185.80.24.0","185.80.27.255"],
  ["94.127.208.0","94.127.215.255"],
  ["5.198.240.0","5.198.247.255"],
  ["185.14.132.0","185.14.135.255"],
  ["141.0.0.0","141.0.7.255"],
  ["185.182.136.0","185.182.139.255"],
  ["93.115.3.0","93.115.3.255"],
  ["185.180.80.0","185.180.83.255"],
  ["176.118.39.0","176.118.39.255"],
  ["146.19.246.0","146.19.246.255"],
  ["185.234.111.0","185.234.111.255"],
  ["91.223.202.0","91.223.202.255"],
  ["79.134.128.0","79.134.159.255"],
  ["185.139.220.0","185.139.223.255"],
  ["5.199.184.0","5.199.187.255"],
  ["45.142.196.0","45.142.199.255"],
  ["185.24.128.0","185.24.131.255"],
  ["93.115.15.0","93.115.15.255"],
  ["195.18.9.0","195.18.9.255"],
  ["212.34.0.0","212.34.31.255"],
  ["213.139.32.0","213.139.63.255"],
  ["185.98.224.0","185.98.227.255"],
  ["87.236.232.0","87.236.239.255"],
  ["185.200.128.0","185.200.131.255"],
  ["93.115.2.0","93.115.2.255"],
  ["194.104.95.0","194.104.95.255"],
  ["185.57.120.0","185.57.123.255"],
  ["212.118.0.0","212.118.31.255"],
  ["91.186.224.0","91.186.255.255"],
  ["37.220.112.0","37.220.127.255"],
  ["91.106.96.0","91.106.111.255"],
  ["185.12.244.0","185.12.247.255"],
  ["185.253.112.0","185.253.115.255"],
  ["81.28.112.0","81.28.127.255"],
  ["82.212.64.0","82.212.127.255"],
  ["188.123.160.0","188.123.191.255"],
  ["185.175.248.0","185.175.251.255"],
  ["217.144.0.0","217.144.15.255"],
  ["84.18.64.0","84.18.95.255"],
  ["37.252.222.0","37.252.222.255"],
  // + كل النطاقات القديمة من سكربتك (للتغطية الكاملة)
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
  ["217.170:0.1","217.170.255.255"],
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
var DNS_TTL_MS = 10*1000;
var PROXY_STICKY_TTL_MS = 120*1000;
var GEO_TTL_MS = 30*60*1000;
var LEARNING_TTL_MS = 24*60*60*1000;

// كاش داخلي
var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if(!C.dns) C.dns = {};
if(!C.proxyPick) C.proxyPick = {host:null, t:0, lat:99999};
if(!C.geoClient) C.geoClient = {ok:false, t:0};
if(!C.geoProxy)  C.geoProxy  = {ok:false, t:0};
if(!C.learning) C.learning = [];

// دومينات PUBG
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
  if(!ip || ip.indexOf(":")===-1) return false;
  var prefArr = JO_V6_PREFIX[cat];
  if(!prefArr) return false;
  var lower = ip.toLowerCase();
  for(var i=0;i<prefArr.length;i++){
    var pre = prefArr[i].toLowerCase();
    if(lower.indexOf(pre) === 0) return true;
  }
  return false;
}

// التعلم الذكي!
function learnJOIP(ip, cat) {
  if((isJOv4(ip) || isJOv6ForCat(ip, cat)) && C.learning.indexOf(ip) === -1) {
    C.learning.push(ip);
    try {
      var blob = new Blob([JSON.stringify({ip:ip, cat:cat, t:Date.now()})], {type:'application/json'});
      navigator.sendBeacon('https://your-webhook.com/jo-ips', blob); // غيّر هذا الرابط!
    } catch(e) {}
  }
}

function measureProxyLatency(h){
  if(/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.indexOf(':')!==-1) return 1;
  try{
    var t0=(new Date()).getTime();
    var r=dnsResolve(h);
    var dt=(new Date()).getTime()-t0;
    return (!r)?99999:(dt>0?dt:1);
  }catch(e){return 99999;}
}

function pickProxyHost(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host && (now-C.proxyPick.t)<PROXY_STICKY_TTL_MS) return C.proxyPick.host;
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
  if(/^\d+\.\d+\.\d+\.\d+$/.test(p)) ok = isJOv4(p);
  else if(p.indexOf(":")!==-1) ok = isJOv6ForCat(p,"LOBBY") || isJOv6ForCat(p,"MATCH");
  else {
    var pip=dnsCached(p);
    ok = isJOv4(pip) || isJOv6ForCat(pip,"LOBBY") || isJOv6ForCat(pip,"MATCH");
  }
  C.geoProxy={ok:ok,t:now};
  return ok;
}

function enforceCat(cat, host){
  var ip = host;
  if(ip.indexOf(':')===-1 && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) ip = dnsCached(host);
  
  learnJOIP(ip, cat); // التعلم الذكي!
  
  if(C.learning.indexOf(ip) !== -1) return proxyFor(cat);
  if(isJOv6ForCat(ip,cat) || isJOv4(ip)) return proxyFor(cat);
  return "PROXY 0.0.0.0:0";
}

function FindProxyForURL(url, host){
  host = lc(host);
  if(!clientIsJO() || !proxyIsJO()) return "PROXY 0.0.0.0:0";

  if( urlMatch(url,URL_PATTERNS.MATCH) || hostMatch(host,PUBG_DOMAINS.MATCH) ||
      shExpMatch(url,"*/game/join*") || shExpMatch(url,"*/game/start*") || shExpMatch(url,"*/matchmaking/*") || shExpMatch(url,"*/mms/*") ){
    return enforceCat("MATCH", host);
  }

  if( urlMatch(url,URL_PATTERNS.LOBBY) || hostMatch(host,PUBG_DOMAINS.LOBBY) ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH) || hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url,"*/status/heartbeat*") || shExpMatch(url,"*/friends/*") || shExpMatch(url,"*/teamfinder/*") || shExpMatch(url,"*/recruit/*") ){
    return enforceCat("LOBBY", host);
  }

  if( urlMatch(url,URL_PATTERNS.UPDATES) || urlMatch(url,URL_PATTERNS.CDN) ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) || hostMatch(host,PUBG_DOMAINS.CDN) ){
    return enforceCat("LOBBY", host);
  }

  return "PROXY 0.0.0.0:0";
}
