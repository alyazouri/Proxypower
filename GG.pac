/* ==== PAC: PUBG Jordan IPv6 Final ====
   - IPv6-only
   - يسمح فقط بالنطاقين: 2a03:6b01::/34 (Zain) و 2a03:b640::/32 (Umniah/Batelco)
   - CIDR-accurate validation
   - لا DIRECT: كل شيء خارج النطاقان => PROXY 0.0.0.0:0 (حظر)
   - Sticky proxy لمدة 5 دقائق
   - عدّل PROXY_BY_NAME إلى عناوين البروكسي الفعلية لديك إذا لزم
*/
var ALLOWED = [
  {name:"ZAIN",   cidr:"2a03:6b01::/34", base:"2a03:6b01::"},
  {name:"UMNIAH", cidr:"2a03:b640::/32", base:"2a03:b640::"}
];

var PROXY_BY_NAME = {
  ZAIN:   "2a03:6b01::",   // استبدل بعنوان بروكسي IPv6 حقيقي داخل بادئة Zain إن وُجد
  UMNIAH: "2a03:b640::"    // استبدل بعنوان بروكسي IPv6 حقيقي داخل بادئة Umniah إن وُجد
};

/* بورتات PUBG لكل فئة */
var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };

/* قواعد النطاقات والـ URLs الخاصة باللعبة */
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

/* إعدادات كاش و sticky */
var DNS_TTL_MS = 15000;
var PROXY_STICKY_MS = 300000; // 5 دقائق sticky
var _root = (typeof globalThis !== "undefined") ? globalThis : this;
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if(!C.dns) C.dns = {};
if(!C.pick) C.pick = { name: null, t: 0 };
if(!C.geo) C.geo = { ok:false, name:null, t:0 };

/* ======== IPv6 CIDR helpers ======== */
function isIPv6(s){ return typeof s === "string" && s.indexOf(":") >= 0; }
function parseIPv6Words(addr){
  // يدعم تمثيل IPv4-mapped و :: اختصار
  if(!addr) return null;
  // handle embedded IPv4 (e.g. ::ffff:192.0.2.1)
  if(addr.indexOf('.') !== -1){
    var lastColon = addr.lastIndexOf(':');
    var head = addr.substring(0, lastColon);
    var v4 = addr.substring(lastColon+1);
    var p = v4.split('.');
    if(p.length===4){
      var w6 = ((parseInt(p[0])<<8)|parseInt(p[1])) & 0xffff;
      var w7 = ((parseInt(p[2])<<8)|parseInt(p[3])) & 0xffff;
      addr = head + ":" + w6.toString(16) + ":" + w7.toString(16);
    }
  }
  var parts = addr.split("::");
  var left = parts[0] ? parts[0].split(":") : [];
  var right = (parts.length>1 && parts[1]) ? parts[1].split(":") : [];
  if(parts.length === 1){
    if(left.length !== 8) return null;
    return left.map(function(h){ return parseInt(h||"0",16) & 0xffff; });
  }
  var fill = 8 - (left.length + right.length);
  if(fill < 0) return null;
  var arr = [];
  for(var i=0;i<left.length;i++) arr.push(parseInt(left[i]||"0",16)&0xffff);
  for(var j=0;j<fill;j++) arr.push(0);
  for(var k=0;k<right.length;k++) arr.push(parseInt(right[k]||"0",16)&0xffff);
  return arr.length===8?arr:null;
}
function ipv6InPrefix(ip, base, len){
  var w = parseIPv6Words(ip);
  var pb = parseIPv6Words(base);
  if(!w || !pb) return false;
  var full = Math.floor(len/16), rem = len % 16;
  for(var i=0;i<full;i++){ if(w[i] !== pb[i]) return false; }
  if(rem === 0) return true;
  var mask = (0xffff << (16-rem)) & 0xffff;
  return (w[full] & mask) === (pb[full] & mask);
}
function whichProviderByIp(ip){
  if(!isIPv6(ip)) return null;
  for(var i=0;i<ALLOWED.length;i++){
    var a = ALLOWED[i];
    var sp = a.cidr.split("/"); var base = sp[0]; var len = parseInt(sp[1],10);
    if(ipv6InPrefix(ip, base, len)) return a.name;
  }
  return null;
}

/* ===== DNS cache (returns first) ===== */
function dnsCached(host){
  var now = (new Date()).getTime(), e = C.dns[host];
  if(e && (now - e.t) < DNS_TTL_MS) return e.ip;
  var ip = "";
  try{ ip = dnsResolve(host) || ""; }catch(_){ ip = ""; }
  C.dns[host] = { ip: ip, t: now };
  return ip;
}

/* ===== client detection (is device itself in allowed prefixes?) ===== */
function clientProvider(){
  var now = (new Date()).getTime(), g = C.geo;
  if(g && (now - g.t) < (60*60*1000)) return { ok: g.ok, name: g.name };
  var ip = "";
  try{
    if(typeof myIpAddressEx === "function"){
      var arr = myIpAddressEx();
      if(arr && arr.length>0) ip = arr[0];
    } else ip = myIpAddress();
  }catch(_){ ip = ""; }
  var name = whichProviderByIp(ip);
  var ok = !!name;
  C.geo = { ok: ok, name: name, t: now };
  return { ok: ok, name: name };
}

/* ===== proxy pick: prefer matching provider, else sticky round-robin ===== */
function pickProxyName(){
  var now = (new Date()).getTime();
  if(C.pick.name && (now - C.pick.t) < PROXY_STICKY_MS) return C.pick.name;
  var cp = clientProvider().name;
  var names = ALLOWED.map(function(a){return a.name;});
  var chosen = cp ? cp : names[Math.floor(Math.random()*names.length)];
  C.pick = { name: chosen, t: now };
  return chosen;
}
function bracketIfV6(h){ return isIPv6(h) ? ("["+h+"]") : h; }
function proxyFor(cat){
  var name = pickProxyName();
  var addr = PROXY_BY_NAME[name] || PROXY_BY_NAME.ZAIN;
  var port = FIXED_PORT[cat] || 443;
  return "PROXY " + bracketIfV6(addr) + ":" + port;
}

/* ===== matches helpers ===== */
function lc(s){ return s && s.toLowerCase ? s.toLowerCase() : s; }
function hostMatch(h, arr){ h = lc(h); if(!h) return false; for(var i=0;i<arr.length;i++){ var p = lc(arr[i]); if(shExpMatch(h,p)) return true; if(p.indexOf("*.")===0){ var suf = p.substring(1); if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true; } } return false; }
function urlMatch(u, arr){ if(!u) return false; for(var i=0;i<arr.length;i++) if(shExpMatch(u, arr[i])) return true; return false; }

/* ===== enforcement: allow only if destination inside allowed prefixes ===== */
function resolveHostAndProvider(host){
  // if literal IPv6 => use it
  if(isIPv6(host)) { return {ver:6, ip: host, prov: whichProviderByIp(host)}; }
  // else resolve and check returned ip (first AAAA or A)
  var ip = dnsCached(host);
  if(isIPv6(ip)) return {ver:6, ip: ip, prov: whichProviderByIp(ip)};
  return {ver:0, ip: ip, prov: null}; // not IPv6 or unresolved
}
/* For LOBBY/UPDATES/CDN: require IPv6 JO */
function enforceV6Only(cat, host){
  var r = resolveHostAndProvider(host);
  if(r.ver === 6 && r.prov) return proxyFor(cat);
  // try fallback: if dnsCached returned empty, block
  return "PROXY 0.0.0.0:0";
}
/* For MATCH/RECRUIT: prefer IPv6 JO as well (we are IPv6-only proxy plan) */
function enforceMatch(cat, host){
  var r = resolveHostAndProvider(host);
  if(r.ver === 6 && r.prov) return proxyFor(cat);
  return "PROXY 0.0.0.0:0";
}

/* ===== Main ===== */
function FindProxyForURL(url, host){
  host = lc(host);

  // require that client is inside allowed prefixes (device must be JO IPv6)
  var cp = clientProvider();
  if(!cp.ok) return "PROXY 0.0.0.0:0";

  // MATCH
  if(urlMatch(url, URL_PATTERNS.MATCH) || hostMatch(host, PUBG_DOMAINS.MATCH))
    return enforceMatch("MATCH", host);

  // LOBBY
  if(urlMatch(url, URL_PATTERNS.LOBBY) || hostMatch(host, PUBG_DOMAINS.LOBBY))
    return enforceV6Only("LOBBY", host);

  // RECRUIT_SEARCH
  if(urlMatch(url, URL_PATTERNS.RECRUIT_SEARCH) || hostMatch(host, PUBG_DOMAINS.RECRUIT_SEARCH))
    return enforceMatch("RECRUIT_SEARCH", host);

  // UPDATES
  if(urlMatch(url, URL_PATTERNS.UPDATES) || hostMatch(host, PUBG_DOMAINS.UPDATES))
    return enforceV6Only("UPDATES", host);

  // CDN
  if(urlMatch(url, URL_PATTERNS.CDN) || hostMatch(host, PUBG_DOMAINS.CDN))
    return enforceV6Only("CDN", host);

  // أي شيء آخر => حظر تام (لا DIRECT)
  return "PROXY 0.0.0.0:0";
}
