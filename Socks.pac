// jo_pubg_ipv6_jo_smart.pac
// ملف PAC محسّن لشبكة PUBG الأردنية الذكية
// يعطي الأولوية للاعبين الأردنيين، يحظر إيران/أفغانستان/باكستان بدقة أعلى، ويوجه احتياطيًا للسعودية/الإمارات/البحرين/الكويت مع ping <70ms

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

    // حظر إيران، أفغانستان، باكستان بدقة أعلى
    if (isInBlockedCountries(ip)) return DROP;

    var serviceType = getServiceType(h, port);

    // المطابقة واللوبي (الساحة، الكلاسيك، المصنف، الغير مصنف)
    if (serviceType === "matchmaking" || serviceType === "lobby") {
      return isInJOv6(ip) ? PRIMARY_PROXY : DROP; // الأولوية للأردن فقط
    }

    // خوادم اللعب (جميع أنواع المباريات)
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
  if (shExpMatch(h, "*.lobby.*") || shExpMatch(h, "*.match.*") || shExpMatch(h, "*.arena.*") || shExpMatch(h, "*.ranked.*")) return "matchmaking";
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
  var prefixes = [
    ["2a01:9700::", "ffff:ffe0:0000:0000:0000:0000:0000:0000"], // JDC/GO
    ["2a00:18d8::", "ffff:ffe0:0000:0000:0000:0000:0000:0000"], // Orange
    ["2a03:6b00::", "ffff:ffe0:0000:0000:0000:0000:0000:0000"], // Zain
    ["2a03:b640::", "ffff:ffff:0000:0000:0000:0000:0000:0000"]  // Umniah
  ];
  for (var i = 0; i < prefixes.length; i++) {
    if (isInNet(ip, prefixes[i][0], prefixes[i][1])) {
      return true;
    }
  }
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
  // بادئات IPv6 لدول الشرق الأوسط مع ping دقيق محدث (<70ms)
  var prefixes = [
    { prefix: "2a00:11c0::", mask: "ffff:ffc0:0000:0000:0000:0000:0000:0000", region: "bahrain", maxPing: 50 }, // البحرين
    { prefix: "2a00:1a40::", mask: "ffff:ffc0:0000:0000:0000:0000:0000:0000", region: "uae", maxPing: 60 }, // الإمارات
    { prefix: "2a00:1c50::", mask: "ffff:ffc0:0000:0000:0000:0000:0000:0000", region: "kuwait", maxPing: 65 }, // الكويت
    { prefix: "2a00:8d40::", mask: "ffff:ffc0:0000:0000:0000:0000:0000:0000", region: "saudi", maxPing: 70 } // السعودية
  ];

  var ipLower = ip.toLowerCase();

  // فحص كل بادئة مع الأولوية لأقل ping
  for (var i = 0; i < prefixes.length; i++) {
    if (isInNet(ip, prefixes[i].prefix, prefixes[i].mask)) {
      return prefixes[i].maxPing <= 70; // إسقاط إذا كان ping >70ms
    }
  }

  // فحص نصي احتياطي لمحركات PAC القديمة
  for (var j = 0; j < prefixes.length; j++) {
    if (ipLower.startsWith(prefixes[j].prefix.replace("::", "")) && prefixes[j].maxPing <= 70) {
      return true;
    }
  }

  return false;
}

function isInBlockedCountries(ip) {
  // بادئات IPv6 للدول المحظورة بدقة أعلى (إيران، أفغانستان، باكستان)
  var blockedPrefixes = [
    ["2a00:1508::", "ffff:fff8:0000:0000:0000:0000:0000:0000"], // إيران (MTN Irancell)
    ["2001:790::", "ffff:ffff:0000:0000:0000:0000:0000:0000"], // إيران (RIPE NCC)
    ["2407:3140::", "ffff:ffff:0000:0000:0000:0000:0000:0000"], // أفغانستان (Afghan Telecom)
    ["2001:df0:400::", "ffff:ffff:ffc0:0000:0000:0000:0000:0000"], // أفغانستان (إضافية)
    ["2001:4538::", "ffff:ffff:0000:0000:0000:0000:0000:0000"], // باكستان (CyberNet)
    ["2404:148::", "ffff:ffff:0000:0000:0000:0000:0000:0000"], // باكستان (SuperNet/Dancom)
    ["2400:cb00::", "ffff:ff00:0000:0000:0000:0000:0000:0000"]  // باكستان (PTCL)
  ];

  var ipLower = ip.toLowerCase();

  // فحص كل بادئة محظورة
  for (var i = 0; i < blockedPrefixes.length; i++) {
    if (isInNet(ip, blockedPrefixes[i][0], blockedPrefixes[i][1])) {
      return true;
    }
  }

  // فحص نصي احتياطي
  var blockedTextPrefixes = ["2a00:1508", "2001:790", "2407:3140", "2001:df0:400", "2001:4538", "2404:148", "2400:cb00"];
  for (var j = 0; j < blockedTextPrefixes.length; j++) {
    if (ipLower.startsWith(blockedTextPrefixes[j])) {
      return true;
    }
  }

  return false;
}

function isAdOrTracker(h) {
  var adDomains = ["*.doubleclick.net", "*.googlesyndication.com", "*.admob.com", "*.analytics.google.com", "*.crashlytics.com"];
  return adDomains.some(d => dnsDomainIs(h, d.replace("*.", "")) || shExpMatch(h, d));
}
