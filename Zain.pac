function FindProxyForURL(url, host) {
    // تجنب الـ proxy للشبكات المحلية لـ ping منخفض وثابت (مثل داخل المنزل أو Zain LAN)
    if (isInNet(host, "192.168.0.0", "255.255.0.0") ||
        isInNet(host, "10.0.0.0", "255.0.0.0") ||
        isInNet(host, "172.16.0.0", "255.240.0.0") ||
        dnsDomainIs(host, ".local") ||
        isPlainHostName(host)) {
        return "DIRECT";
    }

    // شرط جديد: DIRECT للمواقع الأردنية (.jo) أو IPs أردنية (مثل نطاق Zain IPv6)
    if (dnsDomainIs(host, ".jo") ||
        isInNet(dnsResolve(host), "2a03:6b01::", "ffff:ffff:fffc::")) {  // /34 لـ Zain Jordan
        return "DIRECT";
    }

    // استخدم SOCKS5 أولاً لـ performance أفضل وping أقل، ثم PROXY، ثم DIRECT للاستقرار
    return "SOCKS [2a03:6b01::1]:1080; PROXY [2a03:6b01::1]:8080; DIRECT";
}
