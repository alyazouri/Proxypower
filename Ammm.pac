function FindProxyForURL(url, host) {
    // ---------------- CONFIG ----------------
    var PROXY_HOST = "91.106.109.12";

    var ROUTE_JORDAN_VIA_PROXY   = true;   // الوجهات الأردنية تمر عبر البروكسي الأردني
    var FORCE_PROXY_IF_CLIENT_JO = true;   // إن كان العميل أردنيًا و الوجهة غير أردنية -> نفضل البروكسي (لن نصل لها لأننا نحجب غير الأردني)
    var FALLBACK_TO_DIRECT       = false;  // لا نضيف DIRECT في سلاسل البروكسي

    var BLOCK_NON_JO = true;               // حجب كامل لغير الأردنيين (يرجع PROXY 0.0.0.0:0)

    var GEO_CACHE_TTL_MS    = 90000;       // كاش نتيجة client GeoCheck
    var GEO_CACHE_JITTER_MS = 1500;
    var DNS_CACHE_TTL_MS    = 30000;       // كاش dnsResolve

    var PORTS = {
        http:   8080,
        https:  8443,
        quic:   443,
        socks:  1080,
        socks5: 1080,
        socks5h:1080
    };

    var STICKY_SALT   = "JO_STICKY";
    var JITTER_WINDOW = 2;

    // ---------------- EXCLUSIONS (DIRECT) ----------------
    var EXCLUDE_DIRECT_DOMAINS = [
      // YouTube
      "*.youtube.com",
      "youtu.be",
      "*.ytimg.com",
      "youtubei.googleapis.com",
      "*.googlevideo.com",
      "*.gvt1.com",
      "*.gvt2.com",
      // Shahid (MBC)
      "*.shahid.net",
      "*.shahid.mbc.net",
      "*.mbc.net",
      "edge-api.shahid.net",
      "api2.shahid.net",
      "*.shahid-*.akamaized.net"
    ];

    // ---------------- JO RANGES (network, netmask) ----------------
    var JO_IP_SUBNETS = [
      ["100.64.0.0",   "255.192.0.0"],   // CGNAT Jordan (/10)
      ["212.34.96.0",  "255.255.224.0"], // Orange (/19)
      ["213.139.32.0", "255.255.224.0"], // Orange (/19)
      ["86.108.64.0",  "255.255.192.0"], // Orange (/18)
      ["185.140.0.0",  "255.255.0.0"],   // Zain   (/16)
      ["46.185.192.0", "255.255.192.0"], // Zain   (/18)
      ["79.173.192.0", "255.255.192.0"], // Zain   (/18)
      ["46.23.112.0",  "255.255.240.0"], // Umniah (/20)
      ["92.241.32.0",  "255.255.224.0"], // Umniah/Batelco (/19)
      ["91.106.104.0", "255.255.248.0"], // Umniah (/21)
      ["109.107.240.0","255.255.240.0"], // Mada   (/20)
      ["185.96.70.0",  "255.255.255.0"]  // Local  (/24)
    ];

    // ---------------- PUBG Domains & Ports ----------------
    var GAME_DOMAINS = [
      "*.gcloud.qq.com","*.igamecj.com","*.proximabeta.com",
      "*.tencentgames.com","*.tpns.tencent.com","*.qcloudcdn.com"
    ];
    var LOBBY_DOMAINS = [
      "*.pubgmobile.com","*.pubgmobile.net","*.tencent.com",
      "*.cdn.pubgmobile.com","*.image.pubgmobile.com","*.account.qq.com"
    ];
    var UPDATE_DOMAINS = [
      "*.cdndownload.tencent.com","*.dlied1.qq.com","*.dlied2.qq.com",
      "*.patch.qq.com","*.update.pubgmobile.com"
    ];
    var RECRUIT_DOMAINS = [
      "*.match.pubgmobile.com","*.recruit.pubgmobile.com",
      "*.friend.pubgmobile.com","*.social.proximabeta.com"
    ];
    var SEARCH_DOMAINS = [
      "*.search.pubgmobile.com","*.discovery.pubgmobile.com","*.explore.pubgmobile.com"
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

    // ---------------- Helpers ----------------
    function nowMs(){ try { return (new Date()).getTime(); } catch(e){ return 0; } }
    function h32(s){ var h=2166136261>>>0; for (var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=(h*16777619)>>>0;} return h>>>0; }

    function weightedPick(ports,weights,key){
        var base=h32(key+"_"+STICKY_SALT), jitter=(JITTER_WINDOW>0)?(base%JITTER_WINDOW):0, total=0;
        for (var i=0;i<weights.length;i++) total+=weights[i];
        var r=(base+jitter)%total;
        for (var j=0;j<ports.length;j++){ if (r<weights[j]) return ports[j]; r-=weights[j]; }
        return ports[0];
    }
    function matchAny(h, arr){ for (var i=0;i<arr.length;i++){ if (shExpMatch(h, arr[i])) return true; } return false; }

    function ipInJordan(ip){
        if(!ip) return false;
        for (var i=0;i<JO_IP_SUBNETS.length;i++){ var n=JO_IP_SUBNETS[i]; if (isInNet(ip,n[0],n[1])) return true; }
        return false;
    }

    // DNS cache
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

    // GeoCheck + sticky cache
    if (typeof __JO_CLIENT_GEO_TS__ === "undefined"){ __JO_CLIENT_GEO_TS__=0; __JO_CLIENT_GEO_VAL__=false; }
    function clientIpJordanRaw(){ try{ var cip=myIpAddress(); return ipInJordan(cip);}catch(e){ return false; } }
    function clientIpJordanCached(){
        var t=nowMs(), dt=t-__JO_CLIENT_GEO_TS__, jitter=Math.abs(h32(String(t)))%(GEO_CACHE_JITTER_MS+1);
        if (dt>=0 && dt<(GEO_CACHE_TTL_MS+jitter)) return __JO_CLIENT_GEO_VAL__;
        var val=clientIpJordanRaw(); __JO_CLIENT_GEO_VAL__=val; __JO_CLIENT_GEO_TS__=t; return val;
    }

    function buildProxyChain(primaryType, port, fallbacks){
        var list=[ primaryType+" "+PROXY_HOST+":"+port ];
        for (var i=0;i<(fallbacks||[]).length;i++){ list.push(fallbacks[i].type+" "+PROXY_HOST+":"+fallbacks[i].port); }
        if (FALLBACK_TO_DIRECT) list.push("DIRECT");
        return list.join("; ");
    }
    function proxyForSchemeAndPort(scheme, port){
        if (scheme==="http")  return buildProxyChain("PROXY", port, [{type:"SOCKS5", port:PORTS.socks},{type:"SOCKS", port:PORTS.socks}]);
        if (scheme==="https") return buildProxyChain("HTTPS", port, [{type:"PROXY", port:PORTS.quic},{type:"SOCKS5", port:PORTS.socks}]);
        return buildProxyChain("SOCKS5", PORTS.socks, [{type:"PROXY", port:PORTS.http}]);
    }

    // ---------------- MAIN ----------------
    // 0) YouTube/Shahid exclusions
    if (matchAny(host, EXCLUDE_DIRECT_DOMAINS)) return "DIRECT";

    // 1) plain hostname
    if (isPlainHostName(host)) {
        if (!clientIpJordanCached()) return "DIRECT";
        return proxyForSchemeAndPort("https", PORTS.https);
    }

    // 2) scheme
    var scheme="other";
    try{ var u=url.toLowerCase(); if (u.indexOf("http:")===0) scheme="http"; else if (u.indexOf("https:")===0) scheme="https"; }catch(e){}

    // 3) يجب أن يكون العميل أردنيًا
    if (!clientIpJordanCached()) return "DIRECT";

    // 4) قواعد PUBG
    if (matchAny(host, GAME_DOMAINS)){
        var gp = weightedPick(GAME_PORTS, GAME_WEIGHTS, host);
        return buildProxyChain("SOCKS5", PORTS.socks, [{type:"PROXY", port:gp},{type:"SOCKS", port:PORTS.socks}]);
    }
    if (matchAny(host, LOBBY_DOMAINS)){
        var lp=weightedPick(LOBBY_PORTS, LOBBY_WEIGHTS, host);
        return proxyForSchemeAndPort(scheme, lp);
    }
    if (matchAny(host, UPDATE_DOMAINS)){
        var up=weightedPick(UPDATE_PORTS, UPDATE_WEIGHTS, host);
        return proxyForSchemeAndPort(scheme, up);
    }
    if (matchAny(host, RECRUIT_DOMAINS)){
        var rp=weightedPick(RECRUIT_PORTS, RECRUIT_WEIGHTS, host);
        return buildProxyChain("PROXY", rp, [{type:"SOCKS5", port:PORTS.socks}]);
    }
    if (matchAny(host, SEARCH_DOMAINS)){
        var sp=weightedPick(SEARCH_PORTS, SEARCH_WEIGHTS, host);
        return proxyForSchemeAndPort(scheme, sp);
    }

    // 5) فحص الوجهة
    var destIp = dnsResolveCached(host);

    // 6) الوجهة داخل الأردن؟
    if (ipInJordan(destIp)) {
        if (ROUTE_JORDAN_VIA_PROXY) {
            var p=(scheme==="https")?PORTS.https:PORTS.http;
            return proxyForSchemeAndPort(scheme, p); // يحافظ على مسار أردني واضح
        } else {
            return "DIRECT";
        }
    }

    // 7) الوجهة خارج الأردن -> نحجبها إن كان BLOCK_NON_JO = true
    if (BLOCK_NON_JO) {
        // حجب صريح: بروكسي وهمي
        return "PROXY 0.0.0.0:0";
    }

    // 8) افتراضي لعميل أردني
    if (FORCE_PROXY_IF_CLIENT_JO) {
        var def=(scheme==="https")?PORTS.https:PORTS.http;
        return proxyForSchemeAndPort(scheme, def);
    }

    return "DIRECT";
}
