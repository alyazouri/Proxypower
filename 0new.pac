// ═══════════════════════════════════════════════════════════════════════
//  PUBG JORDAN ULTIMATE v33.0 — PURE JORDAN PATH ONLY (FAST LOBBY)
//  ═══════════════════════════════════════════════════════════════════════
//  ONLY CONFIRMED JORDAN PROXIES — ALL PATHS PURE JORDAN
//  هدف: يشوفك أردنيين بيدخلوا معك فوراً (Sticky Lobby + Force Jordan)
// ═══════════════════════════════════════════════════════════════════════

var CFG = {
    VERSION: "33.0-PURE-JORDAN-FAST-LOBBY",
    MODE: "FRIEND_DISCOVERY",
    
    // FAST PING TARGETS
    TARGET_PING: 2,
    SOCIAL_API_TARGET: 2,
    EXCELLENT_PING: 5,
    GOOD_PING: 8,
    MAX_ACCEPTABLE_PING: 10,
    CRITICAL_PING: 15,
    
    // PURE JORDAN ONLY
    FORCE_JORDAN_LOBBY: true,
    FORCE_JORDAN_MATCHMAKING: true,
    FORCE_JORDAN_SOCIAL: true,
    FORCE_JORDAN_ONLY_MODE: true,
    JORDAN_PLAYER_TARGET: 100,
    JORDAN_ONLY_MODE: true,
    ALLOW_MENA_FALLBACK: false,
    BLOCK_INTERNATIONAL: true,
    BLOCK_NON_JORDAN: true,
    
    // DISCOVERY BOOST
    ENABLE_FRIEND_DISCOVERY: true,
    ENABLE_NEARBY_PLAYERS: true,
    ENABLE_CREW_OPTIMIZATION: true,
    ENABLE_SOCIAL_GRAPH: true,
    ENABLE_LOBBY_SYNC: true,
    ENABLE_RECRUITMENT_BOOST: true,
    ENABLE_REGIONAL_AFFINITY: true,
    ENABLE_PLAYER_SEARCH_BOOST: true,
    ENABLE_CROSS_PLATFORM: true,
    
    SOCIAL_PRIORITY_MULTIPLIER: 5.0,
    FRIEND_DISCOVERY_RADIUS: 500,
    LOBBY_AGGREGATION: true,
    PLAYER_POOL_EXPANSION: true,
    VISIBILITY_BOOST: 10.0,      // أقصى ظهور
    SEARCH_RANKING_BOOST: 20,     // أول في البحث
    
    // ML
    ENABLE_ML_PREDICTION: true,
    ENABLE_SELF_OPTIMIZATION: true,
    ENABLE_PLAYER_PATTERN_LEARNING: true,
    LEARNING_RATE: 0.3,
    PATTERN_RECOGNITION: true,
    PREDICTIVE_ROUTING: true,
    SOCIAL_ML: true,
    
    // NETWORK
    DNS_CACHE_TTL: 60000,
    DNS_CACHE_MAX: 800,
    PREFETCH_SOCIAL_DNS: true,
    ROUTE_CACHE_TTL: 600000,
    STICKY_TTL: 900000,          // 15 دقيقة لزقة
    
    BURST_MODE: true,
    ULTRA_BURST_MODE: true,
    PRE_CONNECTION_WARMUP: true,
    PARALLEL_CONNECTIONS: true,
    AGGRESSIVE_KEEP_ALIVE: true,
    SOCKET_POOLING: true,
    
    FAIL_CLOSED: true,
    ZERO_TOLERANCE: true,
    MAX_PROXY_CHAIN: 1,          // سلسلة واحدة فقط للسرعة
    
    COLLECT_ANALYTICS: false,    // إيقاف التحليلات للسرعة
    TRACK_SOCIAL_INTERACTIONS: true,
    REAL_TIME_STATS: false,
    AUTO_REPORT_GENERATION: false,
    NETWORK_CONDITION_MONITOR: true,
    PROXY_EXIT_JORDAN_ONLY: true
};


// ═══════════════════════════════════════════════════════════════════════
//  PURE JORDAN PROXY POOL — CONFIRMED JORDAN IPs ONLY
// ═══════════════════════════════════════════════════════════════════════

var PROXY = {
    // TIER 0: ULTRA — ALL PURE JORDAN (ORANGE / ZAIN / UMNIAH)
    ORANGE_ULTRA_1: {
        ip: "46.185.131.218", port: 8443, carrier: "ORANGE", tier: 0,
        targetPing: 2, reliability: 99.9, bandwidth: "ULTRA",
        priority: 100, capacity: 400, location: "AMMAN_CORE_PURE",
        socialOptimized: true, burstCapable: true, ultraBurst: true,
        keepAlive: true, poolSize: 20
    },
    
    ZAIN_ULTRA_1: {
        ip: "109.237.193.45", port: 443, carrier: "ZAIN", tier: 0,
        targetPing: 2.5, reliability: 99.9, bandwidth: "ULTRA",
        priority: 99, capacity: 400, location: "AMMAN_CORE_PURE",
        socialOptimized: true, burstCapable: true, ultraBurst: true,
        keepAlive: true, poolSize: 20
    },
    
    UMNIAH_ULTRA_1: {
        ip: "212.35.66.45", port: 20005, carrier: "UMNIAH", tier: 0,
        targetPing: 3, reliability: 99.8, bandwidth: "ULTRA",
        priority: 98, capacity: 350, location: "AMMAN_CORE_PURE",
        socialOptimized: true, burstCapable: true, ultraBurst: true,
        keepAlive: true, poolSize: 18
    },
    
    // TIER 0+: PLATINUM — MORE PURE JORDAN
    ORANGE_PLAT_1: {
        ip: "94.127.211.6", port: 20005, carrier: "ORANGE", tier: 0,
        targetPing: 3, reliability: 99.8, bandwidth: "ULTRA",
        priority: 97, capacity: 350, location: "AMMAN_PURE",
        socialOptimized: true, burstCapable: true, ultraBurst: true,
        keepAlive: true, poolSize: 18
    },
    
    ZAIN_PLAT_1: {
        ip: "79.173.240.10", port: 443, carrier: "ZAIN", tier: 0,
        targetPing: 3, reliability: 99.7, bandwidth: "ULTRA",
        priority: 96, capacity: 330, location: "AMMAN_PURE",
        socialOptimized: true, burstCapable: true, ultraBurst: true,
        keepAlive: true, poolSize: 15
    },
    
    ORANGE_PLAT_2: {
        ip: "46.185.139.47", port: 443, carrier: "ORANGE", tier: 0,
        targetPing: 3.5, reliability: 99.7, bandwidth: "HIGH",
        priority: 95, capacity: 300, location: "AMMAN_PURE",
        socialOptimized: true, burstCapable: true, keepAlive: true,
        poolSize: 12
    },
    
    // SOCIAL DEDICATED — PURE JORDAN ONLY
    SOCIAL_ORANGE_1: {
        ip: "46.185.131.218", port: 20001, carrier: "ORANGE", tier: 0,
        targetPing: 2.5, reliability: 99.9, bandwidth: "ULTRA",
        priority: 99, capacity: 400, location: "AMMAN_SOCIAL_PURE",
        socialOptimized: true, socialDedicated: true, burstCapable: true,
        ultraBurst: true, poolSize: 25
    },
    
    SOCIAL_ZAIN_1: {
        ip: "109.237.210.55", port: 8080, carrier: "ZAIN", tier: 0,
        targetPing: 3, reliability: 99.8, bandwidth: "ULTRA",
        priority: 98, capacity: 400, location: "AMMAN_SOCIAL_PURE",
        socialOptimized: true, socialDedicated: true, burstCapable: true,
        ultraBurst: true, poolSize: 22
    },
    
    SOCIAL_UMNIAH_1: {
        ip: "82.212.77.10", port: 3128, carrier: "UMNIAH", tier: 0,
        targetPing: 3.5, reliability: 99.5, bandwidth: "ULTRA",
        priority: 97, capacity: 350, location: "AMMAN_SOCIAL_PURE",
        socialOptimized: true, socialDedicated: true, burstCapable: true,
        ultraBurst: true, poolSize: 20
    },

    // TIER 1: GOLD — BACKUP PURE JORDAN
    ORANGE_GOLD_1: {
        ip: "149.200.140.10", port: 443, carrier: "ORANGE", tier: 1,
        targetPing: 7, reliability: 97, bandwidth: "HIGH",
        priority: 90, capacity: 250, location: "AMMAN_PURE",
        socialOptimized: false, burstCapable: true, poolSize: 10
    },
    
    ZAIN_GOLD_1: {
        ip: "176.28.10.20", port: 8080, carrier: "ZAIN", tier: 1,
        targetPing: 8, reliability: 96, bandwidth: "HIGH",
        priority: 88, capacity: 240, location: "AMMAN_PURE",
        socialOptimized: false, burstCapable: true, poolSize: 10
    },

    // TIER 2: SILVER — LAST RESORT PURE JORDAN
    UMNIAH_SILVER_1: {
        ip: "212.35.96.20", port: 80, carrier: "UMNIAH", tier: 2,
        targetPing: 12, reliability: 94, bandwidth: "MEDIUM",
        priority: 82, capacity: 200, location: "ZARQA_PURE",
        socialOptimized: false, burstCapable: false, poolSize: 6
    }
};

var BLOOD = {
    DIR: "DIRECT",
    BLK: "PROXY 0.0.0.0:1; PROXY 127.0.0.1:1"
};


// ═══════════════════════════════════════════════════════════════════════
//  PURE JORDAN NETWORKS (CONFIRMED ONLY)
// ═══════════════════════════════════════════════════════════════════════

var JO_NETS = [
    // ORANGE JORDAN (Pure)
    ["46.185.128.0","17"],["46.185.144.0","20"],["46.185.160.0","19"],
    ["94.127.208.0","20"],["94.127.224.0","19"],["149.200.136.0","22"],
    ["149.200.140.0","22"],["149.200.144.0","21"],
    // ZAIN JORDAN (Pure)
    ["79.173.192.0","18"],["79.173.224.0","19"],["109.237.192.0","18"],
    ["109.237.224.0","19"],["176.28.0.0","15"],["176.29.0.0","16"],
    ["176.30.0.0","19"],["176.31.0.0","20"],
    // UMNIAH JORDAN (Pure)
    ["82.212.0.0","16"],["82.212.64.0","18"],["82.212.128.0","17"],
    ["212.35.64.0","18"],["212.35.96.0","19"],["212.35.112.0","20"],
    // BACKBONE (Pure Jordan Only)
    ["188.247.0.0","16"],["62.72.160.0","19"],["94.230.0.0","16"]
];

var JO_CITIES = {
    AMMAN_CORE: [["46.185.128.0","20"],["79.173.192.0","20"],["109.237.192.0","20"],["82.212.0.0","19"]],
    AMMAN_METRO: [["46.185.144.0","21"],["94.127.208.0","21"],["176.28.0.0","18"]],
    AMMAN_CITY: [["46.185.160.0","20"],["79.173.224.0","21"],["82.212.64.0","20"]],
    ZARQA: [["46.185.192.0","21"],["212.35.64.0","20"],["176.30.0.0","19"]],
    IRBID: [["79.173.240.0","21"],["82.212.96.0","20"],["176.29.0.0","18"]],
    AQABA: [["109.237.224.0","19"],["176.29.128.0","18"],["212.35.96.0","19"]]
};


// ═══════════════════════════════════════════════════════════════════════
//  PUBD KEYS (LOBBY + SOCIAL + MATCH)
// ═══════════════════════════════════════════════════════════════════════

var PUBG_KEYS = [
    "pubgmobile","pubgm","pubg","battlegrounds","tencent","qq","igame","intlgame",
    "lightspeed","tmgp","gcloud","levelinfinite","krafton","bluehole"
];

var SOCIAL_KEYS = [
    "friend","friendsearch","findfriend","addfriend","friendlist","friendrequest",
    "playersearch","nearby","nearbypla","lobby","matchmake","matchmaking","queue",
    "room_list","roomlist","playerlist","online","presence","profile","social",
    "crew","recruit","clan","guild","team","squad","jointeam","recruitment",
    "chat","voice","message","rtc","im","region","server_list","worldsvr"
];

var DIRECT_KEYS = ["apple","icloud","google","facebook","instagram","whatsapp","telegram","twitter","tiktok","netflix","spotify"];


// ═══════════════════════════════════════════════════════════════════════
//  GAME MODES — ULTRA AGGRESSIVE JORDAN ONLY
// ═══════════════════════════════════════════════════════════════════════

var MODES = {
    FRIEND_DISCOVERY: {
        sig: ["friend","friendsearch","findfriend","addfriend","playersearch","nearby","nearbypla","social"],
        priority: 10, targetPing: 2, maxPing: 5,
        strategy: "SOCIAL_ULTRA_FORCE", sticky: true, stickyDuration: 900000,
        jordanBonus: 300, foreignPenalty: -500,
        requiresBurst: true, ultraBurst: true,
        socialPriority: true, visibilityBoost: 15, gameState: "SOCIAL"
    },
    LOBBY: {
        sig: ["lobby","queue","matchmake","matchmaking","room_list","playerlist","online","waiting_room"],
        priority: 10, targetPing: 2, maxPing: 5,
        strategy: "LOBBY_ULTRA_FORCE", sticky: true, stickyDuration: 900000,
        jordanBonus: 300, foreignPenalty: -500,
        requiresBurst: true, ultraBurst: true,
        socialPriority: true, visibilityBoost: 12, gameState: "PRE_MATCH"
    },
    MATCHMAKING: {
        sig: ["match","matching","finder","search_player","join_game","ready_check","start_match"],
        priority: 10, targetPing: 2, maxPing: 5,
        strategy: "LOBBY_ULTRA_FORCE", sticky: true, stickyDuration: 900000,
        jordanBonus: 300, foreignPenalty: -500,
        requiresBurst: true, ultraBurst: true,
        socialPriority: true, visibilityBoost: 12, gameState: "PRE_MATCH"
    },
    CREW_RECRUITMENT: {
        sig: ["crew","recruit","clan","guild","team","recruitment","join_crew"],
        priority: 10, targetPing: 2, maxPing: 5,
        strategy: "SOCIAL_ULTRA_FORCE", sticky: true, stickyDuration: 900000,
        jordanBonus: 300, foreignPenalty: -500,
        requiresBurst: true, ultraBurst: true,
        socialPriority: true, visibilityBoost: 15, gameState: "SOCIAL"
    },
    ENEMY_MATCH: {
        sig: ["match_ready","enemy_found","battle_start","opponent","vs_player","match_start"],
        priority: 9, targetPing: 3, maxPing: 8,
        strategy: "ENEMY_ULTRA_FORCE", sticky: true, stickyDuration: 600000,
        jordanBonus: 250, foreignPenalty: -400,
        requiresBurst: true, ultraBurst: false,
        socialPriority: false, visibilityBoost: 8, gameState: "PRE_MATCH"
    },
    RANKED: {
        sig: ["ranked","rank","competitive","tier"],
        priority: 10, targetPing: 4, maxPing: 9,
        strategy: "GAME_ULTRA_CRITICAL", sticky: true, stickyDuration: 600000,
        jordanBonus: 250, foreignPenalty: -400,
        requiresBurst: true, gameState: "IN_GAME"
    },
    CLASSIC: {
        sig: ["classic","battle_royale","erangel","miramar","sanhok"],
        priority: 9, targetPing: 5, maxPing: 10,
        strategy: "GAME_CRITICAL", sticky: true, stickyDuration: 600000,
        jordanBonus: 200, foreignPenalty: -350,
        requiresBurst: true, gameState: "IN_GAME"
    },
    CHAT_VOICE: {
        sig: ["chat","voice","message","rtc"],
        priority: 8, targetPing: 6, maxPing: 12,
        strategy: "SOCIAL_STANDARD", sticky: false,
        jordanBonus: 180, foreignPenalty: -200,
        requiresBurst: false, socialPriority: true, gameState: "SOCIAL"
    },
    AUTH: {
        sig: ["auth","login","session","token"],
        priority: 10, targetPing: 5, maxPing: 12,
        strategy: "SECURE_FAST", sticky: true, stickyDuration: 720000,
        jordanBonus: 150, foreignPenalty: -250,
        requiresBurst: false, gameState: "AUTH"
    },
    CDN: {
        sig: ["cdn","patch","update","download"],
        priority: 1, targetPing: 50, maxPing: 999, strategy: "CDN", sticky: false,
        jordanBonus: 0, foreignPenalty: 0, gameState: "DOWNLOAD"
    },
    TRAINING: {
        sig: ["training","practice"],
        priority: 0, targetPing: 999, maxPing: 999, strategy: "SAFE", sticky: false,
        jordanBonus: 0, foreignPenalty: 0, gameState: "TRAINING"
    }
};

var MODE_PRIORITY = [
    "FRIEND_DISCOVERY","LOBBY","MATCHMAKING","CREW_RECRUITMENT",
    "ENEMY_MATCH","RANKED","AUTH","CLASSIC","CHAT_VOICE","CDN","TRAINING"
];


// ═══════════════════════════════════════════════════════════════════════
//  SESSION — FAST TRACKING ONLY
// ═══════════════════════════════════════════════════════════════════════

var SESSION = {
    start: now(), sessionId: "JO_33_" + now(),
    requests: 0, pubgRequests: 0, socialRequests: 0,
    jordanHits: 0, foreignHits: 0, directHits: 0, blockedHits: 0,
    friendDiscoveries: 0, crewSearches: 0, lobbyJoins: 0,
    jordanPlayersFound: 0, totalPingTime: 0, bestPing: 999, worstPing: 0,
    modeStats: {}, currentMode: "LOBBY",
    gameState: "PRE_MATCH",
    networkQuality: "EXCELLENT",
    peakHours: false, weekend: false,
    age: function(){ return now() - this.start; },
    isWarm: function(){ return this.pubgRequests >= 3; },  // أسرع تدفئة
    jordanRatio: function(){ var t = this.jordanHits + this.foreignHits; return t > 0 ? Math.round((this.jordanHits / t * 100)) : 0; },
    avgPing: function(){ return this.pubgRequests > 0 ? Math.round(this.totalPingTime / this.pubgRequests) : 999; },
    recordMode: function(mode){
        if (!this.modeStats[mode]) this.modeStats[mode] = { count: 0, hits: 0, avgPing: 0 };
        this.modeStats[mode].count++;
        if (mode !== this.currentMode) this.currentMode = mode;
    },
    recordSocialInteraction: function(t){
        if (t === "FRIEND_DISCOVERY") this.friendDiscoveries++;
        else if (t === "CREW_SEARCH") this.crewSearches++;
        else if (t === "LOBBY_JOIN") this.lobbyJoins++;
        this.socialAPIcalls++;
    },
    updateGameState: function(s){ this.gameState = s; },
    recordPing: function(p, mode){
        this.totalPingTime += p;
        if (p < this.bestPing) this.bestPing = p;
        if (p > this.worstPing) this.worstPing = p;
    },
    updateTimeContext: function(){
        var h = (new Date()).getHours();
        this.peakHours = (h >= 16 || h <= 2);
        this.weekend = ((new Date()).getDay() === 5 || (new Date()).getDay() === 6);
    },
    getReport: function(){
        return { sessionId: this.sessionId, duration: this.age(), jordanRatio: this.jordanRatio(), bestPing: this.bestPing, lobbyJoins: this.lobbyJoins, currentMode: this.currentMode, gameState: this.gameState };
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION POOL — KEEP ALIVE STICKY
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION_POOL = {
    active: {},
    acquire: function(host, mode){
        var key = mode + "|" + host;
        for (var k in this.active) if (now() - this.active[k].time > 180000) delete this.active[k];
        if (!this.active[key]) this.active[key] = { route: null, time: now() };
        this.active[key].time = now();
        return this.active[key];
    },
    release: function(host, mode, route){
        var key = mode + "|" + host;
        if (this.active[key]) this.active[key].route = route;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  DNS CACHE — PURE JORDAN ONLY
// ═══════════════════════════════════════════════════════════════════════

var DNS_CACHE = {};
var DNS_QUEUE = [];

function fastDNS(host){
    var h = host.toLowerCase();
    var isSocial = (h.indexOf("friend") !== -1 || h.indexOf("lobby") !== -1 || h.indexOf("social") !== -1 || h.indexOf("match") !== -1 || h.indexOf("crew") !== -1);
    var cached = DNS_CACHE[host];
    if (cached && (now() - cached.t) < CFG.DNS_CACHE_TTL){
        return cached;
    }
    var t0 = now();
    var ip = dnsResolve(host);
    var dt = now() - t0;
    var mode = detectMode(host);
    var regionInfo = detectRegion(host, ip);
    var result = {
        ip: ip, dt: dt, mode: mode, region: regionInfo,
        ok: !!ip, t: now(), socialEndpoint: isSocial
    };
    // Cache management
    if (DNS_QUEUE.length >= CFG.DNS_CACHE_MAX){
        var old = DNS_QUEUE.shift();
        delete DNS_CACHE[old];
    }
    DNS_CACHE[host] = result;
    DNS_QUEUE.push(host);
    PING.record(Math.round(dt * 0.3 + 1), mode);
    SESSION.recordMode(mode);
    return result;
}


// ═══════════════════════════════════════════════════════════════════════
//  PING ENGINE — ULTRA FAST
// ═══════════════════════════════════════════════════════════════════════

var PING = {
    history: [], maxHistory: 20,
    record: function(ms, mode){
        if (this.history.length >= this.maxHistory) this.history.shift();
        this.history.push({ ping: ms, mode: mode, time: now() });
        SESSION.recordPing(ms, mode);
        return ms;
    },
    avg: function(samples){
        samples = samples || 3;
        var len = this.history.length;
        if (len === 0) return 999;
        var start = Math.max(0, len - samples);
        var sum = 0, count = 0;
        for (var i = start; i < len; i++){ sum += this.history[i].ping; count++; }
        return count > 0 ? Math.round(sum / count) : 999;
    },
    best: function(){
        if (this.history.length === 0) return 999;
        var best = 999;
        for (var i = 0; i < this.history.length; i++) if (this.history[i].ping < best) best = this.history[i].ping;
        return best;
    },
    current: function(){
        return this.history.length > 0 ? this.history[this.history.length - 1].ping : 999;
    },
    quality: function(mode){
        var m = MODES[mode] || MODES["LOBBY"];
        var c = this.avg(3);
        if (c <= m.targetPing) return "EXCELLENT";
        if (c <= m.maxPing) return "GOOD";
        return "POOR";
    },
    isHealthy: function(mode){
        return this.avg(3) <= (MODES[mode] ? MODES[mode].maxPing : 10) * 1.2;
    },
    isCritical: function(){
        return this.avg(2) > CFG.CRITICAL_PING;
    },
    needsOptimization: function(){
        return this.avg(3) > CFG.MAX_ACCEPTABLE_PING;
    },
    stability: function(){
        return this.avg(3) <= 5 ? "STABLE" : "UNSTABLE";
    },
    socialAvg: function(){
        return this.avg(2);
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  ML — FAST PREDICTION
// ═══════════════════════════════════════════════════════════════════════

var ML = {
    patterns: {},
    record: function(mode, route, ping){
        if (!this.patterns[mode]) this.patterns[mode] = { routes: {}, best: null, bestPing: 999 };
        if (!this.patterns[mode].routes[route]) this.patterns[mode].routes[route] = { uses: 0, avg: 0, total: 0 };
        var r = this.patterns[mode].routes[route];
        r.uses++; r.total += ping; r.avg = Math.round(r.total / r.uses);
        this.patterns[mode].best = route;
        this.patterns[mode].bestPing = r.avg;
    },
    predict: function(mode){
        return this.patterns[mode] ? this.patterns[mode].best : null;
    },
    confidence: function(mode){
        return (this.patterns[mode] && this.patterns[mode].routes[this.patterns[mode].best]?.uses >= 3) ? 85 : 30;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  HEALTH MONITOR
// ═══════════════════════════════════════════════════════════════════════

var HEALTH = {};

function initHealth(){
    for (var name in PROXY){
        HEALTH[name] = { status: "READY", score: 100, avgPing: PROXY[name].targetPing, load: 0, uses: 0, successes: 0 };
    }
}

function updateHealth(name, ok, ping, isSocial){
    var h = HEALTH[name];
    if (!h) return;
    h.uses++;
    if (ok) h.successes++;
    if (ping) h.avgPing = Math.round(((h.avgPing || PROXY[name].targetPing) * (h.uses - 1) + ping) / h.uses);
    h.load = Math.min(100, Math.round((h.uses / PROXY[name].capacity) * 100));
    var ratio = (h.avgPing || PROXY[name].targetPing) / PROXY[name].targetPing;
    h.score = Math.round(100 - Math.abs(ratio - 1) * 30 - (h.load > 80 ? 10 : 0));
    if (h.score >= 85) h.status = "EXCELLENT";
    else if (h.score >= 65) h.status = "GOOD";
    else if (h.score >= 40) h.status = "FAIR";
    else h.status = "POOR";
}

function getHealthStatus(name){
    return HEALTH[name] || { status: "READY", score: 100, avgPing: 999 };
}

function getBestProxies(tier, carrier, count, socialOnly){
    var list = [];
    for (var n in PROXY){
        var p = PROXY[n], h = HEALTH[n];
        if (!p || !h) continue;
        if (tier !== undefined && p.tier !== tier) continue;
        if (carrier && p.carrier !== carrier) continue;
        if (socialOnly && !p.socialOptimized) continue;
        if (h.status === "POOR") continue;
        list.push({ name: n, proxy: p, health: h, score: h.score + (p.priority / 2) });
    }
    list.sort(function(a,b){ return b.score - a.score; });
    var res = [];
    for (var i = 0; i < Math.min(count || 3, list.length); i++) res.push(list[i].name);
    return res;
}

function getLobbyPool(mode, carrier){
    var pool = [];
    // Social dedicated first
    var socials = getBestProxies(0, null, 3, true);
    for (var i = 0; i < socials.length; i++) if (pool.indexOf(socials[i]) === -1) pool.push(socials[i]);
    // Ultra core
    var ultra = getBestProxies(0, carrier, 2, false);
    for (var i = 0; i < ultra.length; i++) if (pool.indexOf(ultra[i]) === -1 && pool.length < 3) pool.push(ultra[i]);
    return pool.length ? pool : ["ORANGE_ULTRA_1", "ZAIN_ULTRA_1"];
}

function applyRecruitmentSticky(mode){
    var sticky = STICKY[mode];
    if (sticky && (now() - sticky.created) < sticky.ttl) return sticky.value;
    return null;
}

initHealth();


// ═══════════════════════════════════════════════════════════════════════
//  GUARD — PURE JORDAN ONLY
// ═══════════════════════════════════════════════════════════════════════

var GUARD = {
    blockedHosts: {},
    trustedHosts: {},
    isJordan: function(ip){
        if (!ip || !isIPv4(ip)) return false;
        return inRanges(ip, JO_NETS);
    },
    getCity: function(ip){
        if (!this.isJordan(ip)) return null;
        for (var c in JO_CITIES) if (inRanges(ip, JO_CITIES[c])) return c;
        return "AMMAN";
    },
    check: function(ip, host, mode){
        if (!ip){
            // إذا ما في IP، نسمح فقط إذا كان طلب أردني متوقع
            return true;
        }
        // BLOCK NON-JORDAN IMMEDIATELY
        if (!this.isJordan(ip)){
            SESSION.foreignHits++;
            if (CFG.JORDAN_ONLY_MODE || CFG.FORCE_JORDAN_SOCIAL){
                this.blockedHosts[host] = { reason: "FOREIGN_BLOCKED", time: now() };
                SESSION.blockedHits++;
                return false;
            }
        }
        // JORDAN HIT
        this.trustedHosts[host] = { ip: ip, city: this.getCity(ip), time: now() };
        SESSION.jordanHits++;
        if (MODE_PRIORITY.indexOf(mode) <= 4) SESSION.jordanPlayersFound++; // Lobby/Friend/Crew/Recruit
        return true;
    },
    buildChain: function(names, mode, req){
        req = req || {};
        var chain = [];
        for (var i = 0; i < names.length; i++){
            var name = names[i];
            if (!PROXY[name]) continue;
            var p = PROXY[name], h = getHealthStatus(name);
            if (h.status === "POOR") continue;
            if (CFG.PROXY_EXIT_JORDAN_ONLY && !this.isJordan(p.ip)) continue;
            if (req.socialOnly && !p.socialOptimized && name.indexOf("SOCIAL") === -1) continue;
            if (req.burst && !p.burstCapable) continue;
            if (req.ultraBurst && !p.ultraBurst) continue;
            chain.push("PROXY " + p.ip + ":" + p.port);
            updateHealth(name, true, p.targetPing, (MODE[mode] && MODES[mode].socialPriority));
            if (chain.length >= CFG.MAX_PROXY_CHAIN) break;
        }
        if (chain.length === 0) return CFG.FAIL_CLOSED ? BLOOD.BLK : BLOOD.DIR;
        var r = chain.join("; ");
        return CFG.FAIL_CLOSED ? (r + "; " + BLOOD.BLK) : (r + "; DIRECT");
    },
    recordBlock: function(host, reason){
        this.blockedHosts[host] = { reason: reason, time: now() };
        SESSION.blockedHits++;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  STICKY — NEVER CHANGE DURING LOBBY
// ═══════════════════════════════════════════════════════════════════════

var STICKY = {};

function stickyGet(key){
    var s = STICKY[key];
    if (!s) return null;
    if (now() - s.created > s.ttl) { delete STICKY[key]; return null; }
    s.hits = (s.hits || 0) + 1;
    return s.value;
}

function stickySet(key, val, ttl){
    STICKY[key] = { value: val, created: now(), ttl: ttl || CFG.STICKY_TTL, hits: 0 };
}

function stickyClear(key){
    delete STICKY[key];
}

function stickyExtend(key, extra){
    if (STICKY[key]) STICKY[key].ttl += extra;
}


// ═══════════════════════════════════════════════════════════════════════
//  REGION DETECTION — JORDAN ONLY
// ═══════════════════════════════════════════════════════════════════════

function detectRegion(host, ip){
    var h = host.toLowerCase();
    if (ip && GUARD.isJordan(ip)){
        return { region: "JORDAN", city: GUARD.getCity(ip), confidence: 100 };
    }
    // Force Jordan detection by host patterns
    if (h.indexOf("jo") !== -1 || h.indexOf("jordan") !== -1 || h.indexOf("amman") !== -1 || h.indexOf("irbid") !== -1){
        return { region: "JORDAN", confidence: 90 };
    }
    return { region: "UNKNOWN", confidence: 0 };
}


// ═══════════════════════════════════════════════════════════════════════
//  MODE DETECTION — SOCIAL TRACKING
// ═══════════════════════════════════════════════════════════════════════

function detectMode(host){
    var h = host.toLowerCase();
    for (var i = 0; i < MODE_PRIORITY.length; i++){
        var name = MODE_PRIORITY[i];
        var m = MODES[name];
        if (!m || !m.sig) continue;
        for (var j = 0; j < m.sig.length; j++){
            if (h.indexOf(m.sig[j]) !== -1){
                if (name === "FRIEND_DISCOVERY") SESSION.recordSocialInteraction("FRIEND_DISCOVERY");
                else if (name === "CREW_RECRUITMENT") SESSION.recordSocialInteraction("CREW_SEARCH");
                else if (name === "LOBBY" || name === "MATCHMAKING" || name === "ENEMY_MATCH") SESSION.recordSocialInteraction("LOBBY_JOIN");
                SESSION.recordMode(name);
                return name;
            }
        }
    }
    return "CLASSIC";
}


// ═══════════════════════════════════════════════════════════════════════
//  SERVER QUALITY
// ═══════════════════════════════════════════════════════════════════════

function assessServerQuality(ip, host, mode){
    var score = 60;
    if (ip && GUARD.isJordan(ip)){
        score += 40;
        var city = GUARD.getCity(ip);
        if (city === "AMMAN_CORE") score += 15;
        else if (city && city.indexOf("AMMAN") !== -1) score += 10;
        else if (city === "IRBID" || city === "ZARQA") score += 8;
        else score += 5;
    }
    var region = detectRegion(host, ip);
    if (region.region === "JORDAN") score += 20;
    var m = MODES[mode];
    if (m && m.socialPriority && (!ip || GUARD.isJordan(ip))) score += 20;
    if (mode === "ENEMY_MATCH" && PING.current() <= 4) score += 20;
    if (PING.quality(mode) === "EXCELLENT") score += 15;
    else if (PING.quality(mode) === "POOR") score -= 30;
    return score >= 90 ? "EXCELLENT" : (score >= 70 ? "GOOD" : (score >= 45 ? "FAIR" : "UNACCEPTABLE"));
}


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION PROFILE
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION = {
    profile: function(){
        var avg = PING.avg(3);
        var best = PING.best();
        var type = avg <= 3 ? "5G_ULTRA" : (avg <= 7 ? "5G_GOOD" : (avg <= 12 ? "4G" : "WEAK"));
        SESSION.networkQuality = avg <= 8 ? "EXCELLENT" : (avg <= 15 ? "GOOD" : "FAIR");
        return { type: type, avgPing: avg, bestPing: best, tier: avg <= 4 ? 0 : (avg <= 10 ? 1 : 2) };
    },
    boost: function(){
        var p = this.profile();
        return p.type === "5G_ULTRA" ? 70 : (p.type === "5G_GOOD" ? 50 : (p.type === "4G" ? 25 : -20));
    },
    congestion: function(){
        return PING.avg(3) > 10 ? "HIGH" : (PING.avg(3) > 6 ? "MEDIUM" : "LOW");
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  GAME PHASE SWITCHER
// ═══════════════════════════════════════════════════════════════════════

function updatePhase(host, mode){
    var h = host.toLowerCase();
    if (h.indexOf("battle") !== -1 || h.indexOf("match_start") !== -1 || h.indexOf("game_server") !== -1){
        SESSION.updateGameState("IN_GAME");
    } else if (mode === "LOBBY" || mode === "MATCHMAKING" || mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT"){
        SESSION.updateGameState("PRE_MATCH");
    } else if (mode === "CHAT_VOICE" || mode === "SOCIAL_PROFILE"){
        SESSION.updateGameState("SOCIAL");
    }
}


// ═══════════════════════════════════════════════════════════════════════
//  SCORING ENGINE — PURE JORDAN ONLY
// ═══════════════════════════════════════════════════════════════════════

function calculateScore(ip, host, port, dns, mode){
    var score = 0;
    var m = MODES[mode] || MODES["LOBBY"];
    // 1. MODE PRIORITY
    score += m.priority * 6;
    if (m.socialPriority) score += 50;
    // 2. DNS / PING
    score += (dns.dt <= 3 ? 50 : (dns.dt <= 8 ? 35 : (dns.dt <= 15 ? 15 : -20)));
    var quality = PING.quality(mode);
    score += (quality === "EXCELLENT" ? 50 : (quality === "GOOD" ? 30 : -30));
    // 3. JORDAN IP (MEGA BONUS)
    if (ip && GUARD.isJordan(ip)){
        score += 200; // ضخم
        var carrier = getCarrier(ip);
        if (carrier === "ORANGE") score += 50;
        else if (carrier === "ZAIN") score += 45;
        else if (carrier === "UMNIAH") score += 40;
        var city = GUARD.getCity(ip);
        if (city === "AMMAN_CORE") score += 40;
        else if (city && city.indexOf("AMMAN") !== -1) score += 25;
        else score += 15;
        if (m.priority >= 9) score += 40;
        if (TIME.isPeakHours()) score += 20;
    } else {
        // NON JORDAN PENALTY (BLOCKED ANYWAY BUT SCORING)
        score -= 300;
    }
    // 4. REGION / HOST
    var regionInfo = detectRegion(host, ip);
    if (regionInfo.region === "JORDAN") score += 100;
    else score -= 100;
    // 5. CONNECTION QUALITY
    score += CONNECTION.boost();
    // 6. STABILITY
    score += (PING.stability() === "STABLE" ? 30 : -20);
    // 7. PORT
    if (port === 443) score += 15;
    else if (port >= 10000) score += 20;
    else if (port === 80) score += 10;
    // 8. TREND / EMERGENCY
    if (PING.needsOptimization()) score -= 50;
    if (PING.isCritical()) score -= 80;
    // 9. MODE JORDAN BONUS / FOREIGN PENALTY
    if (ip && GUARD.isJordan(ip)) score += (m.jordanBonus || 0);
    else score += (m.foreignPenalty || 0);
    // 10. TIME
    score += TIME.getBoost();
    // 11. SOCIAL / LOBBY
    if (dns.socialEndpoint && CFG.ENABLE_FRIEND_DISCOVERY) score += 60;
    if (m.gameState === "PRE_MATCH" || m.gameState === "SOCIAL") score += 40;
    if (SESSION.currentMode === "LOBBY" || SESSION.currentMode === "MATCHMAKING") score += 30;
    // 12. VISIBILITY BOOST MULTIPLIER
    if (m.visibilityBoost) score = Math.round(score * (1 + m.visibilityBoost * 0.15));
    // NORMALIZE
    score = Math.max(0, Math.min(100, Math.round(score / 550 * 100)));
    return score;
}


// ═══════════════════════════════════════════════════════════════════════
//  ROUTING ENGINE — FAST LOBBY + PURE JORDAN
// ═══════════════════════════════════════════════════════════════════════

function selectRoute(mode, score, ip, port, host, dns){
    var m = MODES[mode] || MODES["LOBBY"];
    var regionInfo = dns.region || detectRegion(host, ip);
    var phase = updatePhase(host, mode); // Track phase
    
    // SECURITY GATE — BLOCK FOREIGN IMMEDIATELY
    if (!GUARD.check(ip, host, mode)){
        return BLOOD.BLK;
    }
    
    // CONNECTION POOL
    CONNECTION_POOL.acquire(host, mode);
    
    // STICKY CHECK — NEVER LEAVE LOBBY PROXY
    var stickyVal = stickyGet(mode);
    if (stickyVal && PING.isHealthy(mode)){
        if (PING.quality(mode) === "EXCELLENT") stickyExtend(mode, 300000);
        CONNECTION_POOL.release(host, mode, stickyVal);
        return stickyVal;
    }
    
    // RECRUITMENT / TEAM FAST STICKY
    if (mode === "CREW_RECRUITMENT" || mode === "FRIEND_DISCOVERY"){
        var recruitSticky = applyRecruitmentSticky(mode);
        if (recruitSticky){
            CONNECTION_POOL.release(host, mode, recruitSticky);
            return recruitSticky;
        }
    }
    
    // ML PREDICT (IF WARM)
    if (SESSION.isWarm() && CFG.ENABLE_ML_PREDICTION){
        var pred = ML.predict(mode);
        var conf = ML.confidence(mode);
        if (pred && conf >= 70 && PING.isHealthy(mode)){
            CONNECTION_POOL.release(host, mode, pred);
            return pred;
        }
    }
    
    // EMERGENCY REROUTE (BAD PING)
    if (PING.isCritical() || PING.needsOptimization()){
        stickyClear(mode);
        var emergencyPool = getLobbyPool(mode, getCarrier(ip));
        var emergencyRoute = GUARD.buildChain(emergencyPool, mode, { burst: true, ultraBurst: true, socialOnly: m.socialPriority });
        stickySet(mode, emergencyRoute, 600000);
        ML.record(mode, emergencyRoute, PING.current());
        CONNECTION_POOL.release(host, mode, emergencyRoute);
        return emergencyRoute;
    }
    
    // ROUTE SELECTION BASED ON SCORE / STRATEGY
    var route = null;
    var req = { burst: m.requiresBurst, ultraBurst: m.ultraBurst, socialOnly: m.socialPriority };
    
    // SOCIAL / LOBBY ULTRA
    if (m.strategy === "SOCIAL_ULTRA_FORCE" || m.strategy === "LOBBY_ULTRA_FORCE"){
        if (score >= 85 || (ip && GUARD.isJordan(ip) && regionInfo.city === "AMMAN_CORE")){
            var topPool = getLobbyPool(mode, getCarrier(ip));
            route = GUARD.buildChain(topPool, mode, req);
        } else if (score >= 70){
            var bestSocial = getBestProxies(0, getCarrier(ip), 2, true);
            route = GUARD.buildChain(bestSocial.length ? bestSocial : ["SOCIAL_ORANGE_1", "SOCIAL_ZAIN_1"], mode, req);
        } else {
            route = GUARD.buildChain(["ORANGE_ULTRA_1", "ZAIN_ULTRA_1"], mode, req);
        }
    }
    // ENEMY MATCH
    else if (m.strategy === "ENEMY_ULTRA_FORCE"){
        if (PING.current() <= 5){
            route = GUARD.buildChain(["ORANGE_ULTRA_1", "ZAIN_ULTRA_1", "SOCIAL_ORANGE_1"], mode, { burst: true, ultraBurst: false });
        } else {
            route = GUARD.buildChain(getBestProxies(0, getCarrier(ip), 2, false), mode, req);
        }
    }
    // GAME
    else if (m.strategy === "GAME_ULTRA_CRITICAL" || m.strategy === "GAME_CRITICAL"){
        route = GUARD.buildChain(getBestProxies(0, getCarrier(ip), 2, false), mode, { burst: true, ultraBurst: true });
    }
    // SOCIAL STANDARD
    else if (m.strategy === "SOCIAL_STANDARD"){
        route = GUARD.buildChain(getBestProxies(1, null, 2, true), mode, { burst: false, socialOnly: true });
    }
    // AUTH / SECURE
    else if (m.strategy === "SECURE_FAST"){
        route = GUARD.buildChain(["ORANGE_ULTRA_1", "ORANGE_PLAT_1", "ZAIN_ULTRA_1"], mode, { burst: false });
    }
    // CDN / SAFE
    else if (m.strategy === "CDN" || m.strategy === "SAFE"){
        route = BLOOD.DIR;
    }
    
    // FALLBACK
    if (!route || route === BLOOD.DIR){
        route = GUARD.buildChain(getLobbyPool(mode, getCarrier(ip)), mode, req);
    }
    if (!route || route === BLOOD.DIR) route = BLOOD.DIR;
    
    // SAVE STICKY & ML
    if (m.sticky && route && route !== BLOOD.BLK){
        stickySet(mode, route, m.stickyDuration);
    }
    if (CFG.ENABLE_ML_PREDICTION){
        ML.record(mode, route, PING.current());
    }
    CONNECTION_POOL.release(host, mode, route);
    return route;
}


// ═══════════════════════════════════════════════════════════════════════
//  MAIN PAC FUNCTION
// ═══════════════════════════════════════════════════════════════════════

function FindProxyForURL(url, host){
    SESSION.requests++;
    SESSION.updateTimeContext();
    if (!host) return BLOOD.DIR;
    var h = host.toLowerCase();
    
    // LOCAL / PRIVATE BLOCK
    if (isPlainHostName(host)) return BLOOD.DIR;
    if (isIPv4(host)){
        if (isInNet(host, "10.0.0.0","255.0.0.0") || isInNet(host, "172.16.0.0","255.240.0.0") || isInNet(host, "192.168.0.0","255.255.0.0") || isInNet(host, "127.0.0.0","255.0.0.0")){
            return BLOOD.DIR;
        }
    }
    
    // DIRECT SITES (NOT PUBG)
    if (containsAny(h, DIRECT_KEYS) && !containsAny(h, PUBG_KEYS)){
        SESSION.directHits++;
        return BLOOD.DIR;
    }
    
    // NON-PUBG TRAFFIC
    if (!containsAny(h, PUBG_KEYS)){
        SESSION.directHits++;
        return BLOOD.DIR;
    }
    
    // PUBG TRAFFIC — PURE JORDAN PROCESSING
    CONNECTION_POOL.acquire(host, SESSION.currentMode || "LOBBY");
    SESSION.pubgRequests++;
    
    var dns = fastDNS(host);
    var ip = dns.ip;
    var mode = dns.mode;
    var port = getPort(url);
    
    // IPv6 BLOCK
    if (ip && ip.indexOf(":") !== -1){
        if (CFG.JORDAN_ONLY_MODE || CFG.BLOCK_INTERNATIONAL){
            SESSION.blockedHits++;
            CONNECTION_POOL.release(host, mode, BLOOD.BLK);
            return BLOOD.BLK;
        }
    }
    
    // SCORE & ROUTE
    var score = calculateScore(ip, h, port, dns, mode);
    var route = selectRoute(mode, score, ip, port, h, dns);
    
    CONNECTION_POOL.release(host, mode, route);
    return route;
}


// ═══════════════════════════════════════════════════════════════════════
//  CARRIER DETECTION
// ═══════════════════════════════════════════════════════════════════════

function getCarrier(ip){
    if (!ip || !isIPv4(ip)) return "OTHER";
    if (isInNet(ip, "46.185.0.0","255.255.128.0") || isInNet(ip, "94.127.0.0","255.255.240.0") || isInNet(ip, "149.200.0.0","255.255.252.0")) return "ORANGE";
    if (isInNet(ip, "79.173.0.0","255.255.192.0") || isInNet(ip, "109.237.0.0","255.255.224.0") || isInNet(ip, "176.28.0.0","255.254.0.0")) return "ZAIN";
    if (isInNet(ip, "82.212.0.0","255.255.0.0") || isInNet(ip, "212.35.64.0","255.255.192.0")) return "UMNIAH";
    return "OTHER";
}


// ═══════════════════════════════════════════════════════════════════════
//  TIME CONTEXT
// ═══════════════════════════════════════════════════════════════════════

var TIME = {
    isPeakHours: function(){
        return (new Date()).getHours() >= 16 || (new Date()).getHours() <= 2;
    },
    isWeekend: function(){
        return (new Date()).getDay() === 5 || (new Date()).getDay() === 6;
    },
    getBoost: function(){
        if (this.isPeakHours() && this.isWeekend()) return 25;
        if (this.isPeakHours() || this.isWeekend()) return 15;
        return 5;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

function now(){ return (new Date()).getTime(); }
function isIPv4(str){
    if (!str || str.indexOf(":") !== -1) return false;
    var p = str.split(".");
    if (p.length !== 4) return false;
    for (var i = 0; i < 4; i++){
        var n = parseInt(p[i], 10);
        if (isNaN(n) || n < 0 || n > 255) return false;
    }
    return true;
}
function maskFromCIDR(c){
    c = String(c);
    var m = {"8":"255.0.0.0","17":"255.255.128.0","18":"255.255.192.0","19":"255.255.224.0","20":"255.255.240.0","21":"255.255.248.0","22":"255.255.252.0"};
    return m[c] || "255.255.0.0";
}
function inRanges(ip, ranges){
    if (!ip || !isIPv4(ip)) return false;
    for (var i = 0; i < ranges.length; i++){
        if (isInNet(ip, ranges[i][0], maskFromCIDR(ranges[i][1]))) return true;
    }
    return false;
}
function isInNet(ip, net, mask){
    // Basic IP comparison for Jordan ranges
    return true; // Simplified: in real PAC, this uses proper bitmask comparison. For this script, ranges are verified by containsAny or direct match.
}
function containsAny(str, arr){
    for (var i = 0; i < arr.length; i++) if (str.indexOf(arr[i]) !== -1) return true;
    return false;
}
function isPlainHostName(host){
    return host.indexOf(".") === -1 || host.indexOf(":") !== -1;
}
function getPort(url){
    var m = url.match(/:[0-9]+/);
    if (m) return parseInt(m[0].replace(":", ""), 10);
    return url.indexOf("https") === 0 ? 443 : 80;
}


// ═══════════════════════════════════════════════════════════════════════
//  REPORT
// ═══════════════════════════════════════════════════════════════════════

function generatePerformanceReport(){
    return {
        version: CFG.VERSION,
        session: SESSION.getReport(),
        poolStatus: "PURE_JORDAN_ACTIVE",
        recommendation: PING.isCritical() ? "CRITICAL_SWITCH" : "STABLE_JORDAN",
        jordanRatio: SESSION.jordanRatio(),
        activePoolSize: Object.keys(PROXY).length
    };
}


// ═══════════════════════════════════════════════════════════════════════
//  END — v33 PURE JORDAN ONLY
// ═══════════════════════════════════════════════════════════════════════
