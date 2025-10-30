// ===========================================
// 🇯🇴 PUBG Mobile Jordan-only PAC — v5 (Dynamic LB)
// - Function-based routing
// - No DIRECT: كل شيء عبر بروكسي أردني
// - Jordan-only for MATCH/RECRUIT (non-JO => BLACKHOLE)
// - Sticky + time-bucketed load balancing (5m)
// ===========================================

// --- بروكسيات أردنية لكل مزود (مع أوزان داخلية) ---
var JO_PROXIES = {
  ORANGE:  [ ["PROXY 91.106.109.12:443", 3], ["PROXY 94.249.0.12:443", 1] ],
  ZAIN:    [ ["PROXY 89.187.57.10:443", 2], ["PROXY 89.187.57.12:443", 1] ],
  UMNIAH:  [ ["PROXY 109.107.225.10:443", 1], ["PROXY 109.107.225.11:443", 1] ],
  GO:      [ ["PROXY 37.17.200.10:443", 1], ["PROXY 37.17.200.12:443", 1] ]
};

// ترتيب التفضيل إذا ما قدرنا نحدد ISP من الـIP
var ISP_PRIORITY = ["ORANGE","ZAIN","UMNIAH","GO"];

// BLACKHOLE لقطع أي ماتش/سيرش خارج الأردن
var BLACKHOLE = "PROXY 127.0.0.1:9";

// --- نطاقات IPv4/IPv6 أردنية (مثال موسع؛ أضف المزيد عندك) ---
var JO_RANGES = {
  ZAIN: ["91.106.0.0/16","94.249.0.0/16","196.52.0.0/16","212.34.0.0/19"],
  ORANGE:   ["89.187.0.0/16","37.17.192.0/20","213.139.32.0/19"],
  UMNIAH: ["109.107.224.0/19","46.185.128.0/18"],
  GO:     ["5.45.128.0/20","41.222.0.0/16"]
};
var JO_V6_PREFIXES = ["2a00:18d8::/29","2a03:6b00::/29","2a03:b640::/32"];

// --- تقسيم اللعبة حسب الوظائف ---
var LOBBY =   { DOMAINS: ["lobby.igamecj.com","lite-ios.igamecj.com","mgl.lobby.igamecj.com","mtw.lobby.igamecj.com","mkn.lobby.igamecj.com","account.pubgmobile.com","auth.igamecj.com"], PORTS:[443,8443] };
var MATCH =   { DOMAINS: ["match.igamecj.com","mkr.lobby.igamecj.com","mvn.lobby.igamecj.com","msl.match.igamecj.com","mgw.match.igamecj.com"], PORTS:[20001,20002,20003,20004,20005] };
var RECRUIT = { DOMAINS: ["recruit-search.igamecj.com","search.igamecj.com","team.igamecj.com"], PORTS:[10010,10011,10012,10013] };
var UPDATES = { DOMAINS: ["update.igamecj.com","updates.pubg.com","filegcp.igamecj.com","patch.igamecj.com"], PORTS:[80,443,8443] };
var CDN =     { DOMAINS: ["cdn.pubg.com","cdn.igamecj.com","gcpcdntest.igamecj.com","appdl.pubg.com","cdn.tensafe.com"], PORTS:[80,443] };
var FRIENDS = { DOMAINS: ["friend.igamecj.com","chat.igamecj.com","msg.igamecj.com"], PORTS:[443,8080,8443] };
var ANALYTICS={ DOMAINS: ["log.igamecj.com","metric.igamecj.com","tss.pubgmobile.com","anti-cheat.pubgmobile.com","report.pubgmobile.com"], PORTS:[443,8443] };

// --- أدوات مساعدة ---
function ipv4ToInt(ip){var p=ip.split('.');return((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3])>>>0;}
function isIpv4InCidr(ip,cidr){var pr=cidr.split('/');var base=ipv4ToInt(pr[0]);var bits=parseInt(pr[1],10);
  var mask=bits===0?0:(~((1<<(32-bits))-1))>>>0;var num=ipv4ToInt(ip);
  return ((num&mask)>>>0)===((base&mask)>>>0);
}
function isV6InPrefix(ip,prefix){
  function norm(v){if(v.indexOf("::")===-1)return v.toLowerCase();
    var a=v.split("::"),L=a[0]?a[0].split(":"):[],R=a[1]?a[1].split(":"):[];
    var miss=8-(L.length+R.length);var fill=[];for(var i=0;i<miss;i++)fill.push("0");
    return L.concat(fill).concat(R).map(function(h){return h||"0";}).join(":").toLowerCase();
  }
  try{
    var pr=prefix.split('/');var base=norm(pr[0]).split(':'),mask=parseInt(pr[1],10),ipH=norm(ip).split(':');
    var left=mask;for(var i=0;i<8&&left>0;i++){var b=parseInt(base[i],16),a=parseInt(ipH[i],16);
      var take=Math.min(16,left),m=take===16?0xFFFF:(~((1<<(16-take))-1))&0xFFFF;
      if((b&m)!==(a&m))return false;left-=take;}
    return true;
  }catch(e){return false;}
}
function whichISP(ip){
  if(!ip) return null;
  if(ip.indexOf(":")===-1){
    for(var isp in JO_RANGES){var arr=JO_RANGES[isp];
      for(var i=0;i<arr.length;i++){ if(isIpv4InCidr(ip,arr[i])) return isp; }
    } return null;
  } else {
    for(var j=0;j<JO_V6_PREFIXES.length;j++){ if(isV6InPrefix(ip,JO_V6_PREFIXES[j])) return "ORANGE"; }
    return null;
  }
}
function isInDomains(host, list){for(var i=0;i<list.length;i++){if(shExpMatch(host,"*"+list[i]+"*"))return true;}return false;}
function inPorts(port, arr){for(var i=0;i<arr.length;i++){if(arr[i]===port)return true;}return false;}
function extractPort(url){var m=url.match(/:(\\d+)(\\/|$)/);return m?parseInt(m[1],10):80;}

// Weighted choice (deterministic داخل نافذة 5 دقائق)
function timeBucketKey(){ return Math.floor((new Date()).getTime() / (5*60*1000)); } // 5m
function hash32(s){var h=0;for(var i=0;i<s.length;i++){h=(h*31 + s.charCodeAt(i))>>>0;}return h>>>0;}
function pickWeighted(pool, key){
  // pool: [ [proxy, weight], ... ]
  // key: string => deterministic index per 5m bucket
  var seed = hash32(key + ":" + timeBucketKey());
  var total=0; for(var i=0;i<pool.length;i++) total += (pool[i][1]||1);
  var roll = seed % total;
  for(var j=0;j<pool.length;j++){
    var w = (pool[j][1]||1);
    if(roll < w) return pool[j][0];
    roll -= w;
  }
  return pool[0][0];
}
function pickProxyByISP(isp, key){
  // إذا ISP غير معروف نستخدم أولوية عامة
  if(isp && JO_PROXIES[isp] && JO_PROXIES[isp].length>0) return pickWeighted(JO_PROXIES[isp], key);
  for(var i=0;i<ISP_PRIORITY.length;i++){
    var pISP = ISP_PRIORITY[i];
    if(JO_PROXIES[pISP] && JO_PROXIES[pISP].length>0) return pickWeighted(JO_PROXIES[pISP], key);
  }
  return BLACKHOLE; // لو ما في بروكسيات
}

// --- الرئيسية ---
function FindProxyForURL(url, host){
  var ip = dnsResolve(host);           // PAC DNS
  var port = extractPort(url);
  var key = host + ":" + port;
  var isp = whichISP(ip);

  // MATCH — أردني فقط
  if(isInDomains(host, MATCH.DOMAINS) && inPorts(port, MATCH.PORTS)){
    if(isp) return pickProxyByISP(isp, key);
    return BLACKHOLE; // يمنع أي ماتش مش أردني
  }

  // RECRUIT/SEARCH — أردني فقط
  if(isInDomains(host, RECRUIT.DOMAINS) && inPorts(port, RECRUIT.PORTS)){
    if(isp) return pickProxyByISP(isp, key);
    return BLACKHOLE;
  }

  // LOBBY/LOGIN
  if(isInDomains(host, LOBBY.DOMAINS) && inPorts(port, LOBBY.PORTS)){
    // لو IP أردني اختَر ISP مطابق، وإلا اتّبع الأولوية العامة
    return pickProxyByISP(isp, key);
  }

  // UPDATES / CDN / FRIENDS / ANALYTICS — كلها عبر أردن مع LB
  if(isInDomains(host, UPDATES.DOMAINS) || isInDomains(host, CDN.DOMAINS) ||
     isInDomains(host, FRIENDS.DOMAINS) || isInDomains(host, ANALYTICS.DOMAINS)){
    return pickProxyByISP(isp, key);
  }

  // أي شيء آخر — خليه أردني برضه
  return pickProxyByISP(isp, key);
}
