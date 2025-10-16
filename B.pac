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

    var JO_RANGES = [
        ["37.17.192.0","255.255.240.0"],   // /20
        ["46.185.128.0","255.255.128.0"],  // /17
        ["109.107.224.0","255.255.224.0"], // /19
        ["176.29.0.0","255.255.0.0"],      // /16
        ["212.35.0.0","255.255.0.0"],      // /16
    ["109.107.224.0","255.255.255.0"],
    ["109.107.225.0","255.255.255.0"],
    ["109.107.226.0","255.255.255.0"],
    ["109.107.227.0","255.255.255.0"],
    ["109.107.228.0","255.255.255.0"],
    ["109.107.229.0","255.255.255.0"],
    ["109.107.230.0","255.255.255.0"],
    ["109.107.231.0","255.255.255.0"],
    ["109.107.232.0","255.255.255.0"],
    ["109.107.233.0","255.255.255.0"],
    ["109.107.234.0","255.255.255.0"],
    ["109.107.235.0","255.255.255.0"],
    ["109.107.236.0","255.255.255.0"],
    ["109.107.237.0","255.255.255.0"],
    ["109.107.238.0","255.255.255.0"],
    ["109.107.239.0","255.255.255.0"],
    ["109.237.192.0","255.255.255.0"],
    ["109.237.193.0","255.255.255.0"],
    ["109.237.194.0","255.255.255.0"],
    ["109.237.195.0","255.255.255.0"],
    ["109.237.196.0","255.255.255.0"],
    ["109.237.197.0","255.255.255.0"],
    ["109.237.198.0","255.255.255.0"],
    ["109.237.199.0","255.255.255.0"],
    ["109.237.200.0","255.255.255.0"],
    ["109.237.201.0","255.255.255.0"],
    ["109.237.202.0","255.255.255.0"],
    ["109.237.203.0","255.255.255.0"],
    ["109.237.204.0","255.255.255.0"],
    ["109.237.205.0","255.255.255.0"],
    ["109.237.206.0","255.255.255.0"],
    ["109.237.207.0","255.255.255.0"]
    ];

    function isGameHost(h) {
        for (var i = 0; i < GAME_DOMAINS.length; i++) {
            if (shExpMatch(h, GAME_DOMAINS[i])) return true;
        }
        return false;
    }

    function isInJoRanges(h) {
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

    var ports;
    if (isGameHost(host)) {
        ports = GAME_PORTS.concat(LOBBY_PORTS);
    } else if (isInJoRanges(host)) {
        ports = GAME_PORTS.concat(LOBBY_PORTS); // Jordan CIDR => favor game ports first
    } else {
        ports = LOBBY_PORTS.concat(GAME_PORTS);
    }

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
