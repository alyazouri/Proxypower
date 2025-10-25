function FindProxyForURL(url, host) {

  // ---------- CONFIG ----------
  var PROXY_JO    = "PROXY 91.106.109.12:1080"; // بروكسي أردني تبعك
  var BLOCK_FAKE  = "PROXY 0.0.0.0:0";          // بروكسي ميت = منع الاتصال
  var DIRECT      = "DIRECT";

  // بورتات PUBG الحساسة
  var PORTS = {
    LOBBY:          [443, 8080, 8443],
    MATCH:          [20001, 20002, 20003],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    UPDATES:        [80, 443, 8080, 8443]
  };

  // دومينات لازم تبقى DIRECT وما تتأثر (عشان حياتك العادية ما تتخرب)
  var DIRECT_DOMAINS = [
    ".youtube.com", ".googlevideo.com", ".ytimg.com", ".yt3.ggpht.com", ".ytimg.l.google.com",
    ".shahid.net", ".shahid.mbc.net", ".mbc.net",
    ".whatsapp.com", ".whatsapp.net", ".cdn.whatsapp.net",
    ".snapchat.com", ".sc-cdn.net", ".snapkit.com"
  ];

  // IPv4 ranges أردنية (من-إلى)
  var JO_IP_RANGES = [
    // Orange
    ["212.34.0.0","212.34.31.255"],
    ["213.139.32.0","213.139.63.255"],
    ["37.202.64.0","37.202.127.255"],
    ["46.185.128.0","46.185.255.255"],
    ["94.249.84.0","94.249.87.255"],

    // Zain
    ["176.29.0.0","176.29.255.255"],
    ["176.28.128.0","176.28.255.255"],
    ["46.32.96.0","46.32.127.255"],
    ["94.142.32.0","94.142.63.255"],
    ["188.247.64.0","188.247.95.255"],
    ["77.245.0.0","77.245.15.255"],
    ["80.90.160.0","80.90.175.255"],

    // Umniah
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
    "2a01:9700:", // JDC / GO
    "2a00:18d8:", // Orange Jordan
    "2a03:6b00:", // Zain Jordan
    "2a03:b640:"  // Umniah / Orbitel
  ];

  // ---------- helpers ----------

  // هل host من خدمات لازم تبقى DIRECT دايمًا؟
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

  // استخرج البورت من الرابط:
  // - http://1.2.3.4:8080/... -> 8080
  // - https://abc.com/...     -> 443
  // - http://abc.com/...      -> 80
  function extractPort(u) {
    var m = u.match(/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\/\[?[^\/\]]+\]?:(\d+)/);
    if (m && m[1]) {
      return parseInt(m[1], 10);
    }
    if (u.indexOf("https://") === 0) return 443;
    if (u.indexOf("http://")  === 0) return 80;
    return -1;
  }

  // هل البورت تبع ببجي؟
  function isPubgPort(p) {
    if (p < 0) return false;
    var keys = ["LOBBY","MATCH","RECRUIT_SEARCH","UPDATES"];
    for (var i = 0; i < keys.length; i++) {
      var arr = PORTS[keys[i]];
      for (var j = 0; j < arr.length; j++) {
        if (p === arr[j]) {
          return true;
        }
      }
    }
    return false;
  }

  // حول IPv4 لنمبر 32بت علشان نقارن رينجات
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

  // IPv4 داخل الأردن؟
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

  // IPv6 أردني؟
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

  // حدد IPv6 لو موجود (يا إما host IPv6 literal، أو داخل ال URL بين [])
  function pickIPv6(url, host) {
    if (host.indexOf(":") !== -1 && host.indexOf(".") === -1) {
      return host;
    }
    var m6 = url.match(/\[([0-9a-fA-F:]+)\]/);
    if (m6 && m6[1]) {
      return m6[1];
    }
    return null;
  }

  // ---------- decision flow ----------

  // (0) خدمات زي يوتيوب/واتساب/شاهد/سناب دايمًا DIRECT وما إلها علاقة بالقفل
  if (hostMatches(DIRECT_DOMAINS, host)) {
    return DIRECT;
  }

  // (1) شوف البورت وحدد إذا هذا ترافيك PUBG (LOBBY/MATCH/...)
  var port = extractPort(url);
  var pubgTraffic = isPubgPort(port);

  // (2) حدد إذا السيرفر أردني ولا لا
  var ip4 = dnsResolve(host); // عادة يرجع IPv4 فقط
  var isJOv4 = (ip4 && isIpv4InJordan(ip4));

  var ipv6Candidate = pickIPv6(url, host);
  var isJOv6 = (ipv6Candidate && isIpv6InJordan(ipv6Candidate));

  // ------------ منطق PUBG (القفل القاسي) ------------
  if (pubgTraffic) {
    // سيرفر أردني حقيقي؟ -> اسمح واتركه يمر عبر بروكسي الأردن
    if (isJOv4 || isJOv6) {
      return PROXY_JO;
    }
    // مش سيرفر أردني؟ -> اقفله بالقوة
    // يعني ما في DIRECT fallback، ما في محاولة عادية
    // اللعبة بتضل تحاول ومش تدخل ماتش خارجي
    return BLOCK_FAKE;
  }

  // ------------ باقي الترافيك (مش PUBG) ------------
  // ما بدنا نكسر الانترنت كله. خليه شغّال طبيعي.
  return DIRECT;
}
