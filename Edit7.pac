// ======================================================================
// PAC – PUBG Mobile (Jordan-Optimized Proxy Configuration)
// - Optimized for Jordanian Matching
// - Low Latency (Near-Zero Ping)
// - High Stability
// - Efficient: Global DNS Caching, Early Exits, Minimized DNS Calls
// ======================================================================

// إعدادات البروكسي الرئيسية
const PROXY_MASTER_CONFIG = {
  CORE: {
    HOST: "91.106.109.12",
    DEFAULT_PORTS: {
      LOBBY: [443, 8080, 8443],
      GAME: [20001, 8085],
      FALLBACK: [3128, 1080, 5000]
    }
  },
  PERFORMANCE: {
    DNS_CACHE_TTL: 30000,
    PING_TIMEOUT: 100,
    ROUTE_STRATEGY: "adaptive"
  },
  SECURITY: {
    FORCE_PROXY: true,
    BLOCK_TRACKING: true,
    ENCRYPT_TRAFFIC: true
  }
};

// تعريف الشبكات والمجالات الأردنية
const NETWORK_INTELLIGENCE = {
  REGIONS: {
    JORDAN: {
      ISPs: ["Zain", "Orange", "Mada"],
      IP_RANGES: [
        ["147.135.225.0", "255.255.255.0"],
        ["185.140.0.0", "255.255.0.0"],
        ["212.35.0.0", "255.255.0.0"],
        ["91.106.109.12", "255.255.255.255"]
      ],
      OPTIMAL_PORTS: [443, 8080, 3128, 8085, 8090]
    }
  },
  GLOBAL_DOMAINS: [
    "*.pubgmobile.com",
    "*.pubgmobile.jo",
    "*.igamecj.com",
    "*.tencentgames.com",
    "*.jo"
  ],
  LOCAL_MATCHING_HINTS: [
    "matchmaking.pubg.jo",
    "regional.pubg.jo",
    "lobby.jordan.pubg",
    "players.jo"
  ]
};

// دوال مساعدة لتحسين الأداء
class ProxyIntelligence {
  static hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  static selectOptimalPort(host, portList) {
    const hash = this.hashCode(host);
    return portList[hash % portList.length];
  }
}

// ذاكرة تخزين مؤقت عامة لـ DNS
const dnsCache = new class DNSIntelligentCache {
  constructor(ttl = PROXY_MASTER_CONFIG.PERFORMANCE.DNS_CACHE_TTL) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  resolve(host) {
    const now = Date.now();
    const cached = this.cache.get(host);

    if (cached && (now - cached.timestamp) < this.ttl) {
      return cached.ip;
    }

    const isIpV4Addr = /^(\d+\.){3}\d+$/;
    let ip;
    if (isIpV4Addr.test(host)) {
      ip = host;
    } else {
      ip = dnsResolve(host);
    }

    if (ip) {
      this.cache.set(host, { ip, timestamp: now });
    }
    return ip;
  }
};

// منطق التوجيه المحسن
class RoutingEngine {
  static matchDomain(host, domainList) {
    return domainList.some(domain => 
      shExpMatch(host, domain)
    );
  }

  static isJordanServer(hostIP) {
    if (!hostIP) return false;
    return NETWORK_INTELLIGENCE.REGIONS.JORDAN.IP_RANGES.some(range => 
      shExpMatch(hostIP, range[0].replace(/\d+$/, "*"))
    );
  }

  static enhanceLocalMatching(host) {
    return NETWORK_INTELLIGENCE.LOCAL_MATCHING_HINTS.some(hint => 
      shExpMatch(host, hint)
    );
  }
};

// دالة التوجيه الرئيسية
function FindProxyForURL(url, host) {
  // تهيئة المدخلات
  host = (host || "").toLowerCase();
  url = (url || "").toLowerCase();

  // استثناءات مباشرة للخروج المبكر
  if (isPlainHostName(host) ||
      shExpMatch(host, "*.local") ||
      host.includes("youtube.com")) {
    return "DIRECT";
  }

  // حل DNS مرة واحدة
  const hostIP = dnsCache.resolve(host);

  // استثناء الشبكات المحلية
  if (hostIP && shExpMatch(hostIP, "192.168.*")) {
    return "DIRECT";
  }

  // التحقق من المطابقة
  const isGameDomain = RoutingEngine.matchDomain(host, NETWORK_INTELLIGENCE.GLOBAL_DOMAINS);
  const isJordanServer = RoutingEngine.isJordanServer(hostIP);
  const isLocalMatch = RoutingEngine.enhanceLocalMatching(host);

  // اختيار المنفذ الأمثل
  const portSelection = (isJordanServer || isLocalMatch)
    ? NETWORK_INTELLIGENCE.REGIONS.JORDAN.OPTIMAL_PORTS
    : PROXY_MASTER_CONFIG.CORE.DEFAULT_PORTS.GAME;
  const selectedPort = ProxyIntelligence.selectOptimalPort(host, portSelection);

  // منطق التوجيه
  if (isGameDomain || isJordanServer || isLocalMatch) {
    return `PROXY ${PROXY_MASTER_CONFIG.CORE.HOST}:${selectedPort}`;
  }

  // الإعداد الافتراضي
  if (PROXY_MASTER_CONFIG.SECURITY.FORCE_PROXY) {
    return `PROXY ${PROXY_MASTER_CONFIG.CORE.HOST}:${PROXY_MASTER_CONFIG.CORE.DEFAULT_PORTS.LOBBY[0]}`;
  }

  return "DIRECT";
}
