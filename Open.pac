// =========================
// إعداد البروكسي
// =========================
var PROXY_HOST = "91.106.109.12";
var PROXY_PORT = "443";
var proxyChain = "PROXY " + PROXY_HOST + ":" + PROXY_PORT +
                 "; SOCKS " + PROXY_HOST + ":" + PROXY_PORT +
                 "; SOCKS5 " + PROXY_HOST + ":" + PROXY_PORT +
                 "; SOCKS5H " + PROXY_HOST + ":" + PROXY_PORT;

// =========================
// استثناءات DIRECT (فيديو/ستريم ثقيل)
// =========================
function endsWithHost(h, suffix) {
    return (h === suffix) || (h.length > suffix.length && h.slice(-(suffix.length + 1)) === "." + suffix);
}
function isAlwaysDirectByHost(h) {
    if (!h) return false;
    h = h.toLowerCase();
    if (endsWithHost(h, "youtube.com")) return true;
    if (endsWithHost(h, "googlevideo.com")) return true;
    if (endsWithHost(h, "ytimg.com")) return true;
    if (h === "youtu.be") return true;
    if (endsWithHost(h, "shahid.net")) return true;
    if (endsWithHost(h, "shahid.mbc.net")) return true;
    if (endsWithHost(h, "mbc.net")) return true;
    // إضافة مستقبلية: أسماء CDN فيديو أخرى
    return false;
}

// =========================
// بروفايلات البورتات (ببجي)
// =========================
var PORT_PROFILE = {
    LOBBY:          [443, 8080, 8443],
    MATCH:          [20001, 20002, 20003, 20004, 20005],
    RECRUIT_SEARCH: [10010, 10011, 10012, 10013, 10014, 12235],
    CDN_UPDATES:    [80, 8080],
    DEFAULT:        []
};

// =========================
// (اختياري) قوائم عناوين مزودي الأردن — متاحة لاستخدام لاحقاً
// لم يُطلب تطبيق صارم هنا لكن موجود للاستفادة أو التعديل.
// =========================
var JO_IPv4_RANGES = [
    ["94.249.0.0","94.249.127.255"],
    ["109.107.0.0","109.107.255.255"],
    ["92.241.32.0","92.241.63.255"],
    ["212.35.0.0","212.35.255.255"],
    ["212.118.0.0","212.118.255.255"],
    ["213.139.32.0","213.139.63.255"],
    ["92.253.35.0","92.253.35.255"],
    ["92.253.127.0","92.253.127.255"],
    ["176.28.158.0","176.28.158.255"],
    ["176.28.163.0","176.28.163.255"],
    ["176.28.184.0","176.28.184.255"]
];

var JO_IPv6_PREFIXES = [
    ["2a03:b640:0000:0000::","2a03:b640:ffff:ffff:ffff:ffff:ffff:ffff"], // Umniah / Orbitel
    ["2a03:6b00:0000:0000::","2a03:6b00:ffff:ffff:ffff:ffff:ffff:ffff"], // Zain
    ["2a00:18d8:0000:0000::","2a00:18d8:ffff:ffff:ffff:ffff:ffff:ffff"], // Orange
    ["2a01:9700:0000:0000::","2a01:9700:ffff:ffff:ffff:ffff:ffff:ffff"]  // JDC / GO
];

// =========================
// دوال IPv4
// =========================
function isIPv4(addr) {
    if (!addr) return false;
    var m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(addr);
    if (!m) return false;
    for (var i = 1; i <= 4; i++) {
        var n = parseInt(m[i], 10);
        if (isNaN(n) || n < 0 || n > 255) return false;
    }
    return true;
}
function ipToNumV4(addr) {
    var o = addr.split(".");
    return ((parseInt(o[0],10) * 256 + parseInt(o[1],10)) * 256 + parseInt(o[2],10)) * 256 + parseInt(o[3],10);
}
function inRangeV4(ip, start, end) {
    try {
        var x = ipToNumV4(ip);
        return (x >= ipToNumV4(start) && x <= ipToNumV4(end));
    } catch (e) { return false; }
}
function isInJoIpv4Ranges(ip) {
    if (!isIPv4(ip)) return false;
    for (var i = 0; i < JO_IPv4_RANGES.length; i++) {
        var r = JO_IPv4_RANGES[i];
        if (inRangeV4(ip, r[0], r[1])) return true;
    }
    return false;
}

// =========================
// دوال IPv6
// =========================
function isIPv6(addr) {
    if (!addr) return false;
    if (addr.indexOf(":") === -1) return false;
    if (addr.indexOf(".") !== -1) return false; // نرفض embedded IPv4 هنا
    return /^[0-9a-fA-F:]+$/.test(addr);
}
function pad16(s) { if (!s) s = "0"; while (s.length < 4) s = "0" + s; return s.toLowerCase(); }

function expandIPv6(ip) {
    if (!isIPv6(ip)) return null;
    var parts = ip.split("::");
    if (parts.length > 2) return null;
    var head = parts[0] ? parts[0].split(":") : [];
    var tail = (parts.length === 2 && parts[1]) ? parts[1].split(":") : [];
    if (parts.length === 1) {
        if (head.length !== 8) return null;
        return head.map(pad16).join(":");
    }
    var missing = 8 - (head.length + tail.length);
    if (missing < 0) return null;
    var mid = [];
    for (var i = 0; i < missing; i++) mid.push("0");
    var full = head.concat(mid).concat(tail);
    if (full.length !== 8) return null;
    return full.map(pad16).join(":");
}
function ipv6ToArr(ip) {
    var full = expandIPv6(ip);
    if (!full) return null;
    var parts = full.split(":");
    var out = [];
    for (var i = 0; i < 8; i++) out.push(parseInt(parts[i], 16));
    return out;
}
function cmpIpv6Arr(a, b) {
    for (var i = 0; i < 8; i++) {
        if (a[i] < b[i]) return -1;
        if (a[i] > b[i]) return 1;
    }
    return 0;
}
function inRangeV6(ip, start, end) {
    try {
        var ipA = ipv6ToArr(ip);
        var sA = ipv6ToArr(start);
        var eA = ipv6ToArr(end);
        if (!ipA || !sA || !eA) return false;
        return (cmpIpv6Arr(ipA, sA) >= 0 && cmpIpv6Arr(ipA, eA) <= 0);
    } catch (e) { return false; }
}
function isInJoIpv6Ranges(ip) {
    if (!isIPv6(ip)) return false;
    for (var i = 0; i < JO_IPv6_PREFIXES.length; i++) {
        var r = JO_IPv6_PREFIXES[i];
        if (inRangeV6(ip, r[0], r[1])) return true;
    }
    return false;
}

// =========================
// استخراج الهست والبورت من URL
// =========================
function getHostFromURL(u, fallbackHost) {
    var m = /^[a-zA-Z]+:\/\/$begin:math:display$?([0-9a-fA-F:\\.]+)$end:math:display$?(?::\d+)?/.exec(u);
    if (m && m[1]) return m[1];
    return fallbackHost || "";
}
function getPortFromURL(u) {
    var m = /^[a-zA-Z]+:\/\/$begin:math:display$?([0-9a-fA-F:\\.]+)$end:math:display$?(?::(\d+))?/.exec(u);
    var schemeMatch = /^([a-zA-Z]+):\/\//.exec(u);
    var scheme = schemeMatch ? schemeMatch[1].toLowerCase() : null;
    if (m && m[2]) return parseInt(m[2], 10);
    if (scheme === "https") return 443;
    if (scheme === "http") return 80;
    return 0;
}

// =========================
// أدوات مساعدة عامة
// =========================
function looksLikeIP(h) {
    return isIPv4(h) || isIPv6(h);
}

// =========================
// منطق التوجيه النهائي
// =========================
try {
    // 1) استثناءات الفيديو دائماً DIRECT
    if (isAlwaysDirectByHost(host)) return "DIRECT";

    var port = getPortFromURL(url);
    var candidateHost = getHostFromURL(url, host);

    // 2) أي ترافيك لعبة (LOBBY / MATCH / RECRUIT_SEARCH) => DIRECT بغض النظر عن الدومين أو الـ IP
    if (PORT_PROFILE.MATCH.indexOf(port) !== -1) return "DIRECT";
    if (PORT_PROFILE.LOBBY.indexOf(port) !== -1) return "DIRECT";
    if (PORT_PROFILE.RECRUIT_SEARCH.indexOf(port) !== -1) return "DIRECT";

    // 3) CDN / UPDATES: لو المضيف ضمن استثناءات الفيديو => DIRECT، وإلا نمرره عبر البروكسي
    if (PORT_PROFILE.CDN_UPDATES.indexOf(port) !== -1) {
        if (isAlwaysDirectByHost(candidateHost)) return "DIRECT";
        return proxyChain;
    }

    // 4) بقية الترافيك => البروكسي الأردني
    return proxyChain;

} catch (e) {
    // أي خطأ: نعيد proxyChain كـ fallback آمن
    return proxyChain;
}
