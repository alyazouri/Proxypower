// Jordan Performance PAC
// Safe, performance-focused PAC for latency-sensitive traffic.
// It does not alter game policies, matchmaking, recruitment, or regional access controls.

var CFG = {
  VERSION: "1.0.0-jordan-performance-full",

  // Preferred measured route from the last benchmark.
  // Update this if your real measurements change.
  PRIMARY_ROUTE: "DIRECT",

  // Ordered fallback routes.
  FALLBACK_ROUTES: [
    "PROXY 46.185.131.218:8443",
    "PROXY 109.237.193.45:443",
    "PROXY 212.35.66.45:20005",
    "DIRECT"
  ],

  // Domains you want to force through the measured-best route.
  // Replace/add your real latency-sensitive hosts here.
  LATENCY_SENSITIVE_DOMAINS: [
    "example-game-service.com",
    "example-latency-sensitive.com"
  ],

  // Always direct for common services.
  ALWAYS_DIRECT_DOMAINS: [
    "apple.com",
    "icloud.com",
    "google.com",
    "gstatic.com",
    "youtube.com",
    "ytimg.com",
    "facebook.com",
    "fbcdn.net",
    "instagram.com",
    "whatsapp.com",
    "telegram.org",
    "twitter.com",
    "x.com",
    "tiktok.com",
    "microsoft.com",
    "windowsupdate.com",
    "live.com",
    "office.com",
    "netflix.com",
    "spotify.com",
    "amazon.com",
    "cloudflare.com"
  ],

  // Common download/update/CDN traffic stays direct by default.
  DIRECT_PATTERNS: [
    "*://*.windowsupdate.com/*",
    "*://*.download.windowsupdate.com/*",
    "*://*.microsoft.com/*",
    "*://*.apple.com/*",
    "*://*.icloud.com/*",
    "*://*.akamaized.net/*",
    "*://*.steamcontent.com/*",
    "*://*.steamstatic.com/*"
  ]
};

function isPrivateIpv4(host) {
  return isInNet(host, "10.0.0.0", "255.0.0.0") ||
         isInNet(host, "172.16.0.0", "255.240.0.0") ||
         isInNet(host, "192.168.0.0", "255.255.0.0") ||
         isInNet(host, "127.0.0.0", "255.0.0.0") ||
         isInNet(host, "169.254.0.0", "255.255.0.0");
}

function hostEndsWith(host, suffix) {
  return dnsDomainIs(host, suffix) || shExpMatch(host, "*." + suffix);
}

function inDomainList(host, list) {
  for (var i = 0; i < list.length; i++) {
    if (hostEndsWith(host, list[i])) return true;
  }
  return false;
}

function matchesAnyPattern(url, patterns) {
  for (var i = 0; i < patterns.length; i++) {
    if (shExpMatch(url, patterns[i])) return true;
  }
  return false;
}

function buildRouteChain() {
  if (CFG.PRIMARY_ROUTE === "DIRECT") {
    return "DIRECT";
  }

  var chain = CFG.PRIMARY_ROUTE;
  for (var i = 0; i < CFG.FALLBACK_ROUTES.length; i++) {
    if (CFG.FALLBACK_ROUTES[i] !== CFG.PRIMARY_ROUTE) {
      chain += "; " + CFG.FALLBACK_ROUTES[i];
    }
  }
  return chain;
}

function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  url = url || "";

  if (!host || isPlainHostName(host)) return "DIRECT";

  if (isResolvable(host)) {
    var resolved = dnsResolve(host);
    if (resolved && isPrivateIpv4(resolved)) return "DIRECT";
  }

  if (inDomainList(host, CFG.ALWAYS_DIRECT_DOMAINS)) return "DIRECT";
  if (matchesAnyPattern(url, CFG.DIRECT_PATTERNS)) return "DIRECT";

  if (inDomainList(host, CFG.LATENCY_SENSITIVE_DOMAINS)) {
    return buildRouteChain();
  }

  return "DIRECT";
}
