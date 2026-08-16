/*
 * ================================================================
 * ALYAZOURI PAC 7.1 — JORDAN PURE DIRECT
 * ================================================================
 *
 * سكربت بدون بروكسي — كل شي يمر مباشرة من شبكتك الأردنية
 *
 * الاعتماد الرئيسي على:
 *   - نطاقات CIDR الأردنية السكانية والتجارية (31 نطاق IPv4)
 *   - النطاقات الأردنية (.jo + تجارية + بنوك + خدمات)
 *   - نطاقات الألعاب
 *   - بدون أي نطاقات حكومية (.gov.jo)
 *
 * بدون بروكسي — بدون VPN — كل شي DIRECT
 *
 * ================================================================
 */

var CONFIG = {

    VERSION: "7.1.0",
    MODE: "JORDAN_PURE_DIRECT",

    /* كل شي DIRECT — لا بروكسي */
    PROXY_ENABLED: false,

    /* ============================================================
     * JORDAN IPv4 — نطاقات سكانية و تجارية
     * ============================================================
     * مصدّر: RIPE NCC — MaxMind — IP2Location
     *         github.com/ebrasha/cidr-ip-ranges-by-country
     *
     * مصنّفة حسب مزود الخدمة:
     *   Orange JO — Zain JO — Umniah — TE Data
     *   Batelco JO — Damamax — Link — أخرى
     * ============================================================ */
    JORDAN_IPV4: [
        /* ---- Orange Jordan (أكبر مزود) ---- */
        "46.185.128.0/17",          /* Orange — نطاق واسع */
        "79.134.128.0/19",          /* Orange */
        "88.201.0.0/16",            /* Orange — /16 كامل */
        "94.249.0.0/16",            /* Orange — /16 كامل */
        "178.77.128.0/18",          /* Orange */
        "37.123.64.0/19",           /* Orange */
        "212.35.64.0/19",           /* Orange / Jordan Telecom */

        /* ---- Zain Jordan ---- */
        "188.247.64.0/18",          /* Zain — نطاق واسع */
        "109.107.128.0/18",         /* Zain */

        /* ---- Umniah ---- */
        "37.35.0.0/17",             /* Umniah — نطاق واسع */

        /* ---- TE Data Jordan ---- */
        "62.72.96.0/19",            /* TE Data */
        "84.18.32.0/19",            /* TE Data */
        "84.18.64.0/19",            /* TE Data */

        /* ---- Batelco Jordan ---- */
        "212.34.0.0/19",            /* Batelco */

        /* ---- Damamax ---- */
        "185.117.80.0/22",          /* Damamax */

        /* ---- مزودون آخرون / Link / مشتركة ---- */
        "5.45.128.0/20",            /* Link / مشاركة */
        "31.14.80.0/20",            /* مشاركة */
        "46.248.192.0/19",          /* مشاركة */
        "77.245.16.0/20",           /* مشاركة */
        "80.90.160.0/19",           /* مشاركة */
        "82.212.64.0/18",           /* مشاركة */
        "86.108.64.0/18",           /* JO/محدود — مشاركة */
        "91.186.224.0/19",          /* مشاركة */
        "95.172.192.0/19",          /* مشاركة */
        "176.57.0.0/19",            /* مشاركة */
        "185.16.160.0/22",          /* مشاركة */
        "193.188.64.0/19",          /* مشاركة */
        "212.118.0.0/19",           /* مشاركة */
        "213.139.32.0/19",          /* مشاركة */
        "213.186.160.0/19",         /* مشاركة */
        "217.144.0.0/20"            /* مشاركة */
    ],

    /* ============================================================
     * JORDAN IPv6
     * ============================================================
     * مصدّر: RIPE NCC
     *         github.com/ebrasha/cidr-ip-ranges-by-country
     * ============================================================ */
    JORDAN_IPV6: [
        "2a01:1d0::/29",
        "2a01:9700::/29",
        "2a01:e240::/29",
        "2a01:ee40::/29",
        "2a02:9c0::/29",
        "2a02:2558::/29",
        "2a02:25d8::/32",
        "2a02:5b60::/32",
        "2a02:c040::/29",
        "2a02:e680::/29",
        "2a02:f0c0::/29",
        "2a03:6b00::/29",
        "2a03:6d00::/32",
        "2a03:b640::/32",
        "2a04:2ec0::/29",
        "2a04:6200::/29",
        "2a05:74c0::/29",
        "2a05:7500::/29",
        "2a06:9bc0::/29",
        "2a06:bd80::/29",
        "2a07:140::/29",
        "2a07:d887:7000::/40"
    ],

    /* ============================================================
     * PRIVATE / LOOPBACK / CGNAT
     * ============================================================ */
    PRIVATE_IPV4: [
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "127.0.0.0/8",
        "169.254.0.0/16",
        "100.64.0.0/10"             /* CGNAT — شائع عند Orange/Zain */
    ],

    PRIVATE_IPV6: [
        "fc00::/7",
        "fe80::/10",
        "::1/128"
    ],

    /* ============================================================
     * GAME / MATCHMAKING DOMAINS — DIRECT دائمًا
     * ============================================================
     * تمريرها عبر أي بروكسي = لوبي أجنبي
     * هون كل شي DIRECT => الألعاب تبقى على IP الأردني
     * ============================================================ */
    GAME_DIRECT_DOMAINS: [
        /* PUBG / Krafton */
        "pubg.com",
        "pubgmobile.com",
        "pubgmobile.live",
        "igamecj.com",
        "proximabeta.com",
        "krafton.com",
        "battlegroundsmobileindia.com",

        /* Tencent */
        "tencentgames.com",
        "tencent.com",
        "qcloud.com",

        /* Garena */
        "garena.com",

        /* Call of Duty / Activision / Blizzard */
        "callofduty.com",
        "activision.com",
        "blizzard.com",
        "battle.net",

        /* Riot Games */
        "riotgames.com",
        "leagueoflegends.com",
        "valorant.com",

        /* Epic / Fortnite */
        "epicgames.com",
        "fortnite.com",

        /* EA */
        "ea.com",
        "easports.com",

        /* PlayStation / Xbox */
        "playstation.net",
        "playstation.com",
        "xboxlive.com",

        /* Steam */
        "steampowered.com",
        "steamcommunity.com",
        "steamcontent.com",
        "steamstatic.com",

        /* Roblox */
        "roblox.com",
        "rbxcdn.com",

        /* أخرى */
        "supercell.com",
        "miniclip.com",
        "unity3d.com",
        "unityads.unity3d.com",
        "agora.io",
        "photonengine.com",
        "mojang.com",
        "minecraft.net",
        "neteasegames.com",
        "supercell.net"
    ],

    /* ============================================================
     * JORDAN DOMAINS — سكانية و تجارية فقط (بدون حكومية)
     * ============================================================
     * ملاحظة: .jo TLD يغطي كل النطاقات الأردنية تلقائيًا
     * هون بنضيف النطاقات التجارية والخدمية صراحةً للوضوح
     * ============================================================ */
    JORDAN_DOMAINS: [
        /* ---- نطاق الأردن العام ---- */
        "jo",

        /* ---- مزودو الخدمة (ISPs) ---- */
        "orange.jo",
        "zain.jo",
        "umniah.com",
        "damamax.com",
        "batelco.jo",
        "link.jo",
        "linkdotnet.com.jo",
        "pendasil.com",
        "myinternet.jo",

        /* ---- البنوك والخدمات المالية ---- */
        "arabbank.com",
        "arabbank.jo",
        "housingbank.jo",
        "bankofjordan.com.jo",
        "capitalbank.jo",
        "etihadawuna.jo",
        "cairoammanbank.jo",
        "bkaurgroup.com",
        "jnb.com.jo",
        "jordan-kuwait-bank.com",
        "blombank.jo",
        "sultan.jo",
        "investbank.jo",
        "jopost.jo",

        /* ---- الدفع الإلكتروني ---- */
        "madfooatcom.com",
        "cashu.com",
        "klip.jo",

        /* ---- التجارة الإلكترونية والخدمات ---- */
        "opensooq.com",
        "jeeran.com",
        "markavip.com",
        "mawdoo3.com",
        "talabat.com.jo",
        "careem.com",
        "souq.jo",
        "noon.jo",

        /* ---- الأخبار والإعلام ---- */
        "alghad.com",
        "ammonnews.net",
        "khaberni.com",
        "jo24.net",
        "addustour.com",
        "sarayanews.jo",
        "jordannews.jo",
        "albayan-news.com",
        "jfrasatv.com",
        "joenews.net",
        "khabarjo.com",
        "alrai.com",

        /* ---- التعليمي ---- */
        "edu.jo",
        "just.edu.jo",
        "ju.edu.jo",
        "mu.edu.jo",
        "psut.edu.jo",
        "aauj.edu",
        "bau.edu.jo",
        "hu.edu.jo",
        "zu.edu.jo",
        "uj.edu.jo"
    ],

    /* ============================================================
     * ALWAYS DIRECT — نطاقات عالمية
     * ============================================================ */
    ALWAYS_DIRECT_DOMAINS: [
        /* Google */
        "google.com",
        "gstatic.com",
        "googleapis.com",
        "googleusercontent.com",
        "googlevideo.com",
        "ggpht.com",
        "youtube.com",
        "ytimg.com",
        "googleadservices.com",
        "googlesyndication.com",
        "google.jo",
        "google-analytics.com",
        "googletagmanager.com",

        /* Apple */
        "apple.com",
        "icloud.com",
        "apple-dns.net",
        "mzstatic.com",
        "cdn-apple.com",

        /* Microsoft */
        "microsoft.com",
        "windowsupdate.com",
        "office.com",
        "office365.com",
        "live.com",
        "outlook.com",
        "skype.com",
        "msn.com",
        "bing.com",
        "azure.com",
        "windows.com",
        "msftconnecttest.com",

        /* Meta */
        "facebook.com",
        "fbcdn.net",
        "fbsbx.com",
        "instagram.com",
        "whatsapp.com",
        "whatsapp.net",
        "threads.net",
        "cdninstagram.com",

        /* TikTok */
        "tiktok.com",
        "tiktokcdn.com",
        "tiktokv.com",
        "musical.ly",
        "bytedance.com",
        "byteoversea.com",
        "snssdk.com",

        /* Telegram */
        "telegram.org",
        "t.me",
        "telegram.me",

        /* Amazon / AWS */
        "amazon.com",
        "amazonaws.com",
        "cloudfront.net",
        "aws.amazon.com",
        "amazonservices.com",

        /* Netflix */
        "netflix.com",
        "nflxvideo.net",
        "nflximg.net",
        "nflxext.com",
        "nflxso.net",

        /* Spotify */
        "spotify.com",
        "spotifycdn.com",
        "scdn.co",
        "spoti.fi",

        /* Cloudflare / CDNs */
        "cloudflare.com",
        "cloudflare-dns.com",
        "cdnjs.cloudflare.com",
        "akamaihd.net",
        "akamaized.net",
        "fastly.net",
        "fastlylb.net",
        "edgecastcdn.net",
        "hwcdn.net",
        "stackpathdns.com",
        "stackpath.com",

        /* GitHub */
        "github.com",
        "github.io",
        "githubusercontent.com",
        "githubassets.com",
        "raw.githubusercontent.com",

        /* Wikipedia */
        "wikipedia.org",
        "wikimedia.org",
        "wikidata.org",
        "wikimediafoundation.org",

        /* DNS */
        "dns.google",
        "cloudflare-dns.com",
        "opendns.com",
        "quad9.net",

        /* أخرى */
        "twitter.com",
        "x.com",
        "twimg.com",
        "linkedin.com",
        "licdn.com",
        "reddit.com",
        "redd.it",
        "redditstatic.com",
        "discord.com",
        "discord.gg",
        "discordapp.com",
        "discordapp.net",
        "zoom.us",
        "dropbox.com",
        "dropboxstatic.com",
        "wetransfer.com",
        "speedtest.net",
        "ooklaserver.net"
    ],

    /* ============================================================
     * DIRECT URL PATTERNS
     * ============================================================ */
    DIRECT_URL_PATTERNS: [
        "*://*.windowsupdate.com/*",
        "*://*.apple.com/*",
        "*://*.icloud.com/*",
        "*://*.akamaized.net/*",
        "*://*.akamaihd.net/*",
        "*://*.steamcontent.com/*",
        "*://*.steamstatic.com/*",
        "*://*.fastly.net/*",
        "*://*.apple-dns.net/*",
        "*://*.github.io/*",
        "*://*.jo/*",
        "*://*.googlevideo.com/*",
        "*://*.youtube.com/*",
        "*://*.nflxvideo.net/*",
        "*://*.nflximg.net/*",
        "*://*.fbcdn.net/*",
        "*://*.cdninstagram.com/*",
        "*://*.spotifycdn.com/*",
        "*://*.tiktokcdn.com/*"
    ]
};


/* ================================================================
 *  ██  دوال مساعدة — UTILITY FUNCTIONS
 * ================================================================ */

function safeLower(value) {
    if (!value) { return ""; }
    return String(value).toLowerCase();
}

/* ================================================================
 * IPv4
 * ================================================================ */
function isIPv4(ip) {
    if (!ip || ip.indexOf(":") !== -1) { return false; }
    var p = ip.split(".");
    if (p.length !== 4) { return false; }
    for (var i = 0; i < 4; i++) {
        if (!/^\d+$/.test(p[i])) { return false; }
        var n = parseInt(p[i], 10);
        if (n < 0 || n > 255) { return false; }
    }
    return true;
}

function ipv4ToUnsigned(ip) {
    var p = ip.split(".");
    return (((parseInt(p[0], 10) * 256 +
              parseInt(p[1], 10)) * 256 +
              parseInt(p[2], 10)) * 256 +
              parseInt(p[3], 10)) >>> 0;
}

function ipv4Mask(prefix) {
    if (prefix <= 0)  { return 0; }
    if (prefix >= 32) { return 0xFFFFFFFF; }
    return (0xFFFFFFFF << (32 - prefix)) >>> 0;
}

function ipv4InCIDR(ip, cidr) {
    if (!isIPv4(ip)) { return false; }
    var parts = cidr.split("/");
    if (parts.length !== 2) { return false; }
    var network = parts[0];
    var prefix  = parseInt(parts[1], 10);
    if (!isIPv4(network) || isNaN(prefix) || prefix < 0 || prefix > 32) {
        return false;
    }
    var mask = ipv4Mask(prefix);
    return ((ipv4ToUnsigned(ip) & mask) === (ipv4ToUnsigned(network) & mask));
}

/* ================================================================
 * IPv6
 * ================================================================ */
function isIPv6(ip) {
    if (!ip || ip.indexOf(":") === -1) { return false; }
    return /^[0-9a-fA-F:]+$/.test(ip);
}

function normalizeIPv6(ip) {
    ip = safeLower(ip);
    var zone = ip.indexOf("%");
    if (zone !== -1) { ip = ip.substring(0, zone); }
    var parts = ip.split("::");
    var left  = parts[0] ? parts[0].split(":") : [];
    var right = (parts.length > 1 && parts[1]) ? parts[1].split(":") : [];
    var missing = 8 - left.length - right.length;
    if (missing < 0) { return null; }
    var full = [];
    var i;
    for (i = 0; i < left.length; i++)  { full.push(left[i] || "0"); }
    for (i = 0; i < missing; i++)      { full.push("0"); }
    for (i = 0; i < right.length; i++) { full.push(right[i] || "0"); }
    while (full.length < 8) { full.push("0"); }
    if (full.length !== 8) { return null; }
    for (i = 0; i < 8; i++) {
        if (!/^[0-9a-f]{1,4}$/.test(full[i])) { return null; }
    }
    return full;
}

function ipv6ToBinary(ip) {
    var groups = normalizeIPv6(ip);
    if (!groups) { return null; }
    var result = "";
    for (var i = 0; i < 8; i++) {
        var bits = parseInt(groups[i], 16).toString(2);
        while (bits.length < 16) { bits = "0" + bits; }
        result += bits;
    }
    return result;
}

function ipv6InCIDR(ip, cidr) {
    if (!isIPv6(ip)) { return false; }
    var parts = cidr.split("/");
    if (parts.length !== 2) { return false; }
    var prefix = parseInt(parts[1], 10);
    if (isNaN(prefix) || prefix < 0 || prefix > 128) { return false; }
    var ipBinary      = ipv6ToBinary(ip);
    var networkBinary = ipv6ToBinary(parts[0]);
    if (!ipBinary || !networkBinary) { return false; }
    return (ipBinary.substring(0, prefix) === networkBinary.substring(0, prefix));
}

/* ================================================================
 * CIDR LIST LOOKUP
 * ================================================================ */
function ipInList(ip, list) {
    for (var i = 0; i < list.length; i++) {
        if (isIPv4(ip) && ipv4InCIDR(ip, list[i])) { return true; }
        if (isIPv6(ip) && ipv6InCIDR(ip, list[i])) { return true; }
    }
    return false;
}

function isPrivateIP(ip) {
    return ipInList(ip, CONFIG.PRIVATE_IPV4) ||
           ipInList(ip, CONFIG.PRIVATE_IPV6);
}

function isJordanIP(ip) {
    return ipInList(ip, CONFIG.JORDAN_IPV4) ||
           ipInList(ip, CONFIG.JORDAN_IPV6);
}

/* ================================================================
 * DOMAIN MATCHING
 * ================================================================ */
function domainMatch(host, domain) {
    host   = safeLower(host);
    domain = safeLower(domain);
    return (host === domain || dnsDomainIs(host, "." + domain));
}

function inDomainList(host, list) {
    for (var i = 0; i < list.length; i++) {
        if (domainMatch(host, list[i])) { return true; }
    }
    return false;
}

function isGameHost(host) {
    return inDomainList(host, CONFIG.GAME_DIRECT_DOMAINS);
}

function isJordanDomain(host) {
    return inDomainList(host, CONFIG.JORDAN_DOMAINS);
}

function isAlwaysDirect(host) {
    return inDomainList(host, CONFIG.ALWAYS_DIRECT_DOMAINS);
}

function isDirectURL(url) {
    for (var i = 0; i < CONFIG.DIRECT_URL_PATTERNS.length; i++) {
        if (shExpMatch(url, CONFIG.DIRECT_URL_PATTERNS[i])) { return true; }
    }
    return false;
}

/* ================================================================
 * تشخيص سريع (للdebug — بيشتغل في بعض المتصفحات)
 * ================================================================ */
function diag(host, ip, result) {
    /* ممكن تضيف alert() أو console.log() للاختبار */
    return result;
}


/* ================================================================
 *  ██  MAIN — الدالة الرئيسية
 * ================================================================
 *
 * ترتيب الأولويات:
 *
 *   1. اسم مجرد (intranet / LAN)            → DIRECT
 *   2. IP خاص / loopback / CGNAT             → DIRECT
 *   3. نطاقات الألعاب / matchmaking          → DIRECT
 *   4. IP أردني (ضمن الـ CIDR ranges)        → DIRECT
 *   5. نطاق أردني (.jo / تجاري)              → DIRECT
 *   6. نطاقات عالمية مُستثناة                → DIRECT
 *   7. أي شي ثاني                           → DIRECT
 *                                        (كل شي DIRECT!)
 *
 * ================================================================ */
function FindProxyForURL(url, host) {

    url  = String(url || "");
    host = safeLower(host);

    /* ---- 1) اسم مجرد بدون نقطة (شبكة داخلية) ---- */
    if (isPlainHostName(host)) {
        return "DIRECT";
    }

    /* ---- 2) IP خاص / loopback / CGNAT ---- */
    if ((isIPv4(host) || isIPv6(host)) && isPrivateIP(host)) {
        return "DIRECT";
    }

    /* ---- 3) ألعاب و matchmaking => DIRECT ---- */
    if (isGameHost(host)) {
        return "DIRECT";
    }

    /* ---- 4) IP أردني (ضمن الـ 31 نطاق IPv4 + 22 نطاق IPv6) ---- */
    if ((isIPv4(host) || isIPv6(host)) && isJordanIP(host)) {
        return "DIRECT";
    }

    /* ---- 5) نطاق أردني (.jo + تجاري + بنوك + خدمات) ---- */
    if (isJordanDomain(host)) {
        return "DIRECT";
    }

    /* ---- 6) نطاقات عالمية مستثناة (CDN, DNS, خدمات) ---- */
    if (isAlwaysDirect(host)) {
        return "DIRECT";
    }

    /* ---- 7) أنماط URL مستثناة ---- */
    if (isDirectURL(url)) {
        return "DIRECT";
    }

    /* ---- 8) كل شي ثاني => DIRECT ---- */
    return "DIRECT";
}
