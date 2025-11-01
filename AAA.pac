/**** PAC: System-Wide JO Proxy + JO-Residential IPv4 Exceptions (v10-R) ****/
/* سياسة:
   - إذا الوجهة داخل نطاقات سكنية أردنية (Zain / Umniah / Orange) => DIRECT
   - كل شيء آخر (خارج اللائحة) => PROXY واحد (system-wide)
   - استثناءات LAN/localhost محفوظة
   - عدّل PROXY_SINGLE.ip/port أو أضف/انقص نطاقات حسب لوج عندك
*/

/* === بروكسيك الأردني الوحيد (عدّل IP/PORT إن احتجت) === */
var PROXY_SINGLE = { ip: "91.106.109.12", port: 443, label: "JO-Proxy" };
var PROXY = "PROXY " + PROXY_SINGLE.ip + ":" + PROXY_SINGLE.port;

/* === قوائم IPv4 سكنية مبدأية (فايبر/منزلية) - Zain / Umniah / Orange ===
   يمكنك إضافة/تعديل أي نطاق تملكه من لوجاتك هنا. */
var ZAIN_V4 = [
  ["91.106.96.0","91.106.111.255"],
  ["185.80.24.0","185.80.27.255"],
  ["37.44.32.0","37.44.47.255"]
];

var UMNIAH_V4 = [
  ["109.107.224.0","109.107.255.255"],
  ["188.247.64.0","188.247.127.255"]
];

var ORANGE_V4 = [
  ["94.249.0.0","94.249.255.255"],
  ["86.111.0.0","86.111.255.255"],
  ["62.240.0.0","62.240.255.255"],
  ["212.118.0.0","212.118.127.255"]
];

/* تجمع سريع لكل النطاقات الأردنية السكنية اللي نستخدمها كـEXCEPTIONS */
var JO_RESIDENTIAL_V4 = [].concat(ZAIN_V4, UMNIAH_V4, ORANGE_V4);

/* === استثناءات اتصال محلي === */
function isPlainHostName(host){ return (host && host.indexOf('.') == -1); }
function dnsDomainIs(host, domain){ return (host.length >= domain.length && host.substring(host.length - domain.length) == domain); }
function shExp(s,p){ return shExpMatch(s,p); }

/* helper: resolve and safe */
function safeDnsResolve(host){
  try { return dnsResolve(host); } catch(e) { return null; }
}

/* IPv4 utilities */
function ip4ToInt(ip){
  var p = ip.split('.');
  return ((((parseInt(p[0])<<24)>>>0) + ((parseInt(p[1])<<16)>>>0) + ((parseInt(p[2])<<8)>>>0) + (parseInt(p[3])>>>0))>>>0);
}
function inRangeV4(ip, range){
  try{
    if(!ip || ip.indexOf(".")===-1) return false;
    var n = ip4ToInt(ip);
    var s = ip4ToInt(range[0]);
    var e = ip4ToInt(range[1]);
    return n >= s && n <= e;
  }catch(err){
    return false;
  }
}

/* تحقق إذا IP ضمن أي نطاق سكني JO */
function isInJoResidential(ip){
  if(!ip || ip.indexOf(".")===-1) return false;
  for(var i=0;i<JO_RESIDENTIAL_V4.length;i++){
    if(inRangeV4(ip, JO_RESIDENTIAL_V4[i])) return true;
  }
  return false;
}

/* تحقق استثناءات LAN / localhost / الراوتر / البروكسي نفسه */
function isBypassHost(host){
  if(!host) return true;
  host = host.toLowerCase();

  if(isPlainHostName(host)) return true;
  if (dnsDomainIs(host, ".local") || dnsDomainIs(host, ".lan")) return true;
  if (shExp(host, "localhost") || shExp(host, "localhost.*")) return true;

  // RFC1918
  try{
    var ip = dnsResolve(host);
    if(ip){
      if (isInNet(ip, "10.0.0.0", "255.0.0.0")) return true;
      if (isInNet(ip, "172.16.0.0", "255.240.0.0")) return true;
      if (isInNet(ip, "192.168.0.0", "255.255.0.0")) return true;
      if (isInNet(ip, "169.254.0.0", "255.255.0.0")) return true;
    }
  }catch(e){ /* ignore */ }

  // لا نعيد توجيه البروكسي لنفسه (تفادي loop) — غيّر إذا بدلت PROXY_SINGLE
  if(host.indexOf(PROXY_SINGLE.ip)!==-1) return true;

  return false;
}

/* تصنيف سريع إن كان الطلب PUBG (احتياطي) — لو بدك تخصص استثناءات لنطاقات معينة */
var PUBG_PATTERNS = [
  "*.pubgmobile.com","*.pubgmobile.net","*.igamecj.com","*.proximabeta.com",
  "*.gcloud.qq.com","gpubgm.com","cdn.pubgmobile.com","updates.pubgmobile.com","match.igamecj.com"
];
function isLikelyPUBG(host, url){
  if(!host) return false;
  var h = host.toLowerCase();
  for(var i=0;i<PUBG_PATTERNS.length;i++){ if(shExpMatch(h, PUBG_PATTERNS[i])) return true; }
  if(url && (shExpMatch(url,"*/matchmaking/*") || shExpMatch(url,"*/game/join*") || shExpMatch(url,"*/teamfinder/*"))) return true;
  return false;
}

/* === القرار النهائي === */
function FindProxyForURL(url, host){
  host = host || "";

  // استثناءات محلية
  if(isBypassHost(host)) return "DIRECT";

  // جرب حل الـDNS (A) أولاً
  var ip = null;
  try { ip = dnsResolve(host); } catch(e) { ip = null; }

  // إذا الـA حلّ و هو ضمن النطاقات السكنية الأردنية => DIRECT
  if(ip && isInJoResidential(ip)) {
    return "DIRECT";
  }

  // في حالة عدم حلّ A أو غير ضمن النطاق => اجبر البروكسي (system-wide)
  return PROXY;
}
