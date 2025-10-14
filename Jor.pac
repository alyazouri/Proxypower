var DNS_CACHE_TTL_MS = 45000;
var JITTER_WINDOW_MS = 120;
var SESSION_TTL_MS = 120000;
var RTT_EMA_ALPHA = 0.25;
var RTT_REFERENCE_MS = 200;
var FAIL_BLACKLIST_THRESHOLD = 3;
var FAIL_BLACKLIST_TTL_MS = 180000;
var __DNS_CACHE__ = __DNS_CACHE__ || {};
var __RTT_CACHE__ = __RTT_CACHE__ || {};
var __SESSION_MAP__ = __SESSION_MAP__ || {};
var __FAIL_COUNT__ = __FAIL_COUNT__ || {};
var __BLACKLIST__ = __BLACKLIST__ || {};
var __PROXY_IP_CACHE__ = __PROXY_IP_CACHE__ || {};

var PROXIES = [
  { id:"P1", proxy:"PROXY 213.139.50.66:8088", base:5 },
  { id:"P2", proxy:"PROXY 213.139.50.66:8111", base:5 },
  { id:"P3", proxy:"PROXY 91.106.109.12:20001", base:6 }
];

var JO_RANGES = [
  ["185.140.0.0","255.255.0.0"],
  ["212.35.0.0","255.255.0.0"],
  ["185.96.70.36","255.255.255.255"],
  ["176.28.250.122","255.255.255.255"],
  ["37.123.0.0","255.255.0.0"],
  ["79.173.251.142","255.255.255.255"],
  ["185.142.226.12","255.255.255.255"],
  ["213.139.32.0","255.255.224.0"],
  ["46.32.97.0","255.255.255.0"],
  ["46.32.98.0","255.255.255.0"],
  ["46.32.99.0","255.255.255.0"],
  ["188.247.64.0","255.255.252.0"]
];

function now(){ return (new Date()).getTime(); }

function hash32(s){
  var h=2166136261;
  for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24); h^=s.charCodeAt(i); }
  return (h>>>0);
}

function jitter(){ return (new Date()).getMilliseconds() % JITTER_WINDOW_MS; }

function cachedDnsResolve(h){
  try{
    var key=(h||"").toLowerCase();
    var e=__DNS_CACHE__[key];
    var t=now();
    if(e && (t - e.ts) < DNS_CACHE_TTL_MS) return e.ip;
    var start=now();
    var ip=dnsResolve(h);
    var dur=now()-start;
    if(ip){
      __DNS_CACHE__[key]={ ip:ip, ts:t };
      updateRtt(key,dur);
      resetFailCount(key);
      return ip;
    } else {
      incFailCount(key);
      return null;
    }
  }catch(_){
    incFailCount((h||"").toLowerCase());
    return null;
  }
}

function updateRtt(key, sample){
  try{
    var e=__RTT_CACHE__[key];
    if(!e){ __RTT_CACHE__[key]={ rtt: sample, ts: now() }; return; }
    var alpha = RTT_EMA_ALPHA;
    var newRtt = Math.round( alpha * sample + (1-alpha) * e.rtt );
    __RTT_CACHE__[key] = { rtt: newRtt, ts: now() };
  }catch(e){}
}

function getRtt(key){
  var e=__RTT_CACHE__[key];
  if(!e) return null;
  return e.rtt;
}

function incFailCount(key){
  try{
    var k=key||"";
    __FAIL_COUNT__[k]=(__FAIL_COUNT__[k]||0)+1;
    if(__FAIL_COUNT__[k] >= FAIL_BLACKLIST_THRESHOLD){
      __BLACKLIST__[k] = { ts: now(), ttl: FAIL_BLACKLIST_TTL_MS };
      __FAIL_COUNT__[k]=0;
    }
  }catch(e){}
}

function resetFailCount(key){
  try{ __FAIL_COUNT__[key]=0; }catch(e){}
}

function isBlacklisted(key){
  var b=__BLACKLIST__[key];
  if(!b) return false;
  if(now() - b.ts > b.ttl){ delete __BLACKLIST__[key]; return false; }
  return true;
}

function isInJoRanges(ip){
  if(!ip) return false;
  for(var i=0;i<JO_RANGES.length;i++){
    try{ if(isInNet(ip, JO_RANGES[i][0], JO_RANGES[i][1])) return true; }catch(e){}
  }
  return false;
}

function sessionGet(host){
  try{
    var k=(host||"").toLowerCase();
    var e=__SESSION_MAP__[k];
    if(!e) return null;
    if(now() - e.ts > SESSION_TTL_MS){ delete __SESSION_MAP__[k]; return null; }
    return e.proxy;
  }catch(e){ return null; }
}

function sessionSet(host, proxy){
  try{ __SESSION_MAP__[(host||"").toLowerCase()] = { proxy: proxy, ts: now() }; }catch(e){}
}

function computeAdjustedWeights(h, list, extra){
  var key=(h||"").toLowerCase();
  var rtt = getRtt(key);
  var totals=[]; var total=0;
  for(var i=0;i<list.length;i++){
    var w = list[i].base || 1;
    var sticky = (hash32(key) % list.length) === i;
    if(sticky) w += 2;
    if(extra) w += extra;
    if(rtt !== null){
      var factor = Math.max(0.5, Math.min(2.0, RTT_REFERENCE_MS / (rtt || RTT_REFERENCE_MS)));
      w = Math.round(w * factor);
    }
    totals.push(w); total += w;
  }
  return { totals: totals, total: total };
}

function weightedPickAdaptive(h, list, extra){
  var sess = sessionGet(h);
  if(sess) return sess;
  var adj = computeAdjustedWeights(h, list, extra);
  if(adj.total <= 0) return list[0].proxy;
  var rnd = (hash32(h + now() + jitter().toString()) % 10000)/10000 * adj.total;
  var c=0;
  for(var j=0;j<list.length;j++){
    c += adj.totals[j];
    if(rnd <= c){
      var chosen = list[j].proxy;
      sessionSet(h, chosen);
      return chosen;
    }
  }
  sessionSet(h, list[0].proxy);
  return list[0].proxy;
}

function resolveProxyHost(proxyString){
  try{
    // proxyString like "PROXY 1.2.3.4:8080" or "PROXY host:port"
    var parts = proxyString.split(" ");
    var hostport = parts.length>1 ? parts[1] : parts[0];
    var hp = hostport.split(":");
    return hp[0];
  }catch(e){ return null; }
}

function proxyIpIsJordan(proxyString){
  try{
    var host = resolveProxyHost(proxyString);
    if(!host) return false;
    var cached = __PROXY_IP_CACHE__[host];
    var t = now();
    if(cached && (t - cached.ts) < DNS_CACHE_TTL_MS) return isInJoRanges(cached.ip);
    var ip = null;
    try{ ip = dnsResolve(host); }catch(e){ ip = null; }
    if(!ip) return false;
    __PROXY_IP_CACHE__[host] = { ip: ip, ts: t };
    return isInJoRanges(ip);
  }catch(e){ return false; }
}

function filterProxiesToJordan(list){
  var out = [];
  for(var i=0;i<list.length;i++){
    try{
      if(proxyIpIsJordan(list[i].proxy)) out.push(list[i]);
    }catch(e){}
  }
  return out;
}

function FindProxyForURL(url, host){
  try{
    var h=(host||"").toLowerCase();
    if(isBlacklisted(h)) return "PROXY 0.0.0.0:0";
    var clientIp = null;
    try{ clientIp = myIpAddress(); }catch(e){ clientIp = null; }
    var clientIsJo = clientIp && isInJoRanges(clientIp);
    var resolved = cachedDnsResolve(h);
    var ipMatch = resolved && isInJoRanges(resolved);
    var strong = clientIsJo || ipMatch;
    var weak = ipMatch;
    var liveProxies = filterProxiesToJordan(PROXIES);
    if(!liveProxies || liveProxies.length === 0) return "PROXY 0.0.0.0:0";
    if(strong) return weightedPickAdaptive(h, liveProxies, 4);
    if(weak) return weightedPickAdaptive(h, liveProxies, 2);
    return "PROXY 0.0.0.0:0";
  }catch(e){
    return "PROXY 0.0.0.0:0";
  }
}
