// PUBG_JO_ADVANCED_ENGINE.pac
// سكربت متطور للمطابقة الأردنية في ببجي
// الإصدار: ADVANCED-ENGINE-4.0-FIXED
//
// أهداف هذا المحرك:
// - إقناع النظام إنك أردني اجتماعيًا (لوبي / تيم / سكواد / انفايت / ماتشميكنغ).
// - إعطاء كل نوع طلب "شخصية أردنية" مختلفة (بروكسي وبورتات مناسبة).
// - تثبيت نفس البروكسي مؤقتًا لكل فئة حتى تبقى هويتك الأردنية ثابتة.
// - اختيار بروكسي أردني "أفضل" من مجموعة حسب reliability/latency.
// - عدم فضحك لو البروكسي وقع (نستخدم shadow block بدل DIRECT لطلبات حساسة).
//
// ملاحظة: السكربت يؤثر فقط على الترافيك الاجتماعي/التجميعي لببجي
// وليس على بقية الإنترنت (باقي الأشياء = DIRECT).

var DEBUG_MODE = false;       // إذا true نحاول console.log (مش كل البيئات تسمح)
var ANALYTICS_MODE = false;   // Counters inside memory only

// ====== تكوين البروكسيات الأردنية المتعددة ======
var JO_PROXY_POOL = [
  { host: "91.106.109.12", reliability: 95, latency: 25 },
  { host: "185.141.122.45", reliability: 92, latency: 30 },
  { host: "213.215.98.67",  reliability: 90, latency: 35 },
  { host: "109.107.144.88", reliability: 88, latency: 40 }
];

// بورتات ديناميكية حسب نوع الطلب (نعامل كل دور وكأنه له شخصية / persona)
var ADVANCED_ROLE_PORTS = {
  MATCH:       [20001,20002,20003,20004,20005,10010,12235,15500,16800],
  LOBBY:       [443,8080,8443,9080,7500],
  RECRUIT:     [443,8080,9443,10080],
  SEARCH:      [443,8080,8888,9999],
  REQUEST:     [443,8080,7443,8880],
  VOICE_CHAT:  [7000,7001,7002,8000,8001],
  TELEMETRY:   [9200,9201,9300,9301],
  FRIENDS:     [6080,6443,6800,6900],
  CLAN:        [5080,5443,5800,5900]
};

// PUBG أنماط موسعة (URL patterns)
var PUBG_ENHANCED_PATTERNS = {
  SOCIAL: [
    "*/account/login*", "*/account/profile*", "*/account/friends*",
    "*/client/version*", "*/client/config*",
    "*/presence/*", "*/status/*",
    "*/friends/*", "*/buddy/*", "*/social/*",
    "*/team/search*", "*/squad/search*", "*/clan/search*",
    "*/findTeam*", "*/findSquad*", "*/findMate*", "*/findClan*",
    "*/recruit*", "*/recruitment/*", "*/invitation/*",
    "*/applyToJoin*", "*/joinRequest*", "*/clanRequest*",
    "*/invite/*", "*/party/invite*", "*/team/invite*", "*/squad/invite*",
    "*/request/*", "*/joinTeamRequest*", "*/joinSquadRequest*"
  ],
  MATCHMAKING: [
    "*/matchmaking/*", "*/mms/*", "*/matching/*",
    "*/game/start*", "*/game/join*", "*/game/create*",
    "*/lobby/join*", "*/room/create*", "*/room/join*"
  ],
  VOICE: [
    "*/voice/*", "*/audio/*", "*/rtc/*", "*/webrtc/*",
    "*/mic/*", "*/speaker/*", "*/communication/*"
  ],
  TELEMETRY: [
    "*/analytics/*", "*/metrics/*", "*/stats/*", "*/tracking/*",
    "*/crash/*", "*/performance/*", "*/usage/*"
  ],
  CLAN: [
    "*/clan/*", "*/guild/*", "*/tribe/*", "*/alliance/*",
    "*/clanwar/*", "*/tournament/*"
  ]
};

// heuristic "ذكاء" للكشف عن أنماط اجتماعية جديدة
var AI_PATTERN_DETECTION = {
  suspiciousKeywords: ["team","squad","friend","invite","join","social","match","lobby","clan"],
  confidenceThreshold: 0.7
};

// إحصائيات بسيطة داخل الذاكرة
var ANALYTICS = {
  requestCount: {},     // category -> count
  successRate: {}       // category -> {total,success}
};

// كاش DNS (TTL اجتماعي بدل ما نغير IP كل ثانية)
var DNS_CACHE = {}; // host -> {ip, t}

// social stickiness: نخزن بروكسي آخر فئة مع timestamp حتى نثبت هوية أردنية
var SOCIAL_FOOTPRINT = {}; // category -> { proxy, t, count }

// fallback/protection stuff
var SHADOW_BLOCK = "PROXY 127.0.0.1:9"; // لما نرفض نكشف IP أجنبي فجأة

// TTL للبصمة الاجتماعية (ms)
var SOCIAL_TTL_MS = 120 * 1000;

// نطاقات الأردن المحسّنة
var JO_ENHANCED_RANGES = {
  IPV4: [
    {start: "94.249.0.0",   end: "94.249.255.255"},
    {start: "109.107.0.0",  end: "109.107.255.255"},
    {start: "185.141.0.0",  end: "185.141.255.255"},
    {start: "213.215.0.0",  end: "213.215.255.255"},
    {start: "212.118.0.0",  end: "212.118.255.255"},
    {start: "91.106.96.0",  end: "91.106.127.255"}
  ],
  IPV6: [
    "2a03:b640:c000::", // Umniah narrow-ish
    "2a03:6b00::",      // Zain JO
    "2a00:18d8::",      // Orange JO
    "2a01:9700::"       // JDC/GO
  ]
};

// قائمة الدومينات المعروفة لببجي
var PUBG_DOMAINS = [
  "*.pubgmobile.com",
  "*.pubgmobile.net",
  "*.igamecj.com",
  "*.proximabeta.com",
  "*.gcloud.qq.com",
  "gpubgm.com",
  "*.tgp.qq.com"
];

// ---------------------- HELPERS ----------------------

function advLog(level, msg, extra){
  if (!DEBUG_MODE) return;
  var t = new Date().toISOString();
  var base = "["+t+"]["+level+"] "+msg;
  if (extra) {
    try {
      base += " | Data: " + JSON.stringify(extra);
    } catch(e){}
  }
  try { console.log(base); } catch(e){}
}

// safe number parser
function ip4ToNum(ip){
  var parts = ip.split(".");
  if (parts.length !== 4) return null;
  var n = 0;
  for (var i=0;i<4;i++){
    var v = parseInt(parts[i],10);
    if (isNaN(v) || v<0 || v>255) return null;
    n = (n<<8)+v;
  }
  return n>>>0;
}

// check if IPv4 is Jordanian
function isJordanianIPv4(ip){
  var num = ip4ToNum(ip);
  if (num === null) return false;
  for (var i=0;i<JO_ENHANCED_RANGES.IPV4.length;i++){
    var r = JO_ENHANCED_RANGES.IPV4[i];
    var start = ip4ToNum(r.start);
    var end   = ip4ToNum(r.end);
    if (start!==null && end!==null && num>=start && num<=end){
      return true;
    }
  }
  return false;
}

// check if IPv6 looks Jordanian by prefix
function isJordanianIPv6(ip){
  var low = ip.toLowerCase();
  for (var i=0;i<JO_ENHANCED_RANGES.IPV6.length;i++){
    var pref = JO_ENHANCED_RANGES.IPV6[i];
    // prefix match textually
    if (low.indexOf(pref) === 0) return true;
  }
  return false;
}

function isJordanianIP(ip){
  if (!ip) return false;
  if (ip.indexOf(".") !== -1) {
    return isJordanianIPv4(ip);
  }
  if (ip.indexOf(":") !== -1) {
    return isJordanianIPv6(ip);
  }
  return false;
}

// cache DNS with TTL
function cachedResolve(host){
  var now = Date.now();
  var rec = DNS_CACHE[host];
  if (rec && (now - rec.t < SOCIAL_TTL_MS)){
    return rec.ip;
  }
  try {
    var ip = dnsResolve(host);
    DNS_CACHE[host] = { ip: ip, t: now };
    return ip;
  } catch(e){
    return null;
  }
}

// basic wildcard domain match
function isPubgDomain(host){
  for (var i=0;i<PUBG_DOMAINS.length;i++){
    try {
      if (shExpMatch(host, PUBG_DOMAINS[i])) return true;
    } catch(e){}
  }
  return false;
}

// return true if string matches any pattern in list
function matchesAny(str, list){
  for (var i=0;i<list.length;i++){
    try {
      if (shExpMatch(str, list[i])) return true;
    } catch(e){}
  }
  return false;
}

// heuristic AI-ish classification for new/unknown URLs that still look social/team-ish
function aiLooksSocial(url){
  var score = 0;
  // base suspicious keywords
  var kw = AI_PATTERN_DETECTION.suspiciousKeywords;
  var lower = url.toLowerCase();
  for (var i=0;i<kw.length;i++){
    if (lower.indexOf(kw[i]) !== -1){
      score += 0.1;
    }
  }
  // path hints
  if (url.match(/\/(social|team|squad|friend|invite|join|match|lobby|clan)/i)) {
    score += 0.3;
  }
  // query hints
  if (url.match(/[?&](team|squad|invite|social|friend|match|clan)=/i)) {
    score += 0.2;
  }
  return score >= AI_PATTERN_DETECTION.confidenceThreshold;
}

// map “pattern group” -> role category we expose to routing
function mapCategoryToRole(groupName){
  if (groupName === "SOCIAL")       return "LOBBY";
  if (groupName === "MATCHMAKING")  return "MATCH";
  if (groupName === "VOICE")        return "VOICE_CHAT";
  if (groupName === "TELEMETRY")    return "TELEMETRY";
  if (groupName === "CLAN")         return "CLAN";
  return "LOBBY";
}

// classify URL into a routing role
function classifyCategory(url){
  // 1. rule-based using PUBG_ENHANCED_PATTERNS
  for (var group in PUBG_ENHANCED_PATTERNS){
    var patterns = PUBG_ENHANCED_PATTERNS[group];
    if (matchesAny(url, patterns)){
      return mapCategoryToRole(group);
    }
  }
  // 2. AI-ish heuristic fallback
  if (aiLooksSocial(url)){
    return "SEARCH"; // treat unknown-but-social as SEARCH
  }
  // 3. if nothing matched, we don't force it
  return null;
}

// analytics counters
function recordAnalytics(category, proxyStr, success){
  if (!ANALYTICS_MODE) return;
  if (!ANALYTICS.requestCount[category]) ANALYTICS.requestCount[category] = 0;
  ANALYTICS.requestCount[category]++;

  if (!ANALYTICS.successRate[category]){
    ANALYTICS.successRate[category] = {total:0, success:0};
  }
  ANALYTICS.successRate[category].total++;
  if (success){
    ANALYTICS.successRate[category].success++;
  }
}

// pick best JO proxy for a given category using reliability/latency scoring
function selectOptimalProxy(category){
  // filter out any proxy we've marked as failed >3 times
  // (we keep failureCount in LOAD_BALANCER struct)
  var usable = [];
  var i;
  for (i=0;i<JO_PROXY_POOL.length;i++){
    var proxy = JO_PROXY_POOL[i];
    var fc = LOAD_BALANCER_failureCount(proxy.host);
    if (fc < 3){
      usable.push(proxy);
    }
  }
  if (usable.length === 0){
    // reset failures
    LOAD_BALANCER_resetFailures();
    usable = JO_PROXY_POOL.slice();
  }

  // sort best first: (reliability - latency)
  usable.sort(function(a,b){
    var scoreA = a.reliability - a.latency;
    var scoreB = b.reliability - b.latency;
    return (scoreB - scoreA);
  });

  var chosen = usable[0];

  // pick dynamic port persona from ADVANCED_ROLE_PORTS
  var ports = ADVANCED_ROLE_PORTS[category];
  if (!ports || ports.length === 0){
    ports = [443];
  }
  var port = ports[Math.floor(Math.random()*ports.length)];

  var out = "PROXY " + chosen.host + ":" + port;
  advLog("INFO","selectOptimalProxy chose", {category:category, proxy:out});
  return out;
}

// maintain failure counts in LOAD_BALANCER
var LOAD_BALANCER = {
  failureCount: {}
};

function LOAD_BALANCER_failureCount(host){
  if (!LOAD_BALANCER.failureCount[host]) return 0;
  return LOAD_BALANCER.failureCount[host];
}
function LOAD_BALANCER_markFailure(host){
  if (!LOAD_BALANCER.failureCount[host]) LOAD_BALANCER.failureCount[host] = 0;
  LOAD_BALANCER.failureCount[host] = LOAD_BALANCER.failureCount[host] + 1;
}
function LOAD_BALANCER_resetFailures(){
  LOAD_BALANCER.failureCount = {};
}

// social footprint stickiness per category
function getSocialFootprint(category){
  var now = Date.now();
  var rec = SOCIAL_FOOTPRINT[category];
  if (rec && (now - rec.t < SOCIAL_TTL_MS)){
    return rec.proxy;
  }
  return null;
}
function setSocialFootprint(category, proxyStr){
  SOCIAL_FOOTPRINT[category] = {
    proxy: proxyStr,
    t: Date.now(),
    count: (SOCIAL_FOOTPRINT[category] ? (SOCIAL_FOOTPRINT[category].count+1) : 1)
  };
}

// MAIN DECISION
function FindProxyForURL(url, host){
  advLog("DEBUG","Processing request",{url:url,host:host});

  // لو الدومين مش PUBG أصلاً -> DIRECT
  if (!isPubgDomain(host)){
    advLog("DEBUG","Non-PUBG direct",{host:host});
    return "DIRECT";
  }

  // صنّف الطلب: MATCH / LOBBY / RECRUIT / SEARCH / REQUEST / VOICE_CHAT / TELEMETRY / FRIENDS / CLAN
  var category = classifyCategory(url);

  // إذا مش ضمن التصنيفات اللي بتأثر على المطابقة الاجتماعية -> DIRECT
  // ملاحظة: إحنا منقصد نوجّه فقط الاتصالات اللي بتبني هوية اجتماعية / تبحث سكواد / ماتشميكنغ.
  if (!category){
    advLog("DEBUG","PUBG but not social-critical -> DIRECT",{url:url});
    return "DIRECT";
  }

  // sticky نفس الهوية الأردنية لفترة SOCIAL_TTL_MS
  var sticky = getSocialFootprint(category);
  if (sticky){
    advLog("INFO","Using sticky social footprint",{category:category,proxy:sticky});
    recordAnalytics(category, sticky, true);
    return sticky;
  }

  // حل DNS وقراءة الوجهة لمعرفة إذا السيرفر أردني
  var destIP = cachedResolve(host);
  advLog("DEBUG","DNS result",{host:host,ip:destIP});

  // اختار بروكسي أردني optimal حسب الـ pool
  var chosenProxy = selectOptimalProxy(category);

  if (destIP){
    // إذا الهدف أردني -> نعزز القصة ونثبت البروكسي للكاتيجوري
    if (isJordanianIP(destIP)){
      advLog("SUCCESS","Jordanian destination detected",{ip:destIP,category:category,proxy:chosenProxy});
      setSocialFootprint(category, chosenProxy);
      recordAnalytics(category, chosenProxy, true);
      return chosenProxy;
    } else {
      // الهدف مش أردني، بس إحنا بدنا نحافظ على انطباع أردني اجتماعي
      advLog("INFO","Non-JO dest, forcing JO persona",{ip:destIP,category:category,proxy:chosenProxy});
      setSocialFootprint(category, chosenProxy);
      recordAnalytics(category, chosenProxy, true);
      return chosenProxy;
    }
  }

  // إذا DNS فشل: ما بدنا نرجع DIRECT فوراً ونكسر القصّة
  // نعطي Shadow Block مؤقت، اللعبة عادة تعيد المحاولة وبترجع تطلب DNS
  advLog("WARN","DNS failed, applying shadow block",{category:category});
  recordAnalytics(category, SHADOW_BLOCK, false);
  return SHADOW_BLOCK;
}
