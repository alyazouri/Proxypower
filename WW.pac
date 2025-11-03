// PAC: Jordan-Aggressive PUBG matchmaking + lobby enforcement
// Paste into your PAC host. Aggressive: blocks non-JO matchmaking/game if not JO.
// Edit the top section (POLICIES / PROXIES / JO_V4_CIDRS / JO_V6_MAP) to taste.

function FindProxyForURL(url, host) {
    // ===================== POLICIES =====================
    var ENFORCE_JO_MATCHMAKING = true;   // Force matchmaking to use JO proxy
    var HARD_BLOCK_NON_JO_MATCH = true;  // If true -> blackhole non-JO matchmaking
    var HARD_BLOCK_NON_JO_GAME  = true;  // If true -> blackhole in-match non-JO
    var FORCE_JO_LOBBY         = true;   // Force lobby (80/443) via JO proxy
    var BLACKHOLE = "PROXY 0.0.0.0:0";

    // ===================== PROXIES ( edit to your real endpoints ) =====================
    // These should be real SOCKS5 endpoints you control and that egress through JO ISPs
    var DEFAULT_PROXY_GAME  = "SOCKS5 [2001:9700:1000::1]:1080"; // for 20001-20005
    var DEFAULT_PROXY_SPEC  = "SOCKS5 [2001:9700:1000::2]:1080"; // for 10012
    var DEFAULT_PROXY_PING  = "SOCKS5 [2001:9700:1000::3]:1080"; // for 17500
    var DEFAULT_PROXY_LOBBY = "SOCKS5 [2001:9700:1000::4]:1080"; // for 80/443
    var DEFAULT_PROXY_MATCH = "SOCKS5 [2001:9700:1000::5]:1080"; // for 10010-12235

    // Optional: customize per-ISP proxies (leave same or change to per-ISP endpoints)
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

    // ===================== HELPERS =====================
    function parsePort(u) {
        var m = u.match(/^[a-zA-Z0-9+\-.]+:\/\/(?:\[[^\]]+\]|[^\/:]+)(?::(\d+))?/);
        if (m && m[1]) return parseInt(m[1], 10);
        return (u.substring(0,5).toLowerCase() === "https") ? 443 : 80;
    }
    function stripBrackets(h) {
        if (!h) return h;
        if (h.charAt(0) === '[' && h.charAt(h.length - 1) === ']') return h.substring(1, h.length - 1);
        return h;
    }
    function isIPv6(h) { return h && h.indexOf(':') !== -1; }
    function isIPv4(h) { return h && /^\d{1,3}(\.\d{1,3}){3}$/.test(h); }

    // ===================== JO IPv6 prefix -> ISP map (from your list) =====================
    // Keep prefixes with trailing ":" to avoid accidental partial matches
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
    function getISPforV6(ipv6) {
        if (!ipv6) return "Unknown";
        var h = ipv6.toLowerCase();
        for (var i=0;i<JO_V6_MAP.length;i++) {
            if (h.indexOf(JO_V6_MAP[i].prefix) === 0) return JO_V6_MAP[i].isp;
        }
        return "Unknown";
    }
    function v6IsJordan(ipv6) { return getISPforV6(ipv6) !== "Unknown"; }

    // ===================== JO IPv4 CIDRs (add more for better accuracy) =====================
    var JO_V4_CIDRS = [
        "91.106.96.0/19",
        "94.249.0.0/17",
        "109.107.224.0/19"
        // add your full lists per-ISP here
    ];
    function ipToLong(ip) {
        var p = ip.split('.');
        return ((parseInt(p[0],10)<<24)>>>0) + ((parseInt(p[1],10)<<16)>>>0) + ((parseInt(p[2],10)<<8)>>>0) + (parseInt(p[3],10)>>>0);
    }
    function cidrMatch(ip, cidr) {
        var parts = cidr.split('/');
        var base = ipToLong(parts[0]);
        var maskBits = parseInt(parts[1],10);
        var mask = maskBits===0 ? 0 : (~0 << (32-maskBits))>>>0;
        return (ipToLong(ip) & mask) === (base & mask);
    }
    function v4IsJordan(ip) {
        if (!ip) return false;
        for (var i=0;i<JO_V4_CIDRS.length;i++) {
            if (cidrMatch(ip, JO_V4_CIDRS[i])) return true;
        }
        return false;
    }

    // ===================== pick proxy helpers =====================
    function pickMatchProxy(isp) { return PROXY_MATCH_BY_ISP[isp] || PROXY_MATCH_BY_ISP["Unknown"]; }
    function pickLobbyProxy(isp) { return PROXY_LOBBY_BY_ISP[isp] || PROXY_LOBBY_BY_ISP["Unknown"]; }
    function pickGameProxy(isp)  { return PROXY_GAME_BY_ISP[isp]  || PROXY_GAME_BY_ISP["Unknown"]; }

    // ===================== MAIN LOGIC =====================
    var port = parsePort(url);
    var h = stripBrackets(host);

    // quick special ports
    if (port === 10012) return DEFAULT_PROXY_SPEC;
    if (port === 17500) return DEFAULT_PROXY_PING;

    // Lobby / auth / CDN - force JO if asked
    if (port === 80 || port === 443) {
        if (FORCE_JO_LOBBY) {
            if (isIPv6(h) && v6IsJordan(h)) return pickLobbyProxy(getISPforV6(h));
            if (isIPv4(h) && v4IsJordan(h)) return pickLobbyProxy("Unknown");
            // fallback: still force JO exit to ensure GEO fingerprint
            return DEFAULT_PROXY_LOBBY;
        } else {
            // lighter behavior: prefer JO if already JO, else direct
            if (isIPv6(h) && v6IsJordan(h)) return pickLobbyProxy(getISPforV6(h));
            if (isIPv4(h) && v4IsJordan(h)) return pickLobbyProxy("Unknown");
            return "DIRECT";
        }
    }

    // Matchmaking / Recruit (aggressive handling)
    if (port >= 10010 && port <= 12235) {
        // if target is known JO IP -> use per-ISP match proxy
        if (isIPv6(h) && v6IsJordan(h)) return pickMatchProxy(getISPforV6(h));
        if (isIPv4(h) && v4IsJordan(h)) return pickMatchProxy("Unknown");

        // target not JO
        if (ENFORCE_JO_MATCHMAKING) {
            if (HARD_BLOCK_NON_JO_MATCH) {
                // block non-JO matchmaking (aggressive)
                return BLACKHOLE;
            } else {
                // force JO exit anyway to present JO fingerprint
                return DEFAULT_PROXY_MATCH;
            }
        }
        // default
        return DEFAULT_PROXY_MATCH;
    }

    // In-match gameplay ports
    if (port >= 20001 && port <= 20005) {
        if (isIPv6(h) && v6IsJordan(h)) return pickGameProxy(getISPforV6(h));
        if (isIPv4(h) && v4IsJordan(h)) return pickGameProxy("Unknown");
        if (HARD_BLOCK_NON_JO_GAME) return BLACKHOLE;
        return DEFAULT_PROXY_GAME;
    }

    // Any other destination that is JO -> keep it using JO exit to remain consistent
    if (isIPv6(h) && v6IsJordan(h)) return DEFAULT_PROXY_MATCH;
    if (isIPv4(h) && v4IsJordan(h)) return DEFAULT_PROXY_MATCH;

    // Otherwise: normal traffic goes DIRECT (reduces load / jitter)
    return "DIRECT";
}
