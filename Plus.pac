// ============================================================================
// ULTIMATE JORDAN PAC - v1.0 - All Features Merged
// يجمع كل الميزات من Proxypower Repo: BLOCKMODE, DUALMODE, FullMODE, Full, 0, F, Gptjor, IPv4s, A
// الهدف: PUBG Mobile Jordan Only + تحسين بنق + Anti Lag + Full Identity Lock
// تاريخ: 2026-08-03
// ============================================================================

var DEBUG_MODE = false;

// ============================== CONFIG ==============================
var CONFIG = {
    // مرشحي البروكسي الأردني - DUALMODE feature
    PROXY_CANDIDATES: [
        { host: "91.106.109.12", port: 443, label: "residential-JO", weight: 5 },
        { host: "185.141.39.25", port: 443, label: "mobile-JO", weight: 3 },
        { host: "213.215.220.130", port: 443, label: "fiber-JO", weight: 2 }
    ],

    // تير بروكسي للماتش - من 0.pac
    MATCH_TIER1: "PROXY 46.185.131.218:20001",
    MATCH_TIER2: "PROXY 212.35.66.45:8085",
    MATCH_TIER3: "PROXY 46.185.131.218:443",
    MATCH_TIER4: "PROXY 212.35.66.45:8181",

    BLACKHOLE: "PROXY 127.0.0.1:9",
    BLOCK_REPLY: "PROXY 0.0.0.0:0",
    DIRECT: "DIRECT",

    // بورتات - Full.pac + Gptjor
    PORTS: {
        LOBBY: [443, 8080, 8443],
        MATCH: [20001, 20002, 20003, 20004, 20005],
        RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
        VOICE: [443, 8080],
        TELEMETRY: [443],
        UPDATES: [80, 443, 8443, 8080],
        CDNS: [80, 8080, 443]
    },
    PORT_WEIGHTS: {
        LOBBY: [5, 3, 2],
        MATCH: [4, 3, 2, 1, 1],
        RECRUIT_SEARCH: [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
        VOICE: [5, 2],
        TELEMETRY: [5],
        UPDATES: [5, 3, 2, 1],
        CDNS: [3, 2, 2]
    },

    FIXED_PORT: { LOBBY: 443, MATCH: 20001, VOICE: 443, TELEMETRY: 443 },

    // TTLs - من Full.pac و DUALMODE
    STICKY_TTL_MS: 60 * 1000, // 60 ثانية
    DNS_CACHE_MS: 60 * 1000,
    DST_CACHE_MS: 30 * 1000,
    JITTER_WINDOW: 3,

    // Flags - كل المودات
    AGGRESSIVE_BLOCK: true,
    JORDAN_ONLY_MATCH: true,
    JORDAN_ONLY_TEAM: true,
    FULL_IDENTITY_LOCK: true,
    ENABLE_OTHER_GAMES: true,
    PRIORITY1_DIRECT_ENABLED: true, // لو IP فايبر بيت موثوق جدا + بورت لعبة = DIRECT لاقل بنق - من Gptjor
    ROTATE_JO_RANGES_PER_SECOND: true // من IPv4s.pac
};

// ============================== JO RANGES - الدمج الكامل ==============================
// تم دمج 0.pac + Full.pac + F.pac + BLOCKMODE + IPv4s.pac
var JO_V4_RANGES = [
    ["5.45.128.0","5.45.143.255"],
    ["37.17.192.0","37.17.207.255"],
    ["37.44.32.0","37.44.63.255"],
    ["37.75.144.0","37.75.151.255"],
    ["37.123.64.0","37.123.95.255"],
    ["37.152.0.0","37.152.7.255"],
    ["37.202.64.0","37.202.127.255"],
    ["37.220.112.0","37.220.127.255"],
    ["46.23.112.0","46.23.127.255"],
    ["46.32.96.0","46.32.127.255"],
    ["46.185.128.0","46.185.255.255"],
    ["46.248.192.0","46.248.223.255"],
    ["62.72.160.0","62.72.191.255"],
    ["77.245.0.0","77.245.15.255"],
    ["79.134.128.0","79.134.159.255"],
    ["79.173.192.0","79.173.255.255"],
    ["80.90.160.0","80.90.175.255"],
    ["81.21.0.0","81.21.15.255"],
    ["81.28.112.0","81.28.127.255"],
    ["82.212.64.0","82.212.127.255"],
    ["84.18.32.0","84.18.95.255"],
    ["86.108.0.0","86.108.127.255"],
    ["91.106.96.0","91.106.111.255"],
    ["91.186.224.0","91.186.255.255"],
    ["92.241.32.0","92.241.63.255"],
    ["92.253.0.0","92.253.127.255"],
    ["94.142.32.0","94.142.63.255"],
    ["94.249.0.0","94.249.127.255"],
    ["94.249.71.0","94.249.71.255"],
    ["94.249.76.0","94.249.76.255"],
    ["95.141.208.0","95.141.223.255"],
    ["95.172.192.0","95.172.223.255"],
    ["109.107.0.0","109.107.255.255"],
    ["149.200.128.0","149.200.255.255"],
    ["176.28.128.0","176.28.255.255"],
    ["176.28.184.0","176.28.184.255"],
    ["176.29.0.0","176.29.255.255"],
    ["176.57.0.0","176.57.31.255"],
    ["178.77.128.0","178.77.191.255"],
    ["178.238.176.0","178.238.191.255"],
    ["185.96.70.0","185.96.70.255"],
    ["185.140.0.0","185.140.255.255"],
    ["185.141.0.0","185.141.255.255"],
    ["188.123.160.0","188.123.191.255"],
    ["188.247.64.0","188.247.95.255"],
    ["194.165.128.0","194.165.159.255"],
    ["212.34.0.0","212.34.31.255"],
    ["212.35.0.0","212.35.95.255"],
    ["212.118.0.0","212.118.31.255"],
    ["213.139.32.0","213.139.63.255"],
    ["213.186.160.0","213.186.191.255"],
    ["213.215.0.0","213.215.255.255"],
    ["217.23.32.0","217.23.47.255"],
    ["217.29.240.0","217.29.255.255"]
];

// أولوية 1 - فايبر بيت موثوق جدا - من Gptjor
var PRIORITY1_V4 = [["213.139.32.0","213.139.63.255"]];

// أولوية 2 - بيوت عادية + DSL
var PRIORITY2_V4 = [
    ["212.118.0.0","212.118.255.255"],
    ["212.35.0.0","212.35.255.255"],
    ["176.28.184.0","176.28.184.255"],
    ["94.249.0.0","94.249.127.255"],
    ["92.253.127.0","92.253.127.255"],
    ["92.241.32.0","92.241.63.255"]
];

var JO_V6_CIDRS = [
    "2a00:18d8::/29", // Orange JO
    "2a03:6b00::/29", // Zain JO
    "2a03:b640::/32", // Umniah
    "2a01:9700::/29"  // JDC/GO
];

var HIGH_LATENCY_RANGES = []; // يمكن تعبئته بآيبيهات لاج عالية من 0.pac

// استثناءات DIRECT - يوتيوب واتساب سناب شاهد
var DIRECT_ALLOW_DOMAINS = [
    "youtube.com","youtu.be","googlevideo.com","ytimg.com",
    "whatsapp.com","whatsapp.net",
    "snapchat.com","snap.",
    "shahid.net","shahid.mbc.net","mbc.net"
];

// ============================== PUBG DOMAINS + OTHER GAMES ==============================
var PUBG_DOMAINS = {
    LOBBY: ["*.pubgmobile.com","*.pubgmobile.net","*.igamecj.com","*.proximabeta.com"],
    MATCH: ["*.gcloud.qq.com","gpubgm.com","*.tgp.qq.com"],
    RECRUIT: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    VOICE: ["*.igamecj.com","*.proximabeta.com"],
    TELEMETRY: ["*.pubgmobile.com","*.igamecj.com"],
    CDN: ["cdn.pubgmobile.com","cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};

var OTHER_GAME_DOMAINS = [
    "pubg.com","newstate.pubg.com","tencent.com","tencentgames.com",
    "callofduty.com","activision.com","codm.garena.com",
    "garena.com","freefiremobile.com","ff.garena.com",
    "riotgames.com","valorant.com","akamaized.net"
];

var URL_PATTERNS = {
    MATCH: ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    LOBBY: ["*/account/login*","*/client/version*","*/presence/*","*/friends/*","*/status/heartbeat*"],
    RECRUIT: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    VOICE: ["*/voice/*","*/voip/*","*/rtc/*","*/teamvoice/*","*/audio/*"],
    TELEMETRY: ["*/status/heartbeat*","*/report/battle*","*/anticheat/*","*/telemetry/*","*/stats/*","*/uploadlog*"],
    CDN: ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/cdn/*","*/static/*"]
};

// ============================== GLOBAL CACHE - من Full.pac + DUALMODE ==============================
var _root = (typeof globalThis !== "undefined") ? globalThis : this;
_root._PAC_ULTIMATE_CACHE = _root._PAC_ULTIMATE_CACHE || {};
var PAC_CACHE = _root._PAC_ULTIMATE_CACHE;
PAC_CACHE.HOST_CACHE = PAC_CACHE.HOST_CACHE || {};
PAC_CACHE.DST_CACHE = PAC_CACHE.DST_CACHE || {};
PAC_CACHE.PROXY_STICKY = PAC_CACHE.PROXY_STICKY || {};
PAC_CACHE.MATCH_SESSION = PAC_CACHE.MATCH_SESSION || { locked: false, networkPrefix: null, hostname: null, proxy: null, startTime: 0 };
PAC_CACHE.COUNTERS = PAC_CACHE.COUNTERS || { matchRequests: 0, lobbyRequests: 0, blockedRequests: 0 };

// ============================== HELPERS ==============================
function log(msg){ if(DEBUG_MODE){ try{ console.log("[ULTIMATE PAC] "+msg);}catch(e){} } }

function ipToInt(ip){
    var p = ip.split("."); if(p.length!==4) return -1;
    return (parseInt(p[0],10)*16777216)+(parseInt(p[1],10)*65536)+(parseInt(p[2],10)*256)+parseInt(p[3],10);
}
function sizeOfRange(r){
    var s=ipToInt(r[0]), e=ipToInt(r[1]);
    if(s<0||e<0||e<s) return 0; return e-s+1;
}
function ipInRange(ip, start, end){
    var a=ipToInt(ip), b=ipToInt(start), c=ipToInt(end);
    if(a<0||b<0||c<0) return false; return a>=b && a<=c;
}
function isInAnyRange(ip, ranges){
    if(!ip || ip.indexOf(".")===-1) return false;
    for(var i=0;i<ranges.length;i++){ if(ipInRange(ip, ranges[i][0], ranges[i][1])) return true; }
    return false;
}
function currentJoRanges(){
    var base = JO_V4_RANGES;
    if(!CONFIG.ROTATE_JO_RANGES_PER_SECOND) return base;
    var total=0, sizes=[];
    for(var i=0;i<base.length;i++){ var sz=sizeOfRange(base[i]); sizes.push(sz); total+=sz; }
    if(total<=0) return base.slice();
    var ptr = Math.floor(Date.now()/1000) % total;
    var acc=0, head=0;
    for(var j=0;j<base.length;j++){ var next=acc+sizes[j]; if(ptr<next){ head=j; break;} acc=next; }
    var out=[];
    for(var k=0;k<base.length;k++){ out.push(base[(head+k)%base.length]); }
    return out;
}
function isJordanianIP(ip){
    if(!ip) return false;
    if(ip.indexOf(":")!==-1){
        var low = ip.toLowerCase();
        for(var v=0;v<JO_V6_CIDRS.length;v++){
            try{
                var cidr = JO_V6_CIDRS[v].split("/");
                var pref = cidr[0].toLowerCase(); var plen=parseInt(cidr[1],10);
                var hextetCount = Math.floor(plen/16);
                var prefGroups = pref.split(":").slice(0,hextetCount).filter(Boolean);
                if(prefGroups.length===0) return true;
                var check = prefGroups.join(":");
                if(low.indexOf(check)===0) return true;
            }catch(e){}
        }
        return false;
    }
    return isInAnyRange(ip, currentJoRanges());
}
function isPriority1(ip){ return isInAnyRange(ip, PRIORITY1_V4); }
function isPriority2(ip){ return isInAnyRange(ip, PRIORITY2_V4) || isJordanianIP(ip); }

function cleanHost(h){ return h.replace(/^\[.*\]$/,"").replace(/:\d+$/,"").toLowerCase(); }

function resolveCached(host, cache, ttl){
    var now = Date.now();
    if(!host) return "";
    if(/^\d+\.\d+\.\d+\.\d+$/.test(host)) return host;
    var c = cache[host];
    if(c && (now-c.t) < ttl) return c.ip;
    var ip="";
    try{ var r=dnsResolve(host); if(r && r!=="0.0.0.0") ip=r; }catch(e){}
    cache[host]={ip:ip,t:now};
    return ip;
}
function fastResolve(h){ return resolveCached(h, PAC_CACHE.DST_CACHE, CONFIG.DST_CACHE_MS); }

function hostMatches(host, patterns){
    for(var i=0;i<patterns.length;i++){
        if(shExpMatch(host, patterns[i])) return true;
        var p = patterns[i].replace(/^\*\./,".");
        if(host.slice(-p.length)===p) return true;
    }
    return false;
}
function urlMatches(url, patterns){
    for(var i=0;i<patterns.length;i++){ if(shExpMatch(url, patterns[i])) return true; }
    return false;
}
function isDirectAllowed(url, host){
    for(var i=0;i<DIRECT_ALLOW_DOMAINS.length;i++){
        var d = DIRECT_ALLOW_DOMAINS[i];
        if(host===d || host.slice(-(d.length+1))==="."+d || shExpMatch(host, "*."+d) ) return true;
        if(host.indexOf(d)!==-1) return true;
    }
    return false;
}
function isPubgTraffic(host){
    for(var k in PUBG_DOMAINS){ if(hostMatches(host, PUBG_DOMAINS[k])) return true; }
    return false;
}
function getNetworkPrefix(ip){
    var p = ip.split("."); if(p.length!==4) return ""; return p[0]+"."+p[1]+"."+p[2];
}

function weightedPick(ports, weights){
    var sum=0; for(var i=0;i<weights.length;i++) sum+=(weights[i]||1);
    var jitter = CONFIG.JITTER_WINDOW>0 ? Math.floor(Math.random()*CONFIG.JITTER_WINDOW) : 0;
    var r = Math.floor(Math.random()*(sum+jitter))+1;
    var acc=0;
    for(var k=0;k<ports.length;k++){ acc+=(weights[k]||1); if(r<=acc) return ports[k]; }
    return ports[0];
}
function getStickyProxy(){
    var now = Date.now();
    if(PAC_CACHE.selProxy && (now-(PAC_CACHE.selTime||0) < CONFIG.STICKY_TTL_MS)) return PAC_CACHE.selProxy;
    for(var i=0;i<CONFIG.PROXY_CANDIDATES.length;i++){
        try{
            var c = CONFIG.PROXY_CANDIDATES[i];
            var ip = fastResolve(c.host);
            if(ip){
                var sel="PROXY "+c.host+":"+c.port;
                PAC_CACHE.selProxy=sel; PAC_CACHE.selTime=now;
                log("Selected proxy "+sel+" ("+c.label+")");
                return sel;
            }
        }catch(e){}
    }
    var f=CONFIG.PROXY_CANDIDATES[0];
    var out="PROXY "+f.host+":"+f.port;
    PAC_CACHE.selProxy=out; PAC_CACHE.selTime=now;
    return out;
}
function buildProxyForCategory(sticky, category){
    var port = CONFIG.FIXED_PORT[category] || CONFIG.PORTS[category][0] || 443;
    // لو وزن مطلوب نختار بورت موزون
    if(CONFIG.PORTS[category]){
        port = weightedPick(CONFIG.PORTS[category], CONFIG.PORT_WEIGHTS[category] || []);
    }
    return sticky.replace(/:\d+$/, ":"+port);
}
function getPortFromUrl(u){
    try{
        var m=/^[a-zA-Z]+:\/\/[^\/]+:(\d+)/.exec(u);
        if(m && m[1]) return parseInt(m[1],10);
        var scheme=/^([a-zA-Z]+):\/\//.exec(u);
        if(scheme){ if(scheme[1].toLowerCase()==="https") return 443; if(scheme[1].toLowerCase()==="http") return 80; }
    }catch(e){}
    return 0;
}
function isGamePort(p){
    for(var k in CONFIG.PORTS){
        if(CONFIG.PORTS[k].indexOf(p)!==-1) return true;
    }
    return false;
}

// ============================== MAIN FindProxyForURL ==============================
function FindProxyForURL(url, host){
    host = cleanHost(host.toLowerCase());
    var now = Date.now();

    // 1. استثناءات DIRECT - يوتيوب واتساب
    if(isDirectAllowed(url, host)){
        log("DIRECT ALLOW "+host);
        return CONFIG.DIRECT;
    }

    // 2. تحديد نوع الترافيك
    var isMatch = urlMatches(url, URL_PATTERNS.MATCH) || hostMatches(host, PUBG_DOMAINS.MATCH);
    var isLobby = urlMatches(url, URL_PATTERNS.LOBBY) || hostMatches(host, PUBG_DOMAINS.LOBBY);
    var isRecruit = urlMatches(url, URL_PATTERNS.RECRUIT) || hostMatches(host, PUBG_DOMAINS.RECRUIT);
    var isVoice = urlMatches(url, URL_PATTERNS.VOICE);
    var isTelemetry = urlMatches(url, URL_PATTERNS.TELEMETRY);
    var isCdn = urlMatches(url, URL_PATTERNS.CDN) || hostMatches(host, PUBG_DOMAINS.CDN);
    var isOtherGame = false;
    if(CONFIG.ENABLE_OTHER_GAMES){
        for(var og=0; og<OTHER_GAME_DOMAINS.length; og++){
            if(host===OTHER_GAME_DOMAINS[og] || host.slice(-(OTHER_GAME_DOMAINS[og].length+1))==="."+OTHER_GAME_DOMAINS[og]){
                isOtherGame=true; break;
            }
        }
    }

    var isPubg = isMatch || isLobby || isRecruit || isVoice || isTelemetry || isCdn || isPubgTraffic(host);
    var sticky = getStickyProxy();
    var dstIp = fastResolve(host);
    var clientIp = "";
    try{ clientIp = myIpAddress(); }catch(e){}

    // 3. لو مش ترافيك ببجي
    if(!isPubg && !isOtherGame){
        if(isJordanianIP(clientIp)){
            log("NON-PUBG DIRECT client JO "+host);
            return CONFIG.DIRECT;
        }else{
            log("NON-PUBG via JO proxy client NOT JO "+host);
            return sticky;
        }
    }

    // 4. فحص IP الوجهة - BLOCKMODE feature
    if(dstIp){
        if(dstIp.indexOf(":")===-1 && dstIp.indexOf(".")!==-1){
            // منع لاج عالي
            if(CONFIG.AGGRESSIVE_BLOCK && HIGH_LATENCY_RANGES.length>0 && isInAnyRange(dstIp, HIGH_LATENCY_RANGES)){
                PAC_CACHE.COUNTERS.blockedRequests++;
                log("BLOCK high latency "+dstIp);
                return CONFIG.BLACKHOLE;
            }
        }
    }

    // 5. MATCH - الأهم - JORDAN ONLY + Session Lock + Priority1 DIRECT
    if(isMatch){
        PAC_CACHE.COUNTERS.matchRequests++;
        // تحقق مزدوج: PRIORITY1 فايبر بيت = DIRECT لاقل بنق (Gptjor feature)
        if(CONFIG.PRIORITY1_DIRECT_ENABLED && dstIp && isPriority1(dstIp) && isGamePort(getPortFromUrl(url) || CONFIG.PORTS.MATCH[0])){
            log("MATCH PRIORITY1 DIRECT "+dstIp);
            return CONFIG.DIRECT;
        }
        if(CONFIG.JORDAN_ONLY_MATCH && dstIp && !isJordanianIP(dstIp)){
            PAC_CACHE.COUNTERS.blockedRequests++;
            log("MATCH NOT JO BLOCK "+dstIp+" host "+host);
            return CONFIG.BLACKHOLE;
        }
        // Session Lock من 0.pac
        var SESSION = PAC_CACHE.MATCH_SESSION;
        if(!SESSION.locked){
            SESSION.networkPrefix = dstIp ? getNetworkPrefix(dstIp) : "";
            SESSION.hostname = host;
            SESSION.proxy = buildProxyForCategory(sticky, "MATCH");
            SESSION.startTime = now;
            SESSION.locked = true;
            log("MATCH LOCKED "+SESSION.networkPrefix+" via "+SESSION.proxy);
            return CONFIG.MATCH_TIER1+"; "+CONFIG.MATCH_TIER2+"; "+CONFIG.MATCH_TIER3+"; "+CONFIG.MATCH_TIER4;
        }
        if(host===SESSION.hostname && dstIp && getNetworkPrefix(dstIp)===SESSION.networkPrefix){
            return SESSION.proxy+"; "+CONFIG.MATCH_TIER2+"; "+CONFIG.MATCH_TIER3;
        }
        if(dstIp && getNetworkPrefix(dstIp)===SESSION.networkPrefix){
            return SESSION.proxy+"; "+CONFIG.MATCH_TIER2;
        }
        // لو شبكة مختلفة و JORDAN_ONLY = بلوك
        if(CONFIG.JORDAN_ONLY_MATCH){
            return CONFIG.BLACKHOLE;
        }
        return buildProxyForCategory(sticky, "MATCH");
    }

    // 6. LOBBY / RECRUIT / TEAM
    if(isLobby || isRecruit){
        PAC_CACHE.COUNTERS.lobbyRequests++;
        if(CONFIG.JORDAN_ONLY_TEAM && dstIp && !isJordanianIP(dstIp)){
            PAC_CACHE.COUNTERS.blockedRequests++;
            log("LOBBY/TEAM NOT JO BLOCK "+dstIp);
            return CONFIG.BLACKHOLE;
        }
        // Priority1/2 باللوبي = DIRECT (Gptjor)
        if(dstIp && (isPriority1(dstIp) || isPriority2(dstIp))){
            if(isLobby){
                log("LOBBY JO DIRECT "+dstIp);
                return CONFIG.DIRECT;
            }
        }
        var lobbyProxy = buildProxyForCategory(sticky, "LOBBY");
        return lobbyProxy+"; "+CONFIG.MATCH_TIER2+"; "+CONFIG.DIRECT;
    }

    // 7. VOICE - FullMODE
    if(isVoice){
        log("VOICE via JO proxy");
        return buildProxyForCategory(sticky, "VOICE")+"; "+CONFIG.MATCH_TIER1;
    }

    // 8. TELEMETRY - FullMODE
    if(isTelemetry){
        log("TELEMETRY via JO proxy");
        return buildProxyForCategory(sticky, "TELEMETRY");
    }

    // 9. CDN / UPDATES - لا تخنق البروكسي
    if(isCdn){
        log("CDN DIRECT "+host);
        return CONFIG.DIRECT;
    }

    // 10. ألعاب أخرى - F.pac feature
    if(isOtherGame){
        if(dstIp && !isJordanianIP(dstIp)){
            // اجبار عبر بروكسي أردني
            return buildProxyForCategory(sticky, "LOBBY");
        }
        return buildProxyForCategory(sticky, "LOBBY");
    }

    // 11. باقي ترافيك ببجي غير مصنف - لو JO = DIRECT + PROXY كاحتياط
    if(dstIp && isJordanianIP(dstIp)){
        var p = buildProxyForCategory(sticky, "LOBBY");
        return p+"; "+CONFIG.DIRECT;
    }

    // fallback نهائي - بلوك لو مش أردني
    PAC_CACHE.COUNTERS.blockedRequests++;
    return CONFIG.BLACKHOLE;
}
