// kr_only_no_direct.pac
// كل الترافيك عبر بروكسيات داخل نطاقات IPv6 كورية (لا يوجد DIRECT إطلاقاً).

// عدّل هذه القائمة بعناوين البروكسيات الحقيقية اللي عندك داخل كل نطاق.
// التنسيق: مخطط SOCKS5 + IPv6 بين أقواس + المنفذ.
// تقدر تكرّر المنافذ أو تغيّرها كما تشاء (1080 مجرد مثال).
var PROXIES = [
  "SOCKS5 [2001:220:8000::1]:1080", // من المثال اللي أعطيتني
  "SOCKS5 [2001:220::1]:1080",
  "SOCKS5 [2001:230::1]:1080",
  "SOCKS5 [2001:220:4000::1]:1080",
  "SOCKS5 [2001:270::1]:1080",
  "SOCKS5 [2001:280::1]:1080",
  "SOCKS5 [2001:290::1]:1080",
  "SOCKS5 [2001:2b0::1]:1080",
  "SOCKS5 [2001:2b8::1]:1080",
  "SOCKS5 [2001:2d8::1]:1080"
];

// إن حبيت تقسّم حركة PUBG تحديداً (للوبي/مباراة...) برضه رح تروح عبر نفس البروكسيات
// لأننا ألغينا DIRECT بالكامل. تركتها كمجموعة جاهزة لو حبيت توسّع لاحقاً.
var PUBG_DOMAINS = [
  "*.pubg.com", "*.kakaogames.com", "*.krafton.com",
  "*.pubgmobile.com", "*.tencent.com", "*.tencentgames.com", "*.proximabeta.com",
  "*.battleye.com", "*.akamaized.net", "*.edgekey.net", "*.edgesuite.net"
];

// helper: هل الهوست يطابق أي نمط من الأنماط؟
function isInDomains(host, patterns) {
  for (var i = 0; i < patterns.length; i++) {
    if (shExpMatch(host, patterns[i])) return true;
  }
  return false;
}

// نرجّع سلسلة البروكسيات بدون أي DIRECT.
// المتصفّحات عادةً تجرّب بالتسلسل؛ إن فشل أول واحد تنتقل للي بعده.
function krProxyChain() {
  return PROXIES.join("; ");
}

function FindProxyForURL(url, host) {
  // 1) إن حاب لاحقاً تخصص PUBG فقط، تقدر تفعل هذا الشرط
  // if (isInDomains(host, PUBG_DOMAINS)) {
  //   return krProxyChain(); // نفس السلسلة
  // }

  // 2) كل شيء عبر كوريا — بلا DIRECT
  return krProxyChain();
}
