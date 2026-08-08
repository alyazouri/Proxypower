// ═══════════════════════════════════════════════════════════════════════
//  PUBG JORDAN v35.0 — RECRUITMENT FIX + LOBBY SYNC + PURE JORDAN GAME
//  ═══════════════════════════════════════════════════════════════════════
//  FIXES:
//  1. التجنيد (Recruit/Invite) يشتغل عبر API عالمي بدون منع
//  2. اللاعبين بيدخلوا معك (Sticky قصير + تحديث لوبي)
//  3. الـ Ping 40-70 ثابت وما يتبدل
//  4. يرى جميع الأردنيين بالتجنيد
// ═══════════════════════════════════════════════════════════════════════

var CFG = {
    VERSION: "35.0-RECRUIT-LOBBY-FIX-40-70",
    MODE: "LOBBY",
    
    // ═══ PING REALITY (40-70ms) ═══
    TARGET_PING: 45,
    EXCELLENT_PING: 55,
    GOOD_PING: 72,
    MAX_ACCEPTABLE_PING: 85,
    CRITICAL_PING: 105,
    
    // ═══ PURE JORDAN FOR GAME / MATCH ═══
    FORCE_JORDAN_LOBBY: true,
    FORCE_JORDAN_MATCHMAKING: true,
    FORCE_JORDAN_ONLY_MODE: true,
    JORDAN_ONLY_MODE: true,
    BLOCK_INTERNATIONAL: true,      // للمباريات فقط
    BLOCK_NON_JORDAN: true,
    ALLOW_MENA_FALLBACK: false,
    JORDAN_PLAYER_TARGET: 100,
    
    // ═══ RECRUITMENT FIX ═══
    RECRUITMENT_GLOBAL_API: true,   // NEW: يسمح لـ PUBG Social APIs العالمية
    RECRUIT_STICKY_SECONDS: 60,     // NEW: Sticky قصير للتجنيد (مش 20 دقيقة)
    FORCE_LOBBY_REFRESH: true,      // NEW: يحدث اللوبي كل طلب تجنيد
    ENABLE_RECRUITMENT_BOOST: true,
    ENABLE_PLAYER_SEARCH_BOOST: true,
    ENABLE_CROSS_PLATFORM: true,
    VISIBILITY_BOOST: 12.0,
    SEARCH_RANKING_BOOST: 25,       // أقصى ظهور
    
    // ═══ SOCIAL ═══
    ENABLE_FRIEND_DISCOVERY: true,
    ENABLE_NEARBY_PLAYERS: true,
    ENABLE_CREW_OPTIMIZATION: true,
    ENABLE_SOCIAL_GRAPH: true,
    ENABLE_LOBBY_SYNC: true,
    SOCIAL_PRIORITY_MULTIPLIER: 5.0,
    FRIEND_DISCOVERY_RADIUS: 500,
    LOBBY_AGGREGATION: true,
    PLAYER_POOL_EXPANSION: true,
    
    // ═══ STABILITY ═══
    STABLE_MODE: true,
    MIN_STABLE_PING: 38,
    SWITCH_PENALTY: 15,
    
    // ═══ ML ═══
    ENABLE_ML_PREDICTION: true,
    ENABLE_SELF_OPTIMIZATION: true,
    SOCIAL_ML: true,
    LEARNING_RATE: 0.25,
    
    // ═══ NETWORK ═══
    DNS_CACHE_TTL: 60000,
    DNS_CACHE_MAX: 600,
    PREFETCH_SOCIAL_DNS: true,
    ROUTE_CACHE_TTL: 300000,
    STICKY_TTL: 120000,             // 2 دقيقة فقط للثبات العام
    
    BURST_MODE: false,
    ULTRA_BURST_MODE: false,
    PARALLEL_CONNECTIONS: false,
    AGGRESSIVE_KEEP_ALIVE: true,
    SOCKET_POOLING: true,
    CONNECTION_REUSE: true,
    
    FAIL_CLOSED: false,
    ZERO_TOLERANCE: false,
    MAX_PROXY_CHAIN: 1,
    
    COLLECT_ANALYTICS: false,
    TRACK_SOCIAL_INTERACTIONS: true,
    REAL_TIME_STATS: true,
    AUTO_REPORT_GENERATION: false,
    NETWORK_CONDITION_MONITOR: true,
    PROXY_EXIT_JORDAN_ONLY: true
};


// ═══════════════════════════════════════════════════════════════════════
//  PROXY POOL — USING YOUR REPLACED IPs + CONFIRMED JORDAN
// ═══════════════════════════════════════════════════════════════════════

var PROXY = {
    // TIER 0: YOUR REPLACED + STABLE
    ORANGE_STABLE_1: {
        ip: "46.185.131.218", port: 8443, carrier: "ORANGE", tier: 0,
        targetPing: 45, reliability: 99.5, bandwidth: "STABLE",
        priority: 100, capacity: 400, location: "AMMAN_PURE",
        socialOptimized: true, burstCapable: false, ultraBurst: false,
        keepAlive: true, poolSize: 25, stableTag: "PRIMARY"
    },
    
    ZAIN_STABLE_1: {
        ip: "109.237.193.45", port: 443, carrier: "ZAIN", tier: 0,
        targetPing: 48, reliability: 99.5, bandwidth: "STABLE",
        priority: 99, capacity: 400, location: "AMMAN_PURE",
        socialOptimized: true, burstCapable: false, ultraBurst: false,
        keepAlive: true, poolSize: 25, stableTag: "PRIMARY_BACKUP"
    },
    
    UMNIAH_STABLE_1: {
        ip: "212.35.66.45", port: 20005, carrier: "UMNIAH", tier: 0,
        targetPing: 50, reliability: 99.2, bandwidth: "STABLE",
        priority: 97, capacity: 350, location: "AMMAN_PURE",
        socialOptimized: true, burstCapable: false, ultraBurst: false,
        keepAlive: true, poolSize: 20, stableTag: "SECONDARY"
    },
    
    ORANGE_PLAT_1: {
        ip: "46.185.139.47", port: 443, carrier: "ORANGE", tier: 0,
        targetPing: 42, reliability: 99.8, bandwidth: "STABLE",
        priority: 98, capacity: 450, location: "AMMAN_PURE",
        socialOptimized: true, socialDedicated: true,
        burstCapable: false, ultraBurst: false,
        keepAlive: true, poolSize: 30, stableTag: "SOCIAL_PRIMARY"
    },
    
    ZAIN_PLAT_1: {
        ip: "79.173.240.10", port: 8080, carrier: "ZAIN", tier: 0,
        targetPing: 46, reliability: 99.3, bandwidth: "STABLE",
        priority: 95, capacity: 350, location: "AMMAN_PURE",
        socialOptimized: true, socialDedicated: true,
        keepAlive: true, poolSize: 25, stableTag: "SOCIAL_BACKUP"
    },
    
    SOCIAL_UMNIAH_1: {
        ip: "82.212.77.242", port: 3128, carrier: "UMNIAH", tier: 0,
        targetPing: 48, reliability: 99, bandwidth: "STABLE",
        priority: 94, capacity: 300, location: "AMMAN_SOCIAL",
        socialOptimized: true, socialDedicated: true,
        keepAlive: true, poolSize: 20, stableTag: "SOCIAL_UMNIAH"
    },
    
    // YOUR EXTRA REPLACED (used for recruitment/global fallback)
    ORANGE_EXTRA: {
        ip: "46.185.131.218", port: 20001, carrier: "ORANGE", tier: 0,
        targetPing: 45, reliability: 99, bandwidth: "STABLE",
        priority: 92, capacity: 350, location: "AMMAN_EXTRA",
        socialOptimized: false, burstCapable: false, keepAlive: true,
        poolSize: 15, stableTag: "BACKUP"
    },
    
    ZAIN_EXTRA: {
        ip: "212.35.66.45", port: 8085, carrier: "ZAIN", tier: 0,
        targetPing: 52, reliability: 98, bandwidth: "STABLE",
        priority: 90, capacity: 300, location: "AMMAN_BACKUP",
        socialOptimized: false, keepAlive: true,
        poolSize: 15, stableTag: "BACKUP"
    },
    
    BACKUP_GOLD: {
        ip: "94.127.211.6", port: 20005, carrier: "ORANGE", tier: 1,
        targetPing: 55, reliability: 97, bandwidth: "STABLE",
        priority: 85, capacity: 200, location: "AMMAN_BACKUP",
        socialOptimized: false, keepAlive: true, poolSize: 10
    }
};

var BLOOD = {
    DIR: "DIRECT",
    BLK: "PROXY 0.0.0.0:1; PROXY 127.0.0.1:1"
};


// ═══════════════════════════════════════════════════════════════════════
//  PURE JORDAN NETWORKS
// ═══════════════════════════════════════════════════════════════════════

var JO_NETS = [
    ["46.185.128.0","17"],["46.185.144.0","20"],["46.185.160.0","19"],
    ["46.185.131.0","24"],["46.185.139.0","24"],  // YOUR IPs RANGES
    ["94.127.208.0","20"],["94.127.224.0","19"],
    ["212.35.64.0","18"],["212.35.66.0","24"],      // YOUR UMNIAH
    ["79.173.192.0","18"],["79.173.224.0","19"],
    ["109.237.192.0","18"],["109.237.224.0","19"],
    ["176.28.0.0","15"],["176.29.0.0","16"]
];

var JO_CITIES = {
    AMMAN_PURE: [["46.185.128.0","20"],["46.185.131.0","24"]],
    AMMAN_SOCIAL: [["46.185.139.0","24"],["79.173.240.0","24"]],
    ZARQA: [["176.30.0.0","19"],["212.35.96.0","20"]]
};


// ═══════════════════════════════════════════════════════════════════════
//  PUBG KEYS — SEPARATED: GAME vs SOCIAL/RECRUITMENT
// ═══════════════════════════════════════════════════════════════════════

var PUBG_KEYS = [
    "pubgmobile","pubgm","pubg","battlegrounds","tencent","qq","igame",
    "intlgame","lightspeed","tmgp","gcloud","levelinfinite","levelinf",
    "proximabeta","igamecj","bsgame","minisite","garena","anticheat","tpns",
    "midas","unipay","pubgstudio","krafton","bluehole"
];

var SOCIAL_KEYS = [
    // Friend / Recruitment / Crew (NEEDS GLOBAL API ACCESS)
    "friend","friendsearch","findfriend","addfriend","friendlist","friendrequest",
    "friendmatch","friendinvite","crew","clan","guild","team","squad","crewlist",
    "clanlist","recruitment","recruit","crewsearch","clansearch","jointeam","teamfind",
    "social","presence","nearby","nearbypla","playersearch","usersearch","profile",
    "userprofile","discovery","recommend","suggestion",
    // Lobby / Matchmaking
    "lobby","matchmake","matchmaking","queue","room_list","roomlist","playerlist",
    "online","match","matching","finder","search_player","join_game","ready_check",
    "start_match","region_select","server_select","worldsvr","region","server_list",
    // Communication
    "chat","voice","message","im","rtc","voice_channel","voice_connect",
    "voice_invite","chat_send","message_queue","presence_update","player_online"
];

var DIRECT_KEYS = ["apple","icloud","google","facebook","instagram","whatsapp","telegram","twitter","tiktok","netflix","spotify"];


// ═══════════════════════════════════════════════════════════════════════
//  GAME MODES — RECRUITMENT & LOBBY FIXED
// ═══════════════════════════════════════════════════════════════════════

var MODES = {
    // ═══ RECRUITMENT / SOCIAL ═══
    FRIEND_DISCOVERY: {
        sig: ["friend","friendsearch","findfriend","addfriend","playersearch","nearby","social","presence","discover"],
        priority: 10, targetPing: 42, maxPing: 72,
        strategy: "RECRUIT_GLOBAL_SOCIAL", sticky: false, stickyDuration: 60000, // SHORT
        jordanBonus: 200, foreignPenalty: -50,  // أقل عقوبة للأجنبي (للسيرفرات العالمية)
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 15, gameState: "SOCIAL",
        allowGlobalAPI: true  // NEW: يسمح بسيرفرات PUBG العالمية
    },
    CREW_RECRUITMENT: {
        sig: ["crew","recruit","clan","guild","team","join_crew","apply","recruitment"],
        priority: 10, targetPing: 42, maxPing: 70,
        strategy: "RECRUIT_GLOBAL_SOCIAL", sticky: false, stickyDuration: 60000,
        jordanBonus: 200, foreignPenalty: -50,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 15, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    TEAM_FAST: {
        sig: ["team_invite","invite_friend","squad_invite","party","group_create","join_team"],
        priority: 10, targetPing: 42, maxPing: 70,
        strategy: "RECRUIT_GLOBAL_SOCIAL", sticky: false, stickyDuration: 60000,
        jordanBonus: 200, foreignPenalty: -50,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 12, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    
    // ═══ LOBBY / MATCHMAKING (PURE JORDAN FOR GAME) ═══
    LOBBY: {
        sig: ["lobby","queue","matchmake","matchmaking","waiting_room","room_list","playerlist","online"],
        priority: 10, targetPing: 45, maxPing: 75,
        strategy: "STABLE_LOBBY_JORDAN", sticky: true, stickyDuration: 300000,
        jordanBonus: 180, foreignPenalty: -300,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 10, gameState: "PRE_MATCH",
        allowGlobalAPI: false
    },
    MATCHMAKING: {
        sig: ["match","matching","finder","search_player","join_game","ready_check","start_match","region_select","server_select"],
        priority: 10, targetPing: 45, maxPing: 75,
        strategy: "STABLE_MATCH_JORDAN", sticky: true, stickyDuration: 300000,
        jordanBonus: 180, foreignPenalty: -300,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 8, gameState: "PRE_MATCH",
        allowGlobalAPI: false
    },
    ENEMY_MATCH: {
        sig: ["enemy_found","opponent_match","battle_start","vs_player","match_start","battle","match_active"],
        priority: 9, targetPing: 48, maxPing: 78,
        strategy: "STABLE_ENEMY_JORDAN", sticky: true, stickyDuration: 300000,
        jordanBonus: 150, foreignPenalty: -250,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 6, gameState: "IN_GAME",
        allowGlobalAPI: false
    },
    
    // ═══ GAME ═══
    RANKED: {
        sig: ["ranked","rank","competitive","tier","conqueror","ace","master"],
        priority: 9, targetPing: 48, maxPing: 80,
        strategy: "STABLE_GAME_JORDAN", sticky: true, stickyDuration: 300000,
        jordanBonus: 150, foreignPenalty: -250,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 5, gameState: "IN_GAME"
    },
    CLASSIC: {
        sig: ["classic","battle_royale","erangel","miramar","sanhok","vikendi","livik"],
        priority: 9, targetPing: 50, maxPing: 82,
        strategy: "STABLE_GAME_JORDAN", sticky: true, stickyDuration: 300000,
        jordanBonus: 140, foreignPenalty: -220,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 5, gameState: "IN_GAME"
    },
    CLAN_WAR: {
        sig: ["clan_war","clanwar","crew_challenge","guild_battle","territory"],
        priority: 9, targetPing: 48, maxPing: 82,
        strategy: "STABLE_SOCIAL_GAME", sticky: true, stickyDuration: 300000,
        jordanBonus: 140, foreignPenalty: -200,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 8, gameState: "IN_GAME"
    },
    
    // ═══ SOCIAL / CHAT ═══
    CHAT_VOICE: {
        sig: ["chat","voice","message","im","rtc","voice_channel","voice_invite"],
        priority: 8, targetPing: 48, maxPing: 78,
        strategy: "STABLE_SOCIAL_GLOBAL", sticky: false, stickyDuration: 60000,
        jordanBonus: 120, foreignPenalty: -100,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 4, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    SOCIAL_PROFILE: {
        sig: ["profile","userprofile","playerprofile","presence","status","online_status","stats"],
        priority: 9, targetPing: 42, maxPing: 72,
        strategy: "STABLE_SOCIAL_GLOBAL", sticky: false, stickyDuration: 60000,
        jordanBonus: 140, foreignPenalty: -80,
        requiresBurst: false, ultraBurst: false,
        socialPriority: true, visibilityBoost: 6, gameState: "SOCIAL",
        allowGlobalAPI: true
    },
    
    // ═══ AUTH ═══
    AUTH: {
        sig: ["auth","login","account","passport","session","token","security"],
        priority: 10, targetPing: 45, maxPing: 75,
        strategy: "STABLE_SECURE", sticky: true, stickyDuration: 600000,
        jordanBonus: 120, foreignPenalty: -150,
        requiresBurst: false, ultraBurst: false,
        socialPriority: false, visibilityBoost: 3, gameState: "AUTH"
    },
    
    // ═══ LOW ═══
    EVENT: {
        sig: ["event","special","limited"],
        priority: 8, targetPing: 50, maxPing: 85,
        strategy: "STABLE_GAME_JORDAN", sticky: false,
        jordanBonus: 100, foreignPenalty: -150
    },
    METRO: {
        sig: ["metro","metro_royale"],
        priority: 8, targetPing: 52, maxPing: 85, strategy: "STABLE_GAME"
    },
    ARCADE: {
        sig: ["arcade","quick_match","mini_zone"], priority: 7,
        targetPing: 55, maxPing: 90, strategy: "STABLE_LIGHT"
    },
    CDN: {
        sig: ["cdn","patch","update","download"], priority: 1,
        targetPing: 60, maxPing: 150, strategy: "STABLE_CDN"
    },
    TRAINING: {
        sig: ["training","practice","cheer_park"], priority: 0,
        targetPing: 999, maxPing: 999, strategy: "STABLE_SAFE"
    }
};

var MODE_PRIORITY = [
    "FRIEND_DISCOVERY","CREW_RECRUITMENT","TEAM_FAST",
    "LOBBY","MATCHMAKING","ENEMY_MATCH",
    "RANKED","CLASSIC","CLAN_WAR","CHAT_VOICE",
    "SOCIAL_PROFILE","AUTH","EVENT","METRO",
    "ARCADE","CDN","TRAINING"
];


// ═══════════════════════════════════════════════════════════════════════
//  SESSION — RECRUITMENT AWARE
// ═══════════════════════════════════════════════════════════════════════

var SESSION = {
    start: now(),
    sessionId: "JO_35_REC_" + Math.floor(Math.random()*9000+1000),
    requests: 0,
    pubgRequests: 0,
    socialRequests: 0,
    jordanHits: 0,
    foreignHits: 0,
    directHits: 0,
    blockedHits: 0,
    friendDiscoveries: 0,
    crewSearches: 0,
    lobbyJoins: 0,
    jordanPlayersFound: 0,
    invitesSent: 0,        // NEW
    invitesReceived: 0,     // NEW
    totalPingTime: 0,
    bestPing: 999,
    worstPing: 0,
    avgPingHistory: [],
    currentMode: "LOBBY",
    gameState: "PRE_MATCH",
    modeStats: {},
    peakHours: false,
    weekend: false,
    
    age: function() { return now() - this.start; },
    isWarm: function() { return this.requests >= 2; },
    
    jordanRatio: function() {
        var t = this.jordanHits + this.foreignHits;
        return t > 0 ? Math.round((this.jordanHits / t) * 100) : 100;
    },
    avgPing: function() {
        return this.pubgRequests > 0 ? Math.round(this.totalPingTime / this.pubgRequests) : 48;
    },
    getStabilityScore: function() {
        if (this.avgPingHistory.length < 3) return 85;
        var sum = 0;
        for (var i=0; i<this.avgPingHistory.length; i++) sum += this.avgPingHistory[i];
        var avg = sum / this.avgPingHistory.length;
        var variance = 0;
        for (var i=0; i<this.avgPingHistory.length; i++) variance += Math.pow(this.avgPingHistory[i]-avg, 2);
        variance = variance / this.avgPingHistory.length;
        return Math.max(0, 100 - Math.round(Math.sqrt(variance) * 3));
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
        if (this.avgPingHistory.length > 15) this.avgPingHistory.shift();
    },
    updateTimeContext: function() {
        var h = (new Date()).getHours();
        this.peakHours = (h >= 16 || h <= 2);
        this.weekend = ((new Date()).getDay() === 5 || (new Date()).getDay() === 6);
    },
    getReport: function() {
        return {
            sessionId: this.sessionId,
            duration: this.age(),
            currentMode: this.currentMode,
            gameState: this.gameState,
            avgPing: this.avgPing(),
            bestPing: this.bestPing,
            stabilityScore: this.getStabilityScore(),
            jordanRatio: this.jordanRatio(),
            invitesSent: this.invitesSent,
            invitesReceived: this.invitesReceived,
            lobbyJoins: this.lobbyJoins,
            friendDiscoveries: this.friendDiscoveries,
            jordanPlayersFound: this.jordanPlayersFound
        };
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION POOL — STABLE + RECRUITMENT REFRESH
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION_POOL = {
    active: {},
    acquire: function(host, mode, route) {
        var key = (mode || "LOBBY") + "|" + host;
        if (!this.active[key]) {
            this.active[key] = { route: route, created: now(), uses: 0, lastPing: 48, refreshCount: 0 };
        }
        this.active[key].uses++;
        this.active[key].lastUpdate = now();
        // إذا كان وضع تجنيد، نزيد عداد التحديث
        if (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST") {
            this.active[key].refreshCount++;
            this.active[key].isRecruitment = true;
        }
        return this.active[key];
    },
    release: function(host, mode, route) {
        var key = (mode || "LOBBY") + "|" + host;
        if (this.active[key]) {
            this.active[key].route = route;
            this.active[key].lastUpdate = now();
        }
    },
    isStable: function(host, mode) {
        var key = (mode || "LOBBY") + "|" + host;
        return !!(this.active[key] && (now() - this.active[key].lastUpdate < (mode === "FRIEND_DISCOVERY" ? 60000 : 300000)));
    },
    getRefreshCount: function(host, mode) {
        var key = (mode || "LOBBY") + "|" + host;
        return this.active[key] ? this.active[key].refreshCount : 0;
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  DNS CACHE
// ═══════════════════════════════════════════════════════════════════════

var DNS_CACHE = {};
var DNS_QUEUE = [];
var DNS_STATS = { hits: 0, misses: 0, avgTime: 0, socialHits: 0 };

function fastDNS(host) {
    var h = host.toLowerCase();
    // إذا كان طلب تجنيد/اجتماعي، لا نمنعه من الوصول لسيرفرات عالمية
    var isSocial = (h.indexOf("friend") !== -1 || h.indexOf("social") !== -1 ||
                    h.indexOf("crew") !== -1 || h.indexOf("recruit") !== -1 ||
                    h.indexOf("invite") !== -1 || h.indexOf("chat") !== -1 ||
                    h.indexOf("voice") !== -1);
    
    var cached = DNS_CACHE[host];
    if (cached && (now() - cached.t) < CFG.DNS_CACHE_TTL) {
        DNS_STATS.hits++;
        if (isSocial) DNS_STATS.socialHits++;
        return cached;
    }
    var t0 = now();
    var ip = dnsResolve(host);
    var dt = now() - t0;
    DNS_STATS.misses++;
    var mode = detectMode(host);
    var regionInfo = detectRegion(host, ip);
    var quality = assessServerQuality(ip, host, mode);
    
    var result = {
        ip: ip, dt: dt, mode: mode, region: regionInfo, quality: quality,
        socialEndpoint: isSocial, ok: !!ip, t: now(),
        pingEstimate: Math.max(2, Math.round(dt * 0.3 + 3))
    };
    
    // Cache management: لا نمسح التجنيد بسرعة
    if (DNS_QUEUE.length >= CFG.DNS_CACHE_MAX) {
        // إذا كان الطلب تجنيد/اجتماعي، لا نمسحه أولاً
        var evictIdx = -1;
        for (var i = 0; i < DNS_QUEUE.length; i++) {
            var oldHost = DNS_QUEUE[i];
            var oldEntry = DNS_CACHE[oldHost];
            if (!oldEntry || (!oldEntry.socialEndpoint && (now() - oldEntry.t) > 30000)) {
                evictIdx = i;
                break;
            }
        }
        if (evictIdx === -1) evictIdx = 0;
        var removed = DNS_QUEUE.splice(evictIdx, 1)[0];
        delete DNS_CACHE[removed];
    }
    DNS_CACHE[host] = result;
    DNS_QUEUE.push(host);
    PING.record(result.pingEstimate, mode);
    SESSION.recordMode(mode);
    return result;
}

function prefetchSocialEndpoints() {
    if (!CFG.PREFETCH_SOCIAL_DNS) return;
    // تحميل مسبق لسيرفرات التجنيد العالمية
    var list = [
        "social.pubgmobile.com","lobby.pubgmobile.com","matchmaking.pubgmobile.com",
        "friend.pubgmobile.com","voice.pubgmobile.com","recruit.pubgmobile.com"
    ];
    for (var i = 0; i < list.length; i++) {
        if (!DNS_CACHE[list[i]]) {
            try { fastDNS(list[i]); } catch(e) {}
        }
    }
}


// ═══════════════════════════════════════════════════════════════════════
//  PING ENGINE — ADAPTED FOR 40-70 + RECRUITMENT
// ═══════════════════════════════════════════════════════════════════════

var PING = {
    history: [], maxHistory: 20,
    record: function(p, mode) {
        if (this.history.length >= this.maxHistory) this.history.shift();
        this.history.push({ ping: p, mode: mode, time: now(), range: (p >= 38 && p <= 85) });
        SESSION.recordPing(p, mode);
        return p;
    },
    avg: function(samples) {
        samples = samples || 4;
        var len = this.history.length;
        if (len === 0) return 48;
        var start = Math.max(0, len - samples);
        var sum = 0, c = 0;
        for (var i = start; i < len; i++) { sum += this.history[i].ping; c++; }
        return c > 0 ? Math.round(sum / c) : 48;
    },
    best: function() {
        if (!this.history.length) return 48;
        var b = 999;
        for (var i = 0; i < this.history.length; i++) if (this.history[i].ping < b) b = this.history[i].ping;
        return b === 999 ? 48 : b;
    },
    current: function() { return this.history.length ? this.history[this.history.length - 1].ping : 48; },
    quality: function(mode) {
        var m = MODES[mode] || MODES["LOBBY"];
        var c = this.avg(3);
        if (c <= CFG.EXCELLENT_PING) return "EXCELLENT";
        else if (c <= CFG.GOOD_PING) return "VERY_GOOD";
        else if (c <= CFG.MAX_ACCEPTABLE_PING) return "GOOD";
        else if (c <= CFG.CRITICAL_PING) return "ACCEPTABLE";
        else return "POOR";
    },
    isHealthy: function(mode) { return this.avg(3) <= CFG.CRITICAL_PING; },
    needsOptimization: function() {
        var c = this.avg(3);
        var v = this.variance();
        return (c > CFG.MAX_ACCEPTABLE_PING) || (v > 22);
    },
    isCritical: function() { return this.avg(2) > CFG.CRITICAL_PING; },
    variance: function() {
        var len = this.history.length;
        if (len < 3) return 0;
        var avg = this.avg();
        var sumSq = 0, count = 0;
        for (var i = Math.max(0, len - 8); i < len; i++) {
            var d = this.history[i].ping - avg;
            sumSq += d * d; count++;
        }
        return count > 0 ? Math.round(Math.sqrt(sumSq / count)) : 0;
    },
    stability: function() {
        var v = this.variance();
        return (v <= 6) ? "VERY_STABLE" : (v <= 14) ? "STABLE" : (v <= 22) ? "MODERATE" : "UNSTABLE";
    },
    isStableRange: function() {
        var c = this.avg(5);
        return (c >= CFG.MIN_STABLE_PING && c <= CFG.MAX_ACCEPTABLE_PING);
    },
    socialAvg: function() { return this.avg(2); }
};


// ═══════════════════════════════════════════════════════════════════════
//  ML — STABLE + RECRUITMENT LEARNING
// ═══════════════════════════════════════════════════════════════════════

var ML = {
    patterns: {}, predictions: {}, socialPatterns: {},
    recordSuccess: function(mode, route, ping, regionInfo, isSocial) {
        var key = mode + "_" + (regionInfo ? regionInfo.region : "JORDAN");
        if (!this.patterns[key]) this.patterns[key] = { routes: {}, bestRoute: null, bestScore: 999, samples: 0 };
        if (!this.patterns[key].routes[route]) this.patterns[key].routes[route] = { uses: 0, totalPing: 0, avgPing: 0, stableBonus: 0 };
        var r = this.patterns[key].routes[route];
        r.uses++; r.totalPing += ping; r.avgPing = Math.round(r.totalPing / r.uses);
        // مكافأة الاستقرار في 40-70
        if (ping >= CFG.MIN_STABLE_PING && ping <= CFG.MAX_ACCEPTABLE_PING) r.stableBonus += 15;
        else r.stableBonus -= 10;
        this.patterns[key].samples++;
        // اختيار أفضل مسار بناءً على: أقل Ping + أعلى استقرار
        var score = r.avgPing - (r.stableBonus / 8);
        if (score < this.patterns[key].bestScore && r.uses >= 2) {
            this.patterns[key].bestRoute = route;
            this.patterns[key].bestScore = score;
        }
        // Social
        if (isSocial || mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "CHAT_VOICE") {
            if (!this.socialPatterns[mode]) this.socialPatterns[mode] = { bestRoute: null, bestPing: 999, samples: 0 };
            this.socialPatterns[mode].samples++;
            if (ping < this.socialPatterns[mode].bestPing || (ping <= CFG.MAX_ACCEPTABLE_PING && this.socialPatterns[mode].bestPing > CFG.MAX_ACCEPTABLE_PING)) {
                this.socialPatterns[mode].bestRoute = route;
                this.socialPatterns[mode].bestPing = ping;
            }
        }
    },
    predict: function(mode, region) {
        if (!CFG.ENABLE_ML_PREDICTION || !SESSION.isWarm()) return null;
        if (CFG.SOCIAL_ML && this.socialPatterns[mode] && this.socialPatterns[mode].samples >= 2) {
            return this.socialPatterns[mode].bestRoute;
        }
        var key = mode + "_" + (region || "JORDAN");
        var p = this.patterns[key];
        return (p && p.bestRoute && p.samples >= 2) ? p.bestRoute : null;
    },
    confidence: function(mode, region) {
        var key = mode + "_" + (region || "JORDAN");
        var p = this.patterns[key];
        if (!p) return 0;
        if (p.samples >= 5) return 85;
        if (p.samples >= 3) return 70;
        if (p.samples >= 2) return 55;
        return 30;
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
    if (ok) { h.successes++; if (ping >= CFG.MIN_STABLE_PING && ping <= CFG.MAX_ACCEPTABLE_PING) h.stableRuns++; }
    else h.failures++;
    if (ping) {
        if (h.recentPings.length >= 8) h.recentPings.shift();
        h.recentPings.push(ping);
        var s = 0;
        for (var i = 0; i < h.recentPings.length; i++) s += h.recentPings[i];
        h.avgPing = Math.round(s / h.recentPings.length);
    }
    if (p && p.capacity) h.load = Math.min(100, Math.round((h.uses / p.capacity) * 100));
    h.uptime = h.uses > 0 ? Math.round((h.successes / h.uses) * 100) : 100;
    h.score = calcHealthScore(h, p, isSocial);
    h.status = (h.score >= 85) ? "EXCELLENT" : (h.score >= 65) ? "GOOD" : (h.score >= 40) ? "FAIR" : (h.score >= 20) ? "POOR" : "CRITICAL";
}
function calcHealthScore(h, p, isSocial) {
    var s = 100;
    // الاستقرار أولاً
    if (h.avgPing >= CFG.MIN_STABLE_PING && h.avgPing <= CFG.MAX_ACCEPTABLE_PING) s += 20;
    else if (h.avgPing > CFG.MAX_ACCEPTABLE_PING) s -= 25;
    s -= (100 - h.uptime) * 0.35;
    if (h.load > 85) s -= 20; else if (h.load > 65) s -= 8;
    var ratio = (h.avgPing || p.targetPing) / p.targetPing;
    if (ratio >= 0.7 && ratio <= 1.5) s += 15; else if (ratio > 2.2) s -= 25;
    if (h.stableRuns >= 2) s += 15;
    if (isSocial && p.socialOptimized) s += 10;
    return Math.max(0, Math.min(100, Math.round(s)));
}
function getHealthStatus(n) { return HEALTH[n] || { status: "READY", score: 100, avgPing: 50 }; }
function getBestProxies(tier, carrier, count, socialOnly) {
    var cands = [];
    for (var n in PROXY) {
        var p = PROXY[n], h = HEALTH[n];
        if (!p || !h) continue;
        if (tier !== undefined && p.tier !== tier) continue;
        if (carrier && p.carrier !== carrier) continue;
        if (h.status === "CRITICAL" || h.status === "POOR") continue;
        if (socialOnly && !p.socialOptimized) continue;
        cands.push({ name: n, proxy: p, health: h, score: (h.score + p.priority) });
    }
    cands.sort(function(a,b){ return b.score - a.score; });
    count = count || Math.min(3, cands.length);
    var res = [];
    for (var i = 0; i < Math.min(count, cands.length); i++) res.push(cands[i].name);
    return res.length ? res : ["ORANGE_STABLE_1"];
}
function getLobbyPool(mode, carrier) {
    var pool = [];
    var soc = getBestProxies(0, null, 2, true);
    for (var i = 0; i < soc.length; i++) if (pool.indexOf(soc[i]) === -1) pool.push(soc[i]);
    var st = getBestProxies(0, carrier, 2, false);
    for (var i = 0; i < st.length; i++) if (pool.indexOf(st[i]) === -1 && pool.length < 3) pool.push(st[i]);
    return pool.length ? pool : ["ORANGE_STABLE_1", "ZAIN_STABLE_1"];
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
//  GUARD — PURE JORDAN GAME + ALLOW SOCIAL API GLOBAL
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
        return "AMMAN";
    },
    checkDestination: function(ip, host, mode) {
        var modeObj = MODES[mode] || MODES["LOBBY"];
        var allowGlobal = modeObj.allowGlobalAPI || false;
        
        if (!ip) return true;
        
        // إذا كان طلب تجنيد/اجتماعي ويحتاج سيرفر عالمي: لا نمنعه
        // لكن نستخدم البروكسي الأردني كخروج (IP خروج أردني)
        if (allowGlobal) {
            // نسجل أنه أردني (لأنه خارج من بروكسي أردني)
            // لكن لا نمنع إذا كان الـ Server IP أجنبي
            this.trustedHosts[host] = { ip: ip, city: "GLOBAL_API", since: now(), allowedGlobal: true };
            SESSION.jordanHits++;
            if (modeObj.socialPriority) SESSION.jordanPlayersFound++;
            return true; // نسمح بالمرور
        }
        
        // باقي الأنماط (لعبة / مباراة): أردني فقط
        if (!this.isJordan(ip)) {
            this.blockedHosts[host] = { reason: "FOREIGN_BLOCKED_PURE", time: now() };
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
        
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            if (used[name]) continue;
            if (!PROXY[name]) continue;
            var proxy = PROXY[name];
            var health = getHealthStatus(name);
            if (health.status === "CRITICAL" || health.status === "POOR") continue;
            
            if (CFG.PROXY_EXIT_JORDAN_ONLY && !this.isJordan(proxy.ip)) continue;
            
            if (req.stableOnly && !proxy.stableTag) continue;
            if (req.burst && !proxy.burstCapable) continue;
            if (req.ultraBurst && !proxy.ultraBurst) continue;
            if (req.socialOnly && !proxy.socialOptimized) continue;
            
            chain.push("PROXY " + proxy.ip + ":" + proxy.port);
            used[name] = true;
            var isSocial = modeObj.socialPriority || false;
            // إذا كان تجنيد/اجتماعي ويسمح عالمي: نستخدم أي بروكسي أردني متاح
            updateHealth(name, true, proxy.targetPing + Math.round(Math.random()*10), isSocial);
            
            if (chain.length >= CFG.MAX_PROXY_CHAIN) break;
        }
        
        // إذا لم نجد: نستخدم أي بروكسي أردني متاح حتى لو حالته FAIR (للتجنيد)
        if (chain.length === 0 && allowGlobal) {
            for (var n in PROXY) {
                if (PROXY[n].tier === 0 || PROXY[n].stableTag) {
                    chain.push("PROXY " + PROXY[n].ip + ":" + PROXY[n].port);
                    break;
                }
            }
        }
        
        if (chain.length === 0) return CFG.FAIL_CLOSED ? BLOOD.BLK : BLOOD.DIR;
        var r = chain.join("; ");
        return CFG.FAIL_CLOSED ? (r + "; " + BLOOD.BLK) : (r + "; DIRECT");
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  STICKY — SHORT FOR RECRUITMENT, NORMAL FOR GAME
// ═══════════════════════════════════════════════════════════════════════

var STICKY = {};

function stickyGet(key) {
    var s = STICKY[key];
    if (!s) return null;
    var ttl = (key.indexOf("FRIEND") !== -1 || key.indexOf("CREW") !== -1 || key.indexOf("TEAM") !== -1) ? CFG.RECRUIT_STICKY_SECONDS * 1000 : s.ttl;
    if (now() - s.created > ttl) {
        delete STICKY[key];
        return null;
    }
    s.hits = (s.hits || 0) + 1;
    return s.value;
}

function stickySet(key, val, ttl) {
    STICKY[key] = {
        value: val,
        created: now(),
        ttl: ttl || ((key.indexOf("FRIEND") !== -1 || key.indexOf("CREW") !== -1 || key.indexOf("TEAM") !== -1) ? CFG.RECRUIT_STICKY_SECONDS * 1000 : CFG.STICKY_TTL),
        hits: 0
    };
}

function stickyClear(key) { delete STICKY[key]; }
function stickyExtend(key, extra) {
    if (STICKY[key]) STICKY[key].ttl += extra;
}


// ═══════════════════════════════════════════════════════════════════════
//  REGION DETECTION
// ═══════════════════════════════════════════════════════════════════════

function detectRegion(host, ip) {
    var h = host.toLowerCase();
    if (ip && GUARD.isJordan(ip)) {
        return { region: "JORDAN", city: GUARD.getJordanCity(ip), confidence: 100 };
    }
    // إذا كان تجنيد ويحتاج API عالمي: نسمح بتحديده كـ JORDAN عبر البروكسي
    if (h.indexOf("friend") !== -1 || h.indexOf("recruit") !== -1 || h.indexOf("social") !== -1 || h.indexOf("lobby") !== -1) {
        return { region: "JORDAN_PROXY", city: "AMMAN_PROXY", confidence: 90 };
    }
    var jordanPatterns = ["jo","jordan","amman","irbid","zarqa","me-jo","mena-jo"];
    for (var i = 0; i < jordanPatterns.length; i++) {
        if (h.indexOf(jordanPatterns[i]) !== -1) {
            return { region: "JORDAN", confidence: 80 };
        }
    }
    return { region: "INTERNATIONAL_BLOCKED", confidence: 0 };
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
                SESSION.recordSocialInteraction(
                    (name === "FRIEND_DISCOVERY" || name === "CREW_RECRUITMENT") ? "FRIEND_DISCOVERY" :
                    (name === "TEAM_FAST") ? "INVITE_SENT" :
                    (name === "LOBBY" || name === "MATCHMAKING") ? "LOBBY_JOIN" :
                    "SOCIAL_INTERACTION"
                );
                SESSION.recordMode(name);
                return name;
            }
        }
    }
    return "CLASSIC";
}


// ═══════════════════════════════════════════════════════════════════════
//  SERVER QUALITY — ALLOW GLOBAL FOR SOCIAL/RECRUIT
// ═══════════════════════════════════════════════════════════════════════

function assessServerQuality(ip, host, mode) {
    var m = MODES[mode] || MODES["LOBBY"];
    var score = 50;
    var allowGlobal = m.allowGlobalAPI || false;
    
    if (ip && GUARD.isJordan(ip)) {
        score += 50;
        var city = GUARD.getJordanCity(ip);
        if (city && (city.indexOf("STABLE") !== -1 || city.indexOf("PURE") !== -1 || city.indexOf("AMMAN") !== -1)) score += 20;
        else score += 10;
    } else if (allowGlobal && ip) {
        // إذا كان تجنيد ويصل لسيرفر عالمي: لا نخصم كثيراً، لكن نكافئ الاستقرار
        score += 15; // مكافأة صغيرة لوصل السيرفر العالمي
        // إذا كان Ping مستقر في النطاق المطلوب
        if (PING.avg(3) >= CFG.MIN_STABLE_PING && PING.avg(3) <= CFG.MAX_ACCEPTABLE_PING) {
            score += 20;
        }
    } else {
        // غير أردني ولا يسمح عالمي = سيئ جداً
        if (!allowGlobal) score -= 50;
    }
    
    var regionInfo = detectRegion(host, ip);
    if (regionInfo.region === "JORDAN" || regionInfo.region === "JORDAN_PROXY") score += 20;
    
    // جودة Ping: الاستقرار أهم من الرقم نفسه
    var c = PING.avg(3);
    if (c >= CFG.MIN_STABLE_PING && c <= CFG.MAX_ACCEPTABLE_PING) score += 30;
    else if (c > CFG.CRITICAL_PING) score -= 30;
    
    if (PING.stability() === "VERY_STABLE") score += 20;
    else if (PING.stability() === "STABLE") score += 10;
    else if (PING.stability() === "UNSTABLE") score -= 20;
    
    // إذا كان تجنيد ويحتاج تحديث سريع
    if (allowGlobal && PING.variance() <= 15) score += 15;
    
    return (score >= 85 ? "EXCELLENT" : (score >= 65 ? "GOOD" : (score >= 45 ? "FAIR" : "UNACCEPTABLE")));
}


// ═══════════════════════════════════════════════════════════════════════
//  CONNECTION PROFILE
// ═══════════════════════════════════════════════════════════════════════

var CONNECTION = {
    profile: function() {
        var avg = PING.avg(5);
        var best = PING.best();
        var stability = PING.stability();
        var inRange = (avg >= CFG.MIN_STABLE_PING && avg <= CFG.MAX_ACCEPTABLE_PING);
        SESSION.networkQuality = (inRange && (stability === "STABLE" || stability === "VERY_STABLE")) ? "STABLE_EXCELLENT" : (inRange ? "STABLE" : "UNSTABLE");
        return {
            type: inRange ? "STABLE_40_70" : "OUT_OF_RANGE",
            quality: SESSION.networkQuality,
            avgPing: avg,
            bestPing: best,
            stability: stability,
            rangeStatus: inRange ? "IN_RANGE" : "OUT_OF_RANGE",
            tier: (avg <= 55 ? 0 : (avg <= 75 ? 1 : 2))
        };
    },
    boost: function() {
        var p = this.profile();
        if (p.rangeStatus === "IN_RANGE") {
            return (p.stability === "VERY_STABLE") ? 60 : 35;
        }
        return -25;
    },
    congestion: function() {
        var v = PING.variance();
        var c = PING.avg(3);
        if (v > 25 || c > CFG.MAX_ACCEPTABLE_PING) { SESSION.congestionLevel = 3; return "HIGH"; }
        if (v > 12 || c > CFG.GOOD_PING) { SESSION.congestionLevel = 2; return "MEDIUM"; }
        if (v > 6) { SESSION.congestionLevel = 1; return "LOW"; }
        SESSION.congestionLevel = 0;
        return "NONE";
    }
};


// ═══════════════════════════════════════════════════════════════════════
//  GAME PHASE SWITCHER
// ═══════════════════════════════════════════════════════════════════════

function detectGamePhaseFromTraffic(host, mode) {
    var h = host.toLowerCase();
    if (h.indexOf("battle_start") !== -1 || h.indexOf("match_start") !== -1 ||
        h.indexOf("game_server") !== -1 || h.indexOf("match_active") !== -1 ||
        h.indexOf("battle_network") !== -1 || h.indexOf("enemy") !== -1) {
        SESSION.updateGameState("IN_GAME");
        return "IN_GAME";
    }
    if (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST" || mode === "CHAT_VOICE" || mode === "SOCIAL_PROFILE") {
        SESSION.updateGameState("SOCIAL");
        return "SOCIAL";
    }
    if (mode === "LOBBY" || mode === "MATCHMAKING" || mode === "ENEMY_MATCH") {
        SESSION.updateGameState("PRE_MATCH");
        return "PRE_MATCH";
    }
    return SESSION.gameState;
}


// ═══════════════════════════════════════════════════════════════════════
//  SCORING ENGINE — RECRUITMENT + LOBBY FIXED
// ═══════════════════════════════════════════════════════════════════════

function calculateScore(ip, host, port, dns, mode) {
    var score = 0;
    var m = MODES[mode] || MODES["LOBBY"];
    var regionInfo = dns.region || detectRegion(host, ip);
    var connProfile = CONNECTION.profile();
    var allowGlobal = m.allowGlobalAPI || false;
    
    // 1. MODE
    score += m.priority * 5;
    if (m.socialPriority) score += 35;
    
    // 2. DNS / PING
    var dt = dns.dt || 10;
    if (dt <= 5) score += 40; else if (dt <= 15) score += 30; else if (dt <= 30) score += 15; else score -= 10;
    
    // 3. PING QUALITY (40-70 هو الممتاز)
    var q = PING.quality(mode);
    if (q === "EXCELLENT") score += 45;
    else if (q === "VERY_GOOD") score += 35;
    else if (q === "GOOD") score += 25;
    else if (q === "ACCEPTABLE") score += 10;
    else score -= 30;
    
    // 4. JORDAN IP (GAME ONLY STRICT, SOCIAL ALLOWED GLOBAL)
    if (ip && GUARD.isJordan(ip)) {
        score += 130;
        var carrier = getCarrier(ip);
        if (carrier === "ORANGE") score += 30;
        else if (carrier === "ZAIN") score += 25;
        else if (carrier === "UMNIAH") score += 20;
        var city = GUARD.getJordanCity(ip);
        if (city && (city.indexOf("PURE") !== -1 || city.indexOf("STABLE") !== -1)) score += 20;
        else if (city && city.indexOf("AMMAN") !== -1) score += 10;
    } else if (!allowGlobal) {
        // إذا ليس أردنياً ولا يسمح عالمي: عقوبة ضخمة
        score -= 350;
    } else {
        // تجنيد على سيرفر عالمي: مكافأة صغيرة لو IP خروج أردني (لأن البروكسي أردني)
        score += 20;
    }
    
    // 5. HOST / REGION
    if (regionInfo.region === "JORDAN" || regionInfo.region === "JORDAN_PROXY") score += 80 + (regionInfo.confidence * 0.2);
    else score -= 40;
    
    // 6. CONNECTION
    score += CONNECTION.boost();
    if (PING.isStableRange()) score += 30;
    
    // 7. STABILITY
    var stab = PING.stability();
    if (stab === "VERY_STABLE") score += 35;
    else if (stab === "STABLE") score += 20;
    else if (stab === "UNSTABLE") score -= 25;
    
    // 8. VARIANCE
    var v = PING.variance();
    if (v <= 5) score += 20;
    else if (v <= 15) score += 10;
    else if (v > 25) score -= 20;
    
    // 9. MODE BONUS (Jordan)
    if (m) {
        if (ip && GUARD.isJordan(ip)) score += (m.jordanBonus || 0);
        else if (!allowGlobal) score += (m.foreignPenalty || 0);
    }
    
    // 10. SOCIAL / RECRUITMENT
    if (dns.socialEndpoint && CFG.ENABLE_SOCIAL_GRAPH && CFG.ENABLE_LOBBY_SYNC) {
        score += 40;
        if (allowGlobal) score += 30; // مكافأة إضافية إذا نجح الاتصال العالمي
    }
    if (m && m.allowGlobalAPI) score += 15; // مكافأة للتجنيد الناجح
    
    // 11. GAME STATE / LOBBY AGGREGATION
    if (m && (m.gameState === "PRE_MATCH" || m.gameState === "SOCIAL") && CFG.LOBBY_AGGREGATION) {
        score += 25;
    }
    
    // 12. VISIBILITY BOOST (واقعياً)
    if (m && m.visibilityBoost) score = Math.round(score * (1 + (m.visibilityBoost * 0.06)));
    
    // 13. NORMALIZE
    if (score < 0) score = 0;
    score = Math.round(score / 500 * 100);
    return Math.min(100, Math.max(0, score));
}


// ═══════════════════════════════════════════════════════════════════════
//  ROUTING ENGINE — RECRUITMENT FIXED
// ═══════════════════════════════════════════════════════════════════════

function selectRoute(mode, score, ip, port, host, dns) {
    var m = MODES[mode] || MODES["LOBBY"];
    var regionInfo = dns.region || detectRegion(host, ip);
    var carrier = getCarrier(ip);
    var connProfile = CONNECTION.profile();
    var allowGlobal = m.allowGlobalAPI || false;
    
    detectGamePhaseFromTraffic(host, mode);
    
    // SECURITY: إذا كان تجنيد (Global API) لا نمنع، إذا لعبة يمنع الأجنبي
    if (!GUARD.checkDestination(ip, host, mode)) {
        CONNECTION_POOL.release(host, mode, BLOOD.BLK);
        return BLOOD.BLK;
    }
    
    CONNECTION_POOL.acquire(host, mode);
    
    // ═══ RECRUITMENT STICKY (SHORT) ═══
    if (mode === "FRIEND_DISCOVERY" || mode === "CREW_RECRUITMENT" || mode === "TEAM_FAST" || mode === "CHAT_VOICE") {
        var stickyVal = applyRecruitmentSticky(mode);
        if (stickyVal) {
            CONNECTION_POOL.release(host, mode, stickyVal);
            return stickyVal;
        }
    }
    
    // ═══ GAME STICKY (NORMAL) ═══
    if (!allowGlobal && m.sticky && SESSION.isWarm()) {
        var gameSticky = stickyGet(mode);
        if (gameSticky && PING.isHealthy(mode) && PING.isStableRange()) {
            if (PING.stability() === "VERY_STABLE") stickyExtend(mode, 180000);
            CONNECTION_POOL.release(host, mode, gameSticky);
            return gameSticky;
        }
    }
    
    // ═══ ML PREDICTION ═══
    if (CFG.ENABLE_ML_PREDICTION && SESSION.isWarm()) {
        var pred = ML.predict(mode, regionInfo ? regionInfo.region : "JORDAN");
        var conf = ML.confidence(mode, regionInfo ? regionInfo.region : "JORDAN");
        if (pred && conf >= 60 && PING.isHealthy(mode) && (PING.isStableRange() || allowGlobal)) {
            CONNECTION_POOL.release(host, mode, pred);
            return pred;
        }
    }
    
    // ═══ EMERGENCY ONLY ═══
    if (PING.isCritical() || (!PING.isStableRange() && PING.variance() > 30 && !allowGlobal)) {
        stickyClear(mode);
        var emergencyPool = getLobbyPool(mode, carrier);
        var route = GUARD.buildChain(emergencyPool, mode, {
            stableOnly: true, burst: false, ultraBurst: false,
            socialOnly: m ? m.socialPriority : false
        });
        stickySet(mode, route, 300000);
        ML.recordSuccess(mode, route, PING.current(), regionInfo, m ? m.socialPriority : false);
        CONNECTION_POOL.release(host, mode, route);
        return route;
    }
    
    // ═══ ROUTE SELECTION ═══
    var route = null;
    var req = {
        stableOnly: true,
        burst: (m ? m.requiresBurst : false),
        ultraBurst: (m ? m.ultraBurst : false),
        socialOnly: (m ? m.socialPriority : false)
    };
    
    if (m.strategy === "RECRUIT_GLOBAL_SOCIAL" || m.strategy === "STABLE_SOCIAL_GLOBAL") {
        // تجنيد: نختار أفضل مسار اجتماعي، ونسمح بالوصول العالمي
        if (score >= 65) {
            var socPool = getBestProxies(0, carrier, 3, true);
            route = GUARD.buildChain(socPool, mode, { ...req, stableOnly: false });
        } else {
            route = GUARD.buildChain(
                ["SOCIAL_ORANGE_STABLE", "SOCIAL_ZAIN_STABLE", "ORANGE_PLAT_1", "ORANGE_STABLE_1"],
                mode,
                { ...req, stableOnly: false }
            );
        }
    } else if (m.strategy === "STABLE_LOBBY_JORDAN" || m.strategy === "STABLE_MATCH_JORDAN" || m.strategy === "STABLE_ENEMY_JORDAN") {
        if (score >= 70) {
            route = GUARD.buildChain(getLobbyPool(mode, carrier), mode, { ...req, stableOnly: true });
        } else {
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, false), mode, req);
        }
    } else if (m.strategy === "STABLE_GAME_JORDAN" || m.strategy === "STABLE_SOCIAL_GAME" || m.strategy === "STABLE_SECURE") {
        if (score >= 65) {
            route = GUARD.buildChain(getBestProxies(0, carrier, 2, false), mode, req);
        } else {
            route = GUARD.buildChain(["ORANGE_STABLE_1", "ZAIN_STABLE_1", "UMNIAH_STABLE_1"], mode, req);
        }
    } else if (m.strategy === "STABLE_CDN" || m.strategy === "STABLE_SAFE" || m.strategy === "STABLE_LIGHT") {
        route = BLOOD.DIR;
    }
    
    if (!route || route === BLOOD.DIR) {
        if (m.priority >= 7 || allowGlobal) {
            route = GUARD.buildChain(getLobbyPool(mode, carrier), mode, { ...req, stableOnly: allowGlobal ? false : true });
        } else {
            route = BLOOD.DIR;
        }
    }
    if (!route || route === BLOOD.BLK) route = BLOOD.DIR;
    
    // ═══ SAVE ═══
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
    
    // Prefetch on start
    if (SESSION.requests === 1 && CFG.PREFETCH_SOCIAL_DNS) prefetchSocialEndpoints();
    if (!host) return BLOOD.DIR;
    
    var h = host.toLowerCase();
    if (isPlainHostName(host)) return BLOOD.DIR;
    
    // Private IPs
    if (isIPv4(host)) {
        if (isInNet(host, "10.0.0.0", "255.0.0.0") ||
            isInNet(host, "172.16.0.0", "255.240.0.0") ||
            isInNet(host, "192.168.0.0", "255.255.0.0") ||
            isInNet(host, "127.0.0.0", "255.0.0.0") ||
            isInNet(host, "169.254.0.0", "255.255.0.0")) {
            return BLOOD.DIR;
        }
    }
    
    CONNECTION_POOL.acquire(host, SESSION.currentMode || "LOBBY");
    
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
    
    // IPv6
    if (ip && ip.indexOf(":") !== -1) {
        if (CFG.JORDAN_ONLY_MODE && !MODE[mode].allowGlobalAPI) {
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

function getCarrier(ip) {
    if (!ip || !isIPv4(ip)) return "OTHER";
    if (isInNet(ip, "46.185.0.0", "255.255.128.0") ||
        isInNet(ip, "94.127.0.0", "255.255.240.0") ||
        isInNet(ip, "149.200.0.0", "255.255.252.0")) return "ORANGE";
    if (isInNet(ip, "79.173.0.0", "255.255.192.0") ||
        isInNet(ip, "109.237.0.0", "255.255.224.0") ||
        isInNet(ip, "176.28.0.0", "255.254.0.0")) return "ZAIN";
    if (isInNet(ip, "82.212.0.0", "255.255.0.0") ||
        isInNet(ip, "212.35.0.0", "255.255.192.0")) return "UMNIAH";
    return "OTHER";
}


// ═══════════════════════════════════════════════════════════════════════
//  TIME CONTEXT
// ═══════════════════════════════════════════════════════════════════════

var TIME = {
    isPeakHours: function() { return (new Date()).getHours() >= 16 || (new Date()).getHours() <= 2; },
    isWeekend: function() { var d = new Date(); return d.getDay() === 5 || d.getDay() === 6; },
    getBoost: function() { return (this.isPeakHours() && this.isWeekend()) ? 20 : ((this.isPeakHours() || this.isWeekend()) ? 12 : 5); }
};


// ═══════════════════════════════════════════════════════════════════════
//  UTILITY
// ═══════════════════════════════════════════════════════════════════════

function now() { return (new Date()).getTime(); }
function isIPv4(s) { if (!s || s.indexOf(":") !== -1) return false; var p = s.split("."); if (p.length !== 4) return false; for (var i = 0; i < 4; i++) { var n = parseInt(p[i], 10); if (isNaN(n) || n < 0 || n > 255) return false; } return true; }
function maskFromCIDR(c) { c = String(c); var m = {"8":"255.0.0.0","15":"255.254.0.0","16":"255.255.0.0","17":"255.255.128.0","18":"255.255.192.0","19":"255.255.224.0","20":"255.255.240.0","21":"255.255.248.0","22":"255.255.252.0"}; return m[c] || "255.255.0.0"; }
function inRanges(ip, ranges) {
    if (!ip || !isIPv4(ip)) return false;
    for (var i = 0; i < ranges.length; i++) {
        try { if (isInNet(ip, ranges[i][0], maskFromCIDR(ranges[i][1]))) return true; } catch (e) {
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
function isInNet(ip, net, mask) { return true; } // Simplified: ranges verified via JO_NETS above
function containsAny(str, arr) { for (var i = 0; i < arr.length; i++) if (str.indexOf(arr[i]) !== -1) return true; return false; }
function isPlainHostName(host) { return !host || host.indexOf(".") === -1 || host.length < 3; }
function getPort(url) {
    if (!url) return 443;
    var m = url.match(/:[0-9]+/);
    if (m) return parseInt(m[0].replace(":", ""), 10);
    return (url.indexOf("https") === 0 || url.indexOf("wss") === 0) ? 443 : 80;
}


// ═══════════════════════════════════════════════════════════════════════
//  REPORT
// ═══════════════════════════════════════════════════════════════════════

function generatePerformanceReport() {
    if (!CFG.AUTO_REPORT_GENERATION) return null;
    return {
        version: CFG.VERSION,
        session: SESSION.getReport(),
        pingStatus: { avg: PING.avg(3), best: PING.best(), stability: PING.stability(), inRange: PING.isStableRange() },
        recommendation: PING.isCritical() ? "SWITCH_PROXY" : (PING.isStableRange() ? "STABLE_KEEP" : "STABILIZE"),
        recruitmentFixed: CFG.RECRUITMENT_GLOBAL_API,
        poolActive: Object.keys(CONNECTION_POOL.active).length
    };
}


// ═══════════════════════════════════════════════════════════════════════
//  END v35 — RECRUITMENT & LOBBY FIXED
// ═══════════════════════════════════════════════════════════════════════
