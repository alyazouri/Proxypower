//
// PUBG_JO_BALANCED_LOCK.pac
//
// هدف: رجّع نسبة ظهور الأردنيين اللي كنت شايفها قبل ("كان أفضل")
// بدون ما نرجع نفتحها عالشرق الأوسط كله.
// يعني صارم = نعم. خانق زيادة = لا.
//
// إعداد: أمنية / زين / أردن فقط
// بروكسي: 91.106.109.12:443
//

(function(){

  var PROXY_HOST = "91.106.109.12";
  var PROXY_PORT = 443;
  var ALLOW = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  var BLOCK = "PROXY 0.0.0.0:0";

  var DNS_TTL_MS        = 15 * 1000;
  var IPV6_LOCAL_TTL_MS = 90 * 1000;
  var STICKY_TTL_MS     = 90 * 1000;

  var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!ROOT._PUBG_BAL_CACHE) ROOT._PUBG_BAL_CACHE = {};
  var CACHE = ROOT._PUBG_BAL_CACHE;
  if (!CACHE.dns) CACHE.dns = {};
  if (!CACHE.matchLock) CACHE.matchLock = { isp:null, t:0 };
  if (!CACHE.localV6) CACHE.localV6 = { pref:null, t:0 };

  // مزوديك:
  var UMNIAH_V6 = "2a03:b640"; // Umniah
  var ZAIN_V6   = "2a03:6b00"; // Zain

  // IPv4 أردني ضيق (أمنية/زين ومجاورين إلهم داخل الأردن)
  // هذا أوسع شوي من النسخة النووية، بس أضيق من النسخ القديمة جداً
  var JO_V4_RANGES = [
    ["109.104.0.0","109.107.255.255"], // Umniah وكتل قريبة
    ["176.16.0.0","176.23.255.255"],   // Zain Jordan backbone
    ["94.56.0.0","94.59.255.255"],     // مزودين أردنيين سكنيين
    ["94.64.0.0","94.72.255.255"]      // نطاق أردني محلي
  ];

  // تعريف فئات PUBG
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

  // --------- أدوات ---------

  function shMatchAny(val, arr){
    if(!val) return false;
    val = val.toLowerCase();
    for (var i=0;i<arr.length;i++){
      var pat = arr[i];
      if (shExpMatch(val, pat)) return true;
      if (pat.indexOf("*.")===0){
        var suf = pat.substring(1);
        if (val.length>=suf.length &&
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
    var ip="";
    try { ip = dnsResolve(h) || ""; } catch(_){ ip=""; }
    CACHE.dns[h] = { ip: ip, t: now };
    return ip;
  }

  function expandIPv6(ip){
    if(!ip) return "";
    if(ip.indexOf(':')===-1) return ip;
    if(ip.indexOf("::")===-1) return ip.toLowerCase();
    var parts=ip.split(":");
    var left=[],right=[],seen=false;
    for (var i=0;i<parts.length;i++){
      if(parts[i]===""){seen=true;continue;}
      if(!seen) left.push(parts[i]); else right.push(parts[i]);
    }
    var miss=8-(left.length+right.length);
    var zeros=[];
    for (var j=0;j<miss;j++) zeros.push("0");
    return left.concat(zeros).concat(right).join(":").toLowerCase();
  }

  function v6StartsWith(ip, pref){
    if(!ip) return false;
    if(ip.indexOf(':')===-1) return false;
    var full = expandIPv6(ip);
    pref = pref.toLowerCase().replace(/:+$/,'');
    return (full.indexOf(pref)===0);
  }

  // احنا هون مش رح نجبر IPv6 local tight /POP لأن عندك غالباً مش مفعّل IPv6 خارجي
  // لكن لو لاحقاً طلع عندك IPv6 حقيقي عالمي، نقدر نوسّع هالجزئية تاني.
  // هل هذا السيرفر IPv6 من أمنية أو زين؟
  function isUmniahOrZainV6(ip){
    return v6StartsWith(ip, UMNIAH_V6) || v6StartsWith(ip, ZAIN_V6);
  }

  // IPv4 أردني
  function ip4ToInt(ip){
    var p=ip.split(".");
    return ( (parseInt(p[0])<<24)>>>0 ) +
           ( (parseInt(p[1])<<16)>>>0 ) +
           ( (parseInt(p[2])<<8)>>>0 ) +
             (parseInt(p[3])>>>0 );
  }

  function isJordanIPv4(ip){
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

  // sticky للـMATCH عشان ما يقعد يقفز مزود-مزود كل ثانية
  function getMatchLock(){
    var now = (new Date()).getTime();
    var slot = CACHE.matchLock;
    if (slot.isp && (now - slot.t) < STICKY_TTL_MS){
      return slot.isp;
    }
    return null;
  }

  function setMatchLock(ispName){
    var now = (new Date()).getTime();
    CACHE.matchLock = { isp: ispName, t: now };
  }

  // ---------------- السياسات ----------------

  // MATCH: مهم جداً. نسمح:
  // - IPv6 من أمنية/زين
  // - أو IPv4 أردني من الرينجات أعلاه
  // ونستعمل sticky ISP حتى لو مرة أمنية، نضل أمنية، بس مش نخنق زيادة ونمنع IPv4 fallback الأردني.
  function allowMATCH(dstIP){
    var locked = getMatchLock();

    // هل السيرفر IPv6 من أمنية/زين؟
    if (isUmniahOrZainV6(dstIP)){
      var isp = v6StartsWith(dstIP, UMNIAH_V6) ? "UMNIAH" :
                v6StartsWith(dstIP, ZAIN_V6)   ? "ZAIN"   :
                "JOISP";
      if (locked && locked !== isp){
        // لو مأمن على مزود ثاني بقوة، ما نسمح نطفش برا التثبيت
        return false;
      }
      setMatchLock(isp);
      return true;
    }

    // IPv4 أردني؟
    if (isJordanIPv4(dstIP)){
      if (locked && locked !== "IPV4JO"){
        return false;
      }
      setMatchLock("IPV4JO");
      return true;
    }

    return false;
  }

  // RECRUIT (التجنيد): هنا بدنا نكون قريب من MATCH
  // بس أخف شوي لأن هون انت بتشوف القوائم وبدك ناس.
  // يعني حتى لو مش نفس ISP المقفول، بس يكون أردني بنسمح.
  function allowRECRUIT(dstIP){
    if (isUmniahOrZainV6(dstIP)) return true;
    if (isJordanIPv4(dstIP))     return true;
    return false;
  }

  // LOBBY: نخليها مشابهة لـRECRUIT عشان ما تتكسر حسابك / friends
  function allowLOBBY(dstIP){
    if (isUmniahOrZainV6(dstIP)) return true;
    if (isJordanIPv4(dstIP))     return true;
    return false;
  }

  // UPDATES/CDN: نفس السياسة. (لو التحديث خارجي رح يوقف، وهذا متعمد)
  function allowUPDATES(dstIP){
    if (isUmniahOrZainV6(dstIP)) return true;
    if (isJordanIPv4(dstIP))     return true;
    return false;
  }

  function policyFor(cat, dstIP){
    if (cat==="MATCH")   return allowMATCH(dstIP);
    if (cat==="RECRUIT") return allowRECRUIT(dstIP);
    if (cat==="LOBBY")   return allowLOBBY(dstIP);
    if (cat==="UPDATES") return allowUPDATES(dstIP);
    return false;
  }

  // ---------------- FindProxyForURL ----------------
  function FindProxyForURL(url, host){
    if(host && host.toLowerCase) host = host.toLowerCase();

    var cat = classifyTraffic(url, host);
    if(!cat){
      // أي شي مش PUBG أساسي → بلوك
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
