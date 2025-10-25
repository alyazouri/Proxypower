function FindProxyForURL(url, host) {

  // -------- CONFIG --------
  var PROXY_JO   = "PROXY 91.106.109.12:1080"; // البروكسي الأردني الرئيسي
  var BLOCK_FAKE = "PROXY 0.0.0.0:0";          // منع الاتصال (سيرفر أجنبي)
  var DIRECT     = "DIRECT";

  // بورتات ببجي حسب الوظيفة
  var PORTS = {
    LOBBY:          [443, 8080, 8443],
    TEAM:           [8013, 9000, 10000],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    MATCH:          [20001, 20002, 20003],
    UPDATES:        [80, 443, 8080, 8443]
  };

  // دومينات تبقى DIRECT (مش من ضمن القفل)
  var DIRECT_DOMAINS = [
    ".youtube.com", ".googlevideo.com", ".ytimg.com", ".yt3.ggpht.com", ".ytimg.l.google.com",
    ".shahid.net", ".shahid.mbc.net", ".mbc.net",
    ".whatsapp.com", ".whatsapp.net", ".cdn.whatsapp.net",
    ".snapchat.com", ".sc-cdn.net", ".snapkit.com"
  ];

  // IPv4 ranges الأردنية (للمباريات)
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

  // IPv6 prefixes الأردنية (لللوبي، التجنيد، الفريق)
  var JO_V6_PREFIXES = [
    "2a01:9700:", // JDC / GO
    "2a00:18d8:", // Orange Jordan
    "2a03:6b00:", // Zain Jordan
    "2a03:b640:"  // Umniah / Orbitel
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
    return ((a << 24) >>> 0) + ((b << 16) >>> 0) + ((c << 8) >>> 0) + (d >>> 0);
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
    if (x[0] === "[") x = x.slice(1, -1);
    for (var i=0; i<JO_V6_PREFIXES.length; i++) {
      if (x.indexOf(JO_V6_PREFIXES[i]) === 0) return true;
    }
    return false;
  }

  function pickIPv6(url, host) {
    if (host.indexOf(":") !== -1 && host.indexOf(".") === -1) return host;
    var m6 = url.match(/\[([0-9a-fA-F:]+)\]/);
    return (m6 && m6[1]) ? m6[1] : null;
  }

  // -------- MAIN LOGIC --------
  if (hostMatches(DIRECT_DOMAINS, host)) return DIRECT;

  var port = extractPort(url);
  var ip4 = dnsResolve(host);
  var ipv6 = pickIPv6(url, host);

  var isJOv4 = ip4 && isIpv4InJordan(ip4);
  var isJOv6 = ipv6 && isIpv6InJordan(ipv6);

  // LOBBY / TEAM / RECRUIT (IPv6 required)
  if (
    PORTS.LOBBY.indexOf(port) !== -1 ||
    PORTS.TEAM.indexOf(port) !== -1 ||
    PORTS.RECRUIT_SEARCH.indexOf(port) !== -1
  ) {
    if (isJOv6) return PROXY_JO;
    return BLOCK_FAKE;
  }

  // MATCH (IPv4 required)
  if (PORTS.MATCH.indexOf(port) !== -1) {
    if (isJOv4) return PROXY_JO;
    return BLOCK_FAKE;
  }

  // UPDATES أو أي شيء آخر → نتركه مباشر
  return DIRECT;
}
