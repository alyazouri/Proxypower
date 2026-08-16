/*
 * ================================================================
 * ALYAZOURI PAC 6.1 — JORDAN PURE ROUTE
 * ================================================================
 *
 * الهدف: مسار أردني بيور (خروج من IP أردني فقط)
 *
 * ROUTING POLICY (بالترتيب)
 *
 *  1. Local / private / loopback        -> DIRECT
 *  2. Plain hostnames (intranet)        -> DIRECT
 *  3. GAME / MATCHMAKING domains        -> DIRECT   (مسار أردني بيور)
 *  4. Jordan IPv4 / IPv6 destinations   -> DIRECT   (ما في معنى تخرج برّا وترجع)
 *  5. ALWAYS_DIRECT_DOMAINS             -> DIRECT
 *  6. باقي الإنترنت                      -> JO_PROXY إذا (وفقط إذا) البروكسي IP أردني
 *                                          وإلا -> حسب NON_JO_FALLBACK
 *
 * ================================================================
 * تحذيرات لازم تنقرأ (ما هي زينة):
 *
 * [1] PAC ما بيتحكم بترافيك الألعاب.
 *     PUBG / COD / Fortnite بتستخدم UDP خام + بروتوكولات خاصة،
 *     والـ PAC بينطبق فقط على التطبيقات اللي تقرأه (متصفحات، بعض
 *     التطبيقات). حتى لو كتبت "PUBG -> SOCKS5" ما رح يصير إشي.
 *     => الطريقة الوحيدة تضمن matchmaking أردني/إقليمي:
 *        تضل على IP أردني حقيقي بدون أي بروكسي/VPN، وهذا بالضبط
 *        اللي بتعمله هاي النسخة (DIRECT للألعاب).
 *
 * [2] SOCKS5 داخل PAC مدعوم جزئيًا فقط:
 *     Chrome/Chromium/Firefox بيدعموا "SOCKS5 host:port".
 *     نظام iOS/macOS وبعض التطبيقات ما بتدعمه من PAC.
 *
 * [3] البروكسيات القديمة في 6.0 مش أردنية:
 *        104.248.197.67  -> DigitalOcean (أوروبا)
 *        104.248.203.234 -> DigitalOcean (أوروبا)
 *        139.59.24.173   -> DigitalOcean (أوروبا)
 *     استخدامها = خصم وفريق أوروبي، عكس المطلوب تمامًا.
 *     لهيك انحطّت enabled:false، وفي فحص تلقائي
 *     (ENFORCE_JORDAN_EXIT) بيرفض أي بروكسي IP مش داخل نطاقات الأردن.
 * ================================================================
 */

var CONFIG = {
    VERSION: "6.1.0",
    MODE: "JORDAN_PURE",

    /* إذا false => كل شي DIRECT (أنقى مسار أردني ممكن) */
    PROXY_ENABLED: false,

    /* يرفض أي بروكسي IP مش ضمن نطاقات الأردن أدناه */
    ENFORCE_JORDAN_EXIT: true,

    /* لما ما يكون في بروكسي أردني صالح: "DIRECT" أو "BLOCK" */
    NON_JO_FALLBACK: "DIRECT",

    MAX_PROXY_CHAIN: 3,

    /*
     * ============================================================
     * JORDAN EXIT PROXY POOL
     * ============================================================
     * حط هون بروكسي أردني حقيقي (Orange JO / Zain JO / Umniah / VPS أردني)
     * وخلي enabled:true. أي IP غير أردني رح يترفض تلقائيًا.
     */
    PROXIES: [
        {
            name: "JO_EXIT_PRIMARY",
            host: "0.0.0.0",          /* <-- ضع IP أردني هنا */
            port: 1080,
            type: "SOCKS5",
            enabled: false,
            priority: 100,
            weight: 5
        },
        {
            name: "JO_EXIT_SECONDARY",
            host: "0.0.0.0",
            port: 1080,
            type: "SOCKS5",
            enabled: false,
            priority: 90,
            weight: 3
        },

        /* --- بروكسيات 6.0 القديمة: أوروبية، معطّلة عمدًا --- */
        { name: "LEGACY_EU_1", host: "104.248.197.67",  port: 1080, type: "SOCKS5", enabled: false, priority: 10, weight: 1 },
        { name: "LEGACY_EU_2", host: "104.248.203.234", port: 1080, type: "SOCKS5", enabled: false, priority: 9,  weight: 1 },
        { name: "LEGACY_EU_3", host: "139.59.24.173",   port: 1080, type: "SOCKS5", enabled: false, priority: 8,  weight: 1 }
    ],

    /*
     * ============================================================
     * GAME / MATCHMAKING DOMAINS -> DIRECT دائمًا
     * ============================================================
     * هدول للّوجن/الـ API/الـ CDN تبع الألعاب. تمريرهم عبر بروكسي أجنبي
     * بيخلّي السيرفر يشوفك أجنبي => لوبي أجنبي.
     */
    GAME_DIRECT_DOMAINS: [
        "pubg.com",
        "pubgmobile.com",
        "pubgmobile.live",
        "igamecj.com",
        "proximabeta.com",
        "tencentgames.com",
        "qcloud.com",
        "tencent.com",
        "krafton.com",
        "battlegroundsmobileindia.com",
        "garena.com",
        "callofduty.com",
        "activision.com",
        "blizzard.com",
        "battle.net",
        "riotgames.com",
        "leagueoflegends.com",
        "valorant.com",
        "epicgames.com",
        "fortnite.com",
        "ea.com",
        "easports.com",
        "playstation.net",
        "playstation.com",
        "xboxlive.com",
        "steampowered.com",
        "steamcommunity.com",
        "steamcontent.com",
        "steamstatic.com",
        "roblox.com",
        "rbxcdn.com",
        "supercell.com",
        "miniclip.com",
        "unity3d.com",
        "unityads.unity3d.com",
        "agora.io",
        "photonengine.com"
    ],

    /*
     * ============================================================
     * JORDAN IPv4  (وجهات محلية + فحص خروج البروكسي)
     * ============================================================
     */
    JORDAN_IPV4: [
        "212.34.0.0/19",
        "212.35.64.0/19",
        "212.118.0.0/19",
        "213.139.32.0/19",
        "213.186.160.0/19",
        "193.188.64.0/19",
        "178.77.128.0/18",
        "176.57.0.0/19",
        "95.172.192.0/19",
        "84.18.32.0/19",
        "84.18.64.0/19",
        "37.123.64.0/19",
        "46.185.128.0/17",
        "46.248.192.0/19",
        "79.134.128.0/19",
        "5.45.128.0/20",
        "91.186.224.0/19",
        "80.90.160.0/19",
        "185.16.160.0/22",
        "188.247.64.0/18",
        "77.245.16.0/20",
        "62.72.96.0/19",
        "94.249.0.0/16",
        "82.212.64.0/18",
        "217.144.0.0/20"
    ],

    /*
     * ============================================================
     * JORDAN IPv6
     * ============================================================
     */
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

    ALWAYS_DIRECT_DOMAINS: [
        "jo",                 /* كل النطاقات الأردنية .jo */
        "apple.com",
        "icloud.com",
        "google.com",
        "gstatic.com",
        "googleapis.com",
        "youtube.com",
        "ytimg.com",
        "facebook.com",
        "fbcdn.net",
        "instagram.com",
        "whatsapp.com",
        "telegram.org",
        "tiktok.com",
        "microsoft.com",
        "windowsupdate.com",
        "office.com",
        "live.com",
        "netflix.com",
        "spotify.com",
        "cloudflare.com",
        "amazon.com",
        "akamaihd.net",
        "akamaized.net",
        "fastly.net",
        "github.com",
        "githubusercontent.com",
        "wikipedia.org",
        "orange.jo",
        "zain.jo",
        "umniah.com",
        "efawateercom.jo",
        "eservices.gov.jo",
        "cliq.jo"
    ],

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
        "*://*.jo/*"
    ],

    PRIVATE_IPV4: [
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "127.0.0.0/8",
        "169.254.0.0/16",
        "100.64.0.0/10"       /* CGNAT — شائع عند مزودي الأردن */
    ],

    PRIVATE_IPV6: [
        "fc00::/7",
        "fe80::/10",
        "::1/128"
    ]
};

/* ================================================================
 * STRING
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
 * CIDR LIST
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
 * DOMAIN MATCH
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
 * PROXY VALIDATION — لازم يكون أردني
 * ================================================================ */
function isValidProxy(proxy) {
    if (!proxy)          { return false; }
    if (!proxy.enabled)  { return false; }
    if (!proxy.host || !proxy.port) { return false; }
    if (proxy.port < 1 || proxy.port > 65535) { return false; }
    if (proxy.type !== "SOCKS5" && proxy.type !== "PROXY") { return false; }

    /* placeholder */
    if (proxy.host === "0.0.0.0") { return false; }

    /* شرط "المسار الأردني البيور": IP خروج داخل نطاقات الأردن */
    if (CONFIG.ENFORCE_JORDAN_EXIT) {
        if (!isIPv4(proxy.host) && !isIPv6(proxy.host)) {
            /* hostname ما نقدر نتحقق منه وقت التقييم => نرفضه */
            return false;
        }
        if (!isJordanIP(proxy.host)) { return false; }
    }
    return true;
}

function getProxyChain() {
    var list = [];
    var i;
    for (i = 0; i < CONFIG.PROXIES.length; i++) {
        if (isValidProxy(CONFIG.PROXIES[i])) { list.push(CONFIG.PROXIES[i]); }
    }
    list.sort(function (a, b) {
        if (a.priority !== b.priority) { return b.priority - a.priority; }
        return b.weight - a.weight;
    });
    var chain = [];
    for (var j = 0; j < list.length && j < CONFIG.MAX_PROXY_CHAIN; j++) {
        chain.push(list[j].type + " " + list[j].host + ":" + list[j].port);
    }
    return chain;
}

function blockRoute() {
    /* بروكسي غير صالح عمدًا => منع التسريب بدل السقوط الصامت لـ DIRECT */
    return "SOCKS5 0.0.0.0:1";
}

/* ================================================================
 * MAIN
 * ================================================================ */
function FindProxyForURL(url, host) {
    url  = String(url || "");
    host = safeLower(host);

    /* 1) شبكة محلية / intranet */
    if (isPlainHostName(host)) { return "DIRECT"; }
    if ((isIPv4(host) || isIPv6(host)) && isPrivateIP(host)) { return "DIRECT"; }

    /* 2) الألعاب و الـ matchmaking => مسار أردني بيور، بدون بروكسي */
    if (isGameHost(host)) { return "DIRECT"; }

    /* 3) وجهات داخل الأردن */
    if ((isIPv4(host) || isIPv6(host)) && isJordanIP(host)) { return "DIRECT"; }

    /* 4) استثناءات الدومين / الـ URL */
    if (isAlwaysDirect(host)) { return "DIRECT"; }
    if (isDirectURL(url))     { return "DIRECT"; }

    /* 5) باقي الإنترنت */
    if (CONFIG.PROXY_ENABLED) {
        var chain = getProxyChain();
        if (chain.length > 0) {
            /* DIRECT ما بينحط بالسلسلة حتى ما يتسرب الخروج لغير أردني */
            return chain.join("; ");
        }
    }

    /* 6) ما في مخرج أردني صالح */
    if (CONFIG.NON_JO_FALLBACK === "BLOCK") { return blockRoute(); }
    return "DIRECT";
}
