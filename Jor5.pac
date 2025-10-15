function FindProxyForURL(url, host) {

  var PROXIES = [
    { ip: "91.106.109.12", ports: [20001,443,8080], weight: 5 },
    { ip: "176.28.250.122", ports: [8080], weight: 3 },
    { ip: "79.173.251.142", ports: [8000], weight: 2 }
  ];

  var JO_IP_SUBNETS = [
    // --- 2.17.x.x ---
    ["2.17.24.0","255.255.252.0"],  // /22

    // --- 37.202.x.x ---
    ["37.202.64.0","255.255.192.0"], // /18

    // --- 91.106.x.x ---
    ["91.106.96.0","255.255.224.0"],   // /19
    ["91.106.100.0","255.255.252.0"],  // /22
    ["91.106.104.0","255.255.248.0"],  // /21

    // --- 91.186.x.x ---
    ["91.186.224.0","255.255.224.0"],  // /19

    // --- 109.107.x.x ---
    ["109.107.224.0","255.255.224.0"],
    ["109.107.228.0","255.255.255.0"],
    ["109.107.240.0","255.255.255.0"],
    ["109.107.241.0","255.255.255.0"],
    ["109.107.242.0","255.255.255.0"],
    ["109.107.243.0","255.255.255.0"],
    ["109.107.244.0","255.255.255.0"],
    ["109.107.245.0","255.255.255.0"],
    ["109.107.246.0","255.255.255.0"],
    ["109.107.247.0","255.255.255.0"],
    ["109.107.248.0","255.255.255.0"],
    ["109.107.249.0","255.255.255.0"],
    ["109.107.250.0","255.255.255.0"],
    ["109.107.251.0","255.255.255.0"],
    ["109.107.252.0","255.255.255.0"],
    ["109.107.253.0","255.255.255.0"],
    ["109.107.254.0","255.255.255.0"],
    ["109.107.255.0","255.255.255.0"],

    // --- 109.237.x.x ---
    ["109.237.192.0","255.255.255.0"],
    ["109.237.193.0","255.255.255.0"],
    ["109.237.194.0","255.255.255.0"],
    ["109.237.195.0","255.255.255.0"],
    ["109.237.196.0","255.255.255.0"],
    ["109.237.197.0","255.255.255.0"],
    ["109.237.198.0","255.255.255.0"],
    ["109.237.199.0","255.255.255.0"],
    ["109.237.200.0","255.255.255.0"],
    ["109.237.201.0","255.255.255.0"],
    ["109.237.202.0","255.255.255.0"],
    ["109.237.203.0","255.255.255.0"],
    ["109.237.204.0","255.255.255.0"],
    ["109.237.205.0","255.255.255.0"],
    ["109.237.206.0","255.255.255.0"],
    ["109.237.207.0","255.255.255.0"]
  ];

  var DNS_CACHE_TTL_MS = 45000;
  var PING_TIMEOUT_MS   = 300;
  var JITTER_WINDOW     = 3;
  var STICKY_PORT_TTL   = 10 * 60 * 1000;

  var GAME_PATTERNS = [
    "*.pubg.com","*.pubgmobile.com","*.tencentgames.com","*.agame.com",
    "*.tap4fun.com","*.pubgm.com","*.garena.com","game.*","*.mlc.*","*.umeng.com"
  ];

  if (typeof __JO_CACHE === "undefined") {
    __JO_CACHE = { dns: {}, stickyPorts: {}, lastGeoValid: {} };
  }

  function nowMs() { return (new Date()).getTime(); }

  function cacheDNS(name) {
    var entry = __JO_CACHE.dns[name];
    if (entry && (nowMs() - entry.t) < DNS_CACHE_TTL_MS) return entry.ip;
    var ip = dnsResolve(name);
    __JO_CACHE.dns[name] = { ip: ip, t: nowMs() };
    return ip;
  }

  function isIPInJordan(ip) {
    if (!ip) return false;
    for (var i=0;i<JO_IP_SUBNETS.length;i++) {
      if (isInNet(ip, JO_IP_SUBNETS[i][0], JO_IP_SUBNETS[i][1])) return true;
    }
    return false;
  }

  function geoCheckProxy(proxy) {
    var key = proxy.ip;
    var cached = __JO_CACHE.lastGeoValid[key];
    if (cached && (nowMs() - cached.t) < DNS_CACHE_TTL_MS) return cached.valid;
    var valid = isIPInJordan(proxy.ip);
    __JO_CACHE.lastGeoValid[key] = { valid: valid, t: nowMs() };
    return valid;
  }

  function measureResolveDelay(hostname) {
    var t0 = nowMs(); var ip = dnsResolve(hostname); var t1 = nowMs();
    if (!ip) return { ip: null, ms: 9999 };
    return { ip: ip, ms: (t1 - t0) };
  }

  function chooseBestProxy(hostForPing) {
    var best = null, bestScore = -9999;
    for (var i=0;i<PROXIES.length;i++) {
      var p = PROXIES[i];
      if (!geoCheckProxy(p)) continue;
      var res = measureResolveDelay(p.ip);
      var ping = res.ms || 9999;
      var score = p.weight / (1 + ping);
      if (p.ports.indexOf(20001) !== -1) score *= 1.2;
      if (score > bestScore) bestScore = score, best = { proxy: p, ping: ping };
    }
    return best;
  }

  function hashHostToIndex(host, n) {
    var h = 0; for (var i=0;i<host.length;i++) h = ((h<<5)-h)+host.charCodeAt(i);
    return Math.abs(h) % n;
  }

  function getStickyPortForHost(host, proxy) {
    var key = host + "@" + proxy.ip;
    var entry = __JO_CACHE.stickyPorts[key];
    if (entry && (nowMs() - entry.t) < STICKY_PORT_TTL) return entry.port;
    var ports = proxy.ports || [443];
    var idx = hashHostToIndex(host, ports.length);
    idx = (idx + (Math.abs(hashHostToIndex(host+"j",3))%JITTER_WINDOW))%ports.length;
    var port = ports[idx];
    __JO_CACHE.stickyPorts[key] = { port: port, t: nowMs() };
    return port;
  }

  function isGameHost(h) {
    for (var i=0;i<GAME_PATTERNS.length;i++) if (shExpMatch(h,GAME_PATTERNS[i])) return true;
    h=h.toLowerCase();
    return (h.indexOf("pubg")!=-1||h.indexOf("tencent")!=-1||h.indexOf("garena")!=-1);
  }

  var resolved = cacheDNS(host);
  if (resolved && isIPInJordan(resolved)) return "DIRECT";

  var best = chooseBestProxy(host);
  if (!best) return "PROXY "+PROXIES[0].ip+":"+PROXIES[0].ports[0];

  if (isGameHost(host)) {
    var sticky = getStickyPortForHost(host,best.proxy);
    return "SOCKS5 "+best.proxy.ip+":"+sticky;
  }

  var httpPort = getStickyPortForHost(host,best.proxy);
  return "PROXY "+best.proxy.ip+":"+httpPort;
}
