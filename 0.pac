// ============================================================
// GAME BOOSTER ALPHA v2.1 — JORDAN ONLY MODE 2026
// Recruitment / Team / Opponent — All from Jordan (JORDAN_RANGES)
// ============================================================

var CONFIG = {
  MATCH_TIER1: "PROXY 46.185.131.218:20001",
  MATCH_TIER2: "PROXY 212.35.66.45:8085",
  MATCH_TIER3: "PROXY 46.185.131.218:443",
  MATCH_TIER4: "PROXY 212.35.66.45:8181",
  LOBBY_FAST: [
    "PROXY 212.35.66.45:8181",
    "PROXY 46.185.131.218:443",
    "PROXY 212.35.66.45:8085",
    "PROXY 46.185.131.218:20001"
  ],
  VOICE_PROXY: "PROXY 46.185.131.218:20001",
  CDN_DIRECT: "DIRECT",
  BLOCK: "PROXY 127.0.0.1:9",
  DIRECT: "DIRECT",
  DNS_CACHE_TIME: 600000,
  STICKY_SESSION_TIME: 1800000,
  AGGRESSIVE_BLOCK: true,
  // JORDAN ONLY: block any non-Jordan IP for match/lobby/social
  JORDAN_ONLY_MATCH: true,
  JORDAN_ONLY_TEAM: true
};

var JORDAN_RANGES = [
  ["46.185.0.0","255.255.0.0"],["46.32.0.0","255.255.0.0"],["178.77.0.0","255.255.0.0"],
  ["176.29.0.0","255.255.0.0"],["217.23.0.0","255.255.0.0"],["77.245.0.0","255.255.0.0"],
  ["176.28.0.0","255.255.0.0"],["213.202.0.0","255.255.0.0"],["178.76.0.0","255.255.0.0"],
  ["188.161.0.0","255.255.0.0"],["37.202.0.0","255.255.0.0"],["85.159.0.0","255.255.0.0"],
  ["93.93.0.0","255.255.0.0"],["93.95.0.0","255.255.0.0"],["212.34.0.0","255.255.0.0"],
  ["194.165.130.0","255.255.255.0"],["79.134.0.0","255.255.0.0"],["79.173.0.0","255.255.0.0"],
  ["185.162.0.0","255.255.0.0"],["37.252.0.0","255.255.0.0"],["94.127.0.0","255.255.0.0"],
  ["176.57.0.0","255.255.0.0"],["188.123.0.0","255.255.0.0"],["188.247.0.0","255.255.0.0"],
  ["185.80.0.0","255.255.0.0"],["5.45.128.0","255.255.128.0"],["212.118.0.0","255.255.0.0"],
  ["149.200.0.0","255.255.0.0"],["149.201.0.0","255.255.0.0"],["31.5.0.0","255.255.0.0"],
  ["195.8.0.0","255.255.0.0"],["31.0.0.0","255.0.0.0"],["83.0.0.0","255.0.0.0"],["37.0.0.0","255.0.0.0"]
];

// ... rest of functions identical (cleanHost, matchesNetwork, isInRangeList, fastResolve, etc.)
// For brevity, include key routing with Jordan-only enforcement:

function FindProxyForURL(url, host) {
  host = cleanHost(host.toLowerCase());
  if (!isPUBGTraffic(host)) return CONFIG.DIRECT;
  var ip = fastResolve(host);
  if (!ip || ip.indexOf(':') !== -1) { SESSION.counters.blockedRequests++; return CONFIG.BLOCK; }
  if (CONFIG.AGGRESSIVE_BLOCK && isInRangeList(ip, HIGH_LATENCY_RANGES)) { SESSION.counters.blockedRequests++; return CONFIG.BLOCK; }

  // MATCH = OPPONENT — must be Jordan
  if (isMatchTraffic(url, host)) {
    SESSION.counters.matchRequests++;
    if (!isInRangeList(ip, JORDAN_RANGES)) return CONFIG.BLOCK; // OPPONENT FROM JORDAN ONLY
    // ... rest of match logic (same tiered proxies)
    if (!SESSION.match.locked) { SESSION.match.networkPrefix = getNetworkPrefix(ip); SESSION.match.hostname = host; SESSION.match.proxy = CONFIG.MATCH_TIER1; SESSION.match.startTime = new Date().getTime(); SESSION.match.locked = true; return CONFIG.MATCH_TIER1 + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3 + "; " + CONFIG.MATCH_TIER4; }
    if (host === SESSION.match.hostname && getNetworkPrefix(ip) === SESSION.match.networkPrefix) return SESSION.match.proxy + "; " + CONFIG.MATCH_TIER2 + "; " + CONFIG.MATCH_TIER3;
    if (getNetworkPrefix(ip) === SESSION.match.networkPrefix) return SESSION.match.proxy + "; " + CONFIG.MATCH_TIER2;
    return CONFIG.BLOCK;
  }

  // LOBBY / TEAM / RECRUIT — must be Jordan
  if (isLobbyTraffic(url, host) || isSocialTraffic(url, host)) {
    SESSION.counters.lobbyRequests++;
    if (!isInRangeList(ip, JORDAN_RANGES)) return CONFIG.BLOCK; // TEAM / RECRUIT FROM JORDAN ONLY
    return selectLobbyProxy(host, ip) + "; " + CONFIG.LOBBY_FAST[0] + "; " + CONFIG.MATCH_TIER1 + "; " + CONFIG.DIRECT;
  }

  // Voice / CDN / analytics as before
  if (isVoiceTraffic(url, host)) { return CONFIG.VOICE_PROXY; }
  if (isCDNTraffic(url, host)) return CONFIG.CDN_DIRECT;
  if (isAnalyticsTraffic(url, host)) return CONFIG.DIRECT;
  if (isInRangeList(ip, JORDAN_RANGES)) return selectLobbyProxy(host, ip) + "; " + CONFIG.LOBBY_FAST[0] + "; " + CONFIG.DIRECT;
  SESSION.counters.blockedRequests++;
  return CONFIG.BLOCK;
}
