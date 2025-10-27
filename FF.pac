(function(){

var PROXY_HOST   = "91.106.109.12";
var PROXY_PORT   = 443;
var PROXY_FORCE  = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;  // نستخدمه بالقنوات الاجتماعية
var PROXY_STD    = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;  // نقدر نغيره لاحقاً لو بدنا ستايل مختلف
var PROXY_DROP   = "PROXY 0.0.0.0:0";

var DNS_TTL_MS   = 15 * 1000;
var LOCK_TTL_MS  = 90 * 1000;

var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
if (!ROOT.__PUBG_JO_BIDIR__) ROOT.__PUBG_JO_BIDIR__ = {};
var STATE = ROOT.__PUBG_JO_BIDIR__;

if (!STATE.dns)   STATE.dns   = {};
if (!STATE.lock)  STATE.lock  = { isp:null, score:0, t:0 };

//
// نطاقات IPv4 أردنية
//
var JO_V4 = [
  ["109.104.0.0","109.107.255.255"],
  ["176.16.0.0","176.23.255.255"],
  ["94.56.0.0","94.59.255.255"],
  ["94.64.0.0","94.72.255.255"]
];

//
// تصنيف الفئات
// - SOCIAL_FOCUS = أشياء لازم تبينك أنت للناس (presence, friends, recruit, teamfinder)
//   هدول لازم “إجباري أردن” حتى يظهروك عندهم كأردني
//
var CATS = {

  MATCH: {
    url:  ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    host: ["*.gcloud.qq.com","gpubgm.com","match.igamecj.com","match.proximabeta.com"],
    social: false
  },

  RECRUIT: {
    url:  ["*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*"],
    host: ["teamfinder.igamecj.com","teamfinder.proximabeta.com","match.igamecj.com","match.proximabeta.com"],
    social: true
  },

  LOBBY: {
    url:  ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    host: ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    social: true
  },

  UPDATES: {
    url:  ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets*","*/assetbundle*","*/obb*",
           "*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"],
    host: ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com",
           "dlied1.qq.com","dlied2.qq.com","cdn.proximabeta.com","cdn.tencentgames.com",
           "*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"],
    social: false
  }
};

function nowMs(){
  return (new Date()).getTime();
}

function dnsCached(h){
  if(!h) return "";
  var n = nowMs();
  var e = STATE.dns[h];
  if(e && (n - e.t) < DNS_TTL_MS) return e.ip;
  var ip = "";
  try { ip = dnsResolve(h) || ""; } catch(_){ ip = ""; }
  STATE.dns[h] = { ip: ip, t: n };
  return ip;
}

function ip4ToInt(ip){
  var p = ip.split(".");
  return (((parseInt(p[0])<<24)>>>0) +
          ((parseInt(p[1])<<16)>>>0) +
          ((parseInt(p[2])<<8)>>>0)  +
          (parseInt(p[3])>>>0));
}

function isJordanIPv4(ip){
  if(!ip) return false;
  if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
  var n = ip4ToInt(ip);
  for(var i=0;i<JO_V4.length;i++){
    var lo = ip4ToInt(JO_V4[i][0]);
    var hi = ip4ToInt(JO_V4[i][1]);
    if(n>=lo && n<=hi) return true;
  }
  return false;
}

function matchAny(val, arr){
  if(!val) return false;
  val = val.toLowerCase();
  for(var i=0;i<arr.length;i++){
    var patt = arr[i];
    if(shExpMatch(val, patt)) return true;
    if(patt.indexOf("*.") === 0){
      var suf = patt.substring(1);
      if(val.length>=suf.length &&
         val.substring(val.length - suf.length) === suf) return true;
    }
  }
  return false;
}

function classifyFlow(url, host){
  if(matchAny(url, CATS.MATCH.url)   || matchAny(host, CATS.MATCH.host))   return "MATCH";
  if(matchAny(url, CATS.RECRUIT.url) || matchAny(host, CATS.RECRUIT.host)) return "RECRUIT";
  if(matchAny(url, CATS.LOBBY.url)   || matchAny(host, CATS.LOBBY.host))   return "LOBBY";
  if(matchAny(url, CATS.UPDATES.url) || matchAny(host, CATS.UPDATES.host)) return "UPDATES";
  return null;
}

function getLock(){
  var n = nowMs();
  var L = STATE.lock;
  if(L.isp && (n - L.t) < LOCK_TTL_MS) return L;
  return { isp:null, score:0, t:0 };
}

function setLock(isp,score){
  STATE.lock = { isp: isp, score: score, t: nowMs() };
}

// بما إنك ما عندك IPv6 عام، التصنيف بسيط:
// إذا السيرفر IPv4 أردني → score 100
// غير هيك → 0
function rateServer(ip){
  if(isJordanIPv4(ip)) {
    return { isp:"JO_IPV4", score:100 };
  }
  return { isp:null, score:0 };
}

// هذه الوظائف بتقرر إذا نسمح للنوع هذا من الاتصال ولا لأ:
function allowMatch(info){
  // بدنا نحافظ على نفس المصدر الأردني (sticky) عشان السيرفر يتعامل معك كلاعب ثابت
  var lock = getLock();
  if(info.score >= 100){
    if(lock.score >= 100 && lock.isp !== info.isp) return false;
    setLock(info.isp, info.score);
    return true;
  }
  return false;
}

function allowRecruit(info){
  // مهم: إحنا بدنا يظهر اسمك للناس
  // حتى لو السيرفر مش أردني، ما بدنا نمنع "إعلانك"،
  // لكن بدنا نُجبر الإعلان يطلع من بروكسي أردني.
  // فالقرار هون رح يكون: ما نقطعك.
  // إذا أردني: ممتاز. إذا لا: رح نفرض بروكسي بالقوة لاحقاً.
  if(info.score >= 100) return true;
  return true; // لو مش أردني، بنعالجه بالطريقة تبعت الإرسال
}

function allowLobby(info){
  // نفس منطق Recruit: بدنا تبان أونلاين كلاعب أردني
  if(info.score >= 100) return true;
  return true;
}

function allowUpdates(info){
  // الصيانة/الداونلود أقل أهمية للظهور الاجتماعي
  if(info.score >= 100) return true;
  // لو مش أردني، بنقدر نخليها direct/drop، بس عشان اللعب يمشي منخليها proxy
  return true;
}

function canUse(cat, info){
  if(cat === "MATCH")   return allowMatch(info);
  if(cat === "RECRUIT") return allowRecruit(info);
  if(cat === "LOBBY")   return allowLobby(info);
  if(cat === "UPDATES") return allowUpdates(info);
  return false;
}

// هل الفئة اجتماعية (وجودك، إعلانك، الظهور أونلاين)؟
function isSocial(cat){
  if(cat === "RECRUIT") return true;
  if(cat === "LOBBY")   return true;
  return false;
}

function FindProxyForURL(url, host){
  if(host && host.toLowerCase) host = host.toLowerCase();

  // اتصالات النظام / الشبكة المحلية ما منمسّها
  if(isPlainHostName(host) ||
     shExpMatch(host,"*.local") ||
     shExpMatch(host,"captive.apple.com") ||
     shExpMatch(url, "*apple.com/library/test/*")) {
    return "DIRECT";
  }

  // نحدد نوع الاتصال (لوبي؟ تجنيد؟ ماتش؟ تحديثات؟)
  var cat = classifyFlow(url, host);
  if(!cat){
    // أي شيء مش له علاقة اللعبة => خليه يطلع طبيعي
    return "DIRECT";
  }

  // نحل DNS
  var dst = dnsCached(host);
  if(!dst){
    // ما قدرنا نجيب IP -> منمنع بدل ما نعطي تسريب مش أردني
    return PROXY_DROP;
  }

  // نقيم هل الوجهة أردنية ولا لا
  var info = rateServer(dst);

  // بنقرر نسمح أو لا
  if(!canUse(cat, info)){
    return PROXY_DROP;
  }

  // وهون أهم سحر:

  // 1) القنوات الاجتماعية (Recruit و Lobby):
  //    بدنا صورتك قدامهم تكون أردنية حتى لو انت فعلياً مش ظاهر أردني
  //    عشان هيك: إحنا *دائماً* منرجع PROXY_FORCE أول.
  if(isSocial(cat)) {
    // ما في DIRECT أول. دايماً بروكسي. هذا اللي بخليهم "يشوفوك"
    return PROXY_FORCE;
  }

  // 2) باقي القنوات (MATCH و UPDATES):
  //    إذا السيرفر أردني فعلاً (info.score>=100) -> نسمح بروكسي أردني ثابت
  //    إذا السيرفر مش أردني -> مع هيك منمرره عبر البروكسي برضو
  //    (حتى يظل خروجك أردني قدام اللعبة)
  return PROXY_STD;
}

this.FindProxyForURL = FindProxyForURL;

})();
