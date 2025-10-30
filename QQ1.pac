// PAC script محسن — مُعدّل: أُزيلت كل حالات DIRECT => كل الترافيك يمر عبر بروكسيات أردنية
// تأكّد من ملء JO_PROXIES ببروكسيات أردنية صالحة (IP:PORT أو hostname:PORT)

var JO_PROXIES = [
    "PROXY 91.106.109.12:443"   // ضع هنا بروكسي أردني رئيسي/قائمة فالباك
    // "PROXY 94.249.10.10:443",
    // "PROXY 109.107.225.10:443"
];

var DNS_CACHE_TTL = 60; // ثواني للكاش

var JO_IP_RANGES = [
    "89.187.0.0/16",
    "196.52.0.0/16",
    "91.106.0.0/16",
    "41.222.0.0/16",
    "2.17.24.0/22",
    "5.45.128.0/20",
    "37.17.192.0/20",
    "46.185.128.0/18",
    "94.249.0.0/16",
    "109.107.224.0/19"
];

var JO_V6_PREFIXES = [
    "2a00:18d8::/29",
    "2a03:6b00::/29",
    "2a03:b640::/32"
];

var PORTS = {
    LOBBY:          [443, 8443],
    MATCH:          [20001, 20002, 20003, 20004, 20005],
    RECRUIT_SEARCH: [10010, 10011, 10012, 10013],
    UPDATES:        [80, 443, 8443],
    CDN:            [80, 443]
};

var DOMAINS = {
    LOBBY: [
        "lobby.igamecj.com", "lite-ios.igamecj.com", "mgl.lobby.igamecj.com", "mtw.lobby.igamecj.com", "mkn.lobby.igamecj.com"
    ],
    MATCH: [
        "match.igamecj.com", "mvn.lobby.igamecj.com", "mkr.lobby.igamecj.com"
    ],
    RECRUIT_SEARCH: [
        "recruit-search.igamecj.com", "search.igamecj.com"
    ],
    UPDATES: [
        "updates.pubg.com", "update.igamecj.com", "filegcp.igamecj.com"
    ],
    CDN: [
        "cdn.pubg.com", "cdn.igamecj.com", "gcpcdntest.igamecj.com", "appdl.pubg.com"
    ]
};

var KNOWN_PUBG_DOMAINS = [
    ".pubgmobile.com", ".pubg.com", ".tencent.com", ".tencentgames.net", ".ueapk.com", "igamecj.com"
];

var dnsCache = {};

function nowSeconds() {
    return Math.floor(new Date().getTime() / 1000);
}

function cachePut(host, ip) {
    dnsCache[host] = { ip: ip, ts: nowSeconds() };
}

function cacheGet(host) {
    var e = dnsCache[host];
    if (!e) return null;
    if (nowSeconds() - e.ts > DNS_CACHE_TTL) {
        delete dnsCache[host];
        return null;
    }
    return e.ip;
}

function safeDnsResolve(host, attempts) {
    var cached = cacheGet(host);
    if (cached) return cached;
    attempts = attempts || 2;
    for (var i = 0; i < attempts; i++) {
        try {
            var ip = dnsResolve(host);
            if (ip) {
                cachePut(host, ip);
                return ip;
            }
        } catch (e) {}
    }
    return null;
}

function ipv4ToInt(ip) {
    var parts = ip.split('.');
    if (parts.length !== 4) return null;
    return ((parseInt(parts[0],10) & 0xff) << 24) |
           ((parseInt(parts[1],10) & 0xff) << 16) |
           ((parseInt(parts[2],10) & 0xff) << 8) |
           (parseInt(parts[3],10) & 0xff);
}

function isIpv4InCidr(ip, cidr) {
    var p = cidr.split('/');
    var base = ipv4ToInt(p[0]);
    var mask = parseInt(p[1], 10);
    var ipn = ipv4ToInt(ip);
    if (base === null || ipn === null) return false;
    if (mask === 32) return ipn === base;
    var netmask = mask === 0 ? 0 : (~((1 << (32 - mask)) - 1)) >>> 0;
    return ((ipn & netmask) >>> 0) === ((base & netmask) >>> 0);
}

function normalizeV6(v6) {
    if (v6.indexOf("::") === -1) {
        return v6.toLowerCase();
    }
    var parts = v6.split("::");
    var left = parts[0] ? parts[0].split(":") : [];
    var right = parts[1] ? parts[1].split(":") : [];
    var fill = [];
    var missing = 8 - (left.length + right.length);
    for (var i = 0; i < missing; i++) fill.push("0");
    return left.concat(fill).concat(right).map(function(h){ return h || "0"; }).join(":").toLowerCase();
}

function isIpv6InPrefix(ip, prefix) {
    try {
        var parts = prefix.split('/');
        var base = normalizeV6(parts[0]);
        var mask = parseInt(parts[1],10);
        var ipNorm = normalizeV6(ip);
        var baseH = base.split(':');
        var ipH = ipNorm.split(':');
        if (baseH.length !== 8 || ipH.length !== 8) return false;
        var bitsToCheck = mask;
        for (var i = 0; i < 8 && bitsToCheck > 0; i++) {
            var bBase = parseInt(baseH[i],16);
            var bIp   = parseInt(ipH[i],16);
            var bits = Math.min(16, bitsToCheck);
            var mask16 = bits === 16 ? 0xFFFF : (~((1 << (16-bits)) - 1)) & 0xFFFF;
            if ((bBase & mask16) !== (bIp & mask16)) return false;
            bitsToCheck -= bits;
        }
        return true;
    } catch (e) {
        return false;
    }
}

function hostContainsAny(host, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (host.indexOf(arr[i]) !== -1) return true;
    }
    return false;
}

var stickyMap = {};
function pickProxyForKey(key) {
    if (JO_PROXIES.length === 0) return "PROXY 127.0.0.1:8080"; // fallback واضح لو نسيت تملأ القائمة
    if (stickyMap.hasOwnProperty(key)) return JO_PROXIES[stickyMap[key]];
    var h = 0;
    for (var i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    var idx = h % JO_PROXIES.length;
    stickyMap[key] = idx;
    return JO_PROXIES[idx];
}

function FindProxyForURL(url, host) {
    // لا نعيد DIRECT أبداً — كل شيء يمر عبر البروكسي الأردني المختار
    // port extraction
    var port = 80;
    var m = url.match(/:(\d+)(\/|$)/);
    if (m) port = parseInt(m[1], 10);

    // حل DNS (كاش)
    var resolved = safeDnsResolve(host, 2);

    // لو لم يُحلّ الاسم — نرسل عبر بروكسي بناءً على host:port
    if (!resolved) {
        return pickProxyForKey(host + ":" + port);
    }

    // افحص إذا الآي‌بي أردني
    var inJordan = false;
    if (resolved.indexOf(":") === -1) {
        for (var i = 0; i < JO_IP_RANGES.length; i++) {
            if (isIpv4InCidr(resolved, JO_IP_RANGES[i])) {
                inJordan = true;
                break;
            }
        }
    } else {
        for (var j = 0; j < JO_V6_PREFIXES.length; j++) {
            if (isIpv6InPrefix(resolved, JO_V6_PREFIXES[j])) {
                inJordan = true;
                break;
            }
        }
    }

    // إجبار دومينات ببجي/تينسنت على البروكسي مهما كان
    if (hostContainsAny(host, KNOWN_PUBG_DOMAINS)) {
        return pickProxyForKey(host + ":" + port);
    }

    // لو الآي‌بي أردني — نوجّه للبروكسي الأردني (حسب الـ port/function أو sticky)
    if (inJordan) {
        for (var func in PORTS) {
            if (PORTS.hasOwnProperty(func)) {
                var portList = PORTS[func];
                for (var p = 0; p < portList.length; p++) {
                    if (portList[p] === port) {
                        var domainList = DOMAINS[func] || [];
                        for (var d = 0; d < domainList.length; d++) {
                            if (host.indexOf(domainList[d]) !== -1) {
                                return pickProxyForKey(host + ":" + port);
                            }
                        }
                    }
                }
            }
        }
        // ضمن الأردن لكن لم تطابق قاعدة دقيقة -> نوجّه للبروكسي الأردني
        return pickProxyForKey(host + ":" + port);
    }

    // لا أردني، ولا ببجي — ما زلنا نُجبر المرور عبر البروكسي الأردني (بسبب طلب "زيل direct")
    return pickProxyForKey(host + ":" + port);
}
