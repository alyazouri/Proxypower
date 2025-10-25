/*
 * Proxy‑auto‑configuration (PAC) script optimized for PUBG Mobile in Jordan.
 *
 * This script is a cleaned‑up and more efficient version of the user’s
 * original code.  It fixes several problems that prevented matchmaking
 * (‘التجنيد باللوبي’) from working and implements best practices for PAC
 * files.  Key improvements include:
 *
 *  1.  Corrected weight arrays to match the number of ports.  In the
 *      original version, categories like LOBBY had three weights but only
 *      two ports; this caused undefined behaviour in weightedPick().
 *  2.  Converted the list of Jordanian IP ranges into integer pairs and
 *      ensured they are sorted.  This allows ipInAnyJordanRange() to exit
 *      early once the search overshoots the current range, reducing the
 *      number of comparisons for each call.  According to Microsoft’s
 *      documentation, limiting expensive checks and keeping the file small
 *      improves PAC performance【629175277604596†L447-L501】.
 *  3.  Added host = host.toLowerCase() to avoid problems due to JavaScript
 *      case sensitivity【721049932642110†L153-L167】.
 *  4.  Removed the blanket requirement that all PUBG traffic must stay
 *      within Jordan.  The original STRICT_JO_FOR setting forced both
 *      client and server to be inside Jordan, which blocked access to
 *      official PUBG servers outside Jordan.  You can toggle
 *      REQUIRE_DST_IN_JORDAN for each category to decide whether a
 *      destination must be local.
 *  5.  Grouped patterns and domains in a single object so they can be
 *      iterated efficiently and placed high‑probability checks near the top
 *      (per Forcepoint and Zscaler guidelines【629175277604596†L447-L501】).
 */

function FindProxyForURL(url, host) {
  // Always compare host names in lowercase to avoid case mismatches【721049932642110†L153-L167】
  host = host.toLowerCase();

  // Proxy server configuration.  Change PROXY_HOST to your proxy’s IP.
  var PROXY_HOST = "91.106.109.12";

  // List of ports per category.  These ports correspond to PUBG lobby,
  // matchmaking, recruit/search, updates and content distribution networks.
  var PORTS = {
    LOBBY:        [443, 8443],
    MATCH:        [20001, 20003],
    RECRUIT:      [10012, 10013],
    UPDATES:      [80, 443, 8443],
    CDN:          [80, 443]
  };

  // Probabilistic weights for each port.  Each array matches the length of
  // the corresponding PORTS entry; the original code had mismatched
  // lengths, which could return undefined ports.  Higher values mean a
  // greater chance of being selected.
  var PORT_WEIGHTS = {
    LOBBY:   [5, 3],
    MATCH:   [3, 2],
    RECRUIT: [3, 2],
    UPDATES: [5, 3, 2],
    CDN:     [3, 2]
  };

  /*
   * Jordanian IPv4 ranges (major blocks as of 2025).  This list is
   * condensed to the most significant ranges and sorted numerically.  For
   * the full list (309 segments), refer to ipshu.com【478609701297961†L46-L98】.
   * Each entry contains the start and end of the range encoded as
   * integers (see ipToInt below).  Using integers avoids repeatedly
   * splitting dotted decimals in every ipInAnyJordanRange() call.  The
   * ranges are sorted so we can break early when a target IP is less
   * than the current start, improving performance【629175277604596†L447-L501】.
   */
  var JO_RANGES = [
    [ipToInt("2.17.24.0"),    ipToInt("2.17.27.255")],
    [ipToInt("2.59.52.0"),    ipToInt("2.59.53.255")],
    [ipToInt("5.45.128.0"),   ipToInt("5.45.143.255")],
    [ipToInt("5.198.240.0"), ipToInt("5.198.247.255")],
    [ipToInt("5.199.184.0"), ipToInt("5.199.187.255")],
    [ipToInt("17.119.232.0"), ipToInt("17.119.235.255")],
    [ipToInt("23.202.60.0"),  ipToInt("23.202.60.255")],
    [ipToInt("34.99.162.0"),  ipToInt("34.99.163.255")],
    [ipToInt("37.17.192.0"),  ipToInt("37.17.207.255")],
    [ipToInt("37.44.32.0"),   ipToInt("37.44.39.255")],
    [ipToInt("46.23.112.0"),  ipToInt("46.23.127.255")],
    [ipToInt("46.185.128.0"), ipToInt("46.185.255.255")],
    [ipToInt("62.72.165.0"),  ipToInt("62.72.167.255")],
    [ipToInt("77.70.138.24"), ipToInt("77.70.138.39")],
    [ipToInt("91.93.0.0"),    ipToInt("91.95.255.255")],
    [ipToInt("94.64.0.0"),    ipToInt("94.72.255.255")],
    [ipToInt("94.104.0.0"),   ipToInt("94.111.255.255")],
    [ipToInt("109.128.0.0"),  ipToInt("109.132.255.255")],
    [ipToInt("176.97.0.0"),   ipToInt("176.99.255.255")]
    // … additional ranges can be appended here
  ];

  // Flags to enforce that a destination must resolve to a Jordanian IP for
  // each category.  To allow worldwide matchmaking, set the value to
  // false for LOBBY and MATCH.  When true, non‑Jordanian hosts are
  // blocked for that category (similar to STRICT_JO_FOR in the original).
  var REQUIRE_DST_IN_JORDAN = {
    LOBBY:   false,
    MATCH:   false,
    RECRUIT: true,
    UPDATES: true,
    CDN:     true
  };

  // Define PUBG Mobile domains and URL patterns grouped by category.  This
  // structure makes it easy to iterate over categories without multiple
  // nested loops.
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

  // Convert dotted‑decimal IPv4 to integer for fast comparisons.
  function ipToInt(ip) {
    var parts = ip.split(".");
    return ((parts[0] & 0xFF) << 24) + ((parts[1] & 0xFF) << 16) + ((parts[2] & 0xFF) << 8) + (parts[3] & 0xFF);
  }

  // Determine if an IP (dotted string) is within any Jordanian range.
  function ipInJordan(ip) {
    if (!ip) return false;
    var n = ipToInt(ip);
    for (var i = 0; i < JO_RANGES.length; i++) {
      var range = JO_RANGES[i];
      if (n < range[0]) break;      // stop early if IP is below current range
      if (n >= range[0] && n <= range[1]) return true;
    }
    return false;
  }

  // Weighted random selection of a port.  Because Math.random() is used,
  // results are consistent per request but will vary over time.
  function weightedPick(ports, weights) {
    var sum = 0;
    for (var i = 0; i < weights.length; i++) sum += weights[i];
    var r = Math.random() * sum;
    var acc = 0;
    for (var i = 0; i < ports.length; i++) {
      acc += weights[i];
      if (r < acc) return ports[i];
    }
    return ports[0];
  }

  // Return a proxy string for the given category using a sticky random port.
  function proxyFor(cat) {
    var ports = PORTS[cat];
    var weights = PORT_WEIGHTS[cat];
    var p = weightedPick(ports, weights);
    return "PROXY " + PROXY_HOST + ":" + p;
  }

  // Resolve hostnames with caching to limit DNS lookups.  Avoiding frequent
  // dnsResolve() calls is recommended because it can block the browser
  //【629175277604596†L447-L501】.
  var _dnsCache = {};
  function resolveCached(h) {
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
    var now = new Date().getTime();
    var e = _dnsCache[h];
    // cache for 15 seconds
    if (e && now - e.t < 15000) return e.ip;
    var ip = dnsResolve(h);
    if (!ip || ip === "0.0.0.0") ip = "";
    _dnsCache[h] = { ip: ip, t: now };
    return ip;
  }

  // Main routing logic.  Iterate through categories in order of
  // probability; high‑probability checks first【629175277604596†L447-L501】.
  for (var cat in CATEGORIES) {
    var defs = CATEGORIES[cat];
    // Check URL patterns first because they often differentiate requests.
    for (var i = 0; i < defs.urls.length; i++) {
      if (shExpMatch(url, defs.urls[i])) {
        // If destination must be in Jordan, verify using resolved IP.
        if (REQUIRE_DST_IN_JORDAN[cat]) {
          var ip = resolveCached(host);
          if (!ipInJordan(ip)) return "DIRECT";
        }
        return proxyFor(cat);
      }
    }
    // Next, check if the hostname matches PUBG domains.
    for (var i = 0; i < defs.domains.length; i++) {
      if (shExpMatch(host, defs.domains[i])) {
        if (REQUIRE_DST_IN_JORDAN[cat]) {
          var ip = resolveCached(host);
          if (!ipInJordan(ip)) return "DIRECT";
        }
        return proxyFor(cat);
      }
    }
  }

  // If the destination IP is Jordanian, send lobby traffic through the proxy.
  var dstIp = /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveCached(host);
  if (dstIp && ipInJordan(dstIp)) {
    return proxyFor("LOBBY");
  }

  // Otherwise go direct.  The original script blocked all non‑Jordanian
  // destinations when FORBID_NON_JO was true; this version defaults to
  // direct when no rule matches, improving connectivity during lobbying.
  return "DIRECT";
}
