// PAC: JO_NETS proxy-only, everything else DIRECT (bypass)
function FindProxyForURL(url, host) {
    // ============ CONFIG ============
    var PROXY_HOST       = "91.106.109.12"; // البروكسي الأردني الوحيد
    var PROXY_PORT_HTTPS = 8443;
    var PROXY_PORT_HTTP  = 8080;
    var PROXY_PORT_SOCKS = 1080;

    // إن أردت تفعيل فحص زمن المسار للبروكسي (ms) — ضع قيمة >0
    // لو =0 => لا فحص زمني (لا مشكلة، فقط التوجيه)
    var PROXY_MAX_MS = 21;

    // TTL لكاش DNS (ms)
    var DNS_CACHE_TTL_MS = 30000;

    // ============ JO NETS (network, mask) ============
    var JO_NETS = [
      ["213.139.32.0","255.255.224.0"],
      ["212.34.96.0","255.255.224.0"],
      ["86.108.64.0","255.255.192.0"],
      ["46.185.192.0","255.255.192.0"],
      ["79.173.192.0","255.255.192.0"],
      ["185.140.0.0","255.255.0.0"],
      ["46.23.112.0","255.255.240.0"],
      ["92.241.32.0","255.255.224.0"],
      ["91.106.104.0","255.255.248.0"],
      ["109.107.240.0","255.255.240.0"],
      ["185.96.70.0","255.255.255.0"]
    ];

    // ============ HELPERS ============
    function nowMs(){ try { return (new Date()).getTime(); } catch(e){ return 0; } }

    function ipInJordan(ip){
        if (!ip) return false;
        for (var i=0;i<JO_NETS.length;i++){
            var n = JO_NETS[i];
            try { if (isInNet(ip, n[0], n[1])) return true; } catch(e){}
        }
        return false;
    }

    if (typeof __DNS_CACHE__ === "undefined") __DNS_CACHE__ = {};
    function dnsResolveCached(host){
        try{
            var rec = __DNS_CACHE__[host], t = nowMs();
            if (rec && (t - rec.ts) < DNS_CACHE_TTL_MS) return rec.ip;
            var ip = dnsResolve(host);
            __DNS_CACHE__[host] = { ip: ip, ts: t };
            return ip;
        }catch(e){ return null; }
    }

    // زمان قياس (تقريبي باستخدام dnsResolve)
    if (typeof __DNS_TIMED__ === "undefined") __DNS_TIMED__ = {};
    function dnsResolveTimed(host){
        try{
            var rec = __DNS_TIMED__[host], t = nowMs();
            if (rec && (t - rec.ts) < DNS_CACHE_TTL_MS) return { ip: rec.ip, dt: rec.dt };
            var t0 = nowMs();
            var ip = dnsResolve(host);
            var dt = Math.max(1, nowMs() - t0);
            __DNS_TIMED__[host] = { ip: ip, dt: dt, ts: nowMs() };
            return { ip: ip, dt: dt };
        }catch(e){ return { ip: null, dt: 9999 }; }
    }

    function proxyChain(){
        // ترتيب: HTTPS -> PROXY -> SOCKS5 (بدون DIRECT)
        return "HTTPS " + PROXY_HOST + ":" + PROXY_PORT_HTTPS +
               "; PROXY " + PROXY_HOST + ":" + PROXY_PORT_HTTP +
               "; SOCKS5 " + PROXY_HOST + ":" + PROXY_PORT_SOCKS;
    }

    function proxyStatusOK(){
        if (!PROXY_MAX_MS || PROXY_MAX_MS <= 0) {
            // لا فحص زمني: نكتفي بأن نحل اسم البروكسي ونفحص إن كان داخل JO_NETS
            try {
                var pip = dnsResolveCached(PROXY_HOST);
                return pip && ipInJordan(pip);
            } catch(e){ return false; }
        } else {
            // فحص زمني تقريبي + تحقق من أردنية IP البروكسي
            var r = dnsResolveTimed(PROXY_HOST);
            if (!r.ip) return false;
            if (r.dt > PROXY_MAX_MS) return false;
            return ipInJordan(r.ip);
        }
    }

    // ============ POLICY ============
    // حل اسم الوجهة (نحتاج IP لنقرر إذا داخل JO_NETS أو لا)
    var dest = dnsResolveTimed(host);
    if (!dest.ip) {
        // لو ما قدرنا نحل اسم الوجهة: لمنع خروج غير مرغوب نمررها DIRECT (حسب طلبك يمكن تغييرها إلى حجب)
        // هنا نختار DIRECT لأن سؤالك كان عن bypass للخوادم خارج الأردن
        return "DIRECT";
    }

    // إذا الوجهة داخل JO_NETS -> اجبر المرور عبر البروكسي الأردني (بعد فحصه)
    if (ipInJordan(dest.ip)) {
        if (!proxyStatusOK()) {
            // إن فشل فحص البروكسي (غير أردني أو بطيء) — نمنع المرور عبر مسار خارجي
            // خياران: 1) حجب كامل  => "PROXY 0.0.0.0:0"
            //          2) السماح DIRECT => "DIRECT"
            // سأضع الحجب كخيار آمن: لمنع فتح اتصال غير أردني عند فشل البروكسي
            return "PROXY 0.0.0.0:0";
        }
        return proxyChain();
    }

    // إذا الوجهة خارج JO_NETS -> bypass (DIRECT)
    return "DIRECT";
}
