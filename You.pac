function FindProxyForURL(url, host) {
  var PROXY_HOST = "91.106.109.12";

  var PORTS = {
    LOBBY: [443,8080,8443],
    MATCH: [20001,20002,20003],
    RECRUIT_SEARCH: [10010,10012,10013,10039,10096,10491,10612,11000,11455,12235],
    UPDATES: [80,443,8443,8080],
    CDNs: [80,8080,443]
  };

  var PORT_WEIGHTS_BASE = {
    LOBBY:[5,3,2],
    MATCH:[4,2,1],
    RECRUIT_SEARCH:[4,3,3,2,2,2,2,2,2,1],
    UPDATES:[5,3,2,1],
    CDNs:[3,2,2]
  };

  // سماح صارم: نطاقات أردنية مؤكدة فقط
  var STRICT_JO_IP_RANGES = [
    [ipToInt("46.32.96.0"),   ipToInt("46.32.127.255")],   // Zain FTTH/BB
    [ipToInt("46.185.128.0"), ipToInt("46.185.255.255")],  // Orange
    [ipToInt("46.248.192.0"), ipToInt("46.248.223.255")],  // Umniah WBB
    [ipToInt("79.173.192.0"), ipToInt("79.173.255.255")],  // Orange
    [ipToInt("92.241.32.0"),  ipToInt("92.241.63.255")],   // Umniah
    [ipToInt("95.172.192.0"), ipToInt("95.172.223.255")],  // (JO allocations مؤكدة)
    [ipToInt("109.107.224.0"),ipToInt("109.107.255.255")], // Zain
    [ipToInt("185.140.0.0"),  ipToInt("185.140.255.255")], // Umniah (185.140.0.0/16)
    [ipToInt("212.34.96.0"),  ipToInt("212.34.127.255")],  // JO enterprise
    [ipToInt("212.35.0.0"),   ipToInt("212.35.255.255")],  // Orange
    [ipToInt("213.139.32.0"), ipToInt("213.139.63.255")]   // Batelco Jordan
  ].sort(function(a,b){return a[0]-b[0]});

  // حظر صريح لبلدان ممنوعة (لقطع أي تسريب جغرافي)
  var IR_DENY = [
    ["2.144.0.0","255.240.0.0"],   // 2.144.0.0/12
    ["5.112.0.0","255.240.0.0"],   // 5.112.0.0/12
    ["31.56.0.0","255.248.0.0"],   // 31.56.0.0/13
    ["37.98.0.0","255.255.0.0"],   // 37.98.0.0/16
    ["79.175.0.0","255.255.0.0"],  // 79.175.0.0/16
    ["80.191.0.0","255.255.0.0"],  // 80.191.0.0/16
    ["81.12.0.0","255.255.0.0"],   // 81.12.0.0/16
    ["82.99.192.0","255.255.192.0"],// 82.99.192.0/18
    ["83.120.0.0","255.248.0.0"],  // 83.120.0.0/13
    ["84.47.0.0","255.255.0.0"],   // 84.47.0.0/16
    ["85.15.0.0","255.255.0.0"],   // 85.15.0.0/16
    ["86.55.0.0","255.255.0.0"],   // 86.55.0.0/16
    ["87.107.0.0","255.255.0.0"],  // 87.107.0.0/16
    ["188.158.0.0","255.254.0.0"], // 188.158.0.0/15
    ["217.219.0.0","255.255.0.0"]  // 217.219.0.0/16
  ].map(maskPairToRange).sort(function(a,b){return a[0]-b[0]});

  var IQ_DENY = [
    ["5.22.0.0","255.255.0.0"],    // 5.22.0.0/16
    ["31.25.0.0","255.255.0.0"],   // 31.25.0.0/16
    ["37.236.0.0","255.254.0.0"],  // 37.236.0.0/15
    ["62.201.192.0","255.255.192.0"],// 62.201.192.0/18
    ["77.237.0.0","255.255.0.0"],  // 77.237.0.0/16
    ["78.109.224.0","255.255.224.0"],// 78.109.224.0/19
    ["80.76.224.0","255.255.224.0"],// 80.76.224.0/19
    ["84.235.0.0","255.255.0.0"]   // 84.235.0.0/16
  ].map(maskPairToRange).sort(function(a,b){return a[0]-b[0]});

  var PUBG_DOMAINS = {
    LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH:["*.gcloud.qq.com","gpubgm.com"],
    RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
    CDNs:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };

  var URL_PATTERNS = {
    LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle/*","*/obb*"],
    CDNs:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  var STICKY_SALT="JO_STICKY";
  var STICKY_TTL_MINUTES=30;
  var JITTER_WINDOW=3;
  var DST_RESOLVE_TTL_MS=30000;

  var root=(typeof globalThis!=="undefined"?globalThis:this);
  if(!root._PAC_CACHE) root._PAC_CACHE={};
  var CACHE=root._PAC_CACHE;
  if(!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE={};
  if(!CACHE._PORT_STICKY) CACHE._PORT_STICKY={};

  var now=new Date().getTime();

  function ipToInt(ip){return ip.split('.').reduce(function(acc,o){return (acc<<8)|parseInt(o,10)},0)>>>0}
  function maskPairToRange(n,m){
    var nI=ipToInt(n), mask=ipToInt(m);
    var start=(nI & mask)>>>0, end=(nI | (~mask>>>0))>>>0;
    return [start,end];
  }
  function inRanges(ip, ranges){
    if(!ip) return false;
    var x=ipToInt(ip), lo=0, hi=ranges.length-1;
    while(lo<=hi){
      var mid=(lo+hi)>>1, s=ranges[mid][0], e=ranges[mid][1];
      if(x< s) hi=mid-1;
      else if(x>e) lo=mid+1;
      else return true;
    }
    return false;
  }
  function resolveDstCached(h, ttl){
    if(!h) return "";
    if(/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
    var c=CACHE.DST_RESOLVE_CACHE[h];
    if(c && (now-c.t)<ttl) return c.ip;
    var r=dnsResolve(h);
    var ip=(r && r!=="0.0.0.0")?r:"";
    CACHE.DST_RESOLVE_CACHE[h]={ip:ip,t:now};
    return ip;
  }
  function weightedPick(ports, weights){
    var sum=0; for(var i=0;i<weights.length;i++) sum+=(weights[i]||0);
    var jitter=(JITTER_WINDOW>0)?Math.floor(Math.random()*JITTER_WINDOW):0;
    var r=Math.floor(Math.random()*(sum+jitter))+1, acc=0;
    for(var k=0;k<ports.length;k++){ acc+=(weights[k]||1); if(r<=acc) return ports[k]; }
    return ports[0];
  }
  function proxyForCategory(cat){
    var key=STICKY_SALT+"_PORT_"+cat, ttl=STICKY_TTL_MINUTES*60*1000, e=CACHE._PORT_STICKY[key];
    if(e && (now-e.t)<ttl) return "PROXY "+PROXY_HOST+":"+e.p;
    var p=weightedPick(PORTS[cat], PORT_WEIGHTS_BASE[cat]);
    CACHE._PORT_STICKY[key]={p:p,t:now};
    return "PROXY "+PROXY_HOST+":"+p;
  }
  function hostMatchesAnyDomain(h, pats){
    for(var i=0;i<pats.length;i++){
      if(shExpMatch(h,pats[i])) return true;
      var p=pats[i].replace(/^\*\./,".");
      if(h.slice(-p.length)===p) return true;
    }
    return false;
  }
  function pathMatches(u,pats){
    for(var i=0;i<pats.length;i++) if(shExpMatch(u,pats[i])) return true;
    return false;
  }

  // القرار: ممنوع إيران/العراق، مسموح الأردن الصارم فقط
  var dst=(/^\d+\.\d+\.\d+\.\d+$/.test(host))?host:resolveDstCached(host, DST_RESOLVE_TTL_MS);

  if(inRanges(dst, IR_DENY) || inRanges(dst, IQ_DENY)) return "DIRECT"; // منع صريح (يمكن تغييره إلى "BLOCK")
  if(!inRanges(dst, STRICT_JO_IP_RANGES))           return "DIRECT";   // أي شيء غير أردني → لا بروكسي

  for(var cat in PUBG_DOMAINS){
    if(hostMatchesAnyDomain(host, PUBG_DOMAINS[cat]) || pathMatches(url, URL_PATTERNS[cat])){
      return proxyForCategory(cat);
    }
  }
  return proxyForCategory("LOBBY");
}
