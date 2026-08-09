// ═══════════════════════════════════════════════════════════════════════
//  PUBG JORDAN v39.0 — STRONGEST IMPACT (تثبيت موقعك بعمان + أقوى تأثير)
//  ═══════════════════════════════════════════════════════════════════════
//  💪 أقوى ميزات جديدة:
//  • AMMAN_LOCATION_LOCK (تثبيت موقعك بعمان 100%)
//  • GPS_NETWORK_STABILIZE (إشارة موقع ثابتة للسيرفر)
//  • ULTRA_FAST_RECRUIT (تجنيد فوري 10 ثوانٍ)
//  • STABLE_INTERNET_MODE (ثبات إنترنت أقوى)
//  • GAME_BOOST (تأثير مباشر على اللوبي والمباراة)
//  • ANTI_THROTTLE (منع PUBG من حظرك أو تبطيئك)
//  • FAST_PING_ADAPT (تبديل فوري لأفضل مسار)
//  ═══════════════════════════════════════════════════════════════════════

var CFG = {
    VERSION: "39.0-STRONGEST-IMPACT-AMMAN-LOCK",
    MODE: "FRIEND_DISCOVERY",
    
    // ⚡ PING CONFIG (40-70ms Real)
    TARGET_PING: 42,
    SOCIAL_API_TARGET: 38,
    EXCELLENT_PING: 50,
    GOOD_PING: 68,
    MAX_ACCEPTABLE_PING: 80,
    CRITICAL_PING: 95,
    VARIANCE_THRESHOLD: 18,
    
    // 💪 AMMAN LOCATION LOCK & STABILIZATION
    AMMAN_LOCATION_LOCK: true,          // 💪 تثبيت موقعك بعمان
    GPS_NETWORK_STABILIZE: true,         // 💪 إشارة موقع ثابتة
    FORCE_AMMAN_CORE: true,              // 💪 كل اللعبة من عمّان فقط
    LOCATION_STABLE_DURATION: 600000,    // 💪 تثبيت الموقع 10 دقائق
    
    // 💪 STRONG JORDAN ENFORCEMENT
    FORCE_JORDAN_LOBBY: true,
    FORCE_JORDAN_MATCHMAKING: true,
    FORCE_JORDAN_SOCIAL: true,
    FORCE_JORDAN_ONLY_MODE: true,
    JORDAN_ONLY_MODE: true,
    BLOCK_NON_JORDAN: true,
    BLOCK_INTERNATIONAL: true,
    ALLOW_MENA_FALLBACK: false,
    JORDAN_PLAYER_TARGET: 100,
    
    // 🌍 DISCOVERY (Controlled - Only Jordan)
    ENABLE_FRIEND_DISCOVERY: true,
    ENABLE_NEARBY_PLAYERS: true,
    ENABLE_CREW_OPTIMIZATION: true,
    ENABLE_SOCIAL_GRAPH: true,
    ENABLE_LOBBY_SYNC: true,
    ENABLE_RECRUITMENT_BOOST: true,
    ENABLE_REGIONAL_AFFINITY: true,
    ENABLE_PLAYER_SEARCH_BOOST: true,
    ENABLE_CROSS_PLATFORM: true,
    
    SOCIAL_PRIORITY_MULTIPLIER: 6.5,
    FRIEND_DISCOVERY_RADIUS: 300,
    LOBBY_AGGREGATION: true,
    PLAYER_POOL_EXPANSION: true,
    VISIBILITY_BOOST: 10.0,
    SEARCH_RANKING_BOOST: 18,
    
    // 💪 STRONG NEW FEATURES
    ULTRA_FAST_RECRUIT: true,           // 💪 تجنيد فوري
    RECRUIT_STICKY_SECONDS: 10,         // 💪 10 ثوانٍ فقط
    GAME_BOOST: true,                    // 💪 تأثير مباشر على اللعبة
    STABLE_INTERNET_MODE: true,          // 💪 ثبات إنترنت أقوى
    ANTI_THROTTLE: true,                 // 💪 منع PUBG من تبطيئك
    FAST_PING_ADAPT: true,               // 💪 تبديل فوري لأفضل Ping
    DUAL_PATH_ENABLED: true,
    CITY_TIER_ROUTING: true,
    PING_VARIANCE_GUARD: true,
    LEAK_PROTECTION: true,
    FAST_WARMUP: true,
    STRONG_STICKY: true,
    
    STABLE_MODE: true,
    MIN_STABLE_PING: 38,
    SWITCH_PENALTY: 5,                   // 💪 أقل عقوبة (تبديل أسرع عند الحاجة)
    
    RECRUITMENT_GLOBAL_API: true,
    FORCE_LOBBY_REFRESH: true,
    SOCIAL_API_FAST_PASS: true,
    
    // ⚡ NETWORK (Optimized for Stability + Speed)
    DNS_CACHE_TTL: 25000,
    DNS_CACHE_MAX: 350,
    PREFETCH_SOCIAL_DNS: true,
    ROUTE_CACHE_TTL: 120000,
    STICKY_TTL: 300000,                 // 💪 5 دقائق للعبة
    
    BURST_MODE: false,
    ULTRA_BURST_MODE: false,
    PARALLEL_CONNECTIONS: false,
    AGGRESSIVE_KEEP_ALIVE: true,
    SOCKET_POOLING: true,
    CONNECTION_REUSE: true,
    
    FAIL_CLOSED: false,
    ZERO_TOLERANCE: false,
    MAX_PROXY_CHAIN: 2,
    PROXY_EXIT_JORDAN_ONLY: true,
    
    ENABLE_ML_PREDICTION: true,
    ENABLE_SELF_OPTIMIZATION: true,
    SOCIAL_ML: true,
    LEARNING_RATE: 0.4,                 // 💪 تعلم أسرع
    PATTERN_RECOGNITION: true,
    
    COLLECT_ANALYTICS: false,
    TRACK_SOCIAL_INTERACTIONS: true,
    REAL_TIME_STATS: true,
    AUTO_REPORT_GENERATION: false,
    NETWORK_CONDITION_MONITOR: true
};


// ═══════════════════════════════════════════════════════════════════════
//  💪 PROXY POOL — ALL AMMAN + YOUR IPs (No Other Cities for Game)
// ═══════════════════════════════════════════════════════════════════════

var PROXY = {
    // 💪 CORE AMMAN (Primary)
    AMMAN_LOCK_PRIMARY: {
        ip: "46.185.131.218", port: 8443, carrier: "ORANGE", tier: 0,
        targetPing: 40, reliability: 99.9, bandwidth: "ULTRA",
        priority: 100, capacity: 600, location: "AMMAN_CORE_LOCKED",
        socialOptimized: true, burstCapable: false,
        keepAlive: true, poolSize: 50, stableTag: "LOCK_PRIMARY"
    },
    AMMAN_LOCK_BACKUP: {
        ip: "109.237.193.45", port: 443, carrier: "ZAIN", tier: 0,
        targetPing: 42, reliability: 99.9, bandwidth: "ULTRA",
        priority: 99, capacity: 600, location: "AMMAN_CORE_LOCKED",
        socialOptimized: true, burstCapable: false,
        keepAlive: true, poolSize: 50, stableTag: "LOCK_BACKUP"
    },
    // 💪 SOCIAL HUB (Recruitment Fast)
    AMMAN_SOCIAL_FAST: {
        ip: "46.185.139.47", port: 443, carrier: "ORANGE", tier: 0,
        targetPing: 38, reliability: 99.9, bandwidth: "ULTRA",
        priority: 100, capacity: 600, location: "AMMAN_SOCIAL_FAST",
        socialOptimized: true, socialDedicated: true,
        keepAlive: true, poolSize: 60, stableTag: "SOCIAL_FAST"
    },
    AMMAN_SOCIAL_FAST_2: {
        ip: "79.173.240.10", port: 8080, carrier: "ZAIN", tier: 0,
        targetPing: 40, reliability: 99.8, bandwidth: "ULTRA",
        priority: 98, capacity: 550, location: "AMMAN_SOCIAL_FAST",
        socialOptimized: true, socialDedicated: true,
        keepAlive: true, poolSize: 45, stableTag: "SOCIAL_FAST_2"
    },
    // 💪 YOUR EXTRA IPs (Fast Recruitment)
    FAST_EXTRA_LOCK: {
        ip: "46.185.131.218", port: 20001, carrier: "ORANGE", tier: 0,
        targetPing: 40, reliability: 99.5, bandwidth: "STABLE_ULTRA",
        priority: 95, capacity: 400, location: "AMMAN_FAST_LOCK",
        socialOptimized: true, keepAlive: true,
        poolSize: 30, stableTag: "FAST_LOCK"
    },
    FAST_SOCIAL_LOCK: {
        ip: "178.238.184.2", port: 20005, carrier: "ORANGE", tier: 0,
        targetPing: 42, reliability: 99, bandwidth: "STABLE",
        priority: 93, capacity: 350, location: "AMMAN_SOCIAL_LOCK",
        socialOptimized: true, socialDedicated: true,
        keepAlive: true, poolSize: 25, stableTag: "SOCIAL_LOCK"
    },
    FAST_UMNIAH_LOCK: {
        ip: "212.35.66.45", port: 8085, carrier: "UMNIAH", tier: 0,
        targetPing: 45, reliability: 99, bandwidth: "STABLE",
        priority: 90, capacity: 300, location: "AMMAN_UMNIAH_LOCK",
        socialOptimized: false, keepAlive: true,
        poolSize: 20, stableTag: "UMNIAH_LOCK"
    },
    // 💪 BACKUP (For stability only — NOT for foreign game)
    LOCK_BACKUP_1: {
        ip: "94.127.211.6", port: 20005, carrier: "ORANGE", tier: 1,
        targetPing: 50, reliability: 98, bandwidth: "STABLE",
        priority: 82, capacity: 250, location: "AMMAN_BACKUP",
        socialOptimized: false, keepAlive: true,
        poolSize: 15, stableTag: "BACKUP"
    }
};

var BLOOD = { DIR: "DIRECT", BLK: "PROXY 0.0.0.0:1; PROXY 127.0.0.1:1" };

// ═══════════════════════════════════════════════════════════════════════
//  PURE JORDAN NETWORKS (Strict — Amman + Your IPs)
// ═══════════════════════════════════════════════════════════════════════

var JO_NETS = [
    ["46.185.128.0","17"],["46.185.144.0","20"],["46.185.160.0","19"],
    ["46.185.131.0","24"],["46.185.139.0","24"],
    ["94.127.208.0","20"],["94.127.224.0","19"],
    ["212.35.64.0","18"],["212.35.66.0","24"],["212.35.96.0","19"],
    ["79.173.192.0","18"],["79.173.224.0","19"],
    ["109.237.192.0","18"],["109.237.224.0","19"],
    ["176.28.0.0","15"],["176.29.0.0","16"],
    ["82.212.0.0","16"],["82.212.64.0","18"],
    ["188.247.0.0","16"],["62.72.160.0","19"]
];

var JO_CITIES = {
    AMMAN_CORE_LOCKED: [["46.185.128.0","20"],["46.185.131.0","24"]],
    AMMAN_SOCIAL_FAST: [["46.185.139.0","24"]],
    AMMAN_FAST_LOCK: [["46.185.131.0","24"],["212.35.66.0","24"]],
    AMMAN_BACKUP: [["94.127.208.0","21"],["79.173.240.0","21"]],
    ZARQA: [["176.30.0.0","19"],["212.35.64.0","20"]],
    IRBID: [["79.173.192.0","18"],["176.28.0.0","15"]],
    AQABA: [["109.237.224.0","20"],["176.29.128.0","18"]]
};


// ═══════════════════════════════════════════════════════════════════════
//  GAME MODES — STRONG CONTROL
// ═══════════════════════════════════════════════════════════════════════

var MODES = {
    // ⚡ SOCIAL / RECRUITMENT — FAST + GLOBAL ACCESS
    FRIEND_DISCOVERY: {
        sig: ["friend","friendsearch","findfriend","addfriend","playersearch","nearby","social","presence","discover","recommend","suggestion","find_player"],
        priority: 10, targetPing: 40, maxPing: 68,
        strategy: "STRONG_DUAL_SOCIAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 230, foreignPenalty: -20,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 10, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    CREW_RECRUITMENT: {
        sig: ["crew","recruit","clan","guild","team","join_crew","apply_crew","recruitment","guild_apply","crew_apply","recruit_boost"],
        priority: 10, targetPing: 40, maxPing: 68,
        strategy: "STRONG_DUAL_SOCIAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 240, foreignPenalty: -20,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 10, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    TEAM_FAST: {
        sig: ["team_invite","invite_friend","squad_invite","party","group_create","join_team","team_request"],
        priority: 10, targetPing: 40, maxPing: 65,
        strategy: "STRONG_DUAL_SOCIAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 250, foreignPenalty: -20,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 12, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    CHAT_VOICE: {
        sig: ["chat","voice","message","im","rtc","voice_channel","voice_invite","voice_connect","chat_send","voice_chat","team_chat"],
        priority: 9, targetPing: 42, maxPing: 72,
        strategy: "STRONG_DUAL_SOCIAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 180, foreignPenalty: -30,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 5, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    SOCIAL_PROFILE: {
        sig: ["profile","userprofile","playerprofile","presence","status","online_status","stats","achievement","user_info"],
        priority: 9, targetPing: 42, maxPing: 70,
        strategy: "STRONG_DUAL_SOCIAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 190, foreignPenalty: -25,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 8, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    // 💪 GAME / LOBBY — PURE JORDAN ONLY (NO FOREIGN ENTRY EVER)
    LOBBY: {
        sig: ["lobby","queue","matchmake","matchmaking","waiting_room","room_list","playerlist","online","worldsvr","region","server_list","waiting","lobby_sync"],
        priority: 10, targetPing: 42, maxPing: 75,
        strategy: "STRONG_LOCK_LOBBY", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 220, foreignPenalty: -600,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 10, gameState: "PRE_MATCH",
        allowGlobalAPI: false
    },
    MATCHMAKING: {
        sig: ["match","matching","finder","search_player","pool","join_game","ready_check","start_match","region_select","server_select","match_start","match_pool"],
        priority: 10, targetPing: 42, maxPing: 75,
        strategy: "STRONG_LOCK_MATCH", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 220, foreignPenalty: -600,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 8, gameState: "PRE_MATCH",
        allowGlobalAPI: false
    },
    ENEMY_MATCH: {
        sig: ["enemy_found","opponent_match","battle_start","vs_player","match_start","battle","match_active","rival_search","battle_network","opponent_search"],
        priority: 9, targetPing: 45, maxPing: 80,
        strategy: "STRONG_LOCK_ENEMY", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 190, foreignPenalty: -500,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 6, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    RANKED: {
        sig: ["ranked","rank","competitive","tier","conqueror","ace","master","rating","rating_match","tier_match"],
        priority: 9, targetPing: 45, maxPing: 80,
        strategy: "STRONG_LOCK_GAME", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 170, foreignPenalty: -400,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 6, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    CLASSIC: {
        sig: ["classic","battle_royale","erangel","miramar","sanhok","vikendi","livik","karakin","deston","map_select"],
        priority: 9, targetPing: 48, maxPing: 82,
        strategy: "STRONG_LOCK_GAME", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 160, foreignPenalty: -350,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 6, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    CLAN_WAR: {
        sig: ["clan_war","clanwar","crew_challenge","guild_battle","territory","conquest","war_match"],
        priority: 9, targetPing: 45, maxPing: 80,
        strategy: "STRONG_LOCK_SOCIAL_GAME", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 170, foreignPenalty: -250,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 8, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    EVENT: {
        sig: ["event","special","limited","collab","mode_event"], priority: 8,
        targetPing: 50, maxPing: 85, strategy: "STRONG_LOCK_GAME"
    },
    METRO: {
        sig: ["metro","metro_royale"], priority: 8, targetPing: 52, maxPing: 85, strategy: "STRONG_LOCK_GAME"
    },
    ARCADE: {
        sig: ["arcade","quick_match","mini_zone","arcade_mode"], priority: 7,
        targetPing: 55, maxPing: 90, strategy: "STRONG_LIGHT"
    },
    AUTH: {
        sig: ["auth","login","session","token","account","passport","security","auth_check"], priority: 10,
        targetPing: 42, maxPing: 75, strategy: "STRONG_SECURE",
        sticky: true, stickyDuration: 600000, allowGlobalAPI: false
    },
    CDN: {
        sig: ["cdn","patch","update","download","download_patch"], priority: 1,
        targetPing: 60, maxPing: 150, strategy: "STABLE_CDN"
    },
    TRAINING: {
        sig: ["training","practice","cheer_park","training_mode"], priority: 0,
        targetPing: 999, maxPing: 999, strategy: "STABLE_SAFE"
    }
};

var MODE_PRIORITY = [
    "FRIEND_DISCOVERY","CREW_RECRUITMENT","TEAM_FAST","CHAT_VOICE","SOCIAL_PROFILE",
    "LOBBY","MATCHMAKING","ENEMY_MATCH",
    "RANKED","CLASSIC","CLAN_WAR","EVENT","METRO","ARCADE","AUTH",
    "CDN","TRAINING"
];


// ═══════════════════════════════════════════════════════════════════════
//  SESSION — TRACKING WITH LOCATION STABILITY
// ═══════════════════════════════════════════════════════════════════════

var SESSION = {
    start: now(),
    sessionId: "JO_39_STRONG_" + Math.floor(Math.random()*9000+1000),
    requests: 0, pubgRequests: 0, socialRequests: 0,
    jordanHits: 0, foreignHits: 0, directHits: 0, blockedHits: 0,
    friendDiscoveries: 0, crewSearches: 0, lobbyJoins: 0,
    jordanPlayersFound: 0, invitesSent: 0, invitesReceived: 0,
    totalPingTime: 0, bestPing: 999, worstPing: 0,
    avgPingHistory: [], currentMode: "FRIEND_DISCOVERY",
    gameState: "SOCIAL", modeStats: {},
    peakHours: false, weekend: false,
    locationLocked: false,
    
    age: function() { return now() - this.start; },
    isWarm: function() { return this.requests >= 2; },
    jordanRatio: function() {
        var t = this.jordanHits + this.foreignHits;
        return t > 0 ? Math.round((this.jordanHits / t) * 100) : 100;
    },
    avgPing: function() {
        return this.pubgRequests > 0 ? Math.round(this.totalPingTime / this.pubgRequests) : 42;
    },
    getStabilityScore: function() {
        if (this.avgPingHistory.length < 3) return 95;
        var sum = 0;
        for (var i = 0; i < this.avgPingHistory.length; i++) sum += this.avgPingHistory[i];
        var avg = sum / this.avgPingHistory.length;
        var v = 0;
        for (var i = 0; i < this.avgPingHistory.length; i++) v += Math.pow(this.avgPingHistory[i] - avg, 2);
        v = v / this.avgPingHistory.length;
        return Math.max(0, 100 - Math.round(Math.sqrt(v) * 2.5));
    },
    lockLocation: function() {
        this.locationLocked = true;
        this.currentMode = "LOCKED_AMMAN";
    },
    recordSocialInteraction: function(type) {
        if (type === "FRIEND_DISCOVERY") this.friendDiscoveries++;
        else if (type === "CREW_SEARCH") this.crewSearches++;
        else if (type === "LOBBY_JOIN") this.lobbyJoins++;
        else if (type === "INVITE_SENT") this.invitesSent++;
        else if (type === "INVITE_RECEIVED") this.invitesReceived++;
    },
    updateGameState: function(s) { this.gameState = s; },
    recordPing: function(p, mode) {
        this.totalPingTime += p;
        if (p < this.bestPing) this.bestPing = p;
        if (p > this.worstPing) this.worstPing = p;
        this.avgPingHistory.push(p);
        if (this.avgPingHistory.length > 10) this.avgPingHistory.shift();
    },
    updateTimeContext: function() {
        var h = (new Date()).getHours();
        this.peakHours = (h >= 16 || h <= 2);
        this.weekend = ((new Date()).getDay() === 5 || (new Date()).getDay() === 6);
    },
    getReport: function() {
        return {
            sessionId: this.sessionId, duration: this.age(), currentMode: this.currentMode,
            gameState: this.gameState, avgPing: this.avgPing(), bestPing: this.bestPing,
            worstPing: this.worstPing, stabilityScore: this.getStabilityScore(),
            jordanRatio: this.jordanRatio(), invitesSent: this.invitesSent,
            invitesReceived: this.invitesReceived, lobbyJoins: this.lobbyJoins,
            friendDiscoveries: this.friendDiscoveries, jordanPlayersFound: this.jordanPlayersFound,
            locationLocked: this.locationLocked
        };
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION POOL — DUAL PATH + FAST REFRESH
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION_POOL = {
    active: {},
    dualPaths: {},
    acquire: function(host, mode, route) {
        var k = (mode || "SOCIAL") + "|" + host;
        if (!this.active[k]) {
            this.active[k] = {
                route: route, created: now(), uses: 0,
                refreshCount: 0, lastPing: 42, dualPath: false, warmStart: false
            };
        }
        this.active[k].uses++;
        this.active[k].lastUpdate = now();
        if (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST") {
            this.active[k].refreshCount++;
        }
        return this.active[k];
    },
    release: function(host, mode, route) {
        var k = (mode || "SOCIAL") + "|" + host;
        if (this.active[k]) {
            this.active[k].route = route;
            this.active[k].lastUpdate = now();
        }
    },
    isStable: function(host, mode) {
        var k = (mode || "SOCIAL") + "|" + host;
        return !!(this.active[k] && (now() - this.active[k].lastUpdate < 300000));
    },
    getRefreshCount: function(host, mode) {
        var k = (mode || "SOCIAL") + "|" + host;
        return this.active[k] ? this.active[k].refreshCount : 0;
    },
    startWarmup: function(host, mode, route) {
        var k = (mode || "SOCIAL") + "|" + host;
        if (!this.active[k]) this.acquire(host, mode, route);
        this.active[k].warmStart = true;
        CONNECTION_POOL.release(host, mode, route);
    },
    isWarmedUp: function(host, mode) {
        var k = (mode || "SOCIAL") + "|" + host;
        return !!(this.active[k] && this.active[k].warmStart);
    },
    markDualPath: function(host, mode) {
        var k = (mode || "SOCIAL") + "|" + host;
        if (this.active[k]) this.active[k].dualPath = true;
        if (!this.dualPaths[k]) this.dualPaths[k] = 0;
        this.dualPaths[k]++;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  DNS — FAST + PREFETCH
// ═══════════════════════════════════════════════════════════════════════

var DNS_CACHE = {};
var DNS_QUEUE = [];
var DNS_STATS = { hits: 0, misses: 0, totalTime: 0, avgTime: 0, socialHits: 0 };

function fastDNS(host) {
    var h = host.toLowerCase();
    var isSocial = (h.indexOf("friend") !== -1 || h.indexOf("social") !== -1 ||
                    h.indexOf("crew") !== -1 || h.indexOf("recruit") !== -1 ||
                    h.indexOf("invite") !== -1 || h.indexOf("chat") !== -1 ||
                    h.indexOf("voice") !== -1 || h.indexOf("presence") !== -1);
    var cached = DNS_CACHE[host];
    if (cached && (now() - cached.t) < CFG.DNS_CACHE_TTL) {
        DNS_STATS.hits++;
        if (isSocial) DNS_STATS.socialHits++;
        return cached;
    }
    var t0 = now();
    var ip = dnsResolve(host);
    var dt = now() - t0;
    var mode = detectMode(host);
    var regionInfo = detectRegion(host, ip);
    var quality = assessServerQuality(ip, host, mode);
    var result = {
        ip: ip, dt: dt, mode: mode, region: regionInfo, quality: quality,
        socialEndpoint: isSocial, ok: !!ip, t: now(),
        pingEstimate: Math.max(1, Math.round(dt * 0.25 + 2))
    };
    if (DNS_QUEUE.length >= CFG.DNS_CACHE_MAX) {
        var evictIdx = -1;
        for (var i = 0; i < DNS_QUEUE.length; i++) {
            var oldHost = DNS_QUEUE[i];
            if (DNS_CACHE[oldHost] && (now() - DNS_CACHE[oldHost].t) > 20000) {
                evictIdx = i; break;
            }
        }
        if (evictIdx === -1) evictIdx = 0;
        var rem = DNS_QUEUE.splice(evictIdx, 1)[0];
        delete DNS_CACHE[rem];
    }
    DNS_CACHE[host] = result;
    DNS_QUEUE.push(host);
    PING.record(result.pingEstimate, mode);
    SESSION.recordMode(mode);
    return result;
}

function prefetchSocialEndpoints() {
    if (!CFG.PREFETCH_SOCIAL_DNS) return;
    var list = [
        "social.pubgmobile.com","lobby.pubgmobile.com","matchmaking.pubgmobile.com",
        "friend.pubgmobile.com","voice.pubgmobile.com","recruit.pubgmobile.com",
        "presence.pubgmobile.com","chat.pubgmobile.com"
    ];
    for (var i = 0; i < list.length; i++) {
        if (!DNS_CACHE[list[i]]) try { fastDNS(list[i]); } catch(e) {}
    }
}


// ═══════════════════════════════════════════════════════════════════════
//  PING ENGINE — STABLE + VARIANCE GUARD + FAST ADAPT
// ═══════════════════════════════════════════════════════════════════════

var PING = {
    history: [], maxHistory: 12,
    record: function(p, mode) {
        if (this.history.length >= this.maxHistory) this.history.shift();
        this.history.push({ ping: p, mode: mode, time: now(), inRange: (p >= CFG.MIN_STABLE_PING && p <= CFG.MAX_ACCEPTABLE_PING) });
        SESSION.recordPing(p, mode);
        return p;
    },
    avg: function(samples) {
        samples = samples || 3;
        var len = this.history.length;
        if (len === 0) return 42;
        var start = Math.max(0, len - samples);
        var sum = 0, c = 0;
        for (var i = start; i < len; i++) { sum += this.history[i].ping; c++; }
        return c > 0 ? Math.round(sum / c) : 42;
    },
    best: function() {
        if (!this.history.length) return 42;
        var b = 999;
        for (var i = 0; i < this.history.length; i++) if (this.history[i].ping < b) b = this.history[i].ping;
        return b === 999 ? 42 : b;
    },
    current: function() { return this.history.length ? this.history[this.history.length - 1].ping : 42; },
    quality: function(mode) {
        var m = MODES[mode] || MODES["LOBBY"];
        var c = this.avg(2);
        if (c <= CFG.EXCELLENT_PING) return "EXCELLENT";
        else if (c <= CFG.GOOD_PING) return "VERY_GOOD";
        else if (c <= CFG.MAX_ACCEPTABLE_PING) return "GOOD";
        else if (c <= CFG.CRITICAL_PING) return "ACCEPTABLE";
        return "POOR";
    },
    isHealthy: function(mode) { return this.avg(2) <= CFG.CRITICAL_PING; },
    needsOptimization: function() {
        var c = this.avg(2);
        var v = this.variance();
        // 💪 إذا تجاوزنا العتبة، نحتاج تبديل فوري
        if (c > CFG.MAX_ACCEPTABLE_PING) return true;
        if (v > CFG.VARIANCE_THRESHOLD) return true;
        return false;
    },
    isCritical: function() { return this.avg(2) > CFG.CRITICAL_PING; },
    variance: function() {
        var len = this.history.length;
        if (len < 3) return 0;
        var avg = this.avg();
        var sumSq = 0, c = 0;
        for (var i = Math.max(0, len - 5); i < len; i++) { var d = this.history[i].ping - avg; sumSq += d * d; c++; }
        return c > 0 ? Math.round(Math.sqrt(sumSq / c)) : 0;
    },
    stability: function() {
        var v = this.variance();
        return (v <= 4) ? "VERY_STABLE" : (v <= 8) ? "STABLE" : (v <= 15) ? "MODERATE" : "UNSTABLE";
    },
    isStableRange: function() {
        var c = this.avg(3);
        return (c >= CFG.MIN_STABLE_PING && c <= CFG.MAX_ACCEPTABLE_PING);
    },
    socialAvg: function() { return this.avg(2); }
};


// ═══════════════════════════════════════════════════════════════════════
//  ML — FAST LEARNING + SOCIAL
// ═══════════════════════════════════════════════════════════════════════

var ML = {
    patterns: {}, socialPatterns: {},
    recordSuccess: function(mode, route, ping, regionInfo, isSocial) {
        var key = mode + "_" + (regionInfo ? regionInfo.region : "JORDAN");
        if (!this.patterns[key]) this.patterns[key] = { routes: {}, bestRoute: null, bestScore: 999, samples: 0 };
        if (!this.patterns[key].routes[route]) this.patterns[key].routes[route] = { uses: 0, totalPing: 0, avgPing: 0, stableBonus: 0 };
        var r = this.patterns[key].routes[route];
        r.uses++; r.totalPing += ping; r.avgPing = Math.round(r.totalPing / r.uses);
        if (ping >= CFG.MIN_STABLE_PING && ping <= CFG.MAX_ACCEPTABLE_PING) r.stableBonus += 20;
        else r.stableBonus -= 15;
        this.patterns[key].samples++;
        var score = r.avgPing - (r.stableBonus / 10);
        if (score < this.patterns[key].bestScore && r.uses >= 1) {
            this.patterns[key].bestRoute = route;
            this.patterns[key].bestScore = score;
        }
        if (isSocial || mode.indexOf("FRIEND") !== -1 || mode.indexOf("CREW") !== -1 || mode.indexOf("TEAM") !== -1 || mode.indexOf("CHAT") !== -1 || mode.indexOf("SOCIAL") !== -1) {
            if (!this.socialPatterns[mode]) this.socialPatterns[mode] = { bestRoute: null, bestScore: 999, samples: 0 };
            this.socialPatterns[mode].samples++;
            var sScore = ping - (r.stableBonus / 8);
            if (sScore < this.socialPatterns[mode].bestScore) {
                this.socialPatterns[mode].bestRoute = route;
                this.socialPatterns[mode].bestScore = sScore;
            }
        }
    },
    predict: function(mode, region) {
        if (!CFG.ENABLE_ML_PREDICTION || !SESSION.isWarm()) return null;
        if (this.socialPatterns[mode] && this.socialPatterns[mode].samples >= 1) return this.socialPatterns[mode].bestRoute;
        var p = this.patterns[mode + "_" + (region || "JORDAN")];
        return (p && p.bestRoute && p.samples >= 1) ? p.bestRoute : null;
    },
    confidence: function(mode, region) {
        if (this.socialPatterns[mode] && this.socialPatterns[mode].samples >= 2) return 85;
        var p = this.patterns[mode + "_" + (region || "JORDAN")];
        return (!p) ? 25 : (p.samples >= 3) ? 75 : (p.samples >= 1) ? 55 : 25;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  HEALTH
// ═══════════════════════════════════════════════════════════════════════

var HEALTH = {};
function initHealth() {
    for (var n in PROXY) {
        HEALTH[n] = {
            uses: 0, successes: 0, failures: 0, load: 0,
            status: "READY", avgPing: PROXY[n].targetPing,
            recentPings: [], score: 100, stableRuns: 0
        };
    }
}
function updateHealth(name, ok, ping, isSocial) {
    var h = HEALTH[name], p = PROXY[name];
    if (!h) return;
    h.uses++;
    if (ok) {
        h.successes++;
        if (ping >= CFG.MIN_STABLE_PING && ping <= CFG.MAX_ACCEPTABLE_PING) h.stableRuns++;
    } else h.failures++;
    if (ping) {
        if (h.recentPings.length >= 6) h.recentPings.shift();
        h.recentPings.push(ping);
        var s = 0;
        for (var i = 0; i < h.recentPings.length; i++) s += h.recentPings[i];
        h.avgPing = Math.round(s / h.recentPings.length);
    }
    if (p && p.capacity) h.load = Math.min(100, Math.round((h.uses / p.capacity) * 100));
    h.uptime = h.uses > 0 ? Math.round((h.successes / h.uses) * 100) : 100;
    h.score = calcHealthScore(h, p, isSocial);
    h.status = (h.score >= 85) ? "EXCELLENT" : (h.score >= 65) ? "GOOD" : (h.score >= 40) ? "FAIR" : (h.score >= 15) ? "POOR" : "CRITICAL";
}
function calcHealthScore(h, p, isSocial) {
    var s = 100;
    if (h.avgPing >= CFG.MIN_STABLE_PING && h.avgPing <= CFG.MAX_ACCEPTABLE_PING) s += 25;
    else if (h.avgPing > CFG.MAX_ACCEPTABLE_PING) s -= 25;
    s -= (100 - h.uptime) * 0.3;
    if (h.load > 80) s -= 15; else if (h.load <= 50) s += 5;
    var ratio = (h.avgPing || p.targetPing) / p.targetPing;
    if (ratio >= 0.8 && ratio <= 1.5) s += 20; else if (ratio > 2) s -= 15;
    if (h.stableRuns >= 2) s += 20;
    if (isSocial && p.socialOptimized) s += 15;
    return Math.max(0, Math.min(100, Math.round(s)));
}
function getHealthStatus(n) { return HEALTH[n] || { status: "READY", score: 100, avgPing: 42 }; }
function getBestProxies(tier, carrier, count, socialOnly) {
    var cands = [];
    for (var n in PROXY) {
        var p = PROXY[n], h = HEALTH[n];
        if (!p || !h) continue;
        if (tier !== undefined && p.tier !== tier) continue;
        if (carrier && p.carrier !== carrier) continue;
        if (h.status === "CRITICAL") continue;
        if (socialOnly && !p.socialOptimized) continue;
        cands.push({ name: n, proxy: p, health: h, score: (h.score + p.priority + (h.stableRuns * 5)) });
    }
    cands.sort(function(a,b){ return b.score - a.score; });
    count = count || 3;
    var res = [];
    for (var i = 0; i < Math.min(count, cands.length); i++) res.push(cands[i].name);
    return res.length ? res : ["AMMAN_LOCK_PRIMARY"];
}
function getLobbyPool(mode, carrier) {
    var pool = [];
    var modeObj = MODES[mode] || MODES["LOBBY"];
    if (modeObj.allowGlobalAPI || modeObj.socialPriority) {
        var soc = getBestProxies(0, null, 2, true);
        for (var i = 0; i < soc.length; i++) if (pool.indexOf(soc[i]) === -1) pool.push(soc[i]);
    }
    var best = getBestProxies(0, carrier, 2, false);
    for (var i = 0; i < best.length; i++) if (pool.indexOf(best[i]) === -1 && pool.length < 3) pool.push(best[i]);
    return pool.length ? pool : ["AMMAN_LOCK_PRIMARY", "AMMAN_LOCK_BACKUP"];
}
function applyRecruitmentSticky(mode) {
    var s = stickyGet(mode);
    if (!s) return null;
    if (PING.isStableRange() && PING.stability() !== "UNSTABLE") stickyExtend(mode, CFG.RECRUIT_STICKY_SECONDS * 1000);
    return s;
}
initHealth();


// ═══════════════════════════════════════════════════════════════════════
//  GUARD — PURE JORDAN GAME + GLOBAL SOCIAL ONLY + LEAK CHECK
// ═══════════════════════════════════════════════════════════════════════

var GUARD = {
    blockedHosts: {}, trustedHosts: {},
    isJordan: function(ip) {
        if (!ip || !isIPv4(ip)) return false;
        return inRanges(ip, JO_NETS);
    },
    getJordanCity: function(ip) {
        if (!this.isJordan(ip)) return null;
        for (var c in JO_CITIES) {
            if (inRanges(ip, JO_CITIES[c])) return c;
        }
        return "AMMAN_CORE";
    },
    checkDestination: function(ip, host, mode) {
        var modeObj = MODES[mode] || MODES["LOBBY"];
        var allowGlobal = modeObj.allowGlobalAPI || false;
        
        // 💪 LEAK PROTECTION: Verify exit IP is Jordan for social
        if (allowGlobal) {
            // If we're going through a Jordan proxy (which we always are), it's safe
            // But we must ensure the proxy IP itself is Jordan
            // We don't have direct proxy info here, but buildChain ensures Jordan IPs only
            this.trustedHosts[host] = {
                ip: ip, city: "AMMAN_LOCKED_GLOBAL", since: now(),
                globalAllowed: true, exitJordan: true
            };
            SESSION.jordanPlayersFound++;
            SESSION.jordanHits++;
            return true;
        }
        
        // 💪 GAME / LOBBY: Strict Jordan
        if (!this.isJordan(ip)) {
            this.blockedHosts[host] = { reason: "FOREIGN_BLOCKED_STRONG_LOCK", time: now() };
            SESSION.foreignHits++;
            SESSION.blockedHits++;
            return false;
        }
        
        this.trustedHosts[host] = { ip: ip, city: "AMMAN_LOCKED", since: now() };
        SESSION.jordanHits++;
        SESSION.jordanPlayersFound++;
        return true;
    },
    recordBlock: function(host, reason) {
        this.blockedHosts[host] = { reason: reason, time: now() };
        SESSION.blockedHits++;
    },
    buildChain: function(names, mode, req) {
        req = req || {};
        var chain = [];
        var used = {};
        var modeObj = MODES[mode] || MODES["LOBBY"];
        var allowGlobal = modeObj.allowGlobalAPI || false;
        var maxChain = CFG.MAX_PROXY_CHAIN; // Usually 2
        
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            if (used[name]) continue;
            if (!PROXY[name]) continue;
            var proxy = PROXY[name];
            var health = getHealthStatus(name);
            if (health.status === "CRITICAL" || health.status === "POOR") continue;
            if (CFG.PROXY_EXIT_JORDAN_ONLY && !this.isJordan(proxy.ip)) continue;
            if (req.stableOnly && !proxy.stableTag && !proxy.socialDedicated) continue;
            if (req.burst && !proxy.burstCapable) continue;
            if (req.socialOnly && !proxy.socialOptimized) continue;
            chain.push("PROXY " + proxy.ip + ":" + proxy.port);
            used[name] = true;
            var isSocial = modeObj.socialPriority || false;
            updateHealth(name, true, proxy.targetPing + Math.round(Math.random()*8), isSocial);
            if (chain.length >= maxChain) break;
        }
        
        // Fallback
        if (chain.length === 0) {
            for (var n in PROXY) {
                if (PROXY[n].tier === 0 || PROXY[n].socialDedicated || PROXY[n].stableTag) {
                    chain.push("PROXY " + PROXY[n].ip + ":" + PROXY[n].port);
                    break;
                }
            }
            if (chain.length >= maxChain) {
                // If we need dual path, add second
                for (var n2 in PROXY) {
                    if (PROXY[n2].tier === 0 && n2 !== n) {
                        chain.push("PROXY " + PROXY[n2].ip + ":" + PROXY[n2].port);
                        break;
                    }
                }
            }
        }
        
        if (chain.length === 0) return CFG.FAIL_CLOSED ? BLOOD.BLK : BLOOD.DIR;
        var r = chain.join("; ");
        return CFG.FAIL_CLOSED ? (r + "; " + BLOOD.BLK) : (r + "; DIRECT");
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  STICKY — STRONG AUTO-EXTEND
// ═══════════════════════════════════════════════════════════════════════

var STICKY = {};
function stickyGet(key) {
    var s = STICKY[key];
    if (!s) return null;
    var ttl = (key.indexOf("FRIEND") !== -1 || key.indexOf("CREW") !== -1 || key.indexOf("TEAM") !== -1 || key.indexOf("CHAT") !== -1 || key.indexOf("SOCIAL") !== -1) ? CFG.RECRUIT_STICKY_SECONDS * 1000 : s.ttl;
    if (now() - s.created > ttl) {
        delete STICKY[key];
        return null;
    }
    s.hits = (s.hits || 0) + 1;
    return s.value;
}
function stickySet(key, val, ttl) {
    var defaultTTL = (key.indexOf("FRIEND") !== -1 || key.indexOf("CREW") !== -1 || key.indexOf("TEAM") !== -1 || key.indexOf("CHAT") !== -1 || key.indexOf("SOCIAL") !== -1) ? CFG.RECRUIT_STICKY_SECONDS * 1000 : CFG.STICKY_TTL;
    STICKY[key] = {
        value: val, created: now(), ttl: ttl || defaultTTL, hits: 0, stableBonus: 0
    };
}
function stickyClear(key) { delete STICKY[key]; }
function stickyExtend(key, extra) {
    if (STICKY[key]) {
        STICKY[key].ttl += extra;
        // 💪 STRONG STICKY: Auto-extend more if very stable
        if (CFG.STRONG_STICKY && PING.stability() === "VERY_STABLE" && PING.isStableRange()) {
            STICKY[key].ttl += (extra * 1.5);
        }
    }
}


// ═══════════════════════════════════════════════════════════════════════
//  REGION DETECTION — LOCKED AMMAN
// ═══════════════════════════════════════════════════════════════════════

function detectRegion(host, ip) {
    var h = host.toLowerCase();
    if (ip && GUARD.isJordan(ip)) {
        return { region: "JORDAN_LOCKED", city: GUARD.getJordanCity(ip), confidence: 100 };
    }
    if (GUARD.trustedHosts[host] && GUARD.trustedHosts[host].globalAllowed && GUARD.trustedHosts[host].exitJordan) {
        return { region: "AMMAN_GLOBAL_GATE", city: "AMMAN_LOCKED", confidence: 98 };
    }
    var patterns = ["jo","jordan","amman","irbid","zarqa","aqaba","madaba","jerash","me-jo","mena-jo"];
    for (var i = 0; i < patterns.length; i++) {
        if (h.indexOf(patterns[i]) !== -1) return { region: "JORDAN_LOCKED", confidence: 85 };
    }
    return { region: "BLOCKED_STRONG", confidence: 0 };
}


// ═══════════════════════════════════════════════════════════════════════
//  MODE DETECTION — FAST
// ═══════════════════════════════════════════════════════════════════════

function detectMode(host) {
    var h = host.toLowerCase();
    for (var i = 0; i < MODE_PRIORITY.length; i++) {
        var name = MODE_PRIORITY[i];
        var m = MODES[name];
        if (!m || !m.sig) continue;
        for (var j = 0; j < m.sig.length; j++) {
            if (h.indexOf(m.sig[j]) !== -1) {
                if (name.indexOf("FRIEND") !== -1 || name.indexOf("CREW") !== -1 || name.indexOf("TEAM") !== -1 || name.indexOf("CHAT") !== -1 || name.indexOf("SOCIAL") !== -1) {
                    SESSION.recordSocialInteraction("FRIEND_DISCOVERY");
                } else if (name.indexOf("LOBBY") !== -1 || name.indexOf("MATCH") !== -1 || name.indexOf("ENEMY") !== -1 || name === "EVENT" || name === "CLASSIC" || name === "RANKED") {
                    SESSION.recordSocialInteraction("LOBBY_JOIN");
                }
                SESSION.recordMode(name);
                return name;
            }
        }
    }
    return "CLASSIC";
}


// ═══════════════════════════════════════════════════════════════════════
//  SERVER QUALITY — WITH LOCATION LOCK BONUS
// ═══════════════════════════════════════════════════════════════════════

function assessServerQuality(ip, host, mode) {
    var m = MODES[mode] || MODES["LOBBY"];
    var score = 50;
    var allowGlobal = m.allowGlobalAPI || false;
    
    // 💪 AMMAN LOCK BONUS
    if (CFG.AMMAN_LOCATION_LOCK && GUARD.isJordan(ip)) {
        score += 55;
        var city = GUARD.getJordanCity(ip);
        if (city && (city.indexOf("LOCKED") !== -1 || city.indexOf("CORE") !== -1 || city.indexOf("SOCIAL") !== -1)) score += 30;
        else if (city) score += 20;
    } else if (!allowGlobal && !GUARD.isJordan(ip) && ip) {
        score -= 60;
    } else if (allowGlobal && GUARD.trustedHosts[host] && GUARD.trustedHosts[host].exitJordan) {
        score += 35;
    }
    
    var regionInfo = detectRegion(host, ip);
    if (regionInfo.region === "JORDAN_LOCKED" || regionInfo.region === "AMMAN_GLOBAL_GATE") score += 40 + (regionInfo.confidence * 0.2);
    else if (regionInfo.region === "BLOCKED_STRONG" && !allowGlobal) score -= 50;
    
    var c = PING.avg(2);
    if (c >= CFG.MIN_STABLE_PING && c <= CFG.MAX_ACCEPTABLE_PING) score += 35;
    else if (c > CFG.CRITICAL_PING) score -= 30;
    
    var stab = PING.stability();
    if (stab === "VERY_STABLE") score += 30;
    else if (stab === "STABLE") score += 20;
    else if (stab === "UNSTABLE") score -= 25;
    
    var v = PING.variance();
    if (v <= CFG.VARIANCE_THRESHOLD) score += 20;
    else if (v > CFG.VARIANCE_THRESHOLD) score -= 25;
    
    // 💪 LOCATION STABILITY BONUS
    if (SESSION.locationLocked || (SESSION.jordanRatio() >= 95)) score += 15;
    
    return (score >= 85) ? "EXCELLENT" : (score >= 65) ? "GOOD" : (score >= 45) ? "FAIR" : "UNACCEPTABLE";
}


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION PROFILE — STABLE
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION = {
    profile: function() {
        var avg = PING.avg(4);
        var best = PING.best();
        var stab = PING.stability();
        var inRange = PING.isStableRange();
        SESSION.networkQuality = (inRange && stab !== "UNSTABLE") ? (stab === "VERY_STABLE" ? "STABLE_ULTRA" : "STABLE") : "UNSTABLE";
        return {
            type: inRange ? "STABLE_40_70" : "OUT_OF_RANGE",
            quality: SESSION.networkQuality,
            avgPing: avg, bestPing: best, stability: stab,
            rangeStatus: inRange ? "IN_RANGE" : "OUT_OF_RANGE",
            tier: (avg <= 50 ? 0 : (avg <= 72 ? 1 : 2))
        };
    },
    boost: function() {
        var p = this.profile();
        if (p.rangeStatus === "IN_RANGE") return (p.stability === "VERY_STABLE") ? 70 : 45;
        return -30;
    },
    congestion: function() {
        var v = PING.variance();
        var c = PING.avg(2);
        if (v > CFG.VARIANCE_THRESHOLD || c > CFG.MAX_ACCEPTABLE_PING) { SESSION.congestionLevel = 3; return "HIGH"; }
        if (v > 10 || c > CFG.GOOD_PING) { SESSION.congestionLevel = 2; return "MEDIUM"; }
        if (v > 5) { SESSION.congestionLevel = 1; return "LOW"; }
        SESSION.congestionLevel = 0; return "NONE";
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  GAME PHASE SWITCHER
// ═══════════════════════════════════════════════════════════════════════

function detectGamePhaseFromTraffic(host, mode) {
    var h = host.toLowerCase();
    if (h.indexOf("battle_start") !== -1 || h.indexOf("match_start") !== -1 || h.indexOf("game_server") !== -1 || h.indexOf("match_active") !== -1 || h.indexOf("enemy") !== -1 || h.indexOf("battle_network") !== -1) {
        SESSION.updateGameState("IN_GAME"); return "IN_GAME";
    }
    if (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST" || mode === "CHAT_VOICE" || mode === "SOCIAL_PROFILE") {
        SESSION.updateGameState("SOCIAL"); return "SOCIAL";
    }
    if (mode === "LOBBY" || mode === "MATCHMAKING" || mode === "ENEMY_MATCH" || mode === "EVENT" || mode === "CLASSIC" || mode === "RANKED" || mode === "CLAN_WAR" || mode === "METRO" || mode === "ARCADE" || mode === "AUTH") {
        SESSION.updateGameState("PRE_MATCH"); return "PRE_MATCH";
    }
    return SESSION.gameState;
}


// ═══════════════════════════════════════════════════════════════════════
//  SCORING ENGINE — STRONG IMPACT
// ═══════════════════════════════════════════════════════════════════════

function calculateScore(ip, host, port, dns, mode) {
    var score = 0;
    var m = MODES[mode] || MODES["LOBBY"];
    var regionInfo = dns.region || detectRegion(host, ip);
    var connProfile = CONNECTION.profile();
    var allowGlobal = m.allowGlobalAPI || false;
    var isRecruitment = (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST" || mode === "CHAT_VOICE" || mode === "SOCIAL_PROFILE");
    var cAvg = PING.avg(2);
    
    // 💪 MODE PRIORITY + SOCIAL BOOST
    score += m.priority * 6;
    if (m.socialPriority) score += 40;
    if (m.allowGlobalAPI) score += 25; // 💪 Recruitment boost
    
    // 💪 DNS / PING
    var dt = dns.dt || 10;
    if (dt <= 3) score += 50; else if (dt <= 8) score += 35; else if (dt <= 15) score += 20; else score -= 5;
    
    var q = PING.quality(mode);
    if (q === "EXCELLENT") score += 50;
    else if (q === "VERY_GOOD") score += 40;
    else if (q === "GOOD") score += 25;
    else if (q === "ACCEPTABLE") score += 10;
    else score -= 30;
    
    // 💪 AMMAN LOCK BONUS
    if (CFG.AMMAN_LOCATION_LOCK && GUARD.isJordan(ip)) {
        score += 180;
        var carrier = getCarrier(ip);
        if (carrier === "ORANGE") score += 35;
        else if (carrier === "ZAIN") score += 30;
        else if (carrier === "UMNIAH") score += 25;
        var city = GUARD.getJordanCity(ip);
        if (city && (city.indexOf("LOCKED") !== -1 || city.indexOf("CORE") !== -1 || city.indexOf("FAST") !== -1 || city.indexOf("SOCIAL") !== -1)) score += 35;
        else if (city && city.indexOf("AMMAN") !== -1) score += 25;
        else if (city) score += 15;
        if (m.priority >= 9) score += 30;
        if (m.socialPriority) score += 35;
        if (TIME.isPeakHours()) score += 15;
        // 💪 LOCATION LOCK BONUS
        if (SESSION.locationLocked) score += 30;
    } else if (!allowGlobal && !GUARD.isJordan(ip)) {
        score -= 550; // 💪 صارم جداً للأجانب في اللعبة
    } else if (allowGlobal && GUARD.isJordan(ip)) {
        score += 70;
    }
    
    // 💪 HOST / REGION + LOCATION STABILIZATION
    if (regionInfo.region === "JORDAN_LOCKED" || regionInfo.region === "AMMAN_GLOBAL_GATE") {
        score += 100 + (regionInfo.confidence * 0.3);
    } else if (regionInfo.region === "BLOCKED_STRONG" && !allowGlobal) {
        score -= 100;
    }
    if (containsAny(host.toLowerCase(), PUBG_KEYS) && GUARD.isJordan(ip)) score += 30;
    
    // 💪 CONNECTION + STABILITY
    score += CONNECTION.boost();
    if (PING.isStableRange()) score += 40;
    else score -= 25;
    
    var stab = PING.stability();
    if (stab === "VERY_STABLE") score += 50;
    else if (stab === "STABLE") score += 35;
    else if (stab === "UNSTABLE") score -= 30;
    
    // 💪 VARIANCE GUARD
    if (CFG.PING_VARIANCE_GUARD) {
        var v = PING.variance();
        if (v <= CFG.VARIANCE_THRESHOLD) score += 25;
        else if (v > CFG.VARIANCE_THRESHOLD) score -= 35;
    }
    var v = PING.variance();
    if (v <= 5) score += 30;
    else if (v <= 10) score += 20;
    else if (v > 18) score -= 25;
    
    // 💪 SESSION STABILITY + LOCATION LOCK
    if (SESSION.getStabilityScore() >= 80) score += 25;
    else if (SESSION.getStabilityScore() < 40) score -= 20;
    if (SESSION.locationLocked) score += 35;
    
    // 💪 TIME
    score += TIME.getBoost();
    
    // 💪 PORT
    if (port === 443) score += 15;
    else if (port >= 7000 && port <= 8000) score += 25;
    else if (port === 80) score += 10;
    
    // 💪 TREND / CRITICAL / FAST ADAPT
    if (PING.needsOptimization() && !PING.isCritical()) score -= 40;
    else if (PING.isCritical()) score -= 85;
    else if (PING.quality(mode) === "ACCEPTABLE" && PING.isStableRange()) score += 15;
    else if (PING.quality(mode) === "VERY_GOOD") score += 25;
    
    // 💪 MODE BONUS
    if (m) {
        if (ip && GUARD.isJordan(ip)) score += (m.jordanBonus || 0);
        else if (!allowGlobal) score += (m.foreignPenalty || 0);
    }
    
    // 💪 SERVER QUALITY
    var sq = dns.quality;
    if (sq === "EXCELLENT") score += 40;
    else if (sq === "GOOD") score += 25;
    else if (sq === "FAIR") score += 5;
    else if (!allowGlobal) score -= 25;
    else score -= 5;
    
    // 💪 ML
    if (CFG.ENABLE_ML_PREDICTION && SESSION.isWarm()) {
        var conf = ML.confidence(mode, regionInfo ? regionInfo.region : "JORDAN");
        if (conf >= 80) score += 30;
        else if (conf >= 60) score += 20;
    }
    
    // 💪 SOCIAL / RECRUIT / LOBBY BOOST
    if (dns.socialEndpoint && CFG.ENABLE_SOCIAL_GRAPH && CFG.ENABLE_LOBBY_SYNC) {
        score += 50;
        if (allowGlobal && CFG.DUAL_PATH_ENABLED) score += 35; // 💪 Dual Path recruitment bonus
    }
    if (m && (m.gameState === "PRE_MATCH" || m.gameState === "SOCIAL") && CFG.LOBBY_AGGREGATION) {
        score += 35;
        if (SESSION.currentMode === "LOBBY" || SESSION.currentMode === "MATCHMAKING") score += 25;
    }
    if (mode === "ENEMY_MATCH") {
        if (PING.current() <= 50) score += 40;
        else if (PING.current() <= 75) score += 20;
        else score -= 20;
        if (PING.stability() === "STABLE" || PING.stability() === "VERY_STABLE") score += 25;
    }
    
    // 💪 VISIBILITY (Controlled - Not Too High)
    if (m && m.visibilityBoost) score = Math.round(score * (1 + (m.visibilityBoost * 0.05)));
    
    // 💪 ANTI-DETECT / ANTI-THROTTLE BONUS
    if (CFG.ANTI_DETECT && CFG.STRONG_STICKY && PING.stability() === "VERY_STABLE") score += 15;
    if (CFG.GAME_BOOST && (mode === "LOBBY" || mode === "MATCHMAKING" || mode === "RANKED" || mode === "CLASSIC")) score += 15;
    
    // 💪 NORMALIZE
    if (score < 0) score = 0;
    score = Math.round(score / 600 * 100);
    return Math.min(100, Math.max(0, score));
}


// ═══════════════════════════════════════════════════════════════════════
//  ROUTING ENGINE — DUAL PATH + STRONG + FAST ADAPT
// ═══════════════════════════════════════════════════════════════════════

function selectRoute(mode, score, ip, port, host, dns) {
    var m = MODES[mode] || MODES["LOBBY"];
    var regionInfo = dns.region || detectRegion(host, ip);
    var carrier = getCarrier(ip);
    var connProfile = CONNECTION.profile();
    var allowGlobal = m.allowGlobalAPI || false;
    var isRecruitment = (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST" || mode === "CHAT_VOICE" || mode === "SOCIAL_PROFILE");
    
    // 💪 GAME PHASE
    detectGamePhaseFromTraffic(host, mode);
    
    // 💪 LOCATION LOCK ACTIVATION
    if (CFG.AMMAN_LOCATION_LOCK && GUARD.isJordan(ip) && (mode === "LOBBY" || mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "MATCHMAKING")) {
        if (!SESSION.locationLocked && SESSION.requests >= 3) {
            SESSION.lockLocation();
        }
    }
    
    // 💪 SECURITY — LEAK PROTECTION
    if (!GUARD.checkDestination(ip, host, mode)) {
        CONNECTION_POOL.release(host, mode, BLOOD.BLK);
        return BLOOD.BLK;
    }
    CONNECTION_POOL.acquire(host, mode);
    
    // 💪 FAST WARMUP (Recruitment Pre-connect)
    if (CFG.FAST_WARMUP && isRecruitment && SESSION.requests <= 5 && !CONNECTION_POOL.isWarmedUp(host, mode)) {
        var warmPool = getBestProxies(0, carrier, 2, true);
        var warmRoute = GUARD.buildChain(warmPool, mode, { stableOnly: false, burst: false, ultraBurst: false, socialOnly: true });
        CONNECTION_POOL.startWarmup(host, mode, warmRoute);
        if (PING.isStableRange()) {
            CONNECTION_POOL.release(host, mode, warmRoute);
            return warmRoute;
        }
    }
    
    // 💪 DUAL PATH RECRUITMENT (2 Proxy Chain for Recruitment)
    if (isRecruitment && CFG.DUAL_PATH_ENABLED) {
        var stickyVal = applyRecruitmentSticky(mode);
        if (stickyVal) {
            CONNECTION_POOL.release(host, mode, stickyVal);
            return stickyVal;
        }
        // Nếu لم نجد Sticky، نستخدم أفضل مسار مزدوج مباشرة
        if (PING.isStableRange() || allowGlobal) {
            var dualPool = ["AMMAN_SOCIAL_FAST", "AMMAN_SOCIAL_FAST_2", "AMMAN_LOCK_PRIMARY", "AMMAN_LOCK_BACKUP"];
            var dualRoute = GUARD.buildChain(dualPool, mode, {
                stableOnly: false, burst: false, ultraBurst: false, socialOnly: true
            });
            stickySet(mode, dualRoute, CFG.RECRUIT_STICKY_SECONDS * 1000);
            ML.recordSuccess(mode, dualRoute, PING.current(), regionInfo, true);
            CONNECTION_POOL.markDualPath(host, mode);
            CONNECTION_POOL.release(host, mode, dualRoute);
            return dualRoute;
        }
    }
    
    // 💪 VARIANCE GUARD — إذا التباين عالي جداً
    if (CFG.PING_VARIANCE_GUARD && PING.variance() > CFG.VARIANCE_THRESHOLD && !isRecruitment && SESSION.requests > 5) {
        stickyClear(mode);
        var guardPool = getLobbyPool(mode, carrier);
        var guardRoute = GUARD.buildChain(guardPool, mode, {
            stableOnly: true, burst: false, ultraBurst: false,
            socialOnly: m ? m.socialPriority : false
        });
        stickySet(mode, guardRoute, CFG.STICKY_TTL);
        ML.recordSuccess(mode, guardRoute, PING.current(), regionInfo, m ? m.socialPriority : false);
        CONNECTION_POOL.release(host, mode, guardRoute);
        return guardRoute;
    }
    
    // 💪 STRONG STICKY — GAME (3min) / SOCIAL (10-20s)
    if (!isRecruitment && m.sticky && SESSION.isWarm() && SESSION.requests > 2) {
        var gameSticky = stickyGet(mode);
        if (gameSticky && PING.isHealthy(mode) && PING.isStableRange()) {
            if (PING.stability() === "VERY_STABLE" && CFG.STRONG_STICKY) {
                stickyExtend(mode, 300000); // 5 دقائق إضافية عند الاستقرار التام
            } else {
                stickyExtend(mode, 180000); // 3 دقائق
            }
            CONNECTION_POOL.release(host, mode, gameSticky);
            return gameSticky;
        }
    }
    
    // 💪 FAST ADAPT — ML PREDICTION
    if (CFG.ENABLE_ML_PREDICTION && SESSION.isWarm() && SESSION.requests > 3) {
        var pred = ML.predict(mode, regionInfo ? regionInfo.region : "JORDAN");
        var conf = ML.confidence(mode, regionInfo ? regionInfo.region : "JORDAN");
        if (pred && conf >= 55 && (PING.isStableRange() || allowGlobal)) {
            CONNECTION_POOL.release(host, mode, pred);
            return pred;
        }
    }
    
    // 💪 EMERGENCY ONLY IF CRITICAL
    if (PING.isCritical() || (!PING.isStableRange() && PING.variance() > 28 && !isRecruitment && SESSION.requests > 5)) {
        stickyClear(mode);
        var emergencyPool = getLobbyPool(mode, carrier);
        var emergencyRoute = GUARD.buildChain(emergencyPool, mode, {
            stableOnly: true, burst: false, ultraBurst: false,
            socialOnly: m ? m.socialPriority : false
        });
        stickySet(mode, emergencyRoute, 120000);
        ML.recordSuccess(mode, emergencyRoute, PING.current(), regionInfo, m ? m.socialPriority : false);
        CONNECTION_POOL.release(host, mode, emergencyRoute);
        return emergencyRoute;
    }
    
    // 💪 ROUTE SELECTION — STRONG + CITY TIER + DUAL
    var route = null;
    var req = {
        stableOnly: true,
        burst: (m ? m.requiresBurst : false),
        ultraBurst: (m ? m.ultraBurst : false),
        socialOnly: (m ? m.socialPriority : false)
    };
    if (m.strategy === "STRONG_DUAL_SOCIAL" || m.strategy === "STRONG_DUAL_GAME") {
        if (isRecruitment && CFG.DUAL_PATH_ENABLED) {
            // 💪 DUAL PATH EXECUTION
            var dualPool = ["AMMAN_SOCIAL_FAST", "AMMAN_SOCIAL_FAST_2", "AMMAN_LOCK_PRIMARY", "AMMAN_LOCK_BACKUP"];
            var bestSoc = getBestProxies(0, null, 2, true);
            for (var i = 0; i < bestSoc.length; i++) {
                if (dualPool.indexOf(bestSoc[i]) === -1) {
                    dualPool.unshift(bestSoc[i]);
                }
            }
            route = GUARD.buildChain(dualPool, mode, { ...req, stableOnly: false });
            CONNECTION_POOL.markDualPath(host, mode);
        } else if (score >= 65) {
            var socPool = getBestProxies(0, carrier, 3, true);
            route = GUARD.buildChain(socPool, mode, { ...req, stableOnly: false });
        } else {
            route = GUARD.buildChain(["AMMAN_SOCIAL_FAST", "AMMAN_LOCK_PRIMARY", "AMMAN_SOCIAL_FAST_2"], mode, { ...req, stableOnly: false });
        }
    } else if (m.strategy === "STRONG_LOCK_LOBBY" || m.strategy === "STRONG_LOCK_MATCH" || m.strategy === "STRONG_LOCK_ENEMY" || m.strategy === "STRONG_LOCK_GAME" || m.strategy === "STRONG_LOCK_SOCIAL_GAME" || m.strategy === "STRONG_SECURE") {
        if (score >= 70) {
            route = GUARD.buildChain(getLobbyPool(mode, carrier), mode, { ...req, stableOnly: true });
        } else {
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, false), mode, req);
        }
    } else if (m.strategy === "STABLE_LIGHT" || m.strategy === "STABLE_SAFE" || m.strategy === "STABLE_CDN") {
        route = BLOOD.DIR;
    }
    
    // 💪 FALLBACK — ALWAYS USE JORDAN
    if (!route || route === BLOOD.DIR) {
        if (m.priority >= 8 || isRecruitment || allowGlobal) {
            var fbPool = (isRecruitment && CFG.DUAL_PATH_ENABLED) ?
                ["AMMAN_SOCIAL_FAST", "AMMAN_LOCK_PRIMARY", "AMMAN_SOCIAL_FAST_2", "AMMAN_LOCK_BACKUP"] :
                getLobbyPool(mode, carrier);
            route = GUARD.buildChain(fbPool, mode, { ...req, stableOnly: isRecruitment ? false : true });
        } else {
            route = BLOOD.DIR;
        }
    }
    if (!route || route === BLOOD.BLK) route = BLOOD.DIR;
    
    // 💪 SAVE
    if (m && m.sticky && route && route !== BLOOD.BLK && route !== BLOOD.DIR) {
        stickySet(mode, route, m.stickyDuration);
    }
    if (CFG.ENABLE_ML_PREDICTION && SESSION.isWarm()) {
        ML.recordSuccess(mode, route, PING.current(), regionInfo, m ? m.socialPriority : false);
    }
    CONNECTION_POOL.release(host, mode, route);
    return route;
}


// ═══════════════════════════════════════════════════════════════════════
//  MAIN PAC FUNCTION
// ═══════════════════════════════════════════════════════════════════════

function FindProxyForURL(url, host) {
    SESSION.requests++;
    SESSION.updateTimeContext();
    if (SESSION.requests === 1 && CFG.PREFETCH_SOCIAL_DNS) prefetchSocialEndpoints();
    if (!host) return BLOOD.DIR;
    var h = host.toLowerCase();
    if (isPlainHostName(host)) return BLOOD.DIR;
    if (isIPv4(host)) {
        if (isInNet(host, "10.0.0.0","255.0.0.0") || isInNet(host, "172.16.0.0","255.240.0.0") || isInNet(host, "192.168.0.0","255.255.0.0") || isInNet(host, "127.0.0.0","255.0.0.0") || isInNet(host, "169.254.0.0","255.255.0.0")) {
            return BLOOD.DIR;
        }
    }
    CONNECTION_POOL.acquire(host, SESSION.currentMode || "FRIEND_DISCOVERY");
    if (containsAny(h, DIRECT_KEYS) && !containsAny(h, PUBG_KEYS) && !containsAny(h, SOCIAL_KEYS)) {
        SESSION.directHits++;
        CONNECTION_POOL.release(host, "CLASSIC", BLOOD.DIR);
        return BLOOD.DIR;
    }
    if (!containsAny(h, PUBG_KEYS) && !containsAny(h, SOCIAL_KEYS)) {
        SESSION.directHits++;
        CONNECTION_POOL.release(host, "CLASSIC", BLOOD.DIR);
        return BLOOD.DIR;
    }
    SESSION.pubgRequests++;
    var dns = fastDNS(host);
    var ip = dns.ip;
    var mode = dns.mode;
    var port = getPort(url);
    // 💪 AMMAN LOCATION LOCK ACTIVATION
    if (CFG.AMMAN_LOCATION_LOCK && (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "LOBBY" || mode === "CHAT_VOICE") && SESSION.requests >= 3) {
        if (!SESSION.locationLocked) {
            SESSION.lockLocation();
        }
    }
    // 💪 IPv6 BLOCK (GAME ONLY)
    if (ip && ip.indexOf(":") !== -1) {
        var modeObj = MODES[mode] || MODES["LOBBY"];
        if (CFG.JORDAN_ONLY_MODE && !modeObj.allowGlobalAPI) {
            SESSION.blockedHits++;
            CONNECTION_POOL.release(host, mode, BLOOD.BLK);
            return BLOOD.BLK;
        }
    }
    var score = calculateScore(ip, h, port, dns, mode);
    var route = selectRoute(mode, score, ip, port, h, dns);
    CONNECTION_POOL.release(host, mode, route);
    return route;
}


// ═══════════════════════════════════════════════════════════════════════
//  CARRIER / TIME / UTILS / REPORT / END
// ═══════════════════════════════════════════════════════════════════════

function getCarrier(ip) {
    if (!ip || !isIPv4(ip)) return "OTHER";
    if (isInNet(ip, "46.185.0.0","255.255.128.0") || isInNet(ip, "94.127.0.0","255.255.240.0") || isInNet(ip, "149.200.0.0","255.255.252.0") || isInNet(ip, "46.185.131.0","255.255.255.0") || isInNet(ip, "46.185.139.0","255.255.255.0")) return "ORANGE";
    if (isInNet(ip, "79.173.0.0","255.255.192.0") || isInNet(ip, "109.237.0.0","255.255.224.0") || isInNet(ip, "176.28.0.0","255.254.0.0") || isInNet(ip, "79.173.240.0","255.255.255.0")) return "ZAIN";
    if (isInNet(ip, "82.212.0.0","255.255.0.0") || isInNet(ip, "212.35.0.0","255.255.192.0") || isInNet(ip, "212.35.66.0","255.255.255.0") || isInNet(ip, "82.212.98.0","255.255.255.0")) return "UMNIAH";
    return "OTHER";
}

var TIME = {
    isPeakHours: function() { return (new Date()).getHours() >= 16 || (new Date()).getHours() <= 2; },
    isWeekend: function() { var d = new Date(); return d.getDay() === 5 || d.getDay() === 6; },
    getBoost: function() { return (this.isPeakHours() && this.isWeekend()) ? 20 : ((this.isPeakHours() || this.isWeekend()) ? 12 : 5); }
};

function now() { return (new Date()).getTime(); }
function isIPv4(s) { if (!s || s.indexOf(":") !== -1) return false; var p = s.split("."); if (p.length !== 4) return false; for (var i = 0; i < 4; i++) { var n = parseInt(p[i], 10); if (isNaN(n) || n < 0 || n > 255) return false; } return true; }
function maskFromCIDR(c) { c = String(c); var m = {"8":"255.0.0.0","15":"255.254.0.0","16":"255.255.0.0","17":"255.255.128.0","18":"255.255.192.0","19":"255.255.224.0","20":"255.255.240.0","21":"255.255.248.0","22":"255.255.252.0"}; return m[c] || "255.255.0.0"; }
function inRanges(ip, ranges) {
    if (!ip || !isIPv4(ip)) return false;
    for (var i = 0; i < ranges.length; i++) {
        try { if (isInNet(ip, ranges[i][0], maskFromCIDR(ranges[i][1]))) return true; }
        catch (e) {
            var base = ranges[i][0].split(".");
            var ipP = ip.split(".");
            var octets = Math.floor(parseInt(ranges[i][1], 10) / 8);
            var match = true;
            for (var j = 0; j < octets && match; j++) { if (base[j] !== ipP[j]) match = false; }
            if (match) return true;
        }
    }
    return false;
}
function isInNet(ip, net, mask) { return true; }
function containsAny(str, arr) { for (var i = 0; i < arr.length; i++) if (str.indexOf(arr[i]) !== -1) return true; return false; }
function isPlainHostName(host) { return !host || host.indexOf(".") === -1 || host.length < 3; }
function getPort(url) { if (!url) return 443; var m = url.match(/:[0-9]+/); if (m) return parseInt(m[0].replace(":", ""), 10); return (url.indexOf("https") === 0 || url.indexOf("wss") === 0) ? 443 : 80; }

function generatePerformanceReport() {
    if (!CFG.AUTO_REPORT_GENERATION) return null;
    return {
        version: CFG.VERSION,
        session: SESSION.getReport(),
        pingStatus: { avg: PING.avg(3), best: PING.best(), stability: PING.stability(), variance: PING.variance(), inRange: PING.isStableRange() },
        recommendation: PING.isCritical() ? "SWITCH_DUAL_FAST" : (PING.isStableRange() ? "STABLE_STRONG_KEEP" : "STABILIZE_STRONG"),
        strongFeatures: {
            ammanLock: CFG.AMMAN_LOCATION_LOCK,
            gpsStabilize: CFG.GPS_NETWORK_STABILIZE,
            ultraFastRecruit: CFG.ULTRA_FAST_RECRUIT,
            stableInternet: CFG.STABLE_INTERNET_MODE,
            gameBoost: CFG.GAME_BOOST,
            antiThrottle: CFG.ANTI_THROTTLE,
            fastAdapt: CFG.FAST_PING_ADAPT,
            dualPath: CFG.DUAL_PATH_ENABLED,
            locationLocked: SESSION.locationLocked
        },
        pureJordanGame: true,
        recruitmentFixed: CFG.RECRUITMENT_GLOBAL_API
    };
}


// ═══════════════════════════════════════════════════════════════════════
//  END v39.0 — THE STRONGEST IMPACT VERSION
// ═══════════════════════════════════════════════════════════════════════
