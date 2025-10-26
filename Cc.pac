// JO-ULTIMATE-LOCAL.pac
// يكتشف تلقائياً بادئة IPv6 المحلية (من myIpAddress()) ويقفل الترافيك الخاص باللعبة عليها.
// إذا لم تتوفر IPv6 حقيقية، يعود إلى قائمة ISP أردنية (fallback) أو يُحظر.
// هدف: أقصى تحجيم محلي ممكن لرفع نسبة اللاعبين الأردنيين/المحليين.
//
// ملاحظة: كلما كانت البادئة أضيق (أكثر مقاطع)، كلما زادت "المحلية" وصارت المطابقة أدق.
// استخدم أثناء ساعات الذروة لتحصل أفضل نتائج من حيث عدد اللاعبين المحليين.

(function(){

  var PROXY_HOST = "91.106.109.12";
  var PROXY_PORT = 443;
  var ALLOW = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  var BLOCK = "PROXY 0.0.0.0:0";

  var DNS_TTL = 15 * 1000;
  var STICKY_TTL = 90 * 1000; // ثبّت البادئة المكتشفة شوية

  var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
  if(!ROOT._JO_ULTRA_LOCAL) ROOT._JO_ULTRA_LOCAL = {};
  var CACHE = ROOT._JO_ULTRA_LOCAL;
  if(!CACHE.dns) CACHE.dns = {};
  if(!CACHE.localPrefix) CACHE.localPrefix = { pref: null, t:0 };

  // قائمة ISP أردنية احتياطية (fallback)
  var ISP_FALLBACK = ["2a03:6b00","2a03:b640","2a00:18d8","2a01:9700","2a0a:8c40"];

  // PUBG patterns (نفس التصنيف)
  var URL_PATTERNS = [
    "*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*",
    "*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*",
    "*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*",
    "*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*",
    "*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"
  ];
  var HOST_PATTERNS = [
    "*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com",
    "*.gcloud.qq.com","gpubgm.com","teamfinder.igamecj.com","teamfinder.proximabeta.com",
    "match.igamecj.com","match.proximabeta.com","cdn.pubgmobile.com","updates.pubgmobile.com"
  ];

  // === دوال مساعدة ===
  function isPubgURL(u){
    if(!u) return false;
    for(var i=0;i<URL_PATTERNS.length;i++) if(shExpMatch(u, URL_PATTERNS[i])) return true;
    return false;
  }
  function isPubgHost(h){
    if(!h) return false;
    h = h.toLowerCase();
    for(var i=0;i<HOST_PATTERNS.length;i++){
      var p = HOST_PATTERNS[i];
      if(shExpMatch(h,p)) return true;
      if(p.indexOf("*.")===0){
        var suf = p.substring(1);
        if(h.length>=suf.length && h.substring(h.length - suf.length) === suf) return true;
      }
    }
    return false;
  }

  // dns cache
  function dnsCached(host){
    if(!host) return "";
    var now = (new Date()).getTime();
    var e = CACHE.dns[host];
    if(e && (now - e.t) < DNS_TTL) return e.ip;
    var ip = "";
    try{ ip = dnsResolve(host) || ""; } catch(e){ ip = ""; }
    CACHE.dns[host] = { ip: ip, t: now };
    return ip;
  }

  // توسعة IPv6 compressed => كامل
  function expandIPv6(ip){
    if(!ip) return "";
    if(ip.indexOf(':') === -1) return ip;
    if(ip.indexOf("::") === -1) return ip.toLowerCase();
    var parts = ip.split(":");
    var left=[], right=[];
    var seen=false;
    for(var i=0;i<parts.length;i++){
      if(parts[i]===''){ seen=true; continue; }
      if(!seen) left.push(parts[i]); else right.push(parts[i]);
    }
    var missing = 8 - (left.length + right.length);
    var zeros = [];
    for(var j=0;j<missing;j++) zeros.push("0");
    return left.concat(zeros).concat(right).join(":").toLowerCase();
  }

  // استخرج بادئة محلية من IPv6 (أول n hextets) => نعيد كسلسلة مثل "2a03:b640:4f2a:91c0"
  function extractPrefix(ip, hextetsCount){
    if(!ip) return null;
    if(ip.indexOf(':') === -1) return null;
    var full = expandIPv6(ip);
    var parts = full.split(':');
    if(parts.length < hextetsCount) hextetsCount = parts.length;
    return parts.slice(0, hextetsCount).join(':');
  }

  // هل ip يبدأ بالبادئة؟
  function ipStartsWith(ip, pref){
    if(!ip || !pref) return false;
    var full = expandIPv6(ip);
    pref = pref.toLowerCase().replace(/:+$/,'');
    if(full.indexOf(pref) === 0) return true;
    if(ip.toLowerCase().indexOf(pref) === 0) return true;
    return false;
  }

  // اختر بادئة محلية ذكية: نجرب /48 أولاً (4 hextets)، لو فشل نرجع ل/40 أو /32
  function detectAndLockLocalPrefix(){
    var now = (new Date()).getTime();
    if(CACHE.localPrefix.pref && (now - CACHE.localPrefix.t) < STICKY_TTL){
      return CACHE.localPrefix.pref;
    }
    var myip = "";
    try { myip = myIpAddress(); } catch(e) { myip = ""; }
    if(!myip || myip.indexOf(':')===-1){
      // ما عندك IPv6 فعّال
      CACHE.localPrefix = { pref: null, t: now };
      return null;
    }

    // نأخذ أول 4 hextets (/48) — غالباً يساوي شبكة محلية
    var p4 = extractPrefix(myip, 4); // ex: 2a03:b640:4f2a:91c0 -> returns first 4
    if(p4){
      CACHE.localPrefix = { pref: p4, t: now };
      return p4;
    }
    // لو ما، نحاول أول 3 hextets (/48/56 fallback)
    var p3 = extractPrefix(myip, 3);
    if(p3){
      CACHE.localPrefix = { pref: p3, t: now };
      return p3;
    }
    // أخيراً /2 hextets (أوسع)
    var p2 = extractPrefix(myip, 2);
    CACHE.localPrefix = { pref: p2, t: now };
    return p2;
  }

  // تحقق شامل: هل الوجهة داخل أي بادئة محلية ضيقة أو fallback ISP؟
  function destinationAllowed(dstIP){
    // لو IPv4 -> رفض (نريد IPv6 أصيل)
    if(/^\d+\.\d+\.\d+\.\d+$/.test(dstIP)) return false;

    // أول نجرب البادئة المحلية المكتشفة
    var localPref = detectAndLockLocalPrefix();
    if(localPref){
      if(ipStartsWith(dstIP, localPref)) return true;
      // لو الوجهة لا تطابق البادئة المحلية، نرفض فوراً (أقصى تشديد)
      return false;
    }

    // لو ما في بادئة محلية (myIpAddress() إما ipv4 أو غير موجود) -> نحاول السماح فقط إذا الوجهة ضمن ISP_FALLBACK
    for(var i=0;i<ISP_FALLBACK.length;i++){
      if(ipStartsWith(dstIP, ISP_FALLBACK[i])) return true;
    }
    return false;
  }

  // ============================================
  // الدالة الرئيسية
  // ============================================
  function FindProxyForURL(url, host){
    if(host && host.toLowerCase) host = host.toLowerCase();

    // 1) نخلي السماح فقط لحركة ببجي/التجنيد/التحديث — نمنع أي تسريب
    if(!isPubgURL(url) && !isPubgHost(host)) {
      return BLOCK;
    }

    // 2) حل الوجهة
    var dst = dnsCached(host);
    if(!dst) return BLOCK;

    // 3) هل الوجهة مسموح بها حسب القواعد (بادئة محلية ضيقة أو fallback list)
    if(!destinationAllowed(dst)) return BLOCK;

    // 4) إذا مرّ كل الفحوص -> أرسل عبر البروكسي الأردني الثابت
    return ALLOW;
  }

  this.FindProxyForURL = FindProxyForURL;

})();
