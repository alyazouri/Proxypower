function FindProxyForURL(url, host) {
  var PROXY_HOST = "91.106.109.12";

  var PORTS = {
    LOBBY: [443, 8080, 8443],
    MATCH: [20001, 20002, 20003],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    UPDATES: [80, 443, 8443, 8080],
    CDNs: [80, 8080, 443]
  };

  var PORT_WEIGHTS = {
    LOBBY: [5, 3, 2],
    MATCH: [4, 2, 1],
    RECRUIT_SEARCH: [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
    UPDATES: [5, 3, 2, 1],
    CDNs: [3, 2, 2]
  };

  var JO_IPV6_CIDRS = [
    "2a00:18d8::/45"
  ];

  var PREFERRED_V6_RANGE_MATCH = "2a03:6b01::/34";

  var STRICT_JO_FOR = { LOBBY: true, MATCH: true, RECRUIT_SEARCH: true };
  var FORBID_NON_JO = true;
  var BLOCK_REPLY = "PROXY 0.0.0.0:0";
  var STICKY_SALT = "JO_STICKY";
  var STICKY_TTL_MINUTES = 30;
  var JITTER_WINDOW = 3;

  var HOST_RESOLVE_TTL_MS = 60 * 1000;
  var DST_RESOLVE_TTL_MS = 30 * 1000;

  var PUBG_DOMAINS = {
    LOBBY: ["*.pubgmobile.com", "*.pubgmobile.net", "*.proximabeta.com", "*.igamecj.com"],
    MATCH: ["*.gcloud.qq.com", "gpubgm.com"],
    RECRUIT_SEARCH: ["match.igamecj.com", "match.proximabeta.com", "teamfinder.igamecj.com", "teamfinder.proximabeta.com"],
    UPDATES: ["cdn.pubgmobile.com", "updates.pubgmobile.com", "patch.igamecj.com", "hotfix.proximabeta.com", "dlied1.qq.com", "dlied2.qq.com", "gpubgm.com"],
    CDNs: ["cdn.igamecj.com", "cdn.proximabeta.com", "cdn.tencentgames.com", "*.qcloudcdn.com", "*.cloudfront.net", "*.edgesuite.net"]
  };

  var URL_PATTERNS = {
    LOBBY: ["*/account/login*", "*/client/version*", "*/status/heartbeat*", "*/presence/*", "*/friends/*"],
    MATCH: ["*/matchmaking/*", "*/mms/*", "*/game/start*", "*/game/join*", "*/report/battle*"],
    RECRUIT_SEARCH: ["*/teamfinder/*", "*/clan/*", "*/social/*", "*/search/*", "*/recruit/*"],
    UPDATES: ["*/patch*", "*/hotfix*", "*/update*", "*/download*", "*/assets/*", "*/assetbundle*", "*/obb*"],
    CDNs: ["*/cdn/*", "*/static/*", "*/image/*", "*/media/*", "*/video/*", "*/res/*", "*/pkg/*"]
  };

  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};
  var now = new Date().getTime();

  function has(fn){ try { return typeof this[fn] === "function"; } catch(e){ return false; } }
  function splitList(s){ return (s||"").replace(/\s+/g,"").split(/[\,\;]+/).filter(Boolean); }
  function isIPv6(ip){ return ip && ip.indexOf(":") !== -1; }

  function resolveV6List(h) {
    if (!h) return [];
    if (/^[0-9a-fA-F:\[\]]+$/.test(h)) return [h.replace(/^\[|\]$/g,"")];
    if (has("dnsResolveEx")) {
      var lst = splitList(dnsResolveEx(h));
      var out = []; for (var i=0;i<lst.length;i++) if (isIPv6(lst[i])) out.push(lst[i]);
      return out;
    }
    return [];
  }

  function resolveDstCachedV6(h, ttl) {
    if (!h) return "";
    var c = CACHE.DST_RESOLVE_CACHE[h];
    if (c && (now - c.t) < ttl) return c.ipv6 || "";
    var lst = resolveV6List(h);
    var ip = lst.length ? lst[0] : "";
    CACHE.DST_RESOLVE_CACHE[h] = { ipv6: ip, t: now };
    return ip;
  }

  function isInAnyCIDR(ip, cidrList, preferCIDR) {
    if (!ip || !isIPv6(ip)) return false;
    if (preferCIDR && has("isInNetEx") && isInNetEx(ip, preferCIDR)) return true;
    if (has("isInNetEx")) { for (var i=0;i<cidrList.length;i++) if (isInNetEx(ip, cidrList[i])) return true; }
    return false;
  }

  function pathMatches(u, list){ for (var i=0;i<list.length;i++) if (shExpMatch(u,list[i])) return true; return false; }
  function hostMatches(h, list){
    for (var i=0;i<list.length;i++){
      if (shExpMatch(h, list[i])) return true;
      var p = list[i].replace(/^\*\./, ".");
      if (h.slice(-p.length) === p) return true;
    }
    return false;
  }

  function weightedPick(ports, weights) {
    var sum = 0; for (var i=0;i<weights.length;i++) sum += (weights[i] || 1);
    var jitter = (JITTER_WINDOW>0) ? Math.floor(Math.random()*JITTER_WINDOW) : 0;
    var r = Math.floor(Math.random()*(sum+jitter)) + 1, acc = 0;
    for (var k=0;k<ports.length;k++){ acc += (weights[k] || 1); if (r <= acc) return ports[k]; }
    return ports[0];
  }

  function proxyFor(category) {
    var key = STICKY_SALT + "_PORT_" + category;
    var ttl = STICKY_TTL_MINUTES * 60 * 1000;
    var e = CACHE._PORT_STICKY[key];
    if (e && (now - e.t) < ttl) return "PROXY " + PROXY_HOST + ":" + e.p;
    var p = weightedPick(PORTS[category], PORT_WEIGHTS[category]);
    CACHE._PORT_STICKY[key] = { p:p, t:now };
    return "PROXY " + PROXY_HOST + ":" + p;
  }

  function requireJordanV6(category, h) {
    var ip6 = resolveDstCachedV6(h, DST_RESOLVE_TTL_MS);
    var prefer = (category === "MATCH") ? PREFERRED_V6_RANGE_MATCH : "";
    if (!ip6 || !isInAnyCIDR(ip6, JO_IPV6_CIDRS, prefer)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    return proxyFor(category);
  }

  var clientOK = (function(){
    var ok = false;
    if (has("myIpAddressEx")) {
      var lst = splitList(myIpAddressEx());
      for (var i=0;i<lst.length;i++){
        var ip = lst[i];
        if (isIPv6(ip) && isInAnyCIDR(ip, JO_IPV6_CIDRS, PREFERRED_V6_RANGE_MATCH)) { ok = true; break; }
      }
    }
    return ok;
  })();

  if (!clientOK) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";

  for (var cat in URL_PATTERNS) if (pathMatches(url, URL_PATTERNS[cat])) return requireJordanV6(cat, host);
  for (var c in PUBG_DOMAINS) if (hostMatches(host, PUBG_DOMAINS[c])) return requireJordanV6(c, host);

  var d6 = resolveDstCachedV6(host, DST_RESOLVE_TTL_MS);
  if (d6 && isInAnyCIDR(d6, JO_IPV6_CIDRS, "")) return proxyFor("LOBBY");

  return "DIRECT";
}
