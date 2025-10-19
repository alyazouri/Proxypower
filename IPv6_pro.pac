// jo_pubg_v6_domains_sticky.pac
// DIRECT للاتصالات IPv6 الأردنية (ومجال PUBG كما ضبطت سابقاً)، والباقي عبر بروكسيك.
// يختار منفذ بروكسي "لاصق" لكل جهاز لمدة 30 دقيقة من المجموعة 5000..5005.

var JO_V6_PREFIXES = [
  { "prefix":"2a00:18d8::", "mask":29 },
  { "prefix":"2a03:6b00::", "mask":40 },
  { "prefix":"2a03:6b01::", "mask":34 },
  { "prefix":"2a03:b640::", "mask":32 },
  { "prefix":"2a01:1d0::", "mask":32 },
  { "prefix":"2a00:18d8:150::", "mask":48 }
];

// دومينات PUBG (كما طلبت)
var PUBG_DOMAINS = [
  "*.proximabeta.com",
  "*.igamecj.com",
  "*.tencentgames.com",
  "*.tencent.com",
  "*.pubgmobile.com",
  "*.pubgmobile.net",
  "*.gcloud.qq.com",
  "*.cdn.pubgmobile.com",
  "*.dl.pubgmobile.com",
  "*.app.pubgmobile.com",
  "*.unity3d.com",
  "*.akamaized.net"
];

// منافذ PUBG
var PORTS = {
  LOBBY: [443, 8080, 8443],
  MATCH: [20001, 20002, 20003],
  RECRUIT_SEARCH: [10010,10012,10013,10039,10096,10491,10612,11000,11455,12235],
  UPDATES: [80,443,8443,8080],
  CDNs: [80,8080,443]
};

// --- تكوين اختيار منفذ بروكسي "لاصق" ---
var BASE_PORT = 5000;
var PORT_SPAN = 6; // 5000..5005
var STICKY_MINUTES = 30;

// djb2 hash بسيط
function djb2(str){
  var h = 5381;
  for (var i=0;i<str.length;i++){ h = ((h << 5) + h) + str.charCodeAt(i); h = h & 0xffffffff; }
  return (h < 0) ? -h : h;
}

// اختيار منفذ بناءً على (IP الجهاز + نافذة زمنية 30 دقيقة)
function chooseStickyPort(){
  var clientIP = "unknown";
  try { clientIP = myIpAddress(); } catch(e){}
  var now = new Date().getTime();
  var windowIdx = Math.floor(now / (STICKY_MINUTES * 60 * 1000)); // نافذة 30 دقيقة
  var seed = clientIP + "|" + windowIdx;
  var n = djb2(seed) % PORT_SPAN;
  return BASE_PORT + n; // 5000..5005
}

function proxyList(){
  var p = chooseStickyPort();
  return "PROXY 91.106.109.12:" + p + "; PROXY [64:ff9b::5b6a:6d0c]:" + p;
}

// --- دمج المنافذ المسموحة ---
var ALLOWED_PORTS = (function(){
  var s={};
  for (var k in PORTS) for (var i=0;i<PORTS[k].length;i++) s[PORTS[k][i]] = true;
  return s;
})();

// --- أدوات IPv6 ---
function padLeft(s,len){return("0000"+s).substr(-len);}
function expandIPv6ToHex(ip){
  if(!ip||ip.indexOf(':')===-1) return null;
  var parts=ip.split('::'),L=[],R=[];
  if(parts.length===1){ L=ip.split(':'); }
  else { L=(parts[0]==='')?[]:parts[0].split(':'); R=(parts[1]==='')?[]:parts[1].split(':'); }
  for(var i=0;i<L.length;i++) L[i]=padLeft(L[i],4);
  for(var j=0;j<R.length;j++) R[j]=padLeft(R[j],4);
  var miss=8-(L.length+R.length),mid=[]; for(var k=0;k<miss;k++) mid.push("0000");
  var full=L.concat(mid).concat(R); if(full.length!==8) return null;
  return full.join('').toLowerCase();
}
function ipv6InPrefix(ip,prefix,mask){
  var ih=expandIPv6ToHex(ip),ph=expandIPv6ToHex(prefix);
  if(!ih||!ph) return false; if(mask===0) return true;
  var n=Math.floor(mask/4),r=mask%4;
  if(n>0 && ih.substr(0,n)!==ph.substr(0,n)) return false;
  if(r>0){
    var i=parseInt(ih.charAt(n),16),p=parseInt(ph.charAt(n),16);
    var shift=4-r,maskNib=(0xF>>shift)<<shift;
    return ((i & maskNib) === (p & maskNib));
  }
  return true;
}
function resolveToIP(host){
  if(host.indexOf(':')!==-1) return host; // literal IPv6
  try{ var r=dnsResolve(host); if(r && r.indexOf(':')!==-1) return r; }catch(e){}
  return null;
}
function isJOIPv6(ipOrHost){
  var ip=resolveToIP(ipOrHost);
  if(!ip||ip.indexOf(':')===-1) return false;
  for (var i=0;i<JO_V6_PREFIXES.length;i++){
    var p=JO_V6_PREFIXES[i];
    if (ipv6InPrefix(ip, p.prefix, p.mask)) return true;
  }
  return false;
}
function extractPortFromURL(url){
  var m=url.match(/^[a-z0-9+.-]+:\\/\\/[^\\/]*:(\\d+)(?:\\/|$)/i);
  if(m && m[1]) return parseInt(m[1],10);
  if(url.indexOf("https:")===0) return 443;
  if(url.indexOf("http:")===0)  return 80;
  return -1;
}
function isPUBGDomain(host){
  var h = host.toLowerCase();
  for (var i=0;i<PUBG_DOMAINS.length;i++){
    var p = PUBG_DOMAINS[i].replace(/^\*\./,'');
    if (h===p || h.endsWith("."+p)) return true;
  }
  return false;
}

// --- المنطق الرئيسي ---
function FindProxyForURL(url, host){
  if (isPlainHostName(host) || host==="localhost") return "DIRECT";

  var port = extractPortFromURL(url);

  // لو دومين ببجي → DIRECT
  if (isPUBGDomain(host)) return "DIRECT";

  // IPv6 أردني + منفذ ضمن منافذ PUBG → DIRECT
  try {
    if (isJOIPv6(host) && port !== -1 && ALLOWED_PORTS[port]) return "DIRECT";
  } catch(e){}

  // الباقي عبر بروكسي مع منفذ "لاصق" لكل جهاز لمدة 30 دقيقة
  return proxyList();
}
