/* ==== PAC: PUBG Jordan — IPv6 & IPv4 Residential Only (Final, Latency-Aware) ====
   - يسمح فقط باتصالات PUBG إلى وجهات أردنية (IPv6 أو IPv4)
   - اختيار بروكسي أردني (v6/v4) مُفَضَّل بالأقل زمن DNS + Sticky 10m
   - غير PUBG => DIRECT (غيّرها إلى "PROXY 0.0.0.0:0" لو بدك حظر كامل)
*/

/* بروكسيات أردنية (عدّلها لِعوَانينك الفعلية داخل الأردن) */
var PROXY_V6 = [
  "2a03:6b01::1",   // مثال: Zain IPv6
  "2a03:b640::1"    // مثال: Umniah IPv6
];
var PROXY_V4 = [
  "91.106.109.12"   // مثال: IPv4 أردني سكني
];

/* بورتات PUBG */
var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };

/* نطاقات IPv6 الأردنية (سكني/محلي: Zain & Umniah) */
var V6PFX = [
  ["2a03:6b01::",34], // Zain
  ["2a03:b640::",32]  // Umniah/Batelco
];

/* نطاقات IPv4 الأردنية السكنية الرئيسية */
var JO_V4_RANGES = [
  /* Orange */
  ["94.249.0.0","94.249.255.255"], ["80.90.160.0","80.90.175.255"],
  ["92.253.0.0","92.253.127.255"], ["62.72.160.0","62.72.191.255"],
  ["84.18.32.0","84.18.95.255"],   ["87.236.232.0","87.236.239.255"],
  /* Zain */
  ["91.106.96.0","91.106.111.255"], ["109.107.224.0","109.107.255.255"],
  ["37.44.32.0","37.44.39.255"],    ["37.75.144.0","37.75.151.255"],
  ["37.202.64.0","37.202.127.255"], ["94.142.32.0","94.142.63.255"],
  ["185.109.192.0","185.109.195.255"],
  /* Umniah/Batelco */
  ["188.247.64.0","188.247.95.255"], ["185.109.120.0","185.109.123.255"],
  ["185.139.220.0","185.139.223.255"], ["185.175.248.0","185.175.251.255"],
  /* JDC/GO / VTEL (محلي مستخدم سكنياً) */
  ["212.118.0.0","212.118.31.255"], ["84.18.64.0","84.18.95.255"],
  ["212.35.64.0","212.35.95.255"],
  /* أخرى سكنية شائعة */
  ["37.17.192.0","37.17.207.255"], ["37.123.64.0","37.123.95.255"]
];

/* PUBG signatures */
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

/* كاش و Sticky */
var DNS_TTL_MS=15000, STICKY_MS=600000 /*10m*/;
var _root=(typeof globalThis!=="undefined")?globalThis:this;
if(!_root._PAC_HARDCACHE)_root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns)C.dns={};
if(!C.pick4)C.pick4={h:null,t:0};
if(!C.pick6)C.pick6={h:null,t:0};

/* ===== Helpers عامة ===== */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function isIPv4(s){return /^\d{1,3}(\.\d{1,3}){3}$/.test(s||"");}
function isIPv6(s){return typeof s==="string" && s.indexOf(":")>=0;}
function bracketIfV6(h){return isIPv6(h)?"["+h+"]":h;}

/* IPv4 in ranges */
function ip4ToInt(ip){var p=ip.split(".");return((+p[0]<<24)>>>0)+((+p[1]<<16)>>>0)+((+p[2]<<8)>>>0)+(+p[3]>>>0);}
function isJOv4(ip){
  if(!isIPv4(ip))return false;
  var n=ip4ToInt(ip);
  for(var i=0;i<JO_V4_RANGES.length;i++){
    var s=ip4ToInt(JO_V4_RANGES[i][0]), e=ip4ToInt(JO_V4_RANGES[i][1]);
    if(n>=s && n<=e) return true;
  }
  return false;
}

/* IPv6 CIDR helpers */
function parseIPv6Words(addr){
  if(!addr)return null;
  if(addr.indexOf('.')!==-1){
    var i=addr.lastIndexOf(":"), head=addr.substring(0,i), v4=addr.substring(i+1), p=v4.split(".");
    if(p.length===4){var w6=((+p[0]<<8)|+p[1])&0xffff, w7=((+p[2]<<8)|+p[3])&0xffff; addr=head+":"+w6.toString(16)+":"+w7.toString(16);}
  }
  var parts=addr.split("::"), left=parts[0]?parts[0].split(":"):[], right=(parts.length>1&&parts[1])?parts[1].split(":"):[];
  if(parts.length===1){ if(left.length!==8) return null; return left.map(function(h){return parseInt(h||"0",16)&0xffff;}); }
  var fill=8-(left.length+right.length); if(fill<0) return null;
  var arr=[]; for(var i1=0;i1<left.length;i1++)arr.push(parseInt(left[i1]||"0",16)&0xffff);
  for(var j=0;j<fill;j++)arr.push(0);
  for(var k=0;k<right.length;k++)arr.push(parseInt(right[k]||"0",16)&0xffff);
  return arr.length===8?arr:null;
}
function ipv6InPrefix(ip, base, len){
  var w=parseIPv6Words(ip), pb=parseIPv6Words(base); if(!w||!pb) return false;
  var full=Math.floor(len/16), rem=len%16;
  for(var i=0;i<full;i++) if(w[i]!==pb[i]) return false;
  if(rem===0) return true;
  var mask=(0xffff<<(16-rem))&0xffff;
  return (w[full]&mask)===(pb[full]&mask);
}
function isJOv6(ip){
  if(!isIPv6(ip))return false;
  for(var i=0;i<V6PFX.length;i++) if(ipv6InPrefix(ip,V6PFX[i][0],V6PFX[i][1])) return true;
  return false;
}

/* DNS cache */
function dnsCached(host){
  var now=Date.now(), e=C.dns[host];
  if(e && (now-e.t)<DNS_TTL_MS) return e.ip;
  var ip=""; try{ ip=dnsResolve(host)||""; }catch(_){}
  C.dns[host]={ip:ip,t:now}; return ip;
}

/* ===== اختيار بروكسي (تقريب hop أردني: فلترة أردنية + أقل زمن DNS) ===== */
function dnsLatencyScore(hostOrIp){
  try{
    var t0=Date.now();
    if(isIPv4(hostOrIp)||isIPv6(hostOrIp)){ /* no-op */ } else { dnsResolve(hostOrIp); }
    var dt=Date.now()-t0;
    return dt>0?dt:1;
  }catch(_){ return 99999; }
}
function filterSortJO(list){
  var out=[];
  for(var i=0;i<list.length;i++){
    var h=list[i], ip=h;
    if(!isIPv4(h) && !isIPv6(h)){
      try{ ip=dnsResolve(h)||""; }catch(_){ ip=""; }
    }
    var ok = isIPv6(ip)?isJOv6(ip):isIPv4(ip)?isJOv4(ip):false;
    if(ok) out.push({h:h,score:dnsLatencyScore(h)});
  }
  out.sort(function(a,b){return a.score-b.score;});
  return out.map(function(x){return x.h;});
}
function pickV4(){
  var now=Date.now();
  if(C.pick4.h && (now-C.pick4.t)<STICKY_MS) return C.pick4.h;
  var cand=filterSortJO(PROXY_V4);
  var h=cand.length?cand[0]:(PROXY_V4[0]||"91.106.109.12");
  C.pick4={h:h,t:now}; return h;
}
function pickV6(){
  var now=Date.now();
  if(C.pick6.h && (now-C.pick6.t)<STICKY_MS) return C.pick6.h;
  var cand=filterSortJO(PROXY_V6);
  var h=cand.length?cand[0]:(PROXY_V6[0]||"2a03:6b01::1");
  C.pick6={h:h,t:now}; return h;
}
function proxyV4(cat){var p=FIXED_PORT[cat]||443; return "PROXY "+pickV4()+":"+p;}
function proxyV6(cat){var p=FIXED_PORT[cat]||443; return "PROXY "+bracketIfV6(pickV6())+":"+p;}

/* Helpers */
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=lc(arr[i]);if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++) if(shExpMatch(u,arr[i])) return true;return false;}

/* تصنيف الوجهة: لازم تكون أردنية (v6 أو v4) ونختار البروكسي المطابق */
function resolveAndDetect(host){
  if(isIPv4(host)) return {ver:4, ip:host, v4jo:isJOv4(host), v6jo:false};
  if(isIPv6(host)) return {ver:6, ip:host, v4jo:false, v6jo:isJOv6(host)};
  var ip=dnsCached(host);
  if(isIPv4(ip)) return {ver:4, ip:ip, v4jo:isJOv4(ip), v6jo:false};
  if(isIPv6(ip)) return {ver:6, ip:ip, v4jo:false, v6jo:isJOv6(ip)};
  return {ver:0, ip:"", v4jo:false, v6jo:false};
}
function enforceJordan(cat, host){
  var r=resolveAndDetect(host);
  if(r.v6jo) return proxyV6(cat);
  if(r.v4jo) return proxyV4(cat);
  return "PROXY 0.0.0.0:0"; // حظر أي وجهة غير أردنية
}

/* Main */
function FindProxyForURL(url,host){
  host=lc(host);

  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH))
    return enforceJordan("MATCH",host);

  if(urlMatch(url,URL_PATTERNS.LOBBY)||hostMatch(host,PUBG_DOMAINS.LOBBY))
    return enforceJordan("LOBBY",host);

  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH))
    return enforceJordan("RECRUIT_SEARCH",host);

  if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES))
    return enforceJordan("UPDATES",host);

  if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN))
    return enforceJordan("CDN",host);

  // غير PUBG: DIRECT (بدّلها إلى "PROXY 0.0.0.0:0" لو بدك حظر كامل)
  return "DIRECT";
}
