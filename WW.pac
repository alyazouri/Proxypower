/* ==== PAC: PUBG Jordan-Only IPv6 (Strict JO + Aggressive Bias) ==== */
/* هدف: زيادة احتمال أن يكون الفريق والخصوم من داخل الأردن عبر IPv6 أردني فقط */

var PROXY_CANDIDATES = ["2a03:6b01:8000::2"]; /* جهازك ذو IPv6 */
var FIXED_PORT = { LOBBY:8443, MATCH:20001, RECRUIT_SEARCH:8443, UPDATES:8080, CDN:8080 };

/* صرامة الأردن على الفئات الحساسة */
var STRICT_JO_LOBBY   = true;   /* يثبت منطقتك على الأردن */
var STRICT_JO_RECRUIT = true;   /* البحث/التجنيد = أردن فقط (يرفع نسبة الفريق الأردني) */
var STRICT_JO_MATCH   = true;   /* المباراة/السيرفرات = أردن فقط (يرفع نسبة الخصوم الأردنيين) */

/* تعزيز احتمالية الأردن */
var BLOCK_NON_JO_TRIES = 10;           /* كم محاولة نحجب فيها الوجهة غير الأردنية */
var BLOCK_WINDOW_MS    = 5*60*1000;    /* نافذة العدّ */
var DNS_TTL_MS         = 5000;         /* كسر الكاش بسرعة لالتقاط RR أردني */
var PROXY_STICKY_TTL_MS= 45000;        /* تثبيت اختيار البروكسي */
var GEO_TTL_MS         = 3600000;

var _root=(typeof globalThis!=="undefined")?globalThis:this;
if(!_root._PAC_HARDCACHE)_root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns)C.dns={};                   /* {host:{ip,t}} */
if(!C.proxyPick)C.proxyPick={host:null,t:0,lat:99999};
if(!C.geoClient)C.geoClient={ok:false,t:0};
if(!C.blockCnt)C.blockCnt={};         /* {host:{n,last}} */
if(!C.lastJO)C.lastJO={};             /* تثبيت أردني للّوبي لدقيقة */

/* نطاقات IPv6 الأردنية (حسب سكربتك الأصلي) */
var JO_V6_PREFIXES = [
  "2a00:18d8::/29",       /* Orange */
  "2a03:6b01::/34",       /* Zain */
  "2a03:6b00::/40",       /* Zain (extra) */
  "2a03:6b01:8000::/34",  /* Zain (optional widen) */
  "2a03:6b02:2000::/48",  /* Zain (optional widen) */
  "2a03:b640::/32",       /* Umniah/Batelco */
  "2a01:9700::/32",       /* JDC/GO */
  "2a01:1d0::/32"         /* VTEL */
];

/* PUBG domains */
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

/* تحقق من موقع العميل (لازم جهازك IPv6 أردني) */
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

/* DNS ذكي: نحاول التقاط IPv6 أردني من جميع RR إن توفرت dnsResolveEx */
function pickJOFromList(list){
  for(var i=0;i<list.length;i++){ var ip=list[i]||""; if(isIPv6(ip)&&isJOv6(ip)) return ip; }
  return "";
}
function dnsResolveSmart(host){
  try{
    if(typeof dnsResolveEx==="function"){
      var list=dnsResolveEx(host)||[];
      var jo=pickJOFromList(list);
      if(jo) return jo;         /* رجّع الأردني فقط */
      return "";                /* فاضي = فعّل الحجب/إعادة المحاولة */
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

/* اختيار بروكسي واحد (جهازك) */
function measureProxyLatency(h){ if(isIPv6(h))return 1; try{var t0=(new Date()).getTime(); dnsResolve(h); return (new Date()).getTime()-t0;}catch(_){return 99999;} }
function pickProxyHost(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host&&(now-C.proxyPick.t)<PROXY_STICKY_TTL_MS) return C.proxyPick.host;
  var best=PROXY_CANDIDATES[0];
  C.proxyPick={host:best,t:now,lat:measureProxyLatency(best)};
  return best;
}
function proxyFor(cat){ var h=pickProxyHost(); var p=FIXED_PORT[cat]||443; return "PROXY ["+h+"]:"+p; }

/* حجب تكيفي لرفع نسبة الأردن */
function shouldBlockAdaptive(host){
  var now=(new Date()).getTime();
  var s=C.blockCnt[host]; if(!s){ s={n:0,last:0}; C.blockCnt[host]=s; }
  if((now - s.last) > BLOCK_WINDOW_MS){ s.n=0; }
  if(s.n < BLOCK_NON_JO_TRIES){ s.n++; s.last=now; return true; }
  return false;
}

/* تثبيت لوبي: لو كان أردني قبل دقيقة، فضّل الاستمرار أردني */
function stickyLobby(host, isJO){
  var now=(new Date()).getTime(); var key="l:"+host;
  var rec=C.lastJO[key]||{ok:false,t:0};
  if(isJO){ C.lastJO[key]={ok:true,t:now}; return true; }
  if((now-rec.t)<60000 && rec.ok) return true;
  return false;
}

/* فرض الأردن للفئات الحساسة + تعزيز */
function enforceJOProxy(cat, host, preferJO){
  var ip = isIPv6(host) ? host : dnsCached(host, true);
  var jo = isJOv6(ip);
  if(cat==="LOBBY") jo = stickyLobby(host, jo);
  if(jo) return proxyFor(cat);
  if(preferJO && shouldBlockAdaptive(host)) return "PROXY 0.0.0.0:0"; /* أجبر اللعبة تعيد المحاولة */
  return "PROXY 0.0.0.0:0";
}

/* مطابقة/استثناءات */
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=lc(arr[i]);if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++)if(shExpMatch(u,arr[i]))return true;return false;}
function isExcluded(host){host=lc(host);for(var i=0;i<EXCLUDE_HOSTS.length;i++){var e=lc(EXCLUDE_HOSTS[i]);if(shExpMatch(host,"*"+e)||host===e)return true;}return false;}

/* Main */
function FindProxyForURL(url,host){
  host=lc(host);
  if(isExcluded(host)) return "DIRECT";
  if(!clientIsJOv6()) return "PROXY 0.0.0.0:0"; /* لازم جهازك IPv6 أردني */

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
