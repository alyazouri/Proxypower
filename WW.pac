/* ==== PAC: PUBG Jordan-Only IPv6 (Single Proxy Device) ==== */
/* بروكسي واحد لكل الفئات — عدّل السطر التالي لعنوان جهازك ذو IPv6 */
var PROXY_HOST = "2a00:18d8::2";      /* ضع هنا IPv6 جهازك (أو إبقِ الافتراضي) */
var FIXED_PORT = { LOBBY:8000, MATCH:20001, RECRUIT_SEARCH:8000, UPDATES:80, CDN:80 };

/* صرامة الأردن */
var STRICT_JO_MATCH   = true;
var STRICT_JO_RECRUIT = true;
var STRICT_JO_LOBBY   = true;

/* تعزيز احتمالية الأردن */
var BLOCK_NON_JO_TRIES = 10;          /* زوّد/خفّض حسب رغبتك */
var BLOCK_WINDOW_MS    = 5*60*1000;

/* كاش وضبط */
var DNS_TTL_MS=5000, PROXY_STICKY_TTL_MS=45000, GEO_TTL_MS=3600000;

var _root=(typeof globalThis!=="undefined")?globalThis:this;
if(!_root._PAC_HARDCACHE)_root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns)C.dns={};                   /* {host:{ip,t}} */
if(!C.geoClient)C.geoClient={ok:false,t:0};
if(!C.blockCnt)C.blockCnt={};

/* نطاقات IPv6 الأردنية — مختصَرة وقويّة */
var JO_V6_PREFIXES = [
  "2a00:18d8::/29",  /* Orange */
  "2a03:6b00::/29",  /* Zain */
  "2a03:b640::/32"   /* Umniah/Batelco */
];

/* نطاقات PUBG */
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

/* ===== أدوات IPv6 ===== */
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
  var out=[];for(var a=0;a<left.length;a++)out.push(parseInt(left[a]||"0",16)&0xffff);
  for(var z=0;z<fill;z++)out.push(0);
  for(var b=0;b<right.length;b++)out.push(parseInt(right[b]||"0",16)&0xffff);
  return out.length===8?out:null;
}
function ipv6InPrefix(words,prefWords,prefLenBits){
  var full=(prefLenBits/16)|0, rem=prefLenBits%16;
  for(var i=0;i<full;i++) if(words[i]!==prefWords[i]) return false;
  if(rem===0) return true;
  var mask=(0xffff<<(16-rem))&0xffff;
  return (words[full]&mask)===(prefWords[full]&mask);
}
if(!C.v6pref){
  C.v6pref=[];
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

/* تحقق من موقع العميل (لازم جهازك نفسه IPv6 أردني) */
function clientIsJOv6(){
  var now=(new Date()).getTime(),g=C.geoClient;
  if(g&&(now-g.t)<GEO_TTL_MS) return g.ok;
  var ip=""; try{
    if(typeof myIpAddressEx==="function"){var arr=myIpAddressEx(); if(arr&&arr.length>0) ip=arr[0];}
    else ip=myIpAddress();
  }catch(_){}
  var ok=isJOv6(ip);
  C.geoClient={ok:ok,t:now};
  return ok;
}

/* DNS ذكي: جرّب dnsResolveEx إن وُجد لاختيار IPv6 أردني أولًا */
function pickJOFromList(list){
  for(var i=0;i<list.length;i++){ var ip=list[i]||""; if(isIPv6(ip) && isJOv6(ip)) return ip; }
  return "";
}
function dnsResolveSmart(host){
  try{
    if(typeof dnsResolveEx==="function"){
      var list=dnsResolveEx(host)||[];
      var picked=pickJOFromList(list);
      if(picked) return picked;
      return "";
    }
  }catch(_){}
  try{ return dnsResolve(host)||""; }catch(_){ return ""; }
}
function dnsCached(host, preferJO){
  var now=(new Date()).getTime(),e=C.dns[host];
  if(e&&(now-e.t)<DNS_TTL_MS){
    if(!(preferJO && !isJOv6(e.ip))) return e.ip;
  }
  var ip=""; 
  for(var i=0;i<3 && (!ip || (preferJO && !isJOv6(ip))); i++){ ip=dnsResolveSmart(host); }
  if(preferJO && !isJOv6(ip)){ C.dns[host]={ip:ip,t:now-DNS_TTL_MS-1}; return ip; }
  C.dns[host]={ip:ip,t:now}; return ip;
}

/* إخراج البروكسي الموحد */
function proxyFor(cat){ var p=FIXED_PORT[cat]||443; return "PROXY ["+PROXY_HOST+"]:"+p; }

/* حجب تكيفي */
function shouldBlockAdaptive(host){
  var now=(new Date()).getTime();
  var s=C.blockCnt[host]; if(!s){ s={n:0,last:0}; C.blockCnt[host]=s; }
  if((now - s.last) > BLOCK_WINDOW_MS){ s.n=0; }
  if(s.n < BLOCK_NON_JO_TRIES){ s.n++; s.last=now; return true; }
  return false;
}

/* فرض الأردن على الفئات الحسّاسة */
function enforceJOProxy(cat, host, preferJO){
  var ip = isIPv6(host) ? host : dnsCached(host, true);
  if(isJOv6(ip)) return proxyFor(cat);
  if(preferJO && shouldBlockAdaptive(host)) return "PROXY 0.0.0.0:0";
  return "PROXY 0.0.0.0:0";
}

/* مطابقة */
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=lc(arr[i]);if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++) if(shExpMatch(u,arr[i])) return true; return false;}
function isExcluded(host){host=lc(host);for(var i=0;i<EXCLUDE_HOSTS.length;i++){var e=lc(EXCLUDE_HOSTS[i]);if(shExpMatch(host,"*"+e)||host===e)return true;}return false;}

/* Main */
function FindProxyForURL(url,host){
  host=lc(host);
  if(isExcluded(host)) return "DIRECT";
  if(!clientIsJOv6()) return "PROXY 0.0.0.0:0";

  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)){
    if(STRICT_JO_MATCH)   return enforceJOProxy("MATCH",host,true);
    return proxyFor("MATCH");
  }
  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH)){
    if(STRICT_JO_RECRUIT) return enforceJOProxy("RECRUIT_SEARCH",host,true);
    return proxyFor("RECRUIT_SEARCH");
  }
  if(urlMatch(url,URL_PATTERNS.LOBBY)||hostMatch(host,PUBG_DOMAINS.LOBBY)){
    if(STRICT_JO_LOBBY)   return enforceJOProxy("LOBBY",host,true);
    return proxyFor("LOBBY");
  }

  if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES))
    return proxyFor("UPDATES");
  if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN))
    return proxyFor("CDN");

  return "DIRECT";
}
