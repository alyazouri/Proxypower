function FindProxyForURL(url, host) {
    // خوادم PUBG المحلية والأردنية
    var jordanGameServers = [
        ".pubgmobile.jo",     // دومين أردني مخصص
        "147.135.225.0/24",   // نطاق IP الأردن
        "91.106.109.12",      // IP مباشر
        ".jo"                 // جميع الدومينات الأردنية
    ];

    // بروكسيات محلية محسّنة
    var optimizedProxies = [
        "PROXY 91.106.109.12:8080",   // بورت HTTP
        "PROXY 91.106.109.12:443",    // بورت SSL
        "PROXY 91.106.109.12:3128"    // بورت بديل
    ];

    // التحقق من الخوادم الأردنية
    function isJordanServer(host) {
        for (var i = 0; i < jordanGameServers.length; i++) {
            if (dnsDomainIs(host, jordanGameServers[i]) || 
                isInNet(dnsResolve(host), jordanGameServers[i], "255.255.255.0")) {
                return true;
            }
        }
        return false;
    }

    // تحسين مطابقة اللاعبين المحليين
    function enhanceLocalMatching(host) {
        var localMatchHints = [
            "matchmaking.pubg.jo",
            "regional.pubg.jo",
            "lobby.jordan.pubg",
            "players.jo"
        ];
        
        for (var i = 0; i < localMatchHints.length; i++) {
            if (dnsDomainIs(host, localMatchHints[i])) {
                return true;
            }
        }
        return false;
    }

    // منطق التوجيه
    if (isJordanServer(host) || 
        enhanceLocalMatching(host) || 
        dnsDomainIs(host, ".pubgmobile.com")) {
        
        // اختيار عشوائي للبروكسي مع الأولوية
        return optimizedProxies[Math.floor(Math.random() * optimizedProxies.length)];
    }

    // استثناءات للشبكات المحلية
    if (isPlainHostName(host) || 
        shExpMatch(host, "*.local") ||
        isInNet(dnsResolve(host), "192.168.0.0", "255.255.0.0")) {
        return "DIRECT";  // اتصال مباشر للشبكات المحلية
    }

    // الإعداد الافتراضي
    return optimizedProxies[0];
}
