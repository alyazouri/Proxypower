function FindProxyForURL(url, host) {
    // تجنب الـ proxy للشبكات المحلية لـ ping منخفض وثابت (مثل داخل المنزل أو LAN)
    if (isInNet(host, "192.168.0.0", "255.255.0.0") ||
        isInNet(host, "10.0.0.0", "255.0.0.0") ||
        isInNet(host, "172.16.0.0", "255.240.0.0") ||
        dnsDomainIs(host, ".local") ||
        isPlainHostName(host)) {
        return "DIRECT";
    }

    // شرط للمواقع الأردنية: DIRECT لـ .jo أو IPs أردنية (Zain، Umniah، و Orange)
    if (dnsDomainIs(host, ".jo") ||
        isInNet(dnsResolve(host), "2a03:6b01::", "ffff:ffff:fffc::") ||  // /34 لـ Zain Jordan
        isInNet(dnsResolve(host), "2a03:b640::", "ffff:ffff::") ||       // /32 لـ Umniah
        isInNet(dnsResolve(host), "2a01:9700::", "ffff:ffff::")) {       // /32 لـ Orange Jordan
        return "DIRECT";
    }

    // استخدم SOCKS5 أولاً لـ performance أفضل وping أقل، ثم PROXY، ثم DIRECT للاستقرار
    return "SOCKS [2a03:6b01::1]:1080; PROXY [2a03:6b01::1]:8080; DIRECT";
}
