// jo_pubg_autoping_dynamic.pac
// بروكسي: 91.106.109.12:1080
// ميزات:
// 1) FORCE_JO_PROXY للتبديل السريع لرينجات الأردن بين DIRECT و PROXY
// 2) Auto-Ping: قياس زمني بسيط باستخدام dnsResolve مع كاش 60s + عتبات 30/60ms
// 3) دومينات PUBG تختار أسرع مسار تلقائي (بروكسي أو مباشر)
// 4) منافذ الماتش (20001-20003) + التجنيد (10010,11000) دائماً عبر البروكسي
// ملاحظة: PAC يوجّه HTTP/HTTPS (TCP). UDP الحقيقي يتطلب SOCKS5-UDP/TUN على الجهاز/الراوتر.

var PROXY = "PROXY 91.106.109.12:1080";

// 🔧 بدّل حسب رغبتك:
// false = رينجات الأردن DIRECT (أداء أفضل) [افتراضي]
// true  = رينجات الأردن عبر البروكسي (إجبار توحيد مسار/هوية IP)
var FORCE_JO_PROXY = false;

// دومينات PUBG الأساسية
var PUBG_DOMAINS = [
  "*.proximabeta.com",
  "*.igamecj.com",
  "*.tencentgames.com",
  "*.tencent.com",
  "*.pubgmobile.com",
  "*.pubgmobile.net",
  "*.gcloud.qq.com",
  "*.cdn.pubgmobile.com",
  "*.dl.pubgmobile.com",
  "*.app.pubgmobile.com",
  "*.unity3d.com",
  "*.akamaized.net"
];

// منافذ الماتش والتجنيد
var MATCH_PORTS   = {20001:true,20002:true,20003:true};
var RECRUIT_PORTS = {10010:true,11000:true};

// رينجات IPv6 الأردنية
var JO_V6_RANGES = [
  {
    from_prefix: "2a00:18d8:150::/64",
    to_prefix:   "2a00:18d8:150:88c::/64",
    from_address:"2a00:18d8:0150:0000:0000:0000:0000:0000",
    to_address:  "2a00:18d8:0150:088c:ffff:ffff:ffff:ffff"
  }
];

// ===== Helpers =====
function padLeft(s,len){ return ("0000"+s).substr(-len); }
function expandIPv6ToHex(ip){
  if(!ip||ip.indexOf(':')===-1) return null;
  var parts=ip.split('::'),L=[],R=[];
  if(parts.length===1){ L=ip.split(':'); }
  else { L=(parts[0]==='')?[]:parts[0].split(':'); R=(parts[1]==='')?[]:parts[1].split(':'); }
  for(var i=0;i<L.length;i++) L[i]=padLeft(L[i],4);
  for(var j=0;j<R.length;j++) R[j]=padLeft(R[j],4);
  var miss=8-(L.length+R.length),mid=[]; for(var k=0;k<miss;k++) mid.push("0000");
  var full=L.concat(mid).concat(R); if(full.length!==8) return null;
  return full.join('').toLowerCase();
}
function ipv6HexInRange(expHex, fromHex, toHex){
  return !!(expHex && fromHex && toHex) && (expHex >= fromHex && expHex <= toHex);
}
function resolveToIPv6(host){
  if(host.indexOf(':')!==-1) return host;
  try{ var r=dnsResolve(host); if(r && r.indexOf(':')!==-1) return r; }catch(e){}
  return null;
}
function isDomainMatch(host, pattern){
  var h=host.toLowerCase(), p=pattern.toLowerCase();
  if(p.indexOf('*.')===0){ var base=p.substr(2); return (h===base||h.endsWith('.'+base)); }
  return h===p;
}
function isPUBGDomain(host){
  for(var i=0;i<PUBG_DOMAINS.length;i++) if(isDomainMatch(host,PUBG_DOMAINS[i])) return true;
  return false;
}
function extractPort(u){
  var m = u.match(/^[a-z0-9+.-]+:\\/\\/[^\\/]*:(\\d+)(?:\\/|$)/i);
  if(m && m[1]) return parseInt(m[1],10);
  if(u.indexOf("https:")===0) return 443;
  if(u.indexOf("http:")===0)  return 80;
  return -1;
}

// ===== Auto-Ping Logic (with cache & hysteresis) =====
var PING_CACHE = { value: "PROXY", ms: 0, ts: 0 }; // value: "PROXY" or "DIRECT"
var PING_TARGET = "91.106.109.12"; // نقيس استجابة البروكسي الأردني
var PING_CACHE_TTL_MS = 60000;     // 60 ثانية
var THRESH_FAST = 30;  // ms: أسرع من هذا => PROXY
var THRESH_SLOW = 60;  // ms: أبطأ من هذا => DIRECT

function nowMs(){ return (new Date()).getTime(); }

function measureProxyLatencyMs() {
  var t1 = nowMs();
  try { dnsResolve(PING_TARGET); } catch(e) {}
  var t2 = nowMs();
  var dt = t2 - t1;
  if (dt < 0) dt = 0;
  return dt;
}

// يعيد "PROXY" أو "DIRECT" حسب القياس مع هسترة
function decideRouteByLatency() {
  var t = nowMs();
  if (t - PING_CACHE.ts < PING_CACHE_TTL_MS && PING_CACHE.ms > 0) {
    return PING_CACHE.value;
  }
  var ms = measureProxyLatencyMs();

  var val = PING_CACHE.value;
  if (val === "PROXY") {
    // لا نتحول لـ DIRECT إلا إذا صار بطيئ > THRESH_SLOW
    if (ms > THRESH_SLOW) val = "DIRECT";
  } else {
    // لا نتحول لـ PROXY إلا إذا صار سريع < THRESH_FAST
    if (ms < THRESH_FAST) val = "PROXY";
  }

  PING_CACHE = { value: val, ms: ms, ts: t };
  return val;
}

// ===== Main =====
function FindProxyForURL(url, host){
  if(isPlainHostName(host)||host==="localhost") return "DIRECT";

  // منافذ الماتش/التجنيد دائماً عبر البروكسي (TCP ضمن PAC)
  var port = extractPort(url);
  if (MATCH_PORTS[port] || RECRUIT_PORTS[port]) return PROXY;

  // دومينات PUBG: نختار أسرع مسار ديناميكياً
  if (isPUBGDomain(host)) {
    var dyn = decideRouteByLatency(); // "PROXY" أو "DIRECT"
    return (dyn === "PROXY") ? PROXY : "DIRECT";
  }

  // إذا الهدف يقع داخل رينجات IPv6 الأردنية => حسب FORCE_JO_PROXY
  var v6 = resolveToIPv6(host);
  if (v6 && v6.indexOf(':')!==-1) {
    var hex = expandIPv6ToHex(v6);
    if (hex) {
      for (var i=0;i<JO_V6_RANGES.length;i++){
        var r = JO_V6_RANGES[i];
        var fromHex = r.from_address.replace(/:/g,'').toLowerCase();
        var toHex   = r.to_address.replace(/:/g,'').toLowerCase();
        if (ipv6HexInRange(hex, fromHex, toHex)) {
          return FORCE_JO_PROXY ? PROXY : "DIRECT";
        }
      }
    }
  }

  // الباقي: نستخدم نفس قرار الأوتو-بنغ كخيار افتراضي ذكي
  var defDyn = decideRouteByLatency();
  return (defDyn === "PROXY") ? PROXY : "DIRECT";
}
