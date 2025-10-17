function FindProxyForURL(url, host) {
    var PROXY_HOST = "91.106.109.12";

    var STRICT_JO_MATCH           = false;
    var ENFORCE_PROXY_GEO         = true;
    var ROUTE_JORDAN_VIA_PROXY    = true;
    var FORCE_PROXY_IF_CLIENT_JO  = true;

    var FALLBACK_TO_DIRECT  = false;
    var GEO_CACHE_TTL_MS    = 90000;
    var GEO_CACHE_JITTER_MS = 1500;
    var DNS_CACHE_TTL_MS    = 30000;

    var PORTS = {
        http:   8080,
        https:  8443,
        quic:   443,
        socks:  1080,
        socks5: 1080,
        socks5h:1080
    };

    var STICKY_SALT   = "JO_STICKY";
    var JITTER_WINDOW = 3;

    var EXCLUDE_DIRECT_DOMAINS = [
      "*.youtube.com",
      "youtu.be",
      "*.ytimg.com",
      "youtubei.googleapis.com",
      "*.googlevideo.com",
      "*.gvt1.com",
      "*.gvt2.com",
      "*.shahid.net",
      "*.shahid.mbc.net",
      "*.mbc.net",
      "edge-api.shahid.net",
      "api2.shahid.net",
      "*.shahid-*.akamaized.net"
    ];

    var JO_NETS = [
      { net:"185.140.0.0",  mask:"255.255.0.0",   region:"Jordan" },
      { net:"213.139.32.0", mask:"255.255.224.0", region:"Jordan" },
      { net:"212.34.96.0",  mask:"255.255.224.0", region:"Jordan" },
      { net:"86.108.64.0",  mask:"255.255.192.0", region:"Jordan" },
      { net:"46.185.192.0", mask:"255.255.192.0", region:"Jordan" },
      { net:"79.173.192.0", mask:"255.255.192.0", region:"Jordan" },
      { net:"46.23.112.0",  mask:"255.255.240.0", region:"Jordan" },
      { net:"92.241.32.0",  mask:"255.255.224.0", region:"Jordan" },
      { net:"91.106.104.0", mask:"255.255.248.0", region:"Jordan" },
      { net:"109.107.240.0",mask:"255.255.240.0", region:"Jordan" },
      { net:"185.96.70.0",  mask:"255.255.255.0", region:"Jordan" }
    ];

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

    var LOBBY_PORTS     = [PORTS.https, PORTS.http, 8443];
    var LOBBY_WEIGHTS   = [4,3,2];
    var GAME_PORTS      = [20001,20003,20002];
    var GAME_WEIGHTS    = [5,3,2];
    var UPDATE_PORTS    = [PORTS.https, PORTS.http, 80];
    var UPDATE_WEIGHTS  = [5,3,1];
    var RECRUIT_PORTS   = [10010,10012,10013,10039,10096,10491,10612,11000,11455,12235,13748,13894];
    var RECRUIT_WEIGHTS = [4,3,3,2,2,2,2,2,2,2,1,1];
    var SEARCH_PORTS    = [PORTS.https, PORTS.https, PORTS.http];
    var SEARCH_WEIGHTS  = [3,2,1];

    function nowMs(){ try { return (new Date()).getTime(); } catch(e){ return 0; } }
    function h32(s){ var h=2166136261>>>0; for (var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=(h*16777619)>>>0;} return h>>>0; }

    function weightedPick(ports,weights,key){
        var base=h32(key+"_"+STICKY_SALT), jitter=(JITTER_WINDOW>0)?(base%JITTER_WINDOW):0, total=0;
        for (var i=0;i<weights.length;i++) total+=weights[i];
        var r=(base+jitter)%total;
        for (var j=0;j<ports.length;j++){ if (r<weights[j]) return ports[j]; r-=weights[j]; }
        return ports[0];
    }

    function matchAny(h, arr){
        for (var i=0;i<arr.length;i++){
            if (shExpMatch(h, arr[i])) return true;
        }
        return false;
    }

    function ipRegion(ip){
        if (!ip) return null;
        for (var i=0;i<JO_NETS.length;i++){
            var n = JO_NETS[i];
            if (isInNet(ip, n.net, n.mask)) return n.region;
        }
        return null;
    }

    function ipInJordan(ip){
        return ipRegion(ip) === "Jordan";
    }

    if (typeof __JO_DNS_CACHE__ === "undefined") __JO_DNS_CACHE__ = {};
    function dnsResolveCached(h){
        try{
            var rec=__JO_DNS_CACHE__[h], t=nowMs();
            if (rec && (t-rec.ts)<DNS_CACHE_TTL_MS) return rec.ip;
            var ip=dnsResolve(h);
            __JO_DNS_CACHE__[h]={ip:ip, ts:t};
            return ip;
        }catch(e){ return null; }
    }

    if (typeof __JO_CLIENT_GEO_TS__ === "undefined"){
        __JO_CLIENT_GEO_TS__=0;
        __JO_CLIENT_REGION__=null;
    }
    function clientRegionRaw(){
        try{ var cip=myIpAddress(); return ipRegion(cip);}catch(e){ return null; }
    }
    function clientRegion(){
        var t=nowMs(), dt=t-__JO_CLIENT_GEO_TS__, jitter=Math.abs(h32(String(t)))%(GEO_CACHE_JITTER_MS+1);
        if (dt>=0 && dt<(GEO_CACHE_TTL_MS+jitter)) return __JO_CLIENT_REGION__;
        var val=clientRegionRaw(); __JO_CLIENT_REGION__=val; __JO_CLIENT_GEO_TS__=t; return val;
    }
    function clientIpJordanCached(){
        return clientRegion() === "Jordan";
    }

    function proxyRegion(){
        try { var pip=dnsResolve(PROXY_HOST); return ipRegion(pip); } catch(e){ return null; }
    }
    function proxyIsJordan(){
        return proxyRegion() === "Jordan";
    }

    function buildProxyChain(primaryType, port, fallbacks){
        var list=[ primaryType+" "+PROXY_HOST+":"+port ];
        for (var i=0;i<(fallbacks||[]).length;i++){
            list.push(fallbacks[i].type+" "+PROXY_HOST+":"+fallbacks[i].port);
        }
        if (FALLBACK_TO_DIRECT) list.push("DIRECT");
        return list.join("; ");
    }

    function proxyForSchemeAndPort(scheme, port){
        if (scheme==="http")  return buildProxyChain("PROXY", port, [{type:"SOCKS5", port:PORTS.socks},{type:"SOCKS", port:PORTS.socks}]);
        if (scheme==="https") return buildProxyChain("HTTPS", port, [{type:"PROXY", port:PORTS.quic},{type:"SOCKS5", port:PORTS.socks}]);
        return buildProxyChain("SOCKS5", PORTS.socks, [{type:"PROXY", port:PORTS.http}]);
    }

    if (matchAny(host, EXCLUDE_DIRECT_DOMAINS)) return "DIRECT";

    if (ENFORCE_PROXY_GEO && !proxyIsJordan()) return "PROXY 0.0.0.0:0";

    if (isPlainHostName(host)) {
        if (!clientIpJordanCached()) return "DIRECT";
        return proxyForSchemeAndPort("https", PORTS.https);
    }

    var scheme="other";
    try{
        var u=url.toLowerCase();
        if (u.indexOf("http:")===0) scheme="http";
        else if (u.indexOf("https:")===0) scheme="https";
    }catch(e){}

    if (!clientIpJordanCached()) return "DIRECT";

    var isPUBG =
        matchAny(host, GAME_DOMAINS)   ||
        matchAny(host, LOBBY_DOMAINS)  ||
        matchAny(host, UPDATE_DOMAINS) ||
        matchAny(host, RECRUIT_DOMAINS)||
        matchAny(host, SEARCH_DOMAINS);

    if (isPUBG) {
        if (!STRICT_JO_MATCH) {
            if (matchAny(host, GAME_DOMAINS)) {
                var gp = weightedPick(GAME_PORTS, GAME_WEIGHTS, host);
                return buildProxyChain("SOCKS5", PORTS.socks, [{type:"PROXY", port:gp},{type:"SOCKS", port:PORTS.socks}]);
            }
            var lp = (scheme==="https") ? PORTS.https : PORTS.http;
            return proxyForSchemeAndPort(scheme, lp);
        } else {
            var ipg = dnsResolveCached(host);
            if (!ipInJordan(ipg)) return "PROXY 0.0.0.0:0";
            var lp2 = (scheme==="https") ? PORTS.https : PORTS.http;
            return proxyForSchemeAndPort(scheme, lp2);
        }
    }

    var destIp = dnsResolveCached(host);

    if (ipInJordan(destIp)) {
        if (ROUTE_JORDAN_VIA_PROXY) {
            var p = (scheme==="https") ? PORTS.https : PORTS.http;
            return proxyForSchemeAndPort(scheme, p);
        } else {
            return "DIRECT";
        }
    }

    if (FORCE_PROXY_IF_CLIENT_JO) {
        var def = (scheme==="https") ? PORTS.https : PORTS.http;
        return proxyForSchemeAndPort(scheme, def);
    }

    return "DIRECT";
}
