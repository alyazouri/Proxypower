/**
 * Highly Efficient Proxy Auto-Configuration (PAC) script for PUBG traffic routing.
 * Optimized for performance with minimal lookups, efficient caching, and early termination.
 * Version: 4.0 (Performance Optimized)
 * Last Updated: October 20, 2025
 */
(function () {
  // Configuration
  const CONFIG = {
    PROXY_HOSTS: [
      { host: "91.106.109.12", weight: 5, type: "HTTPS" },
      { host: "91.106.109.13", weight: 3, type: "PROXY" }
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
    JO_IP_RANGES: new Set([
      "94.249.0.0/17",
     "109.107.224.0/19"
    ]),
    PREFERRED_MATCH_RANGE: ["91.106.96.0", "91.106.111.255"],
    STRICT_JO_FOR: new Set(["LOBBY", "MATCH", "RECRUIT_SEARCH"]),
    FORBID_NON_JO: true,
    BLOCK_REPLY: "PROXY 0.0.0.0:0",
    STICKY_SALT: "JO_STICKY",
    STICKY_TTL_MINUTES: 30,
    HOST_RESOLVE_TTL_MS: 120 * 1000, // زيادة TTL لتقليل DNS calls
    DST_RESOLVE_TTL_MS: 60 * 1000,
    CACHE_MAX_SIZE: 50 // تقليل حجم الـ cache
  };

  const PUBG_PATTERNS = {
    LOBBY: { domains: new Set(["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com"]), urls: ["*/account/login*", "*/client/version*", "*/status/heartbeat*", "*/presence/*", "*/friends/*"] },
    MATCH: { domains: new Set(["*.gcloud.qq.com", "gpubgm.com"]), urls: ["*/matchmaking/*", "*/mms/*", "*/game/start*", "*/game/join*", "*/report/battle*"] },
    RECRUIT_SEARCH: { domains: new Set(["match.igamecj.com", "match.proximabeta.com", "teamfinder.igamecj.com", "teamfinder.proximabeta.com"]), urls: ["*/teamfinder/*", "*/clan/*", "*/social/*", "*/search/*", "*/recruit/*"] },
    UPDATES: { domains: new Set(["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com", "hotfix.proximabeta.com", "dlied1.qq.com", "dlied2.qq.com", "gpubgm.com"]), urls: ["*/patch*", "*/hotfix*", "*/update*", "*/download*", "*/assets/*", "*/assetbundle*", "*/obb*"] },
    CDNs: { domains: new Set(["cdn.igamecj.com", "cdn.proximabeta.com", "cdn.tencentgames.com", "*.qcloudcdn.com", "*.cloudfront.net", "*.edgesuite.net"]), urls: ["*/cdn/*", "*/static/*", "*/image/*", "*/media/*", "*/video/*", "*/res/*", "*/pkg/*"] }
  };

  // Cache Management with LRU
  const CACHE = (function () {
    const root = (typeof globalThis !== "undefined" ? globalThis : this);
    if (!root._PAC_CACHE) root._PAC_CACHE = {
      DST_RESOLVE: new Map(), // Map لأداء أفضل
      PORT_STICKY: new Map(),
      CLIENT_GEO: null
    };
    return root._PAC_CACHE;
  })();

  // Utility Functions
  function ipToInt(ip) {
    if (!ip || !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return 0;
    return ip.split(".").reduce((acc, part, i) => acc + (parseInt(part) << (24 - i * 8)), 0);
  }

  function ipInAnyJordanRange(ip, preferPriority = false) {
    const ipNum = ipToInt(ip);
    if (!ipNum) return false;
    if (preferPriority) {
      const [start, end] = CONFIG.PREFERRED_MATCH_RANGE.map(ipToInt);
      if (ipNum >= start && ipNum <= end) return true;
    }
    for (const [start, end] of CONFIG.JO_IP_RANGES) {
      if (ipNum >= ipToInt(start) && ipNum <= ipToInt(end)) return true;
    }
    return false;
  }

  function matchesPattern(host, url, { domains, urls }) {
    return domains.has(host) || [...domains].some(d => shExpMatch(host, d) || host.endsWith(d.replace(/^\*\./, "."))) ||
           urls.some(u => shExpMatch(url, u));
  }

  function weightedPick(items, weights) {
    const total = weights.reduce((sum, w) => sum + (w || 1), 0, [0]);
    const r = Math.random() * total;
    let acc = 0;
    for (let i = 0; i < items.length; i++) {
      acc += weights[i] || 1;
      if (r <= acc) return items[i];
    }
    return items[0];
  }

  function selectProxyHost() {
    return weightedPick(CONFIG.PROXY_HOSTS, CONFIG.PROXY_HOSTS.map(p => p.weight));
  }

  function proxyForCategory(category) {
    const key = `${CONFIG.STICKY_SALT}_${category}`;
    const now = performance.now();
    const entry = CACHE.PORT_STICKY.get(key);
    if (entry && (now - entry.t) < CONFIG.STICKY_TTL_MINUTES * 60 * 1000) {
      return `${entry.type} ${entry.h}:${entry.p}; DIRECT`;
    }
    if (CACHE.PORT_STICK的事件.length > CONFIG.CACHE_MAX_SIZE) {
      CACHE.PORT_STICKY.delete(CACHE.PORT_STICKY.keys().next().value); // LRU eviction
    }
    const selected = selectProxyHost();
    const port = weightedPick(CONFIG.PORTS[category], CONFIG.PORT_WEIGHTS[category]);
    CACHE.PORT_STICKY.set(key, { h: selected.host, p: port, t: now, type: selected.type });
    return `${selected.type} ${selected.host}:${port}; DIRECT`;
  }

  function resolveDstCached(host) {
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return host;
    const now = performance.now();
    if (CACHE.DST_RESOLVE.size > CONFIG.CACHE_MAX_SIZE) {
      CACHE.DST_RESOLVE.delete(CACHE.DST_RESOLVE.keys().next().value); // LRU eviction
    }
    const entry = CACHE.DST_RESOLVE.get(host);
    if (entry && (now - entry.t) < CONFIG.DST_RESOLVE_TTL_MS) return entry.ip;
    const ip = dnsResolve(host) || "";
    CACHE.DST_RESOLVE.set(host, { ip, t: now });
    return ip;
  }

  function requireJordanDestination(category, host) {
    const ip = resolveDstCached(host);
    const preferPriority = category === "MATCH";
    if (!ipInAnyJordanRange(ip, preferPriority)) {
      return CONFIG.FORBID_NON_JO ? CONFIG.BLOCK_REPLY : "DIRECT";
    }
    return proxyForCategory(category);
  }

  // Main Proxy Logic
  function FindProxyForURL(url, host) {
    const now = performance.now();

    // Early client geo-check
    if (!CACHE.CLIENT_GEO || (now - CACHE.CLIENT_GEO.t) > CONFIG.STICKY_TTL_MINUTES * 60 * 1000) {
      CACHE.CLIENT_GEO = { ok: ipInAnyJordanRange(resolveDstCached(myIpAddress())), t: now };
    }
    if (!CACHE.CLIENT_GEO.ok || !CONFIG.PROXY_HOSTS.some(p => ipInAnyJordanRange(p.host))) {
      return CONFIG.FORBID_NON_JO ? CONFIG.BLOCK_REPLY : "DIRECT";
    }

    // Single-pass pattern matching
    for (const [category, patterns] of Object.entries(PUBG_PATTERNS)) {
      if (matchesPattern(host, url, patterns)) {
        return CONFIG.STRICT_JO_FOR.has(category) ? requireJordanDestination(category, host) : proxyForCategory(category);
      }
    }

    // IP-based fallback
    const dst = resolveDstCached(host);
    if (dst && ipInAnyJordanRange(dst)) {
      return proxyForCategory("LOBBY");
    }

    return "DIRECT";
  }

  // Cache cleanup (less frequent for efficiency)
  setInterval(() => {
    const now = performance.now();
    for (const [key, entry] of CACHE.DST_RESOLVE) {
      if (now - entry.t > CONFIG.DST_RESOLVE_TTL_MS) CACHE.DST_RESOLVE.delete(key);
    }
    for (const [key, entry] of CACHE.PORT_STICKY) {
      if (now - entry.t > CONFIG.STICKY_TTL_MINUTES * 60 * 1000) CACHE.PORT_STICKY.delete(key);
    }
  }, 10 * 60 * 1000);

  return FindProxyForURL;
})();
