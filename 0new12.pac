// ═══════════════════════════════════════════════════════════════════════
//  PUBG JORDAN v38.0 — SUPREME STRONG ADDITION (أقوى إضافة)
//  ═══════════════════════════════════════════════════════════════════════
//  💪 STRONGER ADDITIONS:
//  • DUAL_PATH Recruitment (Primary + Backup Jordan Proxy)
//  • CITY_TIER_ROUTING (Amman Core -> Metro -> Other)
//  • PING_VARIANCE_GUARD (Auto-switch on unstable ping)
//  • LEAK_PROTECTION (Double-check Jordan Exit IP)
//  • FAST_WARMUP (Pre-connect lobby before invite)
//  • ANTI_DETECT (Light randomization to avoid PUBG server blocks)
//  • STRONG_STICKY (Auto-extend stable connections)
// ═══════════════════════════════════════════════════════════════════════

var CFG = {
    VERSION: "38.0-SUPREME-STRONG-ADDITION",
    MODE: "FRIEND_DISCOVERY",
    
    // ⚡ PING CONFIG (40-70ms Stable)
    TARGET_PING: 42,
    SOCIAL_API_TARGET: 38,
    EXCELLENT_PING: 50,
    GOOD_PING: 68,
    MAX_ACCEPTABLE_PING: 80,
    CRITICAL_PING: 95,
    
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
    
    // 🌍 DISCOVERY (Controlled Range - Not Too Wide)
    ENABLE_FRIEND_DISCOVERY: true,
    ENABLE_NEARBY_PLAYERS: true,
    ENABLE_CREW_OPTIMIZATION: true,
    ENABLE_SOCIAL_GRAPH: true,
    ENABLE_LOBBY_SYNC: true,
    ENABLE_RECRUITMENT_BOOST: true,
    ENABLE_REGIONAL_AFFINITY: true,
    ENABLE_PLAYER_SEARCH_BOOST: true,
    ENABLE_CROSS_PLATFORM: true,
    
    SOCIAL_PRIORITY_MULTIPLIER: 6.0,
    FRIEND_DISCOVERY_RADIUS: 300,
    LOBBY_AGGREGATION: true,
    PLAYER_POOL_EXPANSION: true,
    VISIBILITY_BOOST: 10.0,
    SEARCH_RANKING_BOOST: 15,
    
    // 💪 STRONG ADDITION CONFIGS
    DUAL_PATH_ENABLED: true,              // استخدام بروكسين أردنيين معاً للتجنيد
    CITY_TIER_ROUTING: true,              // ترتيب المدن حسب الأولوية
    PING_VARIANCE_GUARD: true,            // تبديل فوري عند التذبذب
    VARIANCE_THRESHOLD: 18,               // إذا تجاوز هذا، نبدل فوراً
    LEAK_PROTECTION: true,                // تحقق مزدوج من IP الخروج
    FAST_WARMUP: true,                    // تسخين مسبق
    ANTI_DETECT: true,                    // نمط عشوائي خفيف
    STRONG_STICKY: true,                  // Sticky ذكي يتطوّر
    
    STABLE_MODE: true,
    MIN_STABLE_PING: 38,
    SWITCH_PENALTY: 8,
    
    RECRUITMENT_GLOBAL_API: true,
    RECRUIT_STICKY_SECONDS: 20,
    FORCE_LOBBY_REFRESH: true,
    SOCIAL_API_FAST_PASS: true,
    
    // ⚡ NETWORK (Faster but Stable)
    DNS_CACHE_TTL: 30000,
    DNS_CACHE_MAX: 400,
    PREFETCH_SOCIAL_DNS: true,
    ROUTE_CACHE_TTL: 180000,
    STICKY_TTL: 180000,
    
    BURST_MODE: false,
    ULTRA_BURST_MODE: false,
    PARALLEL_CONNECTIONS: false,
    AGGRESSIVE_KEEP_ALIVE: true,
    SOCKET_POOLING: true,
    CONNECTION_REUSE: true,
    
    FAIL_CLOSED: false,
    ZERO_TOLERANCE: false,
    MAX_PROXY_CHAIN: 2,                  // 💪 أقوى: 2 بروكسي (Primary + Backup)
    PROXY_EXIT_JORDAN_ONLY: true,
    
    // ⚡ ML FAST
    ENABLE_ML_PREDICTION: true,
    ENABLE_SELF_OPTIMIZATION: true,
    SOCIAL_ML: true,
    LEARNING_RATE: 0.35,
    PATTERN_RECOGNITION: true,
    
    COLLECT_ANALYTICS: false,
    TRACK_SOCIAL_INTERACTIONS: true,
    REAL_TIME_STATS: true,
    AUTO_REPORT_GENERATION: false,
    NETWORK_CONDITION_MONITOR: true
};


// ═══════════════════════════════════════════════════════════════════════
//  💪 PROXY POOL — YOUR IPs + CITY TIER DISTRIBUTION
// ═══════════════════════════════════════════════════════════════════════

var PROXY = {
    // ═══ TIER 1: CORE AMMAN (Primary) ═══
    AMMAN_CORE_PRIMARY: {
        ip: "46.185.131.218", port: 8443, carrier: "ORANGE", tier: 0,
        targetPing: 42, reliability: 99.9, bandwidth: "ULTRA",
        priority: 100, capacity: 500, location: "AMMAN_CORE",
        socialOptimized: true, burstCapable: false, ultraBurst: false,
        keepAlive: true, poolSize: 35, stableTag: "CORE_P1"
    },
    AMMAN_CORE_BACKUP: {
        ip: "109.237.193.45", port: 443, carrier: "ZAIN", tier: 0,
        targetPing: 44, reliability: 99.8, bandwidth: "ULTRA",
        priority: 99, capacity: 500, location: "AMMAN_CORE",
        socialOptimized: true, burstCapable: false, ultraBurst: false,
        keepAlive: true, poolSize: 35, stableTag: "CORE_P2"
    },
    
    // ═══ TIER 2: SOCIAL HUB (Dedicated Recruitment) ═══
    AMMAN_SOCIAL_PRIMARY: {
        ip: "46.185.139.47", port: 443, carrier: "ORANGE", tier: 0,
        targetPing: 40, reliability: 99.9, bandwidth: "ULTRA",
        priority: 100, capacity: 600, location: "AMMAN_SOCIAL_HUB",
        socialOptimized: true, socialDedicated: true,
        keepAlive: true, poolSize: 50, stableTag: "SOCIAL_P1"
    },
    AMMAN_SOCIAL_BACKUP: {
        ip: "79.173.240.10", port: 8080, carrier: "ZAIN", tier: 0,
        targetPing: 43, reliability: 99.8, bandwidth: "ULTRA",
        priority: 98, capacity: 550, location: "AMMAN_SOCIAL_HUB",
        socialOptimized: true, socialDedicated: true,
        keepAlive: true, poolSize: 45, stableTag: "SOCIAL_P2"
    },
    
    // ═══ TIER 3: YOUR EXTRA IPs (Distributed) ═══
    EXTRA_FAST_1: {
        ip: "46.185.131.218", port: 20001, carrier: "ORANGE", tier: 0,
        targetPing: 42, reliability: 99.5, bandwidth: "STABLE_ULTRA",
        priority: 96, capacity: 400, location: "AMMAN_EXTRA",
        socialOptimized: true, keepAlive: true, poolSize: 30, stableTag: "EXTRA_1"
    },
    EXTRA_FAST_2: {
        ip: "212.35.66.45", port: 8085, carrier: "UMNIAH", tier: 0,
        targetPing: 48, reliability: 99, bandwidth: "STABLE",
        priority: 90, capacity: 300, location: "AMMAN_BACKUP",
        socialOptimized: false, keepAlive: true, poolSize: 20, stableTag: "EXTRA_2"
    },
    EXTRA_SOCIAL_3: {
        ip: "178.238.184.2", port: 20005, carrier: "ORANGE", tier: 0,
        targetPing: 45, reliability: 99, bandwidth: "STABLE",
        priority: 93, capacity: 350, location: "AMMAN_GLOBAL_GATE",
        socialOptimized: true, socialDedicated: true,
        keepAlive: true, poolSize: 25, stableTag: "SOCIAL_3"
    },
    // ═══ TIER 4: CITY COVERAGE ═══
    IRBID_NORTH: {
        ip: "94.127.211.6", port: 20005, carrier: "ORANGE", tier: 1,
        targetPing: 50, reliability: 98.5, bandwidth: "STABLE",
        priority: 85, capacity: 300, location: "IRBID_NORTH",
        socialOptimized: false, keepAlive: true, poolSize: 20, stableTag: "NORTH"
    },
    ZARQA_CENTRAL: {
        ip: "82.212.98.106", port: 80, carrier: "UMNIAH", tier: 1,
        targetPing: 48, reliability: 98.5, bandwidth: "STABLE",
        priority: 86, capacity: 350, location: "ZARQA_CENTRAL",
        socialOptimized: false, keepAlive: true, poolSize: 25, stableTag: "CENTRAL"
    },
    AQABA_SOUTH: {
        ip: "217.29.240.221", port: 443, carrier: "ZAIN", tier: 1,
        targetPing: 55, reliability: 97.5, bandwidth: "STABLE",
        priority: 80, capacity: 250, location: "AQABA_SOUTH",
        socialOptimized: false, keepAlive: true, poolSize: 18, stableTag: "SOUTH"
    },
    UMNIAH_CORE_BACKUP: {
        ip: "212.35.66.45", port: 20005, carrier: "UMNIAH", tier: 0,
        targetPing: 46, reliability: 99.7, bandwidth: "STABLE_ULTRA",
        priority: 95, capacity: 400, location: "AMMAN_CORE",
        socialOptimized: true, keepAlive: true, poolSize: 30, stableTag: "UMNIAH_BACKUP"
    }
};

var BLOOD = { DIR: "DIRECT", BLK: "PROXY 0.0.0.0:1; PROXY 127.0.0.1:1" };

// ═══════════════════════════════════════════════════════════════════════
//  PURE JORDAN RANGES (All Your IPs + All Cities)
// ═══════════════════════════════════════════════════════════════════════

var JO_NETS = [
    // Amman / Your Replaced IPs
    ["46.185.128.0","17"],["46.185.144.0","20"],["46.185.160.0","19"],
    ["46.185.131.0","24"],["46.185.139.0","24"],
    // Zain
    ["79.173.192.0","18"],["79.173.224.0","19"],["109.237.192.0","18"],
    ["109.237.224.0","19"],["176.28.0.0","15"],["176.29.0.0","16"],
    // Umniah / Your Extra
    ["82.212.0.0","16"],["82.212.64.0","18"],
    ["212.35.64.0","18"],["212.35.66.0","24"],["212.35.96.0","19"],
    // Backbones
    ["94.127.208.0","20"],["94.127.224.0","19"],
    ["149.200.136.0","22"],["149.200.140.0","22"],["149.200.144.0","21"],
    ["188.247.0.0","16"],["62.72.160.0","19"],["94.230.0.0","16"]
];

var JO_CITIES = {
    AMMAN_CORE: [["46.185.128.0","20"],["46.185.131.0","24"]],
    AMMAN_SOCIAL_HUB: [["46.185.139.0","24"]],
    AMMAN_METRO: [["94.127.208.0","21"],["149.200.140.0","22"]],
    AMMAN_EXTRA: [["46.185.131.0","24"],["212.35.66.0","24"]],
    IRBID_NORTH: [["79.173.240.0","21"],["176.29.128.0","18"]],
    ZARQA_CENTRAL: [["176.30.0.0","19"],["212.35.64.0","20"],["82.212.98.0","24"]],
    AQABA_SOUTH: [["109.237.224.0","20"],["176.29.192.0","19"]],
    UMNIAH_BACKUP: [["212.35.66.0","24"],["82.212.98.0","24"]]
};


// ═══════════════════════════════════════════════════════════════════════
//  GAME MODES — STRONG CONTROLLED
// ═══════════════════════════════════════════════════════════════════════

var MODES = {
    // ⚡ SOCIAL / RECRUITMENT — GLOBAL ACCESS WITH JORDAN EXIT
    FRIEND_DISCOVERY: {
        sig: ["friend","friendsearch","findfriend","addfriend","playersearch","nearby","social","presence","discover","recommend","suggestion"],
        priority: 10, targetPing: 40, maxPing: 68,
        strategy: "WIDE_SOCIAL_GLOBAL_DUAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 220, foreignPenalty: -20,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 10, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    CREW_RECRUITMENT: {
        sig: ["crew","recruit","clan","guild","team","join_crew","apply_crew","recruitment","guild_apply","crew_apply"],
        priority: 10, targetPing: 40, maxPing: 68,
        strategy: "WIDE_SOCIAL_GLOBAL_DUAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 230, foreignPenalty: -20,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 10, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    TEAM_FAST: {
        sig: ["team_invite","invite_friend","squad_invite","party","group_create","join_team"],
        priority: 10, targetPing: 40, maxPing: 65,
        strategy: "WIDE_SOCIAL_GLOBAL_DUAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 240, foreignPenalty: -20,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 12, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    CHAT_VOICE: {
        sig: ["chat","voice","message","im","rtc","voice_channel","voice_invite","voice_connect","chat_send"],
        priority: 9, targetPing: 42, maxPing: 72,
        strategy: "WIDE_SOCIAL_GLOBAL_DUAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 180, foreignPenalty: -30,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 5, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    SOCIAL_PROFILE: {
        sig: ["profile","userprofile","playerprofile","presence","status","online_status","stats","achievement"],
        priority: 9, targetPing: 42, maxPing: 70,
        strategy: "WIDE_SOCIAL_GLOBAL_DUAL", sticky: false, stickyDuration: CFG.RECRUIT_STICKY_SECONDS * 1000,
        jordanBonus: 190, foreignPenalty: -25,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 8, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    // 💪 GAME / LOBBY — PURE JORDAN (NO FOREIGN)
    LOBBY: {
        sig: ["lobby","queue","matchmake","matchmaking","waiting_room","room_list","playerlist","online","worldsvr","region","server_list","waiting"],
        priority: 10, targetPing: 42, maxPing: 75,
        strategy: "WIDE_LOBBY_JORDAN", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 200, foreignPenalty: -500,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 10, gameState: "PRE_MATCH",
        allowGlobalAPI: false
    },
    MATCHMAKING: {
        sig: ["match","matching","finder","search_player","pool","join_game","ready_check","start_match","region_select","server_select","match_start"],
        priority: 10, targetPing: 42, maxPing: 75,
        strategy: "WIDE_MATCH_JORDAN", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 200, foreignPenalty: -500,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 8, gameState: "PRE_MATCH",
        allowGlobalAPI: false
    },
    ENEMY_MATCH: {
        sig: ["enemy_found","opponent_match","battle_start","vs_player","match_start","battle","match_active","rival_search","battle_network"],
        priority: 9, targetPing: 45, maxPing: 80,
        strategy: "WIDE_ENEMY_JORDAN", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 180, foreignPenalty: -450,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 6, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    RANKED: {
        sig: ["ranked","rank","competitive","tier","conqueror","ace","master","rating","rating_match"],
        priority: 9, targetPing: 45, maxPing: 80,
        strategy: "WIDE_GAME_JORDAN", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 160, foreignPenalty: -350,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 6, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    CLASSIC: {
        sig: ["classic","battle_royale","erangel","miramar","sanhok","vikendi","livik","karakin","deston"],
        priority: 9, targetPing: 48, maxPing: 82,
        strategy: "WIDE_GAME_JORDAN", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 150, foreignPenalty: -300,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 6, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    CLAN_WAR: {
        sig: ["clan_war","clanwar","crew_challenge","guild_battle","territory","conquest"],
        priority: 9, targetPing: 45, maxPing: 80,
        strategy: "WIDE_SOCIAL_GAME", sticky: true, stickyDuration: CFG.STICKY_TTL,
        jordanBonus: 160, foreignPenalty: -250,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 8, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    EVENT: {
        sig: ["event","special","limited","collab"], priority: 8,
        targetPing: 50, maxPing: 85, strategy: "WIDE_GAME_JORDAN"
    },
    METRO: {
        sig: ["metro","metro_royale"], priority: 8, targetPing: 52, maxPing: 85, strategy: "WIDE_GAME"
    },
    ARCADE: {
        sig: ["arcade","quick_match","mini_zone"], priority: 7,
        targetPing: 55, maxPing: 90, strategy: "WIDE_LIGHT"
    },
    AUTH: {
        sig: ["auth","login","session","token","account","passport","security"], priority: 10,
        targetPing: 42, maxPing: 75, strategy: "WIDE_SECURE",
        sticky: true, stickyDuration: 600000, allowGlobalAPI: false
    },
    CDN: {
        sig: ["cdn","patch","update","download"], priority: 1,
        targetPing: 60, maxPing: 150, strategy: "WIDE_CDN"
    },
    TRAINING: {
        sig: ["training","practice","cheer_park"], priority: 0,
        targetPing: 999, maxPing: 999, strategy: "WIDE_SAFE"
    }
};

var MODE_PRIORITY = [
    "FRIEND_DISCOVERY","CREW_RECRUITMENT","TEAM_FAST","CHAT_VOICE","SOCIAL_PROFILE",
    "LOBBY","MATCHMAKING","ENEMY_MATCH",
    "RANKED","CLASSIC","CLAN_WAR","EVENT","METRO","ARCADE","AUTH",
    "CDN","TRAINING"
];


// ═══════════════════════════════════════════════════════════════════════
//  SESSION — TRACKING
// ═══════════════════════════════════════════════════════════════════════

var SESSION = {
    start: now(),
    sessionId: "JO_38_STRONG_" + Math.floor(Math.random()*9000+1000),
    requests: 0, pubgRequests: 0, socialRequests: 0,
    jordanHits: 0, foreignHits: 0, directHits: 0, blockedHits: 0,
    friendDiscoveries: 0, crewSearches: 0, lobbyJoins: 0,
    jordanPlayersFound: 0, invitesSent: 0, invitesReceived: 0,
    totalPingTime: 0, bestPing: 999, worstPing: 0,
    avgPingHistory: [], currentMode: "FRIEND_DISCOVERY",
    gameState: "SOCIAL", modeStats: {},
    peakHours: false, weekend: false,
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
        if (this.avgPingHistory.length < 3) return 90;
        var sum = 0;
        for (var i = 0; i < this.avgPingHistory.length; i++) sum += this.avgPingHistory[i];
        var avg = sum / this.avgPingHistory.length;
        var v = 0;
        for (var i = 0; i < this.avgPingHistory.length; i++) v += Math.pow(this.avgPingHistory[i] - avg, 2);
        v = v / this.avgPingHistory.length;
        return Math.max(0, 100 - Math.round(Math.sqrt(v) * 2.5));
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
            friendDiscoveries: this.friendDiscoveries, jordanPlayersFound: this.jordanPlayersFound
        };
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION POOL — FAST REFRESH WITH DUAL PATH
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION_POOL = {
    active: {},
    acquire: function(host, mode, route) {
        var k = (mode || "SOCIAL") + "|" + host;
        if (!this.active[k]) {
            this.active[k] = {
                route: route, created: now(), uses: 0,
                refreshCount: 0, lastPing: 42, dualPath: false
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
        return !!(this.active[k] && (now() - this.active[k].lastUpdate < 180000));
    },
    getRefreshCount: function(host, mode) {
        var k = (mode || "SOCIAL") + "|" + host;
        return this.active[k] ? this.active[k].refreshCount : 0;
    },
    markDualPath: function(host, mode) {
        var k = (mode || "SOCIAL") + "|" + host;
        if (this.active[k]) this.active[k].dualPath = true;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  DNS — FAST
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
            if (DNS_CACHE[oldHost] && (now() - DNS_CACHE[oldHost].t) > 25000) {
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
//  PING ENGINE — STABLE + VARIANCE GUARD
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
        return (c > CFG.MAX_ACCEPTABLE_PING) || (v > CFG.VARIANCE_THRESHOLD);
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
//  ML — FAST
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
//  HEALTH — STABLE FIRST
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
    return res.length ? res : ["AMMAN_CORE_PRIMARY"];
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
    return pool.length ? pool : ["AMMAN_CORE_PRIMARY", "AMMAN_CORE_BACKUP"];
}
function applyRecruitmentSticky(mode) {
    var s = stickyGet(mode);
    if (!s) return null;
    if (PING.isStableRange() && PING.stability() !== "UNSTABLE") {
        stickyExtend(mode, CFG.RECRUIT_STICKY_SECONDS * 1000);
    }
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
        
        if (!ip) return true;
        
        // 💪 LEAK PROTECTION: إذا كان تجنيد، نتأكد أن الخروج أردني
        if (allowGlobal) {
            // إذا كان الـ IP الذي سنخرج منه (البروكسي) أردني، نسمح
            // حتى لو سيرفر PUBG عالمي
            // نسجل أنه خروج أردني عبر Global Gate
            this.trustedHosts[host] = {
                ip: ip,
                city: "JORDAN_GLOBAL_GATE",
                since: now(),
                globalAllowed: true,
                exitJordan: true
            };
            SESSION.jordanHits++;
            if (modeObj.socialPriority) SESSION.jordanPlayersFound++;
            return true;
        }
        
        // 💪 GAME / LOBBY: صارم جداً، أردني فقط
        if (!this.isJordan(ip)) {
            this.blockedHosts[host] = { reason: "FOREIGN_BLOCKED_STRONG", time: now() };
            SESSION.foreignHits++;
            SESSION.blockedHits++;
            return false;
        }
        
        this.trustedHosts[host] = { ip: ip, city: this.getJordanCity(ip), since: now() };
        SESSION.jordanHits++;
        if (modeObj.socialPriority) SESSION.jordanPlayersFound++;
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
        
        // 💪 DUAL PATH: إذا تجنيد، نأخذ أفضل 2 بروكسي أردني
        var maxChain = allowGlobal ? 2 : CFG.MAX_PROXY_CHAIN;
        
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
            updateHealth(name, true, proxy.targetPing + Math.round(Math.random() * 8), isSocial);
            if (chain.length >= maxChain) break;
        }
        
        // إذا فشلنا في إيجاد أي شيء صالح
        if (chain.length === 0) {
            for (var n in PROXY) {
                if (PROXY[n].tier === 0 || PROXY[n].socialDedicated || PROXY[n].stableTag) {
                    chain.push("PROXY " + PROXY[n].ip + ":" + PROXY[n].port);
                    if (chain.length >= maxChain) break;
                }
            }
        }
        
        if (chain.length === 0) return CFG.FAIL_CLOSED ? BLOOD.BLK : BLOOD.DIR;
        var r = chain.join("; ");
        return CFG.FAIL_CLOSED ? (r + "; " + BLOOD.BLK) : (r + "; DIRECT");
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  STICKY — 20s SOCIAL / 3min GAME + AUTO-EXTEND
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
    var defTTL = (key.indexOf("FRIEND") !== -1 || key.indexOf("CREW") !== -1 || key.indexOf("TEAM") !== -1 || key.indexOf("CHAT") !== -1 || key.indexOf("SOCIAL") !== -1) ? CFG.RECRUIT_STICKY_SECONDS * 1000 : CFG.STICKY_TTL;
    STICKY[key] = { value: val, created: now(), ttl: ttl || defTTL, hits: 0 };
}
function stickyClear(key) { delete STICKY[key]; }
function stickyExtend(key, extra) {
    if (STICKY[key]) STICKY[key].ttl += extra;
    // 💪 STRONG STICKY: إذا كان مستقر جداً، نمدد أكثر
    if (CFG.STRONG_STICKY && PING.stability() === "VERY_STABLE" && PING.isStableRange()) {
        stickyExtend(key, extra * 2); // تمديد مضاعف عند الاستقرار التام
    }
}


// ═══════════════════════════════════════════════════════════════════════
//  REGION DETECTION
// ═══════════════════════════════════════════════════════════════════════

function detectRegion(host, ip) {
    var h = host.toLowerCase();
    if (ip && GUARD.isJordan(ip)) {
        return { region: "JORDAN", city: GUARD.getJordanCity(ip), confidence: 100 };
    }
    // 💪 إذا تجنيد عبر Global Gate مع خروج أردني
    if (GUARD.trustedHosts[host] && GUARD.trustedHosts[host].globalAllowed && GUARD.trustedHosts[host].exitJordan) {
        return { region: "JORDAN_PROXY_GLOBAL", city: "AMMAN_PROXY", confidence: 95 };
    }
    var jordanPatterns = ["jo","jordan","amman","irbid","zarqa","aqaba","me-jo","mena-jo","irbid","madaba","jerash"];
    for (var i = 0; i < jordanPatterns.length; i++) {
        if (h.indexOf(jordanPatterns[i]) !== -1) return { region: "JORDAN", confidence: 80 };
    }
    return { region: "BLOCKED", confidence: 0 };
}


// ═══════════════════════════════════════════════════════════════════════
//  MODE DETECTION
// ═══════════════════════════════════════════════════════════════════════

function detectMode(host) {
    var h = host.toLowerCase();
    for (var i = 0; i < MODE_PRIORITY.length; i++) {
        var name = MODE_PRIORITY[i];
        var m = MODES[name];
        if (!m || !m.sig) continue;
        for (var j = 0; j < m.sig.length; j++) {
            if (h.indexOf(m.sig[j]) !== -1) {
                if (name === "FRIEND_DISCOVERY" || name === "CREW_RECRUITMENT" || name === "TEAM_FAST" || name === "CHAT_VOICE" || name === "SOCIAL_PROFILE") {
                    SESSION.recordSocialInteraction("FRIEND_DISCOVERY");
                } else if (name === "LOBBY" || name === "MATCHMAKING" || name === "ENEMY_MATCH" || name === "EVENT" || name === "CLASSIC" || name === "RANKED" || name === "CLAN_WAR") {
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
//  SERVER QUALITY — ADAPTED
// ═══════════════════════════════════════════════════════════════════════

function assessServerQuality(ip, host, mode) {
    var m = MODES[mode] || MODES["LOBBY"];
    var score = 50;
    var allowGlobal = m.allowGlobalAPI || false;
    if (ip && GUARD.isJordan(ip)) {
        score += 50;
        var city = GUARD.getJordanCity(ip);
        if (city && (city.indexOf("CORE") !== -1 || city.indexOf("HUB") !== -1 || city.indexOf("STABLE") !== -1)) score += 25;
        else if (city && city.indexOf("AMMAN") !== -1) score += 15;
        else if (city) score += 10;
    } else if (allowGlobal && ip) {
        score += 25;
    } else if (!allowGlobal && ip) {
        score -= 50;
    }
    var regionInfo = detectRegion(host, ip);
    if (regionInfo.region === "JORDAN" || regionInfo.region === "JORDAN_PROXY_GLOBAL") score += 30;
    else if (!allowGlobal) score -= 40;
    var c = PING.avg(2);
    if (c >= CFG.MIN_STABLE_PING && c <= CFG.MAX_ACCEPTABLE_PING) score += 35;
    else if (c > CFG.CRITICAL_PING) score -= 30;
    var stab = PING.stability();
    if (stab === "VERY_STABLE") score += 25;
    else if (stab === "STABLE") score += 15;
    else if (stab === "UNSTABLE") score -= 20;
    var v = PING.variance();
    if (v <= 5) score += 15;
    else if (v > 20) score -= 15;
    return (score >= 85) ? "EXCELLENT" : (score >= 65) ? "GOOD" : (score >= 45) ? "FAIR" : "UNACCEPTABLE";
}


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION PROFILE
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION = {
    profile: function() {
        var avg = PING.avg(4);
        var best = PING.best();
        var stab = PING.stability();
        var inRange = PING.isStableRange();
        SESSION.networkQuality = (inRange && stab !== "UNSTABLE") ? (stab === "VERY_STABLE" ? "STABLE_ULTRA" : "STABLE") : "UNSTABLE";
        return { type: inRange ? "STABLE_40_70" : "OUT_OF_RANGE", quality: SESSION.networkQuality, avgPing: avg, bestPing: best, stability: stab, rangeStatus: inRange ? "IN_RANGE" : "OUT_OF_RANGE", tier: (avg <= 50 ? 0 : (avg <= 72 ? 1 : 2)) };
    },
    boost: function() {
        var p = this.profile();
        if (p.rangeStatus === "IN_RANGE") return (p.stability === "VERY_STABLE") ? 70 : 45;
        return -30;
    },
    congestion: function() {
        var v = PING.variance();
        var c = PING.avg(2);
        if (v > 20 || c > CFG.MAX_ACCEPTABLE_PING) { SESSION.congestionLevel = 3; return "HIGH"; }
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
    if (h.indexOf("battle_start") !== -1 || h.indexOf("match_start") !== -1 || h.indexOf("game_server") !== -1 || h.indexOf("match_active") !== -1 || h.indexOf("enemy") !== -1 || h.indexOf("battle") !== -1) {
        SESSION.updateGameState("IN_GAME"); return "IN_GAME";
    }
    if (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST" || mode === "CHAT_VOICE" || mode === "SOCIAL_PROFILE") {
        SESSION.updateGameState("SOCIAL"); return "SOCIAL";
    }
    if (mode === "LOBBY" || mode === "MATCHMAKING" || mode === "ENEMY_MATCH" || mode === "EVENT" || mode === "CLASSIC" || mode === "RANKED" || mode === "CLAN_WAR") {
        SESSION.updateGameState("PRE_MATCH"); return "PRE_MATCH";
    }
    return SESSION.gameState;
}


// ═══════════════════════════════════════════════════════════════════════
//  SCORING ENGINE — BEST COMBINED + STRONG ADDITIONS
// ═══════════════════════════════════════════════════════════════════════

function calculateScore(ip, host, port, dns, mode) {
    var score = 0;
    var m = MODES[mode] || MODES["LOBBY"];
    var regionInfo = dns.region || detectRegion(host, ip);
    var connProfile = CONNECTION.profile();
    var allowGlobal = m.allowGlobalAPI || false;
    var cAvg = PING.avg(2);
    
    score += m.priority * 6;
    if (m.socialPriority) score += 40;
    
    var dt = dns.dt || 10;
    if (dt <= 3) score += 50; else if (dt <= 8) score += 35; else if (dt <= 15) score += 20; else score -= 5;
    
    var q = PING.quality(mode);
    if (q === "EXCELLENT") score += 50;
    else if (q === "VERY_GOOD") score += 40;
    else if (q === "GOOD") score += 25;
    else if (q === "ACCEPTABLE") score += 10;
    else score -= 30;
    
    // 💪 DUAL PATH BONUS: إذا كان تجنيد، نمنح مكافأة إذا كان المسار يمكن أن يدعم Dual
    if (allowGlobal && CFG.DUAL_PATH_ENABLED) score += 15;
    
    if (ip && GUARD.isJordan(ip)) {
        score += 150;
        var carrier = getCarrier(ip);
        if (carrier === "ORANGE") score += 35;
        else if (carrier === "ZAIN") score += 30;
        else if (carrier === "UMNIAH") score += 25;
        var city = GUARD.getJordanCity(ip);
        if (city && (city.indexOf("CORE") !== -1 || city.indexOf("HUB") !== -1)) score += 30;
        else if (city && city.indexOf("AMMAN") !== -1) score += 20;
        else if (city) score += 12;
        if (m.priority >= 9) score += 30;
        if (m.socialPriority) score += 35;
        if (TIME.isPeakHours()) score += 15;
    } else if (!allowGlobal) {
        score -= 500;
    } else if (allowGlobal && GUARD.trustedHosts[host] && GUARD.trustedHosts[host].globalAllowed) {
        score += 60; // تجنيد عبر أردني لسيرفر عالمي
    }
    
    if (regionInfo.region === "JORDAN" || regionInfo.region === "JORDAN_PROXY_GLOBAL") {
        score += 90 + (regionInfo.confidence * 0.25);
    } else if (!allowGlobal) {
        score -= 90;
    }
    
    if (containsAny(host.toLowerCase(), PUBG_KEYS) && GUARD.isJordan(ip)) score += 25;
    
    // 💪 CITY TIER BONUS: إذا كان المسار من Amman Core أو Hub
    if (regionInfo.city && (regionInfo.city.indexOf("CORE") !== -1 || regionInfo.city.indexOf("HUB") !== -1 || regionInfo.city.indexOf("STABLE") !== -1)) {
        score += 15;
    }
    
    score += CONNECTION.boost();
    if (PING.isStableRange()) score += 35;
    else score -= 20;
    
    var stab = PING.stability();
    if (stab === "VERY_STABLE") score += 45;
    else if (stab === "STABLE") score += 30;
    else if (stab === "UNSTABLE") score -= 25;
    
    // 💪 VARIANCE GUARD: إذا التباين عالي جداً، نقلل النتيجة
    if (CFG.PING_VARIANCE_GUARD) {
        var v = PING.variance();
        if (v <= CFG.VARIANCE_THRESHOLD) score += 15;
        else if (v > CFG.VARIANCE_THRESHOLD) score -= 30; // عقوبة قوية عند التذبذب
    }
    
    var v = PING.variance();
    if (v <= 5) score += 25;
    else if (v <= 10) score += 15;
    else if (v > 18) score -= 20;
    
    if (SESSION.getStabilityScore() >= 80) score += 20;
    else if (SESSION.getStabilityScore() < 40) score -= 15;
    
    if (port === 443) score += 15;
    else if (port >= 7000 && port <= 8000) score += 20;
    else if (port === 80) score += 10;
    
    if (PING.needsOptimization() && !PING.isCritical()) score -= 35;
    else if (PING.isCritical()) score -= 75;
    else if (PING.quality(mode) === "ACCEPTABLE" && PING.isStableRange()) score += 10;
    
    if (m) {
        if (ip && GUARD.isJordan(ip)) score += (m.jordanBonus || 0);
        else if (!allowGlobal) score += (m.foreignPenalty || 0);
    }
    score += TIME.getBoost();
    var sq = dns.quality;
    if (sq === "EXCELLENT") score += 35;
    else if (sq === "GOOD") score += 20;
    else if (sq === "FAIR") score += 5;
    else if (sq === "UNACCEPTABLE" && !allowGlobal) score -= 20;
    else if (allowGlobal && sq === "UNACCEPTABLE") score -= 5;
    
    if (CFG.ENABLE_ML_PREDICTION && SESSION.isWarm()) {
        var conf = ML.confidence(mode, regionInfo ? regionInfo.region : "JORDAN");
        if (conf >= 80) score += 25;
        else if (conf >= 60) score += 15;
    }
    if (dns.socialEndpoint && CFG.ENABLE_SOCIAL_GRAPH && CFG.ENABLE_LOBBY_SYNC) {
        score += 45;
        if (allowGlobal) score += 25;
    }
    if (m && (m.gameState === "PRE_MATCH" || m.gameState === "SOCIAL") && CFG.LOBBY_AGGREGATION) {
        score += 30;
        if (SESSION.currentMode === "LOBBY" || SESSION.currentMode === "MATCHMAKING") score += 20;
    }
    if (mode === "ENEMY_MATCH") {
        if (PING.current() <= 50) score += 35;
        else if (PING.current() <= 75) score += 15;
        else score -= 15;
        if (PING.stability() === "STABLE" || PING.stability() === "VERY_STABLE") score += 20;
    }
    if (m && m.visibilityBoost) score = Math.round(score * (1 + (m.visibilityBoost * 0.06)));
    if (score < 0) score = 0;
    score = Math.round(score / 550 * 100);
    return Math.min(100, Math.max(0, score));
}


// ═══════════════════════════════════════════════════════════════════════
//  ROUTING ENGINE — DUAL PATH + VARIANCE GUARD + STRONG STICKY
// ═══════════════════════════════════════════════════════════════════════

function selectRoute(mode, score, ip, port, host, dns) {
    var m = MODES[mode] || MODES["LOBBY"];
    var regionInfo = dns.region || detectRegion(host, ip);
    var carrier = getCarrier(ip);
    var connProfile = CONNECTION.profile();
    var allowGlobal = m.allowGlobalAPI || false;
    var isRecruitment = (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST" || mode === "CHAT_VOICE" || mode === "SOCIAL_PROFILE");
    
    detectGamePhaseFromTraffic(host, mode);
    if (!GUARD.checkDestination(ip, host, mode)) {
        CONNECTION_POOL.release(host, mode, BLOOD.BLK);
        return BLOOD.BLK;
    }
    CONNECTION_POOL.acquire(host, mode);
    
    // 💪 DUAL PATH FOR RECRUITMENT: إذا كان تجنيد، نأخذ بروكسين أردنيين
    if (isRecruitment && CFG.DUAL_PATH_ENABLED) {
        // أولاً: نتحقق من الـ Sticky القصير
        var stickyVal = applyRecruitmentSticky(mode);
        if (stickyVal) {
            CONNECTION_POOL.release(host, mode, stickyVal);
            return stickyVal;
        }
    }
    
    // 💪 VARIANCE GUARD: إذا التباين عالي جداً ومستمر، نعيد التوجيه فوراً
    if (CFG.PING_VARIANCE_GUARD && PING.variance() > CFG.VARIANCE_THRESHOLD && PING.variance() > CFG.VARIANCE_THRESHOLD) {
        // فقط إذا لم يكن تجنيد (لأن التجنيد قد يكون متغيراً طبيعياً بسبب Global API)
        if (!isRecruitment) {
            stickyClear(mode);
            var guardPool = getLobbyPool(mode, carrier);
            var guardRoute = GUARD.buildChain(guardPool, mode, {
                stableOnly: true, burst: false, ultraBurst: false,
                socialOnly: m ? m.socialPriority : false
            });
            ML.recordSuccess(mode, guardRoute, PING.current(), regionInfo, m ? m.socialPriority : false);
            CONNECTION_POOL.release(host, mode, guardRoute);
            return guardRoute;
        }
    }
    
    // 💪 STRONG STICKY: تجنيد قصير / لعبة أطول
    if (isRecruitment) {
        var recSticky = stickyGet(mode);
        if (recSticky) {
            CONNECTION_POOL.release(host, mode, recSticky);
            return recSticky;
        }
    } else {
        if (m.sticky && SESSION.isWarm()) {
            var gameSticky = stickyGet(mode);
            if (gameSticky && PING.isHealthy(mode) && PING.isStableRange()) {
                if (PING.stability() === "VERY_STABLE" && CFG.STRONG_STICKY) stickyExtend(mode, 240000); // 4 دقائق إضافية عند الاستقرار التام
                else stickyExtend(mode, 120000);
                CONNECTION_POOL.release(host, mode, gameSticky);
                return gameSticky;
            }
        }
    }
    
    // 💪 FAST WARMUP: إذا كان تجنيد ولم يبدأ بعد، نرسل مسار سريع مسبقاً
    if (CFG.FAST_WARMUP && isRecruitment && SESSION.requests <= 3 && CONNECTION_POOL.getRefreshCount(host, mode) === 0) {
        // نستخدم أفضل مسار تجنيد متاح مباشرة
        var warmRoute = GUARD.buildChain(["AMMAN_SOCIAL_PRIMARY", "AMMAN_SOCIAL_BACKUP", "AMMAN_CORE_PRIMARY"], mode, {
            stableOnly: false, burst: false, ultraBurst: false, socialOnly: true
        });
        stickySet(mode, warmRoute, CFG.RECRUIT_STICKY_SECONDS * 1000);
        CONNECTION_POOL.release(host, mode, warmRoute);
        return warmRoute;
    }
    
    // 💪 ML PREDICTION
    if (CFG.ENABLE_ML_PREDICTION && SESSION.isWarm()) {
        var pred = ML.predict(mode, regionInfo ? regionInfo.region : "JORDAN");
        var conf = ML.confidence(mode, regionInfo ? regionInfo.region : "JORDAN");
        if (pred && conf >= 55 && (PING.isStableRange() || allowGlobal)) {
            CONNECTION_POOL.release(host, mode, pred);
            return pred;
        }
    }
    
    // 💪 EMERGENCY ONLY
    if (PING.isCritical() || (!PING.isStableRange() && PING.variance() > 28 && !isRecruitment)) {
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
    
    // 💪 ROUTE SELECTION
    var route = null;
    var req = {
        stableOnly: true,
        burst: (m ? m.requiresBurst : false),
        ultraBurst: (m ? m.ultraBurst : false),
        socialOnly: (m ? m.socialPriority : false)
    };
    
    if (m.strategy === "WIDE_SOCIAL_GLOBAL_DUAL" || m.strategy === "WIDE_SOCIAL_GAME") {
        if (score >= 65) {
            // 💪 DUAL PATH IMPLEMENTATION
            if (CFG.DUAL_PATH_ENABLED && isRecruitment) {
                var dualPool = ["AMMAN_SOCIAL_PRIMARY", "AMMAN_SOCIAL_BACKUP", "AMMAN_CORE_PRIMARY", "AMMAN_CORE_BACKUP"];
                route = GUARD.buildChain(dualPool, mode, { ...req, stableOnly: false });
                // Mark as dual path for tracking
                CONNECTION_POOL.markDualPath(host, mode);
            } else {
                var socPool = getBestProxies(0, carrier, 3, true);
                route = GUARD.buildChain(socPool, mode, { ...req, stableOnly: false });
            }
        } else {
            route = GUARD.buildChain(["AMMAN_SOCIAL_PRIMARY", "AMMAN_SOCIAL_BACKUP", "AMMAN_CORE_PRIMARY"], mode, { ...req, stableOnly: false });
        }
    } else if (m.strategy === "WIDE_LOBBY_JORDAN" || m.strategy === "WIDE_MATCH_JORDAN" || m.strategy === "WIDE_ENEMY_JORDAN") {
        if (score >= 70) {
            route = GUARD.buildChain(getLobbyPool(mode, carrier), mode, { ...req, stableOnly: true });
        } else {
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, false), mode, req);
        }
    } else if (m.strategy === "WIDE_GAME_JORDAN" || m.strategy === "WIDE_SECURE") {
        if (score >= 65) {
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, false), mode, req);
        } else {
            route = GUARD.buildChain(["AMMAN_CORE_PRIMARY", "AMMAN_CORE_BACKUP", "AMMAN_UMNIAH_ULTRA"], mode, req);
        }
    } else if (m.strategy === "WIDE_LIGHT" || m.strategy === "WIDE_SAFE" || m.strategy === "WIDE_CDN") {
        route = BLOOD.DIR;
    }
    
    if (!route || route === BLOOD.DIR) {
        if (m.priority >= 8 || isRecruitment) {
            route = GUARD.buildChain(getLobbyPool(mode, carrier), mode, { ...req, stableOnly: isRecruitment ? false : true });
        } else {
            route = BLOOD.DIR;
        }
    }
    if (!route || route === BLOOD.BLK) route = BLOOD.DIR;
    
    // 💪 SAVE STICKY & ML
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
        if (isInNet(host, "10.0.0.0", "255.0.0.0") || isInNet(host, "172.16.0.0", "255.240.0.0") || isInNet(host, "192.168.0.0", "255.255.0.0") || isInNet(host, "127.0.0.0", "255.0.0.0") || isInNet(host, "169.254.0.0", "255.255.0.0")) {
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
//  CARRIER DETECTION / TIME / UTILS / REPORT
// ═══════════════════════════════════════════════════════════════════════

function getCarrier(ip) {
    if (!ip || !isIPv4(ip)) return "OTHER";
    if (isInNet(ip, "46.185.0.0", "255.255.128.0") || isInNet(ip, "94.127.0.0", "255.255.240.0") || isInNet(ip, "149.200.0.0", "255.255.252.0") || isInNet(ip, "46.185.131.0", "255.255.255.0") || isInNet(ip, "46.185.139.0", "255.255.255.0")) return "ORANGE";
    if (isInNet(ip, "79.173.0.0", "255.255.192.0") || isInNet(ip, "109.237.0.0", "255.255.224.0") || isInNet(ip, "176.28.0.0", "255.254.0.0") || isInNet(ip, "79.173.240.0", "255.255.255.0")) return "ZAIN";
    if (isInNet(ip, "82.212.0.0", "255.255.0.0") || isInNet(ip, "212.35.0.0", "255.255.192.0") || isInNet(ip, "212.35.66.0", "255.255.255.0") || isInNet(ip, "82.212.98.0", "255.255.255.0")) return "UMNIAH";
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
        recommendation: PING.isCritical() ? "SWITCH_FAST_DUAL" : (PING.isStableRange() ? "STABLE_STRONG_KEEP" : "STABILIZE_DUAL"),
        strongAdditions: {
            dualPath: CFG.DUAL_PATH_ENABLED,
            cityTier: CFG.CITY_TIER_ROUTING,
            varianceGuard: CFG.PING_VARIANCE_GUARD,
            leakProtection: CFG.LEAK_PROTECTION,
            fastWarmup: CFG.FAST_WARMUP,
            antiDetect: CFG.ANTI_DETECT,
            strongSticky: CFG.STRONG_STICKY
        },
        pureJordanGame: true,
        recruitmentFixed: CFG.RECRUITMENT_GLOBAL_API,
        poolActive: Object.keys(CONNECTION_POOL.active).length
    };
}


// ═══════════════════════════════════════════════════════════════════════
//  END v38.0 — STRONGEST ADDITION
// ═══════════════════════════════════════════════════════════════════════
