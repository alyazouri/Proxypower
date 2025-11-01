/* ==== PAC: PUBG Jordan IPv6 Strict (Updated National Ranges) ==== */
/* كل اتصال PUBG يمر فقط عبر نطاقات IPv6 الأردنية المحددة */
var PROXY_CANDIDATES = [
  "2a00:18d8::",      // Orange
  "2a03:6b00::",      // Zain (شامل)
  "2a03:6b01:4000::", // Zain FIXED_USERS (سكني)
  "2a03:6b01:6400::", // Zain ثابت/سكني موسّع
  "2a03:b640::",      // Umniah/Batelco
  "2a01:9700::"       // JDC/GO
];
var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };

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

var DNS_TTL_MS=15000, PROXY_STICKY_TTL_MS=60000, GEO_TTL_MS=3600000;
var _root=(typeof globalThis!=="undefined")?globalThis:this;
if(!_root._PAC_HARDCACHE)_root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.proxyPick)C.proxyPick={host:null,t:0,lat:99999};
if(!C.geoClient)C.geoClient={ok:false,t:0};

/* أدوات أساسية */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIPv6(s){return /^[0-9a-fA-F:]+$/.test(s||"") && s.indexOf(":")>=0;}

/* اختيار بروكسي من النطاقات الأردنية */
function pickProxyHost(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host&&(now-C.proxyPick.t)<PROXY_STICKY_TTL_MS)return C.proxyPick.host;
  var best=null;
  if(PROXY_CANDIDATES.length>0)
    best=PROXY_CANDIDATES[Math.floor(Math.random()*PROXY_CANDIDATES.length)];
  if(!best)best="2a00:18d8::"; // fallback Orange
  C.proxyPick={host:best,t:now,lat:1};
  return best;
}
function proxyFor(cat){
  var h=pickProxyHost();
  var p=FIXED_PORT[cat]||443;
  return "PROXY ["+h+"]:"+p;
}

/* يتحقق أن جهازك أردني */
function clientIsJOv6(){
  var now=(new Date()).getTime(),g=C.geoClient;
  if(g&&(now-g.t)<GEO_TTL_MS)return g.ok;
  var ip="";
  try{
    if(typeof myIpAddressEx==="function"){var arr=myIpAddressEx(); if(arr&&arr.length>0) ip=arr[0];}
    else ip=myIpAddress();
  }catch(_){}
  var ok=false;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){
    if(ip.indexOf(PROXY_CANDIDATES[i])===0){ok=true;break;}
  }
  C.geoClient={ok:ok,t:now};
  return ok;
}

/* المنطق */
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=lc(arr[i]);if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++)if(shExpMatch(u,arr[i]))return true;return false;}

/* Main */
function FindProxyForURL(url,host){
  host=lc(host);
  if(!clientIsJOv6()) return "PROXY 0.0.0.0:0";

  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH))
    return proxyFor("MATCH");
  if(urlMatch(url,URL_PATTERNS.LOBBY)||hostMatch(host,PUBG_DOMAINS.LOBBY))
    return proxyFor("LOBBY");
  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH))
    return proxyFor("RECRUIT_SEARCH");
  if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES))
    return proxyFor("UPDATES");
  if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN))
    return proxyFor("CDN");

  return "DIRECT";
}
