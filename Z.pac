function FindProxyForURL(url, host) {
  host = host.toLowerCase();
  var PROXY_HOST = "91.106.109.12";
  var PORTS = {
    LOBBY:   [443, 8443],
    MATCH:   [20001, 20003],
    RECRUIT: [10012, 10013],
    UPDATES: [80, 443, 8443],
    CDN:     [80, 443]
  };
  /* نفس النطاقات كما في الكود الأصلي؛ تم ترميزها إلى أعداد صحيحة. */
  var JO_RANGES = [
    [ipToInt("176.97.0.0"), ipToInt("176.99.255.255")],
    [ipToInt("176.47.0.0"), ipToInt("176.52.255.255")],
    [ipToInt("176.16.0.0"), ipToInt("176.23.255.255")],
    [ipToInt("94.64.0.0"),  ipToInt("94.72.255.255")],
    [ipToInt("91.176.0.0"), ipToInt("91.184.255.255")],
    [ipToInt("94.104.0.0"), ipToInt("94.111.255.255")],
    [ipToInt("109.128.0.0"), ipToInt("109.132.255.255")],
    [ipToInt("176.40.0.0"), ipToInt("176.43.255.255")],
    [ipToInt("217.96.0.1"), ipToInt("217.99.255.255")],
    [ipToInt("94.56.0.0"),  ipToInt("94.59.255.255")],
    [ipToInt("91.93.0.0"),  ipToInt("91.95.255.255")],
    [ipToInt("91.109.0.0"), ipToInt("91.111.255.255")],
    [ipToInt("91.191.0.0"), ipToInt("91.193.255.255")],
    [ipToInt("217.20.0.1"), ipToInt("217.22.255.255")],
    [ipToInt("217.52.0.1"), ipToInt("217.54.255.255")],
    [ipToInt("217.136.0.1"), ipToInt("217.138.255.255")],
    [ipToInt("217.142.0.1"), ipToInt("217.144.255.255")],
    [ipToInt("217.163.0.1"), ipToInt("217.165.255.255")],
    [ipToInt("109.82.0.0"), ipToInt("109.83.255.255")],
    [ipToInt("91.86.0.0"), ipToInt("91.87.255.255")],
    [ipToInt("91.132.0.0"), ipToInt("91.133.255.255")],
    [ipToInt("91.198.0.0"), ipToInt("91.199.255.255")],
    [ipToInt("91.227.0.0"), ipToInt("91.228.255.255")],
    [ipToInt("91.230.0.0"), ipToInt("91.231.255.255")],
    [ipToInt("91.244.0.0"), ipToInt("91.245.255.255")],
    [ipToInt("176.12.0.0"), ipToInt("176.13.255.255")],
    [ipToInt("176.54.0.0"), ipToInt("176.55.255.255")],
    [ipToInt("217.12.0.1"), ipToInt("217.13.255.255")],
    [ipToInt("217.30.0.1"), ipToInt("217.31.255.255")],
    [ipToInt("217.72.0.1"), ipToInt("217.73.255.255")],
    [ipToInt("217.156.0.1"), ipToInt("217.157.255.255")],
    [ipToInt("94.50.0.0"),  ipToInt("94.51.255.255")],
    [ipToInt("94.128.0.0"), ipToInt("94.129.255.255")],
    [ipToInt("94.134.0.0"), ipToInt("94.135.255.255")],
    [ipToInt("91.84.0.0"),  ipToInt("91.84.255.255")],
    [ipToInt("91.104.0.0"), ipToInt("91.104.255.255")],
    [ipToInt("91.107.0.0"), ipToInt("91.107.255.255")],
    [ipToInt("91.120.0.0"), ipToInt("91.120.255.255")],
    [ipToInt("91.122.0.0"), ipToInt("91.122.255.255")],
    [ipToInt("91.126.0.0"), ipToInt("91.126.255.255")],
    [ipToInt("91.135.0.0"), ipToInt("91.135.255.255")],
    [ipToInt("91.143.0.0"), ipToInt("91.143.255.255")],
    [ipToInt("91.147.0.0"), ipToInt("91.147.255.255")],
    [ipToInt("91.149.0.0"), ipToInt("91.149.255.255")],
    [ipToInt("91.186.0.0"), ipToInt("91.186.255.255")],
    [ipToInt("91.189.0.0"), ipToInt("91.189.255.255")],
    [ipToInt("91.204.0.0"), ipToInt("91.204.255.255")],
    [ipToInt("91.206.0.0"), ipToInt("91.206.255.255")],
    [ipToInt("91.209.0.0"), ipToInt("91.209.255.255")],
    [ipToInt("91.225.0.0"), ipToInt("91.225.255.255")],
    [ipToInt("91.235.0.0"), ipToInt("91.235.255.255")],
    [ipToInt("91.238.0.0"), ipToInt("91.238.255.255")],
    [ipToInt("91.252.0.0"), ipToInt("91.252.255.255")],
    [ipToInt("109.86.0.0"), ipToInt("109.86.255.255")],
    [ipToInt("109.104.0.0"), ipToInt("109.104.255.255")],
    [ipToInt("109.125.0.0"), ipToInt("109.125.255.255")],
    [ipToInt("176.8.0.0"),  ipToInt("176.8.255.255")],
    [ipToInt("176.33.0.0"), ipToInt("176.33.255.255")],
    [ipToInt("176.58.0.0"), ipToInt("176.58.255.255")],
    [ipToInt("176.65.0.0"), ipToInt("176.65.255.255")],
    [ipToInt("176.67.0.0"), ipToInt("176.67.255.255")],
    [ipToInt("176.72.0.0"), ipToInt("176.72.255.255")],
    [ipToInt("176.81.0.0"), ipToInt("176.81.255.255")],
    [ipToInt("176.88.0.0"), ipToInt("176.88.255.255")],
    [ipToInt("176.93.0.0"), ipToInt("176.93.255.255")],
    [ipToInt("176.115.0.0"), ipToInt("176.115.255.255")],
    [ipToInt("217.8.0.1"), ipToInt("217.8.255.255")],
    [ipToInt("217.18.0.1"), ipToInt("217.18.255.255")],
    [ipToInt("217.27.0.1"), ipToInt("217.27.255.255")],
    [ipToInt("217.61.0.1"), ipToInt("217.61.255.255")],
    [ipToInt("217.64.0.1"), ipToInt("217.64.255.255")],
    [ipToInt("217.70.0.1"), ipToInt("217.70.255.255")],
    [ipToInt("217.79.0.1"), ipToInt("217.79.255.255")],
    [ipToInt("217.119.0.1"), ipToInt("217.119.255.255")],
    [ipToInt("217.129.0.1"), ipToInt("217.129.255.255")],
    [ipToInt("217.132.0.1"), ipToInt("217.132.255.255")],
    [ipToInt("217.147.0.1"), ipToInt("217.147.255.255")],
    [ipToInt("217.154.0.1"), ipToInt("217.154.255.255")],
    [ipToInt("217.160.0.1"), ipToInt("217.160.255.255")],
    [ipToInt("217.168.0.1"), ipToInt("217.168.255.255")],
    [ipToInt("217.170.0.1"), ipToInt("217.170.255.255")],
    [ipToInt("217.175.0.1"), ipToInt("217.175.255.255")],
    [ipToInt("217.178.0.1"), ipToInt("217.178.255.255")],
    [ipToInt("94.16.0.0"), ipToInt("94.16.255.255")],
    [ipToInt("94.20.0.0"), ipToInt("94.20.255.255")],
    [ipToInt("94.25.0.0"), ipToInt("94.25.255.255")],
    [ipToInt("94.27.0.0"), ipToInt("94.27.255.255")],
    [ipToInt("94.77.0.0"), ipToInt("94.77.255.255")],
    [ipToInt("94.102.0.0"), ipToInt("94.102.255.255")],
    [ipToInt("94.119.0.0"), ipToInt("94.119.255.255")]
  ];
  // دالة تعيين IP أردني
  function ipInJordan(ip) {
    if (!ip) return false;
    var n = ipToInt(ip);
    for (var i = 0; i < JO_RANGES.length; i++) {
      var r = JO_RANGES[i];
      if (n < r[0]) break;
      if (n >= r[0] && n <= r[1]) return true;
    }
    return false;
  }
  function ipToInt(ip) {
    var p = ip.split(".");
    return ((p[0] & 0xFF) << 24) + ((p[1] & 0xFF) << 16) + ((p[2] & 0xFF) << 8) + (p[3] & 0xFF);
  }
  // دالة بسيطة لإرجاع المنفذ الأول لكل فئة؛ هذا يلغي العشوائية.
  function proxyFor(cat) {
    var port = PORTS[cat][0];
    return "PROXY " + PROXY_HOST + ":" + port;
  }
  var CATEGORIES = {
    LOBBY: {
      domains: ["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com"],
      urls:    ["*/account/login*", "*/client/version*", "*/status/heartbeat*", "*/presence/*", "*/friends/*"]
    },
    MATCH: {
      domains: ["*.gcloud.qq.com", "gpubgm.com"],
      urls:    ["*/matchmaking/*", "*/mms/*", "*/game/start*", "*/game/join*", "*/report/battle*"]
    },
    RECRUIT: {
      domains: ["match.igamecj.com", "match.proximabeta.com", "teamfinder.igamecj.com", "teamfinder.proximabeta.com"],
      urls:    ["*/teamfinder/*", "*/clan/*", "*/social/*", "*/search/*", "*/recruit/*"]
    },
    UPDATES: {
      domains: ["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com", "hotfix.proximabeta.com", "dlied1.qq.com", "dlied2.qq.com", "gpubgm.com"],
      urls:    ["*/patch*", "*/hotfix*", "*/update*", "*/download*", "*/assets/*", "*/assetbundle*", "*/obb*"]
    },
    CDN: {
      domains: ["cdn.igamecj.com", "cdn.proximabeta.com", "cdn.tencentgames.com", "*.qcloudcdn.com", "*.cloudfront.net", "*.edgesuite.net"],
      urls:    ["*/cdn/*", "*/static/*", "*/image/*", "*/media/*", "*/video/*", "*/res/*", "*/pkg/*"]
    }
  };
  // ننفذ قواعدنا: نحظر أي وجهة خارج الأردن.
  for (var cat in CATEGORIES) {
    var defs = CATEGORIES[cat];
    for (var i = 0; i < defs.urls.length; i++) {
      if (shExpMatch(url, defs.urls[i])) {
        var ip = dnsResolve(host);
        if (!ipInJordan(ip)) return "DIRECT";
        return proxyFor(cat);
      }
    }
    for (var i = 0; i < defs.domains.length; i++) {
      if (shExpMatch(host, defs.domains[i])) {
        var ip = dnsResolve(host);
        if (!ipInJordan(ip)) return "DIRECT";
        return proxyFor(cat);
      }
    }
  }
  var dst = /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : dnsResolve(host);
  if (dst && ipInJordan(dst)) {
    return proxyFor("LOBBY");
  }
  return "DIRECT";
}
