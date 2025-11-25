/**** PAC: System-Wide JO Proxy — NO-DIRECT Except GitHub + PUBG (v11) ****/
/* - لا يوجد DIRECT نهائياً إلا لمنصة GitHub وتوابعها فقط.
   - كل الترافيك الآخر (PUBG + غيره) يمر عبر بروكسي أردني واحد.
   - ترافيك PUBG يختار بورت حسب الفئة (LOBBY, MATCH, RECRUIT, UPDATES, CDNs) مع أوزان.
*/

/* === إعدادات البروكسي (غيّر هنا فقط) === */
var PROXY_HOST         = "91.106.109.12"; // ← عدّل IP إذا حاب
var PROXY_PORT_DEFAULT = 443;            // البورت الافتراضي لو مش PUBG

function makeProxy(port) {
  return "PROXY " + PROXY_HOST + ":" + port;
}

/* === دوال PAC المساعدة === */
function isPlainHostName(host){ return (host && host.indexOf('.') == -1); }
function dnsDomainIs(host, domain){
  return (host.length >= domain.length &&
          host.substring(host.length - domain.length) == domain);
}
function sh(s,p){ return shExpMatch(s,p); }

/* === استثناء GitHub فقط (DIRECT) === */
var GITHUB_EXCLUDE = [
  "github.com","*.github.com",
  "githubusercontent.com","*.githubusercontent.com",
  "githubassets.com","*.githubassets.com",
  "github.io","*.github.io",
  "raw.githubusercontent.com",
  "gist.github.com"
];

function hostMatchesAny(host, patterns) {
  if (!patterns) return false;
  for (var i = 0; i < patterns.length; i++) {
    if (sh(host, patterns[i])) return true;
  }
  return false;
}

/* === تعريفات PUBG === */

var PORTS = {
  LOBBY:           [443, 8443],
  MATCH:           [20001, 20003],
  RECRUIT_SEARCH:  [10012, 10013],
  UPDATES:         [80, 443, 8443],
  CDNs:            [80, 443]
};

var PORT_WEIGHTS = {
  LOBBY:           [5, 3],
  MATCH:           [3, 2],
  RECRUIT_SEARCH:  [3, 2],
  UPDATES:         [5, 3, 2],
  CDNs:            [3, 2]
};

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

function urlMatchesAny(url, patterns) {
  if (!patterns) return false;
  for (var i = 0; i < patterns.length; i++) {
    if (sh(url, patterns[i])) return true;
  }
  return false;
}

/* تعرف نوع ترافيك PUBG إن وجد */
function detectPUBGCategory(url, host) {
  // 1) حسب الدومين
  for (var cat in PUBG_DOMAINS) {
    if (PUBG_DOMAINS.hasOwnProperty(cat)) {
      if (hostMatchesAny(host, PUBG_DOMAINS[cat])) return cat;
    }
  }

  // 2) حسب URL patterns
  for (var cat2 in URL_PATTERNS) {
    if (URL_PATTERNS.hasOwnProperty(cat2)) {
      if (urlMatchesAny(url, URL_PATTERNS[cat2])) return cat2;
    }
  }

  return null;
}

/* اختيار بورت موزون للفئة */
function chooseWeightedPort(category) {
  if (!category || !PORTS[category] || !PORT_WEIGHTS[category]) {
    return PROXY_PORT_DEFAULT;
  }
  var ports   = PORTS[category];
  var weights = PORT_WEIGHTS[category];

  var total = 0;
  for (var i = 0; i < weights.length; i++) total += weights[i];

  var r = Math.floor(Math.random() * total);
  var acc = 0;
  for (var j = 0; j < weights.length; j++) {
    acc += weights[j];
    if (r < acc) {
      return ports[j];
    }
  }
  return PROXY_PORT_DEFAULT;
}

/* === القرار النهائي === */
function FindProxyForURL(url, host){
  host = host || "";
  host = host.toLowerCase();

  // 1) GitHub + توابعها → DIRECT فقط
  if (hostMatchesAny(host, GITHUB_EXCLUDE)) {
    return "DIRECT";
  }

  // 2) PUBG: لو الترافيك PUBG اختَر بورت حسب الفئة
  var category = detectPUBGCategory(url, host);
  if (category) {
    var port = chooseWeightedPort(category);
    return makeProxy(port);
  }

  // 3) أي شيء آخر → البروكسي الأردني على البورت الافتراضي
  return makeProxy(PROXY_PORT_DEFAULT);
}
