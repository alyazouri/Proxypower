// ===================================================
// jo_pubg_ipv6_lock_balanced.pac
// الإصدار: v6.3 balanced
// ===================================================
// السياسة:
// - أي اتصال PUBG (LOBBY / TEAM / RECRUIT / MATCH / UPDATES)
//   لازم يكون السيرفر IPv6 جوّا رينج أردني فايبر حقيقي.
//   أردني؟ -> PROXY الأردن
//   مش أردني؟ -> BLOCK_FAKE (يمنع الدخول)
// - باقي الخدمات -> DIRECT
// ===================================================

function FindProxyForURL(url, host) {

  // -------- CONFIG --------
  var PROXY_JO   = "PROXY 91.106.109.12:1080"; // بروكسي أردني
  var BLOCK_FAKE = "PROXY 0.0.0.0:0";          // بلوك فعلي
  var DIRECT     = "DIRECT";

  // بورتات ببجي
  var PORTS = {
    LOBBY:          [443, 8080, 8443],
    TEAM:           [8013, 9000, 10000],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    MATCH:          [20001, 20002, 20003],
    UPDATES:        [80, 443, 8080, 8443]
  };

  // ترافيك ما منلمسو
  var DIRECT_DOMAINS = [
    ".youtube.com", ".googlevideo.com", ".ytimg.com", ".yt3.ggpht.com", ".ytimg.l.google.com",
    ".shahid.net", ".shahid.mbc.net", ".mbc.net",
    ".whatsapp.com", ".whatsapp.net", ".cdn.whatsapp.net",
    ".snapchat.com", ".sc-cdn.net", ".snapkit.com"
  ];

  // -------- IPv6 Jordan Ranges (balanced coverage) --------
  // ملاحظة: كل عنصر هو [from, to]
  // Orange Jordan: عدة /44 segments داخل 2a00:18d8::
  // Zain Jordan:   كتلة متتابعة 2000..201f تحت 2a03:6b02::
  // GO (JDC):      عائلات رئيسية مستخدمة فعلياً لخطوط فايبر سكنية
  var JO_V6_RANGES = [
    ["2a03:6b02:2000::", "2a03:6b02:201f:ffff:ffff:ffff:ffff:ffff"],
    // ----- Orange Jordan (/44 chunks) -----
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

    // ----- Zain Jordan -----
    

    // ----- GO / JDC -----
    // رينجات سكنية مكررة على خطوط فايبر من عائلات 342x/343x/344x/345x و 3c8x و 400x و 410x و 420x و 42ex و 480x
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

  // نفس فكرة dnsResolveEx: بعض أنظمة PAC (Chrome/Win/macOS) ممكن ترجع IPv6
  // إحنا نحاول:
  // - إذا host شكله IPv6 literal => خذه
  // - إذا URL فيه [IPv6] => خذه
  // - وإلا جرّب dnsResolveEx (لو مدعوم)، ولو مش موجود ممكن يرجع undefined عادي
  function pickIPv6(url, host) {
    if (host.indexOf(":") !== -1 && host.indexOf(".") === -1) {
      return host;
    }
    var m6 = url.match(/\[([0-9a-fA-F:]+)\]/);
    if (m6 && m6[1]) return m6[1];

    // بعض بيئات PAC تدعم dnsResolveEx (ipv6-aware). لو مش مدعوم، رح يرجع undefined.
    if (typeof dnsResolveEx === "function") {
      var r = dnsResolveEx(host);
      if (r && r.indexOf(":") !== -1) {
        return r;
      }
    }

    // fallback (dnsResolve غالباً يرجع IPv4 فقط، بس ما يضر نحاول)
    // لو رجع IPv4 فقط ما بهمنا، بنعاملها كأنه ما في IPv6
    return null;
  }

  // نحول IPv6 -> BigInt عشان نقدر نقارنه ضمن [from,to]
  function ipv6ToBigInt(ip6) {
    if (!ip6) return 0n;
    // شيل [] لو موجودين
    ip6 = ip6.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();

    // split "::"
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

  function isIPv6InJordan(ip6) {
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

  // -------- DECISION FLOW --------

  // 0) خدمات معيّنة نخليها DIRECT دايم
  if (hostMatches(DIRECT_DOMAINS, host)) {
    return DIRECT;
  }

  // 1) جبنا البورت
  var port = extractPort(url);

  // 2) جبنا IPv6 للسيرفر
  var ip6 = pickIPv6(url, host);

  // 3) فحص: هل هذا السيرفر أردني فعلي (داخل رينجات فايبر الأردن)
  var isJordan = isIPv6InJordan(ip6);

  // 4) هل الاتصال يخص ببجي؟
  var isLobbyLike =
    PORTS.LOBBY.indexOf(port) !== -1 ||
    PORTS.TEAM.indexOf(port) !== -1 ||
    PORTS.RECRUIT_SEARCH.indexOf(port) !== -1;

  var isMatchLike =
    PORTS.MATCH.indexOf(port) !== -1;

  var isUpdatesLike =
    PORTS.UPDATES.indexOf(port) !== -1;

  var isPubgTraffic = (
    isLobbyLike || isMatchLike || isUpdatesLike
  );

  // 5) منطق السماح / المنع
  if (isPubgTraffic) {
    if (isJordan) {
      // سيرفر أردني IPv6 → اسمح ومرره عبر البروكسي الأردني
      return PROXY_JO;
    } else {
      // مش أردني → لا تلعب هناك
      return BLOCK_FAKE;
    }
  }

  // 6) أي شيء ثاني بالعالم
  return DIRECT;
}
