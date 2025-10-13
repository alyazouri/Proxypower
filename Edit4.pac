function FindProxyForURL(url, host) {
  // ======================================================================
  // PAC – PUBG Mobile (Jordan Player Expansion Strategy)
  // Advanced Matchmaking & Routing Intelligence for Jordanian Players
  // ======================================================================

  // تعريف مفصل للمناطق والدومينات
  const JORDAN_PUBG_CONFIG = {
    // مناطق الأردن المفصلة
    JORDANIAN_REGIONS: {
      CITIES: [
        'Amman',       // عمان
        'Zarqa',       // الزرقاء
        'Irbid',       // إربد
        'Aqaba',       // العقبة
        'Mafraq',      // المفرق
        'Jerash',      // جرش
        'Ajloun',      // عجلون
        'Salt',        // السلط
        'Madaba',      // مادبا
        'Karak',       // الكرك
        'Tafilah',     // الطفيلة
        'Maan'         // معان
      ],
      GOVERNORATES: [
        'Amman',       // محافظة عمان
        'Zarqa',       // محافظة الزرقاء
        'Irbid',       // محافظة إربد
        'Aqaba',       // محافظة العقبة
        'Mafraq',      // محافظة المفرق
        'Jerash',      // محافظة جرش
        'Ajloun',      // محافظة عجلون
        'Balqa',       // محافظة البلقاء
        'Madaba',      // محافظة مادبا
        'Karak',       // محافظة الكرك
        'Tafilah',     // محافظة الطفيلة
        'Maan'         // محافظة معان
      ]
    },
    
    // خوادم البروكسي المخصصة للاعبين الأردنيين
    PROXY_SERVERS: [
      { 
        region: 'JO-AMMAN', 
        ip: '185.140.10.20', 
        port: 1080, 
        priority: 0.9, 
        ping: 5 
      },
      { 
        region: 'JO-IRBID', 
        ip: '185.140.11.30', 
        port: 1081, 
        priority: 0.8, 
        ping: 6 
      },
      { 
        region: 'JO-ZARQA', 
        ip: '185.140.12.40', 
        port: 1082, 
        priority: 0.7, 
        ping: 7 
      },
      { 
        region: 'JO-AQABA', 
        ip: '185.140.13.50', 
        port: 1083, 
        priority: 0.6, 
        ping: 8 
      }
    ],
    
    // نطاقات IP الخاصة بمزودي الإنترنت الأردنيين
    IP_RANGES: [
      ['185.140.0.0', '255.255.0.0'],   // Zain Jordan
      ['212.35.0.0', '255.255.0.0'],     // Orange Jordan
      ['82.102.0.0', '255.255.0.0'],     // National Network
      ['5.0.0.0', '255.0.0.0'],          // Umniah
      ['31.0.0.0', '255.0.0.0']          // Other local ISPs
    ],
    
    // دومينات PUBG Mobile المحلية والإقليمية
    DOMAINS: {
      JORDANIAN_SPECIFIC: [
        'jo.pubgmobile.com',
        'jordan.pubgmobile.com',
        'me.pubgmobile.com'
      ],
      MAIN: [
        'pubgmobile.com',
        'pubg.com',
        'tencentgames.com'
      ],
      GAME: [
        'game.pubgmobile.com',
        'game.tencentgames.com',
        'battle.pubgmobile.com',
        'match.pubgmobile.com'
      ]
    }
  };

  // أدوات المساعدة
  const NetworkUtils = {
    // تحويل IP إلى رقم
    ipToNumber(ip) {
      return ip.split('.').reduce((acc, octet) => 
        (acc << 8) | parseInt(octet, 10), 0) >>> 0;
    },

    // التحقق من وجود IP ضمن نطاق
    isInNet(ip, base, mask) {
      const ipNum = this.ipToNumber(ip);
      const baseNum = this.ipToNumber(base);
      const maskNum = this.ipToNumber(mask);
      return (ipNum & maskNum) === (baseNum & maskNum);
    }
  };

  // التحقق من مزود الإنترنت الأردني
  function isJordanianISP() {
    const ip = myIpAddress();
    return JORDAN_PUBG_CONFIG.IP_RANGES.some(
      ([base, mask]) => NetworkUtils.isInNet(ip, base, mask)
    );
  }

  // التحقق من دومينات PUBG Mobile
  function isPUBGDomain(host) {
    const allDomains = [
      ...JORDAN_PUBG_CONFIG.DOMAINS.JORDANIAN_SPECIFIC,
      ...JORDAN_PUBG_CONFIG.DOMAINS.MAIN,
      ...JORDAN_PUBG_CONFIG.DOMAINS.GAME
    ];

    return allDomains.some(domain => 
      host.indexOf(domain) !== -1
    );
  }

  // اختيار الخادم الأمثل للاعبين الأردنيين
  function selectOptimalJordanianServer() {
    // فلترة الخوادم حسب أقل وقت استجابة
    const eligibleServers = JORDAN_PUBG_CONFIG.PROXY_SERVERS.filter(
      server => server.ping <= 50
    );

    if (eligibleServers.length === 0) {
      return null;
    }

    // ترتيب الخوادم حسب الأولوية
    return eligibleServers.sort(
      (a, b) => b.priority - a.priority
    )[0];
  }

  // دالة لتحديد المنطقة الأردنية
  function getJordanianRegion() {
    // يمكن توسيع هذه الدالة للتعرف على المنطقة بشكل أكثر دقة
    const jordanianRegions = [
      ...JORDAN_PUBG_CONFIG.JORDANIAN_REGIONS.CITIES,
      ...JORDAN_PUBG_CONFIG.JORDANIAN_REGIONS.GOVERNORATES
    ];

    // هنا يمكنك إضافة منطق للتعرف على المنطقة
    // مثلاً من خلال geolocation أو معلومات إضافية
    return jordanianRegions[0]; // افتراضياً يعيد أول منطقة
  }

  // المنطق الرئيسي للتوجيه
  if (isPUBGDomain(host) && isJordanianISP()) {
    const optimalServer = selectOptimalJordanianServer();
    
    if (optimalServer) {
      // توجيه عبر SOCKS5 Proxy مع معلومات إضافية
      return `SOCKS5 ${optimalServer.ip}:${optimalServer.port}; REGION=${getJordanianRegion()}`;
    }
  }

  // الاتصال المباشر كإعداد افتراضي
  return 'DIRECT';
}
