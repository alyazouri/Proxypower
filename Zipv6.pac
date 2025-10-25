// jo_pubg_ipv6_lock_all_providers.pac
// الإصدار: v7 (ALL ISPs ACTIVE)
// السياسة:
// - أي ترافيك PUBG لازم يكون سيرفره IPv6 أردني (أي مزود: Orange / Zain / Umniah / GO)
// - لو أردني -> PROXY_JO
// - لو مش أردني -> BLOCK_FAKE
// - الباقي DIRECT

function FindProxyForURL(url, host) {

  // -------- CONFIG --------
  var PROXY_JO   = "PROXY 91.106.109.12:1080"; // بروكسي الأردن
  var BLOCK_FAKE = "PROXY 0.0.0.0:0";          // بلوك (ممنوع يدخل قيم مش أردنية)
  var DIRECT     = "DIRECT";

  // بورتات PUBG
  var PORTS = {
    LOBBY:          [443, 8080, 8443],
    TEAM:           [8013, 9000, 10000],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    MATCH:          [20001, 20002, 20003],
    UPDATES:        [80, 443, 8080, 8443]
  };

  // دومينات ما بنقرب عليها
  var DIRECT_DOMAINS = [
    ".youtube.com", ".googlevideo.com", ".ytimg.com", ".yt3.ggpht.com", ".ytimg.l.google.com",
    ".shahid.net", ".shahid.mbc.net", ".mbc.net",
    ".whatsapp.com", ".whatsapp.net", ".cdn.whatsapp.net",
    ".snapchat.com", ".sc-cdn.net", ".snapkit.com"
  ];

  // -------- IPv6 Jordan Ranges --------
  // من جهتين:
  // 1) ranges ضيقة (FTTH residential segments) اللي شفناها فعلياً بالحيّز السكني
  // 2) ranges واسعة لمزود كامل (fallback) عشان ما يفلت سيرفر أردني جديد بس لأنه من subnet ما أضفناه
  //
  // IMPORTANT:
  // كل رينج بصيغة [from, to]
  //
  var JO_V6_RANGES = [

    // ---- (A) تغطية عامة واسعة لكل ISP أردني معروف ----
    // Orange Jordan (AS8697) كتلة عامة
    ["2a00:18d8::",   "2a00:18d8:ffff:ffff:ffff:ffff:ffff:ffff"],
    // Zain Jordan
    ["2a03:6b00::",   "2a03:6b00:ffff:ffff:ffff:ffff:ffff:ffff"],
    ["2a03:6b02::",   "2a03:6b02:ffff:ffff:ffff:ffff:ffff:ffff"],
    // Umniah
    ["2a03:b640::",   "2a03:b640:ffff:ffff:ffff:ffff:ffff:ffff"],
    // GO / JDC
    ["2a01:9700::",   "2a01:9700:ffff:ffff:ffff:ffff:ffff:ffff"],

    // ---- (B) FTTH segments ضيقة (Orange) ----
    ["2a00:18d8:0040::", "2a00:18d8:004f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0050::", "2a00:18d8:005f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0060::", "2a00:18d8:006f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0070::", "2a00:18d8:007f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0080::", "2a00:18d8:008f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0090::", "2a00:18d8:009f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:00c0::", "2a00:18d8:00cf:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:00d0::", "2a00:18d8:00df:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:00e0::", "2a00:18d8:00ef:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:00f0::", "2a00:18d8:00ff:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0100::", "2a00:18d8:010f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0110::", "2a00:18d8:011f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0120::", "2a00:18d8:012f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0130::", "2a00:18d8:013f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0140::", "2a00:18d8:014f:ffff:ffff:ffff:ffff:ffff"],
    ["2a00:18d8:0150::", "2a00:18d8:015f:ffff:ffff:ffff:ffff:ffff"],

    // ---- (C) FTTH segments لضبط زين (2000..201f) ----
    ["2a03:6b02:2000::", "2a03:6b02:201f:ffff:ffff:ffff:ffff:ffff"],

    // ---- (D) FTTH segments من GO / JDC ----
    ["2a01:9700:3420::", "2a01:9700:342f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3430::", "2a01:9700:343f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3440::", "2a01:9700:344f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3450::", "2a01:9700:345f:ffff:ffff:ffff:ffff:ffff"],

    ["2a01:9700:3520::", "2a01:9700:352f:ffff:ffff:ffff:ffff:ffff"],

    ["2a01:9700:3820::", "2a01:9700:382f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3830::", "2a01:9700:383f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3840::", "2a01:9700:384f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3850::", "2a01:9700:385f:ffff:ffff:ffff:ffff:ffff"],

    ["2a01:9700:3c80::", "2a01:9700:3c8f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3c90::", "2a01:9700:3c9f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3ca0::", "2a01:9700:3caf:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:3cb0::", "2a01:9700:3cbf:ffff:ffff:ffff:ffff:ffff"],

    ["2a01:9700:4000::", "2a01:9700:400f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:4010::", "2a01:9700:401f:ffff:ffff:ffff:ffff:ffff"],

    ["2a01:9700:4100::", "2a01:9700:410f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:4110::", "2a01:9700:411f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:4120::", "2a01:9700:412f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:4130::", "2a01:9700:413f:ffff:ffff:ffff:ffff:ffff"],

    ["2a01:9700:4200::", "2a01:9700:420f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:4210::", "2a01:9700:421f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:4220::", "2a01:9700:422f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:4230::", "2a01:9700:423f:ffff:ffff:ffff:ffff:ffff"],

    ["2a01:9700:42e0::", "2a01:9700:42ef:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:42f0::", "2a01:9700:42ff:ffff:ffff:ffff:ffff:ffff"],

    ["2a01:9700:4800::", "2a01:9700:480f:ffff:ffff:ffff:ffff:ffff"],
    ["2a01:9700:4810::", "2a01:9700:481f:ffff:ffff:ffff:ffff:ffff"]
  ];

  // -------- HELPERS --------

  function hostMatches(list, h) {
    if (!h) return false;
    h = h.toLowerCase();
    for (var i = 0; i < list.length; i++) {
      var suf = list[i].toLowerCase();
      if (h === suf.slice(1) || h.endsWith(suf)) {
        return true;
      }
    }
    return false;
  }

  function extractPort(u) {
    var m = u.match(/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\/\[?[^\/\]]+\]?:(\d+)/);
    if (m && m[1]) return parseInt(m[1], 10);
    if (u.indexOf("https://") === 0) return 443;
    if (u.indexOf("http://")  === 0) return 80;
    return -1;
  }

  // نجمع كل IPv6 المحتملة للسيرفر (مش بس أول وحدة)
  function gatherIPv6Candidates(url, host) {
    var candidates = [];

    // 1) لو host أصلاً IPv6 literal
    if (host.indexOf(":") !== -1 && host.indexOf(".") === -1) {
      candidates.push(host.replace(/^\[|\]$/g, ""));
    }

    // 2) IPv6 داخل أقواس في ال URL
    var m6 = url.match(/\[([0-9a-fA-F:]+)\]/);
    if (m6 && m6[1]) {
      candidates.push(m6[1]);
    }

    // 3) dnsResolveEx (لو مدعوم بهالبيئة)
    if (typeof dnsResolveEx === "function") {
      try {
        var res = dnsResolveEx(host);
        if (res) {
          var parts = res.split(/[\s,;]+/);
          for (var i = 0; i < parts.length; i++) {
            var p = parts[i].trim();
            if (p && p.indexOf(":") !== -1) {
              candidates.push(p);
            }
          }
        }
      } catch (e) {}
    }

    // 4) dnsResolve fallback: بعض الأنظمة بترجع IPv6 هون، حتى لو غالباً IPv4
    try {
      var r4 = dnsResolve(host);
      if (r4 && r4.indexOf(":") !== -1) {
        candidates.push(r4);
      }
    } catch (e2) {}

    // remove duplicates
    var uniq = [];
    for (var j = 0; j < candidates.length; j++) {
      var c = candidates[j].replace(/^\[|\]$/g, "");
      if (c && uniq.indexOf(c) === -1) {
        uniq.push(c);
      }
    }
    return uniq;
  }

  // IPv6 string -> BigInt للمقارنة
  function ipv6ToBigInt(ip6) {
    if (!ip6) return 0n;
    ip6 = ip6.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
    var parts = ip6.split("::");
    var left = parts[0].length ? parts[0].split(":") : [];
    var right = (parts.length > 1 && parts[1].length) ? parts[1].split(":") : [];
    var fill = 8 - (left.length + right.length);
    var full = [];
    for (var i=0; i<left.length; i++)  full.push(left[i]);
    for (var j=0; j<fill; j++)         full.push("0");
    for (var k=0; k<right.length; k++) full.push(right[k]);
    var num = 0n;
    for (var h=0; h<8; h++) {
      var val = parseInt(full[h] || "0", 16);
      if (isNaN(val)) val = 0;
      num = (num << 16n) + BigInt(val);
    }
    return num;
  }

  // فحص عنوان IPv6 واحد إذا داخل أردن
  function inJordanSingle(ip6) {
    if (!ip6) return false;
    var n = ipv6ToBigInt(ip6);
    for (var i = 0; i < JO_V6_RANGES.length; i++) {
      var fromN = ipv6ToBigInt(JO_V6_RANGES[i][0]);
      var toN   = ipv6ToBigInt(JO_V6_RANGES[i][1]);
      if (n >= fromN && n <= toN) {
        return true;
      }
    }
    return false;
  }

  // فحص كل الـ IPv6 candidates
  function anyJordanIPv6(cands) {
    if (!cands || !cands.length) return false;
    for (var i = 0; i < cands.length; i++) {
      if (cands[i].indexOf(":") === -1) continue; // skip IPv4
      if (inJordanSingle(cands[i])) return true;
    }
    return false;
  }

  // -------- DECISION FLOW --------

  // خدمات خاصة نخليها DIRECT على طول
  if (hostMatches(DIRECT_DOMAINS, host)) {
    return DIRECT;
  }

  var port = extractPort(url);

  // كل IPv6 تبع السيرفر (مو بس أول واحد)
  var ipv6List = gatherIPv6Candidates(url, host);

  // هل أي واحد منهم أردني؟
  var isJordan = anyJordanIPv6(ipv6List);

  // هل الاتصال تابع لـ PUBG؟
  var isLobbyLike =
    PORTS.LOBBY.indexOf(port) !== -1 ||
    PORTS.TEAM.indexOf(port) !== -1 ||
    PORTS.RECRUIT_SEARCH.indexOf(port) !== -1;

  var isMatchLike =
    PORTS.MATCH.indexOf(port) !== -1;

  var isUpdatesLike =
    PORTS.UPDATES.indexOf(port) !== -1;

  var isPubgTraffic = isLobbyLike || isMatchLike || isUpdatesLike;

  if (isPubgTraffic) {
    if (isJordan) {
      // أردني (أي مزود أردني) -> استعمل بروكسي الأردن
      return PROXY_JO;
    } else {
      // مش أردني -> امنعه
      return BLOCK_FAKE;
    }
  }

  // مو PUBG -> اتصال طبيعي
  return DIRECT;
}
