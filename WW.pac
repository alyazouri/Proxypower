function FindProxyForURL(url, host) {
    // ===== قفل مخصص لكل نوع حركة =====
    // عدّل الأسماء: "UMN" أو "ZAIN" أو "ORG" أو null (للتوزيع الموزون)
    var PER_KIND_LOCK = {
        lobby:   "ZAIN",
        match:   "UMN",
        recruit: "ZAIN",
        other:   "ZAIN"
    };

    // ===== بروكسيات IPv6 داخل الأردن =====
    var PROX = {
        UMN: { lobby:"PROXY [2a0f:77c0::1]:443",   match:"PROXY [2a0f:77c0::1]:20001",
               recruit:"PROXY [2a0f:77c0::1]:10010", other:"PROXY [2a0f:77c0::1]:8080" },
        ZAIN:{ lobby:"PROXY [2a10:2f00::100]:443", match:"PROXY [2a10:2f00::100]:20001",
               recruit:"PROXY [2a10:2f00::100]:10010", other:"PROXY [2a10:2f00::100]:8080" },
        ORG: { lobby:"PROXY [2a11:a580::1]:443",   match:"PROXY [2a11:a580::1]:20001",
               recruit:"PROXY [2a11:a580::1]:10010", other:"PROXY [2a11:a580::1]:8080" }
    };
    var BLACKHOLE = "PROXY [::1]:9"; // منع صارم — مافي DIRECT

    // ===== نطاقات IPv6 سكنية أردنية فقط =====
    var JO_V6 = [
        // Umniah
        "2a0f:77c0::/29","2a0f:77d0::/29","2a0f:ba40::/29","2a12:6fc0::/29","2a12:6fc4::/29",
        // Zain
        "2a10:2f00::/29","2a10:2f40::/29","2a10:2f80::/29","2a10:2fc0::/29",
        // Orange
        "2a11:a580::/29","2a11:a5c0::/29","2a11:a600::/29","2a11:a640::/29",
        // GO / Batelco / Mada
        "2a03:b640::/32","2a00:18d8::/29","2a03:6b00::/29"
    ];

    // ===== دومينات PUBG =====
    var DOM_MATCH   = ["*.igamecj.com","*.gcloud.qq.com","*.pubgmobile.com"];
    var DOM_LOBBY   = ["*.pubgmobile.com","*.proximabeta.com","*.tencentgames.com","*.tencent.com"];
    var DOM_RECRUIT = ["*.pubgmobile.com","*.igamecj.com"];
    var DOM_REQUESTS= ["*.report.qq.com","*.speed.qq.com","*.stats*.tencent.com","*.log*.tencent.com",
                       "*.api*.tencent.com","*.api*.pubgmobile.com"];
    var DOM_UPDATES = ["*.cdn*.pubgmobile.com","*.download.tencent.com","*.cdn*.tencent.com",
                       "*.dl*.qq.com","*.qcloudcdn.com","*.qcloudimg.com"];

    // ===== منافذ =====
    var P_MATCH   = [20001,20002,20003,20004,20005];
    var P_LOBBY   = [443,8080,8443];
    var P_RECRUIT_MIN = 10010, P_RECRUIT_MAX = 12235;

    // ===== Helpers =====
    function inList(list, h){ for (var i=0;i<list.length;i++) if (shExpMatch(h, list[i])) return true; return false; }
    function v6Allowed(ip6){ for (var i=0;i<JO_V6.length;i++) if (isInNetEx(ip6, JO_V6[i])) return true; return false; }
    function resolveAAAA(h){
        if (typeof dnsResolveEx === "function") {
            var r = dnsResolveEx(h);
            if (r && r.indexOf(":") !== -1) return r;
        }
        return null;
    }
    function h32(s){ var h=0,c; for(var i=0;i<s.length;i++){ c=s.charCodeAt(i); h=((h<<5)-h)+c; h|=0;} return (h>>>0); }
    function dayBucket(){ return Math.floor((new Date().getTime())/86400000); }
    function hourBucket(){ return Math.floor((new Date().getTime())/3600000); }
    function chain(order, kind){ var out=[]; for (var i=0;i<order.length;i++) out.push(PROX[order[i]][kind]); return out.join("; "); }

    // توزيع احتياطي إذا PER_KIND_LOCK=null
    var WEIGHTS = {
        lobby:   {UMN:65, ZAIN:25, ORG:10},
        match:   {UMN:80, ZAIN:15, ORG:5},
        recruit: {UMN:70, ZAIN:20, ORG:10},
        other:   {UMN:60, ZAIN:25, ORG:15}
    };
    function pickWeighted(kind, seed){
        var w = WEIGHTS[kind] || WEIGHTS.other, tot=0;
        for (var k in w) tot += w[k];
        var r = h32(seed) % tot, acc=0;
        for (var k2 in w){ acc += w[k2]; if (r < acc) return k2; }
        return "UMN";
    }

    var PREFIX_MAP = [
        // Umniah
        {cidr:"2a0f:77c0::/29", isp:"UMN"}, {cidr:"2a0f:77d0::/29", isp:"UMN"},
        {cidr:"2a0f:ba40::/29", isp:"UMN"}, {cidr:"2a12:6fc0::/29", isp:"UMN"},
        {cidr:"2a12:6fc4::/29", isp:"UMN"},
        // Zain
        {cidr:"2a10:2f00::/29", isp:"ZAIN"}, {cidr:"2a10:2f40::/29", isp:"ZAIN"},
        {cidr:"2a10:2f80::/29", isp:"ZAIN"}, {cidr:"2a10:2fc0::/29", isp:"ZAIN"},
        // Orange
        {cidr:"2a11:a580::/29", isp:"ORG"},  {cidr:"2a11:a5c0::/29", isp:"ORG"},
        {cidr:"2a11:a600::/29", isp:"ORG"},  {cidr:"2a11:a640::/29", isp:"ORG"},
        // محليين آخرين
        {cidr:"2a03:b640::/32", isp:"UMN"},
        {cidr:"2a00:18d8::/29", isp:"ZAIN"},
        {cidr:"2a03:6b00::/29", isp:"ORG"}
    ];

    // ===== المنفذ =====
    var port = 0;
    if (url.substring(0,8)==="https://") port = 443;
    else if (url.substring(0,7)==="http://") port = 80;
    var pIdx = url.lastIndexOf(":");
    if (pIdx > 8) { var p = parseInt(url.substring(pIdx+1),10); if(!isNaN(p)) port = p; }

    // ===== PUBG فقط =====
    var isPUBG = inList(DOM_MATCH, host) || inList(DOM_LOBBY, host) ||
                 inList(DOM_RECRUIT, host) || inList(DOM_REQUESTS, host) ||
                 inList(DOM_UPDATES, host);
    if (!isPUBG) return BLACKHOLE;

    // ===== IPv6 أردني فقط =====
    var ip6 = host;
    if (host.indexOf(":") === -1) { ip6 = resolveAAAA(host); if (!ip6) return BLACKHOLE; }
    else { if (host.indexOf(".") !== -1) return BLACKHOLE; }
    if (!v6Allowed(ip6)) return BLACKHOLE;

    // ===== تصنيف =====
    var kind = "other";
    if (P_MATCH.indexOf(port) !== -1 || (inList(DOM_MATCH, host) && (port===443||port===8080||port===8443))) kind = "match";
    else if (port >= P_RECRUIT_MIN && port <= P_RECRUIT_MAX && inList(DOM_RECRUIT, host)) kind = "recruit";
    else if ((port===443||port===8080||port===8443) && inList(DOM_LOBBY, host)) kind = "lobby";

    // ===== اختيار المزوّد: أولوية لقفل النوع، بعدها Prefix، بعدها وزن لزج =====
    var primary = PER_KIND_LOCK[kind] || null;
    if (!primary) {
        // اجبار ISP إذا الوجهة داخل Prefix معيّن
        for (var i=0;i<PREFIX_MAP.length && !primary;i++){ if (isInNetEx(ip6, PREFIX_MAP[i].cidr)) primary = PREFIX_MAP[i].isp; }
    }
    if (!primary) {
        var seed = host + ":" + port + "|" + kind + "|" + dayBucket() + "|" + hourBucket();
        primary = pickWeighted(kind, seed);
    }

    // Tilt ذكي: igamecj → UMN ، tencent/tencentgames → ZAIN
    if (shExpMatch(host, "*.igamecj.com")) primary = "UMN";
    if (shExpMatch(host, "*.tencent.com") || shExpMatch(host, "*.tencentgames.com")) primary = "ZAIN";

    // ===== Failover قاسي بدون DIRECT =====
    var order;
    if (primary==="UMN") order = ["UMN","ZAIN","ORG"];
    else if (primary==="ZAIN") order = ["ZAIN","UMN","ORG"];
    else order = ["ORG","UMN","ZAIN"];

    return chain(order, kind);
}
