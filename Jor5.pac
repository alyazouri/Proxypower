/* PAC - Jordan (Stability Mode)
   - Sticky proxy during session
   - Zero jitter on sticky port (fixed UDP port per host)
   - Longer sticky TTL (30min)
   - Reduced ping-measure sensitivity
*/
function FindProxyForURL(url, host) {

  // ---------------- CONFIG (tuned for stability) ----------------
  var PROXIES = [
    { ip: "91.106.109.12", ports: [20001], weight: 5 },
    { ip: "176.28.250.122", ports: [8080], weight: 3 },
    { ip: "79.173.251.142", ports: [8000], weight: 2 }
  ];

  var JO_IP_SUBNETS = [ /* << your existing list (unchanged) >> */ ];
  var DNS_CACHE_TTL_MS = 90 * 1000;    // cache longer to avoid frequent resolves
  var PING_TIMEOUT_MS   = 200;         // lower sensitivity but still permissive
  var JITTER_WINDOW     = 0;           // NO jitter — fixed port choice
  var STICKY_PORT_TTL   = 30 * 60 * 1000; // 30 minutes sticky port
  var PROXY_STICKY_TTL  = 30 * 60 * 1000; // 30 minutes stick to chosen proxy
  var MAX_SWITCH_PENALTY = 1.5;        // require big score improvement to switch proxy

  if (typeof __JO_CACHE === "undefined") {
    __JO_CACHE = { dns: {}, stickyPorts: {}, lastGeoValid: {}, proxySession: {} };
  }

  function nowMs(){ return (new Date()).getTime(); }

  function cacheDNS(name) {
    var e = __JO_CACHE.dns[name];
    if (e && (nowMs()-e.t) < DNS_CACHE_TTL_MS) return e.ip;
    var ip = dnsResolve(name);
    __JO_CACHE.dns[name] = { ip: ip, t: nowMs() };
    return ip;
  }

  function isIPInJordan(ip){
    if(!ip) return false;
    for(var i=0;i<JO_IP_SUBNETS.length;i++){
      if(isInNet(ip, JO_IP_SUBNETS[i][0], JO_IP_SUBNETS[i][1])) return true;
    }
    return false;
  }

  function geoCheckProxy(proxy){
    var key = proxy.ip;
    var c = __JO_CACHE.lastGeoValid[key];
    if(c && (nowMs()-c.t) < DNS_CACHE_TTL_MS) return c.valid;
    var v = isIPInJordan(proxy.ip);
    __JO_CACHE.lastGeoValid[key] = { valid: v, t: nowMs() };
    return v;
  }

  // lightweight resolve-based "ping"
  function measureResolveDelay(hostname){
    var t0 = nowMs();
    var ip = dnsResolve(hostname);
    var t1 = nowMs();
    if(!ip) return { ip:null, ms:9999 };
    return { ip: ip, ms: (t1 - t0) };
  }

  function scoreProxy(proxy){
    if(!geoCheckProxy(proxy)) return -9999;
    var r = measureResolveDelay(proxy.ip);
    var ping = r.ms || 9999;
    var s = proxy.weight / (1 + ping);
    if(proxy.ports && proxy.ports.indexOf(20001) !== -1) s *= 1.1;
    return { score: s, ping: ping };
  }

  // pick but avoid frequent switching: sticky session per host
  function chooseStableProxy(host){
    var sessionKey = host + "@proxy";
    var session = __JO_CACHE.proxySession[sessionKey];
    var best = null, bestScore = -9999;

    for(var i=0;i<PROXIES.length;i++){
      var p = PROXIES[i];
      var sc = scoreProxy(p);
      if(sc.score > bestScore){ bestScore = sc.score; best = { proxy: p, score: sc.score, ping: sc.ping }; }
    }
    if(!best) return null;

    // if we already have a session and it's still within PROXY_STICKY_TTL, keep it unless new best vastly better
    if(session && (nowMs() - session.t) < PROXY_STICKY_TTL){
      // find session proxy in list
      if(session.proxy && session.proxy.ip){
        var currentScore = -9999;
        for(var j=0;j<PROXIES.length;j++){
          if(PROXIES[j].ip === session.proxy.ip){ currentScore = scoreProxy(PROXIES[j]).score; break; }
        }
        // only switch if new best > currentScore * MAX_SWITCH_PENALTY
        if(best.score > currentScore * MAX_SWITCH_PENALTY){
          __JO_CACHE.proxySession[sessionKey] = { proxy: best.proxy, t: nowMs() };
          return best.proxy;
        } else {
          // keep existing session proxy
          return session.proxy;
        }
      }
    }

    // create new session
    __JO_CACHE.proxySession[sessionKey] = { proxy: best.proxy, t: nowMs() };
    return best.proxy;
  }

  // deterministic sticky port per host (no jitter)
  function hashHostToIndex(host, n){
    var h = 0; for(var i=0;i<host.length;i++) h = ((h<<5)-h)+host.charCodeAt(i);
    return Math.abs(h) % n;
  }

  function getStickyPortForHost(host, proxy){
    var key = host + "@" + proxy.ip;
    var e = __JO_CACHE.stickyPorts[key];
    if(e && (nowMs()-e.t) < STICKY_PORT_TTL) return e.port;
    var ports = proxy.ports || [443];
    var idx = hashHostToIndex(host, ports.length);
    var port = ports[idx];
    __JO_CACHE.stickyPorts[key] = { port: port, t: nowMs() };
    return port;
  }

  function isGameHost(h){
    h = h.toLowerCase();
    if(shExpMatch(h,"*.pubg.com")||shExpMatch(h,"*.pubgmobile.com")||h.indexOf("pubg")!=-1||h.indexOf("tencent")!=-1) return true;
    return false;
  }

  // -------------------- main --------------------
  var resolved = cacheDNS(host);
  if(resolved && isIPInJordan(resolved)){
    // allow direct for non-game to reduce proxy load, but game forced via proxy
    if(!isGameHost(host)) return "DIRECT";
  }

  var chosen = chooseStableProxy(host);
  if(!chosen){
    // fallback safe proxy
    chosen = PROXIES[0];
  }

  if(isGameHost(host)){
    // force SOCKS5 to ensure UDP associate on sticky port (stable UDP)
    var sp = getStickyPortForHost(host, chosen);
    return "SOCKS5 " + chosen.ip + ":" + sp;
  }

  // normal web traffic via proxy first HTTP port (also sticky)
  var hp = getStickyPortForHost(host, chosen);
  return "PROXY " + chosen.ip + ":" + hp;
}
