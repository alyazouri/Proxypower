/* ==== PAC: PUBG Jordan IPv6 — Zain/Umniah only, CIDR-accurate, no DIRECT ==== */
/* prefixes المسموحة فقط */
var ALLOWED = [
  {name:"ZAIN",   cidr:"2a03:6b01::/34", base:"2a03:6b01::"},  // Zain
  {name:"UMNIAH", cidr:"2a03:b640::/32", base:"2a03:b640::"}   // Umniah/Batelco
];

/* بروكسي لكل مزوّد (نستخدم عناوين IPv6 داخل نفس البادئة) */
var PROXY_BY_NAME = {
  ZAIN:   "2a03:6b01::",
  UMNIAH: "2a03:b640::"
};

var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };
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

var DNS_TTL_MS=15000, STICKY_MS=60000, GEO_TTL_MS=3600000;
var _root=(typeof globalThis!=="undefined")?globalThis:this;
if(!_root._PAC_HARDCACHE)_root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns)C.dns={};
if(!C.pick)C.pick={name:null,t:0};
if(!C.geo)C.geo={ok:false,name:null,t:0};

/* ===== IPv6 CIDR helpers ===== */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIPv6(s){return typeof s==="string" && s.indexOf(":")>=0;}
function parseIPv6Words(addr){
  // يدعم :: الاختصار
  var parts=addr.split("::"),left=parts[0]?parts[0].split(":"):[];
  var right=(parts.length>1 && parts[1])?parts[1].split(":"):[];
  if(parts.length===1){ if(left.length!==8) return null; return left.map(function(h){return parseInt(h||"0",16)&0xffff;}); }
  var fill=8-(left.length+right.length); if(fill<0) return null;
  var arr=[]; for(var i=0;i<left.length;i++)arr.push(parseInt(left[i]||"0",16)&0xffff);
  for(var j=0;j<fill;j++)arr.push(0);
  for(var k=0;k<right.length;k++)arr.push(parseInt(right[k]||"0",16)&0xffff);
  return arr.length===8?arr:null;
}
function ipv6InPrefix(ip, cidr){
  var sp=cidr.split("/"); var base=sp[0], len=parseInt(sp[1],10);
  var w=parseIPv6Words(ip), pb=parseIPv6Words(base); if(!w||!pb) return false;
  var full=Math.floor(len/16), rem=len%16;
  for(var i=0;i<full;i++) if(w[i]!==pb[i]) return false;
  if(rem===0) return true;
  var mask=(0xffff<<(16-rem))&0xffff;
  return (w[full]&mask)===(pb[full]&mask);
}
function whichAllowed(ip){
  if(!isIPv6(ip)) return null;
  for(var i=0;i<ALLOWED.length;i++) if(ipv6InPrefix(ip, ALLOWED[i].cidr)) return ALLOWED[i].name;
  return null;
}

/* ===== Cache/DNS ===== */
function dnsCached(h){
  var now=(new Date()).getTime(),e=C.dns[h];
  if(e&&(now-e.t)<DNS_TTL_MS) return e.ip;
  var ip=""; try{ ip=dnsResolve(h)||""; }catch(_){}
  C.dns[h]={ip:ip,t:now}; return ip;
}

/* ===== Client geo/provider affinity ===== */
function clientProvider(){
  var now=(new Date()).getTime(),g=C.geo;
  if(g&&(now-g.t)<GEO_TTL_MS) return {ok:g.ok,name:g.name};
  var ip=""; try{
    if(typeof myIpAddressEx==="function"){var arr=myIpAddressEx(); if(arr&&arr.length) ip=arr[0];}
    else ip=myIpAddress();
  }catch(_){}
  var name=whichAllowed(ip);
  var ok=!!name;
  C.geo={ok:ok,name:name,t:now};
  return {ok:ok,name:name};
}

/* ===== Proxy pick (prefer same provider, else sticky round-robin) ===== */
function pickProxyName(){
  var now=(new Date()).getTime();
  if(C.pick.name && (now-C.pick.t)<STICKY_MS) return C.pick.name;
  var cp=clientProvider().name;
  var names=ALLOWED.map(function(a){return a.name;});
  var chosen = cp ? cp : names[Math.floor(Math.random()*names.length)];
  C.pick={name:chosen,t:now};
  return chosen;
}
function proxyFor(cat){
  var name=pickProxyName();
  var addr=PROXY_BY_NAME[name]||PROXY_BY_NAME.ZAIN; // fallback
  var port=FIXED_PORT[cat]||443;
  return "PROXY ["+addr+"]:"+port;
}

/* ===== Match helpers ===== */
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=lc(arr[i]);if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++)if(shExpMatch(u,arr[i]))return true;return false;}

/* ===== Enforce: only allowed prefixes; everything else BLOCK ===== */
function enforce(cat, host){
  var ip = isIPv6(host)?host:dnsCached(host);
  var prov = whichAllowed(ip);
  if(!prov) return "PROXY 0.0.0.0:0";       // حظر الوجهات خارج الأردن
  // لو الوجهة ضمن الأردن لكن مزوّدها مختلف، نحافظ على اختيار البروكسي (قد يظل cp أو sticky)
  return proxyFor(cat);
}

/* ===== Main ===== */
function FindProxyForURL(url, host){
  var cg = clientProvider();
  if(!cg.ok) return "PROXY 0.0.0.0:0";       // جهازك نفسه لازم يكون ضمن البادئتين

  host=lc(host);

  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)) return enforce("MATCH",host);
  if(urlMatch(url,URL_PATTERNS.LOBBY)||hostMatch(host,PUBG_DOMAINS.LOBBY)) return enforce("LOBBY",host);
  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH)) return enforce("RECRUIT_SEARCH",host);
  if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES)) return enforce("UPDATES",host);
  if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN)) return enforce("CDN",host);

  return "PROXY 0.0.0.0:0";                  // لا DIRECT نهائيًا
}
