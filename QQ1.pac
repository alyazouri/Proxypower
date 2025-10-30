function FindProxyForURL(url, host) {
    var jordanRanges = [
        "91.106.0.0/16",
        "196.52.0.0/16",
        "89.187.0.0/16",
        "41.222.0.0/16"
    ];
    var PORTS = [10012, 13004, 14000, 17000, 17500, 18081, 20000, 20001, 20002, 20371,
                 8011, 9030, 10491, 10612, 12235, 13748, 7086, 7995, 10039, 10096,
                 11455, 12070, 12460, 13894, 13972, 41182, 41192];

    function isInNetRange(ip, range, bits) {
        var ipNum = ipToNumber(ip);
        var rangeIpNum = ipToNumber(range);
        var mask = ~(Math.pow(2, 32 - bits) - 1);
        return (ipNum & mask) === (rangeIpNum & mask);
    }
    function ipToNumber(ip) {
        var parts = ip.split('.');
        return (parseInt(parts[0]) << 24) | (parseInt(parts[1]) << 16) |
               (parseInt(parts[2]) << 8) | parseInt(parts[3]);
    }

    var hostIP = dnsResolve(host);
    if (!hostIP) return "PROXY 91.106.109.12:443";

    var port = 80;
    var m = url.match(/:(\d+)(\/|$)/);
    if (m) port = parseInt(m[1]);

    for (var i = 0; i < jordanRanges.length; i++) {
        var r = jordanRanges[i].split('/');
        if (isInNetRange(hostIP, r[0], parseInt(r[1]))) {
            if (PORTS.indexOf(port) !== -1) {
                return "PROXY 91.106.109.12:443";
            }
        }
    }
    // توجيه جميع الطلبات عبر البروكسي لتظهر من الأردن
    return "PROXY 91.106.109.12:443";
}
