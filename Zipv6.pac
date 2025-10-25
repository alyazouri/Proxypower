// PAC صارم للغاية – يرفع احتمال أن تكون المباريات واللاعبون أردنيين
// متطلبات: جهاز يدعم IPv6، وبروكسي أردني ثابت يدعم IPv6 (ويُفضل UDP forwarding إذا الحاجة للماتش).
// Proxy candidates - ضع هنا بوابات أردنية فعلية (IP أو hostname)
var PROXY_CANDIDATES = ["91.106.109.12"]; // اتركها كما هي أو زد عناوين أردنية أخرى

// بورتات ثابتة لكل فئة
var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };

// بادئات IPv6 لكل فئة كما طلبت
var JO_PREFIX = {
  LOBBY: ["2a03:6b00"],   // زين 2a03:6b00::/29
  MATCH: ["2a03:b640"]    // أمنية/Umniah 2a03:b640::/32
};

// cache & sticky
var CACHE_ROOT = (typeof globalThis !== "undefined"? globalThis : this);
if (!CACHE_ROOT._PAC_JO_CACHE) CACHE_ROOT._PAC_JO_CACHE = {};
var CACHE = CACHE_ROOT._PAC_JO_CACHE;
if (!CACHE.dns) CACHE.dns = {};
if (!CACHE.proxyPick) CACHE.proxyPick = {host:null, t:0, latency:Infinity};

// TTLs (قابل للتعديل)
var DNS_TTL_MS = 15*1000;
var PROXY_STICKY_TTL_MS = 60*1000; // sticky proxy لمدة 60 ثانية
var GEO_TTL_MS = 60*60*1000;

// دومينات و URL patterns لببجي كما في السكربتات السابقة
var PUBG_DOMAINS = {
  LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};
var URL_PATTERNS = {
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

// دوال مساعدة
function hostMatches(h, patterns){
  if(!h) return false;
  h = h.toLowerCase();
  for(var i=0;i<patterns.length;i++){
    if(shExpMatch(h, patterns[i])) return true;
    if(patterns[i].indexOf("*.")===0){
      var suf = patterns[i].substring(1);
      if(h.length >= suf.length && h.substring(h.length - suf.length) === suf) return true;
    }
  }
  return false;
}

function resolveCached(h, ttl){
  if(!h) return "";
  var now = (new Date()).getTime();
  var c = CACHE.dns[h];
  if(c && (now - c.t) < ttl) return c.ip;
  var ip = "";
  try { ip = dnsResolve(h) || ""; } catch(e){ ip = ""; }
  CACHE.dns[h] = {ip: ip, t: now};
  return ip;
}

// Expand IPv6 '::' (تقريب بسيط) للحصول على أول مقطعين
function normalizeIPv6(ip){
  if(!ip) return "";
  if(ip.indexOf('::') === -1) return ip;
  var parts = ip.split(':');
  var left=[], right=[];
  var sep=false;
  for(var i=0;i<parts.length;i++){
    if(parts[i]===''){ sep=true; continue; }
    if(!sep) left.push(parts[i]); else right.push(parts[i]);
  }
  var missing = 8 - (left.length + right.length);
  var zeros = [];
  for(var j=0;j<missing;j++) zeros.push('0');
  var combined = left.concat(zeros).concat(right);
  return combined.join(':');
}

function ipMatchesPrefix(ip, prefixes){
  if(!ip || ip.indexOf(':')===-1) return false;
  var ipn = normalizeIPv6(ip.toLowerCase());
  var parts = ipn.split(':');
  if(parts.length < 2) return false;
  var first = parseInt(parts[0],16);
  var second = parseInt(parts[1],16);
  for(var i=0;i<prefixes.length;i++){
    var p = prefixes[i].toLowerCase().replace(/:+$/,'');
    if(ip.toLowerCase() === p) return true;
    if(ip.toLowerCase().indexOf(p + '::') === 0) return true;
    if(ip.toLowerCase().indexOf(p + ':') === 0) return true;
    // check basic segments (fast)
    var pparts = p.split(':');
    var p0 = parseInt(pparts[0],16);
    var p1 = (pparts.length>1)? parseInt(pparts[1],16) : null;
    if(p0 === first && (p1===null || p1 === second)) return true;
  }
  return false;
}

// measure dnsResolve time (بديل بنغ داخل PAC)
function measureResolve(host){
  if(/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.indexOf(':')!==-1) return 1;
  try{
    var s = (new Date()).getTime();
    var r = dnsResolve(host);
    var d = (new Date()).getTime() - s;
    if(!r) return 10000;
    return d>0?d:1;
  } catch(e){ return 10000; }
}

// pick best proxy (sticky)
function pickProxy(){
  var now = (new Date()).getTime();
  if(CACHE.proxyPick.host && (now - CACHE.proxyPick.t) < PROXY_STICKY_TTL_MS) return CACHE.proxyPick.host;
  var best = null; var bestLat = Infinity;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){
    var c = PROXY_CANDIDATES[i];
    var lat = measureResolve(c);
    if(lat < bestLat){ bestLat = lat; best = c; }
  }
  if(!best) best = PROXY_CANDIDATES[0];
  CACHE.proxyPick = {host: best, t: now, latency: bestLat};
  return best;
}

function proxyFor(cat){
  var host = pickProxy();
  var port = FIXED_PORT[cat] || 443;
  return "PROXY " + host + ":" + port;
}

// check client & proxy are "Jordan" (optional, لكن يحسن النتيجة)
function clientIsJO(){
  var now = (new Date()).getTime();
  var c = CACHE.clientGeo;
  if(c && (now - c.t) < GEO_TTL_MS) return c.ok;
  var ip = "";
  try { ip = myIpAddress(); } catch(e){ ip=""; }
  var ok = ipMatchesPrefix(ip, JO_PREFIX.LOBBY) || ipMatchesPrefix(ip, JO_PREFIX.MATCH);
  CACHE.clientGeo = {ok: ok, t: now};
  return ok;
}
function proxyIsJO(){
  var now = (new Date()).getTime();
  var c = CACHE.proxyGeo;
  if(c && (now - c.t) < GEO_TTL_MS) return c.ok;
  var p = pickProxy();
  var ok = ipMatchesPrefix(p, JO_PREFIX.LOBBY) || ipMatchesPrefix(p, JO_PREFIX.MATCH) || (/^\d+\.\d+\.\d+\.\d+$/.test(p) && false);
  CACHE.proxyGeo = {ok: ok, t: now};
  return ok;
}

// Decision core: enforce category prefixes strictly
function enforceCategory(cat, host){
  var ip = resolveCached(host, DNS_TTL_MS);
  if(!ip) return "PROXY 0.0.0.0:0";
  if(!ipMatchesPrefix(ip, JO_PREFIX[cat])) return "PROXY 0.0.0.0:0";
  return proxyFor(cat);
}

// final FindProxyForURL
function FindProxyForURL(url, host) {
  if(host && host.toLowerCase) host = host.toLowerCase();

  // preliminary: ensure client and proxy appear Jordanian
  if(!clientIsJO() || !proxyIsJO()){
    // بدل الحظر الكلي، نعطيك بلوك صارم
    return "PROXY 0.0.0.0:0";
  }

  // prioritize MATCH patterns
  if(shExpMatch(url, "*/matchmaking/*") || hostMatches(host, PUBG_DOMAINS.MATCH) || shExpMatch(url,"*/game/join*")){
    return enforceCategory("MATCH", host);
  }

  // LOBBY / presence / login
  if(shExpMatch(url,"*/account/login*") || hostMatches(host, PUBG_DOMAINS.LOBBY) || shExpMatch(url,"*/status/heartbeat*")){
    return enforceCategory("LOBBY", host);
  }

  // recruit search -> treat as LOBBY
  if(hostMatches(host, PUBG_DOMAINS.RECRUIT_SEARCH) || shExpMatch(url,"*/teamfinder/*")){
    return enforceCategory("RECRUIT_SEARCH", host);
  }

  // updates / CDN -> require LOBBY prefix (أردني)
  if(hostMatches(host, PUBG_DOMAINS.UPDATES) || hostMatches(host, PUBG_DOMAINS.CDN) || shExpMatch(url,"*/patch*")){
    return enforceCategory("UPDATES", host);
  }

  // direct literal
  var direct = host;
  if(direct.indexOf(':')===-1) direct = resolveCached(host, DNS_TTL_MS);
  if(ipMatchesPrefix(direct, "MATCH")) return proxyFor("MATCH");
  if(ipMatchesPrefix(direct, "LOBBY")) return proxyFor("LOBBY");

  // default: block
  return "PROXY 0.0.0.0:0";
}
