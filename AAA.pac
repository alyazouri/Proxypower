/**** PAC: System-Wide JO Proxy (v10, Single Proxy) ****/
/* سياسة:
   - كل الاتصالات عبر بروكسي أردني واحد (هوية أردنية مطلقة).
   - استثناءات آمنة: localhost, LAN, proxy-self, أسرلة الأسامي المحلية.
   - هذا أقصى ما يمكن بــ PAC لرفع نسبة لواعب الأردن.
*/

/* === عدّل عنوان بروكسيك هنا === */
var PROXY = "PROXY 91.106.109.12:443";  // ← غيّر الـIP/المنفذ إذا لزم

/* === مساعدة === */
function isPlainHostName(host){ return (host && host.indexOf('.') == -1); }
function dnsDomainIs(host, domain){ return (host.length >= domain.length && host.substring(host.length - domain.length) == domain); }
function sh(s,p){ return shExpMatch(s,p); }  // اختصار
function isInNet_(host, pattern, mask){
  var ip = dnsResolve(host);
  if (!ip) return false;
  return isInNet(ip, pattern, mask);
}

/* === استثناءات ضرورية (DIRECT) === */
function isBypass(host){
  if(!host) return true;
  host = host.toLowerCase();

  // 1) أسماء محلية/بلا نقطة
  if(isPlainHostName(host)) return true;
  if (dnsDomainIs(host, ".local") || dnsDomainIs(host, ".lan")) return true;

  // 2) عناوين loopback/Link-local
  if (sh(host, "localhost") || sh(host, "localhost.*")) return true;
  if (sh(host, "127.*") || sh(host, "[::1]")) return true;

  // 3) شبكات RFC1918 / RFC4193 / Link-Local
  if (isInNet_(host, "10.0.0.0",   "255.0.0.0"))      return true;
  if (isInNet_(host, "172.16.0.0", "255.240.0.0"))    return true;
  if (isInNet_(host, "192.168.0.0","255.255.0.0"))    return true;
  if (isInNet_(host, "169.254.0.0","255.255.0.0"))    return true; // link-local

  // 4) لا نعيد توجيه اتصال البروكسي لنفسه (تفادي loop) — غيّر IP إن بدّلت البروكسي
  if (sh(host, "91.106.109.12") || sh(host, "[::ffff:91.106.109.12]")) return true;

  return false;
}

/* === القرار النهائي === */
function FindProxyForURL(url, host){
  host = host || "";

  // استثناءات ضرورية
  if (isBypass(host)) return "DIRECT";

  // كل شيء آخر عبر البروكسي الأردني الواحد
  return PROXY;
}
