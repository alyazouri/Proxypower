function FindProxyForURL(url, host) {
    var IP = "91.106.109.12";
    var JITTER_WINDOW = 2;
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
        ["2.17.24.0","255.255.252.0"],
        ["37.17.192.0","255.255.240.0"],
        ["37.123.64.0","255.255.224.0"],
        ["37.220.112.0","255.255.240.0"],
        ["46.32.96.0","255.255.224.0"],
        ["46.185.128.0","255.255.128.0"],
        ["46.248.192.0","255.255.224.0"],
        ["79.173.192.0","255.255.192.0"],
        ["82.212.64.0","255.255.192.0"],
        ["84.18.32.0","255.255.224.0"],
        ["84.18.64.0","255.255.224.0"],
        ["86.108.0.0","255.255.128.0"],
        ["91.106.96.0","255.255.224.0"],
        ["91.186.224.0","255.255.224.0"],
        ["92.241.32.0","255.255.224.0"],
        ["94.249.0.0","255.255.128.0"],
        ["95.172.192.0","255.255.224.0"],
        ["109.107.0.0","255.255.0.0"],
        ["109.237.192.0","255.255.240.0"],
        ["149.200.128.0","255.255.128.0"],
        ["176.29.0.0","255.255.0.0"],
        ["185.96.70.0","255.255.255.0"],
        ["185.140.0.0","255.255.0.0"],
        ["185.142.226.0","255.255.255.0"],
        ["188.247.64.0","255.255.252.0"],
        ["212.35.0.0","255.255.0.0"],
        ["212.118.0.0","255.255.224.0"]
    ];

    // Weighted Jordan Route Logic (أوزان أعلى = أولوية أقوى + jitter أقل)
    var JO_WEIGHTED = [
        // عمّان الكبرى (أعلى أولوية)
        { cidr: ["212.35.0.0","255.255.0.0"],  weight: 1.6, tag: "Orange-Amman" },
        { cidr: ["37.17.192.0","255.255.240.0"], weight: 1.5, tag: "Zain-Amman" },

        // ألياف + باك-بون قوي
        { cidr: ["176.29.0.0","255.255.0.0"],   weight: 1.35, tag: "Zain-Fiber" },
        { cidr: ["46.32.96.0","255.255.224.0"], weight: 1.3,  tag: "Orange-Home-DSL" },
        { cidr: ["46.248.192.0","255.255.224.0"], weight: 1.25, tag: "Umniah-FTTH" },
        { cidr: ["37.220.112.0","255.255.240.0"], weight: 1.25, tag: "Zain-WBB-Gaming" },
        { cidr: ["37.123.64.0","255.255.224.0"],  weight: 1.2,  tag: "Orange-FTTH" },

        // نطاقات مؤسسات/بوابات
        { cidr: ["94.249.0.0","255.255.128.0"], weight: 1.2,  tag: "Zain-IGW" },
        { cidr: ["91.186.224.0","255.255.224.0"], weight: 1.15, tag: "Mada-Corp" },
        { cidr: ["91.106.96.0","255.255.224.0"],  weight: 1.15, tag: "Batelco-Business" },
        { cidr: ["212.118.0.0","255.255.224.0"],  weight: 1.15, tag: "Batelco-Jordan" },

        // سكني/موبايل واسعة الانتشار
        { cidr: ["46.185.128.0","255.255.128.0"], weight: 1.1,  tag: "Umniah-4G-LTE" },
        { cidr: ["79.173.192.0","255.255.192.0"], weight: 1.05, tag: "Zain-IPv4-High" },
        { cidr: ["82.212.64.0","255.255.192.0"],  weight: 1.05, tag: "Umniah-Business" },
        { cidr: ["84.18.32.0","255.255.224.0"],   weight: 1.05, tag: "Orange-IPv4-Legacy" },
        { cidr: ["84.18.64.0","255.255.224.0"],   weight: 1.05, tag: "Orange-Secondary" },
        { cidr: ["86.108.0.0","255.255.128.0"],   weight: 1.05, tag: "Zain-Backbone" },

        // استضافة/نطاقات خاصة
        { cidr: ["185.96.70.0","255.255.255.0"],  weight: 1.1,  tag: "Zain-Gov-DC" },
        { cidr: ["185.142.226.0","255.255.255.0"],weight: 1.1,  tag: "Orange-Hosting" },
        { cidr: ["188.247.64.0","255.255.252.0"], weight: 1.1,  tag: "Umniah-FTTH-New" },
        { cidr: ["95.172.192.0","255.255.224.0"], weight: 1.05, tag: "Batelco-Hosting" },

        // Akamai داخل الأردن
        { cidr: ["2.17.24.0","255.255.252.0"],    weight: 1.05, tag: "Orange-Akamai" },

        // تجميعة واسعة (تبقى أقل وزنًا افتراضيًا)
        { cidr: ["109.107.0.0","255.255.0.0"],    weight: 1.0,  tag: "Umniah/Batelco-Wide" },
        { cidr: ["149.200.128.0","255.255.128.0"],weight: 1.0,  tag: "Orange-Business-Segment" },
        { cidr: ["185.140.0.0","255.255.0.0"],    weight: 1.0,  tag: "Zain-Main" }
    ];

    function isInCIDRList(target, list) {
        try {
            for (var i = 0; i < list.length; i++) {
                if (isInNet(target, list[i][0], list[i][1])) return true;
            }
        } catch (e) {}
        try {
            var resolved = dnsResolve(target);
            if (resolved) {
                for (var j = 0; j < list.length; j++) {
                    if (isInNet(resolved, list[j][0], list[j][1])) return true;
                }
            }
        } catch (e2) {}
        return false;
    }

    function matchWeight(target) {
        var best = 0.0;
        try {
            for (var i = 0; i < JO_WEIGHTED.length; i++) {
                var c = JO_WEIGHTED[i];
                if (isInNet(target, c.cidr[0], c.cidr[1])) {
                    if (c.weight > best) best = c.weight;
                }
            }
        } catch (e) {}
        try {
            var resolved = dnsResolve(target);
            if (resolved) {
                for (var j = 0; j < JO_WEIGHTED.length; j++) {
                    var d = JO_WEIGHTED[j];
                    if (isInNet(resolved, d.cidr[0], d.cidr[1])) {
                        if (d.weight > best) best = d.weight;
                    }
                }
            }
        } catch (e2) {}
        return best; // 0 = خارج الأردن
    }

    function djb2(s) {
        var h = 5381;
        for (var i = 0; i < s.length; i++) {
            h = ((h << 5) + h) + s.charCodeAt(i);
            h = h & 0x7fffffff;
        }
        return h;
    }

    function dedupPorts(arr) {
        var out = [], seen = {};
        for (var i = 0; i < arr.length; i++) {
            var p = arr[i];
            if (!seen[p]) { out.push(p); seen[p] = 1; }
        }
        return out;
    }

    function weightedPorts(baseGamePorts, lobbyPorts, weight) {
        if (weight <= 0) return lobbyPorts.concat(baseGamePorts);
        var primary = [20001, 20002, 20000];
        var repeats = 1 + Math.min(3, Math.floor((weight - 1) * 3));
        var bag = [];
        for (var r = 0; r < repeats; r++) bag = bag.concat(primary);
        bag = bag.concat(baseGamePorts).concat(lobbyPorts);
        return dedupPorts(bag);
    }

    var weight = matchWeight(host);
    var LOCAL_JITTER = JITTER_WINDOW;
    var ports;

    if (isInCIDRList(host, JO_RANGES) || weight > 0) {
        ports = weightedPorts(GAME_PORTS, LOBBY_PORTS, weight || 1.0);
        var jitterScale = (weight > 0) ? (1 / Math.max(1, Math.round(weight))) : 1;
        LOCAL_JITTER = Math.max(1, Math.floor(JITTER_WINDOW * jitterScale));
    } else if (function (h) {
        for (var i = 0; i < GAME_DOMAINS.length; i++) {
            if (shExpMatch(h, GAME_DOMAINS[i])) return true;
        }
        return false;
    }(host)) {
        ports = GAME_PORTS.concat(LOBBY_PORTS);
    } else {
        ports = LOBBY_PORTS.concat(GAME_PORTS);
    }

    var clientIP = myIpAddress();
    var baseHash = djb2(host + "|" + clientIP + "|" + STICKY_SALT);
    var stickyIndex = Math.abs(baseHash) % ports.length;

    var minuteBucket = Math.floor(new Date().getTime() / 60000);
    var jitterSpan = (LOCAL_JITTER * 2) + 1;
    var jitter = (djb2(host + "|" + minuteBucket) % jitterSpan) - LOCAL_JITTER;

    var startIndex = (stickyIndex + jitter) % ports.length;
    if (startIndex < 0) startIndex += ports.length;

    var ordered = [];
    for (var k = 0; k < ports.length; k++) {
        var idx = (startIndex + k) % ports.length;
        ordered.push("PROXY " + IP + ":" + ports[idx]);
    }

    return ordered.join(";");
}
