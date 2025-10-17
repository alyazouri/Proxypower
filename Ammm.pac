function FindProxyForURL(url, host) {
    var PROXY_HOST = "91.106.109.12";

    // proxy ports (يمكنك تعديل الأرقام حسب إعداد البروكسي الفعلي)
    var PORTS = {
        http: 8080,
        https: 8443,
        quic: 443,        // استخدم هذا إذا كان البروكسي يدعم HTTP/3 (QUIC)
        socks: 1080,
        socks5: 1080,
        socks5h: 1080     // مَعْلَمية: نفس المنفذ لكن نرجّع نوعاً مختلفاً؛ سلوك socks5h يعتمد على العميل
    };

    var STICKY_SALT = "JO_STICKY";
    var JITTER_WINDOW = 3;

    var JO_IP_SUBNETS = [
      ["92.241.32.0","92.241.224.0"],
      ["95.172.192.0","95.172.224.0"],
      ["109.107.224.0","109.107.255.0"]  // /19
    ];

    var LOBBY_PORTS = [PORTS.https, PORTS.http, 8443];
    var LOBBY_WEIGHTS = [4,3,2];

    var GAME_PORTS = [20001,20003,20002];
    var GAME_WEIGHTS = [5,3,2];

    var UPDATE_PORTS = [PORTS.https, PORTS.http, 80];
    var UPDATE_WEIGHTS = [5,3,1];

    var RECRUIT_PORTS = [10010,10012,10013,10039,10096,10491,10612,11000,11455,12235,13748,13894];
    var RECRUIT_WEIGHTS = [4,3,3,2,2,2,2,2,2,2,1,1];

    var SEARCH_PORTS = [PORTS.https, PORTS.https, PORTS.http];
    var SEARCH_WEIGHTS = [3,2,1];

    var FALLBACK_PORTS = [8085, PORTS.socks, 5000];
    var FALLBACK_WEIGHTS = [3,2,1];

    var GAME_DOMAINS = [
      "*.gcloud.qq.com",
      "*.igamecj.com",
      "*.proximabeta.com",
      "*.tencentgames.com",
      "*.tpns.tencent.com",
      "*.qcloudcdn.com"
    ];

    var LOBBY_DOMAINS = [
      "*.pubgmobile.com",
      "*.pubgmobile.net",
      "*.tencent.com",
      "*.cdn.pubgmobile.com",
      "*.image.pubgmobile.com",
      "*.account.qq.com"
    ];

    var UPDATE_DOMAINS = [
      "*.cdndownload.tencent.com",
      "*.dlied1.qq.com",
      "*.dlied2.qq.com",
      "*.patch.qq.com",
      "*.update.pubgmobile.com"
    ];

    var RECRUIT_DOMAINS = [
      "*.match.pubgmobile.com",
      "*.recruit.pubgmobile.com",
      "*.friend.pubgmobile.com",
      "*.social.proximabeta.com"
    ];

    var SEARCH_DOMAINS = [
      "*.search.pubgmobile.com",
      "*.discovery.pubgmobile.com",
      "*.explore.pubgmobile.com"
    ];

    // ---------------- helper functions ----------------
    function h32(s){
        var h = 2166136261 >>> 0;
        for (var i=0;i<s.length;i++){
            h ^= s.charCodeAt(i);
            h = (h * 16777619) >>> 0;
        }
        return h >>> 0;
    }

    function weightedPick(ports, weights, key){
        var base = h32(key + STICKY_SALT);
        var jitter = base % JITTER_WINDOW;
        var total = 0;
        for (var i=0;i<weights.length;i++) total += weights[i];
        var r = (base + jitter) % total;
        for (var j=0;j<ports.length;j++){
            if (r < weights[j]) return ports[j];
            r -= weights[j];
        }
        return ports[0];
    }

    function matchAny(h, arr){
        for (var i=0;i<arr.length;i++){
            if (shExpMatch(h, arr[i])) return true;
        }
        return false;
    }

    function ipInJordan(ip){
        if(!ip) return false;
        for (var i=0;i<JO_IP_SUBNETS.length;i++){
            var n = JO_IP_SUBNETS[i];
            if (isInNet(ip, n[0], n[1])) return true;
        }
        return false;
    }

    function buildProxyChain(primaryType, port, fallbackTypes){
        // primaryType: "PROXY" | "HTTPS" | "SOCKS" | "SOCKS5" | "SOCKS5H"
        // fallbackTypes: array of {type, port}
        var list = [];
        if (primaryType === "HTTPS" || primaryType === "PROXY") {
            list.push(primaryType + " " + PROXY_HOST + ":" + port);
        } else {
            // SOCKS / SOCKS5 / SOCKS5H
            list.push(primaryType + " " + PROXY_HOST + ":" + port);
        }
        for (var i=0;i<fallbackTypes.length;i++){
            list.push(fallbackTypes[i].type + " " + PROXY_HOST + ":" + fallbackTypes[i].port);
        }
        list.push("DIRECT");
        return list.join("; ");
    }

    function proxyForSchemeAndPort(scheme, port){
        // scheme: "http"|"https"|"other"
        // choose best primary proxy type for that scheme, and sensible fallbacks
        if (scheme === "http") {
            // Prefer HTTP proxy then SOCKS5 then DIRECT
            return buildProxyChain("PROXY", port, [{type:"SOCKS5", port: PORTS.socks}, {type:"SOCKS", port: PORTS.socks}]);
        }
        if (scheme === "https") {
            // Prefer HTTPS-capable proxy (some clients accept "HTTPS"), then PROXY on quic(443) for http3-capable proxies, then socks5
            return buildProxyChain("HTTPS", port, [{type:"PROXY", port: PORTS.quic}, {type:"SOCKS5", port: PORTS.socks}]);
        }
        // other schemes (ftp/ws/etc) -> socks5 fallback
        return buildProxyChain("SOCKS5", PORTS.socks, [{type:"PROXY", port: PORTS.http}]);
    }

    // ---------------- main logic ----------------
    if (isPlainHostName(host)) return "DIRECT";

    var scheme = "other";
    try {
        var u = url.toLowerCase();
        if (u.indexOf("http:") === 0) scheme = "http";
        else if (u.indexOf("https:") === 0) scheme = "https";
    } catch(e){ scheme = "other"; }

    // forced domain categories
    if (matchAny(host, GAME_DOMAINS)){
        var gp = weightedPick(GAME_PORTS, GAME_WEIGHTS, host);
        // for game UDP ports we prefer SOCKS5 (UDP ASSOC via socks5 if client supports), then PROXY fallback
        return buildProxyChain("SOCKS5", PORTS.socks, [{type:"PROXY", port: gp}, {type:"SOCKS", port: PORTS.socks}]);
    }

    if (matchAny(host, LOBBY_DOMAINS)){
        var lp = weightedPick(LOBBY_PORTS, LOBBY_WEIGHTS, host);
        return proxyForSchemeAndPort(scheme, lp);
    }

    if (matchAny(host, UPDATE_DOMAINS)){
        var up = weightedPick(UPDATE_PORTS, UPDATE_WEIGHTS, host);
        return proxyForSchemeAndPort(scheme, up);
    }

    if (matchAny(host, RECRUIT_DOMAINS)){
        var rp = weightedPick(RECRUIT_PORTS, RECRUIT_WEIGHTS, host);
        return buildProxyChain("PROXY", rp, [{type:"SOCKS5", port: PORTS.socks}]);
    }

    if (matchAny(host, SEARCH_DOMAINS)){
        var sp = weightedPick(SEARCH_PORTS, SEARCH_WEIGHTS, host);
        return proxyForSchemeAndPort(scheme, sp);
    }

    // resolve ip and decide local vs proxy
    var ip = null;
    try { ip = dnsResolve(host); } catch (e) { ip = null; }

    if (ipInJordan(ip)) return "DIRECT";

    // default fallback: prefer HTTPS proxy for secure traffic, otherwise http proxy
    var defaultPort = (scheme === "https") ? PORTS.https : PORTS.http;
    return proxyForSchemeAndPort(scheme, defaultPort);
}
