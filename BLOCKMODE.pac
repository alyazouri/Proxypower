// JO-HARD-BLOCK-MODE.pac
// هدف: مستحيل تدخل لوبي/ماتش غير أردني. إذا مو أردني = بلوك.
// Version: BLOCK-2.0

var DEBUG_MODE = false;

// بروكسي أردني رئيسي (خروج أردني حقيقي)
var PROXY_MAIN = "PROXY 91.106.109.12:443";

// بلاك هول (بنستعمله لمنع الاتصال نهائياً)
var BLACKHOLE = "PROXY 127.0.0.1:9";

// بورتات حسب الفئة (لو احتجنا نعدل لاحقاً)
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

// نطاقات IPv4 أردنية مؤكدة
var JO_V4_RANGES = [
  ["94.249.0.0","94.249.127.255"],
  ["109.107.0.0","109.107.255.255"],
  ["92.241.32.0","92.241.63.255"],
  ["212.118.0.0","212.118.255.255"],
  ["213.139.32.0","213.139.63.255"],
  ["185.141.0.0","185.141.255.255"],
  ["213.215.0.0","213.215.255.255"]
];

// استثناءات DIRECT (يوتيوب/شاهد/واتساب/سناب)
var DIRECT_ALLOW_DOMAINS = [
  "youtube.com","youtu.be",
  "whatsapp.com","whatsapp.net",
  "snapchat.com","snap."
];

// دومينات ومسارات ببجي
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

// --------------- Helpers ---------------
function log(msg){
  if (DEBUG_MODE) { try { console.log("[PAC BLOCK] " + msg); } catch(e){} }
}

function ip4ToInt(ip){
  var p = ip.split(".");
  if (p.length !== 4) return null;
  var n = 0;
  for (var i=0; i<4; i++){
    var x = parseInt(p[i],10);
    if (isNaN(x)||x<0||x>255) return null;
    n = (n<<8)+x;
  }
  return n>>>0;
}

function ipv4InRange(ip,start,end){
  var a=ip4ToInt(ip), b=ip4ToInt(start), c=ip4ToInt(end);
  if(a===null||b===null||c===null) return false;
  return (a>=b && a<=c);
}

// تقريب prefix match للـ IPv6 بناءً على أول هكستات
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
    var pat = list[i];
    if (shExpMatch(host, pat)) return true;
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
  // domain allow
  for (var i=0;i<DIRECT_ALLOW_DOMAINS.length;i++){
    if (shExpMatch(host, "*"+DIRECT_ALLOW_DOMAINS[i]+"*")) return true;
  }
  // خاص لـ شاهد (watch path)
  if (host.indexOf("shahid")!==-1 && url.toLowerCase().indexOf("/watch")!==-1) return true;
  return false;
}

// --------------- MAIN ---------------
function FindProxyForURL(url, host){
  // استثناءات DIRECT
  if (isDirectAllowed(url, host)){
    log("DIRECT EXCEPTION for "+host);
    return "DIRECT";
  }

  var isMatch = urlMatches(url, URL_PATTERNS.MATCH) || hostMatches(host, PUBG_DOMAINS.MATCH);
  var isLobby = urlMatches(url, URL_PATTERNS.LOBBY) || hostMatches(host, PUBG_DOMAINS.LOBBY);

  if (isMatch || isLobby){
    var dst = resolveHostIP(host);
    if (!dst){
      log("PUBG " + (isMatch?"MATCH":"LOBBY") + " unresolved => BLOCK");
      return BLACKHOLE;
    }

    if (isJordanianIP(dst)){
      // سيرفر أردني -> نسمح لكن عبر بروكسي أردني حتى نثبت نفس الخروج
      var port = isMatch ? FIXED_PORT.MATCH : FIXED_PORT.LOBBY;
      var proxyStr = PROXY_MAIN.replace(/:\d+$/, ":"+port);
      log("PUBG " + (isMatch?"MATCH":"LOBBY") + " JO OK via "+proxyStr);
      return proxyStr;
    } else {
      // سيرفر مش أردني -> بلوك نهائي
      log("PUBG " + (isMatch?"MATCH":"LOBBY") + " NOT JO => BLOCK");
      return BLACKHOLE;
    }
  }

  // أي شي ثاني
  log("Non-PUBG normal DIRECT for "+host);
  return "DIRECT";
}
