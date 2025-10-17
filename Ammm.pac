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

  var JO_IP_SUBNETS = [
    ["109.237.192.0","255.255.240.0"],
    ["185.140.0.0","255.255.240.0"],
    ["212.35.0.0","255.255.240.0"],
    ["109.107.0.0","255.255.240.0"],
    ["176.29.0.0","255.255.240.0"],
    ["46.185.128.0","255.255.240.0"],
    ["46.32.96.0","255.255.240.0"],
    ["46.248.192.0","255.255.240.0"],
    ["37.17.192.0","255.255.240.0"],
    ["37.123.64.0","255.255.240.0"],
    ["79.173.192.0","255.255.240.0"]
  ];

  var FORBID_NON_JO = true;
  var BLOCK_REPLY   = "PROXY 0.0.0.0:0";

  var STICKY_SALT = "JO_STICKY";
  var STICKY_TTL_MINUTES = 30;
  var JITTER_WINDOW = 2;

  var now = new Date().getTime();
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;

  var PUBG_DOMAINS = {
    LOBBY: [
      "*.pubgmobile.com", "*.pubgmobile.net",
      "*.proximabeta.com", "*.igamecj.com"
    ],
    MATCH: [
      "*.gcloud.qq.com", "gpubgm.com"
    ],
    RECRUIT_SEARCH: [
      "match.igamecj.com", "match.proximabeta.com",
      "teamfinder.igamecj.com", "teamfinder.proximabeta.com"
    ],
    UPDATES: [
      "cdn.pubgmobile.com", "updates.pubgmobile.com",
      "patch.igamecj.com", "hotfix.proximabeta.com",
      "dlied1.qq.com", "dlied2.qq.com", "gpubgm.com"
    ],
    CDNs: [
      "cdn.igamecj.com", "cdn.proximabeta.com",
      "cdn.tencentgames.com", "*.qcloudcdn.com",
      "*.cloudfront.net", "*.edgesuite.net"
    ]
  };

  var URL_PATTERNS = {
    LOBBY: [
      "*/account/login*", "*/client/version*",
      "*/status/heartbeat*", "*/presence/*", "*/friends/*"
    ],
    MATCH: [
      "*/matchmaking/*", "*/mms/*",
      "*/game/start*", "*/game/join*", "*/report/battle*"
    ],
    RECRUIT_SEARCH: [
      "*/teamfinder/*", "*/clan/*",
      "*/social/*", "*/search/*", "*/recruit/*"
    ],
    UPDATES: [
      "*/patch*", "*/hotfix*", "*/update*",
      "*/download*", "*/assets/*", "*/assetbundle*", "*/obb*"
    ],
    CDNs: [
      "*/cdn/*", "*/static/*", "*/image/*",
      "*/media/*", "*/video/*", "*/res/*", "*/pkg/*"
    ]
  };

  function hostMatchesAnyDomain(h, patterns) {
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(h, patterns[i])) return true;
      var p = patterns[i].replace(/^\*\./, ".");
      if (h.slice(-p.length) === p) return true;
    }
    return false;
  }

  function pathMatches(urlStr, patterns) {
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(urlStr, patterns[i])) return true;
    }
    return false;
  }

  function ipInAnyJordanRange(ip) {
    if (!ip) return false;
    for (var j = 0; j < JO_IP_SUBNETS.length; j++) {
      if (isInNet(ip, JO_IP_SUBNETS[j][0], JO_IP_SUBNETS[j][1])) return true;
    }
    return false;
  }

  function weightedPick(ports, weights) {
    var sum = 0;
    for (var i = 0; i < weights.length; i++) sum += weights[i];
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
    var stickyKey = STICKY_SALT + "_PORT_" + category;
    var ttl = STICKY_TTL_MINUTES * 60 * 1000;
    var entry = CACHE[stickyKey];
    if (entry && (now - entry.t) < ttl) {
    return "PROXY " + PROXY_HOST + ":" + entry.p;
    }
    var p = weightedPick(PORTS[category], PORT_WEIGHTS[category]);
    CACHE[stickyKey] = { p: p, t: now };
    return "PROXY " + PROXY_HOST + ":" + p;
  }

  function resolveIfHost(h) {
    if (!h) return "";
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
    var r = dnsResolve(h);
    return (r && r !== "0.0.0.0") ? r : "";
  }

  var geoClientKey = STICKY_SALT + "_CLIENT_JO";
  var geoTTL = STICKY_TTL_MINUTES * 60 * 1000;
  var geoClient = CACHE[geoClientKey];
  var clientOK;
  if (geoClient && (now - geoClient.t) < geoTTL) {
    clientOK = geoClient.ok;
  } else {
    var myip = resolveIfHost(myIpAddress());
    clientOK = ipInAnyJordanRange(myip);
    CACHE[geoClientKey] = { ok: clientOK, t: now };
  }

  var geoProxyKey = STICKY_SALT + "_PROXY_JO";
  var geoProxy = CACHE[geoProxyKey];
  var proxyOK;
  if (geoProxy && (now - geoProxy.t) < geoTTL) {
    proxyOK = geoProxy.ok;
  } else {
    var proxyIP = resolveIfHost(PROXY_HOST);
    proxyOK = ipInAnyJordanRange(proxyIP);
    CACHE[geoProxyKey] = { ok: proxyOK, t: now };
  }

  if (!(clientOK && proxyOK)) {
    return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  }

  for (var cat in URL_PATTERNS) {
    if (pathMatches(url, URL_PATTERNS[cat])) return proxyForCategory(cat);
  }

  for (var c in PUBG_DOMAINS) {
    if (hostMatchesAnyDomain(host, PUBG_DOMAINS[c])) return proxyForCategory(c);
  }

  var dst = /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveIfHost(host);
  if (dst && ipInAnyJordanRange(dst)) return proxyForCategory("LOBBY");

  return "DIRECT";
}
