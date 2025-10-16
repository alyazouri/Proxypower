function FindProxyForURL(url, host) {
  var FORCE_PROXY = "PROXY 91.106.109.12:20001; PROXY 91.106.109.12:443";

  // Jordanian IP ranges (West Amman subnets, restored from original WEST_AMMAN_24)
  var JORDAN_LOCAL = [
    ["86.108.0.0", "255.255.128.0"],    // /17
    ["37.202.67.0", "255.255.255.0"],   // /24
    ["37.220.112.0", "255.255.240.0"],  // /20
    ["91.106.104.0", "255.255.248.0"],  // /21
    ["92.241.32.0", "255.255.224.0"],   // /19
    ["95.172.192.0", "255.255.224.0"],  // /19
    ["46.185.128.0", "255.255.128.0"],  // /17
    ["79.173.192.0", "255.255.192.0"]   // /18
  ];

  // Force proxy for specific hosts
  if (isPlainHostName(host) ||
      shExpMatch(host, "localhost") ||
      shExpMatch(host, "*.google.com") ||
      shExpMatch(host, "google.com") ||
      shExpMatch(host, "*.youtube.com") ||
      shExpMatch(host, "youtube.com")) {
    return FORCE_PROXY;
  }

  // Allow DIRECT for local Jordanian IP ranges
  for (var i = 0; i < JORDAN_LOCAL.length; i++) {
    if (isInNet(host, JORDAN_LOCAL[i][0], JORDAN_LOCAL[i][1])) {
      return "DIRECT";
    }
  }

  // Fallback: force all non-local traffic to proxy
  return FORCE_PROXY;
}
