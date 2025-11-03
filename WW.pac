function FindProxyForURL(url, host) {
    var p = port;
    var proxyMatch = /^2a01:9700:[0-5]000:|^2001:9700:|^2001:7f8:|^2a02:7f8:|^2001:67c:27c0:|^2001:67c:2b40:|^2a0e:97c0:|^2a0e:b47:|^2001:df0:|^2a0b:64c0:|^2a0e:1dc0:|^2a0f:5700:|^2a10:cc40:|^2a12:bec0:/;
    
    if (proxyMatch.test(host)) {
        if (p >= 20001 && p <= 20005) return "SOCKS5 [2001:9700:1000::1]:1080";
        if (p == 10012)               return "SOCKS5 [2001:9700:1000::2]:1080";
        if (p == 17500)               return "SOCKS5 [2001:9700:1000::3]:1080";
        if (p == 80 || p == 443)      return "SOCKS5 [2001:9700:1000::4]:1080";
        if (p == 10010)               return "SOCKS5 [2001:9700:1000::5]:1080";
    }
    
    return "SOCKS5 [2001:9700:1000::1]:1080";
}
