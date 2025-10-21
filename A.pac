function FindProxyForURL(url, host) {
    var IP            = "91.106.109.12";
    var STICKY_SALT   = "JO_STICKY";
    var JITTER_WINDOW = 2; // يُستخدم للوبي فقط

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

    var GAME_PORTS = [20001, 20003];
    var LOBBY_PORTS_PRI = [443, 8443, 8085];
    var LOBBY_PORTS_ALT = [
        8086, 8087, 8088, 8089, 8090,
        10010, 10012, 10013, 10039, 10096,
        10491, 10612, 11000, 11455, 12235,
        13748, 13894, 13972, 14000, 8011, 9030
    ];

    var JO_RANGES_INPUT = [
["5.45.128.0","5.45.143.255"],
  ["37.202.64.0","37.202.127.255"],
  ["37.220.112.0","37.220.127.255"],
  ["46.23.112.0","46.23.127.255"],
  ["46.32.96.0","46.32.127.255"],
  ["46.185.128.0","46.185.255.255"],
  ["46.248.192.0","46.248.223.255"],
  ["62.72.160.0","62.72.191.255"],
  ["77.245.0.0","77.245.15.255"],
  ["79.173.192.0","79.173.255.255"],
  ["80.90.160.0","80.90.175.255"],
  ["81.21.0.0","81.21.15.255"],
  ["82.212.64.0","82.212.127.255"],
  ["86.108.0.0","86.108.127.255"],
  ["91.106.96.0","91.106.111.255"],
  ["91.186.224.0","91.186.255.255"],
  ["92.241.32.0","92.241.63.255"],
  ["92.253.0.0","92.253.127.255"],
  ["94.142.32.0","94.142.63.255"],
  ["94.249.0.0","94.249.255.255"],
  ["95.172.192.0","95.172.223.255"],
  ["109.107.224.0","109.107.255.255"],
  ["109.237.192.0","109.237.207.255"],
  ["149.200.128.0","149.200.255.255"],
  ["176.28.128.0","176.28.255.255"],
  ["176.29.0.0","176.29.255.255"],
  ["178.238.176.0","178.238.191.255"],
  ["188.123.160.0","188.123.191.255"],
  ["188.247.64.0","188.247.95.255"],
  ["194.165.128.0","194.165.159.255"],
  ["212.34.0.0","212.34.31.255"],
  ["212.34.128.0","212.34.131.255"],
  ["212.118.0.0","212.118.31.255"],
  ["213.139.32.0","213.139.63.255"],
  ["213.186.160.0","213.186.191.255"],
  ["217.23.32.0","217.23.47.255"],
    ];

    var JO_map = {};
    var JO_RANGES = [];
    for (var i = 0; i < JO_RANGES_INPUT.length; i++) {
        var key = JO_RANGES_INPUT[i][0] + "/" + JO_RANGES_INPUT[i][1];
        if (!JO_map[key]) { JO_map[key] = true; JO_RANGES.push(JO_RANGES_INPUT[i]); }
    }

    function isGameHost(h) {
        for (var i = 0; i < GAME_DOMAINS.length; i++) { if (shExpMatch(h, GAME_DOMAINS[i])) return true; }
        return false;
    }

    function hostInJO(h) {
        try { for (var i = 0; i < JO_RANGES.length; i++) { if (isInNet(h, JO_RANGES[i][0], JO_RANGES[i][1])) return true; } } catch(e){}
        try {
            var ip = dnsResolve(h);
            if (ip) for (var j = 0; j < JO_RANGES.length; j++) { if (isInNet(ip, JO_RANGES[j][0], JO_RANGES[j][1])) return true; }
        } catch(e){}
        return false;
    }

    function djb2(s) {
        var h = 5381;
        for (var i = 0; i < s.length; i++) { h = ((h<<5)+h) + s.charCodeAt(i); h = h & 0x7fffffff; }
        return h;
    }

    var inGame   = isGameHost(host);
    var inJO     = hostInJO(host);
    var clientIP = myIpAddress();

    var ports = [];

    if (inGame) {
        if (inJO) {
            // تثبيت صارم لبورتات اللعب داخل الأردن
            ports = [20001, 20003, 20002, 20000, 17500, 17000, 443, 8443, 8085];
        } else {
            // أولوية لعب ثم منافذ TLS للوبي كاحتياط
            ports = [20001, 20003, 20002, 443, 8443, 20000, 17500, 17000, 8085];
        }
    } else {
        // لوبي/محتوى: TLS أولاً ثم البدائل ثم بورتات اللعب في الأخير
        ports = LOBBY_PORTS_PRI.concat(LOBBY_PORTS_ALT);
        for (var g=0; g<GAME_PORTS.length; g++) { if (ports.indexOf(GAME_PORTS[g]) === -1) ports.push(GAME_PORTS[g]); }
        // تعزيز إذا الهوست ضمن الأردن (يُقدّم TLS القصير)
        if (inJO) {
            var pref = [443, 8443, 8085];
            var rest = [];
            for (var p=0; p<ports.length; p++) { if (pref.indexOf(ports[p]) === -1) rest.push(ports[p]); }
            ports = pref.concat(rest);
        }
    }

    // اختيار ثابت: إزالة clientIP من الهاش لاتساق المنافذ لجميع اللاعبين في JO
    var baseHash = djb2(host + "|" + STICKY_SALT); // إزالة clientIP
    var jitter   = 0;
    if (!inGame && !inJO) { // تطبيق jitter فقط للوبي خارج الأردن
        var minuteBucket = Math.floor(new Date().getTime() / 60000);
        var span = (JITTER_WINDOW*2) + 1;
        jitter = (djb2(host + "|" + minuteBucket) % span) - JITTER_WINDOW;
    }

    var startIndex = Math.abs((baseHash + jitter)) % ports.length;

    var ordered = [];
    for (var k = 0; k < ports.length; k++) {
        var idx = (startIndex + k) % ports.length;
        ordered.push("PROXY " + IP + ":" + ports[idx]);
    }

    return ordered.join(";");
}
