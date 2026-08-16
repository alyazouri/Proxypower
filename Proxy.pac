Alyazouri PAC 6.0 — Full Internet SOCKS5 Ready

/*
 * ================================================================
 * ALYAZOURI PAC 6.0
 * FULL INTERNET + SOCKS5 + JORDAN NETWORK INTELLIGENCE
 * ================================================================
 *
 * ROUTING POLICY
 *
 * Internet                         -> SOCKS5
 * ALWAYS_DIRECT_DOMAINS            -> DIRECT
 * Local/private networks           -> DIRECT
 * Jordan IPv4/IPv6                 -> SOCKS5
 * Foreign IPv4/IPv6                -> SOCKS5
 * PUBG/Game traffic                -> SOCKS5
 *
 * NO DIRECT FALLBACK FOR INTERNET
 *
 * SOCKS5 #1 -> SOCKS5 #2 -> SOCKS5 #3
 *
 * ================================================================
 */
var CONFIG = {
    VERSION: "6.0.0",
    MODE: "FULL_INTERNET_SOCKS5",
    PROXY_ENABLED: true,
    FAIL_CLOSED: true,
    MAX_PROXY_CHAIN: 3,
    /*
     * ============================================================
     * SOCKS5 PROXY POOL
     * ============================================================
     *
     * Selected from the supplied EbraSha SOCKS5 list.
     *
     * Priority:
     *
     * 1. 104.248.197.67:1080
     * 2. 104.248.203.234:1080
     * 3. 139.59.24.173:1080
     *
     * NOTE:
     * Public-list presence does NOT guarantee current availability.
     */
    PROXIES: [
        {
            name: "SOCKS5_PRIMARY",
            host: "104.248.197.67",
            port: 1080,
            type: "SOCKS5",
            enabled: true,
            priority: 110,
            weight: 5
        },
        {
            name: "SOCKS5_SECONDARY",
            host: "104.248.203.234",
            port: 1080,
            type: "SOCKS5",
            enabled: true,
            priority: 105,
            weight: 4
        },
        {
            name: "SOCKS5_BACKUP",
            host: "139.59.24.173",
            port: 1080,
            type: "SOCKS5",
            enabled: true,
            priority: 95,
            weight: 2
        }
    ],
    /*
     * ============================================================
     * JORDAN IPv4
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
        "91.186.224.0/19"
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
        "2a02:26f7:df00:4000::/64",
        "2a02:26f7:df00:d140::/61",
        "2a02:26f7:df00:d148::/64",
        "2a02:26f7:df01:4000::/64",
        "2a02:26f7:df04:4000::/64",
        "2a02:26f7:df04:d140::/61",
        "2a02:26f7:df04:d148::/64",
        "2a02:26f7:df05:4000::/64",
        "2a02:26f7:df08:4000::/64",
        "2a02:26f7:df08:d140::/61",
        "2a02:26f7:df08:d148::/64",
        "2a02:26f7:df09:4000::/64",
        "2a02:5b60::/32",
        "2a02:c040::/29",
        "2a02:e680::/29",
        "2a02:f0c0::/29",
        "2a03:6b00::/29",
        "2a03:6d00::/32",
        "2a03:b640::/32",
        "2a04:2ec0::/29",
        "2a04:4e41:1402:b000::/52",
        "2a04:4e41:1419::/48",
        "2a04:4e41:1802:c000::/52",
        "2a04:4e41:1823::/48",
        "2a04:4e41:4017::/52",
        "2a04:4e41:4027::/52",
        "2a04:4e41:4037::/52",
        "2a04:4e41:4047::/52",
        "2a04:4e41:4057::/52",
        "2a04:4e41:4067::/52",
        "2a04:4e41:4077::/52",
        "2a04:4e41:4087::/52",
        "2a04:4e41:5201:d000::/52",
        "2a04:4e41:520d::/48",
        "2a04:4e41:5602:b000::/52",
        "2a04:4e41:5619::/48",
        "2a04:6200::/29",
        "2a05:74c0::/29",
        "2a05:7500::/29",
        "2a06:9bc0::/29",
        "2a06:bd80::/29",
        "2a07:140::/29",
        "2a07:d887:7000::/40"
    ],
    /*
     * ============================================================
     * ONLY INTERNET BYPASS LIST
     * ============================================================
     */
    ALWAYS_DIRECT_DOMAINS: [
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
        "twitter.com",
        "x.com",
        "tiktok.com",
        "microsoft.com",
        "windowsupdate.com",
        "office.com",
        "live.com",
        "netflix.com",
        "spotify.com",
        "cloudflare.com",
        "amazon.com",
        "aws.amazon.com",
        "akamaihd.net",
        "akamaized.net",
        "fastly.net",
        "steamcontent.com",
        "steamstatic.com",
        "github.com",
        "githubusercontent.com",
        "gitlab.com",
        "stackoverflow.com",
        "wikipedia.org"
    ],
    /*
     * ============================================================
     * DIRECT URL EXCEPTIONS
     * ============================================================
     */
    DIRECT_URL_PATTERNS: [
        "*://*.download.windowsupdate.com/*",
        "*://*.windowsupdate.com/*",
        "*://*.apple.com/*",
        "*://*.icloud.com/*",
        "*://*.akamaized.net/*",
        "*://*.akamaihd.net/*",
        "*://*.steamcontent.com/*",
        "*://*.steamstatic.com/*",
        "*://*.fastly.net/*",
        "*://*.apple-dns.net/*",
        "*://*.github.io/*"
    ],
    /*
     * ============================================================
     * PRIVATE IPv4
     * ============================================================
     */
    PRIVATE_IPV4: [
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "127.0.0.0/8",
        "169.254.0.0/16"
    ],
    /*
     * ============================================================
     * PRIVATE / LOCAL IPv6
     * ============================================================
     */
    PRIVATE_IPV6: [
        "fc00::/7",
        "fe80::/10",
        "::1/128"
    ]
};
/*
 * ================================================================
 * STRING
 * ================================================================
 */
function safeLower(value) {
    if (!value) {
        return "";
    }
    return String(value).toLowerCase();
}
/*
 * ================================================================
 * IPv4
 * ================================================================
 */
function isIPv4(ip) {
    if (
        !ip ||
        ip.indexOf(":") !== -1
    ) {
        return false;
    }
    var p = ip.split(".");
    if (p.length !== 4) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        if (!/^\d+$/.test(p[i])) {
            return false;
        }
        var n =
            parseInt(
                p[i],
                10
            );
        if (
            n < 0 ||
            n > 255
        ) {
            return false;
        }
    }
    return true;
}
function ipv4ToUnsigned(ip) {
    var p =
        ip.split(".");
    return (
        (
            (
                parseInt(p[0], 10) *
                256 +
                parseInt(p[1], 10)
            ) *
            256 +
            parseInt(p[2], 10)
        ) *
        256 +
        parseInt(p[3], 10)
    ) >>> 0;
}
function ipv4Mask(prefix) {
    if (prefix <= 0) {
        return 0;
    }
    if (prefix >= 32) {
        return 0xFFFFFFFF;
    }
    return (
        0xFFFFFFFF <<
        (32 - prefix)
    ) >>> 0;
}
function ipv4InCIDR(
    ip,
    cidr
) {
    if (!isIPv4(ip)) {
        return false;
    }
    var parts =
        cidr.split("/");
    if (parts.length !== 2) {
        return false;
    }
    var network =
        parts[0];
    var prefix =
        parseInt(
            parts[1],
            10
        );
    if (
        !isIPv4(network) ||
        isNaN(prefix) ||
        prefix < 0 ||
        prefix > 32
    ) {
        return false;
    }
    var mask =
        ipv4Mask(prefix);
    return (
        (
            ipv4ToUnsigned(ip) &
            mask
        ) ===
        (
            ipv4ToUnsigned(network) &
            mask
        )
    );
}
/*
 * ================================================================
 * IPv6
 * ================================================================
 */
function isIPv6(ip) {
    if (
        !ip ||
        ip.indexOf(":") === -1
    ) {
        return false;
    }
    return /^[0-9a-fA-F:]+$/.test(ip);
}
function normalizeIPv6(ip) {
    ip =
        safeLower(ip);
    var zone =
        ip.indexOf("%");
    if (zone !== -1) {
        ip =
            ip.substring(
                0,
                zone
            );
    }
    var parts =
        ip.split("::");
    var left =
        parts[0]
        ? parts[0].split(":")
        : [];
    var right =
        parts.length > 1 &&
        parts[1]
        ? parts[1].split(":")
        : [];
    var missing =
        8 -
        left.length -
        right.length;
    if (missing < 0) {
        return null;
    }
    var full = [];
    var i;
    for (
        i = 0;
        i < left.length;
        i++
    ) {
        full.push(
            left[i] || "0"
        );
    }
    for (
        i = 0;
        i < missing;
        i++
    ) {
        full.push("0");
    }
    for (
        i = 0;
        i < right.length;
        i++
    ) {
        full.push(
            right[i] || "0"
        );
    }
    while (
        full.length < 8
    ) {
        full.push("0");
    }
    if (
        full.length !== 8
    ) {
        return null;
    }
    for (
        i = 0;
        i < 8;
        i++
    ) {
        if (
            !/^[0-9a-f]{1,4}$/
            .test(full[i])
        ) {
            return null;
        }
    }
    return full;
}
function ipv6ToBinary(ip) {
    var groups =
        normalizeIPv6(ip);
    if (!groups) {
        return null;
    }
    var result = "";
    for (
        var i = 0;
        i < 8;
        i++
    ) {
        var value =
            parseInt(
                groups[i],
                16
            );
        var bits =
            value.toString(2);
        while (
            bits.length < 16
        ) {
            bits =
                "0" + bits;
        }
        result += bits;
    }
    return result;
}
function ipv6InCIDR(
    ip,
    cidr
) {
    if (!isIPv6(ip)) {
        return false;
    }
    var parts =
        cidr.split("/");
    if (parts.length !== 2) {
        return false;
    }
    var prefix =
        parseInt(
            parts[1],
            10
        );
    if (
        isNaN(prefix) ||
        prefix < 0 ||
        prefix > 128
    ) {
        return false;
    }
    var ipBinary =
        ipv6ToBinary(ip);
    var networkBinary =
        ipv6ToBinary(parts[0]);
    if (
        !ipBinary ||
        !networkBinary
    ) {
        return false;
    }
    return (
        ipBinary.substring(
            0,
            prefix
        ) ===
        networkBinary.substring(
            0,
            prefix
        )
    );
}
/*
 * ================================================================
 * CIDR LIST
 * ================================================================
 */
function ipInList(
    ip,
    list
) {
    for (
        var i = 0;
        i < list.length;
        i++
    ) {
        if (
            isIPv4(ip) &&
            ipv4InCIDR(
                ip,
                list[i]
            )
        ) {
            return true;
        }
        if (
            isIPv6(ip) &&
            ipv6InCIDR(
                ip,
                list[i]
            )
        ) {
            return true;
        }
    }
    return false;
}
function isPrivateIP(ip) {
    return (
        ipInList(
            ip,
            CONFIG.PRIVATE_IPV4
        ) ||
        ipInList(
            ip,
            CONFIG.PRIVATE_IPV6
        )
    );
}
/*
 * ================================================================
 * DOMAIN MATCH
 * ================================================================
 */
function domainMatch(
    host,
    domain
) {
    host =
        safeLower(host);
    domain =
        safeLower(domain);
    return (
        host === domain ||
        dnsDomainIs(
            host,
            "." + domain
        )
    );
}
function isAlwaysDirect(
    host
) {
    for (
        var i = 0;
        i <
        CONFIG
            .ALWAYS_DIRECT_DOMAINS
            .length;
        i++
    ) {
        if (
            domainMatch(
                host,
                CONFIG
                    .ALWAYS_DIRECT_DOMAINS[i]
            )
        ) {
            return true;
        }
    }
    return false;
}
function isDirectURL(
    url
) {
    for (
        var i = 0;
        i <
        CONFIG
            .DIRECT_URL_PATTERNS
            .length;
        i++
    ) {
        if (
            shExpMatch(
                url,
                CONFIG
                    .DIRECT_URL_PATTERNS[i]
            )
        ) {
            return true;
        }
    }
    return false;
}
/*
 * ================================================================
 * PROXY VALIDATION
 * ================================================================
 */
function isValidProxy(
    proxy
) {
    if (!proxy) {
        return false;
    }
    if (!proxy.enabled) {
        return false;
    }
    if (
        !proxy.host ||
        !proxy.port
    ) {
        return false;
    }
    if (
        proxy.port < 1 ||
        proxy.port > 65535
    ) {
        return false;
    }
    return (
        proxy.type ===
        "SOCKS5"
    );
}
/*
 * ================================================================
 * PROXY ORDER
 * ================================================================
 */
function getProxyChain() {
    var list = [];
    for (
        var i = 0;
        i <
        CONFIG.PROXIES.length;
        i++
    ) {
        if (
            isValidProxy(
                CONFIG.PROXIES[i]
            )
        ) {
            list.push(
                CONFIG.PROXIES[i]
            );
        }
    }
    list.sort(
        function(a, b) {
            if (
                a.priority !==
                b.priority
            ) {
                return (
                    b.priority -
                    a.priority
                );
            }
            return (
                b.weight -
                a.weight
            );
        }
    );
    var chain = [];
    for (
        var j = 0;
        j <
        list.length &&
        j <
        CONFIG.MAX_PROXY_CHAIN;
        j++
    ) {
        chain.push(
            "SOCKS5 " +
            list[j].host +
            ":" +
            list[j].port
        );
    }
    return chain;
}
/*
 * ================================================================
 * FAIL CLOSED
 * ================================================================
 */
function failClosed() {
    /*
     * Deliberately invalid proxy.
     *
     * Prevents silent DIRECT fallback.
     */
    return "SOCKS5 0.0.0.0:1";
}
/*
 * ================================================================
 * MAIN PAC
 * ================================================================
 */
function FindProxyForURL(
    url,
    host
) {
    url =
        String(url || "");
    host =
        safeLower(host);
    /*
     * ============================================================
     * 1. ALWAYS DIRECT DOMAINS
     * ============================================================
     */
    if (
        isAlwaysDirect(host)
    ) {
        return "DIRECT";
    }
    /*
     * ============================================================
     * 2. DIRECT URL EXCEPTIONS
     * ============================================================
     */
    if (
        isDirectURL(url)
    ) {
        return "DIRECT";
    }
    /*
     * ============================================================
     * 3. LOCAL HOSTS
     * ============================================================
     */
    if (
        isPlainHostName(host)
    ) {
        return "DIRECT";
    }
    /*
     * ============================================================
     * 4. PRIVATE / LOOPBACK IPs
     * ============================================================
     */
    if (
        (
            isIPv4(host) ||
            isIPv6(host)
        ) &&
        isPrivateIP(host)
    ) {
        return "DIRECT";
    }
    /*
     * ============================================================
     * 5. EVERYTHING ELSE = SOCKS5
     * ============================================================
     */
    if (
        CONFIG.PROXY_ENABLED
    ) {
        var chain =
            getProxyChain();
        if (
            chain.length > 0
        ) {
            return chain.join(
                "; "
            );
        }
    }
    /*
     * ============================================================
     * 6. NO PROXY
     * ============================================================
     */
    if (
        CONFIG.FAIL_CLOSED
    ) {
        return failClosed();
    }
    /*
     * This line should not normally be reached.
     */
    return "DIRECT";
}
  /*
سياسة المسار

                    ┌─────────────────────┐
                    │     Internet URL     │
                    └──────────┬──────────┘
                               │
                 ┌─────────────▼─────────────┐
                 │ ALWAYS_DIRECT_DOMAINS ?   │
                 └─────────────┬─────────────┘
                         YES ──┘ └── NO
                         │             │
                         ▼             ▼
                      DIRECT      ┌──────────────┐
                                  │ Local/Private│
                                  │     IP ?     │
                                  └──────┬───────┘
                                   YES ──┘ └── NO
                                   │             │
                                   ▼             ▼
                                DIRECT       SOCKS5 #1
                                               │
                                               ▼
                                        SOCKS5 #2
                                               │
                                               ▼
                                        SOCKS5 #3
                                               │
                                               ▼
                                         BLOCK

البروكسيات المستخدمة حاليًا

1. 104.248.197.67:1080
2. 104.248.203.234:1080
3. 139.59.24.173:1080

وهي موجودة فعلًا في ملف SOCKS5 الذي أعطيتني إياه. (GitHub)

ملاحظة مهمة: ترتيب الثلاثة هنا هو ترتيب أولوية، وليس ادعاءً بأن الأول حاليًا أسرع من الثاني أو أنه مضمون 100%. ملف GitHub نفسه مجرد قائمة endpoints؛ الـPAC لا يستطيع قياس الـRTT/Jitter/Packet Loss قبل اتخاذ القرار.

إذا كان العميل الذي ستضع عليه الـPAC لا يدعم SOCKS5 في ملفات PAC، فلن تعمل صيغة SOCKS5 host:port كما هو متوقع؛ دعم PAC/SOCKS5 يعتمد على التطبيق. (GitHub)
 */
