/**** PAC: System-Wide JO Proxy — LAN Extended (v10-LAN+LL) ****/
/* طلبك: نخليه يبلّش من Link-Local IPv4.
   - يبدأ فحص الـbypass بـ 169.254.0.0/16 (APIPA) أولاً، ثم بقية الاستثناءات الآمنة.
   - كل ما عدا ذلك يُجبر عبر بروكسي أردني واحد (هوية JO ثابتة).
*/

/* === عدّل عنوان بروكسيك هنا === */
var PROXY = "PROXY 91.106.109.12:443";  // ← غيّر الـIP/المنفذ إذا لزم

/* === مساعدات === */
function isPlainHostName(host){ return (host && host.indexOf('.') == -1); }
function dnsDomainIs(host, domain){ return (host.length >= domain.length && host.substring(host.length - domain.length) == domain); }
function sh(s,p){ return shExpMatch(s,p); }
function isInNet_(host, pattern, mask){
  var ip = null;
  try { ip = dnsResolve(host); } catch(e) { ip = null; }
  if (!ip) return false;
  return isInNet(ip, pattern, mask);
}
function isIPv6LocalLiteral(h){
  // PAC عادة يمرر IPv6 literal بصيغة [addr]
  if(!h || h.charAt(0) !== "[") return false;
  var x = h.substring(1, h.length-1).toLowerCase();
  if (x === "::1") return true;           // loopback
  if (x.indexOf("fe80:") === 0) return true; // IPv6 link-local
  // ULA fc00::/7 (اختياري)
  if (x.indexOf("fc") === 0 || x.indexOf("fd") === 0) return true;
  return false;
}

/* === استثناءات ضرورية (DIRECT) — تبدأ من Link-Local IPv4 === */
function isBypass(host){
  if(!host) return true;
  host = host.toLowerCase();

  /* 0) Link-Local IPv4 أولاً (APIPA 169.254/16) */
  if (isInNet_(host, "169.254.0.0", "255.255.0.0")) return true;

  /* 1) أسماء محلية/بلا نقطة */
  if(isPlainHostName(host)) return true;
  if (dnsDomainIs(host, ".local") || dnsDomainIs(host, ".lan")) return true;

  /* 2) loopback/Link-local */
  if (sh(host, "localhost") || sh(host, "localhost.*")) return true;
  if (sh(host, "127.*") || sh(host, "[::1]")) return true;
  if (isIPv6LocalLiteral(host)) return true;

  /* 3) شبكات داخلية/خاصة موسّعة */
  // RFC1918
  if (isInNet_(host, "10.0.0.0",    "255.0.0.0"))      return true; // 10/8
  if (isInNet_(host, "172.16.0.0",  "255.240.0.0"))    return true; // 172.16/12
  if (isInNet_(host, "192.168.0.0", "255.255.0.0"))    return true; // 192.168/16
  // CGNAT (مزودي الخدمة)
  if (isInNet_(host, "100.64.0.0",  "255.192.0.0"))    return true; // 100.64/10
  // Bench/Test (مختبرات داخلية)
  if (isInNet_(host, "198.18.0.0",  "255.254.0.0"))    return true; // 198.18/15

  /* 4) لا نعيد توجيه اتصال البروكسي لنفسه (تفادي loop) — غيّر IP إن بدّلت البروكسي */
  if (sh(host, "91.106.109.12") || sh(host, "[::ffff:91.106.109.12]")) return true;

  return false;
}

/* === القرار النهائي === */
function FindProxyForURL(url, host){
  host = host || "";

  // استثناءات ضرورية (تبدأ من Link-Local IPv4)
  if (isBypass(host)) return "DIRECT";

  // كل شيء آخر عبر البروكسي الأردني الواحد
  return PROXY;
}
