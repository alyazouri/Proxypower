// PUBG_JO_ILLUSION_ENGINE.pac
// الهدف: خلق انطباع اجتماعي قوي جداً أنك لاعب أردني وتبحث عن أردنيين.
// يحقن الجاذبية الأردنية في اللوبي، التجنيد، البحث عن فريق، الانفايت، والماتشميكنغ.
// يعتمد على:
//  - بصمة أردنية ثابتة لكل فئة اجتماعية
//  - توزيع بورتات مختلف لكل فئة (persona per role)
//  - حماية هويتك من أي تسريب غير أردني (Shadow Fallback)
//
// الإصدار: ILLUSION-ENGINE-3.0

var DEBUG_MODE = false;

// ====== CONFIG: بوابة أردنية واحدة ثابتة ======
// لازم تكون خروجة أردنية Residential/Mobile/Fiber داخل الأردن.
var JO_PROXY_HOST = "91.106.109.12";

// مجموعات البورتات لكل فئة (Persona per role)
var ROLE_PORTS = {
  MATCH:    [20001,20002,20003,20004,20005,10010,12235],
  LOBBY:    [443,8080,8443],
  RECRUIT:  [443,8080],
  SEARCH:   [443,8080],
  REQUEST:  [443,8080]
};

// لما يصير عطل، ما نرسل DIRECT لمكالمات حساسة. ندفنها عشان ما تنكشف هويتك.
var SHADOW_BLOCK = "PROXY 127.0.0.1:9";

// TTL (ms) لتثبيت هوية أردنية لكل فئة اجتماعية
var SOCIAL_TTL_MS = 90 * 1000;

// DNS cache عالقليل لتقليل التغير
var DNS_CACHE = {};

// social memory: آخر مرة عززنا صورة أردنية لهالفئة
// { MATCH:{t:...,proxy:"PROXY ..."}, LOBBY:{...} ... }
var SOCIAL_FOOTPRINT = {};


// ==== PUBG Classification Rules ====

// أي host من هدول يعني PUBG backend (لوبي، معلومات حساب، presence...)
var PUBG_HOSTS = [
  "*.pubgmobile.com",
  "*.pubgmobile.net",
  "*.igamecj.com",
  "*.proximabeta.com",
  "*.gcloud.qq.com",
  "gpubgm.com",
  "*.tgp.qq.com"
];

// كلمات الطلبات الاجتماعية / التجنيد / البحث / الانضمام / الفريندز / اللوبي / الستارت
// هدول مهمين لأنهم بيحددوا مين رح تكون معه.
var PUBG_SOCIAL_PATTERNS = [
  "*/account/login*",
  "*/client/version*",
  "*/presence/*",
  "*/friends/*",
  "*/team/search*",
  "*/squad/search*",
  "*/findTeam*",
  "*/findSquad*",
  "*/findMate*",
  "*/recruit*",
  "*/recruitment/*",
  "*/applyToJoin*",
  "*/joinRequest*",
  "*/invite/*",
  "*/party/invite*",
  "*/team/invite*",
  "*/squad/invite*",
  "*/request/*",
  "*/joinTeamRequest*",
  "*/joinSquadRequest*",
  "*/matchmaking/*",
  "*/mms/*",
  "*/game/start*",
  "*/game/join*"
];

// خانات التوزيع حسب نوع الطلب
function classifyCategory(url){
  // الماتش وبدء الجيم
  if (matchAny(url, ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*"])) {
    return "MATCH";
  }
  // لوبي / فريند / حضور
  if (matchAny(url, ["*/account/login*","*/client/version*","*/presence/*","*/friends/*"])) {
    return "LOBBY";
  }
  // تجنيد
  if (matchAny(url, ["*/recruit*","*/recruitment/*","*/applyToJoin*","*/joinRequest*"])) {
    return "RECRUIT";
  }
  // بحث عن تيم
  if (matchAny(url, ["*/team/search*","*/squad/search*","*/findTeam*","*/findSquad*","*/findMate*","*/match/searchTeam*"])) {
    return "SEARCH";
  }
  // دعوات / انفايت / طلبات انضمام
  if (matchAny(url, ["*/invite/*","*/party/invite*","*/team/invite*","*/squad/invite*","*/request/*","*/joinTeamRequest*","*/joinSquadRequest*"])) {
    return "REQUEST";
  }
  return null;
}


// ===== Utility helpers =====

function log(msg){
  if (!DEBUG_MODE) return;
  try { console.log("[ILLUSION] " + msg); } catch(e){}
}

// wildcard match list
function matchAny(val, patterns){
  for (var i=0;i<patterns.length;i++){
    try { if (shExpMatch(val, patterns[i])) return true; } catch(e){}
  }
  return false;
}

// هل الدومين تابع فعلاً لـ PUBG (بأي طبقة اجتماعية)؟
function isPubgHost(host){
  for (var i=0;i<PUBG_HOSTS.length;i++){
    try { if (shExpMatch(host, PUBG_HOSTS[i])) return true; } catch(e){}
  }
  return false;
}

// resolve DNS + cache (علشان ما يبدّل IP كل سطر)
function cachedResolve(host){
  var now = Date.now();
  var rec = DNS_CACHE[host];
  if (rec && (now - rec.t < SOCIAL_TTL_MS)) {
    return rec.ip;
  }
  try {
    var ip = dnsResolve(host);
    DNS_CACHE[host] = {ip: ip, t: now};
    return ip;
  } catch(e){
    return null;
  }
}

// هل العنوان (v4 or v6) يعطي انطباع أردني قوي؟
// ضيقنا IPv6 على شبكات أردنية معروفة وقريبة لـ last-mile
var JO_V6_CIDRS = [
  "2a03:b640:c000::", // Umniah narrow
  "2a03:6b00::",      // Zain core v6
  "2a00:18d8::",      // Orange core v6
  "2a01:9700::"       // JDC/GO core v6
];
var JO_V4_BLOCKS = [
  ["94.249.0.0","94.249.127.255"],
  ["109.107.0.0","109.107.255.255"],
  ["185.141.0.0","185.141.255.255"],
  ["213.215.0.0","213.215.255.255"],
  ["212.118.0.0","212.118.255.255"]
];

function ip4ToNum(ip){
  var p = ip.split(".");
  if (p.length!==4) return null;
  var n=0;
  for (var i=0;i<4;i++){
    var v=parseInt(p[i],10);
    if(isNaN(v)||v<0||v>255) return null;
    n=(n<<8)+v;
  }
  return n>>>0;
}
function isJOv4(ip){
  if (!ip || ip.indexOf(".")===-1) return false;
  var n = ip4ToNum(ip);
  if (n===null) return false;
  for (var i=0;i<JO_V4_BLOCKS.length;i++){
    var start = ip4ToNum(JO_V4_BLOCKS[i][0]);
    var end   = ip4ToNum(JO_V4_BLOCKS[i][1]);
    if (n>=start && n<=end) return true;
  }
  return false;
}
function isJOv6(ip){
  if (!ip || ip.indexOf(":")===-1) return false;
  var low = ip.toLowerCase();
  for (var i=0;i<JO_V6_CIDRS.length;i++){
    if (low.indexOf(JO_V6_CIDRS[i])===0) return true;
  }
  return false;
}

// نصنع بروكسي للشخصية الاجتماعية لهذه الفئة
function buildPersonaProxy(category){
  // خذ بورت عشوائي من ROLE_PORTS[category] عشان تبين طبيعي
  var list = ROLE_PORTS[category] || [443];
  var port = list[Math.floor(Math.random()*list.length)];
  return "PROXY " + JO_PROXY_HOST + ":" + port;
}

// SOCIAL_FOOTPRINT keeps per-category sticky for SOCIAL_TTL_MS
// حتى لو dnsResolve أعطى عنوان مو أردني، إحنا منضل نرجع نفس البروكسي
// إذا لسه بحدود TTL، عشان تثبت بصمتك الاجتماعية الأردنية
function getStickySocial(category){
  var now = Date.now();
  var rec = SOCIAL_FOOTPRINT[category];
  if (rec && (now - rec.t < SOCIAL_TTL_MS)) {
    return rec.proxy;
  }
  return null;
}
function setStickySocial(category, proxyStr){
  SOCIAL_FOOTPRINT[category] = { proxy: proxyStr, t: Date.now() };
}


// ===== MAIN DECISION =====
function FindProxyForURL(url, host){
  // step 1: إذا ما إلو علاقة ببجي روح DIRECT فوراً
  var socialHit = matchAny(url, PUBG_SOCIAL_PATTERNS);
  var pubgHit = socialHit || isPubgHost(host);
  if (!pubgHit){
    return "DIRECT";
  }

  // step 2: صنّف نوع الطلب (MATCH / LOBBY / RECRUIT / SEARCH / REQUEST)
  var category = classifyCategory(url);

  // إذا مش من الفئات الاجتماعية اللي بتبني سكواد/لوبي أردني → DIRECT
  // لأنك قلت ما بدك نلمس الصوت / التليمتري / الشورت / إلخ
  if (!category){
    return "DIRECT";
  }

  // step 3: لو الفئة الاجتماعية إلها sticky جاهز ولسا ضمن TTL → رجّع نفس البروكسي
  var pinned = getStickySocial(category);
  if (pinned){
    log("Sticky "+category+" → " + pinned);
    return pinned;
  }

  // step 4: جرّب نحل الوجهة ونتأكد إنها لها علاقة بمسار أردني
  var dstIP = cachedResolve(host);

  // منشان الانطباع:
  //  - إذا الوجهة أردنية (v4/v6 جوّا الأردن) → نولد persona بروكسي أردني ونثبته
  //  - إذا الوجهة مو أردنية:
  //      - من STILL نولد persona أردني ونثبته (هنا الوهم: نقول للسيرفر احسبنا أردن)
  //      - لكن إذا dnsFail تمامًا، نروح SHADOW_BLOCK عشان ما نسرب non-JO

  if (dstIP){
    var persona = buildPersonaProxy(category);

    // إذا السيرفر نفسه أردني:
    if (isJOv4(dstIP) || isJOv6(dstIP)){
      setStickySocial(category, persona);
      log("Category "+category+" JO dst "+dstIP+" → persona "+persona);
      return persona;
    }

    // السيرفر مش أردني
    // بس إحنا بدنا نخلّيه يشوفنا إحنا أردنيين (الانطباع الاجتماعي)
    setStickySocial(category, persona);
    log("Category "+category+" NON-JO dst "+dstIP+" → FORCE persona "+persona);
    return persona;
  }

  // ما قدرنا نجيب IP (dnsResolve فشل)
  // هون بندخل وضع الحماية: ما نعطي DIRECT غير أردني فجأة.
  // لو مافي sticky سابق، نمنع هذا الكونتاكت الحساس لحظياً حتى اللعبة تعيد المحاولة.
  var oldPersona = getStickySocial(category);
  if (oldPersona){
    log("Category "+category+" reuse sticky after DNS fail → "+oldPersona);
    return oldPersona;
  } else {
    log("Category "+category+" DNS fail, SHADOW block");
    return SHADOW_BLOCK;
  }
}
