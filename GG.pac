/* ==== PUBG Jordan IPv6 Strict PAC (Final) ====
   - IPv6 only (Zain / Umniah)
   - Real Jordanian IPv6 proxy
   - Sticky 10 minutes
   - Only PUBG traffic via proxy
   - No CGNAT / VPN
*/

var PROXY_V6 = [
  "2a03:6b01::1",   // مثال بروكسي Zain (استبدل بعنوانك الفعلي)
  "2a03:b640::1"    // مثال بروكسي Umniah (استبدل بعنوانك الفعلي)
];

var FIXED_PORT = {
  LOBBY:443,
  MATCH:20001,
  RECRUIT_SEARCH:443,
  UPDATES:80,
  CDN:80
};

var STICKY_MS = 600000; // 10 دقائق
var _root = (typeof globalThis !== "undefined") ? globalThis : this;
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if(!C.pick6) C.pick6 = { h: null, t: 0 };

function lc(s){return s && s.toLowerCase ? s.toLowerCase() : s;}
function isIPv6(s){return typeof s === "string" && s.indexOf(":") >= 0;}
function bracket(h){return isIPv6(h) ? "[" + h + "]" : h;}
function pickV6(){
  var now = Date.now();
  if(C.pick6.h && (now - C.pick6.t) < STICKY_MS) return C.pick6.h;
  var h = PROXY_V6[Math.floor(Math.random() * PROXY_V6.length)] || "2a03:6b01::1";
  C.pick6 = { h: h, t: now };
  return h;
}
function proxyFor(cat){ var p = FIXED_PORT[cat] || 443; return "PROXY " + bracket(pickV6()) + ":" + p; }
function hostMatch(h, arr){h = lc(h); if(!h) return false; for(var i=0; i<arr.length; i++){var p=lc(arr[i]); if(shExpMatch(h,p)) return true; if(p.indexOf("*.")===0){var suf=p.substring(1); if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;}} return false;}
function urlMatch(u, arr){if(!u) return false; for(var i=0;i<arr.length;i++) if(shExpMatch(u, arr[i])) return true; return false;}

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

function FindProxyForURL(url, host) {
  host = lc(host);
  if (urlMatch(url, URL_PATTERNS.MATCH) || hostMatch(host, PUBG_DOMAINS.MATCH))
    return proxyFor("MATCH");
  if (urlMatch(url, URL_PATTERNS.LOBBY) || hostMatch(host, PUBG_DOMAINS.LOBBY))
    return proxyFor("LOBBY");
  if (urlMatch(url, URL_PATTERNS.RECRUIT_SEARCH) || hostMatch(host, PUBG_DOMAINS.RECRUIT_SEARCH))
    return proxyFor("RECRUIT_SEARCH");
  if (urlMatch(url, URL_PATTERNS.UPDATES) || hostMatch(host, PUBG_DOMAINS.UPDATES))
    return proxyFor("UPDATES");
  if (urlMatch(url, URL_PATTERNS.CDN) || hostMatch(host, PUBG_DOMAINS.CDN))
    return proxyFor("CDN");
  return "DIRECT";
}
