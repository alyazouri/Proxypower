// jo_pubg_ipv6_jo_smart.pac
// ملف PAC محسّن لشبكة PUBG الأردنية الذكية
// يوجه الاتصالات عبر IPv6 الأردنية فقط، يحسن المطابقة، ويحظر الإعلانات

function FindProxyForURL(url, host) {
  var PRIMARY_PROXY = "SOCKS5 91.106.109.12:1080"; // بروكسي رئيسي
  var BACKUP_PROXY = "SOCKS5 92.253.121.126:8000"; // بروكسي احتياطي
  var DROP = "PROXY 0.0.0.0:0"; // إسقاط الاتصال

  // المضيفات المحلية
  if (isPlainHostName(host) || host === "localhost") return PRIMARY_PROXY;

  var h = host.toLowerCase();
  var port = extractPort(url);

  // نطاقات PUBG
  if (isPubg(h)) {
    var ip = dnsResolve(host);
    if (!ip || !isIPv6Literal(ip)) return DROP; // رفض إذا فشل DNS أو IPv4

    var serviceType = getServiceType(h, port);

    // المطابقة واللوبي
    if (serviceType === "matchmaking" || serviceType === "lobby") {
      return isInJOv6(ip) ? PRIMARY_PROXY : DROP;
    }

    // خوادم اللعب
    if (serviceType === "game" && isMatchPort(port)) {
      return isInJOv6(ip) ? PRIMARY_PROXY : (isInMiddleEastv6(ip) ? BACKUP_PROXY : DROP);
    }

    // التحديثات وخدمات أخرى
    return isInJOv6(ip) ? PRIMARY_PROXY : DROP;
  }

  // حظر الإعلانات والتتبع
  if (isAdOrTracker(h)) return DROP;

  // باقي الترافيك
  return PRIMARY_PROXY;
}

/* ===== Helpers ===== */

function isPubg(h) {
  var domains = [
    "*.pubgmobile.com", "*.igamecj.com", "*.proximabeta.com",
    "*.tencent.com", "*.tencentgames.com", "*.qcloudcdn.com",
    "*.tencentcdn.com", "*.tencentcloud.com", "*.tencentcloud.net"
  ];
  return domains.some(d => dnsDomainIs(h, d.replace("*.", "")) || shExpMatch(h, d));
}

function getServiceType(h, port) {
  if (shExpMatch(h, "*.lobby.*") || shExpMatch(h, "*.match.*")) return "matchmaking";
  if (isMatchPort(port)) return "game";
  if (shExpMatch(h, "*.update.*") || shExpMatch(h, "*.cdn.*")) return "update";
  return "lobby";
}

function isMatchPort(p) {
  return [20001, 20002, 20003, 10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235].includes(p);
}

function extractPort(u) {
  var m = u.match(/^[a-z]+:\/\/[^\/:]+:(\d+)/i);
  return m && m[1] ? parseInt(m[1], 10) : (u.startsWith("https://") ? 443 : (u.startsWith("http://") ? 80 : 443));
}

function isIPv6Literal(s) {
  return s.includes(":") && !s.includes("[") && !s.includes("]");
}

function isInJOv6(ip) {
  // بادئات IPv6 الأردنية
  var prefixes = [
    ["2a01:9700::", "ffff:ffe0:0000:0000:0000:0000:0000:0000"], // JDC/GO
    ["2a00:18d8::", "ffff:ffe0:0000:0000:0000:0000:0000:0000"], // Orange
    ["2a03:6b00::", "ffff:ffe0:0000:0000:0000:0000:0000:0000"], // Zain
    ["2a03:b640::", "ffff:ffff:0000:0000:0000:0000:0000:0000"]  // Umniah
  ];

  // فحص كل بادئة باستخدام isInNet
  for (var i = 0; i < prefixes.length; i++) {
    if (isInNet(ip, prefixes[i][0], prefixes[i][1])) {
      return true;
    }
  }

  // فحص نصي احتياطي لمحركات PAC القديمة
  var ipLower = ip.toLowerCase();
  var joPrefixes = ["2a01:9700", "2a00:18d8", "2a03:6b00", "2a03:b640"];
  for (var j = 0; j < joPrefixes.length; j++) {
    if (ipLower.startsWith(joPrefixes[j])) {
      return true;
    }
  }

  return false;
}

function isInMiddleEastv6(ip) {
  var prefixes = [
    ["2a00:1a40::", "ffff:ffc0:0000:0000:0000:0000:0000:0000"], // الإمارات
    ["2a00:8d40::", "ffff:ffc0:0000:0000:0000:0000:0000:0000"]  // السعودية
  ];
  return prefixes.some(p => isInNet(ip, p[0], p[1]));
}

function isAdOrTracker(h) {
  var adDomains = ["*.doubleclick.net", "*.googlesyndication.com", "*.admob.com", "*.analytics.google.com", "*.crashlytics.com"];
  return adDomains.some(d => dnsDomainIs(h, d.replace("*.", "")) || shExpMatch(h, d));
}
