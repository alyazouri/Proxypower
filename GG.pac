/* ==== PAC: PUBG Jordan-Only (IPv6-only) ==== */
/* عدّل عنوان البروكسي IPv6 إذا لزم */
var PROXY_CANDIDATES = ["2a03:6b01:8000::2"];
var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };

/* نطاقات IPv6 الأردنية */
var JO_V6_PREFIXES = [
  "2a03:6b01:4000::/38",
  "2a03:6b01:4000::/34",
  "2a03:6b01:4400::/38",
  "2a03:6b01:6000::/38",
  "2a03:6b01:6400::/38",
  "2a03:6b01:8000::/34",
  "2a03:6b01:8000::/40",
  "2a03:6b02:2000::/48"
];

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

/* استثناءات دايركت */
var EXCLUDE_HOSTS = ["youtube.com","youtu.be","ytimg.com","googleapis.com","whatsapp.com","snapchat.com","sc-cdn.net"];

var DNS_TTL_MS=15000, PROXY_STICKY_TTL_MS=60000, GEO_TTL_MS=3600000;
var _root=(typeof globalThis!=="undefined")?globalThis:this;
if(!_root._PAC_HARDCACHE)_root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns)C.dns={};
if(!C.proxyPick)C.proxyPick={host:null,t:0,lat:99999};
if(!C.geoClient)C.geoClient={ok:false,t:0};
if(!C.geoProxy)C.geoProxy={ok:false,t:0};

/* ===== أدوات IPv6 ===== */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIPv6(s){return /^[0-9a-fA-F:]+$/.test(s||"") && s.indexOf(":")>=0;}
function parseIPv6Words(addr){
  if(/:.*\./.test(addr)){var i=addr.lastIndexOf(":"),head=addr.substring(0,i),v4=addr.substring(i+1),p=v4.split(".");
  if(p.length===4){var w6=((parseInt(p[0])<<8)|parseInt(p[1]))&0xffff;var w7=((parseInt(p[2])<<8)|parseInt(p[3]))&0xffff;
  addr=head+":"+w6.toString(16)+":"+w7.toString(16);}}
  var parts=addr.split("::");var left=parts[0]?parts[0].split(":"):[];
  var right=(parts.length>1&&parts[1])?parts[1].split(":"):[];
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
    var w=parseIPv6Words(p[0]);
    var l=parseInt(p[1],10);
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

/* DNS كاش */
function dnsCached(host){
  var now=(new Date()).getTime(),e=C.dns[host];
  if(e&&(now-e.t)<DNS_TTL_MS) return e.ip;
  var ip=""; try{ip=dnsResolve(host)||"";}catch(_){}
  C.dns[host]={ip:ip,t:now}; return ip;
}

/* === أدوات البروكسي === */
function measureProxyLatency(h){if(isIPv6(h))return 1;try{var t0=(new Date()).getTime();dnsResolve(h);return (new Date()).getTime()-t0;}catch(_){return 99999;}}
function pickProxyHost(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host&&(now-C.proxyPick.t)<PROXY_STICKY_TTL_MS)return C.proxyPick.host;
  var best=null,bestLat=99999;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){var c=PROXY_CANDIDATES[i];var l=measureProxyLatency(c);if(l<bestLat){best=c;bestLat=l;}}
  if(!best)best=PROXY_CANDIDATES[0];
  C.proxyPick={host:best,t:now,lat:bestLat};return best;
}
function proxyFor(cat){var h=pickProxyHost();var p=FIXED_PORT[cat]||443;return "PROXY ["+h+"]:"+p;}

/* ==== المنطق ==== */
function enforceCat(cat,host){
  var ip=isIPv6(host)?host:dnsCached(host);
  if(isJOv6(ip)) return proxyFor(cat);
  return "PROXY 0.0.0.0:0"; // حظر غير الأردني
}
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=lc(arr[i]);if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++)if(shExpMatch(u,arr[i]))return true;return false;}
function isExcluded(host){host=lc(host);for(var i=0;i<EXCLUDE_HOSTS.length;i++){var e=lc(EXCLUDE_HOSTS[i]);if(shExpMatch(host,"*"+e)||host===e)return true;}return false;}

/* ==== Main ==== */
function FindProxyForURL(url,host){
  host=lc(host);
  if(isExcluded(host)) return "DIRECT";
  // LOBBY
  if(urlMatch(url,URL_PATTERNS.LOBBY)||hostMatch(host,PUBG_DOMAINS.LOBBY)) return enforceCat("LOBBY",host);
  // MATCH
  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)) return enforceCat("MATCH",host);
  // RECRUIT_SEARCH
  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH)) return enforceCat("RECRUIT_SEARCH",host);
  // UPDATES
  if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES)) return enforceCat("UPDATES",host);
  // CDN
  if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN)) return enforceCat("CDN",host);
  return "DIRECT"; // باقي المواقع دايركت
}
