function FindProxyForURL(url, host) {
  var PROXY_HOST = "91.106.109.12";

  var PORTS = {
    LOBBY          : [443, 8080, 8443],
    MATCH          : [20001, 20002, 20003],
    RECRUIT_SEARCH : [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    UPDATES        : [80, 443, 8443, 8080],
    CDNs           : [80, 8080, 443]
  };

  var PORT_WEIGHTS_BASE = {
    LOBBY          : [5, 3, 2],
    MATCH          : [4, 2, 1],
    RECRUIT_SEARCH : [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
    UPDATES        : [5, 3, 2, 1],
    CDNs           : [3, 2, 2]
  };

  // ==========================================================
  // JO_IP_SUBNETS — نسخة مُنزلَة درجة فعليًا (كل /20 → قسمين /21)
  // كل عنصر في هذه القائمة "فعّال" ويؤثّر على المطابقة
  // ==========================================================
  var JO_IP_SUBNETS = [
    ["212.35.24.0"  , "255.255.248.0"], // Orange – أم أذينة – فايبر (B)
    ["37.202.64.0" , "255.255.248.0"],  // Orange – عمّان – فايبر (A)
    ["37.202.72.0" , "255.255.248.0"],  // Orange – عمّان – فايبر (B)
    ["37.202.80.0" , "255.255.248.0"],  // Orange – إربد – فايبر (A)
    ["37.202.88.0" , "255.255.248.0"],  // Orange – إربد – فايبر (B)
    ["37.202.96.0" , "255.255.248.0"],  // Orange – عمّان الغربية – فايبر (A)
    ["37.202.104.0", "255.255.248.0"],  // Orange – عمّان الغربية – فايبر (B)
    ["37.202.112.0", "255.255.248.0"],  // Orange – السلط – DSL (A)
    ["37.202.120.0", "255.255.248.0"],  // Orange – السلط – DSL (B)

    ["37.220.112.0", "255.255.248.0"],  // Batelco – عمّان – فايبر (A)
    ["37.220.120.0", "255.255.248.0"],  // Batelco – عمّان – فايبر (B)

    ["46.23.112.0" , "255.255.248.0"],  // Umniah – الزرقاء – WiMAX (A)
    ["46.23.120.0" , "255.255.248.0"],  // Umniah – الزرقاء – WiMAX (B)

    ["46.32.96.0"  , "255.255.248.0"],  // Zain – عمّان – فايبر (A)
    ["46.32.104.0" , "255.255.248.0"],  // Zain – عمّان – فايبر (B)
    ["46.32.112.0" , "255.255.248.0"],  // Zain – السلط – فايبر (A)
    ["46.32.120.0" , "255.255.248.0"],  // Zain – السلط – فايبر (B)

    ["46.185.128.0", "255.255.248.0"],  // Orange – عمّان – فايبر (A)
    ["46.185.136.0", "255.255.248.0"],  // Orange – عمّان – فايبر (B)
    ["46.185.144.0", "255.255.248.0"],  // Orange – الزرقاء – فايبر (A)
    ["46.185.152.0", "255.255.248.0"],  // Orange – الزرقاء – فايبر (B)
    ["46.185.160.0", "255.255.248.0"],  // Orange – إربد – فايبر (A)
    ["46.185.168.0", "255.255.248.0"],  // Orange – إربد – فايبر (B)
    ["46.185.176.0", "255.255.248.0"],  // Orange – مادبا – DSL (A)
    ["46.185.184.0", "255.255.248.0"],  // Orange – مادبا – DSL (B)
    ["46.185.192.0", "255.255.248.0"],  // Orange – عمّان الشرقية – DSL (A)
    ["46.185.200.0", "255.255.248.0"],  // Orange – عمّان الشرقية – DSL (B)
    ["46.185.208.0", "255.255.248.0"],  // Orange – الكرك – DSL (A)
    ["46.185.216.0", "255.255.248.0"],  // Orange – الكرك – DSL (B)
    ["46.185.224.0", "255.255.248.0"],  // Orange – جرش – DSL (A)
    ["46.185.232.0", "255.255.248.0"],  // Orange – جرش – DSL (B)
    ["46.185.240.0", "255.255.248.0"],  // Orange – المفرق – DSL (A)
    ["46.185.248.0", "255.255.248.0"],  // Orange – المفرق – DSL (B)

    ["46.248.192.0", "255.255.248.0"],  // Umniah/Batelco – ماركا – WiMAX (A)
    ["46.248.200.0", "255.255.248.0"],  // Umniah/Batelco – ماركا – WiMAX (B)
    ["46.248.208.0", "255.255.248.0"],  // Umniah/Batelco – الزرقاء – 4G (A)
    ["46.248.216.0", "255.255.248.0"],  // Umniah/Batelco – الزرقاء – 4G (B)

    ["79.173.192.0", "255.255.248.0"],  // Orange – عمّان – DSL (A)
    ["79.173.200.0", "255.255.248.0"],  // Orange – عمّان – DSL (B)
    ["79.173.208.0", "255.255.248.0"],  // Orange – إربد – DSL (A)
    ["79.173.216.0", "255.255.248.0"],  // Orange – إربد – DSL (B)
    ["79.173.224.0", "255.255.248.0"],  // Orange – السلط – DSL (A)
    ["79.173.232.0", "255.255.248.0"],  // Orange – السلط – DSL (B)
    ["79.173.240.0", "255.255.248.0"],  // Orange – العقبة – DSL (A)
    ["79.173.248.0", "255.255.248.0"],  // Orange – العقبة – DSL (B)

    ["86.108.0.0"  , "255.255.248.0"],  // Orange – عمّان – فايبر (A)
    ["86.108.8.0"  , "255.255.248.0"],  // Orange – عمّان – فايبر (B)
    ["86.108.16.0" , "255.255.248.0"],  // Orange – الزرقاء – فايبر (A)
    ["86.108.24.0" , "255.255.248.0"],  // Orange – الزرقاء – فايبر (B)
    ["86.108.32.0" , "255.255.248.0"],  // Orange – إربد – فايبر (A)
    ["86.108.40.0" , "255.255.248.0"],  // Orange – إربد – فايبر (B)
    ["86.108.48.0" , "255.255.248.0"],  // Orange – السلط – DSL (A)
    ["86.108.56.0" , "255.255.248.0"],  // Orange – السلط – DSL (B)
    ["86.108.64.0" , "255.255.248.0"],  // Orange – عمّان الغربية – فايبر (A)
    ["86.108.72.0" , "255.255.248.0"],  // Orange – عمّان الغربية – فايبر (B)
    ["86.108.80.0" , "255.255.248.0"],  // Orange – مادبا – DSL (A)
    ["86.108.88.0" , "255.255.248.0"],  // Orange – مادبا – DSL (B)
    ["86.108.96.0" , "255.255.248.0"],  // Orange – جرش – DSL (A)
    ["86.108.104.0", "255.255.248.0"],  // Orange – جرش – DSL (B)
    ["86.108.112.0", "255.255.248.0"],  // Orange – المفرق – DSL (A)
    ["86.108.120.0", "255.255.248.0"],  // Orange – المفرق – DSL (B)

    ["91.106.96.0" , "255.255.248.0"],  // Batelco – عمّان – 4G  (أصلاً /21)

    ["91.186.224.0", "255.255.248.0"],  // Umniah/Batelco – عمّان – 4G (A)
    ["91.186.232.0", "255.255.248.0"],  // Umniah/Batelco – عمّان – 4G (B)
    ["91.186.240.0", "255.255.248.0"],  // Umniah/Batelco – الزرقاء – 4G (A)
    ["91.186.248.0", "255.255.248.0"],  // Umniah/Batelco – الزرقاء – 4G (B)

    ["92.241.32.0" , "255.255.248.0"],  // Umniah – عمّان الشرقية – فايبر (A)
    ["92.241.40.0" , "255.255.248.0"],  // Umniah – عمّان الشرقية – فايبر (B)
    ["92.241.48.0" , "255.255.248.0"],  // Umniah – الزرقاء – 4G+ (A)
    ["92.241.56.0" , "255.255.248.0"],  // Umniah – الزرقاء – 4G+ (B)

    ["95.172.192.0", "255.255.248.0"],  // Umniah – عمّان – 4G (A)
    ["95.172.200.0", "255.255.248.0"],  // Umniah – عمّان – 4G (B)
    ["95.172.208.0", "255.255.248.0"],  // Umniah – إربد – 4G+ (A)
    ["95.172.216.0", "255.255.248.0"],  // Umniah – إربد – 4G+ (B)

    ["109.107.224.0", "255.255.248.0"], // Umniah – عمّان – 5G (A)
    ["109.107.232.0", "255.255.248.0"], // Umniah – عمّان – 5G (B)
    ["109.107.240.0", "255.255.248.0"], // Umniah – الزرقاء – 5G (A)
    ["109.107.248.0", "255.255.248.0"], // Umniah – الزرقاء – 5G (B)

    ["178.238.176.0", "255.255.248.0"], // DataCenter – عمّان – أعمال (A)
    ["178.238.184.0", "255.255.248.0"], // DataCenter – عمّان – أعمال (B)

    ["185.140.0.0"  , "255.255.248.0"], // Zain – عمّان – فايبر (A)
    ["185.140.8.0"  , "255.255.248.0"], // Zain – عمّان – فايبر (B)
    ["185.140.16.0" , "255.255.248.0"], // Zain – الزرقاء – 4G (A)
    ["185.140.24.0" , "255.255.248.0"], // Zain – الزرقاء – 4G (B)
    ["185.140.32.0" , "255.255.248.0"], // Zain – إربد – 4G+ (A)
    ["185.140.40.0" , "255.255.248.0"], // Zain – إربد – 4G+ (B)
    ["185.140.48.0" , "255.255.248.0"], // Zain – السلط – 4G (A)
    ["185.140.56.0" , "255.255.248.0"], // Zain – السلط – 4G (B)
    ["185.140.64.0" , "255.255.248.0"], // Zain – مادبا – فايبر (A)
    ["185.140.72.0" , "255.255.248.0"], // Zain – مادبا – فايبر (B)
    ["185.140.80.0" , "255.255.248.0"], // Zain – الكرك – 4G+ (A)
    ["185.140.88.0" , "255.255.248.0"], // Zain – الكرك – 4G+ (B)
    ["185.140.96.0" , "255.255.248.0"], // Zain – معان – 4G (A)
    ["185.140.104.0", "255.255.248.0"], // Zain – معان – 4G (B)
    ["185.140.112.0", "255.255.248.0"], // Zain – العقبة – 4G+ (A)
    ["185.140.120.0", "255.255.248.0"], // Zain – العقبة – 4G+ (B)
    ["185.140.128.0", "255.255.248.0"], // Zain – جرش – 4G (A)
    ["185.140.136.0", "255.255.248.0"], // Zain – جرش – 4G (B)
    ["185.140.144.0", "255.255.248.0"], // Zain – عجلون – 4G (A)
    ["185.140.152.0", "255.255.248.0"], // Zain – عجلون – 4G (B)
    ["185.140.160.0", "255.255.248.0"], // Zain – المفرق – 4G+ (A)
    ["185.140.168.0", "255.255.248.0"], // Zain – المفرق – 4G+ (B)
    ["185.140.176.0", "255.255.248.0"], // Zain – الطفيلة – 4G (A)
    ["185.140.184.0", "255.255.248.0"], // Zain – الطفيلة – 4G (B)
    ["185.140.192.0", "255.255.248.0"], // Zain – البلقاء – فايبر (A)
    ["185.140.200.0", "255.255.248.0"], // Zain – البلقاء – فايبر (B)
    ["185.140.208.0", "255.255.248.0"], // Zain – الرصيفة – 4G (A)
    ["185.140.216.0", "255.255.248.0"], // Zain – الرصيفة – 4G (B)
    ["185.140.224.0", "255.255.248.0"], // Zain – الزرقاء الجديدة – 5G (A)
    ["185.140.232.0", "255.255.248.0"], // Zain – الزرقاء الجديدة – 5G (B)
    ["185.140.240.0", "255.255.248.0"], // Zain – عمّان الوسط – فايبر (A)
    ["185.140.248.0", "255.255.248.0"], // Zain – عمّان الوسط – فايبر (B)

    ["188.247.72.0" , "255.255.248.0"], // Zain – عمّان – 4G+ (B)
    ["188.247.64.0" , "255.255.248.0"], // Zain – عمّان – 4G+ (A)
    ["188.247.80.0" , "255.255.248.0"], // Zain – الزرقاء – 4G (A)
    ["188.247.88.0" , "255.255.248.0"], // Zain – الزرقاء – 4G (B)

    ["212.34.96.0"  , "255.255.248.0"], // Orange – عمّان الغربية – فايبر (A)
    ["212.34.104.0" , "255.255.248.0"], // Orange – عمّان الغربية – فايبر (B)
    ["212.34.112.0" , "255.255.248.0"], // Orange – عمّان الشرقية – فايبر (A)
    ["212.34.120.0" , "255.255.248.0"], // Orange – عمّان الشرقية – فايبر (B)

    ["212.35.0.0"   , "255.255.248.0"], // Orange – الشميساني – فايبر (A)
    ["212.35.8.0"   , "255.255.248.0"], // Orange – الشميساني – فايبر (B)
    ["212.35.16.0"  , "255.255.248.0"], // Orange – أم أذينة – فايبر (A)
    ["212.35.32.0"  , "255.255.248.0"], // Orange – الزرقاء – DSL (A)
    ["212.35.40.0"  , "255.255.248.0"], // Orange – الزرقاء – DSL (B)
    ["212.35.48.0"  , "255.255.248.0"], // Orange – إربد – DSL (A)
    ["212.35.56.0"  , "255.255.248.0"], // Orange – إربد – DSL (B)
    ["212.35.64.0"  , "255.255.248.0"], // Orange – شرق عمّان – فايبر (A)
    ["212.35.72.0"  , "255.255.248.0"], // Orange – شرق عمّان – فايبر (B)
    ["212.35.80.0"  , "255.255.248.0"], // Orange – السلط – فايبر (A)
    ["212.35.88.0"  , "255.255.248.0"], // Orange – السلط – فايبر (B)
    ["212.35.96.0"  , "255.255.248.0"], // Orange – الكرك – DSL (A)
    ["212.35.104.0" , "255.255.248.0"], // Orange – الكرك – DSL (B)
    ["212.35.112.0" , "255.255.248.0"], // Orange – العقبة – فايبر (A)
    ["212.35.120.0" , "255.255.248.0"], // Orange – العقبة – فايبر (B)
    ["212.35.128.0" , "255.255.248.0"], // Orange – المفرق – DSL (A)
    ["212.35.136.0" , "255.255.248.0"], // Orange – المفرق – DSL (B)
    ["212.35.144.0" , "255.255.248.0"], // Orange – جرش – DSL (A)
    ["212.35.152.0" , "255.255.248.0"], // Orange – جرش – DSL (B)
    ["212.35.160.0" , "255.255.248.0"], // Orange – عجلون – DSL (A)
    ["212.35.168.0" , "255.255.248.0"], // Orange – عجلون – DSL (B)
    ["212.35.176.0" , "255.255.248.0"], // Orange – الطفيلة – DSL (A)
    ["212.35.184.0" , "255.255.248.0"], // Orange – الطفيلة – DSL (B)
    ["212.35.192.0" , "255.255.248.0"], // Orange – البلقاء – DSL (A)
    ["212.35.200.0" , "255.255.248.0"], // Orange – البلقاء – DSL (B)
    ["212.35.208.0" , "255.255.248.0"], // Orange – مادبا – DSL (A)
    ["212.35.216.0" , "255.255.248.0"], // Orange – مادبا – DSL (B)
    ["212.35.224.0" , "255.255.248.0"], // Orange – الرصيفة – DSL (A)
    ["212.35.232.0" , "255.255.248.0"], // Orange – الرصيفة – DSL (B)
    ["212.35.240.0" , "255.255.248.0"], // Orange – عمّان الوسط – فايبر (A)
    ["212.35.248.0" , "255.255.248.0"], // Orange – عمّان الوسط – فايبر (B)

    ["212.118.0.0"  , "255.255.248.0"], // Umniah – عمّان – 4G (A)
    ["212.118.8.0"  , "255.255.248.0"], // Umniah – عمّان – 4G (B)

    ["213.139.32.0" , "255.255.248.0"], // Orange – عمّان – فايبر (A)
    ["213.139.40.0" , "255.255.248.0"], // Orange – عمّان – فايبر (B)
    ["213.139.48.0" , "255.255.248.0"], // Orange – — (A)
    ["213.139.56.0" , "255.255.248.0"]  // Orange – — (B)
  ];

  // نشدّد على كون "كل" فئات PUBG لازم تكون أردنية الوجهة
  var STRICT_JO_FOR = { LOBBY:true, MATCH:true, RECRUIT_SEARCH:true, UPDATES:true, CDNs:true };
  var FORBID_NON_JO = true;
  var BLOCK_REPLY   = "PROXY 0.0.0.0:0";

  var STICKY_SALT        = "JO_STICKY";
  var STICKY_TTL_MINUTES = 30;
  var JITTER_WINDOW      = 3;
  var HOST_RESOLVE_TTL_MS= 60000;
  var DST_RESOLVE_TTL_MS = 30000;

  var PUBG_DOMAINS = {
    LOBBY          : ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH          : ["*.gcloud.qq.com","gpubgm.com"],
    RECRUIT_SEARCH : ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    UPDATES        : ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
    CDNs           : ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };

  var URL_PATTERNS = {
    LOBBY          : ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH          : ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH : ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES        : ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle/*","*/obb*"],
    CDNs           : ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.HOST_RESOLVE_CACHE) CACHE.HOST_RESOLVE_CACHE = {};
  if (!CACHE.DST_RESOLVE_CACHE)  CACHE.DST_RESOLVE_CACHE  = {};
  if (!CACHE._PORT_STICKY)       CACHE._PORT_STICKY       = {};

  var now    = new Date().getTime();
  var geoTTL = STICKY_TTL_MINUTES * 60 * 1000;

  function resolveHostCached(h, ttl){
    if(!h) return "";
    var c = CACHE.HOST_RESOLVE_CACHE[h];
    if(c && (now - c.t) < ttl) return c.ip;
    var r  = dnsResolve(h);
    var ip = (r && r !== "0.0.0.0") ? r : "";
    CACHE.HOST_RESOLVE_CACHE[h] = { ip: ip, t: now };
    return ip;
  }

  function resolveDstCached(h, ttl){
    if(!h) return "";
    if(/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
    var c = CACHE.DST_RESOLVE_CACHE[h];
    if(c && (now - c.t) < ttl) return c.ip;
    var r  = dnsResolve(h);
    var ip = (r && r !== "0.0.0.0") ? r : "";
    CACHE.DST_RESOLVE_CACHE[h] = { ip: ip, t: now };
    return ip;
  }

  function isJordan(ip){
    if(!ip) return false;
    for(var i=0;i<JO_IP_SUBNETS.length;i++){
      if(isInNet(ip, JO_IP_SUBNETS[i][0], JO_IP_SUBNETS[i][1])) return true;
    }
    return false;
  }

  function weightedPick(ports, weights){
    var sum=0; for(var i=0;i<weights.length;i++) sum += (weights[i]||0);
    var jitter = (JITTER_WINDOW > 0) ? Math.floor(Math.random() * JITTER_WINDOW) : 0;
    var r = Math.floor(Math.random() * (sum + jitter)) + 1;
    var acc = 0;
    for(var k=0;k<ports.length;k++){
      acc += (weights[k] || 1);
      if(r <= acc) return ports[k];
    }
    return ports[0];
  }

  function proxyForCategory(category){
    var key = STICKY_SALT + "_PORT_" + category;
    var ttl = STICKY_TTL_MINUTES * 60 * 1000;
    var e   = CACHE._PORT_STICKY[key];
    if(e && (now - e.t) < ttl) return "PROXY " + PROXY_HOST + ":" + e.p;
    var p = weightedPick(PORTS[category], PORT_WEIGHTS_BASE[category]);
    CACHE._PORT_STICKY[key] = { p:p, t:now };
    return "PROXY " + PROXY_HOST + ":" + p;
  }

  // تحقق إن العميل والبروكسي نفسهم أردنيين
  var clientKey = STICKY_SALT + "_CLIENT_JO";
  var cE        = CACHE[clientKey];
  var clientOK;
  if(cE && (now - cE.t) < geoTTL){
    clientOK = cE.ok;
  } else {
    clientOK = isJordan(resolveDstCached(myIpAddress(), DST_RESOLVE_TTL_MS));
    CACHE[clientKey] = { ok:clientOK, t:now };
  }

  var proxyKey = STICKY_SALT + "_PROXY_JO";
  var pE       = CACHE[proxyKey];
  var proxyOK;
  if(pE && (now - pE.t) < geoTTL){
    proxyOK = pE.ok;
  } else {
    proxyOK = isJordan(resolveHostCached(PROXY_HOST, HOST_RESOLVE_TTL_MS));
    CACHE[proxyKey] = { ok:proxyOK, t:now };
  }

  if(!(clientOK && proxyOK)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";

  function requireJordanDestination(category, h){
    var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    if(!isJordan(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    return proxyForCategory(category);
  }

  function hostMatchesAnyDomain(h, patterns){
    for(var i=0;i<patterns.length;i++){
      if(shExpMatch(h, patterns[i])) return true;
      var p = patterns[i].replace(/^\*\./,".");
      if(h.slice(-p.length) === p) return true;
    }
    return false;
  }

  function pathMatches(u, patterns){
    for(var i=0;i<patterns.length;i++){
      if(shExpMatch(u, patterns[i])) return true;
    }
    return false;
  }

  // 1) مطابقة حسب المسارات (كل الفئات مُقيّدة للأردن)
  for(var cat in URL_PATTERNS){
    if(pathMatches(url, URL_PATTERNS[cat])){
      if(STRICT_JO_FOR[cat]) return requireJordanDestination(cat, host);
      return proxyForCategory(cat);
    }
  }

  // 2) مطابقة حسب الدومينات (كل الفئات مُقيّدة للأردن)
  for(var c in PUBG_DOMAINS){
    if(hostMatchesAnyDomain(host, PUBG_DOMAINS[c])){
      if(STRICT_JO_FOR[c]) return requireJordanDestination(c, host);
      return proxyForCategory(c);
    }
  }

  // 3) الوجهات الأردنية عمومًا → لوبي
  var dst = (/^\d+\.\d+\.\d+\.\d+$/).test(host) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS);
  if(isJordan(dst)) return proxyForCategory("LOBBY");

  return "DIRECT";
}
