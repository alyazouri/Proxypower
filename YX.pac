function FindProxyForURL(url, host) {
  var PROXY_HOST = "91.106.109.12";

  // منافذ كل فئة من ترافيك اللعبة/الخدمة
  var PORTS = {
    LOBBY: [443, 8443, 808],
    MATCH: [10012, 10013], // منافذ اللعب الفعلي/المباريات
    RECRUIT_SEARCH: [10010, 10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020],
    UPDATES: [80, 443, 8443, 808],
    CDNs: [80, 443, 808]
  };

  // أوزان اختيار المنفذ (الأول أولوية أعلى)
  var PORT_WEIGHTS = {
    LOBBY: [5, 3, 2],
    MATCH: [3, 2],
    RECRUIT_SEARCH: [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
    UPDATES: [5, 3, 2, 1],
    CDNs: [3, 2, 2]
  };

  // جميع الرينجات الأردنية (IP ranges) مرتبة من الأصغر إلى الأوسع
  // بدون تكرار
  var JO_IP_RANGES = [
    ["217.8.0.1",   "217.8.255.255"],
    ["217.18.0.1",  "217.18.255.255"],
    ["217.27.0.1",  "217.27.255.255"],
    ["217.61.0.1",  "217.61.255.255"],
    ["217.64.0.1",  "217.64.255.255"],
    ["217.70.0.1",  "217.70.255.255"],
    ["217.79.0.1",  "217.79.255.255"],
    ["217.119.0.1", "217.119.255.255"],
    ["217.129.0.1", "217.129.255.255"],
    ["217.132.0.1", "217.132.255.255"],
    ["217.147.0.1", "217.147.255.255"],
    ["217.154.0.1", "217.154.255.255"],
    ["217.160.0.1", "217.160.255.255"],
    ["217.168.0.1", "217.168.255.255"],
    ["217.170.0.1", "217.170.255.255"],
    ["217.175.0.1", "217.175.255.255"],
    ["217.178.0.1", "217.178.255.255"],

    ["91.84.0.0",   "91.84.255.255"],
    ["91.104.0.0",  "91.104.255.255"],
    ["91.107.0.0",  "91.107.255.255"],
    ["91.120.0.0",  "91.120.255.255"],
    ["91.122.0.0",  "91.122.255.255"],
    ["91.126.0.0",  "91.126.255.255"],
    ["91.135.0.0",  "91.135.255.255"],
    ["91.143.0.0",  "91.143.255.255"],
    ["91.147.0.0",  "91.147.255.255"],
    ["91.149.0.0",  "91.149.255.255"],
    ["91.186.0.0",  "91.186.255.255"],
    ["91.189.0.0",  "91.189.255.255"],
    ["91.204.0.0",  "91.204.255.255"],
    ["91.206.0.0",  "91.206.255.255"],
    ["91.209.0.0",  "91.209.255.255"],
    ["91.225.0.0",  "91.225.255.255"],
    ["91.235.0.0",  "91.235.255.255"],
    ["91.238.0.0",  "91.238.255.255"],
    ["91.252.0.0",  "91.252.255.255"],
    ["109.86.0.0",  "109.86.255.255"],
    ["109.104.0.0", "109.104.255.255"],
    ["109.125.0.0", "109.125.255.255"],

    ["176.8.0.0",   "176.8.255.255"],
    ["176.33.0.0",  "176.33.255.255"],
    ["176.58.0.0",  "176.58.255.255"],
    ["176.65.0.0",  "176.65.255.255"],
    ["176.67.0.0",  "176.67.255.255"],
    ["176.72.0.0",  "176.72.255.255"],
    ["176.81.0.0",  "176.81.255.255"],
    ["176.88.0.0",  "176.88.255.255"],
    ["176.93.0.0",  "176.93.255.255"],
    ["176.115.0.0", "176.115.255.255"],

    ["217.12.0.1",  "217.13.255.255"],
    ["217.30.0.1",  "217.31.255.255"],
    ["217.72.0.1",  "217.73.255.255"],
    ["217.156.0.1", "217.157.255.255"],

    ["91.86.0.0",   "91.87.255.255"],
    ["91.132.0.0",  "91.133.255.255"],
    ["91.198.0.0",  "91.199.255.255"],
    ["91.227.0.0",  "91.228.255.255"],
    ["91.230.0.0",  "91.231.255.255"],
    ["91.244.0.0",  "91.245.255.255"],
    ["109.82.0.0",  "109.83.255.255"],
    ["176.12.0.0",  "176.13.255.255"],
    ["176.54.0.0",  "176.55.255.255"],

    ["217.20.0.1",  "217.22.255.255"],
    ["217.52.0.1",  "217.54.255.255"],
    ["217.136.0.1", "217.138.255.255"],
    ["217.142.0.1", "217.144.255.255"],
    ["217.163.0.1", "217.165.255.255"],

    ["91.93.0.0",   "91.95.255.255"],
    ["91.109.0.0",  "91.111.255.255"],
    ["91.191.0.0",  "91.193.255.255"],
    ["176.97.0.0",  "176.99.255.255"],

    ["217.96.0.1",  "217.99.255.255"],
    ["176.40.0.0",  "176.43.255.255"],
    ["109.128.0.0", "109.132.255.255"],
    ["176.47.0.0",  "176.52.255.255"],
    ["176.16.0.0",  "176.23.255.255"],
    ["91.176.0.0",  "91.184.255.255"]
  ];

  // هل كل فئة لازم تكون على آيبي أردني؟ نعم
  var STRICT_JO_FOR = {
    LOBBY: true,
    MATCH: true,
    RECRUIT_SEARCH: true,
    UPDATES: true,
    CDNs: true
  };

  // ممنوع أي اتصال خارج الأردن
  var FORBID_NON_JO = true;
  var BLOCK_REPLY = "PROXY 0.0.0.0:0";

  // إعدادات الثبات وتقليل تبديل البورت عشان البنق يظل ثابت
  var STICKY_SALT = "JO_STICKY";
  var STICKY_TTL_MINUTES = 60;      // نثبت نفس البورت لمدة ساعة
  var JITTER_WINDOW = 0;            // بدون عشوائية إضافية
  var DST_RESOLVE_TTL_MS = 15 * 1000; // نخزن DNS فقط 15 ثانية

  // كاش داخلي (PAC ما عنده state طبيعي، فإحنا بنبني state بأنفسنا)
  var now = new Date().getTime();
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};

  // تعريف الدومينات/المسارات حسب نوع الترافيك في اللعبة
  var PUBG_DOMAINS = {
    LOBBY: [
      "*.pubgmobile.com",
      "*.pubgmobile.net",
      "*.proximabeta.com",
      "*.igamecj.com"
    ],
    MATCH: [
      "*.gcloud.qq.com",
      "gpubgm.com"
    ],
    RECRUIT_SEARCH: [
      "match.igamecj.com",
      "match.proximabeta.com",
      "teamfinder.igamecj.com",
      "teamfinder.proximabeta.com"
    ],
    UPDATES: [
      "cdn.pubgmobile.com",
      "updates.pubgmobile.com",
      "patch.igamecj.com",
      "hotfix.proximabeta.com",
      "dlied1.qq.com",
      "dlied2.qq.com",
      "gpubgm.com"
    ],
    CDNs: [
      "cdn.igamecj.com",
      "cdn.proximabeta.com",
      "cdn.tencentgames.com",
      "*.qcloudcdn.com",
      "*.cloudfront.net",
      "*.edgesuite.net"
    ]
  };

  var URL_PATTERNS = {
    LOBBY: [
      "*/account/login*",
      "*/client/version*",
      "*/status/heartbeat*",
      "*/presence/*",
      "*/friends/*"
    ],
    MATCH: [
      "*/matchmaking/*",
      "*/mms/*",
      "*/game/start*",
      "*/game/join*",
      "*/report/battle*"
    ],
    RECRUIT_SEARCH: [
      "*/teamfinder/*",
      "*/clan/*",
      "*/social/*",
      "*/search/*",
      "*/recruit/*"
    ],
    UPDATES: [
      "*/patch*",
      "*/hotfix*",
      "*/update*",
      "*/download*",
      "*/assets/*",
      "*/assetbundle*",
      "*/obb*"
    ],
    CDNs: [
      "*/cdn/*",
      "*/static/*",
      "*/image/*",
      "*/media/*",
      "*/video/*",
      "*/res/*",
      "*/pkg/*"
    ]
  };

  // ---------------- دوال مساعدة أساسية ----------------

  function ipToInt(ip) {
    var parts = ip.split(".");
    return (parseInt(parts[0]) << 24) +
           (parseInt(parts[1]) << 16) +
           (parseInt(parts[2]) << 8) +
            parseInt(parts[3]);
  }

  // تفحص إذا IP داخل أي رينج أردني (مع أفضلية خاصة للمباريات)
  function ipInAnyJordanRange(ip, preferPriority) {
    if (!ip) return false;
    var ipNum = ipToInt(ip);

    // أولوية خاصة لسيرفرات الماتش (قريب أقصى شيء)
    if (preferPriority) {
      var preferredRange = ["91.106.96.0", "91.106.111.255"];
      var startP = ipToInt(preferredRange[0]);
      var endP   = ipToInt(preferredRange[1]);
      if (ipNum >= startP && ipNum <= endP) return true;
    }

    for (var j = 0; j < JO_IP_RANGES.length; j++) {
      var start = ipToInt(JO_IP_RANGES[j][0]);
      var end   = ipToInt(JO_IP_RANGES[j][1]);
      if (ipNum >= start && ipNum <= end) return true;
    }
    return false;
  }

  // match host to wildcard list
  function hostMatchesAnyDomain(h, patterns) {
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(h, patterns[i])) return true;

      // دعم شكل "*.example.com" بمقارنة suffix
      var p = patterns[i].replace(/^\*\./, ".");
      if (h.slice(-p.length) === p) return true;
    }
    return false;
  }

  // match URL path against known patterns
  function pathMatches(u, patterns) {
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(u, patterns[i])) return true;
    }
    return false;
  }

  // اختيار المنفذ حسب الأوزان مع تثبيت لاحق
  function weightedPick(ports, weights) {
    var sum = 0;
    for (var i = 0; i < weights.length; i++) {
      sum += (weights[i] || 1);
    }
    var r = Math.floor(Math.random() * sum) + 1;
    var acc = 0;
    for (var k = 0; k < ports.length; k++) {
      acc += (weights[k] || 1);
      if (r <= acc) return ports[k];
    }
    return ports[0];
  }

  // sticky proxy: نختار بورت ونمسكه فترة STICKY_TTL_MINUTES
  function proxyForCategory(category) {
    var key = STICKY_SALT + "_PORT_" + category;
    var ttl = STICKY_TTL_MINUTES * 60 * 1000;

    var cached = CACHE._PORT_STICKY[key];
    if (cached && (now - cached.t) < ttl) {
      return "PROXY " + PROXY_HOST + ":" + cached.p;
    }

    var chosenPort = weightedPick(PORTS[category], PORT_WEIGHTS[category]);
    CACHE._PORT_STICKY[key] = { p: chosenPort, t: now };
    return "PROXY " + PROXY_HOST + ":" + chosenPort;
  }

  // DNS resolve مع كاش بسيط بزمن TTL قصير (15 ثانية)
  function resolveDstCached(h, ttl) {
    if (!h) return "";
    // إذا أصلاً host هو IP
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;

    var c = CACHE.DST_RESOLVE_CACHE[h];
    if (c && (now - c.t) < ttl) {
      return c.ip;
    }

    var resolved = dnsResolve(h);
    var ip = (resolved && resolved !== "0.0.0.0") ? resolved : "";
    CACHE.DST_RESOLVE_CACHE[h] = { ip: ip, t: now };
    return ip;
  }

  // ---------------- فحص وضع العميل والبروكسي ----------------

  var geoTTL = STICKY_TTL_MINUTES * 60 * 1000;
  var clientKey = STICKY_SALT + "_CLIENT_JO";
  var clientOK;
  var clientCache = CACHE[clientKey];

  if (clientCache && (now - clientCache.t) < geoTTL) {
    clientOK = clientCache.ok;
  } else {
    // نتأكد إن الآيبي الخارجي للعميل أردني
    clientOK = ipInAnyJordanRange(
      resolveDstCached(myIpAddress(), DST_RESOLVE_TTL_MS),
      false
    );
    CACHE[clientKey] = { ok: clientOK, t: now };
  }

  // نتأكد إن البروكسي نفسه أردني
  var proxyOK = ipInAnyJordanRange(PROXY_HOST, false);

  // لو واحد منهم مش أردني: نقطع/نمنع
  if (!(clientOK && proxyOK)) {
    return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  }

  // ---------------- منطق الإلزام بالمسار الأردني ----------------

  function requireJordanDestination(category, h) {
    var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    var preferPriority = (category === "MATCH"); // أولوية أعلى للسيرفرات الأقرب للمباريات
    if (!ipInAnyJordanRange(ip, preferPriority)) {
      return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    }
    return proxyForCategory(category);
  }

  // أولاً: لو الـ URL نفسه يطابق فئة معروفة (لوجن، ماتش، تحديثات...)
  for (var cat in URL_PATTERNS) {
    if (pathMatches(url, URL_PATTERNS[cat])) {
      if (STRICT_JO_FOR[cat]) {
        return requireJordanDestination(cat, host);
      }
      return proxyForCategory(cat);
    }
  }

  // ثانياً: لو الـ host يطابق دومينات PUBG الرسمية
  for (var c in PUBG_DOMAINS) {
    if (hostMatchesAnyDomain(host, PUBG_DOMAINS[c])) {
      if (STRICT_JO_FOR[c]) {
        return requireJordanDestination(c, host);
      }
      return proxyForCategory(c);
    }
  }

  // ثالثاً: لو الاتصال مباشر إلى IP أردني (بدون دومين)، نعامله زي LOBBY
  var dstIP = /^\d+\.\d+\.\d+\.\d+$/.test(host)
    ? host
    : resolveDstCached(host, DST_RESOLVE_TTL_MS);

  if (dstIP && ipInAnyJordanRange(dstIP, false)) {
    return proxyForCategory("LOBBY");
  }

  // أخيراً: أي شيء ثاني نطلع منه DIRECT أو BLOCK حسب السياسة
  return "DIRECT";
}
