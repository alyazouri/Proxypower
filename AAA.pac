var PROXY_IP="91.106.109.12";
var FORCE_PROXY_FOR_JO=false;
var PREFER_IPV4=true;
var BLOCK_NON_JO_GLOBAL=true;

var STRICT_JO={
  LOBBY:true,
  RECRUIT_SEARCH:true,
  MATCH:true,
  UPDATES:false,
  CDN:false
};

var FIXED_PORT={
  LOBBY:443,
  MATCH:20001,
  RECRUIT_SEARCH:443,
  UPDATES:80,
  CDN:80
};

var JO_V6_PREFIX={
  LOBBY:["2a01:9700::/29"],
  MATCH:["2a03:b640::/32"],
  RECRUIT_SEARCH:["2a03:6b00::/29"],
  UPDATES:["2a03:6b00::/29"],
  CDN:["2a03:6b00::/29"]
};

var JO_V4_RANGES=[
  ["46.32.96.0","46.32.96.255"],
  ["46.32.97.0","46.32.97.255"],
  ["46.32.98.0","46.32.98.255"],
  ["46.32.121.0","46.32.121.255"],
  ["46.32.122.0","46.32.122.255"],
  ["176.29.252.0","176.29.252.255"],
  ["176.29.253.0","176.29.253.255"],
  ["176.29.254.0","176.29.254.255"],
  ["176.29.255.0","176.29.255.255"],
  ["185.109.192.0","185.109.195.255"],
  ["188.247.64.0","188.247.64.255"],
  ["212.35.64.0","212.35.79.255"],
  ["212.35.80.0","212.35.95.255"],
  ["212.118.0.0","212.118.15.255"],
  ["212.118.16.0","212.118.31.255"],
  ["37.44.32.0","37.44.39.255"],
  ["37.152.0.0","37.152.7.255"],
  ["37.220.120.0","37.220.127.255"],
  ["109.107.224.0","109.107.255.255"],
  ["46.248.192.0","46.248.223.255"],
  ["95.172.192.0","95.172.223.255"],
  ["91.186.224.0","91.186.239.255"],
  ["85.159.216.0","85.159.223.255"],
  ["91.106.96.0","91.106.111.255"],
  ["185.80.24.0","185.80.27.255"],
  ["94.249.0.0","94.249.255.255"],
  ["37.202.64.0","37.202.127.255"],
  ["213.186.160.0","213.186.191.255"],
  ["194.165.128.0","194.165.159.255"],
  ["217.23.32.0","217.23.47.255"],
  ["95.177.0.0","95.177.255.255"],
  ["86.111.0.0","86.111.255.255"],
  ["81.22.0.0","81.22.255.255"],
  ["62.240.0.0","62.240.255.255"],
  ["5.62.0.0","5.62.255.255"]
];

var PUBG_DOMAINS={
  LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};

var URL_PATTERNS={
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

var DNS_TTL_MS=180*1000;
var DNS_JITTER_MS=25*1000;
var GEO_TTL_MS=60*60*1000;

var _root=(typeof globalThis!=="undefined"?globalThis:this);
if(!_root._PAC_HARDCACHE)_root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns)C.dns={};
if(!C.sticky)C.sticky={};
if(!C.geoClient)C.geoClient={ok:false,t:0};

function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var pat=arr[i];if(shExpMatch(h,pat))return true;if(pat.indexOf("*.")===0){var suf=pat.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++){if(shExpMatch(u,arr[i]))return true;}return false;}
function nowMs(){return(new Date()).getTime();}

function dnsResolveExPreferV4(host){var ip="",ip6="";if(typeof dnsResolveEx==="function"){var list=dnsResolveEx(host)||[];for(var i=0;i<list.length;i++){var a=list[i]||"";if(!a)continue;if(a.indexOf(":")!==-1){if(!ip6)ip6=a;}else{if(!ip)ip=a;}}}else{try{ip=dnsResolve(host)||"";}catch(e){}}return{ip:ip,ip6:ip6};}
function dnsSticky(host){var now=nowMs();var st=C.sticky[host];if(st&&now<st.exp)return st;var rr=C.dns[host];if(!(rr&&(now-rr.t)<(DNS_TTL_MS+Math.floor(Math.random()*DNS_JITTER_MS)))){rr=dnsResolveExPreferV4(host);rr.t=now;C.dns[host]=rr;}C.sticky[host]={ip:rr.ip||"",ip6:rr.ip6||"",exp:now+DNS_TTL_MS};return C.sticky[host];}

function ip4ToInt(ip){var p=ip.split(".");return((((parseInt(p[0])<<24)>>>0)+((parseInt(p[1])<<16)>>>0)+((parseInt(p[2])<<8)>>>0)+(parseInt(p[3])>>>0))>>>0);}
function isJOv4(ip){if(!ip||!/^\d+\.\d+\.\d+\.\d+$/.test(ip))return false;var n=ip4ToInt(ip);for(var i=0;i<JO_V4_RANGES.length;i++){var s=ip4ToInt(JO_V4_RANGES[i][0]);var e=ip4ToInt(JO_V4_RANGES[i][1]);if(n>=s&&n<=e)return true;}return false;}

function expand6(ip){if(ip.indexOf('::')===-1){var parts=ip.split(':');for(var k=0;k<parts.length;k++){if(parts[k].length===0)parts[k]="0";}while(parts.length<8)parts.push("0");return parts;}var p=ip.split('::'),l=p[0]?p[0].split(':'):[],r=(p.length>1&&p[1])?p[1].split(':'):[];while(l.length+r.length<8)r.unshift("0");return l.concat(r);}
function parse6(ip){var parts=expand6(ip.toLowerCase()),out=[];for(var i=0;i<8;i++){var v=parts[i].length?parseInt(parts[i],16):0;if(isNaN(v))v=0;out.push(v&0xffff);}return out;}
function matchV6CIDR(ip,cidr){var spl=cidr.split('/'),pre=spl[0],bits=parseInt(spl[1],10);if(isNaN(bits)||bits<0||bits>128)return false;var a=parse6(ip),b=parse6(pre),full=Math.floor(bits/16),rem=bits%16;for(var i=0;i<full;i++){if(a[i]!==b[i])return false;}if(rem===0)return true;var mask=0xffff<<(16-rem);return((a[full]&mask)===(b[full]&mask));}
function isJOv6ForCat(ip,cat){if(!ip||ip.indexOf(":")===-1)return false;var arr=JO_V6_PREFIX[cat]||[];for(var i=0;i<arr.length;i++){if(matchV6CIDR(ip,arr[i]))return true;}return false;}
function isJOv6Any(ip){if(!ip||ip.indexOf(":")===-1)return false;var cats=["LOBBY","MATCH","RECRUIT_SEARCH","UPDATES","CDN"];for(var i=0;i<cats.length;i++){var arr=JO_V6_PREFIX[cats[i]]||[];for(var j=0;j<arr.length;j++){if(matchV6CIDR(ip,arr[j]))return true;}}return false;}

function anyMyIPs(){var ips=[];try{if(typeof myIpAddressEx==="function"){var xs=myIpAddressEx();if(xs&&xs.length){for(var i=0;i<xs.length;i++)ips.push(xs[i]);}}}catch(e){}if(!ips.length){try{var v4=myIpAddress();if(v4)ips.push(v4);}catch(e){}}return ips;}
function clientIsJO(){var now=nowMs(),g=C.geoClient;if(g&&(now-g.t)<GEO_TTL_MS)return g.ok;var ips=anyMyIPs(),ok=false;for(var i=0;i<ips.length;i++){var ip=ips[i];if(isJOv4(ip)||isJOv6Any(ip)){ok=true;break;}}C.geoClient={ok:ok,t:now};return ok;}

function stripV6Brackets(h){if(h&&h.charAt(0)==="["&&h.charAt(h.length-1)==="]")return h.substring(1,h.length-1);return h;}
function hostIsJordanAny(host,cat){host=stripV6Brackets(host||"");if(/^\d+\.\d+\.\d+\.\d+$/.test(host))return isJOv4(host);if(host.indexOf(":")!==-1)return isJOv6Any(host);var rr=dnsSticky(host);if(PREFER_IPV4&&rr.ip&&isJOv4(rr.ip))return true;if(rr.ip6&&((cat&&isJOv6ForCat(rr.ip6,cat))||isJOv6Any(rr.ip6)))return true;if(rr.ip&&isJOv4(rr.ip))return true;return false;}

function getCategoryFor(url,host){host=lc(host||"");if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)||shExpMatch(url,"*/game/join*")||shExpMatch(url,"*/game/start*")||shExpMatch(url,"*/matchmaking/*")||shExpMatch(url,"*/mms/*"))return "MATCH";if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH)||shExpMatch(url,"*/teamfinder/*")||shExpMatch(url,"*/recruit/*"))return "RECRUIT_SEARCH";if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES))return "UPDATES";if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN))return "CDN";return "LOBBY";}
function proxyForCategory(cat){var port=FIXED_PORT[cat]||FIXED_PORT.LOBBY;return "PROXY "+PROXY_IP+":"+port;}

function FindProxyForURL(url,host){
  if(!clientIsJO())return "PROXY 0.0.0.0:0";
  var cat=getCategoryFor(url,host);
  var isJO=hostIsJordanAny(host,cat);
  var strict=!!STRICT_JO[cat];
  if(strict){
    if(isJO){if(FORCE_PROXY_FOR_JO){return proxyForCategory(cat);}return "DIRECT";}
    return "PROXY 0.0.0.0:0";
  }
  if(isJO){if(FORCE_PROXY_FOR_JO){return proxyForCategory(cat);}return "DIRECT";}
  if(BLOCK_NON_JO_GLOBAL)return "PROXY 0.0.0.0:0";
  return proxyForCategory(cat);
}
