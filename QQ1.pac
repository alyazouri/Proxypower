// 🇯🇴 PAC — Jordan Hard-Lock v6
// هدف: تعظيم حصة اللاعبين الأردنيين عبر منع أي خوادم PUBG غير أردنية
// لا DIRECT إطلاقًا. كل شيء عبر بروكسي أردني أو يُحظر (blackhole).

// — الإعداد —
var HARDLOCK_LEVEL = "ALL_PUBG"; // "ALL_PUBG" أو "MATCH_ONLY"

// بروكسيات أردنية (عدّل/زد)
var JO_PROXIES = [
  "PROXY 91.106.109.12:443",
  // "PROXY 94.249.0.12:443",
  // "PROXY 109.107.225.10:443"
];

// Blackhole سريع
var BLACKHOLE = "PROXY 127.0.0.1:9";

// DNS cache (تقليل تغيّر الوجهة)
var DNS_CACHE_TTL = 60; var _dc = {};
function _now(){return Math.floor(Date.now()/1000);}
function _g(h){var e=_dc[h]; if(!e) return null; if(_now()-e.t>DNS_CACHE_TTL){delete _dc[h]; return null;} return e.ip;}
function _p(h,ip){_dc[h]={ip:ip,t:_now()};}
function safeDNS(host, tries){var c=_g(host); if(c) return c; tries=tries||2; for(var i=0;i<tries;i++){try{var ip=dnsResolve(host); if(ip){_p(host,ip); return ip;}}catch(e){}} return null;}

// PUBG domains (وسّع حسب الحاجة)
var PUBG = [
  "igamecj.com","pubgmobile.com","tencent.com","tencentgames.net","ueapk.com",
  "updates.pubg.com","cdn.pubg.com","appdl.pubg.com","filegcp.igamecj.com"
];

// تقسيم وظيفي
var PORTS = {
  MATCH:[20001,20002,20003,20004,20005],
  RECRUIT:[10010,10011,10012,10013],
  LOBBY:[443,8443], CDN:[80,443], UPD:[80,443,8443]
};
var DOMS = {
  MATCH:["match.igamecj.com","mkr.lobby.igamecj.com","mvn.lobby.igamecj.com","msl.match.igamecj.com","mgw.match.igamecj.com"],
  RECRUIT:["recruit-search.igamecj.com","search.igamecj.com","team.igamecj.com"],
  LOBBY:["lobby.igamecj.com","lite-ios.igamecj.com","mgl.lobby.igamecj.com","mtw.lobby.igamecj.com","mkn.lobby.igamecj.com","account.pubgmobile.com","auth.igamecj.com"],
  CDN:["cdn.pubg.com","cdn.igamecj.com","gcpcdntest.igamecj.com","appdl.pubg.com","cdn.tensafe.com"],
  UPD:["update.igamecj.com","updates.pubg.com","filegcp.igamecj.com","patch.igamecj.com"]
};

// CIDR أردني (زد عليها اللي عندك)
var JO4 = [
  "91.106.0.0/16","94.249.0.0/16","196.52.0.0/16","212.34.0.0/19",
  "89.187.0.0/16","37.17.192.0/20","213.139.32.0/19",
  "109.107.224.0/19","46.185.128.0/18",
  "5.45.128.0/20","41.222.0.0/16"
];
var JO6 = ["2a00:18d8::/29","2a03:6b00::/29","2a03:b640::/32"];

// — أدوات —
function v4int(ip){var p=ip.split('.'); if(p.length!=4) return null; return ((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3])>>>0;}
function v4in(ip,cidr){var s=cidr.split('/'); var b=v4int(s[0]); var m=parseInt(s[1],10); var x=v4int(ip); if(b===null||x===null)return false; if(m===32) return x===b; var mask = m===0?0:(~((1<<(32-m))-1))>>>0; return ((x&mask)>>>0)===((b&mask)>>>0);}
function norm6(v){if(v.indexOf("::")===-1) return v.toLowerCase(); var a=v.split("::"),L=a[0]?a[0].split(":"):[],R=a[1]?a[1].split(":"):[]; var miss=8-(L.length+R.length),fill=[]; while(miss-->0) fill.push("0"); return L.concat(fill).concat(R).map(function(h){return h||"0";}).join(":").toLowerCase();}
function v6in(ip,pfx){try{var s=pfx.split('/'),B=norm6(s[0]).split(':'),M=parseInt(s[1],10),H=norm6(ip).split(':'); if(B.length!=8||H.length!=8) return false; var left=M; for(var i=0;i<8&&left>0;i++){var bb=parseInt(B[i],16),hh=parseInt(H[i],16),take=Math.min(16,left),mask=take===16?0xFFFF:(~((1<<(16-take))-1))&0xFFFF; if((bb&mask)!==(hh&mask)) return false; left-=take;} return true;}catch(e){return false;}}
function isJO(ip){
  if(!ip) return false;
  if(ip.indexOf(":")===-1){ for(var i=0;i<JO4.length;i++) if(v4in(ip,JO4[i])) return true; return false; }
  for(var j=0;j<JO6.length;j++) if(v6in(ip,JO6[j])) return true; return false;
}
function inList(host,arr){for(var i=0;i<arr.length;i++){if(host.indexOf(arr[i])!==-1) return true;} return false;}
function inPorts(port,arr){for(var i=0;i<arr.length;i++){if(arr[i]===port) return true;} return false;}
function portOf(url){var m=url.match(/:(\d+)(\/|$)/); return m?parseInt(m[1],10):80;}
function pickProxy(key){ // sticky + بسيط
  if(JO_PROXIES.length===0) return BLACKHOLE;
  var h=0; for(var i=0;i<key.length;i++) h=(h*31+key.charCodeAt(i))>>>0;
  var idx=h%JO_PROXIES.length; return JO_PROXIES[idx];
}

// — المنطق الرئيسي —
function FindProxyForURL(url, host){
  var port = portOf(url);
  var ip = safeDNS(host,2);
  var key = host+":"+port;

  // ما في DIRECT أبداً: إما بروكسي أردني أو حظر
  if(!ip){
    // لرفع احتمال الأردن حتى مع فشل DNS، نمرر عبر البروكسي
    return pickProxy(key);
  }

  var ipJO = isJO(ip);
  var isPUBG = inList(host, PUBG);

  // وظيفة: هل هو Match/Recruit؟
  var isMatch = inList(host, DOMS.MATCH) && inPorts(port, PORTS.MATCH);
  var isRecruit = inList(host, DOMS.RECRUIT) && inPorts(port, PORTS.RECRUIT);

  if (HARDLOCK_LEVEL === "ALL_PUBG") {
    // أي PUBG غير أردني ⇒ حظر
    if (isPUBG && !ipJO) return BLACKHOLE;
    // وإلا أرسله عبر بروكسي أردني
    return pickProxy(key);
  } else { // MATCH_ONLY
    if ((isMatch || isRecruit) && !ipJO) return BLACKHOLE;
    // باقي PUBG والإنترنت كله عبر بروكسي أردني
    return pickProxy(key);
  }
}
