// JO-HYBRID-UMNIAH-AUTO.pac
// النسخة الهجينة:
// - تشتغل حتى لو عندك بس IPv4 أردني (زي 109.107.243.xxx).
// - ولو صار عندك IPv6 أردني لاحقاً، تلقائياً بتقفل أكثر (حي / مزود / مسار محلي).
//
// الهدف: زيادة نسبة اللاعبين الأردنيين في اللوبي/التجنيد/الماتش قدر الإمكان
// بدون ما تحتاج تغيّر السكربت بيدك كل مرة.

(function(){

  // ---------------------------
  // إعداد البروكسي الثابت (زي ما اتفقنا: بروكسي واحد للجميع)
  // ---------------------------
  var PROXY_HOST = "91.106.109.12";
  var PROXY_PORT = 443;
  var ALLOW = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  var BLOCK = "PROXY 0.0.0.0:0";

  // ---------------------------
  // إعدادات الكاش
  // ---------------------------
  var DNS_TTL_MS = 15 * 1000;      // كاش DNS قصير
  var LOCAL_TTL_MS = 90 * 1000;    // كاش البادئة المحلية (IPv6)
  var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
  if(!ROOT._JO_HYB_CACHE) ROOT._JO_HYB_CACHE = {};
  var CACHE = ROOT._JO_HYB_CACHE;
  if(!CACHE.dns) CACHE.dns = {};
  if(!CACHE.localV6) CACHE.localV6 = { pref:null, t:0 };

  // ---------------------------
  // تعريف الشبكات الأردنية
  // - IPv6 allocations الرسمية داخل الأردن (مزودين محليين)
  // - IPv4 ranges أردنية محلية (بما فيها Umniah/Zain/Orange داخل الأردن)
  // ---------------------------

  // IPv6 أردني (مزودين داخل الأردن):
  // Umniah / Batelco: 2a03:b640::/32
  // Zain Jordan:     2a03:6b00::/32
  // Orange Jordan:   2a00:18d8::/29
  // JDC/GO Jordan:   2a01:9700::/29
  // Mada Jordan:     2a0a:8c40::/29
  var JO_V6_BIG = [
    "2a03:b640",
    "2a03:6b00",
    "2a00:18d8",
    "2a01:9700",
    "2a0a:8c40"
  ];

  // IPv4 ranges أردنية معروفة (من مزودين داخل الأردن، فيها Umniah وغيرها)
  // انت أعطيتني 109.107.243.xxx -> هذا يقع داخل رينجات أردنية تجارية.
  // rangelist أدناه تشمل شبكات أردنية كبيرة زي 109.x و176.x و94.x و91.x ...الخ.
  // هاي موجودة أساساً في سكرِبتاتك السابقة.
  var JO_V4_RANGES = [
    ["109.104.0.0","109.104.255.255"],
    ["109.107.0.0","109.107.255.255"],
    ["109.125.0.0","109.125.255.255"],
    ["109.128.0.0","109.132.255.255"],
    ["176.16.0.0","176.23.255.255"],
    ["176.40.0.0","176.43.255.255"],
    ["176.47.0.0","176.52.255.255"],
    ["176.54.0.0","176.55.255.255"],
    ["176.58.0.0","176.58.255.255"],
    ["176.65.0.0","176.65.255.255"],
    ["176.67.0.0","176.67.255.255"],
    ["176.72.0.0","176.72.255.255"],
    ["176.81.0.0","176.81.255.255"],
    ["176.88.0.0","176.88.255.255"],
    ["176.93.0.0","176.93.255.255"],
    ["176.97.0.0","176.99.255.255"],
    ["94.56.0.0","94.59.255.255"],
    ["94.64.0.0","94.72.255.255"],
    ["94.104.0.0","94.111.255.255"],
    ["94.128.0.0","94.129.255.255"],
    ["94.134.0.0","94.135.255.255"],
    ["94.16.0.0","94.16.255.255"],
    ["94.20.0.0","94.20.255.255"],
    ["94.25.0.0","94.25.255.255"],
    ["91.93.0.0","91.95.255.255"],
    ["91.104.0.0","91.104.255.255"],
    ["91.107.0.0","91.107.255.255"],
    ["91.109.0.0","91.111.255.255"],
    ["91.120.0.0","91.120.255.255"],
    ["91.122.0.0","91.122.255.255"],
    ["91.126.0.0","91.126.255.255"],
    ["91.132.0.0","91.133.255.255"],
    ["91.135.0.0","91.135.255.255"],
    ["91.143.0.0","91.143.255.255"],
    ["91.147.0.0","91.147.255.255"],
    ["91.149.0.0","91.149.255.255"],
    ["91.176.0.0","91.184.255.255"],
    ["91.186.0.0","91.186.255.255"],
    ["91.189.0.0","91.189.255.255"],
    ["91.191.0.0","91.193.255.255"],
    ["91.204.0.0","91.204.255.255"],
    ["91.206.0.0","91.206.255.255"],
    ["91.209.0.0","91.209.255.255"],
    ["91.225.0.0","91.225.255.255"],
    ["91.235.0.0","91.235.255.255"],
    ["91.238.0.0","91.238.255.255"],
    ["91.244.0.0","91.245.255.255"]
  ];

  // ---------------------------
  // PUBG traffic we allow
  // (اللعبة واتصالاتها المهمة)
  // ---------------------------
  var URL_ALLOW = [
    "*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*",
    "*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*",
    "*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*",
    "*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*",
    "*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"
  ];

  var HOST_ALLOW = [
    "*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com",
    "*.gcloud.qq.com","gpubgm.com",
    "teamfinder.igamecj.com","teamfinder.proximabeta.com",
    "match.igamecj.com","match.proximabeta.com",
    "cdn.pubgmobile.com","updates.pubgmobile.com",
    "patch.igamecj.com","hotfix.proximabeta.com",
    "dlied1.qq.com","dlied2.qq.com",
    "cdn.proximabeta.com","cdn.tencentgames.com",
    "*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"
  ];

  // ---------------------------
  // Helpers
  // ---------------------------

  function urlAllowed(u){
    if(!u) return false;
    for(var i=0;i<URL_ALLOW.length;i++){
      if(shExpMatch(u, URL_ALLOW[i])) return true;
    }
    return false;
  }

  function hostAllowed(h){
    if(!h) return false;
    h = h.toLowerCase();
    for(var i=0;i<HOST_ALLOW.length;i++){
      var pat = HOST_ALLOW[i];
      if(shExpMatch(h, pat)) return true;
      if(pat.indexOf("*.")===0){
        var suf = pat.substring(1);
        if(h.length>=suf.length && h.substring(h.length - suf.length)===suf) return true;
      }
    }
    return false;
  }

  function dnsCached(host){
    if(!host) return "";
    var now = (new Date()).getTime();
    var e = CACHE.dns[host];
    if(e && (now - e.t) < DNS_TTL_MS) return e.ip;
    var ip = "";
    try { ip = dnsResolve(host) || ""; } catch(err){ ip=""; }
    CACHE.dns[host] = { ip: ip, t: now };
    return ip;
  }

  // حول IPv4 إلى رقم عشان نتحقق إذا داخل range أردني
  function ip4ToInt(ip){
    var p = ip.split(".");
    return ( (parseInt(p[0])<<24)>>>0 ) +
           ( (parseInt(p[1])<<16)>>>0 ) +
           ( (parseInt(p[2])<<8)>>>0 ) +
           (  parseInt(p[3])>>>0 );
  }

  function isJOv4(ip){
    if(!ip) return false;
    if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
    var n = ip4ToInt(ip);
    for(var i=0;i<JO_V4_RANGES.length;i++){
      var start = ip4ToInt(JO_V4_RANGES[i][0]);
      var end   = ip4ToInt(JO_V4_RANGES[i][1]);
      if(n>=start && n<=end) return true;
    }
    return false;
  }

  // IPv6 normalization
  function expandIPv6(ip){
    if(!ip) return "";
    if(ip.indexOf(':')===-1) return ip;
    if(ip.indexOf("::")===-1) return ip.toLowerCase();
    var parts = ip.split(":");
    var left=[], right=[], hit=false;
    for(var i=0;i<parts.length;i++){
      if(parts[i]===""){ hit=true; continue; }
      if(!hit) left.push(parts[i]); else right.push(parts[i]);
    }
    var miss = 8 - (left.length + right.length);
    var zeros=[];
    for(var j=0;j<miss;j++) zeros.push("0");
    return (left.concat(zeros).concat(right)).join(":").toLowerCase();
  }

  // هل IPv6 داخل أي prefix أردني معروف (واسع)
  function isJOv6Wide(ip){
    if(!ip) return false;
    if(ip.indexOf(':')===-1) return false;
    var full = expandIPv6(ip);
    for(var i=0;i<JO_V6_BIG.length;i++){
      var pref = JO_V6_BIG[i].toLowerCase().replace(/:+$/,'');
      if(full.indexOf(pref)===0) return true;
    }
    return false;
  }

  // استخرج بادئة محلية من myIpAddress() (أول 4 hextets -> /64-/56 تقريباً)
  function getLocalV6Prefix(){
    var now = (new Date()).getTime();
    if(CACHE.localV6.pref && (now - CACHE.localV6.t) < LOCAL_TTL_MS){
      return CACHE.localV6.pref;
    }

    var my = "";
    try { my = myIpAddress(); } catch(e){ my=""; }

    if(!my || my.indexOf(':')===-1){
      CACHE.localV6 = { pref:null, t:now };
      return null;
    }

    // خذ أول 4 بلوكات (hextets) لمعالجة شديدة المحلية
    var full = expandIPv6(my);           // مثلا: 2a03:b640:4f2a:91c0:0000:0000:0000:1234
    var parts = full.split(":");         // ["2a03","b640","4f2a","91c0","0000","0000","0000","1234"]
    var tight = parts.slice(0,4).join(":"); // "2a03:b640:4f2a:91c0"

    CACHE.localV6 = { pref:tight, t:now };
    return tight;
  }

  // هل الوجهة داخل البادئة المحلية الضيقة؟
  function inLocalTightV6(dst){
    var lp = getLocalV6Prefix();
    if(!lp) return false;
    if(dst.indexOf(':')===-1) return false;
    var full = expandIPv6(dst).toLowerCase();
    var normLP = lp.toLowerCase().replace(/:+$/,'');
    if(full.indexOf(normLP)===0) return true;
    return false;
  }

  // قرار السماح:
  // 1. لو عندي IPv6 محلي tight: لازم السيرفر يكون نفس الـtight subnet. (أشد شيء)
  // 2. لو ما عندي IPv6: أقبل سيرفر أردني سواء IPv4 أردني أو IPv6 أردني واسع.
  function destinationAllowed(ip){
    if(!ip) return false;

    var localPref = getLocalV6Prefix();
    if(localPref){
      // عندي IPv6 حقيقي على الشبكة -> أنا في وضع "محلّي متشدد"
      // يعني ما بدي إلا سيرفر من نفس الprefix، عشان أرفع فرص الأردنيين القريبين جداً
      if(inLocalTightV6(ip)) return true;
      return false;
    } else {
      // ما عندي IPv6 حقيقي
      // fallback: نسمح بس لو السيرفر أردني (IPv4 أردني أو IPv6 أردني عام)
      if(/^\d+\.\d+\.\d+\.\d+$/.test(ip)){
        // IPv4
        return isJOv4(ip);
      } else {
        // IPv6
        return isJOv6Wide(ip);
      }
    }
  }

  // ---------------------------
  // FindProxyForURL الرئيسية
  // ---------------------------
  function FindProxyForURL(url, host){
    if(host && host.toLowerCase) host = host.toLowerCase();

    // بس PUBG والـrecruit والـmatch والـcdn تبعها
    if(!urlAllowed(url) && !hostAllowed(host)){
      return BLOCK;
    }

    // جيب IP السيرفر
    var dst = dnsCached(host);
    if(!dst){
      return BLOCK;
    }

    // هل هذا السيرفر مسموح حسب القاعدة الحالية (محلي-tight أو أردني-wide)؟
    if(!destinationAllowed(dst)){
      return BLOCK;
    }

    // لو مسموح → امشي عبر البروكسي الأردني
    return ALLOW;
  }

  this.FindProxyForURL = FindProxyForURL;

})();
