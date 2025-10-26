// JO-LOCK-ONE-ISP.pac
// هدف: خنق كل الاتصالات على مزود أردني واحد محدد فقط
// الفكرة: ترفع احتمال أنك ما تشوف إلا ناس من نفس المسار/المنطقة
// (يعني أردنيين أقرب ما يمكن لإلك)

(function() {

  // بروكسي واحد ثابت زي ما بدك
  var PROXY_HOST = "91.106.109.12";
  var PROXY_PORT = 443;
  var BLOCK = "PROXY 0.0.0.0:0";

  function allowProxy() {
    return "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  }

  // TTLs
  var RESOLVE_TTL_MS = 15 * 1000;

  // كاش
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_LOCK1_CACHE) root._PAC_LOCK1_CACHE = {};
  var CACHE = root._PAC_LOCK1_CACHE;
  if (!CACHE.dns) CACHE.dns = {};

  // -----------------------------
  // اختار ISP واحد فقط
  // لو بدك تحصر على Umniah / Batelco (غالبًا 2a03:b640)
  // غيّر هذا الـprefix لو بدك Zain مثلاً (2a03:6b00) أو Orange (2a00:18d8)
  // -----------------------------
  var LOCKED_ISP_PREFIXES = [
    "2a03:b640"  // هنا إحنا قفلنا على Umniah/Batelco الأردن فقط
                 // بدك Zain؟ خليه "2a03:6b00"
                 // بدك Orange؟ "2a00:18d8"
                 // بدك JDC/GO؟ "2a01:9700"
  ];

  // PUBG traffic patterns
  var URL_ALLOW = [
    "*/matchmaking/*",
    "*/mms/*",
    "*/game/start*",
    "*/game/join*",
    "*/report/battle*",
    "*/account/login*",
    "*/client/version*",
    "*/status/heartbeat*",
    "*/presence/*",
    "*/friends/*",
    "*/teamfinder/*",
    "*/recruit/*",
    "*/clan/*",
    "*/social/*",
    "*/search/*",
    "*/patch*",
    "*/hotfix*",
    "*/update*",
    "*/download*",
    "*/assets/*",
    "*/assetbundle*",
    "*/obb*",
    "*/cdn/*",
    "*/static/*",
    "*/image/*",
    "*/media/*",
    "*/video/*",
    "*/res/*",
    "*/pkg/*"
  ];

  var HOST_ALLOW = [
    "*.pubgmobile.com",
    "*.pubgmobile.net",
    "*.proximabeta.com",
    "*.igamecj.com",
    "*.gcloud.qq.com",
    "gpubgm.com",
    "teamfinder.igamecj.com",
    "teamfinder.proximabeta.com",
    "match.igamecj.com",
    "match.proximabeta.com",
    "cdn.pubgmobile.com",
    "updates.pubgmobile.com",
    "patch.igamecj.com",
    "hotfix.proximabeta.com",
    "dlied1.qq.com",
    "dlied2.qq.com",
    "cdn.proximabeta.com",
    "cdn.tencentgames.com",
    "*.qcloudcdn.com",
    "*.cloudfront.net",
    "*.edgesuite.net"
  ];

  function urlAllowed(u) {
    for (var i=0;i<URL_ALLOW.length;i++) {
      if (shExpMatch(u, URL_ALLOW[i])) return true;
    }
    return false;
  }

  function hostAllowed(h) {
    if (!h) return false;
    h = h.toLowerCase();
    for (var i=0;i<HOST_ALLOW.length;i++) {
      var pat = HOST_ALLOW[i];
      if (shExpMatch(h, pat)) return true;
      if (pat.indexOf("*.")===0) {
        var suf = pat.substring(1);
        if (h.length >= suf.length &&
            h.substring(h.length - suf.length) === suf) {
          return true;
        }
      }
    }
    return false;
  }

  function dnsCached(h) {
    var now = (new Date()).getTime();
    var e = CACHE.dns[h];
    if (e && (now - e.t) < RESOLVE_TTL_MS) return e.ip;
    var ip = "";
    try { ip = dnsResolve(h) || ""; } catch(e2){ ip = ""; }
    CACHE.dns[h] = { ip: ip, t: now };
    return ip;
  }

  function expandIPv6(ip) {
    if (!ip) return "";
    if (ip.indexOf(':') === -1) return ip; // IPv4
    if (ip.indexOf("::") === -1) return ip.toLowerCase();
    var parts = ip.split(":");
    var left=[], right=[], gap=false;
    for (var i=0;i<parts.length;i++){
      if (parts[i]===""){gap=true;continue;}
      if(!gap) left.push(parts[i]); else right.push(parts[i]);
    }
    var miss = 8 - (left.length + right.length);
    var zeros=[];
    for (var j=0;j<miss;j++) zeros.push("0");
    return (left.concat(zeros).concat(right)).join(":").toLowerCase();
  }

  function inLockedISP(ip) {
    if (!ip) return false;
    // ممنوع IPv4 نهائياً
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;

    var full = expandIPv6(ip); // توسعة كاملة
    var raw  = ip.toLowerCase();

    for (var i=0;i<LOCKED_ISP_PREFIXES.length;i++) {
      var pref = LOCKED_ISP_PREFIXES[i].toLowerCase().replace(/:+$/,'');
      // match على الكامل أو المختصر
      if (full.indexOf(pref) === 0) return true;
      if (raw.indexOf(pref) === 0) return true;
    }
    return false;
  }

  function FindProxyForURL(url, host) {
    // لازم يكون الترافيك أصلاً تابع لببجي/التجنيد/الماتش/الداونلود
    // إذا مو من هدول -> بلوك
    if (!urlAllowed(url) && !hostAllowed(host)) {
      return BLOCK;
    }

    // جيب عنوان السيرفر
    var dst = dnsCached(host);
    if (!dst) {
      return BLOCK;
    }

    // هل السيرفر فعلياً داخل الـISP اللي قافلين عليه (مثلاً Umniah بس)؟
    if (!inLockedISP(dst)) {
      // لو مش من نفس ISP المقفول -> بلوك
      return BLOCK;
    }

    // غير هيك: سمح ومرّر الاتصال عبر البروكسي تبعك
    return allowProxy();
  }

  this.FindProxyForURL = FindProxyForURL;
})();
