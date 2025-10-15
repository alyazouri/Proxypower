function FindProxyForURL(url, host) {
  /* CONFIG */
  var FORBID_DIRECT_GLOBAL = false;
  var DEBUG = false; // true => يعيد proxy strings مع ملصق DEBUG (للاختبار)
  var PROBES = 3;
  var EWMA_ALPHA = 0.28;
  var VAR_ALPHA = 0.18;
  var DNS_CACHE_TTL = 45 * 1000;
  var DNS_CACHE_TTL_MIN = 8 * 1000;
  var STICKY_PORT_TTL = 30 * 60 * 1000;
  var PROXY_SESSION_TTL = 30 * 60 * 1000;
  var SWITCH_FACTOR = 1.6; // حاجة أكبر للتبديل (منع الفلاف)
  var PROXY_FAIL_BACKOFF_BASE = 60 * 1000;
  var PROXY_FAIL_BACKOFF_MAX = 20 * 60 * 1000;

  var PROXIES = [
    { ip: "91.106.109.12", ports: [20001, 443, 8080], weight: 5 },
    { ip: "176.28.250.122", ports: [8080, 443],       weight: 3 },
    { ip: "79.173.251.142", ports: [8000, 443],       weight: 2 }
  ];

  var JO_IP_SUBNETS = [
    ["2.17.24.0","255.255.252.0"],
    ["37.202.64.0","255.255.192.0"],
    ["86.108.0.0","255.255.128.0"],
    ["46.185.128.0","255.255.128.0"],
    ["46.32.96.0","255.255.224.0"],
    ["79.173.192.0","255.255.192.0"],
    ["84.18.32.0","255.255.224.0"],
    ["62.72.160.0","255.255.224.0"],
    ["91.106.96.0","255.255.224.0"],
    ["91.106.100.0","255.255.252.0"],
    ["91.106.104.0","255.255.248.0"],
    ["91.186.224.0","255.255.224.0"],
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

  var LOBBY_DOMAINS = [
    "*.pubgmobile.com",
    "*.pubg.com",
    "login.*",
    "lobby.*",
    "friend.*",
    "social.*",
    "matchmaking.*"
  ];

  var MATCH_DOMAINS = [
    "*.gcloud.qq.com",
    "*.qcloud.com",
    "*.garena.com",
    "*.realtime.*",
    "realtime.*",
    "game.*",
    "udp.*"
  ];

  if (typeof __JO_ADV === "undefined") {
    __JO_ADV = {
      dnsCache: {},
      proxyStats: {},
      stickyPorts: {},
      sessions: {}
    };
  }

  for (var i = 0; i < PROXIES.length; i++) {
    var p = PROXIES[i];
    if (!__JO_ADV.proxyStats[p.ip]) {
      __JO_ADV.proxyStats[p.ip] = {
        ewma: null,
        variance: null,
        lastProbe: 0,
        failures: 0,
        backoffUntil: 0
      };
    }
  }

  function nowMs() { return (new Date()).getTime(); }

  function cacheResolve(name) {
    var entry = __JO_ADV.dnsCache[name];
    var t = nowMs();
    if (entry && (t - entry.t) < (entry.ttl || DNS_CACHE_TTL)) return entry.ip;
    var ip = dnsResolve(name);
    if (ip) {
      __JO_ADV.dnsCache[name] = { ip: ip, t: t, ttl: DNS_CACHE_TTL };
      return ip;
    } else {
      __JO_ADV.dnsCache[name] = { ip: null, t: t, ttl: DNS_CACHE_TTL_MIN };
      return null;
    }
  }

  function inJordan(ip) {
    if (!ip) return false;
    for (var j = 0; j < JO_IP_SUBNETS.length; j++) {
      if (isInNet(ip, JO_IP_SUBNETS[j][0], JO_IP_SUBNETS[j][1])) return true;
    }
    return false;
  }

  function isYouTube(h) {
    var x = h.toLowerCase();
    return (shExpMatch(x, "*.youtube.com") ||
            shExpMatch(x, "*.googlevideo.com") ||
            shExpMatch(x, "*.ytimg.com") ||
            x === "youtu.be" || shExpMatch(x, "youtu.be*"));
  }

  function matchList(h, list) {
    for (var k = 0; k < list.length; k++) if (shExpMatch(h, list[k])) return true;
    return false;
  }

  function multiProbe(hostOrIp, count) {
    var samples = [];
    var ip = null;
    for (var m = 0; m < count; m++) {
      var s0 = nowMs();
      var r = dnsResolve(hostOrIp);
      var s1 = nowMs();
      if (!ip && r) ip = r;
      samples.push(s1 - s0);
    }
    var sum = 0;
    for (var n = 0; n < samples.length; n++) sum += samples[n];
    var mean = sum / samples.length;
    var vsum = 0;
    for (var n = 0; n < samples.length; n++) vsum += Math.pow(samples[n] - mean, 2);
    var variance = vsum / samples.length;
    return { ip: ip, mean: mean, variance: variance, samples: samples };
  }

  function updateStats(ip, mean, variance) {
    var s = __JO_ADV.proxyStats[ip];
    if (!s) return;
    if (s.ewma === null) s.ewma = mean;
    else s.ewma = (1 - EWMA_ALPHA) * s.ewma + EWMA_ALPHA * mean;
    if (s.variance === null) s.variance = variance;
    else s.variance = (1 - VAR_ALPHA) * s.variance + VAR_ALPHA * variance;
    s.lastProbe = nowMs();
  }

  function backoffProxy(ip) {
    var s = __JO_ADV.proxyStats[ip];
    if (!s) return;
    s.failures = (s.failures || 0) + 1;
    var back = Math.min(PROXY_FAIL_BACKOFF_MAX, PROXY_FAIL_BACKOFF_BASE * Math.pow(2, s.failures - 1));
    s.backoffUntil = nowMs() + back;
  }

  function proxyAvailable(ip) {
    var s = __JO_ADV.proxyStats[ip];
    if (!s) return true;
    return (s.backoffUntil || 0) < nowMs();
  }

  function hashToIndex(key, n) {
    var h = 0;
    for (var z = 0; z < key.length; z++) h = ((h << 5) - h) + key.charCodeAt(z);
    return Math.abs(h) % n;
  }

  function pickStickyPort(hostname, proxy) {
    var key = hostname + "@" + proxy.ip;
    var rec = __JO_ADV.stickyPorts[key];
    var now = nowMs();
    if (rec && (now - rec.t) < STICKY_PORT_TTL) return rec.port;
    var ports = proxy.ports && proxy.ports.length ? proxy.ports.slice() : [443];
    // prefer game UDP port 20001 if present
    ports.sort(function(a,b){ if(a===20001) return -1; if(b===20001) return 1; return a-b; });
    var idx = hashToIndex(hostname, ports.length);
    var port = ports[idx];
    __JO_ADV.stickyPorts[key] = { port: port, t: now, tried: [port] };
    return port;
  }

  function evaluateProxy(proxy, hostForProbe) {
    if (!proxyAvailable(proxy.ip)) return { ok: false, score: -1e9 };
    var target = proxy.ip || hostForProbe;
    var res = multiProbe(target, PROBES);
    if (!res.ip) { backoffProxy(proxy.ip); return { ok: false, score: -1e9 }; }
    updateStats(proxy.ip, res.mean, res.variance);
    var st = __JO_ADV.proxyStats[proxy.ip];
    var mean = st.ewma || res.mean;
    var variance = st.variance || res.variance;
    var variancePenalty = 1 + Math.sqrt(variance) / (1 + mean);
    var score = proxy.weight / (1 + mean) / variancePenalty;
    if (proxy.ports && proxy.ports.indexOf(20001) !== -1) score *= 1.12;
    return { ok: true, score: score, mean: mean, var: variance, probe: res };
  }

  function chooseCandidate(hostname) {
    var best = null;
    var bestScore = -1e9;
    for (var i = 0; i < PROXIES.length; i++) {
      var ev = evaluateProxy(PROXIES[i], hostname);
      if (ev.ok && ev.score > bestScore) { bestScore = ev.score; best = { proxy: PROXIES[i], eval: ev }; }
    }
    return best;
  }

  function decideSession(hostname, candidate) {
    var sess = __JO_ADV.sessions[hostname];
    if (!sess || !sess.proxyIp) {
      __JO_ADV.sessions[hostname] = { proxyIp: candidate.proxy.ip, t: nowMs() };
      return candidate.proxy;
    }
    if (sess.proxyIp === candidate.proxy.ip) { sess.t = nowMs(); return candidate.proxy; }
    var curr = __JO_ADV.proxyStats[sess.proxyIp];
    var currScore = curr && curr.ewma ? (1 / (1 + curr.ewma)) : 1e-4;
    var candScore = candidate.eval.score || 0;
    if (candScore > currScore * SWITCH_FACTOR) {
      __JO_ADV.sessions[hostname] = { proxyIp: candidate.proxy.ip, t: nowMs() };
      return candidate.proxy;
    }
    if (!proxyAvailable(sess.proxyIp)) {
      __JO_ADV.sessions[hostname] = { proxyIp: candidate.proxy.ip, t: nowMs() };
      return candidate.proxy;
    }
    for (var j = 0; j < PROXIES.length; j++) if (PROXIES[j].ip === sess.proxyIp) return PROXIES[j];
    __JO_ADV.sessions[hostname] = { proxyIp: candidate.proxy.ip, t: nowMs() };
    return candidate.proxy;
  }

  /* MAIN */
  var h = (host||"").toLowerCase();

  if (isYouTube(h)) return "DIRECT";

  var resolved = cacheResolve(h);
  var isJordan = resolved && inJordan(resolved);

  var isLobby = matchList(h, LOBBY_DOMAINS);
  var isMatch = matchList(h, MATCH_DOMAINS) || h.indexOf("pubg") !== -1 || h.indexOf("tencent") !== -1;

  if (isJordan && !FORBID_DIRECT_GLOBAL && !isMatch && !isLobby) return "DIRECT";

  var cand = chooseCandidate(h);
  if (!cand) {
    if (!FORBID_DIRECT_GLOBAL && isJordan) return "DIRECT";
    var f = PROXIES[0];
    var pport = pickStickyPort(h, f);
    return DEBUG ? "PROXY " + f.ip + ":" + pport + " /*FALLBACK*/" : "PROXY " + f.ip + ":" + pport;
  }

  var chosen = decideSession(h, cand);

  if (isMatch) {
    var sport = pickStickyPort(h, chosen);
    return DEBUG ? "SOCKS5 " + chosen.ip + ":" + sport + " /*GAME*/" : "SOCKS5 " + chosen.ip + ":" + sport;
  }

  if (isLobby) {
    var lport = pickStickyPort(h, chosen);
    return DEBUG ? "PROXY " + chosen.ip + ":" + lport + " /*LOBBY*/" : "PROXY " + chosen.ip + ":" + lport;
  }

  var hport = pickStickyPort(h, chosen);
  if (FORBID_DIRECT_GLOBAL) return "PROXY " + chosen.ip + ":" + hport;
  if (isJordan) return "DIRECT";
  return "PROXY " + chosen.ip + ":" + hport;
}
