// PAC - PUBG Mobile Jordanian Ultra Optimization v4.0 (PAC-safe)

var JORDANIAN_GAMING_CONFIG =
{
  VERSION:
  '4.0',

  OPTIMIZATION_LEVEL:
  'SUPREME',

  NETWORK_SETTINGS:
  {
    PING_TARGETS:
    {
      OPTIMAL:
      0.5,

      ACCEPTABLE:
      10,

      MAX_ALLOWED:
      50
    },

    BLOCKED_REGIONS:
    [
      'IR'
    ]
  },

  ULTRA_PERFORMANCE_SERVERS:
  [
    {
      id:
      'JO_ULTRA_EDGE_01',

      region:
      'ME',

      ip:
      '185.142.226.12',

      port:
      443,

      location:
      'Amman Data Center',

      ping_guarantee:
      0.3,

      performance_score:
      0.95,

      optimization_techniques:
      [
        'DIRECT_ROUTING',
        'EDGE_CACHING',
        'PREDICTIVE_PACKET_ROUTING'
      ]
    },
    {
      id:
      'JO_ULTRA_EDGE_02',

      region:
      'SA',

      ip:
      '185.142.224.12',

      port:
      80,

      location:
      'Riyadh Backup',

      ping_guarantee:
      0.5,

      performance_score:
      0.85,

      optimization_techniques:
      [
        'MULTI_PATH_OPTIMIZATION',
        'EDGE_CACHING'
      ]
    },
    {
      id:
      'JO_ULTRA_EDGE_03',

      region:
      'JO',

      ip:
      '212.35.64.1',

      port:
      8080,

      location:
      'Orange Core - Amman',

      ping_guarantee:
      0.4,

      performance_score:
      0.92,

      optimization_techniques:
      [
        'DIRECT_ROUTING',
        'EDGE_CACHING',
        'MULTI_PATH_OPTIMIZATION'
      ]
    }
  ]
};

var UltraOptimizationEngine =
{
  assessNetworkQuality:
  function(playerProfile)
  {
    var checks =
    [
      (playerProfile.internetType === 'FIBER'),
      (playerProfile.isp === 'PREMIUM'),
      (playerProfile.connectionStability > 0.95),
      UltraOptimizationEngine.checkLocalISPOptimization(playerProfile.ispName)
    ];

    var passed = 0;
    for (var i = 0; i < checks.length; i++)
    {
      if (checks[i]) passed++;
    }

    var successRate = passed / checks.length;
    return successRate * 1.2;
  },

  checkLocalISPOptimization:
  function(ispName)
  {
    var optimizedISPs =
    [
      'Zain Jordan',
      'Orange Jordan',
      'Umniah'
    ];

    for (var i = 0; i < optimizedISPs.length; i++)
    {
      if (optimizedISPs[i] === ispName) return true;
    }
    return false;
  },

  calculateMatchScore:
  function(playerProfile)
  {
    var score = 0.0;

    if (
         playerProfile.region === 'JO' ||
         playerProfile.region === 'SA' ||
         playerProfile.region === 'AE' ||
         playerProfile.region === 'ME'
       )
    {
      score += 0.4;
    }

    if (playerProfile.language === 'AR' || playerProfile.language === 'ARN')
    {
      score += 0.3;
    }

    if (playerProfile.deviceType === 'mobile')
    {
      score += 0.2;
    }

    if (playerProfile.connectionStability > 0.9)
    {
      score += 0.1;
    }

    if (score > 1.0) score = 1.0;
    return score;
  },

  getISPOptimizationFactor:
  function(ispName)
  {
    if (ispName === 'Zain Jordan')   return 1.2;
    if (ispName === 'Orange Jordan') return 1.1;
    if (ispName === 'Umniah')        return 1.0;
    return 1.0;
  },

  optimizePing:
  function(playerProfile, networkQuality)
  {
    var pingConfig = JORDANIAN_GAMING_CONFIG.NETWORK_SETTINGS.PING_TARGETS;

    var basePing = pingConfig.OPTIMAL;

    var ispFactor = UltraOptimizationEngine.getISPOptimizationFactor(playerProfile.ispName);
    var nqFactor  = networkQuality;

    var value = (basePing * ispFactor) / nqFactor;
    if (value < pingConfig.OPTIMAL) value = pingConfig.OPTIMAL;
    if (value > pingConfig.MAX_ALLOWED) value = pingConfig.MAX_ALLOWED;

    return value;
  },

  selectOptimalServer:
  function(playerProfile, optimizationResult)
  {
    var servers = JORDANIAN_GAMING_CONFIG.ULTRA_PERFORMANCE_SERVERS;

    var best = null;
    var bestScore = -1;

    for (var i = 0; i < servers.length; i++)
    {
      var s = servers[i];

      if (s.ping_guarantee <= optimizationResult.optimizedPing)
      {
        var score = s.performance_score * optimizationResult.matchScore;

        if (score > bestScore)
        {
          best = s;
          bestScore = score;
        }
      }
    }

    return best;
  },

  optimizePlayerExperience:
  function(playerProfile)
  {
    var nq  = UltraOptimizationEngine.assessNetworkQuality(playerProfile);
    var ms  = UltraOptimizationEngine.calculateMatchScore(playerProfile);
    var op  = UltraOptimizationEngine.optimizePing(playerProfile, nq);

    return {
      networkQuality: nq,
      matchScore:     ms,
      optimizedPing:  op
    };
  }
};

var PerformanceMonitoringSystem =
{
  performanceLogs:
  [],

  logPlayerPerformance:
  function(entry)
  {
    this.performanceLogs.push(
      {
        timestamp: Date.now(),
        networkQuality: entry.networkQuality,
        matchScore:     entry.matchScore,
        optimizedPing:  entry.optimizedPing,
        server:         entry.server
      }
    );

    if (this.performanceLogs.length > 100)
    {
      this.performanceLogs.shift();
    }
  },

  analyzeOverallPerformance:
  function()
  {
    var logs = this.performanceLogs;
    var n = logs.length;
    if (n === 0)
    {
      return {
        averagePing: 0,
        matchScoreConsistency: 0,
        networkStability: 0
      };
    }

    var take = (n >= 10) ? 10 : n;
    var start = n - take;

    var sumPing = 0;
    var sumMatch = 0;
    var sumNQ = 0;

    for (var i = start; i < n; i++)
    {
      sumPing  += logs[i].optimizedPing;
      sumMatch += logs[i].matchScore;
      sumNQ    += logs[i].networkQuality;
    }

    return {
      averagePing:           sumPing / take,
      matchScoreConsistency: sumMatch / take,
      networkStability:      sumNQ / take
    };
  }
};

var PUBG_DOMAINS =
[
  "*.proximabeta.com",
  "*.igamecj.com",
  "*.tencentgames.com",
  "*.tencent.com",
  "*.pubgmobile.com",
  "*.pubgmobile.net",
  "*.gcloud.qq.com",
  "*.cdn.pubgmobile.com"
];

function isPubgHost(h)
{
  for (var i = 0; i < PUBG_DOMAINS.length; i++)
  {
    if (shExpMatch(h, PUBG_DOMAINS[i])) return true;
  }
  return false;
}

function FindProxyForURL(url, host)
{
  if (isPubgHost(host))
  {
    var playerProfile =
    {
      region:               'JO',
      language:             'AR',
      deviceType:           'mobile',
      internetType:         'FIBER',
      isp:                  'PREMIUM',
      ispName:              'Zain Jordan',
      connectionStability:  0.98
    };

    var res = UltraOptimizationEngine.optimizePlayerExperience(playerProfile);
    var srv = UltraOptimizationEngine.selectOptimalServer(playerProfile, res);

    PerformanceMonitoringSystem.logPlayerPerformance(
      {
        networkQuality: res.networkQuality,
        matchScore:     res.matchScore,
        optimizedPing:  res.optimizedPing,
        server:         srv
      }
    );

    if (srv)
    {
      return "SOCKS5 " + srv.ip + ":" + srv.port;
    }
  }

  return "DIRECT";
}
