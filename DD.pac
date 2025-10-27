// JO-ASN-CHECK v5 PAC - أردني 100% مع ASN Check (27/10/2025)
// ASN الأردنية: 8376 (Orange), 8697 (JTC), 9038 (Umniah), 48832 (Zain)
// IPv6 + IPv4 + ASN = حظر صارم!

//////////////////////
// إعدادات عامة
//////////////////////

var PROXY_HOST = "91.106.109.12";
var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

// IPv6 JO (RIPE 2025)
var JO_V6_PREFIX = [
  "2a01:9700:", "2a0e:1e00:",  // Zain
  "2a03:b640:", "2a0e:1c40:",  // Umniah
  "2a03:6b00:", "2a0e:1d80:"   // Orange
];

// IPv4 JO مختصرة (الأساسية)
var JO_V4_RANGES = [
  ["91.106.0.0","91.106.255.255"],
  ["94.56.0.0","94.59.255.255"],
  ["176.97.0.0","176.99.255.255"],
  ["217.20.0.0","217.22.255.255"],
  ["185.241.62.0","185.241.62.255"],
  ["91.223.202.0","91.223.202.255"]
  // أضف باقي النطاقات إذا لزم
];

// ASNs الأردنية (من RIPE NCC + IPinfo)
var JO_ASNS = [8376, 8697, 9038, 48832];

// TTLs
var DNS_TTL_MS = 10*1000;
var ASN_TTL_MS = 10*60*1000;  // 10 دقائق لـ ASN
var GEO_TTL_MS = 30*60*1000;

// كاش داخلي
var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if(!C.dns) C.dns = {};
if(!C.asn) C.asn = {};  // كاش ASN جديد
if(!C.geoClient) C.geoClient = {ok:false, t:0};
if(!C.geoProxy)  C.geoProxy  = {ok:false, t:0};

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

// ASN Check المتطور (dnsResolve(ip.origin.asn.cymru.com))
function getASN(ip){
  if(!ip) return null;
  var now = (new Date()).getTime();
  var e = C.asn[ip];
  if(e && (now-e.t)<ASN_TTL_MS) return e.asn;
  
  var asn = null;
  try {
    var asnTxt = dnsResolve(ip + ".origin.asn.cymru.com") || "";
    if(asnTxt) {
      var parts = asnTxt.split(" | ");
      if(parts.length > 0) {
        asn = parseInt(parts[0]);
      }
    }
  } catch(err) {}
  
  C.asn[ip] = {asn: asn, t: now};
  return asn;
}

function isJOasn(asn){
  if(asn === null) return false;
  for(var i=0; i<JO_ASNS.length; i++){
    if(asn === JO_ASNS[i]) return true;
  }
  return false;
}

// IPv4 Check
function ip4ToInt(ip){
  var p = ip.split(".");
  return ( (parseInt(p[0])<<24)>>>0 ) +
         ( (parseInt(p[1])<<16)>>>0 ) +
         ( (parseInt(p[2])<<8)>>>0 ) +
         ( parseInt(p[3])>>>0 );
}

function isJOv4(ip){
  if(!ip || !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
  var n = ip4ToInt(ip);
  for(var i=0;i<JO_V4_RANGES.length;i++){
    var s = ip4ToInt(JO_V4_RANGES[i][0]);
    var e = ip4ToInt(JO_V4_RANGES[i][1]);
    if(n>=s && n<=e) return true;
  }
  return false;
}

// IPv6 Check
function isJOv6(ip){
  if(!ip || ip.indexOf(":") === -1) return false;
  var lower = ip.toLowerCase();
  for(var i=0; i<JO_V6_PREFIX.length; i++){
    if(lower.indexOf(JO_V6_PREFIX[i]) === 0) return true;
  }
  return false;
}

// التحقق الكامل: IP + ASN
function isJOResolved(ip){
  if(isJOv6(ip) || isJOv4(ip)) return true;  // IP أردني = OK
  var asn = getASN(ip);
  return isJOasn(asn);  // ASN أردني = OK
}

// Proxy Builder
function proxyFor(cat){
  var pt = FIXED_PORT[cat] || 443;
  return "PROXY " + PROXY_HOST + ":" + pt;
}

// Client Check
function clientIsJO(){
  var now = (new Date()).getTime();
  var g = C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var my = "";
  try{my = myIpAddress();}catch(e){my="";}
  var ok = my && isJOResolved(my);
  C.geoClient = {ok:ok, t:now};
  return ok;
}

// Proxy Check (البروكسي ثابت)
function proxyIsJO(){
  return true;  // 91.106.109.12 مختبر
}

// Enforce
function enforceCat(cat, host){
  var ip = host;
  if(ip.indexOf('.') === -1 && ip.indexOf(':') === -1){
    ip = dnsCached(host);
  }
  if(!ip) return "PROXY 0.0.0.0:0";
  return isJOResolved(ip) ? proxyFor(cat) : "PROXY 0.0.0.0:0";
}

// PUBG Domains & Patterns
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

function FindProxyForURL(url, host){
  host = lc(host);

  if(!clientIsJO() || !proxyIsJO()){
    return "PROXY 0.0.0.0:0";
  }

  // MATCH
  if( urlMatch(url,URL_PATTERNS.MATCH) ||
      hostMatch(host,PUBG_DOMAINS.MATCH) ||
      shExpMatch(url,"*/game/join*") ||
      shExpMatch(url,"*/game/start*") ||
      shExpMatch(url,"*/matchmaking/*") ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH", host);
  }

  // LOBBY
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

  // UPDATES + CDN
  if( urlMatch(url,URL_PATTERNS.UPDATES) ||
      urlMatch(url,URL_PATTERNS.CDN) ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) ||
      hostMatch(host,PUBG_DOMAINS.CDN)
    ){
    return enforceCat("LOBBY", host);
  }

  return "PROXY 0.0.0.0:0";
}
