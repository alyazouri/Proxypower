function FindProxyForURL(url, host) {
  var PROXY_HOST = "91.106.109.12";
  // منافذ التوجيه حسب الفئات، باستخدام المنافذ المفتوحة
  var PORTS = {
    LOBBY: [443, 8443, 808],  // HTTPS، HTTPS بديل، HTTP غير قياسي
    MATCH: [2000, 2001, 2003], // منافذ مفتوحة من نطاق 2000
    RECRUIT_SEARCH: [10010, 10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020],
    UPDATES: [80, 443, 8443, 808], // منافذ للتحديثات
    CDNs: [80, 443, 808] // منافذ لخدمات CDN
  };
  var PORT_WEIGHTS = {
    LOBBY: [5, 3, 2],
    MATCH: [4, 2, 1],
    RECRUIT_SEARCH: [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
    UPDATES: [5, 3, 2, 1],
    CDNs: [3, 2, 2]
  };
  // نطاقات عناوين الأردن مرتبة من الأكبر إلى الأصغر حجمًا
  var JO_IP_RANGES = [
    ["109.128.0.0", "109.132.255.255"],
    ["217.96.0.1", "217.99.255.255"],
    ["217.20.0.1", "217.22.255.255"],
    ["217.52.0.1", "217.54.255.255"],
    ["217.136.0.1", "217.138.255.255"],
    ["217.142.0.1", "217.144.255.255"],
    ["217.163.0.1", "217.165.255.255"],
    ["109.82.0.0", "109.83.255.255"],
    ["217.12.0.1", "217.13.255.255"],
    ["217.30.0.1", "217.31.255.255"],
    ["217.72.0.1", "217.73.255.255"],
    ["217.156.0.1", "217.157.255.255"],
    ["109.86.0.0", "109.86.255.255"],
    ["109.104.0.0", "109.104.255.255"],
    ["109.125.0.0", "109.125.255.255"],
    ["217.8.0.1", "217.8.255.255"],
    ["217.18.0.1", "217.18.255.255"],
    ["217.27.0.1", "217.27.255.255"],
    ["217.61.0.1", "217.61.255.255"],
    ["217.64.0.1", "217.64.255.255"],
    ["217.70.0.1", "217.70.255.255"],
    ["217.79.0.1", "217.79.255.255"],
    ["217.119.0.1", "217.119.255.255"],
    ["217.129.0.1", "217.129.255.255"],
    ["217.132.0.1", "217.132.255.255"],
    ["217.147.0.1", "217.147.255.255"],
    ["217.154.0.1", "217.154.255.255"],
    ["217.160.0.1", "217.160.255.255"],
    ["217.168.0.1", "217.168.255.255"],
    ["217.170.0.1", "217.170.255.255"],
    ["217.175.0.1", "217.175.255.255"],
    ["217.178.0.1", "217.178.255.255"]
  ];
  // إلزام جميع الفئات بالتحقق من أن الوجهة ضمن النطاقات الأردنية
  var STRICT_JO_FOR = {
    LOBBY: true,
    MATCH: true,
    RECRUIT_SEARCH: true,
    UPDATES: true,
    CDNs: true
  };
  var FORBID_NON_JO = true;
  var BLOCK_REPLY = "PROXY 0.0.0.0:0";
  var STICKY_SALT = "JO_STICKY";
  var STICKY_TTL_MINUTES = 30;
  var JITTER_WINDOW = 3;
  var DST_RESOLVE_TTL_MS = 30 * 1000;
  var now = new Date().getTime();
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
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

  function ipInAnyJordanRange(ip, preferPriority = false) {
    if (!ip) return false;
    var ipNum = ipToInt(ip);
    if (preferPriority) {
      var preferredRange = ["91.106.96.0", "91.106.111.255"];
      var start = ipToInt(preferredRange[0]);
      var end = ipToInt(preferredRange[1]);
      if (ipNum >= start && ipNum <= end) return true;
    }
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
    for (var i = 0; i < weights.length; i++) sum += (weights[i] || 1);
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

  var clientOK;
  var clientKey = STICKY_SALT + "_CLIENT_JO";
  var geoTTL = STICKY_TTL_MINUTES * 60 * 1000;
  var cE = CACHE[clientKey];
  if (cE && (now - cE.t) < geoTTL) {
    clientOK = cE.ok;
  } else {
    clientOK = ipInAnyJordanRange(resolveDstCached(myIpAddress(), DST_RESOLVE_TTL_MS));
    CACHE[clientKey] = { ok: clientOK, t: now };
  }

  var proxyOK = ipInAnyJordanRange(PROXY_HOST);
  if (!(clientOK && proxyOK)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";

  function requireJordanDestination(category, h) {
    var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    var preferPriority = (category === "MATCH");
    if (!ipInAnyJordanRange(ip, preferPriority)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
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
