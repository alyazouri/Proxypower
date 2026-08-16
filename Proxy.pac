/*
 * ======================================================================
 * ALYAZOURI PAC 8.0 — PUBG MOBILE JORDAN FULL / STRICT
 * iOS + Android — Complete PAC File
 * ======================================================================
 *
 * الوضع الافتراضي: PUBG_MAX_CAPTURE
 *
 * 1) نطاقات PUBG Mobile المعروفة          -> PROXY بلا DIRECT
 * 2) أي URL يستعمل IP عاماً مباشرة         -> PROXY بلا DIRECT
 * 3) كل HTTP/HTTPS/WSS العام                -> PROXY بلا DIRECT
 * 4) LAN / Loopback / Private / CGNAT فقط  -> DIRECT
 *
 * البروكسيات:
 *   HTTP        : 212.118.2.91:8080
 *   HTTPS / WSS : 212.35.67.142:80 (CONNECT)
 *
 * مهم جداً:
 *   ملف PAC لا يعترض UDP أو QUIC أو TCP الخام. لذلك لا يستطيع بروكسي
 *   HTTP-GET/CONNECT تمرير حركة مباراة PUBG Mobile كاملة أو ضمان Region
 *   أردني في جميع المودات. يغطي الملف فقط الاتصالات التي يحيلها iOS أو
 *   Android إلى محرك HTTP proxy.
 *
 * لا يوجد DIRECT كخيار احتياطي للإنترنت العام في الوضع الافتراضي.
 * تعطل البروكسي يعني فشل الاتصال بدلاً من التسريب عبر اتصال مباشر.
 * ======================================================================
 */

var CONFIG = {
    VERSION: "8.0.0",
    MODE: "PUBG_MAX_CAPTURE",

    /* PAC تستعمل كلمة PROXY لبروكسي HTTP ولـ HTTPS CONNECT أيضاً. */
    HTTP_PROXY:  "PROXY 212.118.2.91:8080",
    HTTPS_PROXY: "PROXY 212.35.67.142:80",

    /* سلاسل صارمة: لا تضف DIRECT هنا. */
    HTTP_CHAIN:  "PROXY 212.118.2.91:8080; PROXY 212.35.67.142:80",
    HTTPS_CHAIN: "PROXY 212.35.67.142:80; PROXY 212.118.2.91:8080",

    /* true = أقصى تغطية داخل حدود PAC: كل الإنترنت العام HTTP(S) بالبروكسي. */
    PROXY_ALL_PUBLIC_WEB: true,

    /* توجيه URL الذي يحتوي عنوان IP عاماً حرفياً إلى البروكسي. */
    PROXY_PUBLIC_IP_LITERALS: true,

    /* ==================================================================
     * JORDAN IPv4 — القائمة التي كانت موجودة في السكربت الأصلي
     * ================================================================== */
    JORDAN_IPV4: [
        /* Orange / Jordan Telecom */
        "46.185.128.0/17",
        "79.134.128.0/19",
        "88.201.0.0/16",
        "94.249.0.0/16",
        "178.77.128.0/18",
        "37.123.64.0/19",
        "212.35.64.0/19",

        /* Zain */
        "188.247.64.0/18",
        "109.107.128.0/18",

        /* Umniah */
        "37.35.0.0/17",

        /* TE Data */
        "62.72.96.0/19",
        "84.18.32.0/19",
        "84.18.64.0/19",

        /* Batelco */
        "212.34.0.0/19",

        /* Damamax */
        "185.117.80.0/22",

        /* Other / shared */
        "5.45.128.0/20",
        "31.14.80.0/20",
        "46.248.192.0/19",
        "77.245.16.0/20",
        "80.90.160.0/19",
        "82.212.64.0/18",
        "86.108.64.0/18",
        "91.186.224.0/19",
        "95.172.192.0/19",
        "176.57.0.0/19",
        "185.16.160.0/22",
        "193.188.64.0/19",
        "212.118.0.0/19",
        "213.139.32.0/19",
        "213.186.160.0/19",
        "217.144.0.0/20"
    ],

    /* ==================================================================
     * JORDAN IPv6 — القائمة التي كانت موجودة في السكربت الأصلي
     * ================================================================== */
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

    /* ==================================================================
     * PRIVATE / LOOPBACK / LINK-LOCAL / CGNAT
     * هذه فقط تبقى DIRECT في وضع MAX_CAPTURE.
     * ================================================================== */
    PRIVATE_IPV4: [
        "0.0.0.0/8",
        "10.0.0.0/8",
        "100.64.0.0/10",
        "127.0.0.0/8",
        "169.254.0.0/16",
        "172.16.0.0/12",
        "192.168.0.0/16"
    ],

    PRIVATE_IPV6: [
        "::1/128",
        "fc00::/7",
        "fe80::/10"
    ],

    /* ==================================================================
     * PUBG MOBILE — Official / Global / KR / VN / BGMI
     * مطابقة النطاق الجذر تشمل جميع النطاقات الفرعية تلقائياً.
     * ================================================================== */
    PUBG_PROXY_DOMAINS: [
        /* Official PUBG / Krafton */
        "pubg.com",
        "pubg.net",
        "pubgmobile.com",
        "pubgmobile.live",
        "pubgesports.com",
        "pubgstore.com",
        "pubgupdate.com",
        "pubglite.com",
        "pubgforums.com",
        "pubgtournament.com",
        "pubgcommunity.com",
        "krafton.com",
        "battlegroundsmobileindia.com",

        /* Global game, lobby, matchmaking, configuration and downloads */
        "igamecj.com",
        "proximabeta.com",
        "gpubgm.com",
        "pubgameshowtime.com",
        "amsoveasea.com",
        "vasdgame.com",
        "gcloudcs.com",
        "gcloudsdk.com",
        "tdatamaster.com",
        "anticheatexpert.com",
        "infiniplay-game.com",
        "gjacky.com",
        "gamelet.games",

        /* Tencent platform families used by PUBG Mobile */
        "tencent.com",
        "tencentgames.com",
        "qcloud.com",
        "myqcloud.com",
        "qcloudcdn.com",
        "gcloud.qq.com",
        "wetest.qq.com",
        "gamesafe.qq.com",
        "tdm.qq.com",
        "tplay.qq.com",
        "bugly.qq.com",
        "mdt.qq.com",
        "unipay.qq.com",
        "myapp.com",
        "tcdn.qq.com",

        /* Tencent exact/common hosts */
        "dlied1.qq.com",
        "dlied2.qq.com",
        "dlied3.qq.com",
        "dlied4.qq.com",
        "down.qq.com",
        "vmp.qq.com",
        "pingma.qq.com",
        "pingjs.qq.com",
        "tpns.qq.com",
        "mta.qq.com",

        /* Support and regional services */
        "pubgmobile.helpshift.com",
        "pubgmvn.helpshift.com",
        "tencentgames.helpshift.com",
        "pubgm.zing.vn",
        "wechatos.net",
        "onezapp.com",

        /* Authentication / measurement endpoints used during startup */
        "graph.facebook.com",
        "platform-lookaside.fbsbx.com",
        "app-measurement.com",
        "app.adjust.com",
        "gameswhitelisted.googleapis.com",

        /* Known PUBG file host */
        "file-igamecj.akamaized.net",

        /* Shared CDN families; these are not exclusive to PUBG. */
        "akamaized.net",
        "akamaihd.net",
        "akamaiedge.net",
        "edgekey.net",
        "edgesuite.net",
        "cloudfront.net",
        "dnsv1.com"
    ],

    /* ==================================================================
     * JORDAN DOMAINS — من السكربت الأصلي
     * تستعمل فقط إذا غيّرت PROXY_ALL_PUBLIC_WEB إلى false.
     * ================================================================== */
    JORDAN_DOMAINS: [
        "jo",

        /* ISPs */
        "orange.jo",
        "zain.jo",
        "umniah.com",
        "damamax.com",
        "batelco.jo",
        "link.jo",
        "linkdotnet.com.jo",
        "pendasil.com",
        "myinternet.jo",

        /* Banks and finance */
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

        /* Payments */
        "madfooatcom.com",
        "cashu.com",
        "klip.jo",

        /* Commerce and services */
        "opensooq.com",
        "jeeran.com",
        "markavip.com",
        "mawdoo3.com",
        "talabat.com.jo",
        "careem.com",
        "souq.jo",
        "noon.jo",

        /* News and media */
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

        /* Education */
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

    /* ==================================================================
     * ORIGINAL ALWAYS-DIRECT LIST
     * تعمل فقط في وضع PUBG-only عندما يكون PROXY_ALL_PUBLIC_WEB=false.
     * PUBG_PROXY_DOMAINS لها أولوية أعلى ولا تصبح DIRECT.
     * ================================================================== */
    ALWAYS_DIRECT_DOMAINS: [
        /* Google */
        "google.com", "gstatic.com", "googleapis.com", "googleusercontent.com",
        "googlevideo.com", "ggpht.com", "youtube.com", "ytimg.com",
        "googleadservices.com", "googlesyndication.com", "google.jo",
        "google-analytics.com", "googletagmanager.com",

        /* Apple */
        "apple.com", "icloud.com", "apple-dns.net", "mzstatic.com",
        "cdn-apple.com",

        /* Microsoft */
        "microsoft.com", "windowsupdate.com", "office.com", "office365.com",
        "live.com", "outlook.com", "skype.com", "msn.com", "bing.com",
        "azure.com", "windows.com", "msftconnecttest.com",

        /* Meta */
        "facebook.com", "fbcdn.net", "fbsbx.com", "instagram.com",
        "whatsapp.com", "whatsapp.net", "threads.net", "cdninstagram.com",

        /* TikTok */
        "tiktok.com", "tiktokcdn.com", "tiktokv.com", "musical.ly",
        "bytedance.com", "byteoversea.com", "snssdk.com",

        /* Telegram */
        "telegram.org", "t.me", "telegram.me",

        /* Amazon / AWS */
        "amazon.com", "amazonaws.com", "cloudfront.net", "aws.amazon.com",
        "amazonservices.com",

        /* Netflix */
        "netflix.com", "nflxvideo.net", "nflximg.net", "nflxext.com",
        "nflxso.net",

        /* Spotify */
        "spotify.com", "spotifycdn.com", "scdn.co", "spoti.fi",

        /* Cloudflare and CDNs */
        "cloudflare.com", "cloudflare-dns.com", "cdnjs.cloudflare.com",
        "akamaihd.net", "akamaized.net", "fastly.net", "fastlylb.net",
        "edgecastcdn.net", "hwcdn.net", "stackpathdns.com", "stackpath.com",

        /* GitHub */
        "github.com", "github.io", "githubusercontent.com", "githubassets.com",
        "raw.githubusercontent.com",

        /* Wikimedia */
        "wikipedia.org", "wikimedia.org", "wikidata.org",
        "wikimediafoundation.org",

        /* DNS */
        "dns.google", "opendns.com", "quad9.net",

        /* Other */
        "twitter.com", "x.com", "twimg.com", "linkedin.com", "licdn.com",
        "reddit.com", "redd.it", "redditstatic.com", "discord.com",
        "discord.gg", "discordapp.com", "discordapp.net", "zoom.us",
        "dropbox.com", "dropboxstatic.com", "wetransfer.com",
        "speedtest.net", "ooklaserver.net"
    ],

    DIRECT_URL_PATTERNS: [
        "*://*.windowsupdate.com/*",
        "*://*.apple.com/*",
        "*://*.icloud.com/*",
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

/* ======================================================================
 * Utility
 * ====================================================================== */

function safeLower(value) {
    if (!value) { return ""; }
    return String(value).toLowerCase();
}

/* ======================================================================
 * IPv4
 * ====================================================================== */

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
    var prefix = parseInt(parts[1], 10);

    if (!isIPv4(network) || isNaN(prefix) || prefix < 0 || prefix > 32) {
        return false;
    }

    var mask = ipv4Mask(prefix);

    return ((ipv4ToUnsigned(ip) & mask) ===
            (ipv4ToUnsigned(network) & mask));
}

/* ======================================================================
 * IPv6
 * ====================================================================== */

function isIPv6(ip) {
    if (!ip || ip.indexOf(":") === -1) { return false; }
    return /^[0-9a-fA-F:]+$/.test(ip);
}

function normalizeIPv6(ip) {
    ip = safeLower(ip);

    var zone = ip.indexOf("%");
    if (zone !== -1) {
        ip = ip.substring(0, zone);
    }

    var parts = ip.split("::");
    if (parts.length > 2) { return null; }

    var left = parts[0] ? parts[0].split(":") : [];
    var right = (parts.length === 2 && parts[1]) ? parts[1].split(":") : [];
    var missing;

    if (parts.length === 1) {
        if (left.length !== 8) { return null; }
        missing = 0;
    } else {
        missing = 8 - left.length - right.length;
        if (missing < 1) { return null; }
    }

    var full = [];
    var i;

    for (i = 0; i < left.length; i++) {
        full.push(left[i] || "0");
    }

    for (i = 0; i < missing; i++) {
        full.push("0");
    }

    for (i = 0; i < right.length; i++) {
        full.push(right[i] || "0");
    }

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

        while (bits.length < 16) {
            bits = "0" + bits;
        }

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

    var ipBinary = ipv6ToBinary(ip);
    var networkBinary = ipv6ToBinary(parts[0]);

    if (!ipBinary || !networkBinary) { return false; }

    return (ipBinary.substring(0, prefix) ===
            networkBinary.substring(0, prefix));
}

/* ======================================================================
 * IP lists
 * ====================================================================== */

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

/* ======================================================================
 * Domains
 * ====================================================================== */

function domainMatch(host, domain) {
    host = safeLower(host);
    domain = safeLower(domain);

    return (host === domain || dnsDomainIs(host, "." + domain));
}

function inDomainList(host, list) {
    for (var i = 0; i < list.length; i++) {
        if (domainMatch(host, list[i])) { return true; }
    }

    return false;
}

function isPUBGHost(host) {
    return inDomainList(host, CONFIG.PUBG_PROXY_DOMAINS);
}

function isJordanDomain(host) {
    return inDomainList(host, CONFIG.JORDAN_DOMAINS);
}

function isAlwaysDirect(host) {
    return inDomainList(host, CONFIG.ALWAYS_DIRECT_DOMAINS);
}

function isDirectURL(url) {
    for (var i = 0; i < CONFIG.DIRECT_URL_PATTERNS.length; i++) {
        if (shExpMatch(url, CONFIG.DIRECT_URL_PATTERNS[i])) {
            return true;
        }
    }

    return false;
}

/* ======================================================================
 * Strict proxy selection — never returns DIRECT
 * ====================================================================== */

function strictProxyForURL(url) {
    var u = safeLower(url);

    if (shExpMatch(u, "https:*") || shExpMatch(u, "wss:*")) {
        return CONFIG.HTTPS_CHAIN;
    }

    if (shExpMatch(u, "http:*") || shExpMatch(u, "ws:*")) {
        return CONFIG.HTTP_CHAIN;
    }

    /* Unknown PAC-visible protocol: try CONNECT chain, without DIRECT. */
    return CONFIG.HTTPS_CHAIN;
}

/* ======================================================================
 * MAIN
 * ======================================================================
 *
 * ترتيب الأولويات:
 *
 * 1. LAN hostname / .local                 -> DIRECT
 * 2. Private / loopback / CGNAT IP          -> DIRECT
 * 3. PUBG domains and subdomains            -> PROXY, no DIRECT
 * 4. Public literal IP URL                   -> PROXY, no DIRECT
 * 5. MAX_CAPTURE enabled                    -> all public HTTP(S) PROXY
 * 6. If MAX_CAPTURE disabled:
 *      Jordan IP/domain + original excludes -> DIRECT
 *      everything else                      -> DIRECT
 *
 * ====================================================================== */

function FindProxyForURL(url, host) {
    url = String(url || "");
    host = safeLower(host);

    /* Local names and mDNS. */
    if (isPlainHostName(host) || dnsDomainIs(host, ".local")) {
        return "DIRECT";
    }

    /* Private, loopback, link-local and CGNAT remain local. */
    if ((isIPv4(host) || isIPv6(host)) && isPrivateIP(host)) {
        return "DIRECT";
    }

    /* PUBG has highest public-network priority. */
    if (isPUBGHost(host)) {
        return strictProxyForURL(url);
    }

    /* Catch public IP literals used by PAC-visible game APIs. */
    if (CONFIG.PROXY_PUBLIC_IP_LITERALS &&
        (isIPv4(host) || isIPv6(host))) {
        return strictProxyForURL(url);
    }

    /* Maximum HTTP(S) capture: catches changing auth/CDN/API hostnames. */
    if (CONFIG.PROXY_ALL_PUBLIC_WEB) {
        return strictProxyForURL(url);
    }

    /* Original direct behavior below is active only when MAX is disabled. */
    if ((isIPv4(host) || isIPv6(host)) && isJordanIP(host)) {
        return "DIRECT";
    }

    if (isJordanDomain(host)) {
        return "DIRECT";
    }

    if (isAlwaysDirect(host)) {
        return "DIRECT";
    }

    if (isDirectURL(url)) {
        return "DIRECT";
    }

    return "DIRECT";
}
