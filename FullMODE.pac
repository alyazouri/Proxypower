// PUBG_JO_FULL_IDENTITY_LOCK.pac
// الهدف: قفل هوية اللاعب بالكامل كـ "أردني" لكل الترافيك اللي ببجي تستخدمه لتحديد موقعك/سيرفرك:
// - matchmaking / join game
// - lobby / friends / presence
// - voice chat
// - heartbeat / telemetry / report
//
// أي شيء من PUBG اللي له علاقة بالsession/game identity يطلع غصب عن طريق بروكسي أردني ثابت (sticky).
// الاستثناءات فقط لخدمات مثل يوتيوب / واتساب / سناب / شاهد (تظل DIRECT).
//
// Version: FULL-IDENTITY-LOCK-1.0

var DEBUG_MODE = false;

// قائمة بروكسيات أردنية. رتّبهم حسب اللي انت واثق منه أكثر.
var PROXY_CANDIDATES = [
  { host: "91.106.109.12", port: 443, label: "residential-JO" },
  { host: "185.141.39.25", port: 443, label: "mobile-JO" },
  { host: "213.215.220.130", port: 443, label: "fiber-JO" }
];

// sticky proxy TTL ms (نفس الخروجة لنفسك لفترة)
var PROXY_STICKY_TTL_MS = 60 * 1000;

// بورتات حسب الـ role
var FIXED_PORT = {
  MATCH: 20001, // بدء/انضمام جيم
  LOBBY: 443,   // لوبي / فرندز / وجودك أونلاين
  VOICE: 443,   // الصوت (عادة over 443/UDP فعلياً بس بالPAC بنرجع نفس البروكسي)
  TELEMETRY: 443 // heartbeat / report / stats
};

// استثناءات DIRECT للحياة اليومية
var DIRECT_ALLOW_DOMAINS = [
  "youtube.com","youtu.be",
  "whatsapp.com","whatsapp.net",
  "snapchat.com","snap."
];

// ---------------- PUBG TRAFFIC CATEGORIES ----------------
//
// ملاحظة: ببجي ما تستخدم دومين واحد للصوت أو التليمتري بشكل رسمي ثابت معلن، 
// بس لحد الآن أغلبهم يطلع تحت نفس عيلة الدومينات تبعت تينسنت / بروكسي ببجي.
// إحنا رح نعتبر أي host معروف لـ pubg / tencent / qq الخاص باللعبة = حسّاس.
// يعني رح نوسّع نطاق "الحساس" بدل ما نحاول نفرق بدقة مرعبة.
//
// 1. MATCH / MATCHMAKING / JOIN GAME
var PUBG_MATCH_HOSTS = [
  "*.gcloud.qq.com",
  "gpubgm.com",
  "*.tgp.qq.com"
];
var PUBG_MATCH_PATTERNS = [
  "*/matchmaking/*",
  "*/mms/*",
  "*/game/start*",
  "*/game/join*"
];

// 2. LOBBY / FRIENDS / PRESENCE / LOGIN
var PUBG_LOBBY_HOSTS = [
  "*.pubgmobile.com",
  "*.pubgmobile.net",
  "*.igamecj.com",
  "*.proximabeta.com"
];
var PUBG_LOBBY_PATTERNS = [
  "*/account/login*",
  "*/client/version*",
  "*/presence/*",
  "*/friends/*"
];

// 3. VOICE (in-game voice / voip / rtc style)
// عادة بتكون ضمن نفس البنية (igamecj / tencent infra). 
// إحنا رح نلتقطها بالـ keywords العامة للصوت/voice/voip/rtc.
var PUBG_VOICE_PATTERNS = [
  "*/voice/*",
  "*/voip/*",
  "*/rtc/*",
  "*/teamvoice/*",
  "*/audio/*"
];

// 4. TELEMETRY / HEARTBEAT / REPORT / STATS
// heartbeat, report/battle, status, analytics, anti-cheat ping
var PUBG_TELEMETRY_PATTERNS = [
  "*/status/heartbeat*",
  "*/report/battle*",
  "*/anticheat/*",
  "*/telemetry/*",
  "*/stats/*",
  "*/uploadlog*",
  "*/upload_log*",
  "*/log/report*"
];

// ----------------------------------------------------------

// كاش global عشان الsticky
var _root = (typeof globalThis !== "undefined") ? globalThis : this;
_root._PAC_HARDCACHE = _root._PAC_HARDCACHE || {};
var PAC_CACHE = _root._PAC_HARDCACHE;

// ---------- Helpers ----------
function log(msg){
  if (DEBUG_MODE){
    try { console.log("[PAC FULL-ID] " + msg); } catch(e){}
  }
}

// نختار بروكسي أردني واحد ونلزق عليه فترة
function getStickyProxy(){
  var now = Date.now();
  if (PAC_CACHE.selProxy && (now - (PAC_CACHE.selTime||0) < PROXY_STICKY_TTL_MS)){
    return PAC_CACHE.selProxy;
  }

  // حاول تختار واحد بنعرف إنه يشتغل (dnsResolve يشتغل = على الأقل الاستضافة حية)
  for (var i=0; i<PROXY_CANDIDATES.length; i++){
    var c = PROXY_CANDIDATES[i];
    try {
      var r = dnsResolve(c.host);
      if (r && r.length>0){
        var chosen = "PROXY "+c.host+":"+(c.port||443);
        PAC_CACHE.selProxy = chosen;
        PAC_CACHE.selTime = now;
        log("Selected JO proxy "+chosen);
        return chosen;
      }
    } catch(e){}
  }

  // fallback لو ولا واحد قدرنا نعمله resolve
  var f = PROXY_CANDIDATES[0];
  var fallbackProxy = "PROXY "+f.host+":"+(f.port||443);
  PAC_CACHE.selProxy = fallbackProxy;
  PAC_CACHE.selTime = now;
  log("Fallback JO proxy "+fallbackProxy);
  return fallbackProxy;
}

// wildcard host match
function hostMatches(host, patternList){
  for (var i=0; i<patternList.length; i++){
    if (shExpMatch(host, patternList[i])) return true;
  }
  return false;
}

// wildcard url match
function urlMatches(url, patternList){
  for (var i=0; i<patternList.length; i++){
    if (shExpMatch(url, patternList[i])) return true;
  }
  return false;
}

// هل بنسمح DIRECT عشانها مش ببجي (يوتيوب/واتساب/سناب/شاهد)
function isDirectAllowed(url, host){
  for (var i=0;i<DIRECT_ALLOW_DOMAINS.length;i++){
    if (shExpMatch(host, "*"+DIRECT_ALLOW_DOMAINS[i]+"*")) {
      return true;
    }
  }
  // "شاهد" (MBC Shahid) بتحمل مشاهدة عبر /watch
  if (host.indexOf("shahid") !== -1 && url.toLowerCase().indexOf("/watch") !== -1) {
    return true;
  }
  return false;
}

// تحديد نوع الترافيك لأي طلب
function classifyTraffic(url, host){
  // MATCH (join/start matchmaking)
  if (hostMatches(host, PUBG_MATCH_HOSTS) || urlMatches(url, PUBG_MATCH_PATTERNS)){
    return "MATCH";
  }

  // LOBBY / presence / login / friends
  if (hostMatches(host, PUBG_LOBBY_HOSTS) || urlMatches(url, PUBG_LOBBY_PATTERNS)){
    return "LOBBY";
  }

  // VOICE (in-game audio/rtc)
  if (urlMatches(url, PUBG_VOICE_PATTERNS)){
    return "VOICE";
  }

  // TELEMETRY / HEARTBEAT / REPORT / anti-cheat / stats / logs
  if (urlMatches(url, PUBG_TELEMETRY_PATTERNS)){
    return "TELEMETRY";
  }

  // otherwise unknown / normal
  return "OTHER";
}

// نبني الـ PROXY المناسب حسب الفئة
function buildProxyForCategory(baseProxy, category){
  var out = baseProxy;
  if (category === "MATCH" && FIXED_PORT.MATCH){
    out = out.replace(/:\d+$/, ":"+FIXED_PORT.MATCH);
  } else if (category === "LOBBY" && FIXED_PORT.LOBBY){
    out = out.replace(/:\d+$/, ":"+FIXED_PORT.LOBBY);
  } else if (category === "VOICE" && FIXED_PORT.VOICE){
    out = out.replace(/:\d+$/, ":"+FIXED_PORT.VOICE);
  } else if (category === "TELEMETRY" && FIXED_PORT.TELEMETRY){
    out = out.replace(/:\d+$/, ":"+FIXED_PORT.TELEMETRY);
  }
  return out;
}

// ---------- MAIN ----------
function FindProxyForURL(url, host){
  log("REQ host="+host+" url="+url);

  // 1. خدمات الحياة اليومية خليها DIRECT
  if (isDirectAllowed(url, host)){
    log("DIRECT EXCEPTION => "+host);
    return "DIRECT";
  }

  // 2. صنّف الترافيك
  var cat = classifyTraffic(url, host);

  // 3. إذا الترافيك من الأنواع اللي بتحدد هويتك داخل اللعبة
  //    (LOBBY / MATCH / VOICE / TELEMETRY) => لازم يطلع أردني
  if (
    cat === "MATCH"     ||
    cat === "LOBBY"     ||
    cat === "VOICE"     ||
    cat === "TELEMETRY"
  ){
    var sticky = getStickyProxy();
    var enforced = buildProxyForCategory(sticky, cat);
    log(cat+" => FORCE JO PROXY => "+enforced);
    return enforced;
  }

  // 4. أي شيء مش مهم لهوية اللاعب (cat="OTHER") نسمح له DIRECT
  log("OTHER => DIRECT => "+host);
  return "DIRECT";
}
