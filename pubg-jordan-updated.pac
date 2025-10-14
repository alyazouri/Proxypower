function FindProxyForURL(url, host) {
    // تعريف الـ proxy server الأردني (غيّر الـ port لو مختلف، زي 1080 لـ SOCKS5)
    // لو يحتاج auth، استخدم: "PROXY username:password@91.106.109.12:8080"
    var proxy = "PROXY 91.106.109.12:8080; DIRECT";  // fallback إلى DIRECT لو الـ proxy مش شغال
    // بديل لـ SOCKS: var proxy = "SOCKS 91.106.109.12:1080; DIRECT";

    // قائمة موسعة من الدومينات المتعلقة بـ PUBG Mobile (من Netify، Reddit، GitHub)
    // تشمل: matchmaking، APIs، CDNs، servers للكلاسيك، TDM، ranked، team search، خصم
    var pubg_domains = [
        "pubgmobile.com",          // الدومين الرئيسي
        "pubgm.com",                // اختصار
        "tencentgames.com",         // مطور اللعبة
        "pubg.com",                 // النسخة العالمية
        "pubgmobile.kr",            // كوريا
        "pubgmobile.jp",            // اليابان
        "pubgmobile.in",            // الهند
        "pubgmobile.vn",            // فيتنام
        "api.pubg.com",             // APIs عامة
        "match.api.pubg.com",       // matchmaking servers
        "game.api.pubg.com",        // game data و team search
        "battlegrounds.pubg.com",   // battlegrounds APIs
        "api.pubgmobile.com",       // mobile-specific APIs
        "cdn.pubgmobile.com",       // content delivery
        "download.pubgmobile.com",  // updates و downloads
        "pg.qq.com",                // Tencent QQ integration
        "game.qq.com",              // Tencent game servers
        "akamai.net",               // CDN للـ media (مثل images/videos في اللعبة)
        "cloudfront.net",           // Amazon CDN للـ global traffic
        "tencentcloud.net"          // Tencent Cloud domains
    ];

    // التحقق من الدومين: لو الـ host يطابق أي دومين في القائمة، وجّه عبر الـ proxy
    for (var i = 0; i < pubg_domains.length; i++) {
        if (dnsDomainIs(host, pubg_domains[i]) || shExpMatch(host, "*" + pubg_domains[i]) || host == pubg_domains[i]) {
            return proxy;  // توجيه للـ proxy الأردني للوصول لخوادم Middle East
        }
    }

    // تحقق إضافي لـ URLs تحتوي على كلمات مفتاحية للماتشماكينغ (زي match، team، ranked)
    // ده هيغطي subpaths زي /matchmaking أو /team-search
    if (url.indexOf("match") > -1 || url.indexOf("team") > -1 || url.indexOf("ranked") > -1 || url.indexOf("tdm") > -1 || url.indexOf("classic") > -1) {
        return proxy;
    }

    // قائمة نطاقات IP أردنية فقط (من IP2Location، BGPView، IPinfo، IPv4.fetus.jp، NirSoft - أكتوبر 2025)
    // تغطي الـ ISPs الرئيسية في الأردن (Orange، Zain، Batelco، JDS، Umniah، Al-Hadatheh)
    // إضافة نطاقات جديدة (post-2020) وقديمة (pre-2020) لتوسيع التغطية
    var pubg_ip_ranges = [
        // نطاقات أردنية أساسية (من السابق)
        {ip: "193.242.192.0", mask: "255.255.240.0"}, // AS8697 - Orange Jordan Telecom (رئيسي)
        {ip: "62.163.0.0", mask: "255.255.240.0"},    // AS8376 - Jordan Data Systems (JDS)
        {ip: "176.29.0.0", mask: "255.255.0.0"},      // AS48832 - Zain Jordan (موبايل كبير)
        {ip: "94.127.0.0", mask: "255.255.128.0"},    // AS9038 - Batelco Jordan
        {ip: "82.212.0.0", mask: "255.255.192.0"},    // AS47887 - Al-Hadatheh Co. (Amman)
        {ip: "188.115.0.0", mask: "255.255.128.0"},   // AS44717 - Umniah (موبايل)

        // نطاقات أردنية جديدة (post-2020، من IPv4.fetus.jp وBGPView)
        {ip: "37.252.222.0", mask: "255.255.255.0"},  // 2021 - Umniah/Zain related
        {ip: "91.132.100.0", mask: "255.255.255.0"},  // 2023 - Batelco/Orange modern alloc
        {ip: "91.223.202.0", mask: "255.255.255.0"},  // 2023 - Recent RIPE NCC
        {ip: "146.19.239.0", mask: "255.255.255.0"},  // 2021 - New mobile ISP
        {ip: "146.19.246.0", mask: "255.255.255.0"},  // 2021 - New hosting
        {ip: "176.118.39.0", mask: "255.255.255.0"},  // 2021 - Zain extension
        {ip: "185.40.19.0", mask: "255.255.255.0"},   // 2021 - Umniah
        {ip: "185.43.146.0", mask: "255.255.255.0"},  // 2023 - Batelco
        {ip: "185.163.205.0", mask: "255.255.255.0"}, // 2020 - Recent Orange
        {ip: "185.234.111.0", mask: "255.255.255.0"}, // 2021 - Hosting
        {ip: "185.241.62.0", mask: "255.255.255.0"},  // 2021 - Mobile
        {ip: "194.104.95.0", mask: "255.255.255.0"},  // 2025 - New RIPE NCC
        {ip: "195.18.9.0", mask: "255.255.255.0"},    // 2025 - Latest alloc
        {ip: "84.252.106.0", mask: "255.255.255.0"},  // 2020 - Post-2020 extension
        {ip: "91.212.0.0", mask: "255.255.255.0"},    // 2020 - New Batelco

        // نطاقات أردنية قديمة (pre-2020، من NirSoft وIPv4.fetus.jp)
        {ip: "5.45.128.0", mask: "255.255.240.0"},    // 2012 - Umniah (old mobile)
        {ip: "46.185.128.0", mask: "255.255.128.0"},  // 2010 - Jordan Data Comm (historical)
        {ip: "193.188.64.0", mask: "255.255.224.0"},  // 1995 - National Info Tech Center (very old)
        {ip: "194.165.128.0", mask: "255.255.224.0"}, // 1996 - Jordan Data Comm (classic)
        {ip: "212.34.0.0", mask: "255.255.224.0"},    // 1998 - Jordan Telecom (old PSC)
        {ip: "212.118.0.0", mask: "255.255.224.0"},   // 1998 - Batelco (historical)
        {ip: "213.139.32.0", mask: "255.255.224.0"},  // 2000 - Jordan Telecom (pre-2000)
        {ip: "80.90.160.0", mask: "255.255.240.0"},   // 2001 - Linkdotnet (old)
        {ip: "86.108.0.0", mask: "255.255.128.0"},    // 2005 - Jordan Data Comm (mid-2000s)
        {ip: "92.253.0.0", mask: "255.255.128.0"}     // 2009 - Jordan Data Comm (pre-2010)
    ];

    // التحقق من IP الـ host لو في أي range أردني
    var resolved_ip = dnsResolve(host);
    if (resolved_ip) {
        for (var j = 0; j < pubg_ip_ranges.length; j++) {
            if (isInNet(resolved_ip, pubg_ip_ranges[j].ip, pubg_ip_ranges[j].mask)) {
                return proxy;  // توجيه عبر proxy للـ IPs الأردنية فقط (جديدة وقديمة)
            }
        }
    }

    // باقي الاتصالات (غير PUBG أو IPs أردنية) تكون مباشرة عشان ما يبطّئش الإنترنت
    return "DIRECT";
}
