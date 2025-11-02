function FindProxyForURL(url, host) {
    // ====================== بروكسياتك داخل الأردن (IPv6) ======================
    // عدّل العناوين لتطابق سيرفراتك الفعلية
    var PROX = {
        UMN: { lobby:"PROXY [2a0f:77c0::1]:443",   match:"PROXY [2a0f:77c0::1]:20001",
               recruit:"PROXY [2a0f:77c0::1]:10010", other:"PROXY [2a0f:77c0::1]:8080" },
        ZAIN:{ lobby:"PROXY [2a10:2f00::1]:443",   match:"PROXY [2a10:2f00::1]:20001",
               recruit:"PROXY [2a10:2f00::1]:10010", other:"PROXY [2a10:2f00::1]:8080" },
        ORG: { lobby:"PROXY [2a11:a580::1]:443",   match:"PROXY [2a11:a580::1]:20001",
               recruit:"PROXY [2a11:a580::1]:10010", other:"PROXY [2a11:a580::1]:8080" }
    };
    var BLACKHOLE = "PROXY [::1]:9"; // حجب صارم — لا DIRECT أبداً

    // ============== أوزان الميل (زِد UMN لو بدك تركيز أقوى محلياً) ==============
    var WEIGHTS = {
        lobby:   {UMN:65, ZAIN:25, ORG:10},
        match:   {UMN:70, ZAIN:20, ORG:10},
        recruit: {UMN:60, ZAIN:25, ORG:15},
        other:   {UMN:60, ZAIN:25, ORG:15}
    };

    // ====== خريطة Prefix→ISP (إجبار مزوّد معيّن عند رؤية بوادئه لتقصير المسار) ======
    var PREFIX_MAP = [
        {cidr:"2a0f:77c0::/29", isp:"UMN"}, {cidr:"2a0f:77d0::/29", isp:"UMN"}, {cidr:"2a0f:ba40::/29", isp:"UMN"},
        {cidr:"2a10:2f00::/29", isp:"ZAIN"},{cidr:"2a10:2f40::/29", isp:"ZAIN"},
        {cidr:"2a11:a580::/29", isp:"ORG"}, {cidr:"2a11:a5c0::/29", isp:"ORG"}
    ];

    // ====================== دومينات PUBG (Global) مصنّفة ======================
    var DOM_MATCH   = ["*.igamecj.com","*.gcloud.qq.com","*.pubgmobile.com"]; // مباراة + حركة اللاعب
    var DOM_LOBBY   = ["*.pubgmobile.com","*.proximabeta.com","*.tencentgames.com","*.tencent.com"];
    var DOM_RECRUIT = ["*.pubgmobile.com","*.igamecj.com"];
    var DOM_REQUESTS= ["*.report.qq.com","*.speed.qq.com","*.stats*.tencent.com","*.log*.tencent.com",
                       "*.api*.tencent.com","*.api*.pubgmobile.com"];
    var DOM_UPDATES = ["*.cdn*.pubgmobile.com","*.download.tencent.com","*.cdn*.tencent.com",
                       "*.dl*.qq.com","*.qcloudcdn.com","*.qcloudimg.com"];
    var DOM_ALL = [].concat(DOM_MATCH, DOM_LOBBY, DOM_RECRUIT, DOM_REQUESTS, DOM_UPDATES);

    // ============== نطاقات IPv6 أردنية (JO) — لبّ الموضوع (اختصر/وسع براحتك) ==============
    var JO_V6 = [
        "2a0f:77c0::/29","2a0f:77d0::/29","2a0f:ba40::/29",
        "2a10:2f00::/29","2a10:2f40::/29",
        "2a11:a580::/29","2a11:a5c0::/29",
        "2a12:6fc0::/29","2a12:6fc4::/29",
        "2a15:82c0::/29","2a15:a540::/29",
        // توسعة حكومية/أكاديمية محلية إن لزم
        "2001:67c:27c0::/48","2001:67c:27c4::/48","2001:67c:27c8::/48","2001:67c:27cc::/48",
        "2001:67c:370::/40","2001:67c:374::/40","2001:67c:378::/40","2001:67c:37c::/40",
        "2001:67c:3f0::/40","2001:67c:400::/40","2001:67c:404::/40","2001:67c:408::/40"
    ];

    // ======================== منافذ ببجي المعتمدة ========================
    var P_MATCH   = [20001,20002,20003,20004,20005];
    var P_LOBBY   = [443,8080,8443];
    var P_RECRUIT_MIN = 10010, P_RECRUIT_MAX = 12235;

    // ============================== Helpers ==============================
    function inList(list, h){ for (var i=0;i<list.length;i++) if (shExpMatch(h, list[i])) return true; return false; }
    function v6Allowed(ip6){ for (var i=0;i<JO_V6.length;i++) if (isInNetEx(ip6, JO_V6[i])) return true; return false; }
    function resolveAAAA(h){
        // لا نرضى إلا بـ AAAA — لتجنب أي سحب IPv4 برّا الأردن
        if (typeof dnsResolveEx === "function") {
            var r = dnsResolveEx(h);
            if (r && r.indexOf(":") !== -1) return r; // IPv6
        }
        return null;
    }
    function h32(s){ var h=0,c; for(var i=0;i<s.length;i++){ c=s.charCodeAt(i); h=((h<<5)-h)+c; h|=0;} return (h>>>0); }
    function dayBucket(){ return Math.floor((new Date().getTime())/86400000); } // Sticky يومي
    function hourBucket(){ return Math.floor((new Date().getTime())/3600000); } // تذبذب خفيف للمزج الآمن
    function chainOrder(primary){
        if (primary==="UMN") return ["UMN","ZAIN","ORG"];
        if (primary==="ZAIN") return ["ZAIN","UMN","ORG"];
        return ["ORG","UMN","ZAIN"];
    }
    function chainString(order, kind){
        var out=[]; for (var i=0;i<order.length;i++) out.push(PROX[order[i]][kind]); return out.join("; ");
    }
    function pickByWeight(kind, seed){
        var w = WEIGHTS[kind] || WEIGHTS.other, tot=0;
        for (var k in w) tot += w[k];
        var r = h32(seed) % tot, acc=0;
        for (var k2 in w){ acc += w[k2]; if (r < acc) return k2; }
        return "UMN";
    }
    function forceISPByPrefix(ip6){
        for (var i=0;i<PREFIX_MAP.length;i++){
            if (isInNetEx(ip6, PREFIX_MAP[i].cidr)) return PREFIX_MAP[i].isp;
        }
        return null;
    }

    // ====================== استنتاج المنفذ ======================
    var port = 0;
    if (url.substring(0,8)==="https://") port = 443;
    else if (url.substring(0,7)==="http://") port = 80;
    var pIdx = url.lastIndexOf(":");
    if (pIdx > 8) { var p = parseInt(url.substring(pIdx+1),10); if(!isNaN(p)) port = p; }

    // ===== 1) دومينات PUBG فقط =====
    var isPUBG = inList(DOM_MATCH, host) || inList(DOM_LOBBY, host) ||
                 inList(DOM_RECRUIT, host) || inList(DOM_REQUESTS, host) ||
                 inList(DOM_UPDATES, host);
    if (!isPUBG) return BLACKHOLE;

    // ===== 2) IPv6 أردني فقط (منع IPv4) =====
    var ip6 = host;
    if (host.indexOf(":") === -1) { // اسم نطاق
        ip6 = resolveAAAA(host);
        if (!ip6) return BLACKHOLE;               // لا AAAA → منع
    } else {
        if (host.indexOf(".") !== -1) return BLACKHOLE; // IPv4 literal → منع
    }
    if (!v6Allowed(ip6)) return BLACKHOLE;        // خارج JO → منع

    // ===== 3) تصنيف نوع حركة ببجي =====
    var kind = "other";
    if (P_MATCH.indexOf(port) !== -1 || (inList(DOM_MATCH, host) && (port===443||port===8080||port===8443))) {
        kind = "match";
    } else if (port >= P_RECRUIT_MIN && port <= P_RECRUIT_MAX && inList(DOM_RECRUIT, host)) {
        kind = "recruit";
    } else if ((port===443||port===8080||port===8443) && inList(DOM_LOBBY, host)) {
        kind = "lobby";
    } else if (inList(DOM_REQUESTS, host) || inList(DOM_UPDATES, host)) {
        kind = "other";
    }

    // ===== 4) اختيار المزوّد لتثبيت Pool أردني وتقليل الهوبات =====
    // (أ) Prefix→ISP: لو الهدف داخل Prefix معيّن، إجبار مزوّد مطابق (أقصر مسار)
    var primary = forceISPByPrefix(ip6);
    // (ب) إن ما في Prefix mapping، اختَر موزون Sticky (يومي) + لمسة مزج آمنة
    if (!primary) {
        var seed = host + ":" + port + "|" + kind + "|" + dayBucket() + "|" + hourBucket();
        primary = pickByWeight(kind, seed);
    }
    // (ج) Tilt ذكي: igamecj ↦ UMN، tencent ↦ ZAIN (يساعد على تجمعات أردنية)
    if (shExpMatch(host, "*.igamecj.com") && primary!=="UMN") primary = "UMN";
    if ((shExpMatch(host, "*.tencent.com") || shExpMatch(host, "*.tencentgames.com")) && primary==="UMN") primary = "ZAIN";

    // ===== 5) Failover قاسي بدون DIRECT =====
    var order = chainOrder(primary);
    return chainString(order, kind);
}
