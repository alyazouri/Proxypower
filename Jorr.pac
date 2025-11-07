function FindProxyForURL(url, host) {
  // ==============================
  // CONFIG
  // ==============================
  var JO_PROXY_HOST = "127.0.0.1"; // ← غيّرها إلى IP البروكسي الأردني
  var PORT_LOBBY          = 10010;
  var PORT_MATCH          = 20001;
  var PORT_RECRUIT_SEARCH = 12000;
  var PORT_UPDATES        = 8080;
  var PORT_CDN            = 443;

  var MODE = "SMART";      // SMART = داخل الأردن Direct، خارجه Proxy
  var STICKY_MINUTES = 10;

  // ==============================
  // IPv6 الأردن (Zain فقط) — محدثة
  // ==============================
  var JO_V6_PREFIXES = [
    // سابقًا:
    "2a03:b640:c000::/34",
    "2a03:b640:d000::/34",

    // جديد (حدود /35 بمحاذاة 0x2000):
    "2a03:b640:2000::/35",
    "2a03:b640:6000::/35",
    "2a03:b640:8000::/35",
    "2a03:b640:9000::/35",
    "2a03:b640:e000::/35",
    "2a03:b640:f000::/35"
  ];

  // ==============================
  // PUBG DOMAINS & URL PATTERNS
  // ==============================
  var PUBG_DOMAINS = {
    LOBBY:          ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH:          ["*.gcloud.qq.com","gpubgm.com","*.igamecj.com","*.proximabeta.com"],
    RECRUIT_SEARCH: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com","clan.igamecj.com"],
    UPDATES:        ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com"],
    CDNs:           ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };

  var URL_PATTERNS = {
    LOBBY:          ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH:          ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES:        ["*/patch*","*/update*","*/hotfix*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
    CDNs:           ["*/cdn/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  // YouTube استثناء
  var YOUTUBE_DOMAINS = ["youtube.com","youtu.be","googlevideo.com","ytimg.com","youtube-nocookie.com"];

  // ==============================
  // HELPERS
  // ==============================
  function proxyLine(port){ return "SOCKS5 " + JO_PROXY_HOST + ":" + port; }
  function matchDomain(host,list){ for(var i=0;i<list.length;i++){ var pat=list[i]; if(pat.indexOf("*")>=0){ if(shExpMatch(host,pat))return true; } else { if(dnsDomainIs(host,pat))return true; } } return false; }
  function matchURL(url,patterns){ for(var i=0;i<patterns.length;i++){ if(shExpMatch(url,patterns[i]))return true; } return false; }
  function inCategory(cat){ return matchDomain(host,PUBG_DOMAINS[cat]) || matchURL(url,URL_PATTERNS[cat]); }

  // IPv6 helpers
  function expandIPv6(addr){
    if(!addr)return"";
    if(addr.indexOf("::")>=0){
      var sides=addr.split("::");
      var left=sides[0]?sides[0].split(":"):[];
      var right=sides[1]?sides[1].split(":"):[];
      var missing=8-(left.length+right.length);
      var mid=[];for(var i=0;i<missing;i++)mid.push("0");
      var full=left.concat(mid,right);
      for(var j=0;j<full.length;j++)full[j]=("0000"+(full[j]||"0")).slice(-4);
      return full.join(":");
    }else{
      return addr.split(":").map(function(x){return("0000"+x).slice(-4);}).join(":");
    }
  }
  function ipv6Hex(ip){return expandIPv6(ip).replace(/:/g,"").toLowerCase();}
  function inCidrV6(ip,cidr){
    var parts=cidr.split("/");
    var pref=parts[0]; var bits=parts.length>1?parseInt(parts[1],10):128;
    var ipHex=ipv6Hex(ip); var prefHex=ipv6Hex(pref);
    var nibbles=Math.floor(bits/4);
    if(ipHex.substring(0,nibbles)!==prefHex.substring(0,nibbles))return false;
    if(bits%4===0)return true;
    var maskBits=bits%4; var mask=(0xF<<(4-maskBits))&0xF;
    var ipNib=parseInt(ipHex.charAt(nibbles),16)&mask;
    var pfNib=parseInt(prefHex.charAt(nibbles),16)&mask;
    return ipNib===pfNib;
  }
  function isJordanIPv6(ip){ if(!ip||ip.indexOf(":")<0)return false; for(var i=0;i<JO_V6_PREFIXES.length;i++){ if(inCidrV6(ip,JO_V6_PREFIXES[i]))return true; } return false; }

  // ==============================
  // ROUTING LOGIC
  // ==============================
  if(matchDomain(host,YOUTUBE_DOMAINS)) return "DIRECT";
  var destIP = dnsResolve(host);

  // SMART MODE: إذا السيرفر ضمن النطاقات الأردنية → Direct
  if(MODE === "SMART" && destIP && isJordanIPv6(destIP)){
    if (inCategory("LOBBY") || inCategory("MATCH") || inCategory("RECRUIT_SEARCH")) return "DIRECT";
    if (inCategory("UPDATES") || inCategory("CDNs")) return "DIRECT";
  }

  // غير أردني → عبر البروكسي
  if (inCategory("LOBBY"))          return proxyLine(PORT_LOBBY);
  if (inCategory("MATCH"))          return proxyLine(PORT_MATCH);
  if (inCategory("RECRUIT_SEARCH")) return proxyLine(PORT_RECRUIT_SEARCH);

  // التحديثات والـCDNs دائمًا Direct
  if (inCategory("UPDATES") || inCategory("CDNs")) return "DIRECT";

  // أي مقصد داخل الأردن → Direct
  if (destIP && isJordanIPv6(destIP)) return "DIRECT";

  // الباقي → عبر بروكسي اللوبي
  return proxyLine(PORT_LOBBY);
}
