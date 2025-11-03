// JO-HARD-MODE PAC — v5 (strict, optimized, final)
// هدف: أقصى احتمال للّوبي/الماتش الأردني. أي مسار غير أردني = بلوك نهائي.

//================== إعدادات عامة ==================//
var PROXY_CANDIDATES = [
  "91.106.109.12"
];

var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

// بادئات IPv6 الأردنية — محدثة (تشمل Umniah/JDC و Zain المضافة لاحقاً)
var JO_V6_PREFIX = {
  LOBBY: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ],
  MATCH: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ],
  RECRUIT_SEARCH: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ],
  UPDATES: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ],
  CDN: [
    "2a03:6b01:8000::/34",
    "2a03:6b01:4000::/34",
    "2001:67c:27c0::/48",
    "2001:67c:2b40::/48",
    "2a0e:b47::/32"
  ]
};

// IPv4 ranges أردنية — الأحدث أولاً
var JO_V4_RANGES = [
  ["217.25.0.0","217.25.255.255"],
  ["212.118.0.0","212.118.255.255"],
  ["212.35.0.0","212.35.255.255"],
  ["213.186.0.0","213.186.255.255"],
  ["213.187.0.0","213.187.255.255"],
  ["176.29.0.0","176.29.255.255"],
  ["87.236.0.0","87.236.255.255"],
  ["87.237.0.0","87.237.255.255"],
  ["94.142.0.0","94.142.255.255"],
  ["109.224.0.0","109.224.255.255"],
  ["37.236.0.0","37.236.255.255"],
  ["37.237.0.0","37.237.255.255"],
  ["46.23.0.0","46.23.255.255"],
  ["109.110.0.0","109.110.255.255"],
  ["81.28.0.0","81.28.255.255"],
  ["46.60.0.0","46.60.255.255"],
  ["46.185.0.0","46.185.255.255"],
  ["185.108.0.0","185.108.255.255"]
];

// TTLs & كاش
var DNS_TTL_MS = 15*1000;
var PROXY_STICKY_TTL_MS = 60*1000;
var GEO_TTL_MS = 60*60*1000;

var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
C.dns = C.dns || {};
C.proxyPick = C.proxyPick || {host:null, t:0, lat:99999};
C.geoClient = C.geoClient || {ok:false, t:0};
C.geoProxy  = C.geoProxy  || {ok:false, t:0};

//================== PUBG domains & URL patterns ==================//
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

//================== الأدوات المساعدة ==================//
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIp4(s){return /^\d+\.\d+\.\d+\.\d+$/.test(s);}
function isIp6Literal(s){return s&&s.indexOf(":")!==-1;}
function hostMatch(h,arr){h=lc(h||"");if(!h)return false;for(var i=0;i<arr.length;i++){var pat=arr[i];if(shExpMatch(h,pat))return true;if(pat.indexOf("*.")==0){var suf=pat.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++){if(shExpMatch(u,arr[i]))return true;}return false;}
function dnsCached(h){if(!h)return"";var now=(new Date()).getTime();var e=C.dns[h];if(e&&(now-e.t)<DNS_TTL_MS)return e.ip;var ip="";try{ip=dnsResolve(h)||"";}catch(err){ip="";}C.dns[h]={ip:ip,t:now};return ip;}
function ip4ToInt(ip){var p=ip.split(".");return(((+p[0])<<24)>>>0)+(((+p[1])<<16)>>>0)+(((+p[2])<<8)>>>0)+((+p[3])>>>0);}
function rangePair(a){return{s:ip4ToInt(a[0]),e:ip4ToInt(a[1])};}
if(!C._JO_V4I){C._JO_V4I=[];for(var _i=0;_i<JO_V4_RANGES.length;_i++){var pr=rangePair(JO_V4_RANGES[_i]);if(pr.s<=pr.e)C._JO_V4I.push(pr);}}
function isJOv4(ip){if(!ip||!isIp4(ip))return false;var n=ip4ToInt(ip);for(var i=0;i<C._JO_V4I.length;i++){var r=C._JO_V4I[i];if(n>=r.s&&n<=r.e)return true;}return false;}
function pad4(h){return("0000"+h).slice(-4);}
function norm6(ip){if(!ip)return"";ip=ip.toLowerCase();if(ip.indexOf("::")==-1){var parts=ip.split(":");while(parts.length<8)parts.push("0");return parts.map(pad4).join(":");}var left=ip.split("::")[0];var right=ip.split("::")[1];var L=left?left.split(":"):[];var R=right?right.split(":"):[];var miss=8-(L.length+R.length);var zeros=[];for(var i=0;i<miss;i++)zeros.push("0");return(L.concat(zeros).concat(R)).map(pad4).join(":");}
function parseCidr6(s){s=s.replace(/:+$/,"");var m=s.split("/");var pre=m[0];var len=m.length>1?parseInt(m[1],10):(pre.split(":").length>=2?32:16);return{norm:norm6(pre),len:len};}
function ip6ToBits(ip){var parts=norm6(ip).split(":");var bits="";for(var i=0;i<8;i++){var v=parseInt(parts[i],16);bits+=("0000000000000000"+v.toString(2)).slice(-16);}return bits;}
function match6(ip,cidr){if(!ip)return false;var b1=ip6ToBits(ip);var b2=ip6ToBits(cidr.norm);var L=Math.max(0,Math.min(128,cidr.len|0));return b1.substring(0,L)===b2.substring(0,L);}
function isJOv6ForCat(ip,cat){if(!ip||ip.indexOf(":")==-1)return false;var arr=JO_V6_PREFIX[cat];if(!arr||!arr.length)return false;for(var i=0;i<arr.length;i++){var c=parseCidr6(arr[i]);if(match6(ip,c))return true;}return false;}

//================== الدالة الرئيسية ==================//
function FindProxyForURL(url,host){
  host=lc(host);
  if(!clientIsJO()||!proxyIsJO())return"PROXY 0.0.0.0:0";

  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)||
     shExpMatch(url,"*/game/join*")||shExpMatch(url,"*/game/start*")||
     shExpMatch(url,"*/matchmaking/*")||shExpMatch(url,"*/mms/*"))
    return enforceCat("MATCH",host);

  if(urlMatch(url,URL_PATTERNS.LOBBY)||hostMatch(host,PUBG_DOMAINS.LOBBY)||
     urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH)||
     shExpMatch(url,"*/status/heartbeat*")||shExpMatch(url,"*/friends/*")||
     shExpMatch(url,"*/teamfinder/*")||shExpMatch(url,"*/recruit/*"))
    return enforceCat("LOBBY",host);

  if(urlMatch(url,URL_PATTERNS.UPDATES)||urlMatch(url,URL_PATTERNS.CDN)||
     hostMatch(host,PUBG_DOMAINS.UPDATES)||hostMatch(host,PUBG_DOMAINS.CDN))
    return enforceCat("LOBBY",host);

  return"PROXY 0.0.0.0:0";
}
