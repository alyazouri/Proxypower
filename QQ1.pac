// PAC: Jordan-only matchmaking hard mode
// الفكرة: أي PUBG MATCH/SEARCH لو مش على IP أردني -> نحظره (blackhole)
// كل الترافيك (حتى غير PUBG) عبر بروكسيات أردنية؛ ما في DIRECT نهائياً.

// بروكسيات أردنية (أضف فالباكز)
var JO_PROXIES = [
  "PROXY 91.106.109.12:443"
];

// بلاك-هول سريع (منفذ discard)
var BLACKHOLE = "PROXY 127.0.0.1:9";

// كاش DNS بسيط
var DNS_CACHE_TTL = 60;
var dnsCache = {};

function nowS(){return Math.floor(new Date().getTime()/1000);}
function cachePut(h,ip){dnsCache[h]={ip:ip,ts:nowS()};}
function cacheGet(h){var e=dnsCache[h]; if(!e) return null; if(nowS()-e.ts>DNS_CACHE_TTL){delete dnsCache[h]; return null;} return e.ip;}
function safeDnsResolve(host, attempts){
  var c = cacheGet(host); if(c) return c;
  attempts = attempts||2;
  for (var i=0;i<attempts;i++){ try{ var ip=dnsResolve(host); if(ip){cachePut(host,ip); return ip;} }catch(e){} }
  return null;
}

// نطاقات أردنية (وسعّها لاحقاً)
var JO_IP_RANGES = [
  "196.52.0.0/16","91.106.0.0/16","89.187.0.0/16","41.222.0.0/16",
  "2.17.24.0/22","5.45.128.0/20","37.17.192.0/20","46.185.128.0/18",
  "94.249.0.0/16","109.107.224.0/19"
];
var JO_V6_PREFIXES = ["2a00:18d8::/29","2a03:6b00::/29","2a03:b640::/32"];

// بورتات حرجة للماتش/السيرش
var PORTS = {
  LOBBY:[443,8443],
  MATCH:[20001,20002,20003,20004,20005],
  RECRUIT_SEARCH:[10010,10011,10012,10013],
  UPDATES:[80,443,8443],
  CDN:[80,443]
};

// دومينات PUBG/Tencent
var KNOWN_PUBG_DOMAINS = [
  ".pubgmobile.com",".pubg.com",".tencent.com",".tencentgames.net",".ueapk.com","igamecj.com"
];
var DOMAINS = {
  LOBBY:["lobby.igamecj.com","lite-ios.igamecj.com","mgl.lobby.igamecj.com","mtw.lobby.igamecj.com","mkn.lobby.igamecj.com"],
  MATCH:["match.igamecj.com","mvn.lobby.igamecj.com","mkr.lobby.igamecj.com"],
  RECRUIT_SEARCH:["recruit-search.igamecj.com","search.igamecj.com"],
  UPDATES:["updates.pubg.com","update.igamecj.com","filegcp.igamecj.com"],
  CDN:["cdn.pubg.com","cdn.igamecj.com","gcpcdntest.igamecj.com","appdl.pubg.com"]
};

// أدوات IP/CIDR
function ipv4ToInt(ip){var a=ip.split('.'); if(a.length!==4) return null;
  return ((parseInt(a[0],10)&255)<<24)|((parseInt(a[1],10)&255)<<16)|((parseInt(a[2],10)&255)<<8)|(parseInt(a[3],10)&255);}
function isIpv4InCidr(ip,cidr){
  var p=cidr.split('/'),base=ipv4ToInt(p[0]),mask=parseInt(p[1],10),ipn=ipv4ToInt(ip);
  if(base===null||ipn===null) return false;
  if(mask===32) return ipn===base;
  var netmask = mask===0?0:(~((1<<(32-mask))-1))>>>0;
  return ((ipn&netmask)>>>0)===((base&netmask)>>>0);
}
function normV6(v){ if(v.indexOf("::")===-1) return v.toLowerCase();
  var parts=v.split("::"),L=parts[0]?parts[0].split(":"):[],R=parts[1]?parts[1].split(":"):[];
  var miss=8-(L.length+R.length),fill=[]; for(var i=0;i<miss;i++) fill.push("0");
  return L.concat(fill).concat(R).map(function(h){return h||"0";}).join(":").toLowerCase();
}
function isV6InPref(ip,prefix){
  try{
    var x=prefix.split('/'),base=normV6(x[0]).split(':'),mask=parseInt(x[1],10),ipH=normV6(ip).split(':');
    if(base.length!==8||ipH.length!==8) return false;
    var left=mask;
    for(var i=0;i<8&&left>0;i++){
      var b=parseInt(base[i],16), a=parseInt(ipH[i],16);
      var bits=Math.min(16,left), m=bits===16?0xFFFF:(~((1<<(16-bits))-1))&0xFFFF;
      if((b&m)!==(a&m)) return false; left-=bits;
    }
    return true;
  }catch(e){return false;}
}

function isJordanIP(ip){
  if(ip.indexOf(":")===-1){
    for(var i=0;i<JO_IP_RANGES.length;i++) if(isIpv4InCidr(ip,JO_IP_RANGES[i])) return true;
    return false;
  }else{
    for(var j=0;j<JO_V6_PREFIXES.length;j++) if(isV6InPref(ip,JO_V6_PREFIXES[j])) return true;
    return false;
  }
}

function hostContainsAny(host, arr){ for(var i=0;i<arr.length;i++) if(host.indexOf(arr[i])!==-1) return true; return false; }

// sticky اختيار بروكسي
var stickyMap={};
function pickProxy(key){
  if(JO_PROXIES.length===0) return BLACKHOLE;
  if(stickyMap.hasOwnProperty(key)) return JO_PROXIES[stickyMap[key]];
  var h=0; for(var i=0;i<key.length;i++) h=(h*31+key.charCodeAt(i))>>>0;
  var idx=h%JO_PROXIES.length; stickyMap[key]=idx; return JO_PROXIES[idx];
}

function portFromURL(url){ var m=url.match(/:(\d+)(\/|$)/); return m?parseInt(m[1],10):80; }
function roleOfPort(port){
  for (var k in PORTS){ if(PORTS.hasOwnProperty(k)){ var L=PORTS[k]; for(var i=0;i<L.length;i++) if(L[i]===port) return k; } }
  return null;
}

function FindProxyForURL(url, host){
  // لا DIRECT أبداً
  var port = portFromURL(url);
  var ip = safeDnsResolve(host,2);
  var key = host+":"+port;

  // لو فشل DNS، نوجّه عبر بروكسي أردني (عشان يطلع بجنسية أردنية)
  if(!ip) return pickProxy(key);

  var isJO = isJordanIP(ip);
  var isPUBG = hostContainsAny(host, KNOWN_PUBG_DOMAINS);
  var role = roleOfPort(port);

  // 1) لو الدومين PUBG والدور MATCH/RECRUIT_SEARCH
  if(isPUBG && (role==="MATCH" || role==="RECRUIT_SEARCH")){
    // الأردن فقط: لو الـIP ليس أردني -> حظر
    if(!isJO) return BLACKHOLE;
    // أردني -> عبر بروكسي أردني (لـ sticky)
    return pickProxy(key);
  }

  // 2) باقي دومينات PUBG (LOBBY/CDN/UPDATES): دائماً عبر بروكسي أردني
  if(isPUBG) return pickProxy(key);

  // 3) أي وجهة أخرى: أيضاً عبر بروكسي أردني (طلبك بدون DIRECT)
  return pickProxy(key);
}
