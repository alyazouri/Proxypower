function FindProxyForURL(url, host) {
  var PROXY_HOST = "91.106.109.12";

  var PORTS = {
    LOBBY          : [443, 8080, 8443],
    MATCH          : [20001, 20002, 20003],
    RECRUIT_SEARCH : [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    UPDATES        : [80, 443, 8443, 8080],
    CDNs           : [80, 8080, 443]
  };

  var PORT_WEIGHTS_BASE = {
    LOBBY          : [5, 3, 2],
    MATCH          : [4, 2, 1],
    RECRUIT_SEARCH : [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
    UPDATES        : [5, 3, 2, 1],
    CDNs           : [3, 2, 2]
  };

  // نطاقات الأردن فقط (منقّحة)
  var JO_IP_RANGES = [
    [ipToInt("37.202.64.0"),  ipToInt("37.202.71.255")],
    [ipToInt("37.202.72.0"),  ipToInt("37.202.79.255")],
    [ipToInt("37.202.80.0"),  ipToInt("37.202.87.255")],
    [ipToInt("37.202.88.0"),  ipToInt("37.202.95.255")],
    [ipToInt("37.202.96.0"),  ipToInt("37.202.103.255")],
    [ipToInt("37.202.104.0"), ipToInt("37.202.111.255")],
    [ipToInt("37.202.112.0"), ipToInt("37.202.119.255")],
    [ipToInt("37.202.120.0"), ipToInt("37.202.127.255")],

    [ipToInt("37.220.112.0"), ipToInt("37.220.119.255")],
    [ipToInt("37.220.120.0"), ipToInt("37.220.127.255")],

    [ipToInt("46.23.112.0"),  ipToInt("46.23.119.255")],
    [ipToInt("46.23.120.0"),  ipToInt("46.23.127.255")],

    [ipToInt("46.32.96.0"),   ipToInt("46.32.127.255")],  // مدمجة

    [ipToInt("46.185.128.0"), ipToInt("46.185.135.255")],
    [ipToInt("46.185.136.0"), ipToInt("46.185.143.255")],
    [ipToInt("46.185.144.0"), ipToInt("46.185.151.255")],
    [ipToInt("46.185.152.0"), ipToInt("46.185.159.255")],
    [ipToInt("46.185.160.0"), ipToInt("46.185.167.255")],
    [ipToInt("46.185.168.0"), ipToInt("46.185.175.255")],
    [ipToInt("46.185.176.0"), ipToInt("46.185.183.255")],
    [ipToInt("46.185.184.0"), ipToInt("46.185.191.255")],
    [ipToInt("46.185.192.0"), ipToInt("46.185.199.255")],
    [ipToInt("46.185.200.0"), ipToInt("46.185.207.255")],
    [ipToInt("46.185.208.0"), ipToInt("46.185.215.255")],
    [ipToInt("46.185.216.0"), ipToInt("46.185.223.255")],
    [ipToInt("46.185.224.0"), ipToInt("46.185.231.255")],
    [ipToInt("46.185.232.0"), ipToInt("46.185.239.255")],
    [ipToInt("46.185.240.0"), ipToInt("46.185.247.255")],
    [ipToInt("46.185.248.0"), ipToInt("46.185.255.255")],

    [ipToInt("46.248.192.0"), ipToInt("46.248.199.255")],
    [ipToInt("46.248.200.0"), ipToInt("46.248.207.255")],
    [ipToInt("46.248.208.0"), ipToInt("46.248.215.255")],
    [ipToInt("46.248.216.0"), ipToInt("46.248.223.255")],

    [ipToInt("79.173.192.0"), ipToInt("79.173.199.255")],
    [ipToInt("79.173.200.0"), ipToInt("79.173.207.255")],
    [ipToInt("79.173.208.0"), ipToInt("79.173.215.255")],
    [ipToInt("79.173.216.0"), ipToInt("79.173.223.255")],
    [ipToInt("79.173.224.0"), ipToInt("79.173.231.255")],
    [ipToInt("79.173.232.0"), ipToInt("79.173.239.255")],
    [ipToInt("79.173.240.0"), ipToInt("79.173.247.255")],
    [ipToInt("79.173.248.0"), ipToInt("79.173.255.255")],

    [ipToInt("86.108.0.0"),   ipToInt("86.108.7.255")],
    [ipToInt("86.108.8.0"),   ipToInt("86.108.15.255")],
    [ipToInt("86.108.16.0"),  ipToInt("86.108.23.255")],
    [ipToInt("86.108.24.0"),  ipToInt("86.108.31.255")],
    [ipToInt("86.108.32.0"),  ipToInt("86.108.39.255")],
    [ipToInt("86.108.40.0"),  ipToInt("86.108.47.255")],
    [ipToInt("86.108.48.0"),  ipToInt("86.108.55.255")],
    [ipToInt("86.108.56.0"),  ipToInt("86.108.63.255")],
    [ipToInt("86.108.64.0"),  ipToInt("86.108.71.255")],
    [ipToInt("86.108.72.0"),  ipToInt("86.108.79.255")],
    [ipToInt("86.108.80.0"),  ipToInt("86.108.87.255")],
    [ipToInt("86.108.88.0"),  ipToInt("86.108.95.255")],
    [ipToInt("86.108.96.0"),  ipToInt("86.108.103.255")],
    [ipToInt("86.108.104.0"), ipToInt("86.108.111.255")],
    [ipToInt("86.108.112.0"), ipToInt("86.108.119.255")],
    [ipToInt("86.108.120.0"), ipToInt("86.108.127.255")],

    [ipToInt("91.106.96.0"),  ipToInt("91.106.103.255")],

    [ipToInt("91.186.224.0"), ipToInt("91.186.231.255")],
    [ipToInt("91.186.232.0"), ipToInt("91.186.239.255")],
    [ipToInt("91.186.240.0"), ipToInt("91.186.247.255")],
    [ipToInt("91.186.248.0"), ipToInt("91.186.255.255")],

    [ipToInt("92.241.32.0"),  ipToInt("92.241.39.255")],
    [ipToInt("92.241.40.0"),  ipToInt("92.241.47.255")],
    [ipToInt("92.241.48.0"),  ipToInt("92.241.55.255")],
    [ipToInt("92.241.56.0"),  ipToInt("92.241.63.255")],

    [ipToInt("95.172.192.0"), ipToInt("95.172.199.255")],
    [ipToInt("95.172.200.0"), ipToInt("95.172.207.255")],
    [ipToInt("95.172.208.0"), ipToInt("95.172.215.255")],
    [ipToInt("95.172.216.0"), ipToInt("95.172.223.255")],

    [ipToInt("109.107.224.0"), ipToInt("109.107.231.255")],
    [ipToInt("109.107.232.0"), ipToInt("109.107.239.255")],
    [ipToInt("109.107.240.0"), ipToInt("109.107.247.255")],
    [ipToInt("109.107.248.0"), ipToInt("109.107.255.255")],

    [ipToInt("185.140.0.0"),  ipToInt("185.140.7.255")],
    [ipToInt("185.140.8.0"),  ipToInt("185.140.15.255")],
    [ipToInt("185.140.16.0"), ipToInt("185.140.23.255")],
    [ipToInt("185.140.24.0"), ipToInt("185.140.31.255")],
    [ipToInt("185.140.32.0"), ipToInt("185.140.39.255")],
    [ipToInt("185.140.40.0"), ipToInt("185.140.47.255")],
    [ipToInt("185.140.48.0"), ipToInt("185.140.55.255")],
    [ipToInt("185.140.56.0"), ipToInt("185.140.63.255")],
    [ipToInt("185.140.64.0"), ipToInt("185.140.71.255")],
    [ipToInt("185.140.72.0"), ipToInt("185.140.79.255")],
    [ipToInt("185.140.80.0"), ipToInt("185.140.87.255")],
    [ipToInt("185.140.88.0"), ipToInt("185.140.95.255")],
    [ipToInt("185.140.96.0"), ipToInt("185.140.103.255")],
    [ipToInt("185.140.104.0"), ipToInt("185.140.111.255")],
    [ipToInt("185.140.112.0"), ipToInt("185.140.119.255")],
    [ipToInt("185.140.120.0"), ipToInt("185.140.127.255")],
    [ipToInt("185.140.128.0"), ipToInt("185.140.135.255")],
    [ipToInt("185.140.136.0"), ipToInt("185.140.143.255")],
    [ipToInt("185.140.144.0"), ipToInt("185.140.151.255")],
    [ipToInt("185.140.152.0"), ipToInt("185.140.159.255")],
    [ipToInt("185.140.160.0"), ipToInt("185.140.167.255")],
    [ipToInt("185.140.168.0"), ipToInt("185.140.175.255")],
    [ipToInt("185.140.176.0"), ipToInt("185.140.183.255")],
    [ipToInt("185.140.184.0"), ipToInt("185.140.191.255")],
    [ipToInt("185.140.192.0"), ipToInt("185.140.199.255")],
    [ipToInt("185.140.200.0"), ipToInt("185.140.207.255")],
    [ipToInt("185.140.208.0"), ipToInt("185.140.215.255")],
    [ipToInt("185.140.216.0"), ipToInt("185.140.223.255")],
    [ipToInt("185.140.224.0"), ipToInt("185.140.231.255")],
    [ipToInt("185.140.232.0"), ipToInt("185.140.239.255")],
    [ipToInt("185.140.240.0"), ipToInt("185.140.247.255")],
    [ipToInt("185.140.248.0"), ipToInt("185.140.255.255")],

    [ipToInt("188.247.64.0"), ipToInt("188.247.71.255")],
    [ipToInt("188.247.72.0"), ipToInt("188.247.79.255")],
    [ipToInt("188.247.80.0"), ipToInt("188.247.87.255")],
    [ipToInt("188.247.88.0"), ipToInt("188.247.95.255")],

    [ipToInt("212.34.96.0"),  ipToInt("212.34.103.255")],
    [ipToInt("212.34.104.0"), ipToInt("212.34.111.255")],
    [ipToInt("212.34.112.0"), ipToInt("212.34.119.255")],
    [ipToInt("212.34.120.0"), ipToInt("212.34.127.255")],

    [ipToInt("212.35.0.0"),   ipToInt("212.35.7.255")],
    [ipToInt("212.35.8.0"),   ipToInt("212.35.15.255")],
    [ipToInt("212.35.16.0"),  ipToInt("212.35.23.255")],
    [ipToInt("212.35.24.0"),  ipToInt("212.35.31.255")],
    [ipToInt("212.35.32.0"),  ipToInt("212.35.39.255")],
    [ipToInt("212.35.40.0"),  ipToInt("212.35.47.255")],
    [ipToInt("212.35.48.0"),  ipToInt("212.35.55.255")],
    [ipToInt("212.35.56.0"),  ipToInt("212.35.63.255")],
    [ipToInt("212.35.64.0"),  ipToInt("212.35.71.255")],
    [ipToInt("212.35.72.0"),  ipToInt("212.35.79.255")],
    [ipToInt("212.35.80.0"),  ipToInt("212.35.87.255")],
    [ipToInt("212.35.88.0"),  ipToInt("212.35.95.255")],
    [ipToInt("212.35.96.0"),  ipToInt("212.35.103.255")],
    [ipToInt("212.35.104.0"), ipToInt("212.35.111.255")],
    [ipToInt("212.35.112.0"), ipToInt("212.35.119.255")],
    [ipToInt("212.35.120.0"), ipToInt("212.35.127.255")],
    [ipToInt("212.35.128.0"), ipToInt("212.35.135.255")],
    [ipToInt("212.35.136.0"), ipToInt("212.35.143.255")],
    [ipToInt("212.35.144.0"), ipToInt("212.35.151.255")],
    [ipToInt("212.35.152.0"), ipToInt("212.35.159.255")],
    [ipToInt("212.35.160.0"), ipToInt("212.35.167.255")],
    [ipToInt("212.35.168.0"), ipToInt("212.35.175.255")],
    [ipToInt("212.35.176.0"), ipToInt("212.35.183.255")],
    [ipToInt("212.35.184.0"), ipToInt("212.35.191.255")],
    [ipToInt("212.35.192.0"), ipToInt("212.35.199.255")],
    [ipToInt("212.35.200.0"), ipToInt("212.35.207.255")],
    [ipToInt("212.35.208.0"), ipToInt("212.35.215.255")],
    [ipToInt("212.35.216.0"), ipToInt("212.35.223.255")],
    [ipToInt("212.35.224.0"), ipToInt("212.35.231.255")],
    [ipToInt("212.35.232.0"), ipToInt("212.35.239.255")],
    [ipToInt("212.35.240.0"), ipToInt("212.35.247.255")],
    [ipToInt("212.35.248.0"), ipToInt("212.35.255.255")],

    [ipToInt("212.118.0.0"), ipToInt("212.118.7.255")],
    [ipToInt("212.118.8.0"), ipToInt("212.118.15.255")],

    [ipToInt("213.139.32.0"), ipToInt("213.139.39.255")],
    [ipToInt("213.139.40.0"), ipToInt("213.139.47.255")],
    [ipToInt("213.139.48.0"), ipToInt("213.139.55.255")],
    [ipToInt("213.139.56.0"), ipToInt("213.139.63.255")]
  ].sort((a, b) => a[0] - b[0]);

  var PUBG_DOMAINS = {
    LOBBY          : ["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com"],
    MATCH          : ["*.gcloud.qq.com", "gpubgm.com"],
    RECRUIT_SEARCH : ["match.igamecj.com", "match.proximabeta.com", "teamfinder.igamecj.com", "teamfinder.proximabeta.com"],
    UPDATES        : ["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com", "hotfix.proximabeta.com", "dlied1.qq.com", "dlied2.qq.com", "gpubgm.com"],
    CDNs           : ["cdn.igamecj.com", "cdn.proximabeta.com", "cdn.tencentgames.com", "*.qcloudcdn.com", "*.cloudfront.net", "*.edgesuite.net"]
  };

  var URL_PATTERNS = {
    LOBBY          : ["*/account/login*", "*/client/version*", "*/status/heartbeat*", "*/presence/*", "*/friends/*"],
    MATCH          : ["*/matchmaking/*", "*/mms/*", "*/game/start*", "*/game/join*", "*/report/battle*"],
    RECRUIT_SEARCH : ["*/teamfinder/*", "*/clan/*", "*/social/*", "*/search/*", "*/recruit/*"],
    UPDATES        : ["*/patch*", "*/hotfix*", "*/update*", "*/download*", "*/assets/*", "*/assetbundle/*", "*/obb*"],
    CDNs           : ["*/cdn/*", "*/static/*", "*/image/*", "*/media/*", "*/video/*", "*/res/*", "*/pkg/*"]
  };

  var STICKY_SALT         = "JO_STICKY";
  var STICKY_TTL_MINUTES  = 30;
  var JITTER_WINDOW       = 3;
  var DST_RESOLVE_TTL_MS  = 30000;

  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};

  var now = new Date().getTime();

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0) >>> 0;
  }

  function resolveDstCached(h, ttl) {
    if (!h) return "";
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
    var c = CACHE.DST_RESOLVE_CACHE[h];
    if (c && (now - c.t) < ttl) return c.ip;
    var r = dnsResolve(h);
    var ip = (r && r !== "0.0.0.0") ? r : "";
    CACHE.DST_RESOLVE_CACHE[h] = { ip: ip, t: now };
    return ip;
  }

  function isJordan(ip) {
    if (!ip) return false;
    const ipInt = ipToInt(ip);
    let low = 0, high = JO_IP_RANGES.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const range = JO_IP_RANGES[mid];
      if (!range) break;
      const s = range[0], e = range[1];
      if (ipInt < s) { high = mid - 1; continue; }
      if (ipInt > e) { low  = mid + 1; continue; }
      return true;
    }
    return false;
  }

  function weightedPick(ports, weights) {
    var sum = 0;
    for (var i = 0; i < weights.length; i++) sum += (weights[i] || 0);
    var jitter = (JITTER_WINDOW > 0) ? Math.floor(Math.random() * JITTER_WINDOW) : 0;
    var r = Math.floor(Math.random() * (sum + jitter)) + 1;
    var acc = 0;
    for (var k = 0; k < ports.length; k++) {
      acc += (weights[k] || 1);
      if (r <= acc) return ports[k];
    }
    return ports[0];
  }

  function proxyForCategory(category) {
    var key = STICKY_SALT + "_PORT_" + category;
    var ttl = STICKY_TTL_MINUTES * 60 * 1000;
    var e = CACHE._PORT_STICKY[key];
    if (e && (now - e.t) < ttl) return "PROXY " + PROXY_HOST + ":" + e.p;
    var p = weightedPick(PORTS[category], PORT_WEIGHTS_BASE[category]);
    CACHE._PORT_STICKY[key] = { p: p, t: now };
    return "PROXY " + PROXY_HOST + ":" + p;
  }

  function hostMatchesAnyDomain(h, patterns) {
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(h, patterns[i])) return true;
      var p = patterns[i].replace(/^\*\./, ".");
      if (h.slice(-p.length) === p) return true;
    }
    return false;
  }

  function pathMatches(u, patterns) {
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(u, patterns[i])) return true;
    }
    return false;
  }

  var dst = (/^\d+\.\d+\.\d+\.\d+$/.test(host)) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS);
  if (!isJordan(dst)) return "DIRECT";

  for (var cat in PUBG_DOMAINS) {
    if (hostMatchesAnyDomain(host, PUBG_DOMAINS[cat]) || pathMatches(url, URL_PATTERNS[cat])) {
      return proxyForCategory(cat);
    }
  }

  return proxyForCategory("LOBBY");
}
