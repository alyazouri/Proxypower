function FindProxyForURL(url, host) {
  // ==============================
  // CONFIG
  // ==============================
  var JO_PROXY_HOST = "127.0.0.1"; // ← بدّلها إلى IP/Hostname للبروكسي الأردني
  var PORTS_LOBBY          = [10010, 10020, 10030, 10040, 10050];
  var PORTS_MATCH          = [20001, 20002, 20003, 20004, 20005];
  var PORTS_RECRUIT_SEARCH = [12000, 12050, 12100, 12150, 12200, 12235];
  var PORTS_UPDATES        = [8080, 8443, 8888];
  var PORTS_CDN            = [443, 8443, 2053];
  var STICKY_MINUTES = 30;

  // ==============================
  // IPv4 الأردن (Zain + Umniah + Batelco + GO + Mada + Orange) — Orange آخر شي
  // ==============================
  var JO_IP_RANGES = [
    // === Zain Jordan (AS8376/AS48832) ===
    "109.107.224.0/19",   // زين  [oai_citation:0‡IPinfo](https://ipinfo.io/AS9038?utm_source=chatgpt.com)
    "188.247.64.0/18",    // زين  [oai_citation:1‡IPinfo](https://ipinfo.io/countries/jo?utm_source=chatgpt.com)

    // === Umniah (AS9038) ===
    "95.172.192.0/19",
    "92.241.32.0/19",
    "46.248.192.0/19",
    "77.245.0.0/20",
    "80.90.160.0/20",     // ملاحظة: ضمن مساحة JO ويظهر مع مزودين شركاء أحيانًا  [oai_citation:2‡NirSoft](https://www.nirsoft.net/countryip/jo.html?utm_source=chatgpt.com)

    // === Batelco Jordan (AS9038) ===
    "37.220.112.0/20",
    "91.186.224.0/20",
    "212.35.80.0/20",
    "212.118.14.0/24",    // أمثلة موثّقة لبلكات بتلكو  [oai_citation:3‡NirSoft](https://www.nirsoft.net/countryip/jo.html?utm_source=chatgpt.com)

    // === GO (Jordan Data Communications / go.com.jo) ===
    "37.202.64.0/18",     // يظهر بـ abuse@go.com.jo (GO)  [oai_citation:4‡BGPView](https://bgpview.io/prefix/37.202.64.0/18?utm_source=chatgpt.com)

    // === Mada (Mada Communications / AS47887) ===
    "82.212.64.0/18",     // مدى (AL-HADATHEH… AS47887)  [oai_citation:5‡IPinfo](https://ipinfo.io/AS47887/82.212.115.0/24?utm_source=chatgpt.com)

    // === Orange Jordan (AS8697) — أخّرناه حسب طلبك ===
    "94.249.0.0/16"       // أورنج الأردن  [oai_citation:6‡IPinfo](https://ipinfo.io/AS8697?utm_source=chatgpt.com)
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

  // YouTube استثناء
  var YOUTUBE_DOMAINS = ["youtube.com","youtu.be","googlevideo.com","ytimg.com","youtube-nocookie.com"];

  // ==============================
  // HELPERS
  // ==============================
  function stableHash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}return (h>>>0);}
  function nowBucket(){var d=new Date();return Math.floor(d.getTime()/60000/ STICKY_MINUTES);}
  function pickStickyPort(name,ports){var seed=stableHash(name+":"+nowBucket());return ports[seed%ports.length];}
  function proxyLine(host,ports){var p=pickStickyPort(host,ports);return "SOCKS5 "+JO_PROXY_HOST+":"+p;}
  function matchDomain(host,list){for(var i=0;i<list.length;i++){var pat=list[i];if(pat.indexOf("*")>=0){if(shExpMatch(host,pat))return true;}else{if(dnsDomainIs(host,pat))return true;}}return false;}
  function matchURL(url,patterns){for(var i=0;i<patterns.length;i++){if(shExpMatch(url,patterns[i]))return true;}return false;}
  function inCategory(cat){return matchDomain(host,PUBG_DOMAINS[cat])||matchURL(url,URL_PATTERNS[cat]);}

  // IPv4
  function ipToLong(ip){var p=ip.split('.');return (parseInt(p[0])<<24)+(parseInt(p[1])<<16)+(parseInt(p[2])<<8)+parseInt(p[3]);}
  function inCidr(ip,cidr){var parts=cidr.split("/");var base=ipToLong(parts[0]);var mask=~(Math.pow(2,(32-parseInt(parts[1])))-1);return (ipToLong(ip)&mask)===(base&mask);}
  function isJordanIPv4(ip){if(!ip||ip.indexOf(".")<0)return false;for(var i=0;i<JO_IP_RANGES.length;i++){if(inCidr(ip,JO_IP_RANGES[i]))return true;}return false;}

  // ==============================
  // ROUTING LOGIC
  // ==============================
  var ip=dnsResolve(host);

  // YouTube → DIRECT
  if (matchDomain(host, YOUTUBE_DOMAINS)) return "DIRECT";

  // PUBG → عبر البروكسي الأردني حسب الفئة
  if (inCategory("LOBBY"))          return proxyLine(host, PORTS_LOBBY);
  if (inCategory("MATCH"))          return proxyLine(host, PORTS_MATCH);
  if (inCategory("RECRUIT_SEARCH")) return proxyLine(host, PORTS_RECRUIT_SEARCH);
  if (inCategory("UPDATES"))        return proxyLine(host, PORTS_UPDATES);
  if (inCategory("CDNs"))           return proxyLine(host, PORTS_CDN);

  // أي IP أردني محلي → DIRECT لتخفيف الحمل
  if (ip && isJordanIPv4(ip)) return "DIRECT";

  // الباقي عبر بورتات اللوبي
  return proxyLine(host, PORTS_LOBBY);
}
