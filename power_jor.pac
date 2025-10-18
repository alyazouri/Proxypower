function FindProxyForURL(url, host) {
  var PROXY_HOST = "91.106.109.12";
  var PORTS = {
    LOBBY: [443,8080,8443],
    MATCH: [20001,20002,20003],
    RECRUIT_SEARCH: [10010,10012,10013,10039,10096,10491,10612,11000,11455,12235],
    UPDATES: [80,443,8443,8080],
    CDNs: [80,8080,443]
  };
  var PORT_WEIGHTS = {
    LOBBY: [5,3,2],
    MATCH: [4,2,1],
    RECRUIT_SEARCH: [4,3,3,2,2,2,2,2,2,1],
    UPDATES: [5,3,2,1],
    CDNs: [3,2,2]
  };
  var JO_IP_SUBNETS = [
      ["37.202.64.0","255.255.240.0"],   // Orange Jordan – عمّان – فايبر
  ["37.202.80.0","255.255.240.0"],   // Orange Jordan – إربد – فايبر
  ["37.202.96.0","255.255.240.0"],   // Orange Jordan – عمّان الغربية – فايبر
  ["37.202.112.0","255.255.240.0"],  // Orange Jordan – السلط – DSL

  ["37.220.112.0","255.255.240.0"],  // Batelco Jordan – عمّان – فايبر

  ["46.23.112.0","255.255.240.0"],   // Umniah – الزرقاء – WiMAX

  ["46.32.96.0","255.255.240.0"],    // Zain Jordan – عمّان – فايبر
  ["46.32.112.0","255.255.240.0"],   // Zain Jordan – السلط – فايبر

  ["46.185.128.0","255.255.240.0"],  // Orange Jordan – عمّان – فايبر
  ["46.185.144.0","255.255.240.0"],  // Orange Jordan – الزرقاء – فايبر
  ["46.185.160.0","255.255.240.0"],  // Orange Jordan – إربد – فايبر
  ["46.185.176.0","255.255.240.0"],  // Orange Jordan – مادبا – DSL
  ["46.185.192.0","255.255.240.0"],  // Orange Jordan – عمّان الشرقية – DSL
  ["46.185.208.0","255.255.240.0"],  // Orange Jordan – الكرك – DSL
  ["46.185.224.0","255.255.240.0"],  // Orange Jordan – جرش – DSL
  ["46.185.240.0","255.255.240.0"],  // Orange Jordan – المفرق – DSL

  ["46.248.192.0","255.255.240.0"],  // Umniah/Batelco – ماركا – WiMAX
  ["46.248.208.0","255.255.240.0"],  // Umniah/Batelco – الزرقاء – 4G

  ["79.173.192.0","255.255.240.0"],  // Orange Jordan – عمّان – DSL
  ["79.173.208.0","255.255.240.0"],  // Orange Jordan – إربد – DSL
  ["79.173.224.0","255.255.240.0"],  // Orange Jordan – السلط – DSL
  ["79.173.240.0","255.255.240.0"],  // Orange Jordan – العقبة – DSL

  ["86.108.0.0","255.255.240.0"],    // Orange Jordan – عمّان – فايبر
  ["86.108.16.0","255.255.240.0"],   // Orange Jordan – الزرقاء – فايبر
  ["86.108.32.0","255.255.240.0"],   // Orange Jordan – إربد – فايبر
  ["86.108.48.0","255.255.240.0"],   // Orange Jordan – السلط – DSL
  ["86.108.64.0","255.255.240.0"],   // Orange Jordan – عمّان الغربية – فايبر
  ["86.108.80.0","255.255.240.0"],   // Orange Jordan – مادبا – DSL
  ["86.108.96.0","255.255.240.0"],   // Orange Jordan – جرش – DSL
  ["86.108.112.0","255.255.240.0"],  // Orange Jordan – المفرق – DSL

  ["91.106.96.0","255.255.248.0"],   // Batelco Jordan – عمّان – 4G

  ["91.186.224.0","255.255.240.0"],  // Umniah/Batelco – عمّان – 4G
  ["91.186.240.0","255.255.240.0"],  // Umniah/Batelco – الزرقاء – 4G

  ["92.241.32.0","255.255.240.0"],   // Umniah – عمّان الشرقية – فايبر
  ["92.241.48.0","255.255.240.0"],   // Umniah – الزرقاء – 4G+

  ["95.172.192.0","255.255.240.0"],  // Umniah – عمّان – 4G
  ["95.172.208.0","255.255.240.0"],  // Umniah – إربد – 4G+

  ["109.107.224.0","255.255.240.0"], // Umniah – عمّان – 5G
  ["109.107.240.0","255.255.240.0"], // Umniah – الزرقاء – 5G

  ["178.238.176.0","255.255.240.0"], // DataCenter Jordan – عمّان – تجاري/أعمال

  ["185.140.0.0","255.255.240.0"],   // Zain Jordan – عمّان – فايبر
  ["185.140.16.0","255.255.240.0"],  // Zain Jordan – الزرقاء – 4G
  ["185.140.32.0","255.255.240.0"],  // Zain Jordan – إربد – 4G+
  ["185.140.48.0","255.255.240.0"],  // Zain Jordan – السلط – 4G
  ["185.140.64.0","255.255.240.0"],  // Zain Jordan – مادبا – فايبر
  ["185.140.80.0","255.255.240.0"],  // Zain Jordan – الكرك – 4G+
  ["185.140.96.0","255.255.240.0"],  // Zain Jordan – معان – 4G
  ["185.140.112.0","255.255.240.0"], // Zain Jordan – العقبة – 4G+
  ["185.140.128.0","255.255.240.0"], // Zain Jordan – جرش – 4G
  ["185.140.144.0","255.255.240.0"], // Zain Jordan – عجلون – 4G
  ["185.140.160.0","255.255.240.0"], // Zain Jordan – المفرق – 4G+
  ["185.140.176.0","255.255.240.0"], // Zain Jordan – الطفيلة – 4G
  ["185.140.192.0","255.255.240.0"], // Zain Jordan – البلقاء – فايبر
  ["185.140.208.0","255.255.240.0"], // Zain Jordan – الرصيفة – 4G
  ["185.140.224.0","255.255.240.0"], // Zain Jordan – الزرقاء الجديدة – 5G
  ["185.140.240.0","255.255.240.0"], // Zain Jordan – عمان الوسط – فايبر

  ["188.247.64.0","255.255.240.0"],  // Zain Jordan – عمّان – 4G+
  ["188.247.80.0","255.255.240.0"],  // Zain Jordan – الزرقاء – 4G

  ["212.34.96.0","255.255.240.0"],   // Orange Jordan – عمّان الغربية – فايبر
  ["212.34.112.0","255.255.240.0"],  // Orange Jordan – عمّان الشرقية – فايبر

  ["212.35.0.0","255.255.240.0"],    // Orange Jordan – الشميساني – فايبر
  ["212.35.16.0","255.255.240.0"],   // Orange Jordan – أم أذينة – فايبر
  ["212.35.32.0","255.255.240.0"],   // Orange Jordan – الزرقاء – DSL
  ["212.35.48.0","255.255.240.0"],   // Orange Jordan – إربد – DSL
  ["212.35.64.0","255.255.240.0"],   // Orange Jordan – شرق عمّان – فايبر
  ["212.35.80.0","255.255.240.0"],   // Orange Jordan – السلط – فايبر
  ["212.35.96.0","255.255.240.0"],   // Orange Jordan – الكرك – DSL
  ["212.35.112.0","255.255.240.0"],  // Orange Jordan – العقبة – فايبر
  ["212.35.128.0","255.255.240.0"],  // Orange Jordan – المفرق – DSL
  ["212.35.144.0","255.255.240.0"],  // Orange Jordan – جرش – DSL
  ["212.35.160.0","255.255.240.0"],  // Orange Jordan – عجلون – DSL
  ["212.35.176.0","255.255.240.0"],  // Orange Jordan – الطفيلة – DSL
  ["212.35.192.0","255.255.240.0"],  // Orange Jordan – البلقاء – DSL
  ["212.35.208.0","255.255.240.0"],  // Orange Jordan – مادبا – DSL
  ["212.35.224.0","255.255.240.0"],  // Orange Jordan – الرصيفة – DSL
  ["212.35.240.0","255.255.240.0"],  // Orange Jordan – عمان الوسط – فايبر

  ["212.118.0.0","255.255.240.0"],   // Umniah – عمّان – 4G

  ["213.139.32.0","255.255.240.0"],  // Orange Jordan – عمّان – فايبر
  ["213.139.48.0","255.255.240.0"]  // Orange Jordan – 
  ];
  var STRICT_JO_FOR = { LOBBY:true, MATCH:true, RECRUIT_SEARCH:true };
  var FORBID_NON_JO = true;
  var BLOCK_REPLY = "PROXY 0.0.0.0:0";
  var STICKY_SALT = "JO_STICKY";
  var STICKY_TTL_MINUTES = 30;
  var JITTER_WINDOW = 3;
  var HOST_RESOLVE_TTL_MS = 60 * 1000;
  var DST_RESOLVE_TTL_MS = 30 * 1000;
  var now = new Date().getTime();
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.HOST_RESOLVE_CACHE) CACHE.HOST_RESOLVE_CACHE = {};
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};
  var PUBG_DOMAINS = {
    LOBBY: ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH: ["*.gcloud.qq.com","gpubgm.com"],
    RECRUIT_SEARCH: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    UPDATES: ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
    CDNs: ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };
  var URL_PATTERNS = {
    LOBBY: ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH: ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES: ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
    CDNs: ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };
  function hostMatchesAnyDomain(h, patterns){
    for(var i=0;i<patterns.length;i++){
      if(shExpMatch(h,patterns[i])) return true;
      var p=patterns[i].replace(/^\*\./,".");
      if(h.slice(-p.length)===p) return true;
    }
    return false;
  }
  function pathMatches(u, patterns){
    for(var i=0;i<patterns.length;i++){
      if(shExpMatch(u,patterns[i])) return true;
    }
    return false;
  }
  function ipInAnyJordanRange(ip){
    if(!ip) return false;
    for(var j=0;j<JO_IP_SUBNETS.length;j++){
      if(isInNet(ip,JO_IP_SUBNETS[j][0],JO_IP_SUBNETS[j][1])) return true;
    }
    return false;
  }
  function weightedPick(ports,weights){
    var sum=0; for(var i=0;i<weights.length;i++) sum+=weights[i];
    var jitter=(JITTER_WINDOW>0)?Math.floor(Math.random()*JITTER_WINDOW):0;
    var r=Math.floor(Math.random()*(sum+jitter))+1; var acc=0;
    for(var k=0;k<ports.length;k++){ acc+=(weights[k]||1); if(r<=acc) return ports[k]; }
    return ports[0];
  }
  function proxyForCategory(category){
    var key=STICKY_SALT+"_PORT_"+category; var ttl=STICKY_TTL_MINUTES*60*1000; var e=CACHE._PORT_STICKY[key];
    if(e && (now-e.t)<ttl) return "PROXY "+PROXY_HOST+":"+e.p;
    var p=weightedPick(PORTS[category],PORT_WEIGHTS[category]); CACHE._PORT_STICKY[key]={p:p,t:now}; return "PROXY "+PROXY_HOST+":"+p;
  }
  function resolveHostCached(h,ttl){
    if(!h) return "";
    var c=CACHE.HOST_RESOLVE_CACHE[h];
    if(c && (now-c.t)<ttl) return c.ip;
    var r=dnsResolve(h);
    var ip=(r && r!=="0.0.0.0")?r:"";
    CACHE.HOST_RESOLVE_CACHE[h]={ip:ip,t:now}; return ip;
  }
  function resolveDstCached(h,ttl){
    if(!h) return "";
    if(/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
    var c=CACHE.DST_RESOLVE_CACHE[h];
    if(c && (now-c.t)<ttl) return c.ip;
    var r=dnsResolve(h);
    var ip=(r && r!=="0.0.0.0")?r:"";
    CACHE.DST_RESOLVE_CACHE[h]={ip:ip,t:now}; return ip;
  }
  var geoTTL=STICKY_TTL_MINUTES*60*1000;
  var clientKey=STICKY_SALT+"_CLIENT_JO"; var cE=CACHE[clientKey]; var clientOK;
  if(cE && (now-cE.t)<geoTTL){ clientOK=cE.ok; } else { clientOK=ipInAnyJordanRange(resolveDstCached(myIpAddress(),DST_RESOLVE_TTL_MS)); CACHE[clientKey]={ok:clientOK,t:now}; }
  var proxyKey=STICKY_SALT+"_PROXY_JO"; var pE=CACHE[proxyKey]; var proxyOK;
  if(pE && (now-pE.t)<geoTTL){ proxyOK=pE.ok; } else { proxyOK=ipInAnyJordanRange(resolveHostCached(PROXY_HOST,HOST_RESOLVE_TTL_MS)); CACHE[proxyKey]={ok:proxyOK,t:now}; }
  if(!(clientOK && proxyOK)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
  function requireJordanDestination(category,h){
    var ip=resolveDstCached(h,DST_RESOLVE_TTL_MS);
    if(!ipInAnyJordanRange(ip)) return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
    return proxyForCategory(category);
  }
  for(var cat in URL_PATTERNS){
    if(pathMatches(url,URL_PATTERNS[cat])){
      if(STRICT_JO_FOR[cat]) return requireJordanDestination(cat,host);
      return proxyForCategory(cat);
    }
  }
  for(var c in PUBG_DOMAINS){
    if(hostMatchesAnyDomain(host,PUBG_DOMAINS[c])){
      if(STRICT_JO_FOR[c]) return requireJordanDestination(c,host);
      return proxyForCategory(c);
    }
  }
  var dst=/^\d+\.\d+\.\d+\.\d+$/.test(host)?host:resolveDstCached(host,DST_RESOLVE_TTL_MS);
  if(dst && ipInAnyJordanRange(dst)) return proxyForCategory("LOBBY");
  return "DIRECT";
}
