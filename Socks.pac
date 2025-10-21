// jo_pubg_ipv6_jo_only.pac
// كل شيء عبر نفس البروكسي (لا DIRECT). إسقاط الاتصالات التي لا تطابق الشروط.
// يتحقق من IPv6 ضمن بادئات الأردن المطلوبة فقط.

function FindProxyForURL(url, host) {
  var PROXY = "SOCKS5 91.106.109.12:1080";
  var DROP  = "PROXY 0.0.0.0:0";

  if (isPlainHostName(host) || host === "localhost") return PROXY;

  var h = host.toLowerCase();
  var port = extractPort(url);

  // نطاق PUBG: لوبي/تجنيد/مباريات
  if (isPubg(h)) {
    var ip = dnsResolve(host);
    if (!ip) return DROP;                     // فشل DNS
    if (!isIPv6Literal(ip)) return DROP;      // نرفض IPv4

    // مباريات فقط (UDP غالباً، لكن هنا نفلتر على منفذ الوجهة الظاهر في URL/HTTPS)
    if (isMatchPort(port)) {
      return isInJOv6(ip) ? PROXY : DROP;
    }

    // لوبي/تجنيد/خدمات أخرى
    return isInJOv6(ip) ? PROXY : DROP;
  }

  // باقي الترافيك عبر نفس البروكسي
  return PROXY;
}

/* ===== Helpers ===== */

function isPubg(h) {
  return (
    dnsDomainIs(h, "pubgmobile.com")  || shExpMatch(h, "*.pubgmobile.com")  ||
    dnsDomainIs(h, "igamecj.com")     || shExpMatch(h, "*.igamecj.com")     ||
    dnsDomainIs(h, "proximabeta.com") || shExpMatch(h, "*.proximabeta.com") ||
    dnsDomainIs(h, "tencent.com")     || shExpMatch(h, "*.tencent.com")     ||
    dnsDomainIs(h, "tencentgames.com")|| shExpMatch(h, "*.tencentgames.com")||
    dnsDomainIs(h, "qcloudcdn.com")   || shExpMatch(h, "*.qcloudcdn.com")   ||
    dnsDomainIs(h, "tencentcdn.com")  || shExpMatch(h, "*.tencentcdn.com")  ||
    dnsDomainIs(h, "tencentcloud.com")|| shExpMatch(h, "*.tencentcloud.com")||
    dnsDomainIs(h, "tencentcloud.net")|| shExpMatch(h, "*.tencentcloud.net")
  );
}

// منافذ مباريات شائعة (إن ظهر منفذ بالـURL)
function isMatchPort(p) {
  return (
    (p >= 20001 && p <= 20003) ||
    p === 10010 || p === 10012 || p === 10013 ||
    p === 10039 || p === 10096 || p === 10491 ||
    p === 10612 || p === 11000 || p === 11455 || p === 12235
  );
}

function extractPort(u) {
  var m = u.match(/^[a-z]+:\/\/[^\/:]+:(\d+)/i);
  if (m && m[1]) return parseInt(m[1], 10);
  if (u.indexOf("https://") === 0) return 443;
  if (u.indexOf("http://")  === 0) return 80;
  return 443;
}

function isIPv6Literal(s) {
  return s.indexOf(":") !== -1 && s.indexOf("[") === -1 && s.indexOf("]") === -1;
}

// فحص البادئات الأردنية فقط
function isInJOv6(ip) {
  try {
    // JDC / GO: 2a01:9700::/29
    if (isInNet(ip, "2a01:9700::", "ffff:ffe0:0000:0000:0000:0000:0000:0000")) return true;
    // Orange: 2a00:18d8::/29
    if (isInNet(ip, "2a00:18d8::", "ffff:ffe0:0000:0000:0000:0000:0000:0000")) return true;
    // Zain: 2a03:6b00::/29
    if (isInNet(ip, "2a03:6b00::", "ffff:ffe0:0000:0000:0000:0000:0000:0000")) return true;
    // Umniah / Orbitel: 2a03:b640::/32
    if (isInNet(ip, "2a03:b640::", "ffff:ffff:0000:0000:0000:0000:0000:0000")) return true;
  } catch (e) {
    // محركات PAC القديمة: احتياط مطابقة نصية
    var l = ip.toLowerCase();
    if (l.indexOf("2a01:9700") === 0) return true;
    if (l.indexOf("2a00:18d8") === 0) return true;
    if (l.indexOf("2a03:6b00") === 0) return true;
    if (l.indexOf("2a03:b640") === 0) return true;
  }
  return false;
}
