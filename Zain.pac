function FindProxyForURL(url, host) {
  // ==============================
  // CONFIG
  // ==============================
  var JO_PROXY_HOST = "127.0.0.1"; // ← عدّلها إلى IP/Hostname للبروكسي الأردني
  var PORTS_LOBBY          = [10010, 10020, 10030, 10040, 10050];
  var PORTS_MATCH          = [20001, 20002, 20003, 20004, 20005];
  var PORTS_RECRUIT_SEARCH = [12000, 12050, 12100, 12150, 12200, 12235];
  var PORTS_UPDATES        = [8080, 8443, 8888];
  var PORTS_CDN            = [443, 8443, 2053];

  // ثبات البورت لتحسين الـping
  var STICKY_MINUTES = 30;

  // نطاقات IPv6 الأردنية (Zain + Umniah)
  var JO_V6_PREFIXES = [
    // Umniah
    "2a03:6b00::/29","2a03:6b00:8000::/33","2a03:6b00:c000::/34",
    // Zain
    "2a03:b640::/32","2a03:b640:8000::/33","2a03:b640:c000::/34"
  ];

  // ==============================
  // PUBG DOMAINS & URL PATTERNS
  // ==============================
  var PUBG_DOMAINS = {
    LOBBY:          ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH:          ["*.gcloud.qq.com","gpubgm.com"],
    RECRUIT_SEARCH: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    UPDATES:        ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
    CDNs:           ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };

  var URL_PATTERNS = {
    LOBBY:          ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH:          ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES:        ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
    CDNs:           ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  // ==============================
  // HELPERS
  // ==============================
  function stableHash(s) {
    var h = 2166136261;
    for (var i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h += (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24); }
    return (h>>>0);
  }
  function nowBucket() {
    var d = new Date();
    return Math.floor(d.getTime()/60000 / STICKY_MINUTES);
  }
  function pickStickyPort(name, ports) {
    var seed = stableHash(name + ":" + nowBucket());
    return ports[seed % ports.length];
  }
  function proxyLine(host, ports) {
    var p = pickStickyPort(host, ports);
    return "SOCKS5 " + JO_PROXY_HOST + ":" + p;
  }
  function matchDomain(host, list) {
    for (var i=0;i<list.length;i++){
      var pat = list[i];
      if (pat.indexOf("*") >= 0) { if (shExpMatch(host, pat)) return true; }
      else { if (dnsDomainIs(host, pat)) return true; }
    }
    return false;
  }
  function matchURL(url, patterns) {
    for (var i=0;i<patterns.length;i++){
      if (shExpMatch(url, patterns[i])) return true;
    }
    return false;
  }
  function inCategory(cat) {
    return matchDomain(host, PUBG_DOMAINS[cat]) || matchURL(url, URL_PATTERNS[cat]);
  }

  function expandIPv6(addr) {
    if (addr.indexOf("::") >= 0) {
      var sides = addr.split("::");
      var left  = sides[0] ? sides[0].split(":") : [];
      var right = sides[1] ? sides[1].split(":") : [];
      var missing = 8 - (left.length + right.length);
      var mid = [];
      for (var i=0;i<missing;i++) mid.push("0");
      var full = left.concat(mid, right);
      for (var j=0;j<full.length;j++) full[j] = ("0000" + (full[j]||"0")).slice(-4);
      return full.join(":");
    }
    return addr.split(":").map(function(x){return ("0000"+x).slice(-4);}).join(":");
  }

  function ipv6InCidr(ip, cidr) {
    var pr = cidr.split("/");
    var pref = expandIPv6(pr[0]).replace(/:/g,"").toLowerCase();
    var bits = parseInt(pr[1],10);
    var ipx  = expandIPv6(ip).replace(/:/g,"").toLowerCase();
    var nibbles = Math.floor(bits/4);
    if (ipx.substring(0,nibbles) !== pref.substring(0,nibbles)) return false;
    if (bits % 4 === 0) return true;
    var maskBits = bits % 4;
    var mask = (0xF << (4 - maskBits)) & 0xF;
    var ipNib = parseInt(ipx.charAt(nibbles),16) & mask;
    var pfNib = parseInt(pref.charAt(nibbles),16) & mask;
    return ipNib === pfNib;
  }

  function isJordanIPv6(ip) {
    if (!ip || ip.indexOf(":") < 0) return false;
    for (var i=0;i<JO_V6_PREFIXES.length;i++) {
      if (ipv6InCidr(ip, JO_V6_PREFIXES[i])) return true;
    }
    return false;
  }

  // ==============================
  // ROUTING LOGIC
  // ==============================
  var ip = dnsResolve(host);

  if (inCategory("LOBBY"))          return proxyLine(host, PORTS_LOBBY);
  if (inCategory("MATCH"))          return proxyLine(host, PORTS_MATCH);
  if (inCategory("RECRUIT_SEARCH")) return proxyLine(host, PORTS_RECRUIT_SEARCH);
  if (inCategory("UPDATES"))        return proxyLine(host, PORTS_UPDATES);
  if (inCategory("CDNs"))           return proxyLine(host, PORTS_CDN);

  // إذا العنوان IPv6 أردني (زین أو أمنية) خلّيه DIRECT لتخفيف الحمل المحلي
  if (ip && ip.indexOf(":")>=0 && isJordanIPv6(ip)) {
    return "DIRECT";
  }

  // الباقي كله يمر عبر بورتات اللوبي
  return proxyLine(host, PORTS_LOBBY);
}
