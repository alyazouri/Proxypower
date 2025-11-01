/**** PAC: Single-Proxy + Hop-Heuristic (v1) ****/
/* وصف:
   - يستخدم بروكسي واحد فقط لجميع اتصالات PUBG غير الأردنية حسب "الهوب-هيوريستيك".
   - يحاول تقليد فحص hop عبر: CIDR (هوب/شبكات JO) + كلمات مفتاحية في الاسم (rDNS/CNAME).
   - ملاحظة: PAC لا يمكن عمل traceroute داخلياً؛ هذا أفضل تقريب عملي داخل PAC.
*/

/* ======== إعدادات المستخدم (غيّر هذه) ======== */
var PROXY_SINGLE = { ip: "91.106.109.12", label: "Zain-JO", port: 443 }; // ضع بروكسي سكني أردني هنا
var PROXY_STR = "PROXY " + PROXY_SINGLE.ip + ":" + PROXY_SINGLE.port;

/* إذا أردت حظر تام بدل البروكسي ضع: "PROXY 0.0.0.0:0" في مكان PROXY_STR أو أغير المنطق أدناه */

/* ======== قوائم CIDR/Hop-ish (مُركّزة لهوب/شبكات JO) ======== */
/* هذه شبكات تُستخدم عادة في الأردن (هوم/هوب). أضف أو حدّث حسب لوجاتك. */
var JO_HOP_V4 = [
  ["94.249.0.0","94.249.255.255"],["86.111.0.0","86.111.255.255"],["62.240.0.0","62.240.255.255"],
  ["91.106.96.0","91.106.111.255"],["109.107.224.0","109.107.255.255"],["212.35.64.0","212.35.127.255"],
  ["95.172.192.0","95.172.223.255"],["46.248.192.0","46.248.223.255"]
];
var JO_HOP_V6 = [
  "2a00:18d8::/29","2a03:b640::/32","2a03:6b00::/29","2a01:9700::/29"
];

/* كلمات مفتاحية في اسم المضيف تشير لهوب/ISP أردني */
var JO_HOST_KEYWORDS = ["zain","orange","umniah","batelco","jo","jordan","jordanian","jo-"];

/* ======== أنماط PUBG (نقاط الالتقاط) ======== */
var PUBG_DOMAINS = [
  "*.pubgmobile.com","*.pubgmobile.net","*.igamecj.com","*.proximabeta.com",
  "*.gcloud.qq.com","gpubgm.com","cdn.pubgmobile.com","updates.pubgmobile.com",
  "match.igamecj.com","teamfinder.igamecj.com"
];
var PUBG_URL_PATTERNS = [
  "*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/teamfinder/*",
  "*/recruit/*","*/account/login*","*/client/version*","*/patch*","*/download*"
];

/* ======== أدوات مساعدة ======== */
function lc(s){ return s && s.toLowerCase ? s.toLowerCase() : ""; }
function nowMs(){ return (new Date()).getTime(); }

/* DNS resolution helper (prefer v4) */
function dnsResolveExPreferV4(host){
  var ip="", ip6="";
  if(typeof dnsResolveEx==="function"){
    var list = dnsResolveEx(host) || [];
    for(var i=0;i<list.length;i++){
      var a=list[i]||"";
      if(!a) continue;
      if(a.indexOf(":")!==-1){ if(!ip6) ip6=a; }
      else { if(!ip) ip=a; }
    }
  } else {
    try{ ip = dnsResolve(host) || ""; }catch(e){}
  }
  return {ip:ip, ip6:ip6};
}

/* IPv4 helpers */
function ip4ToInt(ip){
  var p=ip.split("."); return ((((parseInt(p[0])<<24)>>>0) + ((parseInt(p[1])<<16)>>>0) + ((parseInt(p[2])<<8)>>>0) + (parseInt(p[3])>>>0))>>>0);
}
function inRangeV4(ip, rng){
  try{
    var n=ip4ToInt(ip);
    var s=ip4ToInt(rng[0]), e=ip4ToInt(rng[1]);
    return n >= s && n <= e;
  }catch(e){ return false; }
}

/* IPv6 CIDR match (basic) */
function expand6(ip){
  if(ip.indexOf("::")===-1){ var parts=ip.split(":"); while(parts.length<8) parts.push("0"); return parts; }
  var a=ip.split("::"), L=a[0]?a[0].split(":"):[], R=(a.length>1&&a[1])?a[1].split(":"):[]; while(L.length+R.length<8) R.unshift("0"); return L.concat(R);
}
function parse6(ip){
  var parts = expand6(ip.toLowerCase()); var out=[]; for(var i=0;i<8;i++){ var v = parts[i].length ? parseInt(parts[i],16) : 0; if(isNaN(v)) v=0; out.push(v&0xffff); } return out;
}
function matchV6CIDR(ip,cidr){
  try{
    var spl=cidr.split("/"); var pre=spl[0], bits=parseInt(spl[1],10);
    var a=parse6(ip), b=parse6(pre); var full=Math.floor(bits/16), rem=bits%16;
    for(var i=0;i<full;i++){ if(a[i]!==b[i]) return false; }
    if(rem===0) return true;
    var mask = 0xffff << (16-rem);
    return ((a[full] & mask) === (b[full] & mask));
  }catch(e){ return false; }
}

/* هل الـIP ضمن هوب JO حسب القوائم؟ */
function isHopJOFromIPs(ip, ip6){
  if(ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)){
    for(var i=0;i<JO_HOP_V4.length;i++){ if(inRangeV4(ip, JO_HOP_V4[i])) return true; }
  }
  if(ip6 && ip6.indexOf(":")!==-1){
    for(var j=0;j<JO_HOP_V6.length;j++){ if(matchV6CIDR(ip6, JO_HOP_V6[j])) return true; }
  }
  return false;
}

/* اسم المضيف يحتوي كلمات JO؟ */
function hostHasJOKeywords(host){
  host = lc(host||"");
  if(!host) return false;
  for(var i=0;i<JO_HOST_KEYWORDS.length;i++){
    if(host.indexOf(JO_HOST_KEYWORDS[i])!==-1) return true;
  }
  return false;
}

/* هل هو PUBG؟ */
function isLikelyPUBG(url, host){
  host = lc(host||""); url = url||"";
  for(var i=0;i<PUBG_DOMAINS.length;i++){ if(shExpMatch(host, PUBG_DOMAINS[i])) return true; }
  for(var j=0;j<PUBG_URL_PATTERNS.length;j++){ if(shExpMatch(url, PUBG_URL_PATTERNS[j])) return true; }
  return false;
}

/* ======== القرار: single-proxy + hop-heuristic ======== */
function FindProxyForURL(url, host){
  host = host || "";
  // non-PUBG -> DIRECT
  if(!isLikelyPUBG(url, host)) return "DIRECT";

  // محاولة أخذ A/AAAA و"تقريب الهوب"
  var rr = dnsResolveExPreferV4(host || "");
  var ip = rr.ip || "";
  var ip6 = rr.ip6 || "";

  // heuristic1: عنوان الوجهة داخل قوائم هوب أردنية => اعتباره محلي/hop داخل JO => DIRECT
  if(isHopJOFromIPs(ip, ip6)) return "DIRECT";

  // heuristic2: اسم المضيف يشير لمزوّد أردني أو rDNS يحتوي كلمة JO => DIRECT
  if(hostHasJOKeywords(host)) return "DIRECT";

  // heuristic3: لو لم نؤكد، نرسل عبر بروكسي الأردني الوحيد (fail-over غير مطلوب لأن بروكسي واحد)
  return PROXY_STR;
}
