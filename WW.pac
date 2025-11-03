// PAC: Jordan-friendly PUBG (stateful-ish)
// - Forces Lobby via PROXY
// - Tracks lastLobbyTime (approx) to allow switching behavior for in-match
// - Two modes: "AGGRESSIVE" blocks non-JO matches; "BALANCED" prefers JO but can fall back
// NOTE: PAC cannot perform external HTTP checks. Verify proxy egress IP separately (instructions below).

function FindProxyForURL(url, host) {
    // ================= CONFIG =================
    var MODE = "AGGRESSIVE";                // "AGGRESSIVE" or "BALANCED"
    var PROXY = "SOCKS5 91.106.107.12:1080";// your Jordanian proxy endpoint
    var BLACKHOLE = "PROXY 0.0.0.0:0";      // used in AGGRESSIVE mode to block non-JO
    var LOBBY_KEEP_MS = 1000 * 60 * 3;      // how long after a lobby request we consider "recent" (3 minutes)
    var PROXY_IS_JO = false;                // set to true AFTER you verify the proxy egress IP is JO (see instructions)
    // ================= end CONFIG =================

    // =============== Globals (persist in PAC runtime) ===============
    // lastLobbyTime stores timestamp (ms) of last observed request to port 80/443.
    // PAC runtime keeps global vars across calls while proxy is active.
    if (typeof FindProxyForURL.lastLobbyTime === "undefined") {
        FindProxyForURL.lastLobbyTime = 0;
    }

    // ================= helpers =================
    function nowMs() { return (new Date()).getTime(); }
    function parsePort(u) {
        var m = u.match(/^[a-zA-Z0-9+\-.]+:\/\/(?:\[[^\]]+\]|[^\/:]+)(?::(\d+))?/);
        if (m && m[1]) return parseInt(m[1], 10);
        return (u.substring(0,5).toLowerCase() === "https") ? 443 : 80;
    }
    function stripBrackets(h) {
        if (!h) return h;
        return (h.charAt(0) === '[' && h.charAt(h.length - 1) === ']') ? h.substring(1, h.length - 1) : h;
    }
    function isIPv4(h) { return /^\d{1,3}(\.\d{1,3}){3}$/.test(h||""); }

    // Quick JO IPv4 textual prefixes (single unified list)
    var JO_PREFIXES = [
        "81\\.28\\.", "46\\.60\\.", "46\\.185\\.", "185\\.108\\.",
        "37\\.236\\.", "37\\.237\\.", "46\\.23\\.", "109\\.110\\.",
        "176\\.29\\.", "87\\.236\\.", "87\\.237\\.", "94\\.142\\.", "109\\.224\\.",
        "217\\.25\\.", "212\\.118\\.", "212\\.35\\.", "213\\.186\\.", "213\\.187\\.",
        "91\\.106\\.", "94\\.249\\.", "109\\.107\\."
    ];
    var JO_PREFIX_RE = new RegExp("^(?:" + JO_PREFIXES.join("|") + ")", "i");

    // Optional: a small CIDR list for improved accuracy (add more later)
    var JO_CIDRS = [
        "91.106.96.0/19",
        "94.249.0.0/17",
        "109.107.224.0/19"
    ];
    function ipToLong(ip) {
        var p = ip.split('.');
        return ((parseInt(p[0],10)<<24)>>>0) + ((parseInt(p[1],10)<<16)>>>0) + ((parseInt(p[2],10)<<8)>>>0) + (parseInt(p[3],10)>>>0);
    }
    function cidrMatch(ip,cidr) {
        var parts = cidr.split('/');
        var base = ipToLong(parts[0]);
        var maskBits = parseInt(parts[1],10);
        var mask = maskBits===0?0:(~0 << (32-maskBits))>>>0;
        return (ipToLong(ip) & mask) === (base & mask);
    }
    function isJordanIPv4(ip) {
        if (!isIPv4(ip)) return false;
        if (JO_PREFIX_RE.test(ip)) return true;
        for (var i=0;i<JO_CIDRS.length;i++) if (cidrMatch(ip, JO_CIDRS[i])) return true;
        return false;
    }

    // ================= Main logic =================
    var port = parsePort(url);
    var h = stripBrackets(host);

    // --- Record lobby hits: any HTTP/HTTPS request we force through proxy counts as "lobby activity" ---
    if (port === 80 || port === 443) {
        // mark last lobby time (approximate signal that the game attempted to authenticate / load lobby)
        FindProxyForURL.lastLobbyTime = nowMs();
        // always present the PROXY as lobby exit (ensures fingerprint is JO when PROXY_IS_JO=true)
        return PROXY;
    }

    // --- Special quick ports used by PUBG services ---
    if (port === 10012 || port === 17500) {
        if (isIPv4(h) && isJordanIPv4(h)) return PROXY;
        // if PROXY verified as JO, we may prefer sending via PROXY to present JO fingerprint;
        // but in AGGRESSIVE mode block non-JO destinations entirely.
        if (MODE === "AGGRESSIVE") return BLACKHOLE;
        return PROXY_IS_JO ? PROXY : "DIRECT";
    }

    // --- Matchmaking / Recruit ---
    if (port >= 10010 && port <= 12235) {
        if (isIPv4(h) && isJordanIPv4(h)) return PROXY;
        // target not JO
        if (MODE === "AGGRESSIVE") {
            return BLACKHOLE;
        } else { // BALANCED
            // If we recently saw a lobby (within LOBBY_KEEP_MS), prefer PROXY to keep JO fingerprint
            if (FindProxyForURL.lastLobbyTime && (nowMs() - FindProxyForURL.lastLobbyTime) <= LOBBY_KEEP_MS) {
                return PROXY_IS_JO ? PROXY : "DIRECT";
            }
            // otherwise fallback DIRECT to speed up search
            return "DIRECT";
        }
    }

    // --- In-match gameplay (classic) ---
    if (port >= 20001 && port <= 20005) {
        if (isIPv4(h) && isJordanIPv4(h)) return PROXY;
        if (MODE === "AGGRESSIVE") return BLACKHOLE;
        // BALANCED: allow DIRECT for in-match to reduce ping unless recent lobby and proxy verified
        if (FindProxyForURL.lastLobbyTime && (nowMs() - FindProxyForURL.lastLobbyTime) <= LOBBY_KEEP_MS) {
            return PROXY_IS_JO ? PROXY : "DIRECT";
        }
        return "DIRECT";
    }

    // --- Any other JO destination: keep via PROXY to be consistent ---
    if (isIPv4(h) && isJordanIPv4(h)) return PROXY;

    // --- Default: DIRECT ---
    return "DIRECT";
}

// ============ End of PAC ============

// ============ Verification instructions (do these outside PAC) ============
// 1) From your proxy server, run:
//      curl -4 https://ipinfo.io/json
//    Check that "country" is "JO" and "org" belongs to Zain/Orange/Umniah/JT.
// 2) If it is JO, edit the PAC CONFIG above and set:
//      PROXY_IS_JO = true;
// 3) Deploy PAC as system proxy on your phone/PC BEFORE launching PUBG so the first HTTPS (login) goes through PROXY.
// 4) Clear PUBG app cache (or restart device) to force fresh login fingerprint.
// 5) Monitor: if matches still non-JO, add missing JO CIDRs to JO_CIDRS (from your ISP lists) and keep PROXY_IS_JO=true.
