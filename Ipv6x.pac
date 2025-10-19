// jo_pubg_v6_ranges_ports_slim.pac
// هدف: تقليل المنافذ المسموحة DIRECT على رنجات الأردن، مع إبقاء مباريات PUBG أساسية فقط.
// - PUBG domains => عبر البروكسي الأردني (IPv4/IPv6) مع sticky rotation 5000..5002.
// - أي هدف IPv6 داخل JO_V6_RANGES وعلى المنافذ المسموحة أدناه => DIRECT.
// - كل الباقي => عبر البروكسي الأردني.
// ملاحظة: PAC لا يوجّه UDP؛ التأثير أساسًا على HTTP/HTTPS.

var PROXY_IPV4 = "91.106.109.12";
var PROXY_IPV6 = "64:ff9b::5b6a:6d0c";
var BASE_PORT  = 5000;
var PORT_SPAN  = 3;     // 5000..5002 (تقليل)
var STICKY_MINUTES = 30;

// دومينات PUBG (ويب/خدمات)
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

// 👇 منافذ قليلة ومركّزة
var PORTS = {
  LOBBY:   [443],
  MATCH:   [20001, 20002, 20003],
  RECRUIT: [10010, 11000],
  UPDATES: [443],
  CDNs:    [443]
};

// دمج المنافذ لمجموعة واحدة مسموحة
var ALLOWED_PORTS = (function(){
  var s = {};
  for (var k in PORTS) for (var i=0;i<PORTS[k].length;i++) s[PORTS[k][i]] = true;
  return s;
})();

// رنجات الأردن (from → to)
var JO_V6_RANGES = [
  ["2a00:18d8:150::","2a00:18d8:150:88c::"]
];

// ===== Helpers =====
function padLeft(s,len){ return ("0000"+s).substr(-len); }
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
function ipv6HexInRange(expHex, fromHex, toHex){
  return !!(expHex && fromHex && toHex) && (expHex >= fromHex && expHex <= toHex);
}
function resolveToIPv6(host){
  if(host.indexOf(':')!==-1) return host;
  try{ var r=dnsResolve(host); if(r && r.indexOf(':')!==-1) return r; }catch(e){}
  return null;
}
function isDomainMatch(host, pattern){
  var h=host.toLowerCase(), p=pattern.toLowerCase();
  if(p.indexOf('*.')===0){ var base=p.substr(2); return (h===base||h.endsWith('.'+base)); }
  return h===p;
}
function isPUBGDomain(host){
  for(var i=0;i<PUBG_DOMAINS.length;i++) if(isDomainMatch(host,PUBG_DOMAINS[i])) return true;
  return false;
}
function djb2(str){
  var h=5381; for(var i=0;i<str.length;i++){ h=((h<<5)+h)+str.charCodeAt(i); h&=0xFFFFFFFF; }
  return Math.abs(h);
}
function chooseStickyPort(){
  var clientIP="unknown"; try{ clientIP=myIpAddress(); }catch(e){}
  var windowIdx=Math.floor((new Date()).getTime()/(STICKY_MINUTES*60*1000));
  var n=djb2(clientIP+"|"+windowIdx)%PORT_SPAN;
  return BASE_PORT+n; // 5000..5002
}
function proxyList(){
  var p=chooseStickyPort();
  return "PROXY " + PROXY_IPV4 + ":" + p + "; PROXY [" + PROXY_IPV6 + "]:" + p;
}
function hostIsInJoRangesByIPv6(host){
  var v6=resolveToIPv6(host);
  if(!v6||v6.indexOf(':')===-1) return false;
  var hex=expandIPv6ToHex(v6); if(!hex) return false;
  for(var i=0;i<JO_V6_RANGES.length;i++){
    var r=JO_V6_RANGES[i];
    var fromHex=r.from_address.replace(/:/g,'').toLowerCase();
    var toHex  =r.to_address.replace(/:/g,'').toLowerCase();
    if(ipv6HexInRange(hex,fromHex,toHex)) return true;
  }
  return false;
}

// ===== Main =====
function FindProxyForURL(url, host){
  if(isPlainHostName(host)||host==="localhost") return "DIRECT";
// دومينات ببجي عبر البروكسي الأردني
  if(isPUBGDomain(host)) return proxyList();

  // رنجات الأردن + منافذ قليلة ومركزة => DIRECT
  var port = (function(u){
    var m=u.match(/^[a-z0-9+.-]+:\\/\\/[^\\/]*:(\\d+)(?:\\/|$)/i);
    if(m&&m[1]) return parseInt(m[1],10);
    if(u.indexOf("https:")===0) return 443;
    if(u.indexOf("http:")===0)  return 80;
    return -1;
  })(url);

  try{
    if(hostIsInJoRangesByIPv6(host) && port!==-1 && ALLOWED_PORTS[port]) return "DIRECT";
  }catch(e){}

  // غير ذلك => بروكسي أردني
  return proxyList();
}
