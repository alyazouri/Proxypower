"use strict";

function FindProxyForURL(url, host) {
    // بروكسي أردني ثابت
    const PROXY_HOST = "91.106.109.12";
    const PROXY_PORT = "443";
    const proxyChain = [
        "PROXY " + PROXY_HOST + ":" + PROXY_PORT,
        "SOCKS " + PROXY_HOST + ":" + PROXY_PORT,
        "SOCKS5 " + PROXY_HOST + ":" + PROXY_PORT,
        "SOCKS5H " + PROXY_HOST + ":" + PROXY_PORT
    ].join("; ");

    // بورتات ببجي حسب الوظيفة
    const PORT_PROFILE = {
        LOBBY:          new Set([443,8080,8443]),
        MATCH:          new Set([20001,20002,20003,20004,20005]),
        RECRUIT_SEARCH: new Set([10010,10011,10012,10013,10014,12235]),
        CDN_UPDATES:    new Set([80,8080])
    };

    // نطاقات "سكنية قوية" أردنية IPv4
    const JO_RESIDENTIAL_V4 = [

  ["213.139.32.0","213.139.63.255"]
    ];

    // نطاقات "سكنية قوية" أردنية IPv6
    const JO_RESIDENTIAL_V6 = [
        ["2a03:b640:0000:0000::","2a03:b640:ffff:ffff:ffff:ffff:ffff:ffff"],
        ["2a03:6b00:0000:0000::","2a03:6b00:ffff:ffff:ffff:ffff:ffff:ffff"],
        ["2a00:18d8:0000:0000::","2a00:18d8:ffff:ffff:ffff:ffff:ffff:ffff"],
        ["2a01:9700:0000:0000::","2a01:9700:ffff:ffff:ffff:ffff:ffff:ffff"]
    ];

    // دوال مساعدة
    function endsWithHost(h, suffix) {
        return (h === suffix) || (h.length > suffix.length && h.slice(-(suffix.length+1)) === "."+suffix);
    }
    function isAlwaysDirectByHost(h) {
        if (!h) return false;
        h = h.toLowerCase();
        return (
            endsWithHost(h,"youtube.com") ||
            endsWithHost(h,"googlevideo.com") ||
            endsWithHost(h,"ytimg.com") ||
            h === "youtu.be" ||
            endsWithHost(h,"shahid.net") ||
            endsWithHost(h,"shahid.mbc.net") ||
            endsWithHost(h,"mbc.net")
        );
    }

    // IPv4 أدوات
    function isIPv4(a){
        const m=/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(a);
        if(!m) return false;
        for(let i=1; i<=4; i++){
            const n = parseInt(m[i],10);
            if(isNaN(n)||n<0||n>255) return false;
        }
        return true;
    }
    function ipToNumV4(a){
        const o = a.split(".");
        return ((+o[0]*256+ +o[1])*256+ +o[2])*256+ +o[3];
    }
    function inRangeV4(ip,start,end){
        const x=ipToNumV4(ip);
        return (x>=ipToNumV4(start) && x<=ipToNumV4(end));
    }

    // أولوية فايبر الأردني
    function isPriorityFiberRange(ip){
        if(!isIPv4(ip)) return false;
        return inRangeV4(ip, "213.139.32.0", "213.139.63.255");
    }

    // تصنيف سكني IPv4
    function isResidentialV4(ip){
        if(!isIPv4(ip)) return false;
        if (isPriorityFiberRange(ip)) return true;
        for(let r of JO_RESIDENTIAL_V4){
            if(inRangeV4(ip,r[0],r[1])) return true;
        }
        return false;
    }

    // أدوات IPv6
    function isIPv6(a){
        if(!a) return false;
        if(a.indexOf(":") === -1) return false;
        if(a.indexOf(".") !== -1) return false;
        return /^[0-9a-fA-F:]+$/.test(a);
    }
    function pad16(s){ if(!s) s="0"; while(s.length<4) s="0"+s; return s.toLowerCase();}
    function expandIPv6(ip){
        if(!isIPv6(ip)) return null;
        const parts = ip.split("::");
        if(parts.length>2) return null;
        const head = parts[0] ? parts[0].split(":") : [];
        const tail = (parts.length===2 && parts[1]) ? parts[1].split(":") : [];
        if(parts.length===1){
            if(head.length!==8) return null;
            return head.map(pad16).join(":");
        }
        const missing = 8 - (head.length + tail.length);
        if(missing<0) return null;
        const mid = new Array(missing).fill("0");
        const full = head.concat(mid).concat(tail);
        if(full.length!==8) return null;
        return full.map(pad16).join(":");
    }
    function ipv6ToArr(ip){
        const full=expandIPv6(ip);
        if(!full) return null;
        return full.split(":").map(x => parseInt(x,16));
    }
    function cmpV6(a,b){
        for(let i=0; i<8; i++){
            if(a[i]<b[i]) return -1;
            if(a[i]>b[i]) return 1;
        }
        return 0;
    }
    function inRangeV6(ip,start,end){
        const ipA=ipv6ToArr(ip);
        const sA=ipv6ToArr(start);
        const eA=ipv6ToArr(end);
        if(!ipA || !sA || !eA) return false;
        return cmpV6(ipA,sA)>=0 && cmpV6(ipA,eA)<=0;
    }
    function isResidentialV6(ip){
        if(!isIPv6(ip)) return false;
        for(let r of JO_RESIDENTIAL_V6){
            if(inRangeV6(ip,r[0],r[1])) return true;
        }
        return false;
    }

    // وظائف عامة
    function looksLikeIP(h){ return isIPv4(h) || isIPv6(h); }
    function isResidentialIP(h){ return isResidentialV4(h) || isResidentialV6(h); }
    function getHostFromURL(u, fallback){
        const m = /^[a-zA-Z]+:\/\/\[?([0-9a-fA-F:\.]+)\]?(?::\d+)?/.exec(u);
        if(m && m[1]) return m[1];
        return fallback||"";
    }
    function getPortFromURL(u){
        const m = /^[a-zA-Z]+:\/\/\[?([0-9a-fA-F:\.]+)\]?(?::(\d+))?/.exec(u);
        const schemeMatch = /^([a-zA-Z]+):\/\//.exec(u);
        const scheme = schemeMatch ? schemeMatch[1].toLowerCase() : null;
        if(m && m[2]) return parseInt(m[2],10);
        if(scheme==="https") return 443;
        if(scheme==="http") return 80;
        return 0;
    }

    try {
        if(isAlwaysDirectByHost(host)) return "DIRECT";

        const port = getPortFromURL(url);
        const hCandidate = getHostFromURL(url, host);

        if (PORT_PROFILE.MATCH.has(port)) {
            if (looksLikeIP(hCandidate) && isResidentialIP(hCandidate)) return "DIRECT";
            return proxyChain;
        }

        if (PORT_PROFILE.RECRUIT_SEARCH.has(port)) {
            if (looksLikeIP(hCandidate) && isResidentialIP(hCandidate)) return "DIRECT";
            return proxyChain;
        }

        if (PORT_PROFILE.LOBBY.has(port)) {
            if (looksLikeIP(hCandidate) && isResidentialIP(hCandidate)) return "DIRECT";
            return proxyChain;
        }

        if (PORT_PROFILE.CDN_UPDATES.has(port)) {
            if (isAlwaysDirectByHost(hCandidate)) return "DIRECT";
            return proxyChain;
        }

        return proxyChain;

    } catch(e) {
        return proxyChain;
    }
}
