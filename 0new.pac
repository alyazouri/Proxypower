// ═══════════════════════════════════════════════════════════════════════
//  PUBG JORDAN ULTIMATE v32.0 — REPLACED PROXY POOL
//  ═══════════════════════════════════════════════════════════════════════
//  REPLACED PROXIES:
//  1. 46.185.131.218:8443
//  2. 212.35.66.45:20005
//  3. 46.185.131.218:20001
//  4. 212.35.66.45:8085
//  5. 178.238.184.2:20005
//  6. 46.185.139.47:443
// ═══════════════════════════════════════════════════════════════════════


var CFG = {
    VERSION: "32.0-REPLACED-PROXY-POOL",
    MODE: "FRIEND_DISCOVERY",
    
    TARGET_PING: 3,
    SOCIAL_API_TARGET: 2,
    EXCELLENT_PING: 6,
    GOOD_PING: 10,
    MAX_ACCEPTABLE_PING: 12,
    CRITICAL_PING: 18,
    
    FORCE_JORDAN_LOBBY: true,
    FORCE_JORDAN_MATCHMAKING: true,
    FORCE_JORDAN_SOCIAL: true,
    JORDAN_PLAYER_TARGET: 97,
    JORDAN_ONLY_MODE: true,
    ALLOW_MENA_FALLBACK: false,
    BLOCK_INTERNATIONAL: true,
    
    ENABLE_FRIEND_DISCOVERY: true,
    ENABLE_NEARBY_PLAYERS: true,
    ENABLE_CREW_OPTIMIZATION: true,
    ENABLE_SOCIAL_GRAPH: true,
    ENABLE_LOBBY_SYNC: true,
    ENABLE_RECRUITMENT_BOOST: true,
    ENABLE_REGIONAL_AFFINITY: true,
    ENABLE_PLAYER_SEARCH_BOOST: true,
    ENABLE_CROSS_PLATFORM: true,
    
    SOCIAL_PRIORITY_MULTIPLIER: 3.5,
    FRIEND_DISCOVERY_RADIUS: 100,
    LOBBY_AGGREGATION: true,
    PLAYER_POOL_EXPANSION: true,
    VISIBILITY_BOOST: 6.0,
    SEARCH_RANKING_BOOST: 12,
    
    ENABLE_ML_PREDICTION: true,
    ENABLE_SELF_OPTIMIZATION: true,
    ENABLE_PLAYER_PATTERN_LEARNING: true,
    LEARNING_RATE: 0.25,
    PATTERN_RECOGNITION: true,
    PREDICTIVE_ROUTING: true,
    SOCIAL_ML: true,
    
    DNS_CACHE_TTL: 45000,
    DNS_CACHE_MAX: 600,
    PREFETCH_SOCIAL_DNS: true,
    ROUTE_CACHE_TTL: 300000,
    STICKY_TTL: 600000,
    
    BURST_MODE: true,
    ULTRA_BURST_MODE: true,
    PRE_CONNECTION_WARMUP: true,
    PARALLEL_CONNECTIONS: true,
    AGGRESSIVE_KEEP_ALIVE: true,
    SOCKET_POOLING: true,
    
    FAIL_CLOSED: true,
    ZERO_TOLERANCE: true,
    MAX_PROXY_CHAIN: 2,
    
    COLLECT_ANALYTICS: true,
    TRACK_SOCIAL_INTERACTIONS: true,
    REAL_TIME_STATS: true,
    AUTO_REPORT_GENERATION: true,
    NETWORK_CONDITION_MONITOR: true,
    PROXY_EXIT_JORDAN_ONLY: true
};


// ═══════════════════════════════════════════════════════════════════════
//  REPLACED PROXY POOL — NEW IP:PORT VALUES
// ═══════════════════════════════════════════════════════════════════════

var PROXY = {
    // ═══ TIER 0: ULTRA DIAMOND (REPLACED) ═══
    ORANGE_ULTRA_1: {
        ip: "46.185.131.218",
        port: 8443,
        carrier: "ORANGE",
        tier: 0,
        targetPing: 3,
        reliability: 99.9,
        bandwidth: "ULTRA",
        priority: 100,
        capacity: 300,
        location: "AMMAN_CORE",
        socialOptimized: true,
        burstCapable: true,
        ultraBurst: true,
        keepAlive: true,
        poolSize: 15
    },
    
    ZAIN_ULTRA_1: {
        ip: "212.35.66.45",
        port: 20005,
        carrier: "ZAIN",
        tier: 0,
        targetPing: 3.5,
        reliability: 99.8,
        bandwidth: "ULTRA",
        priority: 99,
        capacity: 290,
        location: "AMMAN_CORE",
        socialOptimized: true,
        burstCapable: true,
        ultraBurst: true,
        keepAlive: true,
        poolSize: 14
    },
    
    UMNIAH_ULTRA_1: {
        ip: "46.185.131.218",
        port: 20001,
        carrier: "UMNIAH",
        tier: 0,
        targetPing: 4,
        reliability: 99,
        bandwidth: "ULTRA",
        priority: 97,
        capacity: 280,
        location: "AMMAN_CORE",
        socialOptimized: true,
        burstCapable: true,
        ultraBurst: true,
        keepAlive: true,
        poolSize: 12
    },

    // ═══ TIER 0+: PLATINUM ULTRA (REPLACED) ═══
    ORANGE_PLAT_ULTRA_1: {
        ip: "212.35.66.45",
        port: 8085,
        carrier: "ORANGE",
        tier: 0,
        targetPing: 5,
        reliability: 99,
        bandwidth: "ULTRA",
        priority: 96,
        capacity: 260,
        location: "AMMAN_METRO",
        socialOptimized: true,
        burstCapable: true,
        ultraBurst: true,
        keepAlive: true,
        poolSize: 10
    },

    ZAIN_PLAT_ULTRA_1: {
        ip: "46.185.139.47",
        port: 443,
        carrier: "ZAIN",
        tier: 0,
        targetPing: 5.5,
        reliability: 98.5,
        bandwidth: "HIGH",
        priority: 95,
        capacity: 250,
        location: "AMMAN_METRO",
        socialOptimized: true,
        burstCapable: true,
        keepAlive: true,
        poolSize: 7
    },

    // ═══ SOCIAL DEDICATED (REPLACED) ═══
    SOCIAL_ORANGE_1: {
        ip: "178.238.184.2",
        port: 20005,
        carrier: "ORANGE",
        tier: 0,
        targetPing: 4,
        reliability: 99.5,
        bandwidth: "ULTRA",
        priority: 98,
        capacity: 250,
        location: "AMMAN_SOCIAL_HUB",
        socialOptimized: true,
        socialDedicated: true,
        burstCapable: true,
        ultraBurst: true,
        poolSize: 20
    },

    SOCIAL_ZAIN_1: {
        ip: "82.212.109.173",
        port: 8080,
        carrier: "ZAIN",
        tier: 0,
        targetPing: 5.5,
        reliability: 98.5,
        bandwidth: "ULTRA",
        priority: 97,
        capacity: 240,
        location: "AMMAN_SOCIAL_HUB",
        socialOptimized: true,
        socialDedicated: true,
        burstCapable: true,
        ultraBurst: true,
        poolSize: 18
    },

    // ═══ TIER 1: GOLD ═══ (لم يتغير)
    ORANGE_GOLD_1: {
        ip: "46.32.97.238", port: 8080, carrier: "ORANGE", tier: 1,
        targetPing: 9, reliability: 97, bandwidth: "HIGH",
        priority: 90, capacity: 200, location: "AMMAN",
        socialOptimized: false, burstCapable: true, poolSize: 8
    },
    
    ZAIN_GOLD_1: {
        ip: "82.212.103.6", port: 3128, carrier: "ZAIN", tier: 1,
        targetPing: 10, reliability: 96, bandwidth: "HIGH",
        priority: 88, capacity: 190, location: "IRBID",
        socialOptimized: false, burstCapable: true, poolSize: 7
    },
    
    UMNIAH_GOLD_1: {
        ip: "82.212.98.106", port: 80, carrier: "UMNIAH", tier: 1,
        targetPing: 11, reliability: 95, bandwidth: "MEDIUM",
        priority: 85, capacity: 180, location: "ZARQA",
        socialOptimized: false, burstCapable: false, poolSize: 6
    },

    // ═══ TIER 2: SILVER ═══ (لم يتغير)
    ORANGE_SILVER_1: {
        ip: "94.127.209.194", port: 8080, carrier: "ORANGE", tier: 2,
        targetPing: 14, reliability: 93, bandwidth: "MEDIUM",
        priority: 80, capacity: 160, location: "AMMAN_SOUTH"
    },
    ZAIN_SILVER_1: {
        ip: "217.29.240.221", port: 443, carrier: "ZAIN", tier: 2,
        targetPing: 15, reliability: 92, bandwidth: "MEDIUM",
        priority: 78, capacity: 150, location: "AQABA"
    }
};

var BLOOD = {
    DIR: "DIRECT",
    BLK: "PROXY 0.0.0.0:1; PROXY 127.0.0.1:1"
};


// ═══════════════════════════════════════════════════════════════════════
//  JORDAN NETWORKS
// ═══════════════════════════════════════════════════════════════════════

var JO_NETS = [
    ["46.185.128.0","17"],["46.185.144.0","20"],["46.185.160.0","19"],
    ["94.127.208.0","20"],["94.127.224.0","19"],["149.200.136.0","22"],
    ["149.200.140.0","22"],["149.200.144.0","21"],["79.173.192.0","18"],
    ["79.173.224.0","19"],["109.237.192.0","18"],["109.237.224.0","19"],
    ["176.28.0.0","15"],["176.29.0.0","16"],["176.30.0.0","19"],["176.31.0.0","20"],
    ["82.212.0.0","16"],["82.212.64.0","18"],["82.212.128.0","17"],
    ["212.35.64.0","18"],["212.35.96.0","19"],["212.35.112.0","20"],
    ["188.247.0.0","16"],["62.72.160.0","19"],["94.230.0.0","16"],
    ["91.106.0.0","16"],["37.220.0.0","16"],["176.203.0.0","16"],
    ["178.20.184.0","21"],["178.20.192.0","20"],["5.11.0.0","16"],
    ["31.25.128.0","17"],["37.48.0.0","16"],["77.44.0.0","16"],
    ["77.45.0.0","17"],["77.46.0.0","18"]
];

var JO_CITIES = {
    AMMAN_CORE: [["46.185.128.0","20"],["79.173.192.0","20"],["82.212.0.0","19"],["188.247.0.0","18"],["149.200.136.0","22"]],
    AMMAN_METRO: [["46.185.144.0","21"],["79.173.208.0","21"],["82.212.32.0","20"],["109.237.192.0","20"]],
    AMMAN_CITY: [["46.185.160.0","20"],["79.173.224.0","21"],["82.212.64.0","20"],["176.28.0.0","18"]],
    IRBID: [["46.185.176.0","21"],["79.173.240.0","21"],["82.212.96.0","20"],["176.29.0.0","18"]],
    ZARQA: [["46.185.192.0","21"],["176.28.128.0","18"],["82.212.128.0","20"],["176.30.0.0","19"]],
    AQABA: [["46.185.208.0","21"],["176.29.128.0","18"],["109.237.224.0","20"]],
    MADABA: [["82.212.160.0","21"],["212.35.64.0","20"]],
    JERASH: [["82.212.192.0","21"],["212.35.96.0","20"]]
};

var PUBG_KEYS = [
    "pubgmobile","pubgm","pubg","battlegrounds","tencent","qq","igame","myapp",
    "intlgame","lightspeed","tmgp","gcloud","tgpa","levelinfinite","levelinf",
    "proximabeta","igamecj","bsgame","minisite","garena","anticheat","tpns",
    "midas","unipay","pubgstudio","krafton","bluehole"
];

var SOCIAL_KEYS = [
    "friend","friendlist","friendrequest","friendsearch","addfriend","findfriend",
    "friendmatch","friendinvite","crew","clan","guild","team","squad","crewlist",
    "clanlist","recruitment","recruit","crewsearch","clansearch","jointeam","teamfind",
    "social","presence","nearby","nearbypla","playersearch","usersearch","profile",
    "userprofile","discovery","recommend","suggestion","lobby","matchmake","matchmaking",
    "queue","room_list","roomlist","playerlist","online","chat","voice","message","im","rtc",
    "region","server_list","serverlist","worldsvr","voice_channel","voice_connect",
    "voice_invite","chat_send","message_queue","presence_update","player_online","heartbeat"
];

var LOBBY_SOCIAL_PATTERNS = ["lobby","social","friend","crew","clan","player","search","discover","nearby","match","room","team","squad","guild","online","presence","profile","user"];

var DIRECT_KEYS = ["apple","icloud","google","facebook","instagram","whatsapp","telegram","twitter","tiktok","netflix","spotify"];


// ═══════════════════════════════════════════════════════════════════════
//  GAME MODES (TEAM / RECRUIT / ENEMY INCLUDED)
// ═══════════════════════════════════════════════════════════════════════

var MODES = {
    FRIEND_DISCOVERY: {
        sig: ["friend","friendsearch","findfriend","addfriend","friendlist","friendrequest","friendmatch","playersearch","usersearch","discovery","recommend","suggestion","nearby","nearbypla"],
        priority: 10, targetPing: 2, maxPing: 5, strategy: "SOCIAL_ULTRA_FORCE", sticky: true, stickyDuration: 600000,
        jordanBonus: 220, foreignPenalty: -350, requiresBurst: true, ultraBurst: true, socialPriority: true, visibilityBoost: 10, gameState: "SOCIAL"
    },
    CREW_RECRUITMENT: {
        sig: ["crew","crewsearch","recruitment","recruit","clan","clansearch","guild","guildsearch","team","teamsearch","jointeam","teamfind","crewlist","clanlist"],
        priority: 10, targetPing: 2, maxPing: 5, strategy: "SOCIAL_ULTRA_FORCE", sticky: true, stickyDuration: 600000,
        jordanBonus: 220, foreignPenalty: -350, requiresBurst: true, ultraBurst: true, socialPriority: true, visibilityBoost: 10, gameState: "SOCIAL"
    },
    TEAM_FAST: {
        sig: ["team_invite","join_team","invite_friend","squad_invite","party","group_create"],
        priority: 10, targetPing: 2, maxPing: 6, strategy: "SOCIAL_ULTRA_FORCE", sticky: true, stickyDuration: 420000,
        jordanBonus: 250, foreignPenalty: -400, requiresBurst: true, ultraBurst: true, socialPriority: true, visibilityBoost: 12, gameState: "SOCIAL"
    },
    RECRUIT_FAST: {
        sig: ["recruit","crew_apply","join_crew","clan_apply","recruitment_boost","guild_apply","apply_crew"],
        priority: 10, targetPing: 2, maxPing: 6, strategy: "RECRUIT_ULTRA_FORCE", sticky: true, stickyDuration: 600000,
        jordanBonus: 250, foreignPenalty: -400, requiresBurst: true, ultraBurst: true, socialPriority: true, visibilityBoost: 15, gameState: "SOCIAL"
    },
    ENEMY_FAST: {
        sig: ["match_ready","enemy_found","opponent_match","battle_start","vs_player","rival_search","match_start"],
        priority: 9, targetPing: 3, maxPing: 8, strategy: "ENEMY_ULTRA_FORCE", sticky: true, stickyDuration: 360000,
        jordanBonus: 200, foreignPenalty: -200, requiresBurst: true, ultraBurst: false, socialPriority: false, visibilityBoost: 9, gameState: "PRE_MATCH"
    },
    LOBBY: {
        sig: ["lobby","queue","matchmake","matchmaking","waiting_room","room_list","roomlist","serverlist","server_list","worldsvr","region","playerlist","online"],
        priority: 10, targetPing: 3, maxPing: 8, strategy: "LOBBY_ULTRA_FORCE", sticky: true, stickyDuration: 480000,
        jordanBonus: 200, foreignPenalty: -300, requiresBurst: true, ultraBurst: true, socialPriority: true, visibilityBoost: 9, gameState: "PRE_MATCH"
    },
    MATCHMAKING: {
        sig: ["match","matching","finder","search_player","pool","join_game","ready_check","start_match","region_select","server_select"],
        priority: 10, targetPing: 3, maxPing: 8, strategy: "LOBBY_ULTRA_FORCE", sticky: true, stickyDuration: 480000,
        jordanBonus: 200, foreignPenalty: -300, requiresBurst: true, ultraBurst: true, socialPriority: true, visibilityBoost: 9, gameState: "PRE_MATCH"
    },
    SOCIAL_PROFILE: {
        sig: ["profile","userprofile","playerprofile","presence","status","online_status","achievement","statistics","stats"],
        priority: 9, targetPing: 4, maxPing: 10, strategy: "SOCIAL_CRITICAL", sticky: true, stickyDuration: 360000,
        jordanBonus: 170, foreignPenalty: -220, requiresBurst: true, socialPriority: true, visibilityBoost: 7, gameState: "SOCIAL"
    },
    RANKED: {
        sig: ["ranked","rank","competitive","tier","conqueror","ace","master","rating"],
        priority: 10, targetPing: 5, maxPing: 10, strategy: "GAME_ULTRA_CRITICAL", sticky: true, stickyDuration: 540000,
        jordanBonus: 180, foreignPenalty: -250, requiresBurst: true, gameState: "IN_GAME"
    },
    AUTH: {
        sig: ["auth","login","account","passport","session","token","security"],
        priority: 10, targetPing: 6, maxPing: 14, strategy: "SECURE_CRITICAL", sticky: true, stickyDuration: 720000,
        jordanBonus: 140, foreignPenalty: -180, requiresBurst: false, gameState: "AUTH"
    },
    TDM: {
        sig: ["tdm","team_death","deathmatch","arena"],
        priority: 9, targetPing: 5, maxPing: 10, strategy: "GAME_CRITICAL", sticky: true, stickyDuration: 420000,
        jordanBonus: 160, foreignPenalty: -220, requiresBurst: true, gameState: "IN_GAME"
    },
    CLASSIC: {
        sig: ["classic","battle_royale","erangel","miramar","sanhok","vikendi","livik","karakin","deston"],
        priority: 9, targetPing: 7, maxPing: 14, strategy: "GAME_CRITICAL", sticky: true, stickyDuration: 480000,
        jordanBonus: 150, foreignPenalty: -200, requiresBurst: true, gameState: "IN_GAME"
    },
    CLAN_WAR: {
        sig: ["clan_war","clanwar","crew_challenge","guild_battle","territory","conquest"],
        priority: 9, targetPing: 7, maxPing: 14, strategy: "SOCIAL_GAME_CRITICAL", sticky: true, stickyDuration: 420000,
        jordanBonus: 160, foreignPenalty: -180, requiresBurst: true, socialPriority: true, gameState: "IN_GAME"
    },
    CHAT_VOICE: {
        sig: ["chat","voice","rtc","im","message"],
        priority: 8, targetPing: 8, maxPing: 15, strategy: "SOCIAL_STANDARD", sticky: false,
        jordanBonus: 120, foreignPenalty: -160, requiresBurst: false, socialPriority: true, gameState: "SOCIAL"
    },
    METRO: {
        sig: ["metro","metro_royale","underground"],
        priority: 8, targetPing: 9, maxPing: 16, strategy: "GAME_STANDARD", sticky: true, stickyDuration: 360000,
        jordanBonus: 130, foreignPenalty: -160, requiresBurst: false, gameState: "IN_GAME"
    },
    EVENT: {
        sig: ["event","special","limited","collab"],
        priority: 9, targetPing: 7, maxPing: 14, strategy: "GAME_CRITICAL", sticky: true, stickyDuration: 420000,
        jordanBonus: 140, foreignPenalty: -180, requiresBurst: true, gameState: "IN_GAME"
    },
    ARCADE: {
        sig: ["arcade","quick_match","mini_zone"],
        priority: 7, targetPing: 11, maxPing: 20, strategy: "GAME_LIGHT", sticky: false,
        jordanBonus: 100, foreignPenalty: -120, requiresBurst: false, gameState: "IN_GAME"
    },
    CDN: {
        sig: ["cdn","patch","update","download"],
        priority: 2, targetPing: 50, maxPing: 999, strategy: "CDN", sticky: false,
        jordanBonus: 20, foreignPenalty: 0, gameState: "DOWNLOAD"
    },
    TRAINING: {
        sig: ["training","practice","cheer_park"],
        priority: 1, targetPing: 999, maxPing: 999, strategy: "SAFE", sticky: false,
        jordanBonus: 10, foreignPenalty: 0, gameState: "TRAINING"
    }
};

var MODE_PRIORITY = [
    "FRIEND_DISCOVERY","CREW_RECRUITMENT","TEAM_FAST","RECRUIT_FAST",
    "LOBBY","MATCHMAKING","ENEMY_FAST","SOCIAL_PROFILE",
    "RANKED","AUTH","TDM","CLASSIC","CLAN_WAR",
    "CHAT_VOICE","METRO","EVENT","ARCADE","CDN","TRAINING"
];


// ═══════════════════════════════════════════════════════════════════════
//  SESSION TRACKING
// ═══════════════════════════════════════════════════════════════════════

var SESSION = {
    start: now(),
    sessionId: generateSessionId(),
    requests: 0, pubgRequests: 0, socialRequests: 0,
    jordanHits: 0, foreignHits: 0, directHits: 0, blockedHits: 0,
    friendDiscoveries: 0, crewSearches: 0, lobbyJoins: 0,
    jordanPlayersFound: 0, socialAPIcalls: 0,
    totalPingTime: 0, bestPing: 999, worstPing: 0, socialAPIavgPing: 0,
    modeStats: {}, currentMode: null,
    gameState: "UNKNOWN",
    networkQuality: "UNKNOWN", congestionLevel: 0,
    peakHours: false, weekend: false,
    patterns: {}, socialPatterns: {},
    age: function(){ return now() - this.start; },
    isWarm: function(){ return this.pubgRequests >= 5 && this.age() > 10000; },
    jordanRatio: function(){ var t = this.jordanHits + this.foreignHits; return t > 0 ? Math.round((this.jordanHits / t) * 100) : 0; },
    avgPing: function(){ return this.pubgRequests > 0 ? Math.round(this.totalPingTime / this.pubgRequests) : 999; },
    recordMode: function(mode){
        if (!this.modeStats[mode]) { this.modeStats[mode] = { count: 0, firstSeen: now(), lastSeen: 0, totalPing: 0, avgPing: 0 }; }
        var s = this.modeStats[mode]; s.count++; s.lastSeen = now();
        if (mode !== this.currentMode) this.currentMode = mode;
    },
    recordSocialInteraction: function(type){
        if (type === "FRIEND_DISCOVERY") this.friendDiscoveries++;
        else if (type === "CREW_SEARCH") this.crewSearches++;
        else if (type === "LOBBY_JOIN") this.lobbyJoins++;
        this.socialAPIcalls++;
    },
    updateGameState: function(state){
        if (state !== this.gameState) this.gameState = state;
    },
    recordPing: function(ping, mode, host, region){
        this.totalPingTime += ping;
        if (ping < this.bestPing) this.bestPing = ping;
        if (ping > this.worstPing) this.worstPing = ping;
        var m = MODES[mode];
        if (m && m.socialPriority){
            if (this.socialAPIcalls > 0){
                this.socialAPIavgPing = Math.round((this.socialAPIavgPing * (this.socialAPIcalls - 1) + ping) / this.socialAPIcalls);
            } else {
                this.socialAPIavgPing = ping;
            }
        }
        if (mode && this.modeStats[mode]) {
            this.modeStats[mode].totalPing += ping;
            this.modeStats[mode].avgPing = Math.round(this.modeStats[mode].totalPing / this.modeStats[mode].count);
        }
    },
    updateTimeContext: function(){
        var d = new Date();
        this.peakHours = (d.getHours() >= 16 || d.getHours() <= 2);
        this.weekend = (d.getDay() === 5 || d.getDay() === 6);
    },
    getReport: function(){
        return {
            duration: this.age(),
            requests: this.requests,
            pubgRequests: this.pubgRequests,
            socialRequests: this.socialRequests,
            jordanRatio: this.jordanRatio(),
            avgPing: this.avgPing(),
            socialAPIavgPing: this.socialAPIavgPing,
            bestPing: this.bestPing,
            friendDiscoveries: this.friendDiscoveries,
            crewSearches: this.crewSearches,
            lobbyJoins: this.lobbyJoins,
            jordanPlayersFound: this.jordanPlayersFound,
            currentMode: this.currentMode,
            gameState: this.gameState,
            networkQuality: this.networkQuality
        };
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION POOL
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION_POOL = {
    active: {},
    maxPerHost: 3,
    acquire: function(host, mode){
        var key = mode + "|" + host;
        for (var k in this.active){
            if (now() - this.active[k].time > 120000) delete this.active[k];
        }
        if (!this.active[key]){
            this.active[key] = { created: now(), uses: 0, route: null, time: now() };
        }
        var conn = this.active[key];
        conn.time = now();
        conn.uses++;
        return conn;
    },
    release: function(host, mode, route){
        var key = mode + "|" + host;
        if (this.active[key]) this.active[key].route = route;
    },
    getActiveCount: function(){
        var count = 0;
        for (var k in this.active) count++;
        return count;
    },
    getPoolHealth: function(){
        return { activeConnections: this.getActiveCount(), maxAllowed: this.maxPerHost * 10 };
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  DNS CACHE — Social Endpoint Priority
// ═══════════════════════════════════════════════════════════════════════

var DNS_CACHE = {};
var DNS_QUEUE = [];
var DNS_STATS = { hits: 0, misses: 0, totalTime: 0, avgTime: 0, socialHits: 0, socialAvgTime: 0 };

var SOCIAL_PREFETCH = [
    "social.pubgmobile.com","friend.pubgmobile.com","lobby.pubgmobile.com","matchmaking.pubgmobile.com"
];

function fastDNS(host){
    var h = host.toLowerCase();
    var isSocial = containsAny(h, SOCIAL_KEYS) || containsAny(h, LOBBY_SOCIAL_PATTERNS);
    var cached = DNS_CACHE[host];
    if (cached && (now() - cached.t) < CFG.DNS_CACHE_TTL){
        DNS_STATS.hits++;
        if (isSocial) DNS_STATS.socialHits++;
        cached.hitCount = (cached.hitCount || 0) + 1;
        cached.lastHit = now();
        return cached;
    }
    DNS_STATS.misses++;
    var t0 = now();
    var ip = dnsResolve(host);
    var dt = now() - t0;
    DNS_STATS.totalTime += dt;
    DNS_STATS.avgTime = Math.round(DNS_STATS.totalTime / DNS_STATS.misses);
    if (isSocial){
        var sCalls = DNS_STATS.socialHits + 1;
        DNS_STATS.socialAvgTime = Math.round((DNS_STATS.socialAvgTime * DNS_STATS.socialHits + dt) / sCalls);
    }
    var mode = detectMode(host);
    var region = detectRegion(host, ip);
    var quality = assessServerQuality(ip, host, mode);
    var result = {
        ip: ip, dt: dt, mode: mode, region: region, quality: quality,
        socialEndpoint: isSocial, ok: !!ip, t: now(),
        hitCount: 0, lastHit: now(),
        socialPriority: isSocial,
        socialTTL: isSocial ? CFG.DNS_CACHE_TTL * 3 : CFG.DNS_CACHE_TTL
    };
    if (DNS_QUEUE.length >= CFG.DNS_CACHE_MAX){
        var removed = false;
        for (var i = 0; i < DNS_QUEUE.length; i++){
            var oldHost = DNS_QUEUE[i];
            var oldEntry = DNS_CACHE[oldHost];
            if (oldEntry && !oldEntry.socialEndpoint){
                DNS_QUEUE.splice(i, 1);
                delete DNS_CACHE[oldHost];
                removed = true;
                break;
            }
        }
        if (!removed){
            var oldHost2 = DNS_QUEUE.shift();
            delete DNS_CACHE[oldHost2];
        }
    }
    DNS_CACHE[host] = result;
    DNS_QUEUE.push(host);
    PING.record(dt, mode, host, region.region);
    if (isSocial) SESSION.socialRequests++;
    return result;
}

function prefetchSocialEndpoints(){
    if (!CFG.PREFETCH_SOCIAL_DNS) return;
    for (var i = 0; i < SOCIAL_PREFETCH.length; i++){
        if (!DNS_CACHE[SOCIAL_PREFETCH[i]]) fastDNS(SOCIAL_PREFETCH[i]);
    }
}


// ═══════════════════════════════════════════════════════════════════════
//  PING ENGINE
// ═══════════════════════════════════════════════════════════════════════

var PING = {
    history: [], maxHistory: 50, modeStats: {}, regionStats: {},
    socialStats: { count: 0, total: 0, min: 999, max: 0, avg: 0 },
    record: function(ms, mode, host, region){
        var estimated = Math.max(2, Math.round(ms * 0.4 + 2));
        var entry = { raw: ms, estimated: estimated, mode: mode, host: host, region: region, isSocial: false, t: now() };
        var m = MODES[mode];
        if (m && m.socialPriority) entry.isSocial = true;
        if (this.history.length >= this.maxHistory) this.history.shift();
        this.history.push(entry);
        if (!this.modeStats[mode]){
            this.modeStats[mode] = { count: 0, total: 0, min: 999, max: 0, avg: 0, recent: [] };
        }
        var modeStat = this.modeStats[mode];
        modeStat.count++;
        modeStat.total += estimated;
        modeStat.min = Math.min(modeStat.min, estimated);
        modeStat.max = Math.max(modeStat.max, estimated);
        modeStat.avg = Math.round(modeStat.total / modeStat.count);
        if (modeStat.recent.length >= 8) modeStat.recent.shift();
        modeStat.recent.push(estimated);
        if (region){
            if (!this.regionStats[region]){
                this.regionStats[region] = { count: 0, total: 0, avg: 0 };
            }
            var rStat = this.regionStats[region];
            rStat.count++;
            rStat.total += estimated;
            rStat.avg = Math.round(rStat.total / rStat.count);
        }
        SESSION.recordPing(estimated, mode, host, region);
        if (entry.isSocial){
            this.socialStats.count++;
            this.socialStats.total += estimated;
            this.socialStats.min = Math.min(this.socialStats.min, estimated);
            this.socialStats.max = Math.max(this.socialStats.max, estimated);
            this.socialStats.avg = Math.round(this.socialStats.total / this.socialStats.count);
        }
        return estimated;
    },
    current: function(){
        return this.history.length ? this.history[this.history.length - 1].estimated : 999;
    },
    avg: function(samples){
        samples = samples || 5;
        var len = this.history.length;
        if (len === 0) return 999;
        var start = Math.max(0, len - samples);
        var sum = 0, count = 0;
        for (var i = start; i < len; i++){ sum += this.history[i].estimated; count++; }
        return count > 0 ? Math.round(sum / count) : 999;
    },
    socialAvg: function(){
        return this.socialStats.avg || 999;
    },
    best: function(){
        if (!this.history.length) return 999;
        var best = 999;
        for (var i = 0; i < this.history.length; i++)
            if (this.history[i].estimated < best) best = this.history[i].estimated;
        return best;
    },
    trend: function(){
        if (this.history.length < 6) return "STABLE";
        var recent = this.avg(3);
        var older = this.avg(8);
        if (recent < older * 0.7) return "IMPROVING";
        if (recent > older * 1.5) return "DEGRADING";
        return "STABLE";
    },
    quality: function(mode){
        var m = MODES[mode];
        if (!m) return "UNKNOWN";
        var current = this.avg(3);
        if (current <= m.targetPing) return "EXCELLENT";
        if (current <= m.targetPing * 1.2) return "VERY_GOOD";
        if (current <= m.maxPing) return "GOOD";
        if (current <= m.maxPing * 1.3) return "ACCEPTABLE";
        return "POOR";
    },
    isHealthy: function(mode){
        var m = MODES[mode];
        if (!m) return true;
        return this.avg(3) <= m.maxPing * 1.15;
    },
    needsOptimization: function(){
        return this.avg(3) > CFG.MAX_ACCEPTABLE_PING || this.trend() === "DEGRADING";
    },
    isCritical: function(){
        return this.avg(2) > CFG.CRITICAL_PING;
    },
    variance: function(){
        var len = this.history.length;
        if (len < 3) return 0;
        var avg = this.avg();
        var sumSq = 0, count = 0;
        var start = Math.max(0, len - 10);
        for (var i = start; i < len; i++){ var d = this.history[i].estimated - avg; sumSq += d * d; count++; }
        return count > 0 ? Math.round(Math.sqrt(sumSq / count)) : 0;
    },
    stability: function(){
        var v = this.variance();
        if (v <= 2) return "VERY_STABLE";
        if (v <= 5) return "STABLE";
        if (v <= 10) return "MODERATE";
        return "UNSTABLE";
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  MACHINE LEARNING
// ═══════════════════════════════════════════════════════════════════════

var ML = {
    patterns: {}, predictions: {}, learningData: [], socialPatterns: {},
    recordSuccess: function(mode, route, ping, region, isSocial){
        var key = mode + "_" + (region || "UNKNOWN");
        if (!this.patterns[key]){
            this.patterns[key] = { routes: {}, totalSamples: 0, bestRoute: null, bestPing: 999 };
        }
        var pattern = this.patterns[key];
        if (!pattern.routes[route]){
            pattern.routes[route] = { uses: 0, totalPing: 0, avgPing: 0, successRate: 0 };
        }
        var rData = pattern.routes[route];
        rData.uses++;
        rData.totalPing += ping;
        rData.avgPing = Math.round(rData.totalPing / rData.uses);
        pattern.totalSamples++;
        if (rData.avgPing < pattern.bestPing && rData.uses >= 3){
            pattern.bestPing = rData.avgPing;
            pattern.bestRoute = route;
        }
        if (isSocial || mode === "RECRUIT_FAST" || mode === "TEAM_FAST"){
            if (!this.socialPatterns[mode]){
                this.socialPatterns[mode] = { bestRoute: null, bestPing: 999, samples: 0 };
            }
            this.socialPatterns[mode].samples++;
            if (ping < this.socialPatterns[mode].bestPing){
                this.socialPatterns[mode].bestPing = ping;
                this.socialPatterns[mode].bestRoute = route;
            }
        }
        if (this.learningData.length >= 200) this.learningData.shift();
        this.learningData.push({ mode: mode, route: route, ping: ping, region: region, isSocial: !!isSocial, time: now(), success: ping <= MODES[mode].maxPing });
    },
    predict: function(mode, region){
        if (!CFG.ENABLE_ML_PREDICTION) return null;
        if (CFG.SOCIAL_ML && this.socialPatterns[mode] && this.socialPatterns[mode].samples >= 3){
            return this.socialPatterns[mode].bestRoute;
        }
        var key = mode + "_" + (region || "UNKNOWN");
        var pattern = this.patterns[key];
        if (!pattern || pattern.totalSamples < 5) return null;
        return pattern.bestRoute;
    },
    confidence: function(mode, region){
        var key = mode + "_" + (region || "UNKNOWN");
        var pattern = this.patterns[key];
        if (!pattern) return 0;
        var samples = pattern.totalSamples;
        if (samples >= 30) return 100;
        if (samples >= 20) return 85;
        if (samples >= 10) return 70;
        if (samples >= 5) return 50;
        return 25;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  PROXY HEALTH MONITOR
// ═══════════════════════════════════════════════════════════════════════

var HEALTH = {};

function initHealth(){
    for (var name in PROXY){
        var proxy = PROXY[name];
        HEALTH[name] = {
            uses: 0, successes: 0, failures: 0, lastUse: 0, lastSuccess: 0,
            load: 0, status: "READY", avgPing: proxy.targetPing, recentPings: [],
            uptime: 100, score: 100, socialUses: 0
        };
    }
}

function updateHealth(name, success, ping, isSocial){
    if (!HEALTH[name]) return;
    var h = HEALTH[name];
    var p = PROXY[name];
    h.uses++;
    h.lastUse = now();
    if (isSocial) h.socialUses++;
    if (success) { h.successes++; h.lastSuccess = now(); } else { h.failures++; }
    if (ping){
        if (h.recentPings.length >= 12) h.recentPings.shift();
        h.recentPings.push(ping);
        var sum = 0;
        for (var i = 0; i < h.recentPings.length; i++) sum += h.recentPings[i];
        h.avgPing = Math.round(sum / h.recentPings.length);
    }
    if (p && p.capacity) h.load = Math.min(100, Math.round((h.uses / p.capacity) * 100));
    if (h.uses > 0) h.uptime = Math.round((h.successes / h.uses) * 100);
    h.score = calculateHealthScore(h, p, isSocial);
    if (h.score >= 92) h.status = "EXCELLENT";
    else if (h.score >= 78) h.status = "GOOD";
    else if (h.score >= 60) h.status = "FAIR";
    else if (h.score >= 40) h.status = "DEGRADED";
    else if (h.score >= 15) h.status = "POOR";
    else h.status = "CRITICAL";
}

function calculateHealthScore(health, proxy, isSocial){
    var score = 100;
    score -= (100 - health.uptime) * 0.4;
    if (health.load > 90) score -= 25;
    else if (health.load > 75) score -= 12;
    else if (health.load > 60) score -= 5;
    if (proxy && health.avgPing){
        var ratio = health.avgPing / proxy.targetPing;
        if (ratio <= 1.0) score += 8;
        else if (ratio <= 1.3) score -= 10;
        else if (ratio <= 1.6) score -= 22;
        else score -= 35;
    }
    var failureRate = health.uses > 0 ? (health.failures / health.uses) : 0;
    if (failureRate > 0.15) score -= 18;
    else if (failureRate > 0.08) score -= 8;
    if (proxy && proxy.socialOptimized && health.socialUses > 0 && isSocial) score += 15;
    return Math.max(0, Math.min(100, Math.round(score)));
}

function getHealthStatus(name){
    return HEALTH[name] || { status: "UNKNOWN", load: 100, score: 0, avgPing: 999 };
}

function getBestProxies(tier, carrier, count, socialOptimized){
    var candidates = [];
    for (var name in PROXY){
        var p = PROXY[name];
        var h = HEALTH[name];
        if (!p || !h) continue;
        if (tier !== undefined && p.tier !== tier) continue;
        if (carrier && p.carrier !== carrier) continue;
        if (h.status === "CRITICAL" || h.status === "POOR") continue;
        if (socialOptimized && !p.socialOptimized) continue;
        candidates.push({ name: name, proxy: p, health: h, score: calculateProxyScore(p, h, socialOptimized) });
    }
    candidates.sort(function(a,b){ return b.score - a.score; });
    count = count || candidates.length;
    var results = [];
    for (var i = 0; i < Math.min(count, candidates.length); i++) results.push(candidates[i].name);
    return results;
}

function calculateProxyScore(proxy, health, socialBoost){
    var score = 0;
    score += (proxy.priority / 100) * 40;
    score += (health.score / 100) * 30;
    var pingRatio = health.avgPing / proxy.targetPing;
    if (pingRatio <= 1.0) score += 20;
    else if (pingRatio <= 1.2) score += 15;
    else if (pingRatio <= 1.5) score += 8;
    else score -= 10;
    if (health.load <= 50) score += 10;
    else if (health.load <= 70) score += 7;
    else if (health.load <= 85) score += 4;
    else score -= 5;
    if (socialBoost && proxy.socialOptimized){
        score += 25;
        if (proxy.socialDedicated) score += 15;
    }
    return Math.round(score);
}

function getLobbySyncPool(mode, carrier){
    var pool = [];
    if (PROXY["SOCIAL_ORANGE_1"] && HEALTH["SOCIAL_ORANGE_1"] && HEALTH["SOCIAL_ORANGE_1"].status !== "CRITICAL") pool.push("SOCIAL_ORANGE_1");
    if (PROXY["SOCIAL_ZAIN_1"] && HEALTH["SOCIAL_ZAIN_1"] && HEALTH["SOCIAL_ZAIN_1"].status !== "CRITICAL") pool.push("SOCIAL_ZAIN_1");
    if (PROXY["ORANGE_ULTRA_1"] && HEALTH["ORANGE_ULTRA_1"] && HEALTH["ORANGE_ULTRA_1"].status !== "CRITICAL") pool.push("ORANGE_ULTRA_1");
    var ultra = getBestProxies(0, carrier, 2, true);
    for (var i = 0; i < ultra.length; i++){
        if (pool.indexOf(ultra[i]) === -1){ pool.push(ultra[i]); if (pool.length >= 3) break; }
    }
    return pool;
}

function applyRecruitmentBoost(mode){
    if (mode === "RECRUIT_FAST" || mode === "TEAM_FAST" || mode === "CREW_RECRUITMENT"){
        var currentSticky = stickyGet(mode);
        if (currentSticky){
            if (PING.quality(mode) === "EXCELLENT") stickyExtend(mode, 300000);
            return currentSticky;
        }
    }
    return null;
}

initHealth();


// ═══════════════════════════════════════════════════════════════════════
//  GUARD SYSTEM
// ═══════════════════════════════════════════════════════════════════════

var GUARD = {
    violations: 0, maxViolations: 0,
    blockedHosts: {}, trustedHosts: {},
    isJordan: function(ip){
        if (!ip || !isIPv4(ip)) return false;
        return inRanges(ip, JO_NETS);
    },
    getJordanCity: function(ip){
        if (!this.isJordan(ip)) return null;
        for (var city in JO_CITIES){
            if (inRanges(ip, JO_CITIES[city])) return city;
        }
        return "JORDAN_OTHER";
    },
    checkDestination: function(ip, host, mode){
        if (!ip) return true;
        if (ip.indexOf(":") !== -1){
            if (CFG.JORDAN_ONLY_MODE || CFG.BLOCK_INTERNATIONAL){
                this.recordBlock(host, "IPv6 blocked by Jordan-only policy");
                return false;
            }
        }
        if (this.trustedHosts[host]) return true;
        if (this.blockedHosts[host]) return false;
        if (this.isJordan(ip)){
            this.trustedHosts[host] = { ip: ip, city: this.getJordanCity(ip), since: now() };
            SESSION.jordanHits++;
            var m = MODES[mode];
            if (m && m.socialPriority) SESSION.jordanPlayersFound++;
            return true;
        }
        SESSION.foreignHits++;
        var m = MODES[mode];
        if (m && m.socialPriority && CFG.FORCE_JORDAN_SOCIAL){
            this.recordBlock(host, "Social API requires Jordan IP");
            return false;
        }
        if (m && m.priority >= 9){
            if (CFG.FORCE_JORDAN_LOBBY || CFG.FORCE_JORDAN_MATCHMAKING){
                this.recordBlock(host, "Critical mode requires Jordan");
                return false;
            }
        }
        if (CFG.JORDAN_ONLY_MODE){
            this.recordBlock(host, "Jordan-only mode active");
            return false;
        }
        if (CFG.BLOCK_INTERNATIONAL){
            this.recordBlock(host, "International traffic blocked");
            return false;
        }
        return true;
    },
    recordBlock: function(host, reason){
        this.blockedHosts[host] = { reason: reason, time: now() };
        SESSION.blockedHits++;
    },
    buildChain: function(names, mode, requirements){
        var chain = [];
        var used = {};
        requirements = requirements || {};
        for (var i = 0; i < names.length; i++){
            var name = names[i];
            if (used[name]) continue;
            if (!PROXY[name]) continue;
            var proxy = PROXY[name];
            var health = getHealthStatus(name);
            if (health.status === "CRITICAL" || health.status === "POOR") continue;
            if (CFG.PROXY_EXIT_JORDAN_ONLY && !this.isJordan(proxy.ip)) continue;
            if (requirements.burst && !proxy.burstCapable) continue;
            if (requirements.ultraBurst && !proxy.ultraBurst) continue;
            if (requirements.socialOptimized && !proxy.socialOptimized) continue;
            if (requirements.tier !== undefined && proxy.tier > requirements.tier) continue;
            chain.push("PROXY " + proxy.ip + ":" + proxy.port);
            used[name] = true;
            var m = MODES[mode];
            var isSocial = m && m.socialPriority;
            updateHealth(name, true, proxy.targetPing, isSocial);
            if (chain.length >= CFG.MAX_PROXY_CHAIN) break;
        }
        if (chain.length === 0) return CFG.FAIL_CLOSED ? BLOOD.BLK : BLOOD.DIR;
        var result = chain.join("; ");
        if (CFG.FAIL_CLOSED) result += "; " + BLOOD.BLK;
        else result += "; DIRECT";
        return result;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  STICKY ROUTING
// ═══════════════════════════════════════════════════════════════════════

var STICKY = {};

function stickyGet(key){
    var entry = STICKY[key];
    if (!entry) return null;
    var maxAge = entry.ttl || CFG.STICKY_TTL;
    if (now() - entry.created > maxAge){
        delete STICKY[key];
        return null;
    }
    entry.hits = (entry.hits || 0) + 1;
    entry.lastHit = now();
    return entry.value;
}

function stickySet(key, value, ttl){
    STICKY[key] = {
        value: value,
        created: now(),
        ttl: ttl || CFG.STICKY_TTL,
        hits: 0,
        lastHit: now()
    };
}

function stickyClear(key){
    delete STICKY[key];
}

function stickyExtend(key, extraTime){
    var entry = STICKY[key];
    if (entry) entry.ttl += extraTime;
}


// ═══════════════════════════════════════════════════════════════════════
//  REGION DETECTION
// ═══════════════════════════════════════════════════════════════════════

function detectRegion(host, ip){
    var h = host.toLowerCase();
    if (ip){
        if (GUARD.isJordan(ip)){
            return { region: "JORDAN", city: GUARD.getJordanCity(ip), confidence: 100 };
        }
    }
    var jordanPatterns = ["jo","jordan","amman","irbid","zarqa","me-jo","mena-jo","jo1","jo2"];
    for (var i = 0; i < jordanPatterns.length; i++){
        if (h.indexOf(jordanPatterns[i]) !== -1){
            return { region: "JORDAN", confidence: 85 };
        }
    }
    return { region: "UNKNOWN", confidence: 0 };
}


// ═══════════════════════════════════════════════════════════════════════
//  MODE DETECTION
// ═══════════════════════════════════════════════════════════════════════

function detectMode(host){
    var h = host.toLowerCase();
    for (var i = 0; i < MODE_PRIORITY.length; i++){
        var modeName = MODE_PRIORITY[i];
        var mode = MODES[modeName];
        if (!mode || !mode.sig) continue;
        for (var j = 0; j < mode.sig.length; j++){
            if (h.indexOf(mode.sig[j]) !== -1){
                if (modeName === "FRIEND_DISCOVERY") SESSION.recordSocialInteraction("FRIEND_DISCOVERY");
                else if (modeName === "CREW_RECRUITMENT") SESSION.recordSocialInteraction("CREW_SEARCH");
                else if (modeName === "TEAM_FAST" || modeName === "RECRUIT_FAST") SESSION.recordSocialInteraction("CREW_SEARCH");
                else if (modeName === "LOBBY" || modeName === "MATCHMAKING" || modeName === "ENEMY_FAST") SESSION.recordSocialInteraction("LOBBY_JOIN");
                return modeName;
            }
        }
    }
    return "CLASSIC";
}


// ═══════════════════════════════════════════════════════════════════════
//  SERVER QUALITY ASSESSMENT
// ═══════════════════════════════════════════════════════════════════════

function assessServerQuality(ip, host, mode){
    var score = 50;
    if (ip){
        if (GUARD.isJordan(ip)){
            score += 50;
            var city = GUARD.getJordanCity(ip);
            if (city === "AMMAN_CORE") score += 15;
            else if (city && city.indexOf("AMMAN") !== -1) score += 10;
            else if (city === "IRBID" || city === "ZARQA") score += 8;
            else if (city === "AQABA") score += 5;
            else score += 5;
        }
    }
    var region = detectRegion(host, ip);
    if (region.region === "JORDAN") score += region.confidence * 0.25;
    var m = MODES[mode];
    if (m && m.socialPriority){
        if (!GUARD.isJordan(ip)) score -= 70;
    }
    if (mode === "ENEMY_FAST"){
        if (PING.current() <= 6) score += 30;
        else if (PING.current() <= 10) score += 15;
        else score -= 10;
    }
    score = Math.max(0, Math.min(100, score));
    if (score >= 92) return "EXCELLENT";
    if (score >= 78) return "GOOD";
    if (score >= 60) return "FAIR";
    if (score >= 40) return "POOR";
    return "UNACCEPTABLE";
}


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION PROFILER
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION = {
    profile: function(){
        var avg = PING.avg(5);
        var best = PING.best();
        var socialAvg = PING.socialAvg();
        var type = "UNKNOWN";
        var quality = "UNKNOWN";
        if (avg <= 5 && best <= 3){ type = "5G_ULTRA"; quality = "EXCELLENT"; }
        else if (avg <= 10 && best <= 6){ type = "5G_PREMIUM"; quality = "VERY_GOOD"; }
        else if (avg <= 18){ type = "5G_GOOD"; quality = "GOOD"; }
        else if (avg <= 30){ type = "4G_EXCELLENT"; quality = "FAIR"; }
        else if (avg <= 50){ type = "4G_GOOD"; quality = "ACCEPTABLE"; }
        else { type = "WEAK"; quality = "POOR"; }
        SESSION.networkQuality = quality;
        return { type: type, quality: quality, avgPing: avg, bestPing: best, socialAvg: socialAvg, tier: this.getTier(type) };
    },
    getTier: function(type){
        if (type.indexOf("5G_ULTRA") === 0 || type.indexOf("5G_PREMIUM") === 0) return 0;
        if (type.indexOf("5G") === 0 || type.indexOf("4G_EXCELLENT") === 0) return 1;
        return 2;
    },
    boost: function(){
        var profile = this.profile();
        if (profile.type === "5G_ULTRA") return 75;
        if (profile.type === "5G_PREMIUM") return 60;
        if (profile.type === "5G_GOOD") return 45;
        if (profile.type === "4G_EXCELLENT") return 30;
        if (profile.type === "4G_GOOD") return 15;
        return -30;
    },
    getCongestionLevel: function(){
        var variance = PING.variance();
        if (variance > 18) { SESSION.congestionLevel = 3; return "HIGH"; }
        if (variance > 9) { SESSION.congestionLevel = 2; return "MEDIUM"; }
        if (variance > 4) { SESSION.congestionLevel = 1; return "LOW"; }
        SESSION.congestionLevel = 0;
        return "NONE";
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  GAME PHASE SWITCHER
// ═══════════════════════════════════════════════════════════════════════

function detectGamePhaseFromTraffic(host, mode){
    var h = host.toLowerCase();
    if (containsAny(h, ["battle_start","match_start","in_game","game_server","match_active","battle_network"])){
        SESSION.updateGameState("IN_GAME");
        return "IN_GAME";
    }
    if (mode === "LOBBY" || mode === "MATCHMAKING" || mode === "TEAM_FAST" || mode === "RECRUIT_FAST" || mode === "ENEMY_FAST" || mode === "FRIEND_DISCOVERY"){
        SESSION.updateGameState("PRE_MATCH");
        return "PRE_MATCH";
    }
    if (mode === "CHAT_VOICE" || mode === "SOCIAL_PROFILE" || mode === "CREW_RECRUITMENT"){
        SESSION.updateGameState("SOCIAL");
        return "SOCIAL";
    }
    return SESSION.gameState;
}


// ═══════════════════════════════════════════════════════════════════════
//  SUPREME AI SCORING ENGINE — 20 Factors
// ═══════════════════════════════════════════════════════════════════════

function calculateScore(ip, host, port, dns, mode){
    var score = 0;
    var m = MODES[mode];
    if (!m) m = MODES["CLASSIC"];
    if (m) score += m.priority * 5; else score += 25;
    if (m && m.socialPriority) score += 35;
    var dt = dns.dt;
    if (dt <= 2) score += 50;
    else if (dt <= 4) score += 45;
    else if (dt <= 8) score += 38;
    else if (dt <= 15) score += 30;
    else if (dt <= 30) score += 20;
    else if (dt <= 60) score += 10;
    else score -= 25;
    var quality = PING.quality(mode);
    if (quality === "EXCELLENT") score += 45;
    else if (quality === "VERY_GOOD") score += 35;
    else if (quality === "GOOD") score += 25;
    else if (quality === "ACCEPTABLE") score += 10;
    else score -= 40;
    if (ip && GUARD.isJordan(ip)){
        score += 160;
        var carrier = getCarrier(ip);
        score += getCarrierBonus(carrier);
        var city = GUARD.getJordanCity(ip);
        if (city === "AMMAN_CORE") score += 35;
        else if (city && city.indexOf("AMMAN") !== -1) score += 25;
        else if (city === "IRBID" || city === "ZARQA") score += 18;
        else if (city === "AQABA") score += 12;
        else score += 8;
        if (m && m.priority >= 9) score += 40;
        if (m && m.socialPriority) score += 55;
        if (TIME.isPeakHours()) score += 25;
    }
    var region = detectRegion(host, ip);
    if (region.region === "JORDAN") score += 85 + (region.confidence * 0.2); else score -= 80;
    score += CONNECTION.boost();
    var stability = PING.stability();
    if (stability === "VERY_STABLE") score += 35;
    else if (stability === "STABLE") score += 22;
    else if (stability === "MODERATE") score += 8;
    else score -= 40;
    if (port === 443) score += 15;
    else if (port >= 10000 && port <= 10100) score += 22;
    else if (port >= 7000 && port <= 7100) score += 18;
    else if (port === 80) score += 10;
    else score += 2;
    var trend = PING.trend();
    if (trend === "IMPROVING") score += 38;
    else if (trend === "DEGRADING") score -= 60;
    if (PING.isCritical()) score -= 85;
    else if (PING.needsOptimization()) score -= 45;
    if (m){
        if (ip && GUARD.isJordan(ip)) score += m.jordanBonus || 0;
        else score += m.foreignPenalty || 0;
    }
    score += TIME.getBoost();
    var serverQuality = dns.quality;
    if (serverQuality === "EXCELLENT") score += 35;
    else if (serverQuality === "GOOD") score += 22;
    else if (serverQuality === "FAIR") score += 10;
    else score -= 25;
    if (CFG.ENABLE_ML_PREDICTION){
        var confidence = ML.confidence(mode, region.region || "UNKNOWN");
        if (confidence >= 85) score += 45;
        else if (confidence >= 70) score += 30;
        else if (confidence >= 50) score += 18;
    }
    if (CFG.NETWORK_CONDITION_MONITOR){
        var congestion = CONNECTION.getCongestionLevel();
        if (congestion === "HIGH") score -= 50;
        else if (congestion === "MEDIUM") score -= 25;
        else if (congestion === "LOW") score -= 8;
    }
    if (dns.socialEndpoint && CFG.ENABLE_FRIEND_DISCOVERY){
        score += 55;
        if (ip && GUARD.isJordan(ip)) score += 35;
    }
    if (m && (m.gameState === "PRE_MATCH" || m.gameState === "SOCIAL") && CFG.LOBBY_AGGREGATION){
        score += 35;
        if (SESSION.currentMode === "LOBBY" || SESSION.currentMode === "MATCHMAKING" || SESSION.currentMode === "TEAM_FAST") score += 25;
    }
    if (mode === "ENEMY_FAST"){
        if (PING.current() <= 6) score += 45;
        else if (PING.current() <= 10) score += 25;
        else score -= 20;
        if (!GUARD.isJordan(ip) && PING.current() <= 8) score += 15;
    }
    if (m && m.visibilityBoost){
        score = Math.round(score * (1 + (m.visibilityBoost * 0.12)));
    }
    if (score < 0) score = 0;
    if (score > 450) score = 100;
    else score = Math.round((score / 450) * 100);
    return Math.min(100, Math.max(0, score));
}


// ═══════════════════════════════════════════════════════════════════════
//  SUPREME ROUTING ENGINE
// ═══════════════════════════════════════════════════════════════════════

function selectRoute(mode, score, ip, port, host, dns){
    var m = MODES[mode];
    if (!m) m = MODES["CLASSIC"];
    var strategy = m.strategy;
    var region = dns.region;
    var carrier = getCarrier(ip);
    var connProfile = CONNECTION.profile();
    detectGamePhaseFromTraffic(host, mode);
    if (!GUARD.checkDestination(ip, host, mode)){
        return BLOOD.BLK;
    }
    if (CFG.ENABLE_ML_PREDICTION && SESSION.isWarm()){
        var predicted = ML.predict(mode, region.region || "UNKNOWN");
        var confidence = ML.confidence(mode, region.region || "UNKNOWN");
        if (predicted && confidence >= 78 && PING.isHealthy(mode)){
            return predicted;
        }
    }
    if (m.sticky && SESSION.isWarm()){
        var stickyRoute = stickyGet(mode);
        if (stickyRoute && PING.isHealthy(mode) && !PING.needsOptimization()){
            if (PING.quality(mode) === "EXCELLENT") stickyExtend(mode, 120000);
            return stickyRoute;
        }
    }
    if (mode === "RECRUIT_FAST" || mode === "TEAM_FAST"){
        var recruitSticky = applyRecruitmentBoost(mode);
        if (recruitSticky) return recruitSticky;
        var recruitPool = ["SOCIAL_ORANGE_1","SOCIAL_ZAIN_1","ORANGE_ULTRA_1","ZAIN_ULTRA_1"];
        var routeRecruit = GUARD.buildChain(recruitPool, mode, { burst: true, ultraBurst: true, tier: 0, socialOptimized: true });
        if (routeRecruit && routeRecruit !== BLOOD.BLK){
            stickySet(mode, routeRecruit, 600000);
            ML.recordSuccess(mode, routeRecruit, PING.current(), region.region, true);
            return routeRecruit;
        }
    }
    if (PING.isCritical()){
        stickyClear(mode);
        var emergency = GUARD.buildChain(getBestProxies(0, null, 2, m ? m.socialPriority : false), mode, { burst: true, ultraBurst: true, tier: 0, socialOptimized: m ? m.socialPriority : false });
        stickySet(mode, emergency, m ? m.stickyDuration : 300000);
        ML.recordSuccess(mode, emergency, PING.current(), region.region, m ? m.socialPriority : false);
        return emergency;
    }
    var route = null;
    var requirements = {
        burst: m.requiresBurst || false,
        ultraBurst: m.ultraBurst || false,
        tier: connProfile.tier,
        socialOptimized: m ? m.socialPriority : false
    };
    if (strategy === "SOCIAL_ULTRA_FORCE"){
        if (score >= 92 || (ip && GUARD.isJordan(ip) && region.city === "AMMAN_CORE")){
            route = GUARD.buildChain(["SOCIAL_ORANGE_1","SOCIAL_ZAIN_1","ORANGE_ULTRA_1"], mode, { burst: true, ultraBurst: true, tier: 0, socialOptimized: true });
        } else if (score >= 82 || (ip && GUARD.isJordan(ip))){
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, true), mode, { burst: true, ultraBurst: true, tier: 0, socialOptimized: true });
        } else if (score >= 70){
            route = GUARD.buildChain(getBestProxies(0, null, 2, true), mode, { burst: true, tier: 0, socialOptimized: true });
        } else {
            route = GUARD.buildChain(["ORANGE_ULTRA_1","ZAIN_ULTRA_1"], mode, { burst: true, ultraBurst: true, tier: 0, socialOptimized: true });
        }
    }
    else if (strategy === "RECRUIT_ULTRA_FORCE"){
        var recruitPool = ["SOCIAL_ORANGE_1","SOCIAL_ZAIN_1","ORANGE_ULTRA_1","ZAIN_ULTRA_1","ORANGE_PLAT_ULTRA_1"];
        route = GUARD.buildChain(recruitPool, mode, { burst: true, ultraBurst: true, tier: 0, socialOptimized: true });
    }
    else if (strategy === "LOBBY_ULTRA_FORCE"){
        if (score >= 90 || (ip && GUARD.isJordan(ip))){
            var lobbyPool = getLobbySyncPool(mode, carrier);
            route = GUARD.buildChain(lobbyPool, mode, { burst: true, ultraBurst: true, tier: 0, socialOptimized: true });
        } else {
            route = GUARD.buildChain(["SOCIAL_ORANGE_1","ORANGE_ULTRA_1","ZAIN_ULTRA_1"], mode, { burst: true, ultraBurst: true, tier: 0, socialOptimized: true });
        }
    }
    else if (strategy === "SOCIAL_CRITICAL"){
        route = GUARD.buildChain(getBestProxies(0, null, 2, true), mode, { burst: true, tier: 0, socialOptimized: true });
    }
    else if (strategy === "SOCIAL_GAME_CRITICAL"){
        if (score >= 85 || (ip && GUARD.isJordan(ip))){
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, true), mode, { burst: true, tier: 0, socialOptimized: true });
        } else {
            route = GUARD.buildChain(getBestProxies(0, null, 2, false), mode, { burst: true, tier: 0 });
        }
    }
    else if (strategy === "ENEMY_ULTRA_FORCE"){
        if (PING.current() <= 6){
            var enemyPool = ["ORANGE_ULTRA_1","ZAIN_ULTRA_1","SOCIAL_ORANGE_1","ORANGE_PLAT_ULTRA_1"];
            route = GUARD.buildChain(enemyPool, mode, { burst: true, ultraBurst: false, tier: 0 });
        } else {
            route = GUARD.buildChain(getBestProxies(0, null, 3, false), mode, { burst: true, tier: 0 });
        }
    }
    else if (strategy === "GAME_ULTRA_CRITICAL"){
        if (score >= 90 || (ip && GUARD.isJordan(ip))){
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, false), mode, { burst: true, ultraBurst: true, tier: 0 });
        } else {
            route = GUARD.buildChain(getBestProxies(0, null, 2, false), mode, { burst: true, tier: 0 });
        }
    }
    else if (strategy === "SECURE_CRITICAL"){
        route = GUARD.buildChain(["ORANGE_ULTRA_1","ORANGE_PLAT_ULTRA_1","ZAIN_ULTRA_1"], mode, requirements);
    }
    else if (strategy === "GAME_CRITICAL"){
        if (score >= 85 || (ip && GUARD.isJordan(ip))){
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, false), mode, requirements);
        } else {
            route = GUARD.buildChain(getBestProxies(1, null, 2, false), mode, requirements);
        }
    }
    else if (strategy === "GAME_STANDARD"){
        route = GUARD.buildChain(getBestProxies(1, carrier, 2, false), mode, requirements);
    }
    else if (strategy === "SOCIAL_STANDARD"){
        route = GUARD.buildChain(getBestProxies(1, null, 2, true), mode, { burst: false, tier: 1, socialOptimized: true });
    }
    else if (strategy === "GAME_LIGHT"){
        route = GUARD.buildChain(getBestProxies(2, null, 2, false), mode, requirements);
    }
    else if (strategy === "CDN" || strategy === "SAFE"){
        route = BLOOD.DIR;
    }
    if (!route || (route === BLOOD.DIR && m && m.priority >= 8)){
        route = GUARD.buildChain(getBestProxies(0, null, 3, m ? m.socialPriority : false), mode, { burst: true, tier: 0, socialOptimized: m ? m.socialPriority : false });
    }
    if (!route || route === BLOOD.DIR) route = BLOOD.DIR;
    if (m && m.sticky){
        stickySet(mode, route, m.stickyDuration);
    }
    if (CFG.ENABLE_ML_PREDICTION){
        ML.recordSuccess(mode, route, PING.current(), region.region, m ? m.socialPriority : false);
    }
    return route;
}


// ═══════════════════════════════════════════════════════════════════════
//  MAIN PAC FUNCTION
// ═══════════════════════════════════════════════════════════════════════

function FindProxyForURL(url, host){
    SESSION.requests++;
    SESSION.updateTimeContext();
    if (SESSION.requests === 1 && CFG.PREFETCH_SOCIAL_DNS){
        prefetchSocialEndpoints();
    }
    if (!host) return BLOOD.DIR;
    var h = host.toLowerCase();
    if (isPlainHostName(host)) return BLOOD.DIR;
    if (isIPv4(host)){
        if (isInNet(host, "10.0.0.0", "255.0.0.0") || isInNet(host, "172.16.0.0", "255.240.0.0") || isInNet(host, "192.168.0.0", "255.255.0.0") || isInNet(host, "127.0.0.0", "255.0.0.0")){
            return BLOOD.DIR;
        }
    }
    CONNECTION_POOL.acquire(host, SESSION.currentMode || "UNKNOWN");
    if (containsAny(h, DIRECT_KEYS) && !containsAny(h, PUBG_KEYS)){
        SESSION.directHits++;
        CONNECTION_POOL.release(host, SESSION.currentMode || "CLASSIC", BLOOD.DIR);
        return BLOOD.DIR;
    }
    if (!containsAny(h, PUBG_KEYS)){
        SESSION.directHits++;
        CONNECTION_POOL.release(host, SESSION.currentMode || "CLASSIC", BLOOD.DIR);
        return BLOOD.DIR;
    }
    SESSION.pubgRequests++;
    var dns = fastDNS(host);
    var ip = dns.ip;
    var mode = dns.mode;
    var port = getPort(url);
    SESSION.recordMode(mode);
    if (ip && ip.indexOf(":") !== -1){
        if (CFG.JORDAN_ONLY_MODE || CFG.BLOCK_INTERNATIONAL){
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
//  CARRIER DETECTION
// ═══════════════════════════════════════════════════════════════════════

function getCarrier(ip){
    if (!ip || !isIPv4(ip)) return "UNKNOWN";
    if (isInNet(ip, "46.185.128.0", "255.255.128.0") || isInNet(ip, "94.127.208.0", "255.255.240.0") || isInNet(ip, "149.200.136.0", "255.255.252.0")) return "ORANGE";
    if (isInNet(ip, "79.173.192.0", "255.255.192.0") || isInNet(ip, "109.237.192.0", "255.255.224.0") || isInNet(ip, "176.28.0.0", "255.254.0.0")) return "ZAIN";
    if (isInNet(ip, "82.212.0.0", "255.255.0.0") || isInNet(ip, "212.35.64.0", "255.255.192.0")) return "UMNIAH";
    if (isInNet(ip, "188.247.0.0", "255.255.0.0") || isInNet(ip, "94.230.0.0", "255.255.0.0")) return "JT";
    return "OTHER";
}

function getCarrierBonus(carrier){
    if (carrier === "ORANGE") return 45;
    if (carrier === "ZAIN") return 42;
    if (carrier === "UMNIAH") return 38;
    if (carrier === "JT") return 30;
    return 0;
}


// ═══════════════════════════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

function now(){ return (new Date()).getTime(); }
function generateSessionId(){ return "JO_V32_" + now() + "_" + Math.random().toString(36).substr(2, 9); }
function isIPv4(str){
    if (!str || str.indexOf(":") !== -1) return false;
    var parts = str.split(".");
    if (parts.length !== 4) return false;
    for (var i = 0; i < 4; i++){
        var n = parseInt(parts[i], 10);
        if (isNaN(n) || n < 0 || n > 255) return false;
    }
    return true;
}
function maskFromCIDR(cidr){
    cidr = String(cidr);
    var masks = {
        "8":"255.0.0.0","10":"255.192.0.0","11":"255.224.0.0","12":"255.240.0.0",
        "13":"255.248.0.0","14":"255.252.0.0","15":"255.254.0.0","16":"255.255.0.0",
        "17":"255.255.128.0","18":"255.255.192.0","19":"255.255.224.0","20":"255.255.240.0",
        "21":"255.255.248.0","22":"255.255.252.0"
    };
    return masks[cidr] || "255.255.0.0";
}
function inRanges(ip, ranges){
    if (!ip || !isIPv4(ip)) return false;
    for (var i = 0; i < ranges.length; i++){
        var base = ranges[i][0];
        var cidr = ranges[i][1];
        var mask = maskFromCIDR(cidr);
        if (isInNet(ip, base, mask)) return true;
    }
    return false;
}
function containsAny(str, keywords){
    for (var i = 0; i < keywords.length; i++){
        if (str.indexOf(keywords[i]) !== -1) return true;
    }
    return false;
}
function getPort(url){
    var match = url.match(/^[a-zA-Z]+:\/\/[^\/:]+:(\d+)/);
    if (match) return parseInt(match[1], 10);
    if (url.indexOf("https://") === 0) return 443;
    if (url.indexOf("http://") === 0) return 80;
    return 443;
}


// ═══════════════════════════════════════════════════════════════════════
//  PERFORMANCE REPORT
// ═══════════════════════════════════════════════════════════════════════

function generatePerformanceReport(){
    if (!CFG.AUTO_REPORT_GENERATION) return null;
    var bestSocial = PING.socialAvg() || 999;
    var lobbyHealth = SESSION.lobbyJoins > 0 ? Math.round((SESSION.lobbyJoins / Math.max(1, SESSION.pubgRequests)) * 100) : 0;
    var poolHealth = CONNECTION_POOL.getPoolHealth();
    return {
        version: CFG.VERSION,
        session: SESSION.getReport(),
        connectionPool: poolHealth,
        socialPerformance: {
            friendDiscoveries: SESSION.friendDiscoveries,
            crewSearches: SESSION.crewSearches,
            lobbyJoins: SESSION.lobbyJoins,
            jordanPlayersFound: SESSION.jordanPlayersFound,
            socialAPIavgPing: bestSocial,
            lobbyHealthPercent: lobbyHealth
        },
        healthSummary: {
            excellent: Object.keys(HEALTH).filter(function(k){ return HEALTH[k].status === "EXCELLENT"; }).length,
            critical: Object.keys(HEALTH).filter(function(k){ return HEALTH[k].status === "CRITICAL"; }).length
        },
        recommendation: PING.needsOptimization() ? "SWITCH_PROXY_IMMEDIATELY" : "OPTIMAL"
    };
}


// ═══════════════════════════════════════════════════════════════════════
//  END — PUBG JORDAN ULTIMATE v32.0 (REPLACED PROXY POOL)
// ═══════════════════════════════════════════════════════════════════════
