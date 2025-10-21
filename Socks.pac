function FindProxyForURL(url, host) {
  var JO_PROXY = "SOCKS5 91.106.109.12:1080";
  var DROP     = "PROXY 0.0.0.0:0";

  if (isPlainHostName(host) || host === "localhost") return DROP; // لا DIRECT نهائيًا

  var h = host.toLowerCase();
  var p = extractPort(url);

  // نطاق PUBG: لوبي + تحديثات + تجنيد + مباريات
  if (isPubg(h)) {
    // نمنع IPv4 تمامًا لببجي (حتى لا تخرج خارج IPv6 الأردني)
    var ip = dnsResolve(host);
    if (!ip) return DROP;
    if (!isIPv6Literal(ip)) return DROP; // أي A-record → Drop

    // للمباريات فقط (شدّة أعلى على البورتات)
    if (isMatchPort(p)) {
      if (isJOv6(ip)) return JO_PROXY;
      return DROP;
    }

    // للتجنيد/لوبي/تحديثات: ما يمر إلا لو داخل 2a01:9700::/29
    if (isJOv6(ip)) return JO_PROXY;
    return DROP;
  }

  // باقي الترافيك: عبر البروكسي (لتوحيد المسار الأردني)
  return JO_PROXY;

  // ----- Helpers -----
  function isPubg(h) {
    if (dnsDomainIs(h, "pubgmobile.com") || shExpMatch(h, "*.pubgmobile.com")) return true;
    if (dnsDomainIs(h, "igamecj.com")    || shExpMatch(h, "*.igamecj.com"))    return true; // تجنيد/ماتش
    if (dnsDomainIs(h, "gcloudsdk.com")  || shExpMatch(h, "*.gcloudsdk.com"))  return true; // جلسات/قنوات
    if (dnsDomainIs(h, "qcloudcdn.com")  || shExpMatch(h, "*.qcloudcdn.com"))  return true; // CDN لعبة
    if (dnsDomainIs(h, "proximabeta.com")|| shExpMatch(h, "*.proximabeta.com"))return true;
    if (dnsDomainIs(h, "tencent.com")    || shExpMatch(h, "*.tencent.com"))    return true;
    if (dnsDomainIs(h, "tencentgames.com")||shExpMatch(h, "*.tencentgames.com"))return true;
    return false;
  }

  function isMatchPort(port) {
    // شددنا على منافذ المباريات الأساسية
    return (port >= 20001 && port <= 20003);
  }

  function extractPort(u) {
    var m = u.match(/^[a-z]+:\/\/[^\/:]+:(\d+)/i);
    if (m && m[1]) return parseInt(m[1], 10);
    if (u.indexOf("https://") === 0) return 443;
    if (u.indexOf("http://")  === 0) return 80;
    return 443;
  }

  function isIPv6Literal(s) { return s.indexOf(":") !== -1 && s.indexOf("[") === -1 && s.indexOf("]") === -1; }

  function isJOv6(ip6) {
    // فحص /29: 2a01:9700::/29  (mask: ffff:ffe0::)
    try {
      if (isInNet(ip6, "2a01:9700::", "ffff:ffe0:0000:0000:0000:0000:0000:0000")) return true;
    } catch (e) {}
    // احتياط: مطابقة نصية لأول 29 بت تقريبية (prefix start)
    return ip6.toLowerCase().indexOf("2a01:97") === 0; // تقريبية لو محرك PAC لا يدعم IPv6 fully
  }
}
