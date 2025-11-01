/**** PAC: PUBG — Jordan-Only Teams & Opponents (v9, Strict JO for PUBG) ****/
/* الهدف: اللوبي/المباراة/التجنيد يعملوا فقط إذا كانت الوجهة ضمن IPv4 أردنية (Zain + Umniah).
   الاستثناءات الإعلامية تبقى DIRECT. */

var PROXY_HOST = "91.106.109.12";   // بروكسيك الأردني
var STRICT_PUBG_JO = true;          // ← هذا يفرض أن الوجهة ل PUBG لازم تكون ضمن JO_IP_RANGES
var ACTION_NON_JO_FOR_PUBG = "BLOCK"; // "BLOCK" => PROXY 0.0.0.0:0 ، "DIRECT" للسماح بدون بروكسي (أقل توصية)

var ENFORCE_DST_JO_ON_NON_PUBG = true;       // تشديد على غير PUBG؟
var ACTION_NON_JO_FOR_NON_PUBG = "BLOCK";    // "BLOCK" أو "DIRECT"

/* === استثناءات DIRECT (إعلام/صور/تحليلات) === */
var MEDIA_DOMAINS = [
  // YouTube / Google Video / Images
  "*.youtube.com","*.googlevideo.com","*.ytimg.com","youtube.com","youtubei.googleapis.com",
  "*.googleusercontent.com","lh3.googleusercontent.com","googlehosted.l.googleusercontent.com",
  // WhatsApp
  "*.whatsapp.net","*.whatsapp.com","whatsapp.com","whatsapp.net",
  // Snapchat
  "*.snapchat.com","*.sc-cdn.net","*.snapcdn.io","*.snap-dev.net",
  // Facebook images
  "platform-lookaside.fbsbx.com","*.scontent.fallback.xx.fbcdn.net","scontent.fallback.xx.fbcdn.net",
  // Analytics/telemetry
  "browser-intake-datadoghq.com","*.browser-intake-datadoghq.com",
  // DNS/system noise
  "_dns.resolver.arpa",
  // اختياري: أضف ما تريد هنا لاحقًا
];

/* === منافذ + أوزان === */
var PORTS={LOBBY:[443,8443],MATCH:[20001,20003],RECRUIT_SEARCH:[10012,10013],UPDATES:[80,443,8443],CDNS:[80,443]};
var PORT_WEIGHTS={LOBBY:[5,3],MATCH:[3,2],RECRUIT_SEARCH:[3,2],UPDATES:[5,3,2],CDNS:[3,2]};

/* === نطاقات IPv4 الأردنية — Zain (AS48832) + Umniah/Batelco (AS9038) فقط === */
var JO_IP_RANGES = [
  /* Zain */
  ["46.32.96.0","46.32.127.255"],["77.245.0.0","77.245.15.255"],
  ["80.90.160.0","80.90.175.255"],["87.238.128.0","87.238.135.255"],
  ["94.142.32.0","94.142.63.255"],["176.28.128.0","176.28.255.255"],
  ["176.29.0.0","176.29.31.255"],["176.29.128.0","176.29.255.255"],
  ["185.109.192.0","185.109.195.255"],["188.247.64.0","188.247.95.255"],
  ["46.32.101.0","46.32.101.255"],["46.32.100.0","46.32.100.255"],
  /* Umniah / Batelco */
  ["37.152.0.0","37.152.7.255"],["37.220.112.0","37.220.127.255"],
  ["37.220.120.0","37.220.127.255"],["46.23.112.0","46.23.127.255"],
  ["46.248.192.0","46.248.223.255"],["85.159.216.0","85.159.223.255"],
  ["91.106.96.0","91.106.111.255"],["91.186.224.0","91.186.239.255"],
  ["5.45.128.0","5.45.143.255"],["212.35.64.0","212.35.79.255"],
  ["212.118.0.0","212.118.15.255"]
];

/* === PUBG domains & URL patterns === */
var PUBG_DOMAINS = {
  LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com","intlsdk.igamecj.com","pay.igamecj.com.eo.dnse1.com"],
  MATCH:["*.gcloud.qq.com","gpubgm.com","*.vasdgame.com"],
  RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDNS:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net","*.akamai.net"]
};
var URL_PATTERNS = {
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDNS:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

/* === Helpers === */
function sh(s,p){ return shExpMatch(s,p); }
function dnsDomainIs_(h,suf){ return (h && h.length>=suf.length && h.substring(h.length - suf.length)==suf); }
function isPlainHostName_(h){ return (h && h.indexOf('.')==-1); }
function isIPv6LocalLiteral(h){ if(!h||h.charAt(0)!=="[") return false; var x=h.substring(1,h.length-1).toLowerCase(); return (x==="::1"||x.indexOf("fe80:")===0||x.indexOf("fc")===0||x.indexOf("fd")===0); }
function isInNet_(host, pattern, mask){ var ip=null; try{ ip=dnsResolve(host);}catch(e){ ip=null; } if(!ip) return false; return isInNet(ip, pattern, mask); }
function ipToInt(ip){ var p=ip.split("."); return (parseInt(p[0])<<24)+(parseInt(p[1])<<16)+(parseInt(p[2])<<8)+parseInt(p[3]); }
function ipInRangeList(ip,list){ if(!ip) return false; var n=ipToInt(ip); for(var i=0;i<list.length;i++){ var s=ipToInt(list[i][0]),e=ipToInt(list[i][1]); if(n>=s&&n<=e) return true; } return false; }
function ipInJordan(ip){ return ipInRangeList(ip, JO_IP_RANGES); }
function hostMatchesAnyDomain(h, patterns){ if(!h) return false; for(var i=0;i<patterns.length;i++){ if (shExpMatch(h, patterns[i])) return true; var p=patterns[i].replace(/^\*\./,"."); if (h.slice(-p.length)===p) return true; } return false; }
function pathMatches(u, patterns){ if(!u) return false; for(var i=0;i<patterns.length;i++){ if (shExpMatch(u, patterns[i])) return true; } return false; }
function isMediaHost(host){ if(!host) return false; var h=host.toLowerCase(); for(var i=0;i<MEDIA_DOMAINS.length;i++){ if (sh(h, MEDIA_DOMAINS[i])) return true; } return false; }

/* LAN / link-local / local names / proxy-self, and media bypass */
function isBypass(host){
  if(!host) return true;
  var h=host.toLowerCase();
  if (isMediaHost(h)) return true;
  if (isInNet_(h,"169.254.0.0","255.255.0.0")) return true; // APIPA
  if (isPlainHostName_(h)) return true;
  if (dnsDomainIs_(h,".local") || dnsDomainIs_(h,".lan")) return true;
  if (sh(h,"localhost") || sh(h,"localhost.*")) return true;
  if (sh(h,"127.*") || sh(h,"[::1]")) return true;
  if (isIPv6LocalLiteral(h)) return true;
  if (isInNet_(h,"10.0.0.0","255.0.0.0")) return true;
  if (isInNet_(h,"172.16.0.0","255.240.0.0")) return true;
  if (isInNet_(h,"192.168.0.0","255.255.0.0")) return true;
  if (isInNet_(h,"100.64.0.0","255.192.0.0")) return true;
  if (isInNet_(h,"198.18.0.0","255.254.0.0")) return true;
  if (sh(h, PROXY_HOST) || sh(h, "[::ffff:"+PROXY_HOST+"]")) return true; // loop
  return false;
}

/* Sticky / cache */
var STICKY_SALT="JO_STICKY", STICKY_TTL_MINUTES=60, DST_RESOLVE_TTL_MS=15000;
var now=new Date().getTime(), root=(typeof globalThis!=="undefined"?globalThis:this);
if(!root._PAC_CACHE) root._PAC_CACHE={};
var CACHE=root._PAC_CACHE; if(!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE={}; if(!CACHE._PORT_STICKY) CACHE._PORT_STICKY={};
function weightedPick(ports,weights){ var sum=0; for(var i=0;i<weights.length;i++) sum+=(weights[i]||1); var r=Math.floor(Math.random()*sum)+1, acc=0; for(var k=0;k<ports.length;k++){ acc+=(weights[k]||1); if(r<=acc) return ports[k]; } return ports[0]; }
function proxyForCategory(cat){ var key=STICKY_SALT+"_PORT_"+cat, ttl=STICKY_TTL_MINUTES*60*1000, e=CACHE._PORT_STICKY[key]; if(e&&(now-e.t)<ttl) return "PROXY "+PROXY_HOST+":"+e.p; var p=weightedPick(PORTS[cat],PORT_WEIGHTS[cat]); CACHE._PORT_STICKY[key]={p:p,t:now}; return "PROXY "+PROXY_HOST+":"+p; }
function resolveDstCached(h,ttl){ if(!h) return ""; if(/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h; var c=CACHE.DST_RESOLVE_CACHE[h]; if(c&&(now-c.t)<ttl) return c.ip; var r=dnsResolve(h); var ip=(r && r!=="0.0.0.0")? r : ""; CACHE.DST_RESOLVE_CACHE[h]={ip:ip,t:now}; return ip; }

/* قرارات PUBG الصارمة */
function enforceJOorAct(ip, action){
  if (ipInJordan(ip)) return true;
  if (action === "BLOCK") return false;
  return true; // DIRECT في حال اخترت "DIRECT"
}

function FindProxyForURL(url, host){
  host = host || "";

  // 0) bypass للـ LAN/Media/etc
  if (isBypass(host)) return "DIRECT";

  // 1) تصنيف
  var isLobby  = pathMatches(url, URL_PATTERNS.LOBBY)  || hostMatchesAnyDomain(host, PUBG_DOMAINS.LOBBY);
  var isMatch  = pathMatches(url, URL_PATTERNS.MATCH)  || hostMatchesAnyDomain(host, PUBG_DOMAINS.MATCH);
  var isRecruit= pathMatches(url, URL_PATTERNS.RECRUIT_SEARCH) || hostMatchesAnyDomain(host, PUBG_DOMAINS.RECRUIT_SEARCH);
  var isUpdates= pathMatches(url, URL_PATTERNS.UPDATES) || hostMatchesAnyDomain(host, PUBG_DOMAINS.UPDATES);
  var isCDNs   = pathMatches(url, URL_PATTERNS.CDNS)   || hostMatchesAnyDomain(host, PUBG_DOMAINS.CDNS);

  // 2) لو PUBG بفئاتها الأساسية ونفّذنا شرط JO
  if (isLobby || isMatch || isRecruit){
    if (STRICT_PUBG_JO){
      var dst = (/^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS));
      if (!dst || !ipInJordan(dst)){
        return (ACTION_NON_JO_FOR_PUBG === "BLOCK") ? "PROXY 0.0.0.0:0" : "DIRECT";
      }
    }
    return proxyForCategory(isMatch ? "MATCH" : (isRecruit ? "RECRUIT_SEARCH" : "LOBBY"));
  }

  // 3) غير PUBG: تشديد اختياري
  if (ENFORCE_DST_JO_ON_NON_PUBG){
    var d = (/^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS));
    if (!d || !ipInJordan(d)){
      return (ACTION_NON_JO_FOR_NON_PUBG === "BLOCK") ? "PROXY 0.0.0.0:0" : "DIRECT";
    }
  }

  // 4) فئات PUBG الثانوية
  if (isUpdates) return proxyForCategory("UPDATES");
  if (isCDNs)    return proxyForCategory("CDNS");

  // 5) افتراضي
  return ENFORCE_DST_JO_ON_NON_PUBG ? proxyForCategory("UPDATES") : "DIRECT";
}
