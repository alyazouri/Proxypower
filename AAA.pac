/**** PAC: JO Lockdown (v11.3) — Single Proxy, No Leaks, Full Forced Hosts ****/
/* - كل ما يخص PUBG / Tencent / QCloud / CDNs / DoH / telemetry يُجبر عبر بروكسي أردني واحد.
   - يمنع تسريبات DIRECT قدر الإمكان (BLOCK_IF_PROXY_DOWN=true).
   - يستثني LAN/localhost فقط لحماية الشبكة المحلية.
   - أُضيفت نطاقات إضافية: euspeed, cloud.gsdk, k.gjacky, fbcdn, akamai, TikTok CDNs, Unity analytics, Facebook Graph.
   - عدّل PROXY_SINGLE.ip / port تحت فقط.
*/

var PROXY_SINGLE = { ip:"91.106.109.12", port:443, label:"JO-Proxy" };  // ← غيّر هذا إلى بروكسيك
var PROXY     = "PROXY " + PROXY_SINGLE.ip + ":" + PROXY_SINGLE.port;
var PROXY_BLC = "PROXY 0.0.0.0:0"; // بلوك إن البروكسي تعطل

var BLOCK_IF_PROXY_DOWN = true;   // لا تسمح بتسريب DIRECT عند سقوط البروكسي
var BYPASS_LAN = true;            // استثناء LAN/localhost
var FORCE_ALL  = true;            // إجبار كل شيء عبر البروكسي (موصى به لحالتك)

/* === قوائم مُجَمَّعة (PUBG/Tencent/CDN/DoH/Telemetry/TikTok/Unity/Facebook) === */
var PUBG_HOSTS = [
  "*.pubgmobile.com","*.pubgmobile.net","*.igamecj.com","*.proximabeta.com",
  "*.gcloud.qq.com","gpubgm.com","*.qcloudcdn.com","*.tencentcloudapi.com","*.tencent.com","*.qq.com",
  "euspeed.igamecj.com","cloud.gsdk.proximabeta.com","k.gjacky.com"
];

var PUBG_URLS = [
  "*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*",
  "*/teamfinder/*","*/recruit/*","*/account/login*","*/client/version*"
];

/* DNS-over-HTTPS الشائعة (لمنع DoH الهروب) */
var DOH_HOSTS = [
  "dns.google","*.dns.google","cloudflare-dns.com","*.cloudflare-dns.com",
  "security.cloudflare-dns.com","one.one.one.one",
  "dns.quad9.net","*.quad9.net",
  "dns.nextdns.io","*.nextdns.io",
  "dns.adguard.com","*.adguard-dns.com","*.adguard.com",
  "doh.opendns.com","*.opendns.com",
  "doh.cleanbrowsing.org","*.cleanbrowsing.org"
];

/* سحابات CDN عامة + إضافات صريحة */
var CDN_HOSTS = [
  "*.akamai.net","*.akamaiedge.net","*.edgesuite.net",
  "*.cloudfront.net","*.fastly.net","*.llnwd.net","*.edg.io","*.limelight.com",
  "*.azurefd.net","*.azureedge.net","*.trafficmanager.net",
  "*.googleusercontent.com","*.gvt1.com","*.gstatic.com",
  "*.alicdn.com","*.alibabausercontent.com",
  "*.qiniu.com","*.qcloudcdn.com","*.qiniudn.com",
  "euspeed.igamecj.com","cloud.gsdk.proximabeta.com",
  "scontent.fallback.xx.fbcdn.net","a1951.v.akamai.net",
  "k.gjacky.com"
];

/* TikTok / ByteDance CDNs (شائعة في بعض build/launcher telemetry) */
var TIKTOK_HOSTS = [
  "*.snssdk.com", "*.pstatp.com", "*.bytecdn.cn", "*.tiktokcdn.com", "*.tikcdn.net"
];

/* Unity / Analytics / Ads */
var UNITY_HOSTS = [
  "analytics.unity.com","telemetry.unity3d.com","builds-api.cloud.unity3d.com",
  "unityads.unity3d.com","*.unity3d.com","*.unityads.com"
];

/* Facebook Graph / CDN (بعض الموارد تظهر ضمن اللعبة) */
var FACEBOOK_HOSTS = [
  "graph.facebook.com","connect.facebook.net","*.fbcdn.net","scontent.fallback.xx.fbcdn.net"
];

/* دمج كل المضيفات القسرية في مجموعة واحدة للقراءة السريعة */
var FORCED_HOST_GROUPS = [].concat(PUBG_HOSTS, CDN_HOSTS, DOH_HOSTS, TIKTOK_HOSTS, UNITY_HOSTS, FACEBOOK_HOSTS);

/* === دوال مساعدة === */
function lc(s){ return s && s.toLowerCase ? s.toLowerCase() : ""; }
function sh(s,p){ return shExpMatch(s,p); }
function isPlainHostName(h){ return (h && h.indexOf('.') == -1); }
function safeResolve(h){ try { return dnsResolve(h); } catch(e) { return null; } }
function isIPLiteral(h){ return /^[0-9.]+$/.test(h) || (h.indexOf(":") !== -1); }

function hostMatch(host, arr){
  host = lc(host||"");
  if(!host || !arr) return false;
  for(var i=0;i<arr.length;i++){
    var p = arr[i];
    if(sh(host, p)) return true;
    if(p.indexOf("*.") === 0){
      var suf = p.substring(1);
      if(host.length >= suf.length && host.substring(host.length - suf.length) === suf) return true;
    }
  }
  return false;
}

function urlMatch(url, arr){
  if(!url || !arr) return false;
  for(var i=0;i<arr.length;i++){
    if(sh(url, arr[i])) return true;
  }
  return false;
}

/* LAN / localhost bypass */
function isBypass(host){
  if(!BYPASS_LAN) return false;
  if(!host) return true;
  host = lc(host);
  if(isPlainHostName(host)) return true;
  if(sh(host, "localhost") || sh(host, "localhost.*")) return true;
  var ip = safeResolve(host);
  if(!ip) return false;
  if(isInNet(ip, "10.0.0.0", "255.0.0.0")) return true;
  if(isInNet(ip, "172.16.0.0", "255.240.0.0")) return true;
  if(isInNet(ip, "192.168.0.0", "255.255.0.0")) return true;
  if(isInNet(ip, "169.254.0.0", "255.255.0.0")) return true;
  // تجنب loop إلى البروكسي نفسه
  if(sh(host, PROXY_SINGLE.ip) || sh(host, "["+PROXY_SINGLE.ip+"]")) return true;
  return false;
}

/* اختبارات انتماء للمجموعات */
function isPUBG(url, host){ return hostMatch(host, PUBG_HOSTS) || urlMatch(url, PUB G_URLS || PUBG_URLS); } // fallback
function isDoH(host){ return hostMatch(host, DOH_HOSTS); }
function isCDN(host){ return hostMatch(host, CDN_HOSTS) || hostMatch(host, TIKTOK_HOSTS) || hostMatch(host, UNITY_HOSTS) || hostMatch(host, FACEBOOK_HOSTS); }

/* توفير حماية بسيطة ضد loop/غياب البروكسي — PAC لا يمكن التحقق فعلياً من صحة البروكسي */
function proxyAvailable(){ return true; }

/* === FindProxyForURL === */
function FindProxyForURL(url, host){
  host = host || "";
  url = url || "";

  // استثناءات LAN/localhost
  if(isBypass(host)) return "DIRECT";

  // إذا هو IP مباشر — إجبار البروكسي (يمنع تسريب)
  if(isIPLiteral(host)) return proxyAvailable() ? PROXY : (BLOCK_IF_PROXY_DOWN ? PROXY_BLC : "DIRECT");

  // إذا هو DoH أو CDN أو مضيف قسري أو PUBG => عبر البروكسي
  if(isDoH(host) || isCDN(host) || hostMatch(host, PUBG_HOSTS) || urlMatch(url, PUBG_URLS)){
    return proxyAvailable() ? PROXY : (BLOCK_IF_PROXY_DOWN ? PROXY_BLC : "DIRECT");
  }

  // فرض شامل: كل شيء عبر البروكسي
  if(FORCE_ALL){
    return proxyAvailable() ? PROXY : (BLOCK_IF_PROXY_DOWN ? PROXY_BLC : "DIRECT");
  }

  // افتراضي: DIRECT
  return "DIRECT";
}
