// PAC صارم لببجي – أردن فقط (iOS optimized)
var dnsCache = {};  // كاش داخلي لتسريع dnsResolve

function FindProxyForURL(url, host) {
    // بروكسي أردني ثابت
    var PROXY_LOBBY = "PROXY 91.106.109.12:443";
    var PROXY_MATCH = "PROXY 91.106.109.12:20001";
    var PROXY_BLOCK = "PROXY 0.0.0.0:0";  // حظر أي اتصال آخر

    var hostIP = host;
    var isIPv6 = false;

    // منع IPv4 مباشرة
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        return PROXY_BLOCK;
    }

    // إذا كان IPv6 مباشر
    if (host.indexOf(':') !== -1) {
        if (host.charAt(0) === '[' && host.charAt(host.length-1) === ']') {
            hostIP = host.substring(1, host.length-1);
        }
        isIPv6 = true;
    } else {
        // إذا دومين → نعمل dnsResolve مع كاش
        if (dnsCache[host] !== undefined) {
            hostIP = dnsCache[host];
        } else {
            hostIP = dnsResolve(host);
            dnsCache[host] = hostIP ? hostIP : "0";
        }
        if (!hostIP || hostIP === "0") return PROXY_BLOCK;
        if (hostIP.indexOf(':') !== -1) isIPv6 = true;
        else return PROXY_BLOCK; // IPv4 → بلوك
    }

    // التحقق من النطاق الأردني
    if (isIPv6) {
        var addr = hostIP;
        var parts = addr.split(':');
        if (addr.indexOf('::') !== -1) {
            var emptyIndex = parts.indexOf('');
            parts.splice(emptyIndex, 1);
            var missing = 8 - parts.length;
            var zeros = [];
            for (var i = 0; i < missing; i++) zeros.push('0');
            parts = parts.slice(0, emptyIndex).concat(zeros).concat(parts.slice(emptyIndex));
        }

        if (parts.length >= 2) {
            var firstSeg = parseInt(parts[0], 16);
            var secondSeg = parseInt(parts[1], 16);

            // ✅ نطاق اللوبي (زين الأردن)
            if (firstSeg === 0x2A03 && secondSeg >= 0x6800 && secondSeg <= 0x6FFF) {
                return PROXY_LOBBY;
            }

            // ✅ نطاق الماتش (أمنية الأردن)
            if (firstSeg === 0x2A03 && secondSeg === 0xB640) {
                return PROXY_MATCH;
            }
        }
    }

    // كل ما عدا ذلك → بلوك صارم
    return PROXY_BLOCK;
}
