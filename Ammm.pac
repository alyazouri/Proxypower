function FindProxyForURL(url, host) {
    var PROXY_HOST = "91.106.109.12";

    var ROUTE_MAX_MS = 21;
    var DNS_CACHE_TTL_MS = 30000;

    var PORTS = {
        https: 8443,
        http:  8080,
        socks: 1080
    };

    var STICKY_SALT   = "JO_STICKY";
    var JITTER_WINDOW = 3;

    var JO_NETS = [
      ["213.139.32.0","255.255.224.0"],
      ["212.34.96.0","255.255.224.0"],
      ["86.108.64.0","255.255.192.0"],
      ["46.185.192.0","255.255.192.0"],
      ["79.173.192.0","255.255.192.0"],
      ["185.140.0.0","255.255.0.0"],
      ["46.23.112.0","255.255.240.0"],
      ["92.241.32.0","255.255.224.0"],
      ["91.106.104.0","255.255.248.0"],
      ["109.107.240.0","255.255.240.0"],
      ["185.96.70.0","255.255.255.0"]
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

    function h32(s){
        var h=2166136261>>>0;
        for (var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=(h*16777619)>>>0; }
        return h>>>0;
    }

    function weightedPick(ports,weights,key){
        var base=h32(key+"_"+STICKY_SALT);
        var jitter=(JITTER_WINDOW>0)?(base%JITTER_WINDOW):0;
        var total=0;
        for (var i=0;i<weights.length;i++) total+=weights[i];
        var r=(base+jitter)%total;
        for (var j=0;j<ports.length;j++){
            if (r<weights[j]) return ports[j];
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
        for (var i=0;i<JO_NETS.length;i++){
            var n = JO_NETS[i];
            try { if (isInNet(ip, n[0], n[1])) return true; } catch(e){}
        }
        return false;
    }

    if (typeof __DNS_TIMED__ === "undefined") __DNS_TIMED__ = {};
    function dnsResolveTimed(h){
        try{
            var c=__DNS_TIMED__[h];
            var t=nowMs();
            if (c && (t-c.ts)<DNS_CACHE_TTL_MS) return {ip:c.ip, dt:c.dt};
            var t0=t;
            var ip=dnsResolve(h);
            var dt=Math.max(1, nowMs()-t0);
            __DNS_TIMED__[h]={ip:ip, dt:dt, ts:nowMs()};
            return {ip:ip, dt:dt};
        }catch(e){
            return {ip:null, dt:9999};
        }
    }

    if (typeof __PROXY_IP__ === "undefined") __PROXY_IP__=null;
    function proxyStatus(){
        try{
            if (__PROXY_IP__){
                // إعادة اختبار زمني خفيف حتى لا يشيخ القياس
                var t0=nowMs(); var _=__PROXY_IP__; var dt=Math.max(1, nowMs()-t0);
                return {ip:__, dt:dt, inJo:ipInJordan(__)};
            }
            var r=dnsResolveTimed(PROXY_HOST);
            __PROXY_IP__=r.ip;
            return {ip:r.ip, dt:r.dt, inJo:ipInJordan(r.ip)};
        }catch(e){
            return {ip:null, dt:9999, inJo:false};
        }
    }

    function chainPrimary(){
        return "HTTPS "+PROXY_HOST+":"+PORTS.https+
               "; PROXY "+PROXY_HOST+":"+PORTS.http+
               "; SOCKS5 "+PROXY_HOST+":"+PORTS.socks;
    }

    function chainGame(host){
        var gp = weightedPick(GAME_PORTS, GAME_WEIGHTS, host);
        return "SOCKS5 "+PROXY_HOST+":"+PORTS.socks+
               "; PROXY "+PROXY_HOST+":"+gp+
               "; PROXY "+PROXY_HOST+":"+PORTS.http;
    }

    // ===== شروط صارمة قبل أي اتصال =====
    var ps = proxyStatus();
    if (!ps.ip || !ps.inJo)                      return "PROXY 0.0.0.0:0";
    if (ps.dt > ROUTE_MAX_MS)                    return "PROXY 0.0.0.0:0";

    var rDest = dnsResolveTimed(host);
    if (!rDest.ip)                               return "PROXY 0.0.0.0:0";
    if (!ipInJordan(rDest.ip))                   return "PROXY 0.0.0.0:0";
    if (rDest.dt > ROUTE_MAX_MS)                 return "PROXY 0.0.0.0:0";

    // ===== بعد تحقق الشروط: كل المرور عبر بروكسي أردني فقط =====
    var isPUBG =
        matchAny(host, GAME_DOMAINS)   ||
        matchAny(host, LOBBY_DOMAINS)  ||
        matchAny(host, UPDATE_DOMAINS) ||
        matchAny(host, RECRUIT_DOMAINS)||
        matchAny(host, SEARCH_DOMAINS);

    if (isPUBG) {
        if (matchAny(host, GAME_DOMAINS)) return chainGame(host);
        return chainPrimary();
    }

    return chainPrimary();
}
