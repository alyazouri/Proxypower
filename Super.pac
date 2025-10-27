function FindProxyForURL(url, host) {
    // 1. توجيه مباشر لعناوين الشبكة المحلية وأسماء المضيف المحلية
    if (isPlainHostName(host) ||
        shExpMatch(host, "*.local") ||
        isInNet(host, "10.0.0.0", "255.0.0.0") ||
        isInNet(host, "172.16.0.0", "255.240.0.0") ||
        isInNet(host, "192.168.0.0", "255.255.0.0") ||
        isInNet(host, "127.0.0.0", "255.0.0.0")) {
        return "DIRECT";
    }

    // 2. استثناء فحص بوابة captive portal لأجهزة Apple لضمان عدم تعطيل الاتصال
    if (shExpMatch(url, "*apple.com/library/test/*") ||
        shExpMatch(host, "captive.apple.com")) {
        return "DIRECT";
    }

    // 3. توجيه خاص بنطاقات PUBG Mobile عبر بروكسي الأردن
    if (shExpMatch(host, "*pubgmobile*") ||
        shExpMatch(host, "*pubgm*") ||
        shExpMatch(host, "*amsoveasea.com") ||
        shExpMatch(host, "*proximabeta.com")) {
        var res = dnsResolve(host);
        if (res) {
            if (res.indexOf(":") != -1 && res.toLowerCase().indexOf("2a03:b640:") === 0) {
                // في حال كان IP الوجهة IPv6 ضمن نطاق أمنية المحلي، استخدم الاتصال المباشر أولاً ثم البروكسي احتياطياً
                return "DIRECT; PROXY 91.106.109.12:8080";
            } else {
                // خلاف ذلك، استخدم البروكسي أولاً (لضمان خروج من عنوان أردني ثابت)، ثم جرّب الاتصال المباشر كبديل
                return "PROXY 91.106.109.12:8080; DIRECT";
            }
        } else {
            // في حال تعذّر حل اسم المضيف، حاول البروكسي أولاً ثم الاتصال المباشر
            return "PROXY 91.106.109.12:8080; DIRECT";
        }
    }

    // 4. التوجيه الافتراضي لبقية الحركة – اتصال مباشر بدون بروكسي
    return "DIRECT";
}
