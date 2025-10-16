function FindProxyForURL(url, host) {
    var IP = "91.106.109.12";
    var JITTER_WINDOW = 3;
    var STICKY_SALT = "JO_STICKY";

    var GAME_DOMAINS = [
        "*.proximabeta.com",
        "*.igamecj.com",
        "*.tencentgames.com",
        "*.tencent.com",
        "*.pubgmobile.com",
        "*.pubgmobile.net",
        "*.gcloud.qq.com",
        "*.cdn.pubgmobile.com"
    ];

    var GAME_PORTS = [
        20001,
        20002,
        20000,
        17500,
        17000
    ];

    var LOBBY_PORTS = [
        8085, 8086, 8087, 8088, 8089, 8090,
        10010, 10012, 10013, 10039, 10096,
        10491, 10612, 11000, 11455, 12235,
        13748, 13894, 13972, 14000, 8011, 9030
    ];

    // JO ranges: merged, deduplicated, reinforced list
    var JO_RANGES_INPUT = [
        ["37.17.192.0","255.255.240.0"],
        ["46.185.128.0","255.255.128.0"],
        ["109.107.224.0","255.255.224.0"],
        ["176.29.0.0","255.255.0.0"],
        ["212.35.0.0","255.255.0.0"],

        ["5.45.128.0","255.255.240.0"],
        ["46.23.112.0","255.255.240.0"],
        ["46.248.192.0","255.255.224.0"],
        ["92.241.32.0","255.255.224.0"],
        ["95.172.192.0","255.255.224.0"],
        ["178.238.176.0","255.255.240.0"],

        ["37.220.112.0","255.255.240.0"],
        ["91.106.96.0","255.255.240.0"],
        ["91.186.224.0","255.255.224.0"],
        ["212.118.0.0","255.255.224.0"],

        ["212.34.0.0","255.255.224.0"],
        ["213.139.32.0","255.255.224.0"],
        ["212.34.128.0","255.255.252.0"],

        ["46.32.96.0","255.255.224.0"],
        ["77.245.0.0","255.255.240.0"],
        ["80.90.160.0","255.255.240.0"],
        ["94.142.32.0","255.255.224.0"],
        ["188.247.64.0","255.255.224.0"],
        ["176.28.128.0","255.255.128.0"],

        ["37.202.64.0","255.255.192.0"],
        ["79.173.192.0","255.255.192.0"],
        ["86.108.0.0","255.255.128.0"],
        ["92.253.0.0","255.255.128.0"],
        ["94.249.0.0","255.255.128.0"],
        ["149.200.128.0","255.255.128.0"],
        ["194.165.128.0","255.255.224.0"],
        ["213.186.160.0","255.255.224.0"],
        ["217.23.32.0","255.255.240.0"],

        ["62.72.160.0","255.255.224.0"],
        ["81.21.0.0","255.255.240.0"],
        ["109.237.192.0","255.255.240.0"],

        ["82.212.64.0","255.255.192.0"],
        ["188.123.160.0","255.255.224.0"]
    ];

    // Deduplicate JO ranges (string-keyed)
    var JO_map = {};
    var JO_RANGES = [];
    for (var i = 0; i < JO_RANGES_INPUT.length; i++) {
        var key = JO_RANGES_INPUT[i][0] + "/" + JO_RANGES_INPUT[i][1];
        if (!JO_map[key]) {
            JO_map[key] = true;
            JO_RANGES.push([JO_RANGES_INPUT[i][0], JO_RANGES_INPUT[i][1]]);
        }
    }

    function isGameHost(h) {
        for (var i = 0; i < GAME_DOMAINS.length; i++) {
            if (shExpMatch(h, GAME_DOMAINS[i])) return true;
        }
        return false;
    }

    function isInJoRanges(h) {
        // Check host directly (if host is an IP string) and resolved IP
        try {
            for (var i = 0; i < JO_RANGES.length; i++) {
                if (isInNet(h, JO_RANGES[i][0], JO_RANGES[i][1])) return true;
            }
        } catch (e) {}
        try {
            var resolved = dnsResolve(h);
            if (resolved) {
                for (var j = 0; j < JO_RANGES.length; j++) {
                    if (isInNet(resolved, JO_RANGES[j][0], JO_RANGES[j][1])) return true;
                }
            }
        } catch (e) {}
        return false;
    }

    function djb2(s) {
        var h = 5381;
        for (var i = 0; i < s.length; i++) {
            h = ((h << 5) + h) + s.charCodeAt(i);
            h = h & 0x7fffffff;
        }
        return h;
    }

    // Build ports order:
    // - If host is a game domain => favor game ports first
    // - If resolved IP is inside JO_RANGES => "reinforce" by weighting game ports (duplicate them)
    var portsBase;
    if (isGameHost(host)) {
        portsBase = GAME_PORTS.concat(LOBBY_PORTS);
    } else {
        portsBase = LOBBY_PORTS.concat(GAME_PORTS);
    }

    var inJO = isInJoRanges(host);

    // Reinforce: if inside JO range, increase weight of GAME_PORTS (repeat them)
    var ports = [];
    if (inJO) {
        // repeat GAME_PORTS 3x at the front to strongly prefer them
        for (var r = 0; r < 3; r++) {
            for (var g = 0; g < GAME_PORTS.length; g++) ports.push(GAME_PORTS[g]);
        }
        // then add the base ports but avoid immediate duplicates
        for (var b = 0; b < portsBase.length; b++) {
            if (ports.indexOf(portsBase[b]) === -1) ports.push(portsBase[b]);
        }
    } else {
        // normal: keep the planned order but ensure no duplicate entries
        for (var b2 = 0; b2 < portsBase.length; b2++) {
            if (ports.indexOf(portsBase[b2]) === -1) ports.push(portsBase[b2]);
        }
    }

    // sticky + jitter selection
    var clientIP = myIpAddress();
    var baseHash = djb2(host + "|" + clientIP + "|" + STICKY_SALT);
    var stickyIndex = Math.abs(baseHash) % ports.length;

    var minuteBucket = Math.floor(new Date().getTime() / 60000);
    var jitterSpan = (JITTER_WINDOW * 2) + 1;
    var jitter = (djb2(host + "|" + minuteBucket) % jitterSpan) - JITTER_WINDOW;

    var startIndex = (stickyIndex + jitter) % ports.length;
    if (startIndex < 0) startIndex += ports.length;

    var ordered = [];
    for (var k = 0; k < ports.length; k++) {
        var idx = (startIndex + k) % ports.length;
        ordered.push("PROXY " + IP + ":" + ports[idx]);
    }

    return ordered.join(";");
}
