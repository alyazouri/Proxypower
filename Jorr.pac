function FindProxyForURL(url, host) {
  // ==============================
  // CONFIG
  // ==============================
  var JO_PROXY_HOST = "127.0.0.1"; // ← عدّلها لعنوان بروكسي الأردن
  var PORT_LOBBY          = 10010; // نختار بورت ثابت لكل فئة لتقليل jitter
  var PORT_MATCH          = 20001;
  var PORT_RECRUIT_SEARCH = 12000;
  var PORT_UPDATES        = 8080;
  var PORT_CDN            = 443;

  // نمط العمل:
  // SMART = يمرّر المحلي الأردني DIRECT ويستخدم البروكسي فقط لغير الأردني
  // AGGRESSIVE = يمرّر كل فئات PUBG عبر البروكسي دائماً
  var MODE = "SMART"; // "SMART" أو "AGGRESSIVE"

  // Sticky window (تقليل تبديل المسارات)
  var STICKY_MINUTES = 10;

  // ==============================
  // نطاقات IPv4 الأردنية (ترتيب حسب طلبك: Zain/Umniah/Batelco/GO/Mada ثم Orange بالآخر)
  // ==============================
  var JO_IP_RANGES = [
    "95.172.192.0/18"
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

  // YouTube استثناء (DIRECT)
  var YOUTUBE_DOMAINS = ["youtube.com","youtu.be","googlevideo.com","ytimg.com","youtube-nocookie.com"];

  // ==============================
  // HELPERS
  // ==============================
  function proxyLine(port){ return "SOCKS5 " + JO_PROXY_HOST + ":" + port; }

  function matchDomain(host, list) {
    for (var i=0;i<list.length;i++){
      var pat = list[i];
      if (pat.indexOf("*") >= 0) { if (shExpMatch(host, pat)) return true; }
      else { if (dnsDomainIs(host, pat)) return true; }
    }
    return false;
  }
  function matchURL(url, patterns) {
    for (var i=0;i<patterns.length;i++){ if (shExpMatch(url, patterns[i])) return true; }
    return false;
  }
  function inCategory(cat) { return matchDomain(host, PUBG_DOMAINS[cat]) || matchURL(url, URL_PATTERNS[cat]); }

  // IPv4 helpers
  function ipToLong(ip){var p=ip.split('.');return (parseInt(p[0])<<24)+(parseInt(p[1])<<16)+(parseInt(p[2])<<8)+parseInt(p[3]);}
  function inCidr(ip,cidr){var parts=cidr.split("/");var base=ipToLong(parts[0]);var mask=~(Math.pow(2,(32-parseInt(parts[1])))-1);return (ipToLong(ip)&mask)===(base&mask);}
  function isJordanIPv4(ip){if(!ip||ip.indexOf(".")<0)return false;for(var i=0;i<JO_IP_RANGES.length;i++){if(inCidr(ip,JO_IP_RANGES[i]))return true;}return false;}

  // ==============================
  // ROUTING LOGIC
  // ==============================

  // 0) YouTube → DIRECT
  if (matchDomain(host, YOUTUBE_DOMAINS)) return "DIRECT";

  var destIP = dnsResolve(host);
  var myIP   = myIpAddress();

  // 1) SMART MODE: إذا جهازك على IP أردني أو الوجهة أردنية → DIRECT
  if (MODE === "SMART") {
    if ((myIP && isJordanIPv4(myIP)) || (destIP && isJordanIPv4(destIP))) {
      // PUBG فئات: نخليها DIRECT لما تكون الوجهة/المصدر أردني لتقليل القفزات
      if (inCategory("LOBBY") || inCategory("MATCH") || inCategory("RECRUIT_SEARCH")) {
        return "DIRECT";
      }
      // التنزيلات والـCDNs دائمًا DIRECT
      if (inCategory("UPDATES") || inCategory("CDNs")) return "DIRECT";
    }
  }

  // 2) PUBG عبر البروكسي (AGGRESSIVE أو حالة الوجهة غير أردنية)
  if (inCategory("LOBBY"))          return proxyLine(PORT_LOBBY);
  if (inCategory("MATCH"))          return proxyLine(PORT_MATCH);
  if (inCategory("RECRUIT_SEARCH")) return proxyLine(PORT_RECRUIT_SEARCH);

  // 3) UPDATES/CDNs → DIRECT دائماً لتخفيف الحمل
  if (inCategory("UPDATES") || inCategory("CDNs")) return "DIRECT";

  // 4) لو الوجهة أردنية وباقي الترافيك → DIRECT
  if (destIP && isJordanIPv4(destIP)) return "DIRECT";

  // 5) الباقي عبر بورت اللوبي
  return proxyLine(PORT_LOBBY);
}
