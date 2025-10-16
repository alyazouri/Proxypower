// ======================================================================
// PAC — Force Proxy for Jordan ranges + Popular Player/Game domains
// No DIRECT anywhere. Update the proxy chain as needed.
// ======================================================================

function FindProxyForURL(url, host) {
  var FORCE_PROXY = "PROXY 91.106.109.12:20001; PROXY 91.106.109.12:443";

  // ------------------------ Helpers ------------------------
  function ipToInt(ip) {
    var p = ip.split('.');
    if (p.length !== 4) return 0;
    return ((parseInt(p[0],10) << 24) >>> 0)
         + ((parseInt(p[1],10) << 16) >>> 0)
         + ((parseInt(p[2],10) << 8) >>> 0)
         + (parseInt(p[3],10) >>> 0);
  }
  function parseCIDR(cidr) {
    var parts = cidr.split('/');
    var net = parts[0];
    var prefix = parseInt(parts[1],10);
    var netInt = ipToInt(net);
    var mask = prefix === 0 ? 0 : (((0xFFFFFFFF << (32 - prefix)) >>> 0));
    return { netInt: netInt, mask: mask };
  }
  function cidrContains(cidrObj, ipInt) {
    return ((cidrObj.netInt & cidrObj.mask) >>> 0) === ((ipInt & cidrObj.mask) >>> 0);
  }
  function hostToIPMaybe(h) {
    if (/^(?:\\d{1,3}\\.){3}\\d{1,3}$/.test(h)) return h;
    try { var r = dnsResolve(h); if (r) return r; } catch(e){}
    return null;
  }
  function isInAnyCIDR(ip, cidrList) {
    if (!ip) return false;
    var ipInt = ipToInt(ip);
    for (var i = 0; i < cidrList.length; i++) {
      if (cidrContains(cidrList[i], ipInt)) return true;
    }
    return false;
  }
  function isInAnyNetByIsInNet(h, nets) {
    for (var i = 0; i < nets.length; i++) {
      var n = nets[i];
      try { if (isInNet(h, n[0], n[1])) return true; } catch(e){}
    }
    return false;
  }
  function matchDomains(h, list) {
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (dnsDomainIs(h, d) || shExpMatch(h, "*." + d)) return true;
    }
    return false;
  }

  // ------------------------ Jordan ranges (as before) ------------------------
  var JO_CIDR_STR = [
    "2.17.24.0/22",
    "37.17.192.0/20","37.44.32.0/21","37.75.144.0/21","37.123.64.0/19",
    "37.152.0.0/21","37.202.64.0/18","37.220.112.0/20","37.252.222.0/24",
    "46.23.112.0/20","46.32.96.0/19","46.185.128.0/17","46.248.192.0/19",
    "62.72.160.0/19",
    "77.245.0.0/20",
    "79.134.128.0/19","79.173.192.0/18",
    "80.90.160.0/19",
    "81.21.0.0/20","81.28.112.0/20",
    "82.212.64.0/18",
    "84.18.32.0/19","84.18.64.0/19",
    "86.108.0.0/17",
    "91.106.96.0/19","91.106.100.0/22","91.106.104.0/21","91.186.224.0/19",
    "92.241.32.0/19","92.253.0.0/17",
    "94.142.32.0/19","94.249.0.0/17",
    "95.141.208.0/20","95.172.192.0/19",
    "109.107.0.0/16","109.107.224.0/19","109.237.192.0/20",
    "149.200.128.0/17",
    "176.28.128.0/17","176.29.0.0/16","176.57.0.0/19",
    "185.96.70.0/24","185.140.0.0/16","185.142.226.0/24",
    "212.35.0.0/16","212.35.64.0/19","212.118.0.0/19","212.118.64.0/19"
  ];
  var JO_24_NETS = [
    ["91.106.109.0","255.255.255.0"],
    ["91.106.110.0","255.255.255.0"],
    ["91.186.224.0","255.255.255.0"],
    ["109.107.240.0","255.255.255.0"],
    ["109.107.241.0","255.255.255.0"],
    ["176.29.250.0","255.255.255.0"],
    ["176.28.252.0","255.255.255.0"],
    ["176.28.179.0","255.255.255.0"],
    ["176.28.184.0","255.255.255.0"],
    ["176.28.221.0","255.255.255.0"],
    ["185.140.10.0","255.255.255.0"],
    ["185.140.12.0","255.255.255.0"],
    ["212.35.64.0","255.255.255.0"],
    ["212.118.16.0","255.255.255.0"]
  ];
  var JO_32_HOSTS = [
    "91.106.109.12",
    "109.107.240.101",
    "212.35.64.1",
    "185.96.70.36",
    "79.173.251.142",
    "185.142.226.12",
    "176.28.250.122",
    "188.247.65.13"
  ];

  // ------------------------ PLAYERS (filled) ------------------------
  // أشهر ألعاب الموبايل/الشبكات: PUBG/Tencent, CODM/Activision, Garena FF, Riot
  var PLAYER_DOMAINS = [
    // PUBG / Krafton / Tencent
    "pubg.com","newstate.pubg.com","pubgmobile.com","igamecj.com",
    "gcloudcs.com","tencent.com","tencentgames.com","proximabeta.com",
    // COD Mobile (Activision; مناطق مختلفة)
    "callofduty.com","activision.com","codm.garena.com",
    // Garena Free Fire
    "garena.com","freefiremobile.com","ff.garena.com",
    // Riot (APIs ومنصات توزيع)
    "riotgames.com","valorant-asia.riotgames.com","valorant.com",
    // منصات شائعة للدعم/تحديثات
    "akamaized.net","edgesuite.net"  // ملاحظة: هذول واسعَين؛ احذفهم لو بدك تضييق
  ];

  // إبقاء CIDR و/24 و/32 للاعبين اختياريًا (تغيّرات CDN كثيرة). أضفت أمثلة صغيرة فقط.
  var PLAYER_CIDR_STR = [
    // مثال نطاق Tencent سنغافورة/هونغ كونغ (ضعيف الاعتمادية—غيّره لو عندك IPs دقيقة)
    // "203.205.128.0/19"
  ];
  var PLAYER_24_NETS = [
    // أمثلة اختيارية:
    // ["203.205.220.0","255.255.255.0"]
  ];
  var PLAYER_32_HOSTS = [
    // ضع IPs ثابتة لو عندك سيرفرات خاصة/خاصة ببطولاتك
    // "203.205.219.10"
  ];

  // ------------------------ Merge ------------------------
  var JO_AND_PLAYERS_DOMAINS = PLAYER_DOMAINS; // تُفحَص أولاً (قبل أي IP)
  var JO_AND_PLAYERS_CIDR_STR = JO_CIDR_STR.concat(PLAYER_CIDR_STR);
  var JO_AND_PLAYERS_24_NETS  = JO_24_NETS.concat(PLAYER_24_NETS);
  var JO_AND_PLAYERS_32_HOSTS = JO_32_HOSTS.concat(PLAYER_32_HOSTS);

  var JO_AND_PLAYERS_CIDR = [];
  for (var c = 0; c < JO_AND_PLAYERS_CIDR_STR.length; c++) {
    JO_AND_PLAYERS_CIDR[JO_AND_PLAYERS_CIDR.length] = parseCIDR(JO_AND_PLAYERS_CIDR_STR[c]);
  }

  // ------------------------ Matching Logic ------------------------
  if (isPlainHostName(host)) return FORCE_PROXY;
  if (shExpMatch(host, "localhost")) return FORCE_PROXY;

  // A) Domains (players أولاً)
  if (matchDomains(host, JO_AND_PLAYERS_DOMAINS)) return FORCE_PROXY;

  // B) /32 (JO + players)
  var ip = hostToIPMaybe(host);
  if (ip) {
    for (var h = 0; h < JO_AND_PLAYERS_32_HOSTS.length; h++) {
      if (ip === JO_AND_PLAYERS_32_HOSTS[h]) return FORCE_PROXY;
    }
  }

  // C) CIDR (JO + players)
  if (isInAnyCIDR(ip, JO_AND_PLAYERS_CIDR)) return FORCE_PROXY;

  // D) /24 via isInNet (JO + players) — يعمل حتى لو host اسم وليس IP
  if (isInAnyNetByIsInNet(host, JO_AND_PLAYERS_24_NETS)) return FORCE_PROXY;

  // E) Fallback: كل شيء عبر البروكسي
  return FORCE_PROXY;
}
