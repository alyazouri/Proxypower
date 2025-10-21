// PUBG Jordanian Ultra Optimization PAC v6.0 (IPv6-only, no DIRECT)
// Range enforced: 2a03:6b00::/32
// Updated: October 20, 2025

function FindProxyForURL(url, host) {
  const CONFIG = {
    PROXY_HOSTS: [
      // استخدم IPv6 للبروكسي إن توفر لديك: مثال => { host: "[2a00:xxxx:...]", weight: 5, type: "HTTPS" }
      { host: "91.106.109.12", weight: 5, type: "HTTPS" } // current proxy (IPv4 OK)
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

    // IPv6 prefix to allow: 2a03:6b00::/32  => first two hextets must be 2a03:6b00
    ALLOW_V6_H1: "2a03",
    ALLOW_V6_H2: "6b00",

    STRICT_V6_FOR: ["LOBBY", "MATCH", "RECRUIT_SEARCH"],
    BLOCK_REPLY: "PROXY 0.0.0.0:0"
  };

  // ---------------- IPv6 Helpers ----------------
  function isIPv6(addr) {
    return addr && addr.indexOf(":") !== -1;
  }

  function stripZone(addr) {
    // remove %eth0 etc.
    var i = addr.indexOf("%");
    return i >= 0 ? addr.substring(0, i) : addr;
  }

  // expand compressed IPv6 to 8 hextets (lowercase, no zone)
  function expandIPv6(addr) {
    addr = stripZone(addr).toLowerCase();
    // handle :: shorthand
    var parts = addr.split("::");
    if (parts.length > 2) return null;

    var head = parts[0] ? parts[0].split(":") : [];
    var tail = (parts.length === 2 && parts[1]) ? parts[1].split(":") : [];

    // validate hextets
    function pad16(h) {
      if (h === "") return "0";
      var m = /^[0-9a-f]{1,4}$/.test(h);
      return m ? h : null;
    }

    for (var i = 0; i < head.length; i++) { head[i] = pad16(head[i]); if (head[i] === null) return null; }
    for (var j = 0; j < tail.length; j++) { tail[j] = pad16(tail[j]); if (tail[j] === null) return null; }

    var missing = 8 - (head.length + tail.length);
    if (parts.length === 1) {
      // no '::', must already be 8
      if (missing !== 0) return null;
      return head;
    } else {
      if (missing < 0) return null;
      var zeros = [];
      for (var z = 0; z < missing; z++) zeros.push("0");
      return head.concat(zeros, tail);
    }
  }

  // check if IPv6 addr is within 2a03:6b00::/32 => first two hextets equal
  function inAllowedV6(addr) {
    if (!isIPv6(addr)) return false;
    var hex = expandIPv6(addr);
    if (!hex || hex.length !== 8) return false;
    return (hex[0] === CONFIG.ALLOW_V6_H1 && hex[1] === CONFIG.ALLOW_V6_H2);
  }

  // -------------- Generic Helpers --------------
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
    // If proxy host is an IPv6 literal, ensure it's bracketed already (user should provide "[...]" form)
    return proxy.type + " " + proxy.host + ":" + port;
  }

  function requireAllowedV6(category, hostname) {
    var addrs = [];
    if (typeof dnsResolveEx === "function") {
      // returns CSV "ip,ip,ip"
      var csv = dnsResolveEx(hostname);
      if (csv) addrs = csv.split(/[,;]/);
    } else {
      // fallback (IPv4-only resolver); will fail the v6 check
      var a4 = dnsResolve(hostname);
      if (a4) addrs = [a4];
    }

    for (var i = 0; i < addrs.length; i++) {
      var a = stripZone(addrs[i].trim());
      if (inAllowedV6(a)) return selectProxy(category);
    }
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

  // ---------------- PUBG Patterns ----------------
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

  // ---------------- Client IPv6 Gate ----------------
  // لاعب ببجي لازم يكون ضمن الرينج 2a03:6b00::/32
  var clientOK = false;
  if (typeof myIpAddressEx === "function") {
    var list = myIpAddressEx(); // "ip,ip,ip"
    if (list) {
      var ips = list.split(/[,;]/);
      for (var i = 0; i < ips.length; i++) {
        if (inAllowedV6(ips[i].trim())) { clientOK = true; break; }
      }
    }
  } else {
    // old engines: can't verify IPv6 -> اعتبره غير مطابق
    clientOK = false;
  }
  if (!clientOK) return CONFIG.BLOCK_REPLY;

  // ---------------- Main Logic ----------------
  for (var cat in PATTERNS) {
    if (matchCategory(host, url, PATTERNS[cat])) {
      if (CONFIG.STRICT_V6_FOR.indexOf(cat) !== -1) {
        return requireAllowedV6(cat, host);
      }
      // للفئات غير الصارمة، برضه نتحقق من أن الوجهة ضمن الرينج
      return requireAllowedV6(cat, host);
    }
  }

  // fallback: إن كان الدستينيشن ضمن الرينج، مرره كبروكسي لوجبة LOBBY
  var fallback = requireAllowedV6("LOBBY", host);
  return fallback;
}
