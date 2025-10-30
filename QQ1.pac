function FindProxyForURL(url, host) {
    // نطاقات IP الأردنية
    var jordanRanges = [
         "196.52.0.0/16","91.106.0.0/16","89.187.0.0/16","41.222.0.0/16",
        "2.17.24.0/22","5.45.128.0/20","37.17.192.0/20","46.185.128.0/18"
    ];

    // منافذ اللعبة حسب الوظائف
    var PORTS = {
        LOBBY:          [443, 8443],
        MATCH:          [20001, 20003],
        RECRUIT_SEARCH: [10012, 10013],
        UPDATES:        [80, 443, 8443],
        CDN:            [80, 443]
    };

    // نطاقات الدومين حسب الوظائف
    var DOMAINS = {
        LOBBY: ["lobby.igamecj.com", "lite-ios.igamecj.com", "mgl.lobby.igamecj.com", "mtw.lobby.igamecj.com", "mkn.lobby.igamecj.com"],
        MATCH: ["match.igamecj.com", "mvn.lobby.igamecj.com", "mkr.lobby.igamecj.com"],
        RECRUIT_SEARCH: ["recruit-search.igamecj.com", "search.igamecj.com"],
        UPDATES: ["updates.pubg.com", "update.igamecj.com", "filegcp.igamecj.com"],
        CDN: ["cdn.pubg.com", "cdn.igamecj.com", "gcpcdntest.igamecj.com", "appdl.pubg.com"]
    };

    function ipToNumber(ip) {
        var parts = ip.split('.');
        return (parseInt(parts[0]) << 24) | (parseInt(parts[1]) << 16) | (parseInt(parts[2]) << 8) | parseInt(parts[3]);
    }

    function isInNet(ip, range, bits) {
        var mask = ~(Math.pow(2, 32 - bits) - 1);
        return (ipToNumber(ip) & mask) === (ipToNumber(range) & mask);
    }
    
    // محاولة حل DNS مع إعادة محاولة ذكية
    function safeDnsResolve(host, attempts) {
        attempts = attempts || 3;
        for (var i = 0; i < attempts; i++) {
            var ip = dnsResolve(host);
            if (ip) return ip;
        }
        return null;
    }

    var ip = safeDnsResolve(host);
    if (!ip) return "PROXY 91.106.109.12:443";

    var port = 80;
    var portMatch = url.match(/:(\d+)(\/|$)/);
    if (portMatch) port = parseInt(portMatch[1]);

    var inJordan = false;
    for (var i = 0; i < jordanRanges.length; i++) {
        var parts = jordanRanges[i].split('/');
        if (isInNet(ip, parts[0], parseInt(parts[1]))) {
            inJordan = true;
            break;
        }
    }

    if (inJordan) {
        for (var func in PORTS) {
            if (PORTS[func].indexOf(port) !== -1) {
                for (var d = 0; d < DOMAINS[func].length; d++) {
                    if (host.indexOf(DOMAINS[func][d]) !== -1) {
                        return "PROXY 91.106.109.12:443";
                    }
                }
            }
        }
        // إذا كان ضمن الأردن لكنه لم يطابق القواعد المحددة
        return "PROXY 91.106.109.12:443";
    }

    // التوجيه لبروكسي أردني لجميع بيانات ببجي حتى خارج الأردن
    var knownPubgDomains = ["pubgmobile.com", "tencent.com", "ueapk.com", "pubg.com", "tencentgames.net", "igamecj.com"];
    for (var i = 0; i < knownPubgDomains.length; i++) {
        if (host.indexOf(knownPubgDomains[i]) !== -1) {
            return "PROXY 91.106.109.12:443";
        }
    }

    // توجيه افتراضي عبر البروكسي
    return "PROXY 91.106.109.12:443";
}
