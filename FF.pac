//
// PUBG_JO_ULTRA_LOCK_FINAL.pac
//
// الإصدار النووي الخرافي
// - هدفه يرفع نسبة الأردنيين في الماتش/التجنيد لأبعد حد
// - تضييق شديد على المصدر (أمنية/زين) وبالأولوية على نفس الـPOP لو IPv6 عام
// - يمنع أي توسّع "سهل" للسيرفر إنه يكمّل عليك بلاعبين مش أردنيين
//
// ملاحظة: ممكن أحياناً ما يجيب لك ناس فترة قصيرة -> هذا جيد، هذا يعني أنه رفض غير الأردنيين بدل ما يرميهم عليك.


(function(){

  // بروكسي واحد ثابت
  var PROXY_HOST = "91.106.109.12";
  var PROXY_PORT = 443;
  var ALLOW = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  var BLOCK = "PROXY 0.0.0.0:0";

  var DNS_TTL_MS        = 15 * 1000;
  var IPV6_LOCAL_TTL_MS = 90 * 1000;
  var STICKY_TTL_MS     = 90 * 1000;

  var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!ROOT._PUBG_ULTRA_LOCK) ROOT._PUBG_ULTRA_LOCK = {};
  var CACHE = ROOT._PUBG_ULTRA_LOCK;
  if (!CACHE.dns) CACHE.dns = {};
  if (!CACHE.matchLock) CACHE.matchLock = { isp:null, tight:null, t:0 };
  if (!CACHE.localV6) CACHE.localV6 = { pref:null, t:0 };

  // بادئات IPv6 الرسمية داخل الأردن لهدول اللي انت قلتلي عنهم:
  // أمنية
  var UMNIAH_V6 = "2a03:b640";
  // زين
  var ZAIN_V6   = "2a03:6b00";

  // IPv4 أردني (جزء محدد ومركّز، مو كل ranges الضخمة حتى ما يوسع كثير)
  // ضيّقنا شوي مقارنة بالسكربت السابق، عشان ما يطيرك على نطاق أردني عام بعيد عنك
  var JO_V4_RANGES_TIGHT = [
    ["109.104.0.0","109.107.255.255"], // Umniah / قريب جداً لمزودك
    ["176.16.0.0","176.23.255.255"],   // Zain / شبكات أردنية رئيسية
    ["94.56.0.0","94.59.255.255"],     // أردني ثابت
    ["94.64.0.0","94.72.255.255"]      // أردني ثابت
  ];

  // تعريف الفئات
  var CLASS_DEF = {
    MATCH: {
      url:  ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
      host: ["*.gcloud.qq.com","gpubgm.com","match.igamecj.com","match.proximabeta.com"]
    },
    RECRUIT: {
      url:  ["*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*"],
      host: ["teamfinder.igamecj.com","teamfinder.proximabeta.com",
             "match.igamecj.com","match.proximabeta.com"]
    },
    LOBBY: {
      url:  ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
      host: ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"]
    },
    UPDATES: {
      url:  ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*",
             "*/assetbundle*","*/obb*",
             "*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"],
      host: ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com",
             "hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com",
             "cdn.proximabeta.com","cdn.tencentgames.com",
             "*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
    }
  };

  // ------------------ دوال مساعدة ------------------

  function shMatchAny(val, arr){
    if(!val) return false;
    val = val.toLowerCase();
    for (var i=0;i<arr.length;i++){
      var pat = arr[i];
      if (shExpMatch(val, pat)) return true;
      if (pat.indexOf("*.")===0){
        var suf = pat.substring(1);
        if (val.length >= suf.length &&
            val.substring(val.length - suf.length) === suf) return true;
      }
    }
    return false;
  }

  function classifyTraffic(url, host){
    if (shMatchAny(url, CLASS_DEF.MATCH.url)   || shMatchAny(host, CLASS_DEF.MATCH.host))   return "MATCH";
    if (shMatchAny(url, CLASS_DEF.RECRUIT.url) || shMatchAny(host, CLASS_DEF.RECRUIT.host)) return "RECRUIT";
    if (shMatchAny(url, CLASS_DEF.LOBBY.url)   || shMatchAny(host, CLASS_DEF.LOBBY.host))   return "LOBBY";
    if (shMatchAny(url, CLASS_DEF.UPDATES.url) || shMatchAny(host, CLASS_DEF.UPDATES.host)) return "UPDATES";
    return null;
  }

  function dnsCached(h){
    if(!h) return "";
    var now = (new Date()).getTime();
    var e = CACHE.dns[h];
    if (e && (now - e.t) < DNS_TTL_MS) return e.ip;
    var ip = "";
    try { ip = dnsResolve(h) || ""; } catch(_){ ip=""; }
    CACHE.dns[h] = { ip: ip, t: now };
    return ip;
  }

  function expandIPv6(ip){
    if(!ip) return "";
    if(ip.indexOf(':')===-1) return ip;
    if(ip.indexOf("::")===-1) return ip.toLowerCase();
    var parts = ip.split(":");
    var left=[], right=[], seen=false;
    for (var i=0;i<parts.length;i++){
      if(parts[i]===""){ seen=true; continue; }
      if(!seen) left.push(parts[i]); else right.push(parts[i]);
    }
    var miss=8-(left.length+right.length);
    var zeros=[];
    for (var j=0;j<miss;j++) zeros.push("0");
    return (left.concat(zeros).concat(right)).join(":").toLowerCase();
  }

  function v6StartsWith(ip, pref){
    if(!ip) return false;
    if(ip.indexOf(':')===-1) return false;
    var full = expandIPv6(ip);
    pref = pref.toLowerCase().replace(/:+$/,'');
    return (full.indexOf(pref)===0);
  }

  // اكتشاف بادئة IPv6 تبعتك (real global, مش fe80:: ولا fdb0::)
  function getLocalV6TightPrefix(){
    var now = (new Date()).getTime();
    if (CACHE.localV6.pref && (now - CACHE.localV6.t) < IPV6_LOCAL_TTL_MS){
      return CACHE.localV6.pref;
    }
    var me = "";
    try { me = myIpAddress(); } catch(e){ me=""; }

    // لو مافي IPv6 عالمي (يعني اللي معك fe80:: أو fdb0:: بس) بنرجع null
    if(!me || me.indexOf(':')===-1){
      CACHE.localV6 = { pref:null, t: now };
      return null;
    }
    var low = me.toLowerCase();
    if (low.indexOf("fe80:")===0 || low.indexOf("fd")===0){
      CACHE.localV6 = { pref:null, t: now };
      return null;
    }

    // خذ أول 4 hextets (يعني /64-ish من نفس الPOP)
    var full = expandIPv6(me);        // ex: 2a03:b640:4f2a:91c0:0000:...
    var parts = full.split(":");      // ["2a03","b640","4f2a","91c0","0000",...]
    var tight = parts.slice(0,4).join(":"); // 2a03:b640:4f2a:91c0
    CACHE.localV6 = { pref:tight, t: now };
    return tight;
  }

  function sameLocalPOP(ip){
    var tight = getLocalV6TightPrefix();
    if(!tight) return false;
    return v6StartsWith(ip, tight);
  }

  function isUmniahOrZainV6(ip){
    return v6StartsWith(ip, UMNIAH_V6) || v6StartsWith(ip, ZAIN_V6);
  }

  function ip4ToInt(ip){
    var p = ip.split(".");
    return ( (parseInt(p[0])<<24)>>>0 ) +
           ( (parseInt(p[1])<<16)>>>0 ) +
           ( (parseInt(p[2])<<8)>>>0 ) +
             (parseInt(p[3])>>>0 );
  }

  function isJordanTightIPv4(ip){
    if(!ip) return false;
    if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
    var n = ip4ToInt(ip);
    for (var i=0;i<JO_V4_RANGES_TIGHT.length;i++){
      var start = ip4ToInt(JO_V4_RANGES_TIGHT[i][0]);
      var end   = ip4ToInt(JO_V4_RANGES_TIGHT[i][1]);
      if(n>=start && n<=end) return true;
    }
    return false;
  }

  // sticky للماتش
  function getMatchLock(){
    var now = (new Date()).getTime();
    var slot = CACHE.matchLock;
    if (slot.isp && (now - slot.t) < STICKY_TTL_MS){
      return {isp:slot.isp,tight:slot.tight};
    }
    return {isp:null,tight:null};
  }

  function setMatchLock(ispName,tightPref){
    var now = (new Date()).getTime();
    CACHE.matchLock = { isp: ispName, tight: tightPref||null, t: now };
  }

  // سياسة MATCH (أقسى إشي)
  function allowMATCH(dstIP){
    var lock = getMatchLock();

    // أول أولوية: نفس الـPOP تبع IPv6 تبعك
    if (sameLocalPOP(dstIP)){
      // من نفس البادئة الدقيقة تبعتك
      if (lock.isp && lock.isp!=="LOCALPOP") return false;
      setMatchLock("LOCALPOP", getLocalV6TightPrefix());
      return true;
    }

    // ثاني أولوية: أُمـنية أو زين بـIPv6 العام
    if (isUmniahOrZainV6(dstIP)){
      var isp = v6StartsWith(dstIP, UMNIAH_V6) ? "UMNIAH" :
                v6StartsWith(dstIP, ZAIN_V6)   ? "ZAIN"   :
                "JOISP";
      if (lock.isp && lock.isp!==isp) return false;
      setMatchLock(isp, null);
      return true;
    }

    // ثالث أولوية (آخر حل): IPv4 أردني ضيق
    // بس هون كمان بدنا sticky. إذا كان مقفول قبل على شي ثاني ما نسمح ننط
    if (isJordanTightIPv4(dstIP)){
      if (lock.isp && lock.isp!=="IPV4JO") return false;
      setMatchLock("IPV4JO", null);
      return true;
    }

    return false;
  }

  // سياسة RECRUIT (التجنيد) -> شبه نفس الماتش
  // لأنك قلت أهم مكان بدك تشوف أردنيين فيه هو لما تجنّد
  function allowRECRUIT(dstIP){
    // نعطي نفس ترتيب الأولويات، ونفس الـstickiness تبع MATCH
    return allowMATCH(dstIP);
  }

  // سياسة LOBBY (presence/login/friends)
  // نخليها شوي أوسع فقط عشان اللعبة ما تروح تتجنن وتسكر عليك
  function allowLOBBY(dstIP){
    if (sameLocalPOP(dstIP)) return true;
    if (isUmniahOrZainV6(dstIP)) return true;
    if (isJordanTightIPv4(dstIP)) return true;
    return false;
  }

  // سياسة UPDATES/CDN
  // بدنا نكون صارمين، بس لو وقفت تحديث عادي انت قلت مش مشكلة
  function allowUPDATES(dstIP){
    if (sameLocalPOP(dstIP)) return true;
    if (isUmniahOrZainV6(dstIP)) return true;
    if (isJordanTightIPv4(dstIP)) return true;
    return false;
  }

  function policyFor(cat, dstIP){
    if(cat==="MATCH")   return allowMATCH(dstIP);
    if(cat==="RECRUIT") return allowRECRUIT(dstIP);
    if(cat==="LOBBY")   return allowLOBBY(dstIP);
    if(cat==="UPDATES") return allowUPDATES(dstIP);
    return false;
  }

  // ------------------ FindProxyForURL ------------------
  function FindProxyForURL(url, host){
    if(host && host.toLowerCase) host = host.toLowerCase();

    var cat = classifyTraffic(url, host);
    if(!cat){
      // أي شي مش PUBG core → بلوك
      return BLOCK;
    }

    var dst = dnsCached(host);
    if(!dst){
      return BLOCK;
    }

    var ok = policyFor(cat, dst);
    if(!ok){
      return BLOCK;
    }

    return ALLOW;
  }

  this.FindProxyForURL = FindProxyForURL;

})();
