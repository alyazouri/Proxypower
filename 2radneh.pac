function FindProxyForURL(url, host) {
  // ---------- إعداد ثابت ----------
  var PROXY_HOST = "91.106.109.12";

  // منافذ حسب نوع الخدمة
  var PORTS = {
    LOBBY:           [443, 8443],
    MATCH:           [20001, 20003],
    RECRUIT_SEARCH:  [10012, 10013],
    UPDATES:         [80, 443, 8443],
    CDNs:            [80, 443]
  };

  // أوزان اختيار المنافذ
  var PORT_WEIGHTS = {
    LOBBY:           [5, 3],
    MATCH:           [3, 2],
    RECRUIT_SEARCH:  [3, 2],
    UPDATES:         [5, 3, 2],
    CDNs:            [3, 2]
  };

  // -------- نطاقات أساسية أردنية (للتأكد إن العميل والبروكسي أردنيين) --------
  // ما فيها أولوية، بس "هل هذا جو؟ نعم / لا"
  var JO_IP_RANGES = [
    ["176.16.0.0","176.23.255.255"],
    ["176.47.0.0","176.52.255.255"],
    ["91.176.0.0","91.184.255.255"],
    ["109.86.0.0","109.86.255.255"],
    ["176.97.0.0","176.99.255.255"],
    ["94.64.0.0","94.72.255.255"],
    ["94.104.0.0","94.111.255.255"],
    ["109.128.0.0","109.132.255.255"],
    ["176.40.0.0","176.43.255.255"],
    ["217.96.0.1","217.99.255.255"],
    ["94.56.0.0","94.59.255.255"],
    ["91.93.0.0","91.95.255.255"],
    ["91.109.0.0","91.111.255.255"],
    ["91.191.0.0","91.193.255.255"],
    ["217.20.0.1","217.22.255.255"],
    ["217.52.0.1","217.54.255.255"],
    ["217.136.0.1","217.138.255.255"],
    ["217.142.0.1","217.144.255.255"],
    ["217.163.0.1","217.165.255.255"],
    ["109.82.0.0","109.83.255.255"],
    ["91.86.0.0","91.87.255.255"],
    ["91.132.0.0","91.133.255.255"],
    ["91.198.0.0","91.199.255.255"],
    ["91.227.0.0","91.228.255.255"],
    ["91.230.0.0","91.231.255.255"],
    ["91.244.0.0","91.245.255.255"],
    ["176.12.0.0","176.13.255.255"],
    ["176.54.0.0","176.55.255.255"],
    ["217.12.0.1","217.13.255.255"],
    ["217.30.0.1","217.31.255.255"],
    ["217.72.0.1","217.73.255.255"],
    ["217.156.0.1","217.157.255.255"],
    ["94.50.0.0","94.51.255.255"],
    ["94.128.0.0","94.129.255.255"],
    ["94.134.0.0","94.135.255.255"],
    ["91.84.0.0","91.84.255.255"],
    ["91.104.0.0","91.104.255.255"],
    ["91.107.0.0","91.107.255.255"],
    ["91.120.0.0","91.120.255.255"],
    ["91.122.0.0","91.122.255.255"],
    ["91.126.0.0","91.126.255.255"],
    ["91.135.0.0","91.135.255.255"],
    ["91.143.0.0","91.143.255.255"],
    ["91.147.0.0","91.147.255.255"],
    ["91.149.0.0","91.149.255.255"],
    ["91.186.0.0","91.186.255.255"],
    ["91.189.0.0","91.189.255.255"],
    ["91.204.0.0","91.204.255.255"],
    ["91.206.0.0","91.206.255.255"],
    ["91.209.0.0","91.209.255.255"],
    ["91.225.0.0","91.225.255.255"],
    ["91.235.0.0","91.235.255.255"],
    ["91.238.0.0","91.238.255.255"],
    ["91.252.0.0","91.252.255.255"],
    ["109.104.0.0","109.104.255.255"],
    ["109.125.0.0","109.125.255.255"],
    ["176.8.0.0","176.8.255.255"],
    ["176.33.0.0","176.33.255.255"],
    ["176.58.0.0","176.58.255.255"],
    ["176.65.0.0","176.65.255.255"],
    ["176.67.0.0","176.67.255.255"],
    ["176.72.0.0","176.72.255.255"],
    ["176.81.0.0","176.81.255.255"],
    ["176.88.0.0","176.88.255.255"],
    ["176.93.0.0","176.93.255.255"],
    ["176.115.0.0","176.115.255.255"],
    ["217.8.0.1","217.8.255.255"],
    ["217.18.0.1","217.18.255.255"],
    ["217.27.0.1","217.27.255.255"],
    ["217.61.0.1","217.61.255.255"],
    ["217.64.0.1","217.64.255.255"],
    ["217.70.0.1","217.70.255.255"],
    ["217.79.0.1","217.79.255.255"],
    ["217.119.0.1","217.119.255.255"],
    ["217.129.0.1","217.129.255.255"],
    ["217.132.0.1","217.132.255.255"],
    ["217.147.0.1","217.147.255.255"],
    ["217.154.0.1","217.154.255.255"],
    ["217.160.0.1","217.160.255.255"],
    ["217.168.0.1","217.168.255.255"],
    ["217.170.0.1","217.170.255.255"],
    ["217.175.0.1","217.175.255.255"],
    ["217.178.0.1","217.178.255.255"],
    ["94.16.0.0","94.16.255.255"],
    ["94.20.0.0","94.20.255.255"],
    ["94.25.0.0","94.25.255.255"],
    ["94.27.0.0","94.27.255.255"],
    ["94.77.0.0","94.77.255.255"],
    ["94.102.0.0","94.102.255.255"],
    ["94.119.0.0","94.119.255.255"]
  ];

  // -------- نطاق خاص (أولوية قصوى) للّوبي والمباريات فقط --------
  // طلبك: الأولوية 109.107.0.0/17
  // /17 يعني:
  //   start = 109.107.0.0
  //   end   = 109.107.127.255
  var LOBBY_MATCH_PRIORITY = [
    ["109.107.0.0", "109.107.127.255"]
  ];

  // -------- نطاق خاص (تجنيد / بحث فريق) --------
  // نطاق مخصص للتجنيد، مستقل عن اللوبي والمباراة.
  // هون عم نسمح بفايبر/بروفايدر محلي واسع (تقدر تغيره لاحقاً لأي /24 أو /17 بدك ياه).
  // اخترت مجموعة قوية من نفس مزودي الأردن اللي بتحبهم (176.*, 94.*, 217.*) عشان يضل أردني/سكني.
  var RECRUIT_PRIORITY = [
    ["176.16.0.0","176.23.255.255"],
    ["94.64.0.0","94.72.255.255"],
    ["217.96.0.1","217.99.255.255"],
    ["217.20.0.1","217.22.255.255"],
    ["94.104.0.0","94.111.255.255"],
    ["94.56.0.0","94.59.255.255"]
  ];

  // الفئات اللي لازم تبقى داخل الأردن فقط
  var STRICT_JO_FOR = {
    LOBBY:           true,
    MATCH:           true,
    RECRUIT_SEARCH:  true,
    UPDATES:         true,
    CDNs:            true
  };

  // ممنوع أي سيرفر خارج الأردن
  var FORBID_NON_JO = true;
  var BLOCK_REPLY = "PROXY 0.0.0.0:0";

  // sticky settings
  var STICKY_SALT = "JO_STICKY";
  var STICKY_TTL_MINUTES = 60;
  var JITTER_WINDOW = 0;
  var DST_RESOLVE_TTL_MS = 15 * 1000;

  // كاش عام
  var now = new Date().getTime();
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};

  // تعريف دومينات ببجي و الباثات
  var PUBG_DOMAINS = {
    LOBBY:           ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH:           ["*.gcloud.qq.com","gpubgm.com"],
    RECRUIT_SEARCH:  ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    UPDATES:         ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
    CDNs:            ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };

  var URL_PATTERNS = {
    LOBBY:           ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH:           ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH:  ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES:         ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
    CDNs:            ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  // --------- دوال مساعدة ---------
  function ipToInt(ip) {
    var parts = ip.split(".");
    return (parseInt(parts[0])<<24) + (parseInt(parts[1])<<16) + (parseInt(parts[2])<<8) + parseInt(parts[3]);
  }

  function ipInRangeList(ip, rangeList) {
    if (!ip) return false;
    var n = ipToInt(ip);
    for (var i=0;i<rangeList.length;i++) {
      var start = ipToInt(rangeList[i][0]);
      var end   = ipToInt(rangeList[i][1]);
      if (n >= start && n <= end) return true;
    }
    return false;
  }

  // أردني بشكل عام؟
  function ipInJordan(ip) {
    return ipInRangeList(ip, JO_IP_RANGES);
  }

  function hostMatchesAnyDomain(h, patterns) {
    for (var i=0;i<patterns.length;i++) {
      if (shExpMatch(h, patterns[i])) return true;
      // دعم "*.domain.com" بشكل يدوي
      var p = patterns[i].replace(/^\*\./, ".");
      if (h.slice(-p.length) === p) return true;
    }
    return false;
  }

  function pathMatches(u, patterns) {
    for (var i=0;i<patterns.length;i++) {
      if (shExpMatch(u, patterns[i])) return true;
    }
    return false;
  }

  // اختيار بورت مع وزن وحفظه (sticky per category)
  function weightedPick(ports, weights) {
    var sum=0;
    for (var i=0;i<weights.length;i++) sum += (weights[i] || 1);
    var r = Math.floor(Math.random()*sum)+1;
    var acc=0;
    for (var k=0;k<ports.length;k++) {
      acc += (weights[k] || 1);
      if (r<=acc) return ports[k];
    }
    return ports[0];
  }

  function proxyForCategory(cat) {
    var key = STICKY_SALT+"_PORT_"+cat;
    var ttl = STICKY_TTL_MINUTES*60*1000;
    var e   = CACHE._PORT_STICKY[key];
    if (e && (now-e.t)<ttl) {
      return "PROXY "+PROXY_HOST+":"+e.p;
    }
    var p = weightedPick(PORTS[cat], PORT_WEIGHTS[cat]);
    CACHE._PORT_STICKY[key] = {p:p, t:now};
    return "PROXY "+PROXY_HOST+":"+p;
  }

  function resolveDstCached(h, ttl) {
    if (!h) return "";
    // إذا host أصلاً IP
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
    var c = CACHE.DST_RESOLVE_CACHE[h];
    if (c && (now-c.t)<ttl) return c.ip;
    var r = dnsResolve(h);
    var ip = (r && r !== "0.0.0.0") ? r : "";
    CACHE.DST_RESOLVE_CACHE[h] = {ip:ip,t:now};
    return ip;
  }

  // --------- تحقّق العميل والبروكسي نفسهم أردنيين ---------
  var geoTTL      = STICKY_TTL_MINUTES*60*1000;
  var clientKey   = STICKY_SALT+"_CLIENT_JO";
  var clientOK;
  var cE = CACHE[clientKey];
  if (cE && (now-cE.t)<geoTTL) {
    clientOK = cE.ok;
  } else {
    clientOK = ipInJordan(resolveDstCached(myIpAddress(), DST_RESOLVE_TTL_MS));
    CACHE[clientKey] = {ok:clientOK,t:now};
  }
  var proxyOK = ipInJordan(PROXY_HOST);

  // لو انت مش أردني أو البروكسي مش أردني -> بلوك
  if (!(clientOK && proxyOK)) {
    return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  }

  // --------- منطق السماح حسب الفئة ---------
  // اللوبي/المباراة: لازم الوجهة تكون جو + لازم تكون داخل 109.107.0.0/17 بالتحديد
  function requireLobbyMatchPriority(cat, h) {
    var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    // لازم أولاً جو بشكل عام؟
    if (!ipInJordan(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    // لازم حصراً داخل لستة LOBBY_MATCH_PRIORITY
    if (!ipInRangeList(ip, LOBBY_MATCH_PRIORITY)) {
        return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    }
    return proxyForCategory(cat);
  }

  // التجنيد: له نطاقه الخاص RECRUIT_PRIORITY (لكن برضو لازم يكون أردني عام)
  function requireRecruitPriority(h) {
    var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    if (!ipInJordan(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    if (!ipInRangeList(ip, RECRUIT_PRIORITY)) {
      return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    }
    return proxyForCategory("RECRUIT_SEARCH");
  }

  // باقي الفئات (تحديثات/CDN): يكفي أردني عام
  function requireJordanGeneric(cat, h) {
    var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    if (!ipInJordan(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    return proxyForCategory(cat);
  }

  // --------- القرار حسب URL أولاً ---------
  // URL_PATTERNS يحدد الفئة
  if (pathMatches(url, URL_PATTERNS.LOBBY)) {
    if (STRICT_JO_FOR.LOBBY) return requireLobbyMatchPriority("LOBBY", host);
    return proxyForCategory("LOBBY");
  }

  if (pathMatches(url, URL_PATTERNS.MATCH)) {
    if (STRICT_JO_FOR.MATCH) return requireLobbyMatchPriority("MATCH", host);
    return proxyForCategory("MATCH");
  }

  if (pathMatches(url, URL_PATTERNS.RECRUIT_SEARCH)) {
    if (STRICT_JO_FOR.RECRUIT_SEARCH) return requireRecruitPriority(host);
    return proxyForCategory("RECRUIT_SEARCH");
  }

  if (pathMatches(url, URL_PATTERNS.UPDATES)) {
    if (STRICT_JO_FOR.UPDATES) return requireJordanGeneric("UPDATES", host);
    return proxyForCategory("UPDATES");
  }

  if (pathMatches(url, URL_PATTERNS.CDNs)) {
    if (STRICT_JO_FOR.CDNs) return requireJordanGeneric("CDNs", host);
    return proxyForCategory("CDNs");
  }

  // --------- القرار حسب الدومين ثانياً ---------
  if (hostMatchesAnyDomain(host, PUBG_DOMAINS.LOBBY)) {
    if (STRICT_JO_FOR.LOBBY) return requireLobbyMatchPriority("LOBBY", host);
    return proxyForCategory("LOBBY");
  }

  if (hostMatchesAnyDomain(host, PUBG_DOMAINS.MATCH)) {
    if (STRICT_JO_FOR.MATCH) return requireLobbyMatchPriority("MATCH", host);
    return proxyForCategory("MATCH");
  }

  if (hostMatchesAnyDomain(host, PUBG_DOMAINS.RECRUIT_SEARCH)) {
    if (STRICT_JO_FOR.RECRUIT_SEARCH) return requireRecruitPriority(host);
    return proxyForCategory("RECRUIT_SEARCH");
  }

  if (hostMatchesAnyDomain(host, PUBG_DOMAINS.UPDATES)) {
    if (STRICT_JO_FOR.UPDATES) return requireJordanGeneric("UPDATES", host);
    return proxyForCategory("UPDATES");
  }

  if (hostMatchesAnyDomain(host, PUBG_DOMAINS.CDNs)) {
    if (STRICT_JO_FOR.CDNs) return requireJordanGeneric("CDNs", host);
    return proxyForCategory("CDNs");
  }

  // --------- فحص مباشرة عبر الـIP ---------
  // لو الهدف نفسه IP أردني داخل الـ /17 تبعنا -> عاللوبي بورت
  var dst = /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS);
  if (dst && ipInRangeList(dst, LOBBY_MATCH_PRIORITY)) {
    return proxyForCategory("LOBBY");
  }
  if (dst && ipInRangeList(dst, RECRUIT_PRIORITY)) {
    return proxyForCategory("RECRUIT_SEARCH");
  }
  if (dst && ipInJordan(dst)) {
    return proxyForCategory("UPDATES");
  }

  // أي إشي برا الشروط؟ بلوك (أو DIRECT لو شلت FORBID_NON_JO)
  return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
}
