function FindProxyForURL(url, host) {
    // ======= نمط السياسات =======
    var ENFORCE_JO_MATCHMAKING = true;    // اجبار خروج أردني للماتشميكنج
    var HARD_BLOCK_NON_JO_MATCH = true;   // قفل تام لأي matchmaking/recruit غير أردني
    var HARD_BLOCK_NON_JO_GAME  = true;   // قفل تام لأي in-match غير أردني
    var FORCE_JO_LOBBY          = true;   // اللوبي 80/443 دائماً عبر مخرج أردني
    var BLACKHOLE = "PROXY 0.0.0.0:0";

    // ======= مخارج أردنية (عدّل حسب بنيتك) =======
    var DEFAULT_PROXY_GAME  = "SOCKS5 [2001:9700:1000::1]:1080"; // 20001–20005
    var DEFAULT_PROXY_SPEC  = "SOCKS5 [2001:9700:1000::2]:1080"; // 10012
    var DEFAULT_PROXY_PING  = "SOCKS5 [2001:9700:1000::3]:1080"; // 17500
    var DEFAULT_PROXY_LOBBY = "SOCKS5 [2001:9700:1000::4]:1080"; // 80/443
    var DEFAULT_PROXY_MATCH = "SOCKS5 [2001:9700:1000::5]:1080"; // 10010–12235

    // (اختياري) تخصيص المخرج حسب الـ ISP
    var PROXY_MATCH_BY_ISP = {
        "Zain":                DEFAULT_PROXY_MATCH,
        "Zain Fiber":          DEFAULT_PROXY_MATCH,
        "Zain 5G":             DEFAULT_PROXY_MATCH,
        "Umniah":              DEFAULT_PROXY_MATCH,
        "Umniah 5G":           DEFAULT_PROXY_MATCH,
        "JT":                  DEFAULT_PROXY_MATCH,
        "Orange IPv6-only":    DEFAULT_PROXY_MATCH,
        "Wi-Tribe / Umniah":   DEFAULT_PROXY_MATCH,
        "Unknown":             DEFAULT_PROXY_MATCH
    };
    var PROXY_LOBBY_BY_ISP = {
        "Zain":                DEFAULT_PROXY_LOBBY,
        "Zain Fiber":          DEFAULT_PROXY_LOBBY,
        "Zain 5G":             DEFAULT_PROXY_LOBBY,
        "Umniah":              DEFAULT_PROXY_LOBBY,
        "Umniah 5G":           DEFAULT_PROXY_LOBBY,
        "JT":                  DEFAULT_PROXY_LOBBY,
        "Orange IPv6-only":    DEFAULT_PROXY_LOBBY,
        "Wi-Tribe / Umniah":   DEFAULT_PROXY_LOBBY,
        "Unknown":             DEFAULT_PROXY_LOBBY
    };
    var PROXY_GAME_BY_ISP = {
        "Zain":                DEFAULT_PROXY_GAME,
        "Zain Fiber":          DEFAULT_PROXY_GAME,
        "Zain 5G":             DEFAULT_PROXY_GAME,
        "Umniah":              DEFAULT_PROXY_GAME,
        "Umniah 5G":           DEFAULT_PROXY_GAME,
        "JT":                  DEFAULT_PROXY_GAME,
        "Orange IPv6-only":    DEFAULT_PROXY_GAME,
        "Wi-Tribe / Umniah":   DEFAULT_PROXY_GAME,
        "Unknown":             DEFAULT_PROXY_GAME
    };

    // ======= Helpers =======
    function parsePort(u) {
        var m = u.match(/^[a-zA-Z0-9+\-.]+:\/\/(?:\[[^\]]+\]|[^\/:]+)(?::(\d+))?/);
        if (m && m[1]) return parseInt(m[1], 10);
        return (u.substring(0,5).toLowerCase()==="https") ? 443 : 80;
    }
    function stripBrackets(h) {
        if (!h) return h;
        if (h.charAt(0)==='[' && h.charAt(h.length-1)===']') return h.substring(1, h.length-1);
        return h;
    }
    function isIPv6(h){ return h && h.indexOf(':') !== -1; }
    function isIPv4(h){ return h && /^\d{1,3}(\.\d{1,3}){3}$/.test(h); }

    // ======= IPv6: بوادئ أردنية ← ISP =======
    var JO_V6_MAP = [
        {prefix:"2001:7f8:",      isp:"Zain"},
        {prefix:"2a02:7f8:",      isp:"Zain Fiber"},
        {prefix:"2001:df0:",      isp:"Zain 5G"},
        {prefix:"2001:67c:27c0:", isp:"Umniah"},
        {prefix:"2001:67c:2b40:", isp:"Umniah"},
        {prefix:"2a0e:97c0:",     isp:"Umniah"},
        {prefix:"2a0e:b47:",      isp:"Umniah"},
        {prefix:"2a0b:64c0:",     isp:"Umniah"},
        {prefix:"2a0e:1dc0:",     isp:"Umniah 5G"},
        {prefix:"2a0f:5700:",     isp:"JT"},
        {prefix:"2a10:cc40:",     isp:"Orange IPv6-only"},
        {prefix:"2a12:bec0:",     isp:"Wi-Tribe / Umniah"}
    ];
    function getISPforV6(ipv6){
        var h = ipv6.toLowerCase();
        for (var i=0;i<JO_V6_MAP.length;i++){
            if (h.indexOf(JO_V6_MAP[i].prefix)===0) return JO_V6_MAP[i].isp;
        }
        return "Unknown";
    }
    function v6IsJordan(ipv6){ return getISPforV6(ipv6) !== "Unknown"; }

    // ======= IPv4: رينجات سكنية أردنية (زِد قائمتك) =======
    var JO_V4_CIDRS = [
        "91.106.96.0/19",   // Umniah (يحتوي 91.106.107.150)
        "94.249.0.0/17",    // Orange/Umniah - اشتهر عندك
        "109.107.224.0/19"  // Orange/Umniah/Zain: مثال سكني
        // ضيف باقي /17 /18 /19 اللي عندك لكل مزوّد
    ];
    function ipToLong(ip){
        var p=ip.split('.');
        return ((parseInt(p[0],10)<<24)>>>0)+((parseInt(p[1],10)<<16)>>>0)+((parseInt(p[2],10)<<8)>>>0)+(parseInt(p[3],10)>>>0);
    }
    function cidrMatch(ip,cidr){
        var parts=cidr.split('/');
        var base=ipToLong(parts[0]);
        var maskBits=parseInt(parts[1],10);
        var mask=maskBits===0?0:(~0 << (32-maskBits))>>>0;
        return (ipToLong(ip)&mask)===(base&mask);
    }
    function v4IsJordan(ip){
        for (var i=0;i<JO_V4_CIDRS.length;i++) if (cidrMatch(ip,JO_V4_CIDRS[i])) return true;
        return false;
    }

    // ======= اختيار المخرج =======
    function pickMatchProxy(isp){ return PROXY_MATCH_BY_ISP[isp] || PROXY_MATCH_BY_ISP["Unknown"]; }
    function pickLobbyProxy(isp){ return PROXY_LOBBY_BY_ISP[isp] || PROXY_LOBBY_BY_ISP["Unknown"]; }
    function pickGameProxy(isp){  return PROXY_GAME_BY_ISP[isp]  || PROXY_GAME_BY_ISP["Unknown"]; }

    // ======= المنطق =======
    var port = parsePort(url);
    var h = stripBrackets(host);

    // بورتات خاصة
    if (port === 10012) return DEFAULT_PROXY_SPEC;
    if (port === 17500) return DEFAULT_PROXY_PING;

    // اللوبي/التوثيق (80/443): خلّيه دائمًا أردني لتثبيت البصمة الجغرافية
    if (port === 80 || port === 443) {
        if (FORCE_JO_LOBBY) {
            if (isIPv6(h) && v6IsJordan(h)) return pickLobbyProxy(getISPforV6(h));
            if (isIPv4(h) && v4IsJordan(h)) return pickLobbyProxy("Unknown");
            return DEFAULT_PROXY_LOBBY; // خروج أردني حتى لو الوجهة غير أردنية
        } else {
            // خيار أخف
            if (isIPv6(h) && v6IsJordan(h)) return pickLobbyProxy(getISPforV6(h));
            if (isIPv4(h) && v4IsJordan(h)) return pickLobbyProxy("Unknown");
            return "DIRECT";
        }
    }

    // Matchmaking / Recruit
    if (port >= 10010 && port <= 12235) {
        // لو الهدف أردني → ممتاز، خلّيه أردني
        if (isIPv6(h) && v6IsJordan(h)) return pickMatchProxy(getISPforV6(h));
        if (isIPv4(h) && v4IsJordan(h)) return pickMatchProxy("Unknown");

        // الهدف غير أردني
        if (HARD_BLOCK_NON_JO_MATCH) return BLACKHOLE; // قفل تام
        // أو أخرج أردني رغم أن الوجهة غير أردنية (يبقي البصمة أردنية)
        return DEFAULT_PROXY_MATCH;
    }

    // In-match gameplay
    if (port >= 20001 && port <= 20005) {
        if (isIPv6(h) && v6IsJordan(h)) return pickGameProxy(getISPforV6(h));
        if (isIPv4(h) && v4IsJordan(h)) return pickGameProxy("Unknown");
        if (HARD_BLOCK_NON_JO_GAME) return BLACKHOLE;   // منع دخول روم غير أردني
        return DEFAULT_PROXY_GAME;
    }

    // أي هدف أردني عام → مرّره أردني افتراضي
    if (isIPv6(h) && v6IsJordan(h)) return DEFAULT_PROXY_MATCH;
    if (isIPv4(h) && v4IsJordan(h)) return DEFAULT_PROXY_MATCH;

    // كل ما عدا ذلك → DIRECT لتخفيف الجِتر
    return "DIRECT";
}
