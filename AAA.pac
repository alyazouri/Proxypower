/**** PAC: JO-Force Total (v12) — Single Proxy, Zero Leaks, No Exceptions ****/
/* الهدف: فرض هوية أردنية 100% لرفع نسبة لواعب الأردن في PUBG.
   - لا استثناءات LAN/Umniah/… إطلاقاً.
   - إجبار PUBG + Tencent + CDNs + DoH + Telemetry، بل وكل الترافيك.
   - عند سقوط البروكسي: حظر (بدل DIRECT) لمنع التسريب.
*/

var PROXY_SINGLE = { ip:"91.106.109.12", port:443, label:"JO-Proxy" }; // ← غيّر هنا إذا لزم
var PROXY        = "PROXY " + PROXY_SINGLE.ip + ":" + PROXY_SINGLE.port;
var PROXY_BLOCK  = "PROXY 0.0.0.0:0";

var BLOCK_IF_PROXY_DOWN = true;   // إن كان البروكسي غير متاح، بلوك
var FORCE_ALL           = true;   // إجبار شامل لكل الترافيك
var BYPASS_LAN          = false;  // لا استثناء LAN إطلاقاً

/* ===== PUBG / Tencent / QCloud / إضافات صريحة ===== */
var PUBG_HOSTS = [
  "*.pubgmobile.com","*.pubgmobile.net","*.igamecj.com","*.proximabeta.com",
  "*.gcloud.qq.com","gpubgm.com",
  "*.tencent.com","*.qq.com","*.tencentcloudapi.com","*.qcloudcdn.com",
  "euspeed.igamecj.com","cloud.gsdk.proximabeta.com","k.gjacky.com"
];
var PUBG_URLS = [
  "*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*",
  "*/teamfinder/*","*/recruit/*","*/account/login*","*/client/version*"
];

/* ===== DNS-over-HTTPS (منع هروب DNS) ===== */
var DOH_HOSTS = [
  "dns.google","*.dns.google","cloudflare-dns.com","*.cloudflare-dns.com","security.cloudflare-dns.com","one.one.one.one",
  "dns.quad9.net","*.quad9.net","dns.nextdns.io","*.nextdns.io","dns.adguard.com","*.adguard-dns.com","*.adguard.com",
  "doh.opendns.com","*.opendns.com","doh.cleanbrowsing.org","*.cleanbrowsing.org"
];

/* ===== CDNs واسعة + إضافات ===== */
var CDN_HOSTS = [
  "*.akamai.net","*.akamaiedge.net","*.edgesuite.net",
  "*.cloudfront.net","*.fastly.net","*.llnwd.net","*.edg.io","*.limelight.com",
  "*.azurefd.net","*.azureedge.net","*.trafficmanager.net",
  "*.googleusercontent.com","*.gvt1.com","*.gstatic.com",
  "*.alicdn.com","*.alibabausercontent.com",
  "*.qiniu.com","*.qiniudn.com","*.qcloudcdn.com",
  "scontent.fallback.xx.fbcdn.net","a1951.v.akamai.net",
  "euspeed.igamecj.com","cloud.gsdk.proximabeta.com","k.gjacky.com"
];

/* ===== TikTok / Unity / Facebook (Telemetry/SDKs محتملة) ===== */
var TIKTOK_HOSTS   = ["*.snssdk.com","*.pstatp.com","*.bytecdn.cn","*.tiktokcdn.com","*.tikcdn.net"];
var UNITY_HOSTS    = ["analytics.unity.com","telemetry.unity3d.com","builds-api.cloud.unity3d.com","unityads.unity3d.com","*.unity3d.com","*.unityads.com"];
var FACEBOOK_HOSTS = ["graph.facebook.com","connect.facebook.net","*.fbcdn.net","scontent.fallback.xx.fbcdn.net"];

/* ===== تجميع القوائم ===== */
var FORCE_HOSTS = [].concat(PUBG_HOSTS, DOH_HOSTS, CDN_HOSTS, TIKTOK_HOSTS, UNITY_HOSTS, FACEBOOK_HOSTS);

/* ===== أدوات مساعدة ===== */
function lc(s){ return s && s.toLowerCase ? s.toLowerCase() : ""; }
function sh(s,p){ return shExpMatch(s,p); }
function isIPLiteral(h){ return /^[0-9.]+$/.test(h) || (h && h.indexOf(":")!==-1); }
function hostMatch(host, arr){
  host = lc(host||"");
  if(!host || !arr) return false;
  for(var i=0;i<arr.length;i++){
    var p = arr[i];
    if(sh(host,p)) return true;
    if(p.indexOf("*.")===0){
      var suf = p.substring(1);
      if(host.length>=suf.length && host.substring(host.length-suf.length)===suf) return true;
    }
  }
  return false;
}
function urlMatch(url, arr){
  if(!url || !arr) return false;
  for(var i=0;i<arr.length;i++){ if(sh(url, arr[i])) return true; }
  return false;
}
function proxyAvailable(){ return true; } // PAC لا يستطيع التحقق فعلياً؛ نبقيها true

/* ===== القرار النهائي ===== */
function FindProxyForURL(url, host){
  host = host || ""; url = url || "";

  // لا bypass مطلقاً — حتى LAN/localhost (بما أنك تريد أقصى أردنة)
  // أي IP literal مباشرة => إجبار البروكسي
  if(isIPLiteral(host)) return proxyAvailable()? PROXY : (BLOCK_IF_PROXY_DOWN? PROXY_BLOCK : "DIRECT");

  // أجبر القوائم والروابط الخاصة بـPUBG/DoH/CDN/SDKs
  if(hostMatch(host, FORCE_HOSTS) || urlMatch(url, PUBG_URLS)){
    return proxyAvailable()? PROXY : (BLOCK_IF_PROXY_DOWN? PROXY_BLOCK : "DIRECT");
  }

  // إجبار شامل لكل ما تبقى
  if(FORCE_ALL) return proxyAvailable()? PROXY : (BLOCK_IF_PROXY_DOWN? PROXY_BLOCK : "DIRECT");

  // (لن نصل هنا عملياً)
  return PROXY;
}
