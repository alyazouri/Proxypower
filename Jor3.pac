// ======================================================================
// PAC – PUBG Mobile (Ultra Ping-Focused & Stable Routing)
// - Single Jordanian proxy (no fallbacks)
// - Goal: minimize observed DNS/resolve latency (heuristic for low ping)
// - Aggressive sticky choices to avoid flapping and keep connections stable
// ======================================================================

const PROXY_PRIMARY = "91.106.109.12";

const GAME_PORTS = [20001, 20003, 8080, 8443, 8085];
const LOBBY_PORTS = [443, 8080, 8443];
const DNS_CACHE_TTL_MS = 20_000;
const STICKY_TTL_MS = 120_000;
const EXCELLENT_MS = 15;
const VERY_GOOD_MS = 30;
const GOOD_MS = 80;
const MAX_ACCEPT_MS = 300;
const JITTER_WINDOW = 1;

var dnsCache = {};
var stickyMap = {}; // host -> { mode: "DIRECT"|"PROXY", proxy, port, ts }
var portHist = {};  // host->port -> lastUsedTs (keeps port stickiness)

// deterministic small hash
function h(s){
  var x = 0;
  for(var i=0;i<s.length;i++){ x = ((x<<5)-x)+s.charCodeAt(i); x = x & x; }
  return Math.abs(x);
}

function cachedResolve(host){
  var now = Date.now();
  var e = dnsCache[host];
  if(e && (now - e.ts) < DNS_CACHE_TTL_MS) return e.ip;
  try{
    var ip = dnsResolve(host);
    dnsCache[host] = { ip: ip, ts: now };
    return ip;
  }catch(err){
    dnsCache[host] = { ip: null, ts: now };
    return null;
  }
}

function measureResolveMs(x){
  var t0 = Date.now();
  try { dnsResolve(x); } catch(e){}
  return Date.now() - t0;
}

function choosePort(host, ports){
  if(!ports || ports.length===0) return 443;
  // sticky per-host: prefer previously used port if recent
  var now = Date.now();
  var ph = portHist[host] || {};
  for(var p in ph){
    if((now - ph[p]) < STICKY_TTL_MS && ports.indexOf(Number(p)) !== -1) return Number(p);
  }
  var idx = h(host) % ports.length;
  var jitter = (h(host) % (JITTER_WINDOW*2+1)) - JITTER_WINDOW;
  idx = (idx + jitter + ports.length) % ports.length;
  var port = ports[idx];
  ph[port] = now;
  portHist[host] = ph;
  return port;
}

function isPrivateOrLocal(host){
  if(!host) return true;
  if(isPlainHostName(host)) return true;
  if(shExpMatch(host,"*.local")) return true;
  var ip = cachedResolve(host);
  if(!ip) return false;
  if(isInNet(ip,"185.140.0.0","255.255.0.0")) return true;
  if(isInNet(ip,"172.16.0.0","255.240.0.0")) return true;
  if(isInNet(ip,"192.168.0.0","255.255.0.0")) return true;
  if(isInNet(ip,"127.0.0.0","255.0.0.0")) return true;
  return false;
}

function pickModeForHost(host){
  var now = Date.now();
  var sticky = stickyMap[host];
  if(sticky && (now - sticky.ts) < STICKY_TTL_MS){
    return { mode: sticky.mode, proxy: sticky.proxy, port: sticky.port };
  }

  var hostResolve = measureResolveMs(host);
  var proxyResolve = measureResolveMs(PROXY_PRIMARY);

  // If host resolves extremely fast (likely local / very close), prefer DIRECT
  if(hostResolve <= EXCELLENT_MS){
    var port = choosePort(host, LOBBY_PORTS);
    stickyMap[host] = { mode: "DIRECT", proxy: null, port: port, ts: now };
    return { mode: "DIRECT", proxy: null, port: port };
  }

  // If proxy resolves much faster than host (indicating proxy is closer), use proxy
  if(proxyResolve + 5 < hostResolve && proxyResolve <= GOOD_MS){
    var portG = choosePort(host, GAME_PORTS);
    stickyMap[host] = { mode: "PROXY", proxy: PROXY_PRIMARY, port: portG, ts: now };
    return { mode: "PROXY", proxy: PROXY_PRIMARY, port: portG };
  }

  // If host is reasonably good, use proxy only for game ports to keep stability low-latency
  if(hostResolve <= VERY_GOOD_MS){
    var p = choosePort(host, GAME_PORTS);
    stickyMap[host] = { mode: "PROXY", proxy: PROXY_PRIMARY, port: p, ts: now };
    return { mode: "PROXY", proxy: PROXY_PRIMARY, port: p };
  }

  // If host resolve is slow but not terrible, test whether DIRECT or PROXY yields lower resolve
  if(hostResolve <= MAX_ACCEPT_MS){
    // prefer whichever had lower resolve time in this check
    if(proxyResolve <= hostResolve){
      var pg = choosePort(host, GAME_PORTS);
      stickyMap[host] = { mode: "PROXY", proxy: PROXY_PRIMARY, port: pg, ts: now };
      return { mode: "PROXY", proxy: PROXY_PRIMARY, port: pg };
    } else {
      var pl = choosePort(host, LOBBY_PORTS);
      stickyMap[host] = { mode: "DIRECT", proxy: null, port: pl, ts: now };
      return { mode: "DIRECT", proxy: null, port: pl };
    }
  }

  // Extremely slow resolves -> prefer DIRECT (avoid proxy adding latency) but keep sticky short
  var fallbackPort = choosePort(host, LOBBY_PORTS);
  stickyMap[host] = { mode: "DIRECT", proxy: null, port: fallbackPort, ts: now };
  return { mode: "DIRECT", proxy: null, port: fallbackPort };
}

function FindProxyForURL(url, host){
  host = (host || "").toLowerCase();
  url  = (url || "").toLowerCase();

  if(isPrivateOrLocal(host)) return "DIRECT";
  if(shExpMatch(host,"*.youtube.com") || host.indexOf("youtube.com") !== -1) return "DIRECT";

  var decision = pickModeForHost(host);

  // Extra safety: if resolve time is enormous, return DIRECT to avoid hanging
  var r = measureResolveMs(host);
  if(r > 800) return "DIRECT";

  if(decision.mode === "DIRECT") return "DIRECT";
  return "SOCKS5 " + decision.proxy + ":" + decision.port;
}
