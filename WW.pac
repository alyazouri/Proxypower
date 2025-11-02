/* ==== PAC: PUBG Jordan-Only IPv6 (Strict Team/Opponent in-JO) ==== */
var PROXY_CANDIDATES = ["2a01:4f00::2"];
var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };

var STRICT_JO_MATCH = true;           /* يجبر الفريق والخصم من داخل الأردن */
var STRICT_JO_RECRUIT = true;         /* يجبر البحث/التجنيد من داخل الأردن فقط */
var DNS_TTL_MS=15000, PROXY_STICKY_TTL_MS=60000, GEO_TTL_MS=3600000;

/* نطاقات IPv6 الأردنية */
var JO_V6_PREFIXES = [
  "2a0d:5300::/29",   /* Umniah new */
  "2a03:6b00::/29",   /* Zain */
  "2a03:b640::/32"    /* Umniah/Batelco */
];

/* PUBG domains / URL patterns */
var PUBG_DOMAINS = {
  LOBBY: ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH: ["*.gcloud.qq.com","gpubgm.com","*.pubgmobile.com","*.proximabeta.com","*.igamecj.com"],
  RECRUIT_SEARCH: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES: ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN: ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};
var URL_PATTERNS = {
  LOBBY: ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH: ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*","*/room/*","*/custommatch/*"],
  RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*","*/squad/*","*/party/*"],
  UPDATES: ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN: ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};
var EXCLUDE_HOSTS = ["youtube.com","ytimg.com","googleapis.com","whatsapp.com","snapchat.com","sc-cdn.net"];

var _root=(typeof globalThis!=="undefined")?globalThis:this;
if(!_root._PAC_HARDCACHE)_root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns)C.dns={};
if(!C.proxyPick)C.proxyPick={host:null,t:0,lat:99999};
if(!C.geoClient)C.geoClient={ok:false,t:0};

function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIPv6(s){return /^[0-9a-fA-F:]+$/.test(s||"") && s.indexOf(":")>=0;}
function parseIPv6Words(addr){
  if(/:.*\./.test(addr)){
    var i=addr.lastIndexOf(":"),head=addr.substring(0,i),v4=addr.substring(i+1),p=v4.split(".");
    if(p.length===4){
      var w6=((parseInt(p[0])<<8)|parseInt(p[1]))&0xffff;
      var w7=((parseInt(p[2])<<8)|parseInt(p[3]))&0xffff;
      addr=head+":"+w6.toString(16)+":"+w7.toString(16);
    }
  }
  var parts=addr.split("::"),left=parts[0]?parts[0].split(":"):[],right=(parts.length>1&&parts[1])?parts[1].split(":"):[];
  if(parts.length===1){if(left.length!==8)return null;return left.map(h=>parseInt(h||"0",16)&0xffff);}
  var fill=8-(left.length+right.length);if(fill<0)return null;
  var arr=[];for(var i1=0;i1<left.length;i1++)arr.push(parseInt(left[i1]||"0",16)&0xffff);
  for(var j=0;j<fill;j++)arr.push(0);
  for(var k=0;k<right.length;k++)arr.push(parseInt(right[k]||"0",16)&0xffff);
  return arr.length===8?arr:null;
}
function ipv6InPrefix(words,prefWords,prefLenBits){
  var full=Math.floor(prefLenBits/16),rem=prefLenBits%16;
  for(var i=0;i<full;i++) if(words[i]!==prefWords[i])return false;
  if(rem===0)return true;
  var mask=(0xffff<<(16-rem))&0xffff;
  return (words[full]&mask)===(prefWords[full]&mask);
}
if(!C.v6pref){C.v6pref=[];
  for(var i=0;i<JO_V6_PREFIXES.length;i++){
    var p=JO_V6_PREFIXES[i].split("/");
    var w=parseIPv6Words(p[0]); var l=parseInt(p[1],10);
    if(w) C.v6pref.push({w:w,len:l});
  }
}
function isJOv6(ip){
  if(!isIPv6(ip)) return false;
  var w=parseIPv6Words(ip); if(!w) return false;
  for(var i=0;i<C.v6pref.length;i++)
    if(ipv6InPrefix(w,C.v6pref[i].w,C.v6pref[i].len)) return true;
  return false;
}

/* تحقق من موقع العميل */
function clientIsJOv6(){
  var now=(new Date()).getTime(),g=C.geoClient;
  if(g&&(now-g.t)<GEO_TTL_MS)return g.ok;
  var ip=""; try{
    if(typeof myIpAddressEx==="function"){var arr=myIpAddressEx(); if(arr&&arr.length>0) ip=arr[0];}
    else ip=myIpAddress();
  }catch(_){}
  var ok=isJOv6(ip);
  C.geoClient={ok:ok,t:now};
  return ok;
}

/* كاش DNS */
function dnsCached(host){
  var now=(new Date()).getTime(),e=C.dns[host];
  if(e&&(now-e.t)<DNS_TTL_MS) return e.ip;
  var ip=""; try{ip=dnsResolve(host)||"";}catch(_){}
  C.dns[host]={ip:ip,t:now}; return ip;
}

/* البروكسي */
function proxyFor(cat){var h=PROXY_CANDIDATES[0];var p=FIXED_PORT[cat]||443;return "PROXY ["+h+"]:"+p;}

/* مطابقة */
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=lc(arr[i]);if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++)if(shExpMatch(u,arr[i]))return true;return false;}
function isExcluded(host){host=lc(host);for(var i=0;i<EXCLUDE_HOSTS.length;i++){var e=lc(EXCLUDE_HOSTS[i]);if(shExpMatch(host,"*"+e)||host===e)return true;}return false;}

function enforceJOProxy(cat, host){
  var ip = isIPv6(host) ? host : dnsCached(host);
  if(isJOv6(ip)) return proxyFor(cat);
  return "PROXY 0.0.0.0:0";  /* block non-Jordanian */
}

/* Main */
function FindProxyForURL(url,host){
  host=lc(host);
  if(isExcluded(host)) return "DIRECT";
  if(!clientIsJOv6()) return "PROXY 0.0.0.0:0";  /* device must be JO IPv6 */

  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)){
    if(STRICT_JO_MATCH) return enforceJOProxy("MATCH",host);
    return proxyFor("MATCH");
  }

  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH)){
    if(STRICT_JO_RECRUIT) return enforceJOProxy("RECRUIT_SEARCH",host);
    return proxyFor("RECRUIT_SEARCH");
  }

  if(urlMatch(url,URL_PATTERNS.LOBBY)||hostMatch(host,PUBG_DOMAINS.LOBBY))
    return proxyFor("LOBBY");

  if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES))
    return proxyFor("UPDATES");

  if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN))
    return proxyFor("CDN");

  return "DIRECT";
}
