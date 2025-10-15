function FindProxyForURL(url, host) {

  var FORBID_DIRECT_GLOBAL = false;

  var PROXIES = [
    { ip: "91.106.109.12", ports: [20001,443,8080], weight: 5 },
    { ip: "176.28.250.122", ports: [8080,443],       weight: 3 },
    { ip: "79.173.251.142", ports: [8000,443],       weight: 2 }
  ];

  var JO_IP_SUBNETS = [
    ["2.17.24.0","255.255.252.0"],
    ["37.202.64.0","255.255.192.0"],
    ["37.220.112.0","255.255.240.0"],
    ["46.185.128.0","255.255.128.0"],
    ["46.248.192.0","255.255.224.0"],
    ["46.32.96.0","255.255.224.0"],
    ["62.72.160.0","255.255.224.0"],
    ["79.173.192.0","255.255.192.0"],
    ["84.18.32.0","255.255.224.0"],
    ["86.108.0.0","255.255.128.0"],
    ["91.106.96.0","255.255.224.0"],
    ["91.106.100.0","255.255.252.0"],
    ["91.106.104.0","255.255.248.0"],
    ["91.186.224.0","255.255.224.0"],
    ["109.107.224.0","255.255.224.0"],
    ["109.107.228.0","255.255.255.0"],
    ["109.107.240.0","255.255.255.0"],
    ["109.107.241.0","255.255.255.0"],
    ["109.107.242.0","255.255.255.0"],
    ["109.107.243.0","255.255.255.0"],
    ["109.107.244.0","255.255.255.0"],
    ["109.107.245.0","255.255.255.0"],
    ["109.107.246.0","255.255.255.0"],
    ["109.107.247.0","255.255.255.0"],
    ["109.107.248.0","255.255.255.0"],
    ["109.107.249.0","255.255.255.0"],
    ["109.107.250.0","255.255.255.0"],
    ["109.107.251.0","255.255.255.0"],
    ["109.107.252.0","255.255.255.0"],
    ["109.107.253.0","255.255.255.0"],
    ["109.107.254.0","255.255.255.0"],
    ["109.107.255.0","255.255.255.0"],
    ["109.237.192.0","255.255.255.0"],
    ["109.237.193.0","255.255.255.0"],
    ["109.237.194.0","255.255.255.0"],
    ["109.237.195.0","255.255.255.0"],
    ["109.237.196.0","255.255.255.0"],
    ["109.237.197.0","255.255.255.0"],
    ["109.237.198.0","255.255.255.0"],
    ["109.237.199.0","255.255.255.0"],
    ["109.237.200.0","255.255.255.0"],
    ["109.237.201.0","255.255.255.0"],
    ["109.237.202.0","255.255.255.0"],
    ["109.237.203.0","255.255.255.0"],
    ["109.237.204.0","255.255.255.0"],
    ["109.237.205.0","255.255.255.0"],
    ["109.237.206.0","255.255.255.0"],
    ["109.237.207.0","255.255.255.0"]
  ];

  var LOBBY_DOMAINS = [
    "*.pubgmobile.com",
    "*.pubg.com",
    "*.tencentgames.com",
    "*.igamecj.com",
    "login.*",
    "lobby.*",
    "friend.*",
    "social.*",
    "matchmaking.*"
  ];

  var MATCH_DOMAINS = [
    "*.gcloud.qq.com",
    "*.qcloud.com",
    "*.garena.com",
    "*.umeng.com",
    "realtime.*",
    "battle.*",
    "game.*"
  ];

  var DNS_TTL_BASE_MS = 45000;
  var DNS_TTL_MIN_MS  = 8000;
  var DNS_TTL_MAX_MS  = 300000;
  var PROBE_MIN = 2;
  var PROBE_MAX = 4;
  var PROBE_RATE_LIMIT = 3000;
  var EWMA_ALPHA = 0.28;
  var VAR_ALPHA  = 0.18;
  var STICKY_PORT_TTL = 2700000;
  var SESSION_TTL     = 2700000;
  var SWITCH_FACTOR   = 1.6;
  var MEMORY_SEED_WEIGHT    = 0.65;
  var MEMORY_DECAY_HALFLIFE = 600000;

  if (typeof __JO_SMART === "undefined") {
    __JO_SMART = { dns:{}, stats:{}, sticky:{}, session:{}, memory:{} };
  }

  for (var i=0;i<PROXIES.length;i++){
    var p=PROXIES[i];
    if (!__JO_SMART.stats[p.ip])   __JO_SMART.stats[p.ip]={ewma:null,variance:null,lastProbe:0};
    if (!__JO_SMART.memory[p.ip]) __JO_SMART.memory[p.ip]={mean:null,variance:null,t:0};
  }

  function nowMs(){return(new Date()).getTime()}

  function isJordanIP(ip){
    if(!ip) return false;
    for(var i=0;i<JO_IP_SUBNETS.length;i++){
      if(isInNet(ip,JO_IP_SUBNETS[i][0],JO_IP_SUBNETS[i][1])) return true;
    }
    return false;
  }

  function isYouTube(h){
    var x=(h||"").toLowerCase();
    if(shExpMatch(x,"*.youtube.com")) return true;
    if(shExpMatch(x,"*.googlevideo.com")) return true;
    if(shExpMatch(x,"*.ytimg.com")) return true;
    if(x==="youtu.be"||shExpMatch(x,"youtu.be*")) return true;
    return false;
  }

  function matchList(h,arr){
    for(var i=0;i<arr.length;i++) if(shExpMatch(h,arr[i])) return true;
    return false;
  }

  function dnsCached(name){
    var e=__JO_SMART.dns[name];
    var t=nowMs();
    if(e&&(t-e.t)<(e.ttl||DNS_TTL_BASE_MS)) return e.ip;
    var ip=dnsResolve(name);
    __JO_SMART.dns[name]={ip:ip||null,t:t,ttl:DNS_TTL_BASE_MS};
    return ip||null;
  }

  function adaptiveDNSttl(){
    var acc=0,n=0;
    for(var i=0;i<PROXIES.length;i++){
      var s=__JO_SMART.stats[PROXIES[i].ip];
      if(s&&s.ewma!==null&&s.variance!==null){acc+=(s.ewma+Math.sqrt(s.variance));n++}
    }
    if(!n) return DNS_TTL_BASE_MS;
    var q=Math.max(0.2,Math.min(5.0,acc/(n*50.0)));
    var ttl=Math.floor(DNS_TTL_BASE_MS/q);
    if(ttl<DNS_TTL_MIN_MS) ttl=DNS_TTL_MIN_MS;
    if(ttl>DNS_TTL_MAX_MS) ttl=DNS_TTL_MAX_MS;
    return ttl;
  }

  function dynamicProbeCount(){
    var ttl=adaptiveDNSttl();
    if(ttl>=120000) return PROBE_MIN;
    if(ttl>=60000)  return 3;
    return PROBE_MAX;
  }

  function multiProbe(target,count){
    var ip=null,samples=[];
    for(var i=0;i<count;i++){
      var t0=nowMs(); var r=dnsResolve(target); var t1=nowMs();
      if(!ip&&r) ip=r;
      samples.push(t1-t0);
    }
    var sum=0; for(var k=0;k<samples.length;k++) sum+=samples[k];
    var mean=sum/samples.length;
    var vs=0; for(var k=0;k=samples.length;k++) vs+=Math.pow(samples[k]-mean,2);
    var variance=vs/samples.length;
    return{ip:ip,mean:mean,variance:variance};
  }

  function blend(a,b,w){ if(a===null) return b; if(b===null) return a; return (1-w)*a+w*b }

  function memoryWeight(t){
    var age=nowMs()-t;
    if(age<=0) return MEMORY_SEED_WEIGHT;
    var k=Math.pow(0.5,age/MEMORY_DECAY_HALFLIFE);
    return MEMORY_SEED_WEIGHT*k;
  }

  function warmStart(ip){
    var st=__JO_SMART.stats[ip], mem=__JO_SMART.memory[ip];
    if(!st||!mem) return;
    if(st.ewma===null&&mem.mean!==null){
      var w=memoryWeight(mem.t);
      st.ewma=blend(st.ewma,mem.mean,w);
      st.variance=blend(st.variance,mem.variance,w);
    }
  }

  function coolDown(ip,mean,variance){
    var mem=__JO_SMART.memory[ip]; if(!mem) return;
    var w=MEMORY_SEED_WEIGHT;
    mem.mean=blend(mem.mean,mean,w);
    mem.variance=blend(mem.variance,variance,w);
    mem.t=nowMs();
  }

  function updateStats(ip,mean,variance){
    var s=__JO_SMART.stats[ip]; if(!s) return;
    if(s.ewma===null) s.ewma=mean; else s.ewma=(1-EWMA_ALPHA)*s.ewma+EWMA_ALPHA*mean;
    if(s.variance===null) s.variance=variance; else s.variance=(1-VAR_ALPHA)*s.variance+VAR_ALPHA*variance;
    s.lastProbe=nowMs();
    coolDown(ip,s.ewma,s.variance);
  }

  function maybeProbe(proxy,hostForProbe){
    warmStart(proxy.ip);
    var s=__JO_SMART.stats[proxy.ip], now=nowMs();
    if(s&&(now-s.lastProbe)<PROBE_RATE_LIMIT) return;
    var cnt=dynamicProbeCount();
    var target=proxy.ip||hostForProbe;
    var res=multiProbe(target,cnt);
    if(res.ip!==null) updateStats(proxy.ip,res.mean,res.variance);
  }

  function scoreProxy(proxy){
    warmStart(proxy.ip);
    var s=__JO_SMART.stats[proxy.ip];
    var mean=s&&s.ewma!==null?s.ewma:60;
    var variance=s&&s.variance!==null?s.variance:600;
    var vf=1+Math.sqrt(variance)/(1+mean);
    var score=proxy.weight/(1+mean)/vf;
    if(proxy.ports&&proxy.ports.indexOf(20001)!==-1) score*=1.12;
    return score;
  }

  function jordanOnlyProxyList(){
    var out=[];
    for(var i=0;i<PROXIES.length;i++){
      if(isJordanIP(PROXIES[i].ip)) out.push(PROXIES[i]);
    }
    return out.length?out:PROXIES;
  }

  function chooseCandidate(hostname){
    var C=jordanOnlyProxyList();
    for(var i=0;i<C.length;i++) maybeProbe(C[i],hostname);
    var best=C[0],bestScore=-1e9;
    for(var i=0;i<C.length;i++){
      var sc=scoreProxy(C[i]);
      if(sc>bestScore){bestScore=sc;best=C[i]}
    }
    return best;
  }

  function hashIndex(key,n){
    var h=0; for(var i=0;i<key.length;i++) h=((h<<5)-h)+key.charCodeAt(i);
    return Math.abs(h)%n;
  }

  function stickyPort(hostname,proxy){
    var key=hostname+"@"+proxy.ip;
    var e=__JO_SMART.sticky[key];
    var t=nowMs();
    if(e&&(t-e.t)<STICKY_PORT_TTL) return e.port;
    var ports=proxy.ports&&proxy.ports.length?proxy.ports.slice():[443];
    ports.sort(function(a,b){ if(a===20001) return -1; if(b===20001) return 1; return a-b });
    var idx=hashIndex(hostname,ports.length);
    var port=ports[idx];
    __JO_SMART.sticky[key]={port:port,t:t};
    return port;
  }

  function pinSession(hostname,proxy){
    var s=__JO_SMART.session[hostname], t=nowMs();
    if(!s||!s.ip||(t-s.t)>SESSION_TTL){ __JO_SMART.session[hostname]={ip:proxy.ip,t:t}; return proxy }
    if(s.ip===proxy.ip){ s.t=t; return proxy }
    var current=null;
    for(var i=0;i<PROXIES.length;i++) if(PROXIES[i].ip===s.ip) current=PROXIES[i];
    if(!current){ __JO_SMART.session[hostname]={ip:proxy.ip,t:t}; return proxy }
    var currScore=scoreProxy(current), candScore=scoreProxy(proxy);
    if(candScore>currScore*SWITCH_FACTOR){ __JO_SMART.session[hostname]={ip:proxy.ip,t:t}; return proxy }
    for(var i=0;i<PROXIES.length;i++) if(PROXIES[i].ip===s.ip) return PROXIES[i];
    __JO_SMART.session[hostname]={ip:proxy.ip,t:t}; return proxy;
  }

  function chainReturnProxy(hostname,proxy){
    var C=jordanOnlyProxyList();
    var p1=proxy, p2=null;
    for(var i=0;i<C.length;i++){ if(C[i].ip!==p1.ip){ p2=C[i]; break } }
    var port1=stickyPort(hostname,p1);
    if(!p2) return "PROXY "+p1.ip+":"+port1;
    var port2=stickyPort(hostname,p2);
    return "PROXY "+p1.ip+":"+port1+"; PROXY "+p2.ip+":"+port2;
  }

  function chainReturnSocks(hostname,proxy){
    var C=jordanOnlyProxyList();
    var p1=proxy, p2=null;
    for(var i=0;i<C.length;i++){ if(C[i].ip!==p1.ip){ p2=C[i]; break } }
    var port1=stickyPort(hostname,p1);
    if(!p2) return "SOCKS5 "+p1.ip+":"+port1;
    var port2=stickyPort(hostname,p2);
    return "SOCKS5 "+p1.ip+":"+port1+"; SOCKS5 "+p2.ip+":"+port2;
  }

  var h=(host||"").toLowerCase();

  if(isYouTube(h)) return "DIRECT";

  var hostIP=dnsCached(h);
  var e=__JO_SMART.dns[h];
  if(e) e.ttl=adaptiveDNSttl();

  var isJO=hostIP&&isJordanIP(hostIP);
  var isLobby=matchList(h,LOBBY_DOMAINS);
  var isMatch=matchList(h,MATCH_DOMAINS)||h.indexOf("pubg")!==-1||h.indexOf("tencent")!==-1;

  if(isJO && !FORBID_DIRECT_GLOBAL && !isLobby && !isMatch) return "DIRECT";

  var candidate=chooseCandidate(h);
  var chosen=pinSession(h,candidate);

  if(isMatch) return chainReturnSocks(h,chosen);

  if(isLobby) return chainReturnProxy(h,chosen);

  if(FORBID_DIRECT_GLOBAL) return chainReturnProxy(h,chosen);

  if(isJO) return "DIRECT";

  return chainReturnProxy(h,chosen);
}
