function FindProxyForURL(url, host) {
    var PROXY_HOST =
    "91.106.109.12";

    var STICKY_SALT =
    "JO_STICKY";

    var JITTER_WINDOW =
    3;

    var JO_IP_SUBNETS =
    [
      ["86.108.0.0","255.255.128.0"],
      ["37.202.67.0","255.255.255.0"],
      ["37.220.112.0","255.255.240.0"],
      ["91.106.104.0","255.255.248.0"],
      ["92.241.32.0","255.255.224.0"],
      ["95.172.192.0","255.255.224.0"],
      ["46.185.128.0","255.255.128.0"],
      ["79.173.192.0","255.255.192.0"]
    ];

    var LOBBY_PORTS =
    [443,8080,8443];

    var LOBBY_WEIGHTS =
    [4,3,2];

    var GAME_PORTS =
    [20001,20003,20002];

    var GAME_WEIGHTS =
    [5,3,2];

    var UPDATE_PORTS =
    [8443,443,8080,80];

    var UPDATE_WEIGHTS =
    [5,3,2,1];

    var RECRUIT_PORTS =
    [10010,10012,10013,10039,10096,10491,10612,11000,11455,12235,13748,13894];

    var RECRUIT_WEIGHTS =
    [4,3,3,2,2,2,2,2,2,2,1,1];

    var SEARCH_PORTS =
    [443,8443,8080];

    var SEARCH_WEIGHTS =
    [3,2,1];

    var FALLBACK_PORTS =
    [8085,1080,5000];

    var FALLBACK_WEIGHTS =
    [3,2,1];

    var GAME_DOMAINS =
    [
      "*.gcloud.qq.com",
      "*.igamecj.com",
      "*.proximabeta.com",
      "*.tencentgames.com",
      "*.tpns.tencent.com",
      "*.qcloudcdn.com"
    ];

    var LOBBY_DOMAINS =
    [
      "*.pubgmobile.com",
      "*.pubgmobile.net",
      "*.tencent.com",
      "*.cdn.pubgmobile.com",
      "*.image.pubgmobile.com",
      "*.account.qq.com"
    ];

    var UPDATE_DOMAINS =
    [
      "*.cdndownload.tencent.com",
      "*.download.epicgames.com",
      "*.dlied1.qq.com",
      "*.dlied2.qq.com",
      "*.patch.qq.com",
      "*.update.pubgmobile.com"
    ];

    var RECRUIT_DOMAINS =
    [
      "*.match.pubgmobile.com",
      "*.recruit.pubgmobile.com",
      "*.friend.pubgmobile.com",
      "*.social.proximabeta.com"
    ];

    var SEARCH_DOMAINS =
    [
      "*.search.pubgmobile.com",
      "*.discovery.pubgmobile.com",
      "*.explore.pubgmobile.com"
    ];

    function h32(s){
        var h=2166136261;
        for(var i=0;i<s.length;i++){
            h^=s.charCodeAt(i);
            h=(h>>>0)*16777619>>>0;
        }
        return h>>>0;
    }

    function weightedPick(ports, weights, key){
        var base=h32(key+STICKY_SALT);
        var jitter=(base%JITTER_WINDOW);
        var total=0;
        for(var i=0;i<weights.length;i++) total+=weights[i];
        var r=(base+jitter)%total;
        for(var j=0;j<ports.length;j++){
            if(r<weights[j]) return ports[j];
            r-=weights[j];
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
            var n=JO_IP_SUBNETS[i];
            if (isInNet(ip, n[0], n[1])) return true;
        }
        return false;
    }

    function PROXY_STR(port){
        return "PROXY "+PROXY_HOST+":"+port;
    }

    if (isPlainHostName(host))
        return "DIRECT";

    if (matchAny(host, GAME_DOMAINS)){
        var p = weightedPick(GAME_PORTS, GAME_WEIGHTS, host);
        return PROXY_STR(p);
    }

    if (matchAny(host, LOBBY_DOMAINS)){
        var p = weightedPick(LOBBY_PORTS, LOBBY_WEIGHTS, host);
        return PROXY_STR(p);
    }

    if (matchAny(host, UPDATE_DOMAINS)){
        var p = weightedPick(UPDATE_PORTS, UPDATE_WEIGHTS, host);
        return PROXY_STR(p);
    }

    if (matchAny(host, RECRUIT_DOMAINS)){
        var p = weightedPick(RECRUIT_PORTS, RECRUIT_WEIGHTS, host);
        return PROXY_STR(p);
    }

    if (matchAny(host, SEARCH_DOMAINS)){
        var p = weightedPick(SEARCH_PORTS, SEARCH_WEIGHTS, host);
        return PROXY_STR(p);
    }

    var ip=null;
    try{ ip=dnsResolve(host); }catch(e){ ip=null; }

    if (ipInJordan(ip))
        return "DIRECT";

    var p = weightedPick(LOBBY_PORTS, LOBBY_WEIGHTS, host);
    return PROXY_STR(p);
}
