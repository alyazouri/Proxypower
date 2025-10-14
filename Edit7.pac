// ======================================================================
// PAC – PUBG Mobile (Hyper-Optimized Proxy Configuration)
// - Ultra-Low Latency
// - Dynamic Proxy Selection
// - Enhanced Regional Support
// ======================================================================

const PROXY_MASTER_CONFIG = {
  CORE: {
    PRIMARY_HOST: "91.106.109.12", // خادم أساسي (استبدل بعنوان قريب)
    BACKUP_HOSTS: ["185.140.1.10", "212.35.2.15"], // خوادم احتياطية
    DEFAULT_PORTS: {
      LOBBY: [443, 8443], // منافذ قياسية لتقليل التأخير
      GAME: [20001, 20002],
      FALLBACK: [8080, 8085]
    }
  },
  PERFORMANCE: {
    DNS_CACHE_TTL: 20000, // تقليل TTL إلى 20 ثانية لتحديث أسرع
    PING_TIMEOUT: 80, // تقليل زمن انتظار الـ ping
    ROUTE_STRATEGY: "dynamic-low-latency"
  },
  SECURITY: {
    FORCE_PROXY: true,
    BLOCK_TRACKING: true,
    ENCRYPT_TRAFFIC: true,
    PRIORITIZE_IPV4: true // تفضيل IPv4 لاستقرار أفضل
  }
};

// Advanced Network Intelligence
const NETWORK_INTELLIGENCE = {
  REGIONS: {
    JORDAN: {
      ISPs: ["Zain", "Orange", "Mada", "Umniah"],
      IP_RANGES: [
        ["185.140.0.0", "255.255.0.0"],
        ["212.35.0.0", "255.255.0.0"],
        ["109.107.0.0", "255.255.0.0"] // إضافة نطاق لـ Umniah
      ],
      OPTIMAL_PORTS: [443, 8443, 8080], // منافذ محسّنة
      PING_THRESHOLD: 50 // عتبة ping لاختيار الخادم (مللي ثانية)
    },
    MIDDLE_EAST: {
      IP_RANGES: [
        ["185.25.0.0", "255.255.0.0"], // نطاقات خوادم الشرق الأوسط
        ["151.253.0.0", "255.255.0.0"]
      ],
      OPTIMAL_PORTS: [443, 20001]
    }
  },
  GLOBAL_DOMAINS: [
    "*.pubgmobile.com",
    "*.igamecj.com",
    "*.tencentgames.com",
    "*.pubg.com"
  ]
};

// Hyper-Optimized Utility Functions
class ProxyIntelligence {
  static hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // تحسين الأداء
    }
    return Math.abs(hash);
  }

  static selectOptimalPort(host, portList) {
    return portList[this.hashCode(host) % portList.length];
  }

  static async detectNetworkQuality(host, timeout = PROXY_MASTER_CONFIG.PERFORMANCE.PING_TIMEOUT) {
    const startTime = Date.now();
    try {
      const ip = await dnsResolveAsync(host); // استخدام DNS غير متزامن
      const endTime = Date.now();
      return {
        ping: endTime - startTime,
        resolvedIP: ip,
        isReachable: !!ip
      };
    } catch (e) {
      return { ping: Infinity, resolvedIP: null, isReachable: false };
    }
  }

  static selectBestProxy(host, proxies) {
    // اختيار أفضل خادم بناءً على الـ ping
    return proxies.reduce((best, current) => {
      const quality = this.detectNetworkQuality(current.host).then(q => ({
        host: current.host,
        port: current.port,
        ping: q.ping
      }));
      return quality.ping < best.ping ? quality : best;
    }, { host: PROXY_MASTER_CONFIG.CORE.PRIMARY_HOST, port: 443, ping: Infinity });
  }
}

// Advanced DNS Caching Mechanism
class DNSIntelligentCache {
  constructor(ttl = PROXY_MASTER_CONFIG.PERFORMANCE.DNS_CACHE_TTL) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  async resolve(host) {
    const now = Date.now();
    const cached = this.cache.get(host);

    if (cached && (now - cached.timestamp) < this.ttl) {
      return cached.ip;
    }

    const ip = await dnsResolveAsync(host);
    if (ip) {
      const quality = await ProxyIntelligence.detectNetworkQuality(host);
      this.cache.set(host, { 
        ip, 
        timestamp: now,
        networkQuality: quality
      });
    }

    return ip;
  }
}

// Routing Intelligence
class RoutingEngine {
  static matchDomain(host, domainList) {
    return domainList.some(domain => 
      shExpMatch(host.toLowerCase(), domain.toLowerCase())
    );
  }

  static isRegionalNetwork(host, region) {
    const hostIP = dnsResolve(host);
    return NETWORK_INTELLIGENCE.REGIONS[region]?.IP_RANGES.some(range => 
      hostIP && isInNet(hostIP, range[0], range[1])
    );
  }

  static async getBestRoute(host) {
    const proxies = [
      { host: PROXY_MASTER_CONFIG.CORE.PRIMARY_HOST, port: 443 },
      ...PROXY_MASTER_CONFIG.CORE.BACKUP_HOSTS.map(h => ({ host: h, port: 443 }))
    ];
    const bestProxy = await ProxyIntelligence.selectBestProxy(host, proxies);
    return `SOCKS5 ${bestProxy.host}:${bestProxy.port}`;
  }
}

// Main Proxy Configuration Function
async function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  url = (url || "").toLowerCase();

  // استثناءات مباشرة
  if (host.includes("youtube.com") || host.includes("netflix.com")) {
    return "DIRECT";
  }

  // التحقق من المجال
  const isGameDomain = RoutingEngine.matchDomain(host, NETWORK_INTELLIGENCE.GLOBAL_DOMAINS);

  // التحقق من الشبكة الإقليمية
  const isJordanNetwork = RoutingEngine.isRegionalNetwork(host, "JORDAN");
  const isMENetwork = RoutingEngine.isRegionalNetwork(host, "MIDDLE_EAST");

  // اختيار المنفذ الأمثل
  const region = isJordanNetwork ? "JORDAN" : (isMENetwork ? "MIDDLE_EAST" : null);
  const portSelection = region 
    ? NETWORK_INTELLIGENCE.REGIONS[region].OPTIMAL_PORTS
    : PROXY_MASTER_CONFIG.CORE.DEFAULT_PORTS.GAME;

  const selectedPort = ProxyIntelligence.selectOptimalPort(host, portSelection);

  // منطق التوجيه الديناميكي
  if (isGameDomain || isJordanNetwork || isMENetwork) {
    const networkQuality = await ProxyIntelligence.detectNetworkQuality(host);
    if (networkQuality.ping <= NETWORK_INTELLIGENCE.REGIONS.JORDAN.PING_THRESHOLD) {
      return await RoutingEngine.getBestRoute(host);
    }
    return `SOCKS5 ${PROXY_MASTER_CONFIG.CORE.PRIMARY_HOST}:${selectedPort}`;
  }

  // الإعداد الافتراضي
  if (PROXY_MASTER_CONFIG.SECURITY.FORCE_PROXY) {
    return `SOCKS5 ${PROXY_MASTER_CONFIG.CORE.PRIMARY_HOST}:${PROXY_MASTER_CONFIG.CORE.DEFAULT_PORTS.LOBBY[0]}`;
  }

  return "DIRECT";
}

// Performance Monitoring
const ProxyMonitoring = {
  logConnection(url, host, proxyType, ping) {
    console.log(`Connection Analysis:
      URL: ${url}
      Host: ${host}
      Proxy: ${proxyType}
      Ping: ${ping}ms
      Timestamp: ${new Date().toISOString()}
    `);
  }
};
