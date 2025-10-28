// JO-DUAL-PROXY-MODE.pac
// هدف: اختيار تلقائي لأفضل بروكسي أردني (sticky). كل PUBG يمر من الأردن.
// Version: DUAL-2.0

var DEBUG_MODE = false;

// مرشحي البروكسي الأردني (بأولوية)
var PROXY_CANDIDATES = [
  { host: "91.106.109.12", port: 443, label: "residential-JO" },
  { host: "185.141.39.25", port: 443, label: "mobile-JO" },
  { host: "213.215.220.130", port: 443, label: "fiber-JO" }
];

// TTL للالتصاق بنفس البروكسي (ms)
var PROXY_STICKY_TTL_MS = 60 * 1000;

// بورتات فئات ببجي
var FIXED_PORT = {
  LOBBY: 443,
  MATCH: 20001
};

// بادئات IPv6 أردنية مؤكدة
var JO_V6_CIDRS = [
  "2a00:18d8::/29",   // Orange JO
  "2a03:6b00::/29",   // Zain JO
  "2a03:b640::/32",   // Umniah / Orbitel
  "2a01:9700::/29"    // JDC / GO
];

// IPv4 ranges أردنية
var JO_V4_RANGES = [
  ["94.249.0.0","94.249.127.255"],
  ["109.107.0.0","109.107.255.255"],
  ["92.241.32.0","92.241.63.255"],
  ["212.118.0.0","212.118.255.255"],
  ["213.139.32.0","213.139.63.255"],
  ["185.141.0.0","185.141.255.255"],
  ["213.215.0.0","213.215.255.255"]
];

// استثناءات DIRECT
var DIRECT_ALLOW_DOMAINS = [
  "youtube.com","youtu.be",
  "whatsapp.com","whatsapp.net",
  "snapchat.com","snap."
];

var PUBG_DOMAINS = {
  LOBBY: [
    "*.pubgmobile.com",
    "*.pubgmobile.net",
    "*.igamecj.com",
    "*.proximabeta.com"
  ],
  MATCH: [
    "*.gcloud.qq.com",
    "gpubgm.com",
    "*.tgp.qq.com"
  ]
};

var URL_PATTERNS = {
  MATCH: [
    "*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"
  ],
  LOBBY: [
    "*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"
  ]
};

// كاش ستكي
var _root = (typeof globalThis !== "undefined") ? globalThis : this;
_root._PAC_HARDCACHE = _root._PAC_HARDCACHE || {};
var PAC_CACHE = _root._PAC_HARDCACHE;

// --------------- Helpers ---------------
function log(msg){
  if (DEBUG_MODE) { try { console.log("[PAC DUAL] " + msg); } catch(e){} }
}

function ip4ToInt(ip){
  var p = ip.split(".");
  if (p.length !== 4) return null;
  var n = 0;
  for (var i=0;i<4;i++){
    var v = parseInt(p[i],10);
    if (isNaN(v)||v<0||v>255) return null;
    n = (n<<8)+v;
  }
  return n>>>0;
}

function ipv4InRange(ip,start,end){
  var a=ip4ToInt(ip), b=ip4ToInt(start), c=ip4ToInt(end);
  if(a===null||b===null||c===null) return false;
  return (a>=b && a<=c);
}

// تقريب prefix match IPv6
function ipv6MatchesCidr(ipv6,cidr){
  try{
    var parts = cidr.split("/");
    var pref = parts[0].toLowerCase();
    var plen = parseInt(parts[1],10);
    var hextetCount = Math.floor(plen/16);
    var prefGroups = pref.split(":").slice(0,hextetCount).filter(Boolean);
    if (prefGroups.length===0) return true;
    var check = prefGroups.join(":");
    return ipv6.toLowerCase().indexOf(check)===0;
  }catch(e){return false;}
}

function isJordanianIP(ip){
  if(!ip) return false;
  if(ip.indexOf(".")!==-1){
    for (var i=0;i<JO_V4_RANGES.length;i++){
      if (ipv4InRange(ip, JO_V4_RANGES[i][0], JO_V4_RANGES[i][1])) return true;
    }
    return false;
  }
  var low = ip.toLowerCase();
  for (var j=0;j<JO_V6_CIDRS.length;j++){
    if (ipv6MatchesCidr(low, JO_V6_CIDRS[j])) return true;
  }
  return false;
}

function resolveHostIP(host){
  try {
    var r = dnsResolve(host);
    if (r && r.length>0) return r;
  } catch(e){}
  return null;
}

function hostMatches(host, list){
  for (var i=0;i<list.length;i++){
    if (shExpMatch(host, list[i])) return true;
  }
  return false;
}

function urlMatches(url, patterns){
  for (var i=0;i<patterns.length;i++){
    if (shExpMatch(url, patterns[i])) return true;
  }
  return false;
}

function isDirectAllowed(url, host){
  for (var i=0;i<DIRECT_ALLOW_DOMAINS.length;i++){
    if (shExpMatch(host, "*"+DIRECT_ALLOW_DOMAINS[i]+"*")) return true;
  }
  if (host.indexOf("shahid")!==-1 && url.toLowerCase().indexOf("/watch")!==-1) return true;
  return false;
}

// اختار بروكسي أردني وعلّق عليه
function getStickyProxy(){
  var now = Date.now();
  if (PAC_CACHE.selProxy && (now - (PAC_CACHE.selTime||0) < PROXY_STICKY_TTL_MS)) {
    return PAC_CACHE.selProxy;
  }
  // جرّب تعمل dnsResolve لكل كاندد
  for (var i=0;i<PROXY_CANDIDATES.length;i++){
    var c = PROXY_CANDIDATES[i];
    try {
      var r = dnsResolve(c.host);
      if (r && r.length>0){
        var sel = "PROXY "+c.host+":"+(c.port||443);
        PAC_CACHE.selProxy = sel;
        PAC_CACHE.selTime = now;
        log("Selected proxy "+sel);
        return sel;
      }
    } catch(e){}
  }
  // fallback على الأول
  var f = PROXY_CANDIDATES[0];
  var out = "PROXY "+f.host+":"+(f.port||443);
  PAC_CACHE.selProxy = out;
  PAC_CACHE.selTime = now;
  log("Fallback proxy "+out);
  return out;
}

// --------------- MAIN ---------------
function FindProxyForURL(url, host){
  // 1. استثناءات DIRECT
  if (isDirectAllowed(url, host)){
    log("DIRECT EXCEPTION "+host);
    return "DIRECT";
  }

  var sticky = getStickyProxy();

  var isMatch = urlMatches(url, URL_PATTERNS.MATCH) || hostMatches(host, PUBG_DOMAINS.MATCH);
  var isLobby = urlMatches(url, URL_PATTERNS.LOBBY) || hostMatches(host, PUBG_DOMAINS.LOBBY);

  if (isMatch || isLobby){
    // وجهة PUBG حساسة
    var dest = resolveHostIP(host);

    // إذا السيرفر أردني → نستخدم نفس البروكسي الأردني لكن نحافظ على البورت المناسب
    // إذا السيرفر مش أردني → برضو نستخدم البروكسي الأردني عشان يطلع أردني من برّا
    var outProxy = sticky;
    if (isMatch && FIXED_PORT.MATCH){
      outProxy = outProxy.replace(/:\d+$/, ":"+FIXED_PORT.MATCH);
    } else if (isLobby && FIXED_PORT.LOBBY){
      outProxy = outProxy.replace(/:\d+$/, ":"+FIXED_PORT.LOBBY);
    }

    if (dest){
      if (isJordanianIP(dest)){
        log("PUBG "+(isMatch?"MATCH":"LOBBY")+" dest=JO via "+outProxy);
      } else {
        log("PUBG "+(isMatch?"MATCH":"LOBBY")+" dest=NON-JO forcing JO proxy "+outProxy);
      }
    } else {
      log("PUBG "+(isMatch?"MATCH":"LOBBY")+" dest=UNKNOWN forcing JO proxy "+outProxy);
    }
    return outProxy;
  }

  // 2. باقي الإنترنت
  // - إذا جهازك أصلاً أردني IP → DIRECT
  // - إذا جهازك مش أردني → مرره عبر البروكسي الأردني لنفس التأثير
  var myIP = null;
  try { myIP = myIpAddress(); } catch(e){ myIP = null; }

  if (isJordanianIP(myIP)){
    log("NON-PUBG DIRECT (client is JO) "+host);
    return "DIRECT";
  } else {
    log("NON-PUBG via JO proxy (client NOT JO) "+host);
    return sticky;
  }
}
