(function(){

var PROXY_HOST    = "91.106.109.12";
var PROXY_PORT    = 443;
var PROXY_ALLOW   = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
var PROXY_DROP    = "PROXY 0.0.0.0:0";

var DNS_TTL_MS    = 15 * 1000;
var LOCK_TTL_MS   = 90 * 1000;
var TIGHT_HEXETS  = 6;      // أقصى تضييق افتراضي (نفس POP تقريباً)
var USER_PREFIX   = "";     // إذا تريد تثبت بادئة دقيقة ضعها هنا مثل "2a03:b640:4f2a:91c0"
var RELAX_SECONDS = 25;     // بعد هذا المهلة يوسّع الفلترة تلقائياً
var MAX_RELAX_STEP= 3;

var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
if(!ROOT.__PUBG_FINAL2__) ROOT.__PUBG_FINAL2__ = {};
var STATE = ROOT.__PUBG_FINAL2__;

if(!STATE.dns) STATE.dns = {};
if(!STATE.lock) STATE.lock = { isp:null, score:0, t:0 };
if(!STATE.localPref) STATE.localPref = { pref:null, t:0 };
if(!STATE.metrics) STATE.metrics = { lastAllowTime:0, relaxStep:0, lastCheck:0 };

var ISP_V6 = {
  UMNIAH : "2a03:b640",
  ZAIN   : "2a03:6b00",
  ORANGE : "2a00:18d8"
};

var JO_V4 = [
  ["109.104.0.0","109.107.255.255"],
  ["176.16.0.0","176.23.255.255"],
  ["94.56.0.0","94.59.255.255"],
  ["94.64.0.0","94.72.255.255"]
];

var CATS = {
  MATCH:  { url:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"], host:["*.gcloud.qq.com","gpubgm.com","match.igamecj.com","match.proximabeta.com"] },
  RECRUIT:{ url:["*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*"], host:["teamfinder.igamecj.com","teamfinder.proximabeta.com","match.igamecj.com","match.proximabeta.com"] },
  LOBBY:  { url:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"], host:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"] },
  UPDATES:{ url:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets*","*/assetbundle*","*/obb*","*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"], host:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"] }
};

function nowMs(){ return (new Date()).getTime(); }

function dnsCached(h){
  if(!h) return "";
  var n = nowMs();
  var e = STATE.dns[h];
  if(e && (n - e.t) < DNS_TTL_MS) return e.ip;
  var ip = "";
  try{ ip = dnsResolve(h) || ""; }catch(_){ ip = ""; }
  STATE.dns[h] = { ip: ip, t: n };
  return ip;
}

function ip4ToInt(ip){
  var p = ip.split(".");
  return (((parseInt(p[0])<<24)>>>0) + ((parseInt(p[1])<<16)>>>0) + ((parseInt(p[2])<<8)>>>0) + (parseInt(p[3])>>>0));
}

function inJordanV4(ip){
  if(!ip) return false;
  if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
  var n = ip4ToInt(ip);
  for(var i=0;i<JO_V4.length;i++){
    var lo = ip4ToInt(JO_V4[i][0]), hi = ip4ToInt(JO_V4[i][1]);
    if(n>=lo && n<=hi) return true;
  }
  return false;
}

function expandV6(ip){
  if(!ip) return "";
  if(ip.indexOf(":")===-1) return ip;
  if(ip.indexOf("::")===-1) return ip.toLowerCase();
  var seg = ip.split(":"), L = [], R = [], gap = false;
  for(var i=0;i<seg.length;i++){
    if(seg[i]===""){ gap = true; continue; }
    if(!gap) L.push(seg[i]); else R.push(seg[i]);
  }
  var need = 8 - (L.length + R.length), z = [];
  for(var j=0;j<need;j++) z.push("0");
  return L.concat(z).concat(R).join(":").toLowerCase();
}

function v6StartsWith(ip,pref){
  if(!ip) return false;
  if(ip.indexOf(":")===-1) return false;
  var full = expandV6(ip);
  pref = pref.toLowerCase().replace(/:+$/,'');
  return (full.indexOf(pref)===0);
}

function getLocalPref(hexets){
  var n = nowMs();
  if(USER_PREFIX){
    if(STATE.localPref.pref !== USER_PREFIX) STATE.localPref = { pref: USER_PREFIX, t: n };
    return USER_PREFIX;
  }
  if(STATE.localPref.pref && (n - STATE.localPref.t) < DNS_TTL_MS) return STATE.localPref.pref;
  var me = "";
  try{ me = myIpAddress(); }catch(_){ me = ""; }
  if(!me || me.indexOf(":")===-1){ STATE.localPref = { pref: null, t: n }; return null; }
  var low = me.toLowerCase();
  if(low.indexOf("fe80:")===0 || low.indexOf("fd")===0){ STATE.localPref = { pref: null, t: n }; return null; }
  var full = expandV6(me);
  var parts = full.split(":");
  var take = Math.min(hexets, parts.length);
  var tight = parts.slice(0, take).join(":");
  STATE.localPref = { pref: tight, t: n };
  return tight;
}

function ispScore(ip){
  if(!ip) return { isp:null, score:0, tier:null };
  var tight = getLocalPref(TIGHT_HEXETS);
  if(tight && v6StartsWith(ip, tight)) return { isp:"LOCALPOP", score:300, tier:"tight" };
  if(v6StartsWith(ip, ISP_V6.UMNIAH)) return { isp:"UMNIAH", score:200, tier:"ispv6" };
  if(v6StartsWith(ip, ISP_V6.ZAIN))   return { isp:"ZAIN",   score:200, tier:"ispv6" };
  if(v6StartsWith(ip, ISP_V6.ORANGE)) return { isp:"ORANGE", score:200, tier:"ispv6" };
  if(inJordanV4(ip)) return { isp:"JOV4", score:100, tier:"v4" };
  return { isp:null, score:0, tier:null };
}

function matchAny(v,arr){
  if(!v) return false;
  v = v.toLowerCase();
  for(var i=0;i<arr.length;i++){
    var p = arr[i];
    if(shExpMatch(v,p)) return true;
    if(p.indexOf("*.")===0){
      var suf = p.substring(1);
      if(v.length>=suf.length && v.substring(v.length - suf.length) === suf) return true;
    }
  }
  return false;
}

function classify(url, host){
  if(matchAny(url, CATS.MATCH.url) || matchAny(host, CATS.MATCH.host)) return "MATCH";
  if(matchAny(url, CATS.RECRUIT.url) || matchAny(host, CATS.RECRUIT.host)) return "RECRUIT";
  if(matchAny(url, CATS.LOBBY.url) || matchAny(host, CATS.LOBBY.host)) return "LOBBY";
  if(matchAny(url, CATS.UPDATES.url) || matchAny(host, CATS.UPDATES.host)) return "UPDATES";
  return null;
}

function getLock(){ var n = nowMs(); var L = STATE.lock; if(L.isp && (n - L.t) < LOCK_TTL_MS) return L; return { isp:null, score:0, t:0 }; }
function setLock(isp,score){ STATE.lock = { isp: isp, score: score, t: nowMs() }; }

function allowMatch(info){
  var lock = getLock();
  var last = STATE.metrics.lastAllowTime || 0;
  var elapsed = nowMs() - last;

  // strict first: LOCALPOP
  if(info.score >= 300){
    if(lock.score >= 300 && lock.isp !== info.isp) return false;
    setLock(info.isp, info.score);
    STATE.metrics.lastAllowTime = nowMs();
    return true;
  }

  // if no LOCALPOP found recently, allow ISPv6 after RELAX_SECONDS
  if(info.score >= 200){
    if(lock.score >= 300) return false;
    if(lock.score >= 200 && lock.isp !== info.isp) return false;
    if(elapsed < (RELAX_SECONDS * 1000) && lock.score === 0) return false;
    setLock(info.isp, info.score);
    STATE.metrics.lastAllowTime = nowMs();
    return true;
  }

  // IPv4 fallback (last resort)
  if(info.score >= 100){
    if(lock.score >= 200) return false;
    if(lock.score >= 100 && lock.isp !== info.isp) return false;
    if(elapsed < (RELAX_SECONDS * 1000) && lock.score === 0) return false;
    setLock(info.isp, info.score);
    STATE.metrics.lastAllowTime = nowMs();
    return true;
  }

  return false;
}

function allowRecruit(info){
  return (info.score >= 100);
}

function allowLobby(info){
  return (info.score >= 100);
}

function allowUpdates(info){
  return (info.score >= 100);
}

function policy(cat, info){
  if(cat === "MATCH") return allowMatch(info);
  if(cat === "RECRUIT") return allowRecruit(info);
  if(cat === "LOBBY") return allowLobby(info);
  if(cat === "UPDATES") return allowUpdates(info);
  return false;
}

function FindProxyForURL(url, host){
  if(host && host.toLowerCase) host = host.toLowerCase();

  if(isPlainHostName(host) || shExpMatch(host, "*.local")) return "DIRECT";

  if(shExpMatch(url, "*apple.com/library/test/*") || shExpMatch(host, "captive.apple.com")) return "DIRECT";

  var cat = classify(url, host);
  if(!cat) return "DIRECT";

  var dst = dnsCached(host);
  if(!dst) return PROXY_DROP;

  var info = ispScore(dst);
  if(!policy(cat, info)) return PROXY_DROP;

  // if local/ispv6 try DIRECT first then proxy; else use proxy (Jordan egress)
  if(info.tier === "tight" || info.tier === "ispv6"){
    return "DIRECT; " + PROXY_ALLOW;
  }

  return PROXY_ALLOW;
}

this.FindProxyForURL = FindProxyForURL;

})();
