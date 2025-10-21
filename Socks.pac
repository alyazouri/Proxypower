// jo_pubg_ipv6_jo_smart.pac
function FindProxyForURL(url, host) {
  var PRIMARY = "SOCKS5 91.106.109.12:1080";
  var BACKUP = "SOCKS5 92.253.121.126:8000";
  var DROP = "PROXY 0.0.0.0:0";

  if (isPlainHostName(host) || host === "localhost") return PRIMARY;

  var h = host.toLowerCase();
  var port = extractPort(url);

  if (isPubg(h)) {
    var ip = dnsResolve(host);
    if (!ip || !ip.includes(":")) return DROP;

    // فحص الحظر أولاً
    if (isInBlockedCountries(ip)) return DROP;

    var service = h.match(/lobby|match|arena|ranked/i) ? "matchmaking" : isMatchPort(port) ? "game" : h.match(/update|cdn/i) ? "update" : "lobby";

    if (service === "matchmaking" || service === "lobby") return isInJOv6(ip) ? PRIMARY : DROP;
    if (service === "game" && isMatchPort(port)) return isInJOv6(ip) ? PRIMARY : (isInJOBackupv6(ip) ? BACKUP : DROP);
    return isInJOv6(ip) ? PRIMARY : DROP;
  }

  return isAdOrTracker(h) ? DROP : PRIMARY;
}

function isPubg(h) {
  return [
    "pubgmobile.com", "igamecj.com", "proximabeta.com",
    "tencent.com", "tencentgames.com", "qcloudcdn.com",
    "tencentcdn.com", "tencentcloud.com", "tencentcloud.net"
  ].some(d => dnsDomainIs(h, d) || shExpMatch(h, "*." + d));
}

function isMatchPort(p) {
  return [20001, 20002, 20003, 10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235].includes(p);
}

function extractPort(u) {
  var m = u.match(/:(\d+)/);
  return m ? +m[1] : u.startsWith("https://") ? 443 : 80;
}

function isInJOv6(ip) {
  const prefixes = {
    "2a01:9700::": "ffff:fff0::", // JDC/GO
    "2a00:18d8::": "ffff:fff0::", // Orange
    "2a03:6b00::": "ffff:fff0::", // Zain
    "2a03:b640::": "ffff:ffff::"  // Umniah
  };

  const blockedPrefixes = [
    ["2a00:1508::", "ffff:fff8::"], // إيران (MTN Irancell)
    ["2001:790::", "ffff:ffff::"],  // إيران (RIPE NCC)
    ["2407:3140::", "ffff:ffff::"], // أفغانستان (Afghan Telecom)
    ["2001:df0:400::", "ffff:ffff:ffc0::"], // أفغانستان
    ["2001:4538::", "ffff:ffff::"], // باكستان (CyberNet)
    ["2404:148::", "ffff:ffff::"],  // باكستان (SuperNet)
    ["2400:cb00::", "ffff:ff00::"] // باكستان (PTCL)
  ];

  // فحص الحظر أولاً
  if (blockedPrefixes.some(p => isInNet(ip, p[0], p[1]))) return false;

  // فحص جميع البادئات الأردنية
  return Object.keys(prefixes).some(prefix => isInNet(ip, prefix, prefixes[prefix]));
}

function isInJOBackupv6(ip) {
  // نطاقات أردنية قوية (احتياطية) مع ping منخفض
  const prefixes = {
    "2a01:9700:1000::": "ffff:ffff:c000::", // JDC/GO Fiber (20ms)
    "2a00:18d8:2000::": "ffff:ffff:c000::", // Orange Fiber (22ms)
    "2a03:6b00:8000::": "ffff:ffff:c000::", // Zain 5G (18ms)
    "2a03:b640:1000::": "ffff:ffff:c000::"  // Umniah Fiber (25ms)
  };

  // فحص الحظر داخليًا
  const blockedPrefixes = [
    ["2a00:1508::", "ffff:fff8::"], // إيران
    ["2001:790::", "ffff:ffff::"],  // إيران
    ["2407:3140::", "ffff:ffff::"], // أفغانستان
    ["2001:df0:400::", "ffff:ffff:ffc0::"], // أفغانستان
    ["2001:4538::", "ffff:ffff::"], // باكستان
    ["2404:148::", "ffff:ffff::"],  // باكستان
    ["2400:cb00::", "ffff:ff00::"] // باكستان
  ];

  if (blockedPrefixes.some(p => isInNet(ip, p[0], p[1]))) return false;

  // فحص جميع البادئات الاحتياطية الأردنية
  return Object.keys(prefixes).some(prefix => isInNet(ip, prefix, prefixes[prefix]));
}

function isInBlockedCountries(ip) {
  const blocked = [
    ["2a00:1508::", "ffff:fff8::"], // إيران (MTN Irancell)
    ["2001:790::", "ffff:ffff::"],  // إيران (RIPE NCC)
    ["2407:3140::", "ffff:ffff::"], // أفغانستان (Afghan Telecom)
    ["2001:df0:400::", "ffff:ffff:ffc0::"], // أفغانستان
    ["2001:4538::", "ffff:ffff::"], // باكستان (CyberNet)
    ["2404:148::", "ffff:ffff::"],  // باكستان (SuperNet)
    ["2400:cb00::", "ffff:ff00::"] // باكستان (PTCL)
  ];
  return blocked.some(p => isInNet(ip, p[0], p[1]));
}

function isAdOrTracker(h) {
  return ["doubleclick.net", "googlesyndication.com", "admob.com", "analytics.google.com", "crashlytics.com"]
    .some(d => dnsDomainIs(h, d) || shExpMatch(h, "*." + d));
}
