// PUBG Jordan-Optimized PAC v6
// هدف: أقل بنق ممكن باللعبة بالاستفادة من بروكسيات أردنية + تحسين كفاءة السكربت
// ملاحظات سريعة:
// - لا توجد DIRECT أبداً (كل شيء عبر JO proxies)
// - لتقليل بنق الحقيقي للـ UDP يجب استخدام WireGuard/SOCKS5+UDP أو TProxy على الراوتر
// - عدّل JO_PROXIES إلى بروكسيات أردنية حقيقية (IP:PORT أو host:PORT)
// - خفّض DNS_CACHE_TTL إن عرفت أن الـIPs تتغير كثيراً (مثلاً 30s-120s)

var DNS_CACHE_TTL = 60; // ثواني — مدة التخزين المؤقّت للـDNS
var TIME_BUCKET_MINS = 5; // نافذة تبديل LB بالثواني تُحسب بالـ5 دقائق

// --- بروكسيات أردنية مرتبة per-ISP مع أوزان (proxy, weight) ---
// ضع عناوين بروكسياتك الحقيقية هنا. كل صف: [ "PROXY ip:port", weight ]
var JO_PROXIES = {
  ORANGE: [ ["PROXY 91.106.109.12:443", 3], ["PROXY 94.249.0.12:443", 1] ],
  ZAIN:   [ ["PROXY 89.187.57.10:443", 2], ["PROXY 89.187.57.12:443", 1] ],
  UMNIAH: [ ["PROXY 109.107.225.10:443",1], ["PROXY 109.107.225.11:443",1] ],
  GO:     [ ["PROXY 37.17.200.10:443",1] ]
};
// ترتيب تفضيل افتراضي لو لم يتعرّف ISP
var ISP_PRIORITY = ["ORANGE","ZAIN","UMNIAH","GO"];
var BLACKHOLE = "PROXY 127.0.0.1:9"; // لو حبيت تمنع دخول match غير أردني

// --- CIDR أردنية مختصرة (زيدها من عندك لقوائم مزوّدين كاملة) ---
var JO_RANGES = {
  ORANGE: ["91.106.0.0/16","94.249.0.0/16","196.52.0.0/16"],
  ZAIN:   ["89.187.0.0/16","37.17.192.0/20"],
  UMNIAH: ["109.107.224.0/19","46.185.128.0/18"],
  GO:     ["5.45.128.0/20","41.222.0.0/16"]
};

// --- تقسيم وظائف اللعبة (Domains + ports) مفصّلة وواضحة ---
// عدّل أو أضف أي دومين / بورت جديد تلاقيه في الشبكة
var FUNCTION_MAP = [
  { name:"MATCH",   domains:["match.igamecj.com","msl.match.igamecj.com","mgw.match.igamecj.com"], ports:[20001,20002,20003,20004,20005], requireJO:true },
  { name:"RECRUIT", domains:["recruit-search.igamecj.com","search.igamecj.com"], ports:[10010,10011,10012,10013], requireJO:true },
  { name:"LOBBY",   domains:["lobby.igamecj.com","lite-ios.igamecj.com","account.pubgmobile.com","auth.igamecj.com"], ports:[443,8443], requireJO:false },
  { name:"CDN",     domains:["cdn.pubg.com","cdn.igamecj.com","appdl.pubg.com"], ports:[80,443], requireJO:false },
  { name:"UPDATES", domains:["update.igamecj.com","updates.pubg.com","filegcp.igamecj.com"], ports:[80,443,8443], requireJO:false },
  { name:"FRIENDS", domains:["chat.igamecj.com","friend.igamecj.com","msg.igamecj.com"], ports:[443,8080,8443], requireJO:false },
  { name:"ANALYTICS", domains:["log.igamecj.com","tss.pubgmobile.com","anti-cheat.pubgmobile.com"], ports:[443,8443], requireJO:false }
];

// -------------------- Utilities (خفيفة وسريعة) --------------------
var dnsCache = {}; // host -> {ip, ts}
function nowSec(){ return Math.floor(Date.now()/1000); }
function cacheGet(h){ var e = dnsCache[h]; if(!e) return null; if(nowSec()-e.ts > DNS_CACHE_TTL){ delete dnsCache[h]; return null; } return e.ip; }
function cachePut(h, ip){ dnsCache[h] = { ip: ip, ts: nowSec() }; }
function safeResolve(host, tries){
  var c = cacheGet(host); if(c) return c;
  tries = tries || 2;
  for(var i=0;i<tries;i++){
    try{ var ip = dnsResolve(host); if(ip){ cachePut(host,ip); return ip; } } catch(e){}
  }
  return null;
}

// IPv4 fast int conversion + CIDR check (optimized)
function ipv4ToInt(ip){
  var p = ip.split('.');
  if(p.length !== 4) return null;
  return ((parseInt(p[0],10)&0xff)<<24) | ((parseInt(p[1],10)&0xff)<<16) | ((parseInt(p[2],10)&0xff)<<8) | (parseInt(p[3],10)&0xff);
}
function ipv4InCidr(ip, cidr){
  try {
    var parts = cidr.split('/'); var base = ipv4ToInt(parts[0]); var mask = parseInt(parts[1],10);
    var num = ipv4ToInt(ip);
    if(base === null || num === null) return false;
    if(mask === 32) return num === base;
    var netmask = mask === 0 ? 0 : (~((1 << (32-mask)) - 1)) >>> 0;
    return ((num & netmask) >>> 0) === ((base & netmask) >>> 0);
  } catch(e){ return false; }
}

// Minimal IPv6 handling only for prefix match (cheap)
function ipv6InPrefix(ip, prefix){
  // Many PAC engines struggle with full IPv6 expansion; keep minimal and catch exceptions.
  try{
    if(ip.indexOf(':') === -1) return false;
    // if the prefix is small (<=48) check leftmost hextets quickly
    var pr = prefix.split('/'); var base = pr[0]; var mask = parseInt(pr[1],10);
    var bparts = base.split(':'); var iparts = ip.split(':');
    // compare first N hextets
    var hextets = Math.floor(mask/16);
    for(var i=0;i<hextets;i++){
      if((iparts[i]||'0').toLowerCase() !== (bparts[i]||'0').toLowerCase()) return false;
    }
    return true;
  } catch(e){ return false; }
}

// determine ISP by IP (fast lookup)
function whichISP(ip){
  if(!ip) return null;
  if(ip.indexOf(':') === -1){
    for(var isp in JO_RANGES){
      var arr = JO_RANGES[isp];
      for(var i=0;i<arr.length;i++){
        if(ipv4InCidr(ip, arr[i])) return isp;
      }
    }
    return null;
  } else {
    // treat IPv6 as ORANGE if matches known ORANGE prefix (simplify)
    for(var j=0;j<JO_RANGES.ORANGE.length;j++){
      if(ipv6InPrefix(ip, JO_V6_PREFIXES && JO_V6_PREFIXES[0] ? JO_V6_PREFIXES[0] : "")) return "ORANGE";
    }
    return null;
  }
}

// domain matching utility (fast)
function hostMatchesAny(host, arr){
  for(var i=0;i<arr.length;i++){
    if(shExpMatch(host, "*"+arr[i]+"*")) return true;
  }
  return false;
}

// extract port (efficient)
function portFromURL(url){
  var m = url.match(/:(\d+)(\/|$)/);
  return m ? parseInt(m[1],10) : 80;
}

// deterministic time-bucket hash for LB
function timeBucket(){ return Math.floor(Date.now() / (TIME_BUCKET_MINS*60*1000)); }
function hash32(s){
  var h = 2166136261 >>> 0;
  for(var i=0;i<s.length;i++){
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
// pick weighted with deterministic seed per bucket
function pickWeighted(pool, key){
  var total = 0; for(var i=0;i<pool.length;i++) total += (pool[i][1]||1);
  var seed = (hash32(key + ":" + timeBucket())) >>> 0;
  var r = seed % total;
  for(var i=0;i<pool.length;i++){
    var w = pool[i][1]||1;
    if(r < w) return pool[i][0];
    r -= w;
  }
  return pool[0][0];
}
function pickProxyForISP(isp, key){
  if(isp && JO_PROXIES[isp] && JO_PROXIES[isp].length) return pickWeighted(JO_PROXIES[isp], key);
  // fallback by priority
  for(var i=0;i<ISP_PRIORITY.length;i++){
    var p = ISP_PRIORITY[i];
    if(JO_PROXIES[p] && JO_PROXIES[p].length) return pickWeighted(JO_PROXIES[p], key);
  }
  return BLACKHOLE;
}

// -------------------- Main PAC function --------------------
function FindProxyForURL(url, host){
  // fast-exit for local names
  if(isPlainHostName(host) || shExpMatch(host, "*.local") || host.indexOf("localhost") !== -1) return "DIRECT";

  var port = portFromURL(url);
  var key = host + ":" + port;
  var ip = safeResolve(host, 2); // cached

  // find function role (match/recruit/lobby/...)
  for(var f=0; f<FUNCTION_MAP.length; f++){
    var info = FUNCTION_MAP[f];
    if(hostMatchesAny(host, info.domains)){
      // if requireJO for MATCH/RECRUIT and ip resolved not JO => block
      if(info.requireJO){
        if(!ip) {
          // DNS failed: safest is to route via JO proxy (improves chance)
          return pickProxyForISP(null, key);
        }
        var isp = whichISP(ip);
        if(!isp) return BLACKHOLE; // block non-JO matches/searches
        return pickProxyForISP(isp, key);
      } else {
        // not strictly require JO (lobby/cdn/updates) — route via JO proxies to keep origin JO
        var isp2 = whichISP(ip);
        return pickProxyForISP(isp2, key);
      }
    }
  }

  // If host not recognized but IP is JO -> prefer its ISP proxy
  if(ip){
    var isp3 = whichISP(ip);
    if(isp3) return pickProxyForISP(isp3, key);
  }

  // default: send via top-priority JO proxy to present JO origin
  return pickProxyForISP(null, key);
}
