// PUBG Jordanian Ultra Optimization PAC v4.15
// Rotates every second across all JO_BASE_RANGES
// Priority group: 94.249.x.x
// Updated: October 20, 2025

function FindProxyForURL(url, host) {

  const CONFIG = {
    PROXY_HOSTS: [
      { host: "91.106.109.12", weight: 5, type: "HTTPS" }
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

    // 🔁 Jordanian Ranges (rotate 1 IP per second)
    JO_BASE_RANGES: [
      // 🟩 Priority ranges (94.249.x.x)
      ["94.249.0.0",   "94.249.0.255"],
      ["94.249.71.0",  "94.249.71.255"],
      ["94.249.76.0",  "94.249.76.255"],
      ["94.249.88.0",  "94.249.88.255"],
      ["94.249.89.0",  "94.249.89.255"],
      ["94.249.126.0", "94.249.126.255"],

      // 86.108.x.x ranges
      ["86.108.103.0", "86.108.103.255"],
      ["86.108.63.0",  "86.108.63.255"],
      ["86.108.88.0",  "86.108.88.255"],
      ["86.108.11.0",  "86.108.11.255"],
      ["86.108.81.0",  "86.108.81.255"],

      // 213.139.x.x ranges
      ["213.139.38.0", "213.139.38.255"],
      ["213.139.42.0", "213.139.42.255"],
      ["213.139.41.0", "213.139.41.255"],
      ["213.139.43.0", "213.139.43.255"],
      ["213.139.57.0", "213.139.57.255"],

      // 46.185.x.x ranges
      ["46.185.130.0", "46.185.130.255"],
      ["46.185.135.0", "46.185.135.255"],
      ["46.185.143.0", "46.185.143.255"],
      ["46.185.192.0", "46.185.192.255"]
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

  function sizeOfRange(r) {
    var s = ipToInt(r[0]);
    var e = ipToInt(r[1]);
    if (s < 0 || e < 0 || e < s) return 0;
    return (e - s + 1);
  }

  function currentJoRanges() {
    var base = CONFIG.JO_BASE_RANGES;
    var total = 0, sizes = [];
    for (var i = 0; i < base.length; i++) {
      var sz = sizeOfRange(base[i]);
      sizes.push(sz);
      total += sz;
    }
    if (total <= 0) return base.slice();

    var ptr = Math.floor(Date.now() / 1000) % total; // 1 IP per second
    var acc = 0, headIndex = 0;
    for (var j = 0; j < base.length; j++) {
      var nextAcc = acc + sizes[j];
      if (ptr < nextAcc) { headIndex = j; break; }
      acc = nextAcc;
    }

    var out = [];
    for (var k = 0; k < base.length; k++) {
      out.push(base[(headIndex + k) % base.length]);
    }
    return out;
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
    return CONFIG.BLOCK_REPLY;
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
    return CONFIG.BLOCK_REPLY;
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

  return CONFIG.BLOCK_REPLY;
}
