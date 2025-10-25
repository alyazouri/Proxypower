function FindProxyForURL(url, host) {

  // -------- CONFIG --------
  var PROXY_JO   = "PROXY 91.106.109.12:1080"; // بروكسي أردني
  var BLOCK_FAKE = "PROXY 0.0.0.0:0";          // يوقف الاتصال (قفل أجنبي)
  var DIRECT     = "DIRECT";

  // بورتات / رينجات ببجي
  // ملاحظة: ضفنا رينج 20000-21000 عشان السيرفرات match أحياناً تستخدم بورت ثاني قريب
  var FIXED_PORTS = {
    LOBBY:          [443, 8080, 8443],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    UPDATES:        [80, 443, 8080, 8443]
  };

  // إذا البورت بين 20000 و 21000 نعتبره MATCH حتى لو مش بالقائمة
  function isMatchLikePort(p) {
    return (p >= 20000 && p <= 21000);
  }

  // دومينات دايماً DIRECT (عشان حياتك اليومية)
  var DIRECT_DOMAINS = [
    ".youtube.com", ".googlevideo.com", ".ytimg.com", ".yt3.ggpht.com", ".ytimg.l.google.com",
    ".shahid.net", ".shahid.mbc.net", ".mbc.net",
    ".whatsapp.com", ".whatsapp.net", ".cdn.whatsapp.net",
    ".snapchat.com", ".sc-cdn.net", ".snapkit.com"
  ];

  // IPv4 ranges أردنية
  var JO_IP_RANGES = [
    ["212.34.0.0","212.34.31.255"],
    ["213.139.32.0","213.139.63.255"],
    ["37.202.64.0","37.202.127.255"],
    ["46.185.128.0","46.185.255.255"],
    ["94.249.84.0","94.249.87.255"],
    ["176.29.0.0","176.29.255.255"],
    ["176.28.128.0","176.28.255.255"],
    ["46.32.96.0","46.32.127.255"],
    ["94.142.32.0","94.142.63.255"],
    ["188.247.64.0","188.247.95.255"],
    ["77.245.0.0","77.245.15.255"],
    ["80.90.160.0","80.90.175.255"],
    ["46.248.192.0","46.248.223.255"],
    ["95.172.192.0","95.172.223.255"],
    ["109.107.224.0","109.107.255.255"],
    ["92.241.32.0","92.241.63.255"],
    ["212.35.64.0","212.35.79.255"],
    ["212.35.80.0","212.35.95.255"],
    ["212.118.0.0","212.118.15.255"],
    ["5.45.128.0","5.45.143.255"]
  ];

  // IPv6 prefixes أردنية
  var JO_V6_PREFIXES = [
    "2a01:9700:",
    "2a00:18d8:",
    "2a03:6b00:",
    "2a03:b640:"
  ];

  // -------- helpers --------

  function hostMatches(list, h) {
    if (!h) return false;
    h = h.toLowerCase();
    for (var i = 0; i < list.length; i++) {
      var suf = list[i].toLowerCase();
      if (h === suf.slice(1) || h.endsWith(suf)) {
        return true;
      }
    }
    return false;
  }

  function extractPort(u) {
    var m = u.match(/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\/\[?[^\/\]]+\]?:(\d+)/);
    if (m && m[1]) return parseInt(m[1], 10);
    if (u.indexOf("https://") === 0) return 443;
    if (u.indexOf("http://")  === 0) return 80;
    return -1;
  }

  function isInFixedPubgPorts(p) {
    if (p < 0) return false;
    // لستات ثابتة: LOBBY / RECRUIT / UPDATES
    var groups = ["LOBBY","RECRUIT_SEARCH","UPDATES"];
    for (var g = 0; g < groups.length; g++) {
      var arr = FIXED_PORTS[groups[g]];
      for (var j = 0; j < arr.length; j++) {
        if (p === arr[j]) return true;
      }
    }
    // match-like dynamic range
    if (isMatchLikePort(p)) return true;
    return false;
  }

  function ipv4ToLong(ip) {
    var p = ip.split(".");
    if (p.length !== 4) return null;
    var a = parseInt(p[0],10),
        b = parseInt(p[1],10),
        c = parseInt(p[2],10),
        d = parseInt(p[3],10);
    if (isNaN(a)||isNaN(b)||isNaN(c)||isNaN(d)) return null;
    return ((a << 24) >>> 0) +
           ((b << 16) >>> 0) +
           ((c <<  8) >>> 0) +
            (d >>> 0);
  }

  function isIpv4InJordan(ip) {
    var n = ipv4ToLong(ip);
    if (n === null) return false;
    for (var i=0; i<JO_IP_RANGES.length; i++) {
      var start = ipv4ToLong(JO_IP_RANGES[i][0]);
      var end   = ipv4ToLong(JO_IP_RANGES[i][1]);
      if (start !== null && end !== null && n >= start && n <= end) {
        return true;
      }
    }
    return false;
  }

  function isIpv6InJordan(ip6) {
    if (!ip6) return false;
    var x = ip6.toLowerCase();
    if (x[0] === "[") {
      x = x.replace(/^\[/, "").replace(/\]$/, "");
    }
    for (var i=0; i<JO_V6_PREFIXES.length; i++) {
      if (x.indexOf(JO_V6_PREFIXES[i]) === 0) {
        return true;
      }
    }
    return false;
  }

  // إذا host أصلاً IPv4 جاهز (زي "176.29.10.5") نقدر نفحصه مباشرة بدون dnsResolve
  function parseIfLiteralIPv4(h) {
    // quick check: أربع أجزاء أرقام مفصولة بنقطة
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
      return h;
    }
    return null;
  }

  // رجّع IPv6 من host أو [IPv6] داخل url
  function pickIPv6(url, host) {
    if (host.indexOf(":") !== -1 && host.indexOf(".") === -1) {
      return host;
    }
    var m6 = url.match(/\[([0-9a-fA-F:]+)\]/);
    if (m6 && m6[1]) return m6[1];
    return null;
  }

  // -------- decision flow --------

  // 0) خدمات دايمًا DIRECT
  if (hostMatches(DIRECT_DOMAINS, host)) {
    return DIRECT;
  }

  // 1) حدّد البورت، وحدد هل هو ترافيك ببجي
  var port     = extractPort(url);
  var isPUBG   = isInFixedPubgPorts(port);

  // 2) جيب IPv4:
  //   - جرّب dnsResolve(host)
  //   - لو فاضية، لكن host نفسه شكل IPv4، استخدمه
  var ip4 = dnsResolve(host);
  if (!ip4) {
    var lit4 = parseIfLiteralIPv4(host);
    if (lit4) {
      ip4 = lit4;
    }
  }
  var isJOv4 = (ip4 && isIpv4InJordan(ip4));

  // 3) جيب IPv6
  var ip6 = pickIPv6(url, host);
  var isJOv6 = (ip6 && isIpv6InJordan(ip6));

  // ------------ قفل ببجي -------------
  // لو هذا ترافيك PUBG (حسب البورت):
  if (isPUBG) {
    // إذا السيرفر أردني → اسمح والعب من خلال بروكسي الأردن
    if (isJOv4 || isJOv6) {
      return PROXY_JO;
    }
    // إذا السيرفر مش أردني → اقفل (بروكسي ميت)
    return BLOCK_FAKE;
  }

  // ------------ الترافيك العادي -------------
  // مش PUBG => ما نتدخل. خليه يعيش طبيعي
  return DIRECT;
}
