function FindProxyForURL(url, host) {
    // ===== إعدادات =====
    var PROXY     = "SOCKS5 91.106.107.12:1080"; // مخرجك الأردني
    var BLACKHOLE = "PROXY 0.0.0.0:0";           // حظر تام لأي وجهة غير أردنية

    // ===== أدوات مساعدة =====
    function parsePort(u){
        var m=u.match(/^[a-zA-Z0-9+\-.]+:\/\/(?:\[[^\]]+\]|[^\/:]+)(?::(\d+))?/);
        if(m&&m[1]) return parseInt(m[1],10);
        return (u.slice(0,5).toLowerCase()==="https")?443:80;
    }
    function stripBrackets(h){
        if(!h) return h;
        return (h[0]==='[' && h[h.length-1]===']') ? h.slice(1,-1) : h;
    }
    function isIPv4(h){ return /^\d{1,3}(\.\d{1,3}){3}$/.test(h||""); }

    // ===== كل النطاقات الأردنية في مجموعة واحدة =====
    var JO_PREFIXES = [
        // Orange Jordan
        "81\\.28\\.", "46\\.60\\.", "46\\.185\\.", "185\\.108\\.",
        // Zain Jordan
        "37\\.236\\.", "37\\.237\\.", "46\\.23\\.", "109\\.110\\.",
        // Umniah
        "176\\.29\\.", "87\\.236\\.", "87\\.237\\.", "94\\.142\\.", "109\\.224\\.",
        // Jordan Telecom (JT)
        "217\\.25\\.", "212\\.118\\.", "212\\.35\\.", "213\\.186\\.", "213\\.187\\.",
        // Residential / Aggregated Blocks
        "91\\.106\\.", "94\\.249\\.", "109\\.107\\."
    ];
    var JO_REGEX = new RegExp("^(?:" + JO_PREFIXES.join("|") + ")", "i");

    // ===== المنطق =====
    var p = parsePort(url);
    var h = stripBrackets(host);

    if (isIPv4(h)) {
        var isJO = JO_REGEX.test(h);

        // لوبي و توثيق
        if (p === 80 || p === 443)
            return PROXY;

        // البحث عن لاعبين
        if (p >= 10010 && p <= 12235)
            return isJO ? PROXY : BLACKHOLE;

        // داخل المباراة (كلاسيك)
        if (p >= 20001 && p <= 20005)
            return isJO ? PROXY : BLACKHOLE;

        // منافذ خاصة
        if (p === 10012 || p === 17500)
            return isJO ? PROXY : BLACKHOLE;
    }

    // باقي الترافيك عادي
    return "DIRECT";
}
