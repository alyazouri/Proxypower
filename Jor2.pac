// ======================================================================
// PAC – PUBG Mobile (Advanced Proxy Configuration)
// - Hyper-Optimized Performance
// - Multi-Region Support
// - Intelligent Routing
// ======================================================================

const PROXY_MASTER_CONFIG = {
  CORE: {
    HOST: "91.106.109.12",
    DEFAULT_PORTS: {
      LOBBY:   [443, 8080, 8443],
      GAME:    [20001],
      FALLBACK:[8085, 1080, 5000]
    }
  },
  PERFORMANCE: {
    DNS_CACHE_TTL: 45000,
    PING_TIMEOUT: 150,
    ROUTE_STRATEGY: "adaptive"
  },
  SECURITY: {
    FORCE_PROXY: true,
    BLOCK_TRACKING: true,
    ENCRYPT_TRAFFIC: true
  }
};

const NETWORK_INTELLIGENCE = {
  REGIONS: {
    JORDAN: {
      ISPs: ["Zain", "Orange", "Mada"],
      IP_RANGES: [
        ["185.140.0.0","255.255.0.0"],
        ["212.35.0.0","255.255.0.0"],
        ["185.96.70.36","255.255.255.255"],
        ["176.28.250.122","255.255.255.255"],
        ["37.123.0.0","255.255.0.0"],
        ["79.173.251.142","255.255.255.255"],
        ["185.142.226.12","255.255.255.255"],
        ["213.139.32.0","255.255.255.0"],
        ["46.32.97.0","255.255.255.0"],
        ["46.32.98.0","255.255.255.0"],
        ["46.32.99.0","255.255.255.0"],
        ["188.247.64.0","255.255.240.0"]
      ],
      OPTIMAL_PORTS: [8080, 8085, 8090]
    }
  },
  GLOBAL_DOMAINS: [
    "*.pubgmobile.com",
    "*.pubgmobile.net",
    "*.pubgmobile.jp",
    "*.pubgmobile.kr",
    "*.pubgmobile.tw",
    "*.pubgmobile.vn",
    "*.pubgmobile.in",
    "*.pubgmobile.id",
    "*.pubgmobile.sg",
    "*.pubgmobile.me",
    "*.pubgmobile.sa",
    "*.pubgmobile.ae",
    "*.pubgmobile.qa",
    "*.pubgmobile.bh",
    "*.pubgmobile.kw",
    "*.pubgmobile.tr",
    "*.gpubgm.com",
    "*.napubgm.*",
    "*.apubgm.com",
    "*.na.pubgmobile.com",
    "*.sea.pubgmobile.com",
    "*.eu.pubgmobile.com",
    "*.me.pubgmobile.com",
    "*.global.pubgmobile.com",
    "*.cdn.pubgmobile.com",
    "*.download.pubgmobile.com",
    "*.update.pubgmobile.com",
    "*.resource.pubgmobile.com",
    "*.lobby.pubgmobile.com",
    "*.match.pubgmobile.com",
    "*.game.pubgmobile.com",
    "*.voice.pubgmobile.com",
    "*.friend.pubgmobile.com",
    "*.team.pubgmobile.com",
    "*.clan.pubgmobile.com",
    "*.recruit.pubgmobile.com",
    "*.rank.pubgmobile.com",
    "*.event.pubgmobile.com",
    "*.web.pubgmobile.com",
    "*.sdk.pubgmobile.com",
    "*.account.pubgmobile.com",
    "*.auth.pubgmobile.com",
    "*.tlogin.pubgmobile.com",
    "*.igamecj.com",
    "*.sdk.igamecj.com",
    "*.tencentgames.com",
    "*.tencentcloud.com",
    "*.qq.com",
    "*.qcloud.com",
    "*.helpshift.com",
    "*.pubgmobile.helpshift.com",
    "*.log.pubgmobile.com",
    "*.report.pubgmobile.com",
    "*.track.pubgmobile.com",
    "*.data.pubgmobile.com",
    "*.ping.pubgmobile.com",
    "*.anti.pubgmobile.com",
    "*.security.pubgmobile.com",
    "*.cdn.tencentgames.com",
    "*.pubgm.qq.com",
    "*.pubgmobile.cdn.qq.com",
    "*.file.pubgmobile.com",
    "*.app.pubgmobile.com",
    "*.dl.pubgmobile.com",
    "*.updatecdn.pubgmobile.com",
    "*.gamecdn.pubgmobile.com",
    "*.pubgmobile.gameloop.com",
    "*.static.pubgmobile.com",
    "*.video.pubgmobile.com",
    "*.voicechat.pubgmobile.com",
    "*.content.pubgmobile.com",
    "*.store.pubgmobile.com",
    "*.payment.pubgmobile.com",
    "*.purchase.pubgmobile.com",
    "*.reward.pubgmobile.com",
    "*.shop.pubgmobile.com",
    "*.cdn.igamecj.com",
    "*.download.igamecj.com",
    "*.cloud.igamecj.com",
    "*.aws.pubgmobile.com",
    "*.akamai.pubgmobile.com",
    "*.cdn.speed.pubgmobile.com",
    "*.image.pubgmobile.com",
    "*.filecdn.pubgmobile.com",
    "*.map.pubgmobile.com",
    "*.server.pubgmobile.com",
    "*.backend.pubgmobile.com",
    "*.ws.pubgmobile.com",
    "*.wss.pubgmobile.com",
    "*.socket.pubgmobile.com",
    "*.matchmaking.pubgmobile.com",
    "*.battle.pubgmobile.com",
    "*.gameapi.pubgmobile.com",
    "*.api.pubgmobile.com",
    "*.beta.pubgmobile.com",
    "*.alpha.pubgmobile.com",
    "*.lite.pubgmobile.com"
  ]
};

class ProxyIntelligence {
  static hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + c;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  static selectOptimalPort(host, portList) {
    const h = this.hashCode(host);
    return portList[h % portList.length];
  }
  static detectNetworkQuality(host) {
    const t0 = Date.now();
    const ip = dnsResolve(host);
    const t1 = Date.now();
    return { ping: t1 - t0, resolvedIP: ip };
  }
}

class DNSIntelligentCache {
  constructor(ttl = 45000) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  resolve(host) {
    const now = Date.now();
    const cached = this.cache.get(host);
    if (cached && (now - cached.timestamp) < this.ttl) return cached.ip;
    const ip = dnsResolve(host);
    if (ip) {
      this.cache.set(host, {
        ip,
        timestamp: now,
        networkQuality: ProxyIntelligence.detectNetworkQuality(host)
      });
    }
    return ip;
  }
}

class RoutingEngine {
  static matchDomain(host, domainList) {
    return domainList.some(d => shExpMatch(host.toLowerCase(), d.toLowerCase()));
  }
  static isRegionalNetwork(host) {
    const hostIP = dnsResolve(host);
    return Object.values(NETWORK_INTELLIGENCE.REGIONS).some(region =>
      region.IP_RANGES.some(([net, mask]) =>
        hostIP && isInNet(hostIP, net, mask)
      )
    );
  }
  static proxyIsJordan() {
    const pip = dnsResolve(PROXY_MASTER_CONFIG.CORE.HOST);
    return NETWORK_INTELLIGENCE.REGIONS.JORDAN.IP_RANGES.some(([net, mask]) =>
      pip && isInNet(pip, net, mask)
    );
  }
}

function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  url  = (url  || "").toLowerCase();

  if (!RoutingEngine.proxyIsJordan()) {
    return "DIRECT";
  }

  if (host.includes("youtube.com")) {
    return "DIRECT";
  }

  const isGameDomain = RoutingEngine.matchDomain(
    host,
    NETWORK_INTELLIGENCE.GLOBAL_DOMAINS
  );

  const isRegionalNetwork = RoutingEngine.isRegionalNetwork(host);

  const portList = isRegionalNetwork
    ? NETWORK_INTELLIGENCE.REGIONS.JORDAN.OPTIMAL_PORTS
    : PROXY_MASTER_CONFIG.CORE.DEFAULT_PORTS.GAME;

  const selectedPort = ProxyIntelligence.selectOptimalPort(host, portList);

  if (isGameDomain || isRegionalNetwork) {
    return `SOCKS5 ${PROXY_MASTER_CONFIG.CORE.HOST}:${selectedPort}`;
  }

  if (PROXY_MASTER_CONFIG.SECURITY.FORCE_PROXY) {
    return `SOCKS5 ${PROXY_MASTER_CONFIG.CORE.HOST}:${PROXY_MASTER_CONFIG.CORE.DEFAULT_PORTS.LOBBY[0]}`;
  }

  return "DIRECT";
}

const ProxyMonitoring = {
  logConnection(url, host, proxyType) {
    console.log(`Connection Analysis:
      URL: ${url}
      Host: ${host}
      Proxy: ${proxyType}
      Timestamp: ${new Date().toISOString()}
    `);
  }
};
