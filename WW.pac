function FindProxyForURL(url, host) {
    // === helper: استخراج البورت من الـ URL ===
    var port = (function(u, h) {
        // إذا host جاء كـ [ipv6]:port أو ipv4:port فـ host قد يحتوي البورت — لكن في PAC عادة لا
        // أسلم طريقة: نبحث في الـ url عن ":<digits>" قبل أول "/"
        var m = u.match(/^[a-zA-Z0-9+\-.]+:\/\/(?:\[[^\]]+\]|[^\/:]+)(?::(\d+))?/);
        if (m && m[1]) return parseInt(m[1], 10);
        // إذا ما لقيناه نفترض حسب بروتوكول
        return (u.substring(0, 5).toLowerCase() === "https") ? 443 : 80;
    })(url, host);

    // === helper: الحصول على عنوان المضيف بدون أقواس IPv6 ===
    var hostIP = host;
    if (hostIP.charAt(0) === '[' && hostIP.charAt(hostIP.length - 1) === ']') {
        hostIP = hostIP.substring(1, hostIP.length - 1);
    }

    // === لائحة بادئات IPv6 (عدّل أو أضف أي بادئات تريد) ===
    var JO_V6_PREFIXES = [
        "2a01:9700:",   // مثال: 2a01:9700:XXXX:
        "2001:9700:",
        "2001:7f8:",
        "2a02:7f8:",
        "2001:67c:27c0:",
        "2001:67c:2b40:",
        "2a0e:97c0:",
        "2a0e:b47:",
        "2001:df0:",
        "2a0b:64c0:",
        "2a0e:1dc0:",
        "2a0f:5700:",
        "2a10:cc40:",
        "2a12:bec0:"
        // اضف هنا بادئات IPv6 إضافية إذا لزم
    ];

    // === دالة لفحص ما إذا كان الـ hostIP يبدأ بأي بادئة من القائمة ===
    function hostIsInJoV6(h) {
        if (!h || h.indexOf(":") === -1) return false; // ليس عنوان IPv6
        for (var i = 0; i < JO_V6_PREFIXES.length; i++) {
            if (h.toLowerCase().indexOf(JO_V6_PREFIXES[i]) === 0) return true;
        }
        return false;
    }

    // === قواعد التوجيه ===
    if (hostIsInJoV6(hostIP)) {
        if (port >= 20001 && port <= 20005) return "SOCKS5 [2001:9700:1000::1]:1080";
        if (port === 10012)               return "SOCKS5 [2001:9700:1000::2]:1080";
        if (port === 17500)               return "SOCKS5 [2001:9700:1000::3]:1080";
        if (port === 80 || port === 443)  return "SOCKS5 [2001:9700:1000::4]:1080";
        if (port === 10010)               return "SOCKS5 [2001:9700:1000::5]:1080";
        // إذا مطابقة البادئة لكن رقم البورت غير محدد في القواعد -> استخدم البروكسي الأول كـ fallback
        return "SOCKS5 [2001:9700:1000::1]:1080";
    }

    // === fallback عام (تعديل ممكن: "DIRECT" لو تبي تخرج محلياً) ===
    return "SOCKS5 [2001:9700:1000::1]:1080";
}
