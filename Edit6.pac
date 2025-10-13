// PAC Script - Jordanian PUBG Mobile Player Expansion v1.0

const JORDANIAN_PLAYER_CONFIG = {
  // نطاقات IP الأردنية
  JORDANIAN_IP_RANGES: [
    '185.140.0.0/16',   // Zain Jordan
    '212.35.0.0/16',    // Orange Jordan
    '82.102.0.0/16',    // Umniah
    '91.106.0.0/16'     // Other Local ISPs
  ],

  // المناطق المستهدفة
  TARGET_REGIONS: [
    'Amman', 
    'Zarqa', 
    'Irbid', 
    'Mafraq', 
    'Karak', 
    'Aqaba'
  ],

  // إعدادات التوجيه الذكي
  ROUTING_OPTIMIZATION: {
    LOCAL_SERVER_PRIORITY: 0.9,  // أولوية الخوادم المحلية
    PING_THRESHOLD: 20,          // عتبة البنج المثالية
    STABILITY_FACTOR: 0.95        // عامل الاستقرار
  }
};

// محرك التوجيه للاعبين الأردنيين
function FindProxyForURL(url, host) {
  // دالة للتحقق من نطاق IP الأردني
  function isJordanianIP(ip) {
    return JORDANIAN_PLAYER_CONFIG.JORDANIAN_IP_RANGES.some(range => {
      // تحويل النطاق إلى معالجة IP
      const [network, mask] = range.split('/');
      return isInNet(ip, network, mask);
    });
  }

  // دالة لتحديد المنطقة
  function detectLocalRegion(ip) {
    // منطق محلي لتحديد المنطقة
    const regionMappings = {
      '185.140': 'Amman',
      '212.35': 'Zarqa',
      '82.102': 'Irbid'
    };

    const ipPrefix = ip.split('.').slice(0, 2).join('.');
    return regionMappings[ipPrefix] || 'Unknown';
  }

  // التحقق من مجال اللعبة
  const isPubgDomain = host.includes('pubgmobile.com');
  
  if (isPubgDomain) {
    // الحصول على عنوان IP الحالي
    const currentIP = myIpAddress();

    // التحقق إذا كان IP أردني
    if (isJordanianIP(currentIP)) {
      // تحديد المنطقة
      const playerRegion = detectLocalRegion(currentIP);

      // محرك التوجيه المحلي
      const routingStrategy = {
        region: playerRegion,
        optimizationScore: calculateOptimizationScore(playerRegion)
      };

      // اختيار خادم محلي
      const localServer = selectOptimalLocalServer(routingStrategy);

      // توجيه مباشر عبر الخادم المحلي
      if (localServer) {
        return `SOCKS5 ${localServer.ip}:${localServer.port}`;
      }
    }
  }

  // توجيه مباشر إذا لم يكن IP أردني
  return 'DIRECT';
}

// حساب درجة التحسين للمنطقة
function calculateOptimizationScore(region) {
  const regionScores = {
    'Amman': 0.95,
    'Zarqa': 0.90,
    'Irbid': 0.85,
    'Mafraq': 0.80,
    'Karak': 0.75,
    'Aqaba': 0.70,
    'Unknown': 0.60
  };

  return {
    score: regionScores[region] || 0.60,
    pingOptimization: JORDANIAN_PLAYER_CONFIG.ROUTING_OPTIMIZATION.PING_THRESHOLD,
    stabilityFactor: JORDANIAN_PLAYER_CONFIG.ROUTING_OPTIMIZATION.STABILITY_FACTOR
  };
}

// اختيار الخادم المحلي الأمثل
function selectOptimalLocalServer(routingStrategy) {
  // قائمة الخوادم المحلية
  const localServers = [
    {
      id: 'JO_AMMAN_01',
      region: 'Amman',
      ip: '185.140.224.12',
      port: 443,
      performance_score: 0.95
    },
    {
      id: 'JO_ZARQA_01',
      region: 'Zarqa',
      ip: '212.35.109.12',
      port: 1080,
      performance_score: 0.90
    },
    {
      id: 'JO_IRBID_01',
      region: 'Irbid',
      ip: '82.102.32.45',
      port: 8080,
      performance_score: 0.85
    }
  ];

  // فلترة الخوادم حسب المنطقة
  const eligibleServers = localServers.filter(server => 
    server.region === routingStrategy.region
  );

  // اختيار الخادم الأمثل
  return eligibleServers.sort((a, b) => 
    b.performance_score - a.performance_score
  )[0];
}

// نظام جمع البيانات
const PlayerDataCollector = {
  collectPlayerMetrics(playerData) {
    return {
      region: playerData.region,
      ip: playerData.ipAddress,
      connectionQuality: {
        ping: playerData.averagePing,
        stability: playerData.connectionStability
      },
      gamePerformance: {
        matchesPlayed: playerData.totalMatches,
        winRate: playerData.wins / playerData.totalMatches
      }
    };
  }
};

// تصدير الإعدادات
module.exports = {
  JORDANIAN_PLAYER_CONFIG,
  FindProxyForURL,
  PlayerDataCollector
};
