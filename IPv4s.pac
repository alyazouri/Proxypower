// PUBG Jordanian Ultra Optimization PAC v4.8 (No DIRECT mode)
// Updated: October 20, 2025

function FindProxyForURL(url, host) {

  const CONFIG = {
    PROXY_HOSTS: [
      { host: "91.106.109.12", weight: 5, type: "HTTPS" } // Only proxy used
    ],

    PORTS: {
      LOBBY: [443, 8080, 8443],
      MATCH: [20001, 20002, 20003],
      RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
      UPDATES: [80, 443, 8443, 8080],
      CDNs: [80, 8080, 443]
    },

    PORT_WEIGHTS: {
      LOBBY: [5, 3, 2],
      MATCH: [4, 2, 1],
      RECRUIT_SEARCH: [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
      UPDATES: [5, 3, 2, 1],
      CDNs: [3, 2, 2]
    },

    // 8 Jordanian IP ranges – rotate every 5 seconds
    JO_BASE_RANGES: [
      ["94.249.0.0",   "94.249.127.255"],
      ["109.107.224.0","109.107.255.255"],
      ["91.106.96.0",  "91.106.111.255"],
      ["5.45.128.0",   "5.45.143.255"],
      ["86.108.0.0",   "86.108.127.255"],
      ["213.139.32.0", "213.139.63.255"],
      ["46.185.128.0", "46.185.255.255"],
      ["92.253.0.0",   "92.253.31.255"]
    ],

    STRICT_JO_FOR: ["LOBBY", "MATCH", "RECRUIT_SEARCH"],
    FORBID_NON_JO: true,
    BLOCK_REPLY: "PROXY 0.0.0.0:0"
  };

  // ---------------- Helpers ----------------

  function ipToInt(ip) {
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return -1;
    var p = ip.split(".").map(function(x){ return parseInt(x,10); });
    return p[0]*16777216 + p[1]*65536 + p[2]*256 + p[3];
  }

  function rotateRanges(base, offset) {
    var n = base.length;
    var k = ((offset % n) + n) % n;
    var out = [];
    for (var i = 0; i < n; i++) out.push(base[(i + k) % n]);
    return out;
  }

  function currentJoRanges() {
    // rotation every 5 seconds
    var idx = Math.floor(Date.now() / 5000) % CONFIG.JO_BASE_RANGES.length;
    return rotateRanges(CONFIG.JO_BASE_RANGES, idx);
  }

  function ipInRanges(ip, ranges) {
    var n = ipToInt(ip);
    if (n < 0) return false;
    for (var i = 0; i < ranges.length; i++) {
      var s = ipToInt(ranges[i][0]);
      var e = ipToInt(ranges[i][1]);
      if (n >= s && n <= e) return true;
    }
    return false;
  }

  function ipInJordan(ip) {
    return ipInRanges(ip, currentJoRanges());
  }

  function weightedPick(arr, weights) {
    var total = 0;
    for (var i = 0; i < weights.length; i++) total += (weights[i] || 1);
    var r = Math.random() * total;
    var sum = 0;
    for (var j = 0; j < arr.length; j++) {
      sum += (weights[j] || 1);
      if (r <= sum) return arr[j];
    }
    return arr[0];
  }

  function selectProxy(category) {
    var proxy = weightedPick(CONFIG.PROXY_HOSTS, CONFIG.PROXY_HOSTS.map(function(p){ return p.weight; }));
    var port = weightedPick(CONFIG.PORTS[category], CONFIG.PORT_WEIGHTS[category]);
    return proxy.type + " " + proxy.host + ":" + port;
  }

  function requireJordan(category, host) {
    var ip = dnsResolve(host);
    if (ip && ipInJordan(ip)) return selectProxy(category);
    return CONFIG.BLOCK_REPLY; // no DIRECT fallback
  }

  function matchCategory(hostname, url, patterns) {
    for (var i = 0; i < patterns.domains.length; i++) {
      if (shExpMatch(hostname, patterns.domains[i])) return true;
    }
    for (var j = 0; j < patterns.urls.length; j++) {
      if (shExpMatch(url, patterns.urls[j])) return true;
    }
    return false;
  }

  // ---------------- PUBG Pattern Rules ----------------

  var PATTERNS = {
    LOBBY: {
      domains: ["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com"],
      urls: ["*/account/login*", "*/client/version*", "*/presence/*", "*/friends/*"]
    },
    MATCH: {
      domains: ["*.gcloud.qq.com", "gpubgm.com"],
      urls: ["*/matchmaking/*", "*/mms/*", "*/game/start*", "*/game/join*"]
    },
    RECRUIT_SEARCH: {
      domains: ["match.igamecj.com", "teamfinder.proximabeta.com"],
      urls: ["*/teamfinder/*", "*/clan/*", "*/recruit/*"]
    },
    UPDATES: {
      domains: ["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com"],
      urls: ["*/update*", "*/patch*", "*/download*", "*/assets/*"]
    },
    CDNs: {
      domains: ["cdn.proximabeta.com", "*.qcloudcdn.com", "*.cloudfront.net"],
      urls: ["*/cdn/*", "*/media/*", "*/video/*", "*/res/*"]
    }
  };

  // ---------------- GEO Validation ----------------

  var myIP = myIpAddress();
  if (!ipInJordan(myIP)) {
    return CONFIG.BLOCK_REPLY; // block if client IP not Jordanian
  }

  // ---------------- Main Logic ----------------

  for (var cat in PATTERNS) {
    if (matchCategory(host, url, PATTERNS[cat])) {
      if (CONFIG.STRICT_JO_FOR.indexOf(cat) !== -1) {
        return requireJordan(cat, host);
      }
      return selectProxy(cat);
    }
  }

  var dst = dnsResolve(host);
  if (dst && ipInJordan(dst)) {
    return selectProxy("LOBBY");
  }

  // no DIRECT fallback anywhere
  return CONFIG.BLOCK_REPLY;
}
