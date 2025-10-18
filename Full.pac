function FindProxyForURL(url, host) {
  var PROXY_HOST = "91.106.109.12";
  var PORTS = {
    LOBBY: [443, 8080, 8443],
    MATCH: [20001, 20002, 20003],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    UPDATES: [80, 443, 8443, 8080],
    CDNs: [80, 8080, 443]
  };
  var PORT_WEIGHTS = {
    LOBBY: [5, 3, 2],
    MATCH: [4, 2, 1],
    RECRUIT_SEARCH: [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
    UPDATES: [5, 3, 2, 1],
    CDNs: [3, 2, 2]
  };
  var JO_IP_RANGES = [
  ["5.45.128.0","5.45.143.255"],
  ["37.17.192.0","37.17.207.255"],
  ["37.123.64.0","37.123.95.255"],
  ["37.152.0.0","37.152.7.255"],
  ["37.202.64.0","37.202.127.255"],
  ["37.220.112.0","37.220.127.255"],
  ["37.220.120.0","37.220.127.255"],
  ["46.23.112.0","46.23.127.255"],
  ["46.32.96.0","46.32.111.255"],
  ["46.185.128.0","46.185.255.255"],
  ["46.248.192.0","46.248.223.255"],
  ["62.72.160.0","62.72.191.255"],
  ["77.245.0.0","77.245.15.255"],
  ["79.134.128.0","79.134.159.255"],
  ["79.173.192.0","79.173.255.255"],
  ["80.90.160.0","80.90.175.255"],
  ["81.21.0.0","81.21.0.255"],
  ["81.21.5.0","81.21.5.255"],
  ["81.21.6.0","81.21.6.255"],
  ["81.21.8.0","81.21.15.255"],
  ["81.28.112.0","81.28.127.255"],
  ["82.212.64.0","82.212.127.255"],
  ["84.18.32.0","84.18.63.255"],
  ["84.18.64.0","84.18.95.255"],
  ["86.108.0.0","86.108.127.255"],
  ["91.106.96.0","91.106.111.255"],
  ["91.186.224.0","91.186.255.255"],
  ["92.241.32.0","92.241.63.255"],
  ["92.253.0.0","92.253.127.255"],
  ["94.142.32.0","94.142.63.255"],
  ["94.249.0.0","94.249.127.255"],
  ["95.141.208.0","95.141.223.255"],
  ["95.172.192.0","95.172.223.255"],
  ["109.107.224.0","109.107.255.255"],
  ["149.200.128.0","149.200.255.255"],
  ["176.28.128.0","176.28.255.255"],
  ["176.29.0.0","176.29.255.255"],
  ["176.57.0.0","176.57.31.255"],
  ["178.77.128.0","178.77.191.255"],
  ["178.238.176.0","178.238.191.255"],
  ["188.123.160.0","188.123.191.255"],
  ["188.247.64.0","188.247.95.255"],
  ["194.165.128.0","194.165.159.255"],
  ["212.34.0.0","212.34.31.255"],
  ["212.35.64.0","212.35.95.255"],
  ["212.118.0.0","212.118.31.255"],
  ["213.139.32.0","213.139.63.255"],
  ["213.186.160.0","213.186.191.255"],
  ["217.23.32.0","217.23.47.255"],
  ["217.29.240.0","217.29.255.255"],
  ["217.144.0.0","217.144.15.255"]
];
  var STRICT_JO_FOR = { LOBBY: true, MATCH: true, RECRUIT_SEARCH: true, CDNs: true};
  var FORBID_NON_JO = true;
  var BLOCK_REPLY = "PROXY 0.0.0.0:0";
  var STICKY_SALT = "JO_STICKY";
  var STICKY_TTL_MINUTES = 30;
  var JITTER_WINDOW = 2;
  var HOST_RESOLVE_TTL_MS = 60 * 1000;
  var DST_RESOLVE_TTL_MS = 30 * 1000;
  var now = new Date().getTime();
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.HOST_RESOLVE_CACHE) CACHE.HOST_RESOLVE_CACHE = {};
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};

  var PUBG_DOMAINS = {
    LOBBY: ["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com"],
    MATCH: ["*.gcloud.qq.com", "gpubgm.com"],
    RECRUIT_SEARCH: ["match.igamecj.com", "match.proximabeta.com", "teamfinder.igamecj.com", "teamfinder.proximabeta.com"],
    UPDATES: ["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com", "hotfix.proximabeta.com", "dlied1.qq.com", "dlied2.qq.com", "gpubgm.com"],
    CDNs: ["cdn.igamecj.com", "cdn.proximabeta.com", "cdn.tencentgames.com", "*.qcloudcdn.com", "*.cloudfront.net", "*.edgesuite.net"]
  };
  var URL_PATTERNS = {
    LOBBY: ["*/account/login*", "*/client/version*", "*/status/heartbeat*", "*/presence/*", "*/friends/*"],
    MATCH: ["*/matchmaking/*", "*/mms/*", "*/game/start*", "*/game/join*", "*/report/battle*"],
    RECRUIT_SEARCH: ["*/teamfinder/*", "*/clan/*", "*/social/*", "*/search/*", "*/recruit/*"],
    UPDATES: ["*/patch*", "*/hotfix*", "*/update*", "*/download*", "*/assets/*", "*/assetbundle*", "*/obb*"],
    CDNs: ["*/cdn/*", "*/static/*", "*/image/*", "*/media/*", "*/video/*", "*/res/*", "*/pkg/*"]
  };

  function ipToInt(ip) {
    var parts = ip.split(".");
    return (parseInt(parts[0]) << 24) + (parseInt(parts[1]) << 16) + (parseInt(parts[2]) << 8) + parseInt(parts[3]);
  }

  function ipInAnyJordanRange(ip) {
    if (!ip) return false;
    var ipNum = ipToInt(ip);
    for (var j = 0; j < JO_IP_RANGES.length; j++) {
      var start = ipToInt(JO_IP_RANGES[j][0]);
      var end = ipToInt(JO_IP_RANGES[j][1]);
      if (ipNum >= start && ipNum <= end) return true;
    }
    return false;
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

  function weightedPick(ports, weights) {
    var sum = 0;
    for (var i = 0; i < weights.length; i++) sum += (weights[i] || 1); // ضمان أوزان موجبة
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
    var p = weightedPick(PORTS[category], PORT_WEIGHTS[category]);
    CACHE._PORT_STICKY[key] = { p: p, t: now };
    return "PROXY " + PROXY_HOST + ":" + p;
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

  var geoTTL = STICKY_TTL_MINUTES * 60 * 1000;
  var clientKey = STICKY_SALT + "_CLIENT_JO";
  var cE = CACHE[clientKey];
  var clientOK;
  if (cE && (now - cE.t) < geoTTL) {
    clientOK = cE.ok;
  } else {
    clientOK = ipInAnyJordanRange(resolveDstCached(myIpAddress(), DST_RESOLVE_TTL_MS));
    CACHE[clientKey] = { ok: clientOK, t: now };
  }

  var proxyOK = ipInAnyJordanRange(PROXY_HOST); // تحسين: التحقق مباشرة من عنوان IP

  if (!(clientOK && proxyOK)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";

  function requireJordanDestination(category, h) {
    var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    if (!ipInAnyJordanRange(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    return proxyForCategory(category);
  }

  for (var cat in URL_PATTERNS) {
    if (pathMatches(url, URL_PATTERNS[cat])) {
      if (STRICT_JO_FOR[cat]) return requireJordanDestination(cat, host);
      return proxyForCategory(cat);
    }
  }

  for (var c in PUBG_DOMAINS) {
    if (hostMatchesAnyDomain(host, PUBG_DOMAINS[c])) {
      if (STRICT_JO_FOR[c]) return requireJordanDestination(c, host);
      return proxyForCategory(c);
    }
  }

  var dst = /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS);
  if (dst && ipInAnyJordanRange(dst)) return proxyForCategory("LOBBY");
  return "DIRECT";
}
