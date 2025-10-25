function FindProxyForURL(url, host) {

  // -------- CONFIG --------
  var PROXY_JO   = "PROXY 91.106.109.12:1080"; // بروكسي الأردن
  var BLOCK_FAKE = "PROXY 0.0.0.0:0";          // منع الاتصال (يحجزك لو السيرفر مش أردني)
  var DIRECT     = "DIRECT";

  // بورتات ببجي بحسب المرحلة
  var PORTS = {
    LOBBY:          [443, 8080, 8443],
    TEAM:           [8013, 9000, 10000],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    MATCH:          [20001, 20002, 20003],
    UPDATES:        [80, 443, 8080, 8443]
  };

  // دومينات ما بدنا نقفلها ولا نلعب فيها
  var DIRECT_DOMAINS = [
    ".youtube.com", ".googlevideo.com", ".ytimg.com", ".yt3.ggpht.com", ".ytimg.l.google.com",
    ".shahid.net", ".shahid.mbc.net", ".mbc.net",
    ".whatsapp.com", ".whatsapp.net", ".cdn.whatsapp.net",
    ".snapchat.com", ".sc-cdn.net", ".snapkit.com"
  ];

  // نطاقات IPv4 الأردنية (أردن فايبر\ثابت) للمباراة نفسها
  var JO_IP_RANGES = [
    ["176.29.0.0","176.29.255.255"],
    ["46.32.96.0","46.32.127.255"],
    ["109.107.224.0","109.107.255.255"],
    ["212.34.0.0","212.34.31.255"],
    ["213.139.32.0","213.139.63.255"],
    ["92.241.32.0","92.241.63.255"],
    ["95.172.192.0","95.172.223.255"],
    ["46.248.192.0","46.248.223.255"],
    ["94.249.84.0","94.249.87.255"]
  ];

  // (مهم) IPv6 الأردني المسموح للّوبي/تجنيد/فريق فقط
  // مصغّر الآن على هوب أردني محدد (Orange الأردن)
  var JO_V6_PREFIXES = [
    "2a00:18d8:" // Orange Jordan tight prefix
  ];

  // -------- HELPERS --------

  function hostMatches(list, h) {
    if (!h) return false;
    h = h.toLowerCase();
    for (var i = 0; i < list.length; i++) {
      var suf = list[i].toLowerCase();
      if (h === suf.slice(1) || h.endsWith(suf)) return true;
    }
    return false;
  }

  function extractPort(u) {
    // http://IP:PORT/... أو https://host:PORT
    var m = u.match(/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\/\[?[^\/\]]+\]?:(\d+)/);
    if (m && m[1]) return parseInt(m[1], 10);
    if (u.indexOf("https://") === 0) return 443;
    if (u.indexOf("http://")  === 0) return 80;
    return -1;
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
      if (n >= start && n <= end) return true;
    }
    return false;
  }

  function isIpv6InJordan(ip6) {
    if (!ip6) return false;
    var x = ip6.toLowerCase();
    // لو شكل [2a00:18d8:...]
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

  function pickIPv6(url, host) {
    // host IPv6 literal؟ (يحتوي ":" ومافيه ".")
    if (host.indexOf(":") !== -1 && host.indexOf(".") === -1) {
      return host;
    }
    // IPv6 داخل [ ] بالرابط
    var m6 = url.match(/\[([0-9a-fA-F:]+)\]/);
    if (m6 && m6[1]) {
      return m6[1];
    }
    return null;
  }

  // -------- DECISION FLOW --------

  // 0. خدمات يومية = نحطها DIRECT وما ندخلها بالسياسة
  if (hostMatches(DIRECT_DOMAINS, host)) {
    return DIRECT;
  }

  // 1. جيب البورت -> نحدد نوع الحركة (لوبي/ماتش/الخ)
  var port = extractPort(url);

  // 2. هات IPv4 للسيرفر
  var ip4 = dnsResolve(host);

  // 3. هات IPv6 للسيرفر
  var ip6 = pickIPv6(url, host);

  var isJOv4 = (ip4 && isIpv4InJordan(ip4));
  var isJOv6 = (ip6 && isIpv6InJordan(ip6));

  // ---------- LOBBY / TEAM / RECRUIT ----------
  // هون الشرط لازم يمرّ على IPv6 أردني فقط
  if (
    PORTS.LOBBY.indexOf(port) !== -1 ||
    PORTS.TEAM.indexOf(port) !== -1 ||
    PORTS.RECRUIT_SEARCH.indexOf(port) !== -1
  ) {
    if (isJOv6) {
      // مسموح: لوبي/تيم/تجنيد أردني فعلي
      return PROXY_JO;
    } else {
      // بلوك: ما بدنا لوبي/تيم/تجنيد لو السيرفر مش أردني IPv6
      return BLOCK_FAKE;
    }
  }

  // ---------- MATCH ----------
  // هون الشرط لازم يمرّ على IPv4 أردني فقط
  if (PORTS.MATCH.indexOf(port) !== -1) {
    if (isJOv4) {
      // أوكي السيرفر أردني بالمباراة الفعلية
      return PROXY_JO;
    } else {
      // ممنوع تدخل قيم برّا الأردن
      return BLOCK_FAKE;
    }
  }

  // ---------- UPDATES / أي شيء ثاني ----------
  return DIRECT;
}
