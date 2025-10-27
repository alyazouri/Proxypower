//
// PUBG_JO_ULTIMATE_UMNIAH_ZAIN.pac
//
// إصدار خارق مخصص للأردن (أمنية + زين)
// - يمنع أي اتصال غير أردني
// - يفرق بين لوبي / ماتش / تجنيد / تحديثات
// - يختار مسار أردني واحد وبلزقك عليه حتى تضل بانطباع "أنا داخل الأردن نفس الـPOP"
// - جاهز لليوم (IPv4 أردني) ومستعد لبكرا (IPv6 أردني حقيقي)
// - بروكسي واحد ثابت: 91.106.109.12:443
//
// ملاحظــة: هذا السكربت قاسي جداً. لو PUBG تحاول تستخدم سيرفر برا الأردن، الطلب حينحظر.
// لو التحديث ما ينزل من سيرفر أردني، ما رح ينزل. هذا مقصود لأنك قلت بدك pureness أردنية.
//

(function(){

  // -------- إعداد البروكسي --------
  var PROXY_HOST = "91.106.109.12";
  var PROXY_PORT = 443;
  var ALLOW = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  var BLOCK = "PROXY 0.0.0.0:0";

  // كاش داخلي
  var DNS_TTL_MS = 15 * 1000;       // كاش DNS
  var STICKY_TTL_MS = 90 * 1000;    // مدّة تثبيت المزود / البادئة للماتش
  var IPV6_LOCAL_TTL_MS = 90 * 1000;

  var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!ROOT._PUBG_JO_CACHE) ROOT._PUBG_JO_CACHE = {};
  var CACHE = ROOT._PUBG_JO_CACHE;
  if (!CACHE.dns) CACHE.dns = {};
  if (!CACHE.matchLock) CACHE.matchLock = { isp:null, v6prefix:null, t:0 };
  if (!CACHE.localV6) CACHE.localV6 = { pref:null, t:0 };

  // -------- تعريف مزودي الأردن اللي بدنا نسمحهم --------
  // Umniah / Batelco Jordan IPv6 allocation
  var UMNIAH_V6 = "2a03:b640";
  // Zain Jordan IPv6 allocation
  var ZAIN_V6    = "2a03:6b00";

  // Orange و غيرهم مش داخل المطلوب حالياً، بنركز بس على أمنية و زين لرفع كثافة أردنية بنَفَس مزوّدك
  // لو حاب ندخل Orange لاحقاً منحط "2a00:18d8"

  // رينجات IPv4 أردنية لأمنية / زين وغيرها اللي معروفة أنها داخل الأردن.
  // (مهم: هذا يسمح fallback على IPv4 أردني لأنك حالياً على IPv4 Umniah)
  var JO_V4_RANGES = [
    ["109.104.0.0","109.107.255.255"], // يغطي ساب-بلوكات Umniah/بعض الـISPs المحليين
    ["176.16.0.0","176.23.255.255"],   // Jordan allocations (Zain/others locally)
    ["91.107.0.0","91.111.255.255"],   // ranges مستخدمة داخل الأردن
    ["94.56.0.0","94.59.255.255"],     // أردن
    ["94.64.0.0","94.72.255.255"]      // أردن / مشغلين محليين
  ];

  // -------- تصنيف أنواع الترافيك الخاصة بببجي --------
  // رح نعامل كل فئة بسياسة مختلفة
  var CLASS_DEF = {
    MATCH: { // دخول الجيم / القتال / matchmaking الفعلي
      url: [
        "*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"
      ],
      host: [
        "*.gcloud.qq.com","gpubgm.com","match.igamecj.com","match.proximabeta.com"
      ]
    },
    LOBBY: { // تسجيل الدخول / presence / friends / heartbeat
      url: [
        "*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"
      ],
      host: [
        "*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"
      ]
    },
    RECRUIT: { // تجنيد سكواد / كلان / سوشال
      url: [
        "*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*"
      ],
      host: [
        "teamfinder.igamecj.com","teamfinder.proximabeta.com",
        "match.igamecj.com","match.proximabeta.com"
      ]
    },
    UPDATES: { // تنزيل ملفات / CDN / باتش
      url: [
        "*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*",
        "*/assetbundle*","*/obb*",
        "*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"
      ],
      host: [
        "cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com",
        "hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com",
        "cdn.proximabeta.com","cdn.tencentgames.com",
        "*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"
      ]
    }
  };

  // -------- دوال مساعدة --------

  function shMatchAny(val, arr){
    if(!val) return false;
    val = val.toLowerCase();
    for (var i=0;i<arr.length;i++){
      var pat = arr[i];
      if (shExpMatch(val, pat)) return true;
      if (pat.indexOf("*.")===0){
        var suf = pat.substring(1); // ".pubgmobile.com"
        if (val.length >= suf.length &&
            val.substring(val.length - suf.length) === suf) return true;
      }
    }
    return false;
  }

  function classifyTraffic(url, host){
    // أولوية: MATCH الأول لأنه أهم شي لنتيجتك
    if (shMatchAny(url, CLASS_DEF.MATCH.url) || shMatchAny(host, CLASS_DEF.MATCH.host)) return "MATCH";
    if (shMatchAny(url, CLASS_DEF.LOBBY.url) || shMatchAny(host, CLASS_DEF.LOBBY.host)) return "LOBBY";
    if (shMatchAny(url, CLASS_DEF.RECRUIT.url) || shMatchAny(host, CLASS_DEF.RECRUIT.host)) return "RECRUIT";
    if (shMatchAny(url, CLASS_DEF.UPDATES.url) || shMatchAny(host, CLASS_DEF.UPDATES.host)) return "UPDATES";
    return null;
  }

  function dnsCached(h){
    if(!h) return "";
    var now = (new Date()).getTime();
    var e = CACHE.dns[h];
    if (e && (now - e.t) < DNS_TTL_MS) return e.ip;
    var ip = "";
    try { ip = dnsResolve(h) || ""; } catch(_){ ip = ""; }
    CACHE.dns[h] = { ip: ip, t: now };
    return ip;
  }

  // توسعة IPv6 من شكل مختصر إلى كامل
  function expandIPv6(ip){
    if(!ip) return "";
    if(ip.indexOf(':')===-1) return ip; // IPv4
    if(ip.indexOf("::")===-1) return ip.toLowerCase();
    var parts = ip.split(":");
    var left=[], right=[], gap=false;
    for(var i=0;i<parts.length;i++){
      if(parts[i]===""){gap=true;continue;}
      if(!gap) left.push(parts[i]); else right.push(parts[i]);
    }
    var miss = 8-(left.length+right.length);
    var zeros=[];
    for(var j=0;j<miss;j++) zeros.push("0");
    return left.concat(zeros).concat(right).join(":").toLowerCase();
  }

  // هل IPv6 يبدأ ببادئة معيّنة؟
  function v6StartsWith(ip, pref){
    if(!ip) return false;
    if(ip.indexOf(':')===-1) return false;
    var full = expandIPv6(ip);
    pref = pref.toLowerCase().replace(/:+$/,'');
    if (full.indexOf(pref)===0) return true;
    return false;
  }

  // حاول نعرف البادئة المحلية الحقيقية (لو صار في IPv6 عام من المزود)
  // ناخذ أول 4 هكسات من myIpAddress() ونعتبرها "نقطة خروج ثابتة"
  function getLocalV6TightPrefix(){
    var now = (new Date()).getTime();
    if(CACHE.localV6.pref && (now - CACHE.localV6.t) < IPV6_LOCAL_TTL_MS){
      return CACHE.localV6.pref;
    }

    var me = "";
    try { me = myIpAddress(); } catch(e){ me=""; }

    if(!me || me.indexOf(':')===-1){
      CACHE.localV6 = { pref:null, t: now };
      return null;
    }

    // fe80:: أو fd..:: = محلي/خاص مش عالمي -> ما نستخدمه
    var low = me.toLowerCase();
    if (low.indexOf("fe80:")===0 || low.indexOf("fd")===0) {
      CACHE.localV6 = { pref:null, t: now };
      return null;
    }

    var full = expandIPv6(me); // ex: 2a03:b640:4f2a:91c0:0000:...
    var parts = full.split(":");
    // أول 4 هكسات = ultra local POP
    var tight = parts.slice(0,4).join(":"); // 2a03:b640:4f2a:91c0
    CACHE.localV6 = { pref:tight, t: now };
    return tight;
  }

  // هل IPv4 داخل الأردن (جزئياً مركز على أمنية/زين والكتل اللي تهمنا)
  function ip4ToInt(ip){
    var p = ip.split(".");
    return ( (parseInt(p[0])<<24)>>>0 ) +
           ( (parseInt(p[1])<<16)>>>0 ) +
           ( (parseInt(p[2])<<8)>>>0 ) +
             (parseInt(p[3])>>>0 );
  }

  function isIPv4Jordan(ip){
    if(!ip) return false;
    if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
    var n = ip4ToInt(ip);
    for (var i=0;i<JO_V4_RANGES.length;i++){
      var start = ip4ToInt(JO_V4_RANGES[i][0]);
      var end   = ip4ToInt(JO_V4_RANGES[i][1]);
      if(n>=start && n<=end) return true;
    }
    return false;
  }

  // هل IPv6 من أمنية أو زين؟
  function isIPv6UmniahOrZain(ip){
    if(!ip || ip.indexOf(':')===-1) return false;
    return v6StartsWith(ip, UMNIAH_V6) || v6StartsWith(ip, ZAIN_V6);
  }

  // هل IPv6 محلي ضيق مطابق للـPOP تبعك (إذا توفر عنوان عالمي فعلاً)
  function isSameLocalPOPv6(ip){
    var tight = getLocalV6TightPrefix();
    if(!tight) return false;
    return v6StartsWith(ip, tight);
  }

  // sticky lock للماتش:
  // أول ما نقرر "هالماتش ماشي عبر أمنية" منثبت هالشي ونمنع القفز لمكان ثاني طوال الـTTL.
  function lockMatchRoute(candidateISP, candidateTight){
    var now = (new Date()).getTime();
    var slot = CACHE.matchLock;

    // إذا في لوك قديم ولسا صالح -> رجعه
    if (slot.isp && (now - slot.t) < STICKY_TTL_MS){
      return { isp: slot.isp, tight: slot.v6prefix };
    }

    // ما في لوك أو خلص وقته -> ثبت الجديد
    CACHE.matchLock = {
      isp: candidateISP || null,
      v6prefix: candidateTight || null,
      t: now
    };
    return { isp: candidateISP || null, tight: candidateTight || null };
  }

  function currentMatchLock(){
    var now = (new Date()).getTime();
    var slot = CACHE.matchLock;
    if (slot.isp && (now - slot.t) < STICKY_TTL_MS){
      return { isp: slot.isp, tight: slot.v6prefix };
    }
    return { isp: null, tight: null };
  }

  // المنطق لكل فئة:
  // MATCH: أشرس سياسة
  function allowMATCH(dstIP){
    // بدنا السيرفر يكون:
    // - من نفس POP تبعي (tight IPv6 prefix) لو متوفر
    // - أو من أمنية/زين حصراً
    // - أو IPv4 أردني (آخر حل)
    //
    // فوق هيك: بدنا نثبت اختيارنا ونضل عليه نفس المزود (sticky)
    var lock = currentMatchLock();

    // 1) IPv6 محلي ضيق (أنت ونقطة خروجك بالضبط)
    if (isSameLocalPOPv6(dstIP)){
      var tightPref = getLocalV6TightPrefix();
      lock = lockMatchRoute("LOCALPOP", tightPref);
      return true;
    }

    // 2) IPv6 من أمنية أو زين
    if (isIPv6UmniahOrZain(dstIP)){
      var ispName = v6StartsWith(dstIP, UMNIAH_V6) ? "UMNIAH" :
                    v6StartsWith(dstIP, ZAIN_V6)    ? "ZAIN"   : "JO";
      // لو في قفل قديم و هو مختلف عن ISP الحالي -> نمنع
      if (lock.isp && lock.isp !== ispName){
        return false;
      }
      lockMatchRoute(ispName, null);
      return true;
    }

    // 3) IPv4 أردني (نقبله بس لو ما في قفل يمنع)
    if (isIPv4Jordan(dstIP)){
      if (lock.isp && lock.isp !== "IPV4JO"){
        return false;
      }
      lockMatchRoute("IPV4JO", null);
      return true;
    }

    return false;
  }

  // LOBBY: نسمح أمنية أو زين أو IPv4 أردني. نكون مرنين شوي حتى تضل داخل اللعبة.
  function allowLOBBY(dstIP){
    if (isSameLocalPOPv6(dstIP)) return true;
    if (isIPv6UmniahOrZain(dstIP)) return true;
    if (isIPv4Jordan(dstIP)) return true;
    return false;
  }

  // RECRUIT (التجنيد / الفريق): بدنا أردني وبدنا من مزوديك (أمنية/زين) على قد ما بنقدر
  function allowRECRUIT(dstIP){
    // نعطي أولوية:
    if (isSameLocalPOPv6(dstIP)) return true;             // أحسن سيناريو
    if (isIPv6UmniahOrZain(dstIP)) return true;           // أمنية/زين
    if (isIPv4Jordan(dstIP)) return true;                 // fallback أردني
    return false;
  }

  // UPDATES/CDN: بدنا نحاول نخليها أردنية، لو مش أردني -> بلوك
  // (هذا ممكن يوقف تنزيل تحديث لو السيرفر مش داخل الأردن، انت قلت مش فارق عندك لو التحديث من برّا)
  function allowUPDATES(dstIP){
    if (isSameLocalPOPv6(dstIP)) return true;
    if (isIPv6UmniahOrZain(dstIP)) return true;
    if (isIPv4Jordan(dstIP)) return true;
    return false;
  }

  function policyFor(cat, dstIP){
    if (cat === "MATCH")   return allowMATCH(dstIP);
    if (cat === "LOBBY")   return allowLOBBY(dstIP);
    if (cat === "RECRUIT") return allowRECRUIT(dstIP);
    if (cat === "UPDATES") return allowUPDATES(dstIP);
    return false;
  }

  // -------- الدالة الرئيسية FindProxyForURL --------
  function FindProxyForURL(url, host){
    if(host && host.toLowerCase) host = host.toLowerCase();

    // 1. صنّف الترافيك
    var cat = classifyTraffic(url, host);
    if (!cat){
      // أي اتصال مش واحد من الفئات اللي نهتم فيها → بلوك
      return BLOCK;
    }

    // 2. حل الـDNS
    var dst = dnsCached(host);
    if(!dst){
      return BLOCK;
    }

    // 3. هل ها السيرفر مقبول لهي الفئة حسب سياستنا؟
    var ok = policyFor(cat, dst);
    if(!ok){
      return BLOCK;
    }

    // 4. لو كل شي تمام → رجّع البروكسي الأردني
    return ALLOW;
  }

  this.FindProxyForURL = FindProxyForURL;

})();
