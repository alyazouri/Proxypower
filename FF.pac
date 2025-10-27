(function () {

  var PROXY_HOST          = "91.106.109.12";
  var PROXY_PORT          = 443;
  var PROXY_ALLOW         = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  var PROXY_DROP          = "PROXY 0.0.0.0:0";

  var DNS_TTL_MS          = 15 * 1000;
  var LOCK_TTL_MS         = 90 * 1000;
  var TIGHT_HEXETS        = 5;           // ضبط التضييق: 4 = /64 شائع، 5+ أضيق
  var USER_OVERRIDE_PREF  = "";          // إذا تريد تجبر بادئة ضعها هنا "2a03:b640:abcd:1234"

  var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);

  if (!ROOT.__JO_ENH__) ROOT.__JO_ENH__ = {};
  var STATE = ROOT.__JO_ENH__;

  if (!STATE.dns)      STATE.dns      = {};
  if (!STATE.lock)     STATE.lock     = { isp: null, score: 0, t: 0 };
  if (!STATE.localPref) STATE.localPref = { pref: null, t: 0 };

  var ISP_V6 = {
    UMNIAH : "2a03:b640",
    ZAIN   : "2a03:6b00",
    ORANGE : "2a00:18d8"
  };

  var JO_V4_BLOCKS = [
    ["109.104.0.0","109.107.255.255"],
    ["176.16.0.0","176.23.255.255"],
    ["94.56.0.0","94.59.255.255"],
    ["94.64.0.0","94.72.255.255"]
  ];

  var CATEGORIES = {
    MATCH: {
      url:  ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
      host: ["*.gcloud.qq.com","gpubgm.com","match.igamecj.com","match.proximabeta.com"]
    },
    RECRUIT: {
      url:  ["*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*"],
      host: ["teamfinder.igamecj.com","teamfinder.proximabeta.com","match.igamecj.com","match.proximabeta.com"]
    },
    LOBBY: {
      url:  ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
      host: ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"]
    },
    UPDATES: {
      url:  ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets*","*/assetbundle*","*/obb*","*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"],
      host: ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
    }
  };

  function dnsCached(host) {
    if (!host) return "";
    var now = (new Date()).getTime();
    var entry = STATE.dns[host];
    if (entry && (now - entry.t) < DNS_TTL_MS) return entry.ip;
    var res = "";
    try { res = dnsResolve(host) || ""; } catch (e) { res = ""; }
    STATE.dns[host] = { ip: res, t: now };
    return res;
  }

  function ip4ToInt(ip) {
    var p = ip.split(".");
    return (((parseInt(p[0])<<24)>>>0) + ((parseInt(p[1])<<16)>>>0) + ((parseInt(p[2])<<8)>>>0) + (parseInt(p[3])>>>0));
  }

  function inJordanV4(ip) {
    if (!ip) return false;
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
    var n = ip4ToInt(ip);
    for (var i = 0; i < JO_V4_BLOCKS.length; i++) {
      var lo = ip4ToInt(JO_V4_BLOCKS[i][0]);
      var hi = ip4ToInt(JO_V4_BLOCKS[i][1]);
      if (n >= lo && n <= hi) return true;
    }
    return false;
  }

  function expandV6(ip) {
    if (!ip) return "";
    if (ip.indexOf(":") === -1) return ip;
    if (ip.indexOf("::") === -1) return ip.toLowerCase();
    var parts = ip.split(":");
    var left = [], right = [], gap = false;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === "") { gap = true; continue; }
      if (!gap) left.push(parts[i]); else right.push(parts[i]);
    }
    var miss = 8 - (left.length + right.length);
    var zeros = [];
    for (var j = 0; j < miss; j++) zeros.push("0");
    return left.concat(zeros).concat(right).join(":").toLowerCase();
  }

  function v6StartsWith(ip, prefix) {
    if (!ip) return false;
    if (ip.indexOf(":") === -1) return false;
    var full = expandV6(ip);
    prefix = prefix.toLowerCase().replace(/:+$/,'');
    return full.indexOf(prefix) === 0;
  }

  function getLocalTightHexets(n) {
    var now = (new Date()).getTime();
    if (USER_OVERRIDE_PREF) {
      if (STATE.localPref.pref !== USER_OVERRIDE_PREF) {
        STATE.localPref = { pref: USER_OVERRIDE_PREF, t: now };
      }
      return USER_OVERRIDE_PREF;
    }
    if (STATE.localPref.pref && (now - STATE.localPref.t) < DNS_TTL_MS) {
      return STATE.localPref.pref;
    }
    var me = "";
    try { me = myIpAddress(); } catch (e) { me = ""; }
    if (!me || me.indexOf(":") === -1) {
      STATE.localPref = { pref: null, t: now };
      return null;
    }
    var low = me.toLowerCase();
    if (low.indexOf("fe80:") === 0 || low.indexOf("fd") === 0) {
      STATE.localPref = { pref: null, t: now };
      return null;
    }
    var full = expandV6(me);
    var parts = full.split(":");
    var take = Math.min(n, parts.length);
    var tight = parts.slice(0, take).join(":");
    STATE.localPref = { pref: tight, t: now };
    return tight;
  }

  function ispClassify(ip) {
    if (!ip) return { isp: null, score: 0, tier: null };
    var tight = getLocalTightHexets(TIGHT_HEXETS);
    if (tight && v6StartsWith(ip, tight)) return { isp: "LOCALPOP", score: 200, tier: "tight" };
    if (ip.indexOf(":") !== -1) {
      if (v6StartsWith(ip, ISP_V6.UMNIAH)) return { isp: "UMNIAH", score: 150, tier: "ispv6" };
      if (v6StartsWith(ip, ISP_V6.ZAIN))   return { isp: "ZAIN",   score: 150, tier: "ispv6" };
      if (v6StartsWith(ip, ISP_V6.ORANGE)) return { isp: "ORANGE", score: 150, tier: "ispv6" };
      return { isp: null, score: 0, tier: null };
    }
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
      if (inJordanV4(ip)) return { isp: "JOV4", score: 80, tier: "v4" };
    }
    return { isp: null, score: 0, tier: null };
  }

  function matchAny(value, arr) {
    if (!value) return false;
    value = value.toLowerCase();
    for (var i = 0; i < arr.length; i++) {
      var p = arr[i];
      if (shExpMatch(value, p)) return true;
      if (p.indexOf("*.") === 0) {
        var suf = p.substring(1);
        if (value.length >= suf.length && value.substring(value.length - suf.length) === suf) return true;
      }
    }
    return false;
  }

  function classifyFlow(url, host) {
    if (matchAny(url, CATEGORIES.MATCH.url) || matchAny(host, CATEGORIES.MATCH.host)) return "MATCH";
    if (matchAny(url, CATEGORIES.RECRUIT.url) || matchAny(host, CATEGORIES.RECRUIT.host)) return "RECRUIT";
    if (matchAny(url, CATEGORIES.LOBBY.url) || matchAny(host, CATEGORIES.LOBBY.host)) return "LOBBY";
    if (matchAny(url, CATEGORIES.UPDATES.url) || matchAny(host, CATEGORIES.UPDATES.host)) return "UPDATES";
    return null;
  }

  function getLock() {
    var now = (new Date()).getTime();
    var L = STATE.lock;
    if (L.isp && (now - L.t) < LOCK_TTL_MS) return L;
    return { isp: null, score: 0, t: 0 };
  }

  function setLock(isp, score) {
    STATE.lock = { isp: isp, score: score, t: (new Date()).getTime() };
  }

  function allowMatch(info) {
    var lock = getLock();
    if (info.score >= 200) {
      if (lock.score >= 200 && lock.isp !== info.isp) return false;
      setLock(info.isp, info.score);
      return true;
    }
    if (info.score >= 150) {
      if (lock.score >= 200) return false;
      if (lock.score >= 150 && lock.isp !== info.isp) return false;
      setLock(info.isp, info.score);
      return true;
    }
    if (info.score >= 80) {
      if (lock.score >= 150) return false;
      if (lock.score >= 80 && lock.isp !== info.isp) return false;
      setLock(info.isp, info.score);
      return true;
    }
    return false;
  }

  function allowRecruit(info) {
    if (info.score >= 150) return true;
    if (info.score >= 80) return true;
    return false;
  }

  function allowLobby(info) {
    if (info.score >= 80) return true;
    return false;
  }

  function allowUpdates(info) {
    if (info.score >= 80) return true;
    return false;
  }

  function policyFor(category, info) {
    if (category === "MATCH") return allowMatch(info);
    if (category === "RECRUIT") return allowRecruit(info);
    if (category === "LOBBY") return allowLobby(info);
    if (category === "UPDATES") return allowUpdates(info);
    return false;
  }

  function FindProxyForURL(url, host) {
    if (host && host.toLowerCase) host = host.toLowerCase();
    var cat = classifyFlow(url, host);
    if (!cat) return PROXY_DROP;
    var dst = dnsCached(host);
    if (!dst) return PROXY_DROP;
    var info = ispClassify(dst);
    if (!policyFor(cat, info)) return PROXY_DROP;
    return PROXY_ALLOW;
  }

  this.FindProxyForURL = FindProxyForURL;

})();
