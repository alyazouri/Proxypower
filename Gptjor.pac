"use strict";

function FindProxyForURL(url, host) {
    //
    // بروكسي الهوية الأردنية
    //
    var PROXY_HOST = "91.106.109.12";
    var PROXY_PORT = "443";
    var proxyChain =
        "PROXY "   + PROXY_HOST + ":" + PROXY_PORT +
        "; SOCKS5 " + PROXY_HOST + ":" + PROXY_PORT +
        "; SOCKS5H " + PROXY_HOST + ":" + PROXY_PORT;

    //
    // بورتات ببجي حسب نوع الترافيك
    //
    var PORT_PROFILE = {
        LOBBY:          [443,8080,8443],                      // دخول الحساب / لائحة الأصدقاء / الشات
        MATCH:          [20001,20002,20003,20004,20005],      // القيم نفسه
        RECRUIT_SEARCH: [10010,10011,10012,10013,10014,12235],// دعوات سكواد / بحث فريق
        CDN_UPDATES:    [80,8080]                             // تحميل ملفات/ريسوورس
    };

    //
    // دوال تساعدنا نعرف نوع البورت (نقرب الـ "hop check")
    //
    function isLobbyPort(p){return PORT_PROFILE.LOBBY.indexOf(p)!==-1;}
    function isMatchPort(p){return PORT_PROFILE.MATCH.indexOf(p)!==-1;}
    function isRecruitPort(p){return PORT_PROFILE.RECRUIT_SEARCH.indexOf(p)!==-1;}
    function isGamePort(p){return isLobbyPort(p)||isMatchPort(p)||isRecruitPort(p);}
    function isCdnPort(p){return PORT_PROFILE.CDN_UPDATES.indexOf(p)!==-1;}

    //
    // أولوية 1: فايبر/بيت عالي الثقة جداً
    // (تركيزك الأساسي: 213.139.32.0 - 213.139.63.255)
    //
    var PRIORITY1_V4 = [
        ["213.139.32.0","213.139.63.255"]
    ];

    //
    // أولوية 2: سكن أردني (باقي مزودي فايبر/DSL/بيوت و IPv6 الأردنية المحلية)
    //
    var PRIORITY2_V4 = [
        ["212.118.0.0","212.118.255.255"],
        ["212.35.0.0","212.35.255.255"],
        ["176.28.184.0","176.28.184.255"],
        ["176.28.163.0","176.28.163.255"],
        ["176.28.158.0","176.28.158.255"],
        ["109.107.0.0","109.107.255.255"],
        ["94.249.0.0","94.249.127.255"],
        ["92.253.127.0","92.253.127.255"],
        ["92.253.35.0","92.253.35.255"],
        ["92.241.32.0","92.241.63.255"]
    ];

    var PRIORITY2_V6 = [
        ["2a03:b640:0000:0000::","2a03:b640:ffff:ffff:ffff:ffff:ffff:ffff"], // Umniah / Orbitel FTTH
        ["2a03:6b00:0000:0000::","2a03:6b00:ffff:ffff:ffff:ffff:ffff:ffff"], // Zain fixed broadband
        ["2a00:18d8:0000:0000::","2a00:18d8:ffff:ffff:ffff:ffff:ffff:ffff"], // Orange fiber/DSL
        ["2a01:9700:0000:0000::","2a01:9700:ffff:ffff:ffff:ffff:ffff:ffff"]  // GO / JDC FTTH
    ];

    //
    // استثناءات الفيديو (يوتيوب / شاهد / googlevideo / ytimg)
    // بنخليها DIRECT عشان ما نخنق البروكسي بالستريمنغ
    //
    function endsWithHost(h, suffix) {
        return (h === suffix) ||
               (h.length > suffix.length && h.slice(-(suffix.length+1)) === "."+suffix);
    }
    function isAlwaysDirectByHost(h) {
        if (!h) return false;
        h = h.toLowerCase();
        if (endsWithHost(h,"youtube.com")) return true;
        if (endsWithHost(h,"googlevideo.com")) return true;
        if (endsWithHost(h,"ytimg.com")) return true;
        if (h === "youtu.be") return true;
        if (endsWithHost(h,"shahid.net")) return true;
        if (endsWithHost(h,"shahid.mbc.net")) return true;
        if (endsWithHost(h,"mbc.net")) return true;
        return false;
    }

    //
    // أدوات IPv4
    //
    function isIPv4(a){
        var m=/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(a);
        if(!m)return false;
        for(var i=1;i<=4;i++){
            var n=parseInt(m[i],10);
            if(isNaN(n)||n<0||n>255)return false;
        }
        return true;
    }
    function ipToNumV4(a){
        var o=a.split(".");
        return ((parseInt(o[0],10)*256+parseInt(o[1],10))*256+parseInt(o[2],10))*256+parseInt(o[3],10);
    }
    function inRangeV4(ip,start,end){
        var x=ipToNumV4(ip);
        return (x>=ipToNumV4(start) && x<=ipToNumV4(end));
    }

    function isPriority1(ip){
        if(!isIPv4(ip)) return false;
        for(var i=0;i<PRIORITY1_V4.length;i++){
            var r=PRIORITY1_V4[i];
            if(inRangeV4(ip,r[0],r[1])) return true;
        }
        return false;
    }

    function isPriority2_v4only(ip){
        if(!isIPv4(ip)) return false;
        for(var i=0;i<PRIORITY2_V4.length;i++){
            var r=PRIORITY2_V4[i];
            if(inRangeV4(ip,r[0],r[1])) return true;
        }
        return false;
    }

    //
    // أدوات IPv6
    //
    function isIPv6(a){
        if(!a)return false;
        if(a.indexOf(":")===-1)return false;
        if(a.indexOf(".")!==-1)return false; // ما نقبل IPv4-mapped هون
        return /^[0-9a-fA-F:]+$/.test(a);
    }
    function pad16(s){if(!s)s="0";while(s.length<4)s="0"+s;return s.toLowerCase();}
    function expandIPv6(ip){
        if(!isIPv6(ip))return null;
        var parts=ip.split("::");
        if(parts.length>2)return null;
        var head=parts[0]?parts[0].split(":"):[];
        var tail=(parts.length===2&&parts[1])?parts[1].split(":"):[];
        if(parts.length===1){
            if(head.length!==8)return null;
            return head.map(pad16).join(":");
        }
        var missing=8-(head.length+tail.length);
        if(missing<0)return null;
        var mid=[];for(var i=0;i<missing;i++)mid.push("0");
        var full=head.concat(mid).concat(tail);
        if(full.length!==8)return null;
        return full.map(pad16).join(":");
    }
    function ipv6ToArr(ip){
        var full=expandIPv6(ip);if(!full)return null;
        var p=full.split(":");
        var out=[];
        for(var i=0;i<8;i++) out.push(parseInt(p[i],16));
        return out;
    }
    function cmpV6(a,b){
        for(var i=0;i<8;i++){
            if(a[i]<b[i])return -1;
            if(a[i]>b[i])return 1;
        }
        return 0;
    }
    function inRangeV6(ip,start,end){
        var ipA=ipv6ToArr(ip),
            sA =ipv6ToArr(start),
            eA =ipv6ToArr(end);
        if(!ipA||!sA||!eA)return false;
        return (cmpV6(ipA,sA)>=0 && cmpV6(ipA,eA)<=0);
    }

    function isPriority2_v6only(ip){
        if(!isIPv6(ip)) return false;
        for(var i=0;i<PRIORITY2_V6.length;i++){
            var r=PRIORITY2_V6[i];
            if(inRangeV6(ip,r[0],r[1])) return true;
        }
        return false;
    }

    // priority2 = أي IP يقع في مجموعات السكن الأردنية غير Priority1
    function isPriority2(ip){
        if(isPriority1(ip)) return false; // الأولوية 1 مفصولة
        if(isIPv4(ip) && isPriority2_v4only(ip)) return true;
        if(isIPv6(ip) && isPriority2_v6only(ip)) return true;
        return false;
    }

    //
    // Helpers عامة
    //
    function looksLikeIP(h){
        return isIPv4(h)||isIPv6(h);
    }

    function getHostFromURL(u,fallback){
        // نسحب الـ host أو الـ IP من ال URL
        var m=/^[a-zA-Z]+:\/\/\[?([0-9a-fA-F:\.]+)\]?(?::\d+)?/.exec(u);
        if(m && m[1]) return m[1];
        return fallback||"";
    }

    function getPortFromURL(u){
        // جرّب نمط :<port> أولاً
        var m=/^[a-zA-Z]+:\/\/\[?[0-9a-fA-F:\.]+\]?(?::(\d+))?/.exec(u);
        if(m && m[1]) return parseInt(m[1],10);

        // لو ما فيه بورت صريح، خمن من البروتوكول
        var schemeMatch=/^([a-zA-Z]+):\/\//.exec(u);
        var scheme = schemeMatch ? schemeMatch[1].toLowerCase() : "";
        if(scheme==="https") return 443;
        if(scheme==="http")  return 80;
        return 0;
    }

    //
    // منطق القرار
    //
    try {
        // ستريمنغ وفيديو ثقيل → DIRECT فوري
        if (isAlwaysDirectByHost(host)) {
            return "DIRECT";
        }

        var port = getPortFromURL(url);
        var target = getHostFromURL(url, host);

        // لو مش IP أصلاً (دومين عام)، ما نقدر نوثق هويته => نتعامل معه كبروكسي لاحقاً
        var isIP = looksLikeIP(target);

        // =========================
        // step A: أولوية 1 + بورت لعبة
        // هذا هو "التحقق المزدوج" اللي اتفقنا عليه:
        // - السيرفر عنوانه Priority1 (فايبر بيت موثوق جداً محلي)
        // - AND البورت فعلاً بورت لعبة (LOBBY أو MATCH أو RECRUIT)
        // هذا أعلى ثقة = DIRECT
        // =========================
        if (isIP && isPriority1(target) && isGamePort(port)) {
            return "DIRECT";
        }

        // =========================
        // step B: MATCH / RECRUIT_SEARCH
        // أثناء القيم أو البحث عن سكواد احنا بدنا نغصب إحساس الأردن
        // إذا السيرفر مش Priority1 verified above → خليه عبر البروكسي
        // حتى لو Priority2، لأنه Priority2 أوسع وأقل دقة
        // =========================
        if (isMatchPort(port) || isRecruitPort(port)) {
            return proxyChain;
        }

        // =========================
        // step C: لُوبّي (443/8080/8443)
        // باللوبي: إذا IP من Priority1 أو Priority2 → DIRECT
        // (هيك تشوف بينغ ألطف للـsocial/chat والـlogin)
        // غير هيك → proxyChain
        // =========================
        if (isLobbyPort(port)) {
            if (isIP && (isPriority1(target) || isPriority2(target))) {
                return "DIRECT";
            }
            return proxyChain;
        }

        // =========================
        // step D: CDN/updates
        // اعمل DIRECT مبدئياً (أنت ما بدك التحديثات تخنق البروكسي)
        // =========================
        if (isCdnPort(port)) {
            return "DIRECT";
        }

        // =========================
        // step E: أي شيء ثاني
        // خليه يطلع من البروكسي الأردني عشان تحافظ على الهوية العامة أردنية
        // =========================
        return proxyChain;

    } catch (e) {
        // fallback آمن
        return proxyChain;
    }
}
