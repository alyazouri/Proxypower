/**** PAC: PUBG JO High-Percent Players (Advanced) ****/
/* أفكار أساسية:
   - JordanScore: نقاط تعتمد IPv4/IPv6 JO + فئة السيرفس + ذاكرة تعلم (Adaptive)
   - IPv6 سكني متوسط (/36) مولّد تلقائيًا لكل فئة (Orange/Zain/Umniah/Batelco)
   - لصق جلسات (Sticky) للمضيف/الفئة لتقليل التقلّب
   - إجبار بروكسي أردني للتجنيد، وصَرامة كاملة للـLOBBY/MATCH
   - حظر ذكي غير أردني بحسب الفئة + آلية Anti-Flap (سالب سريع)
*/

/* ========== إعدادات عامة ========== */
var PROXY_POOL = [
  {ip:"91.106.109.12", label:"Zain-JO"},
  // أضف بروكسيات أردنية أخرى إن وجدت لزيادة الإتاحة:
  // {ip:"94.249.XX.XX", label:"Orange-JO"},
  // {ip:"109.107.XX.XX", label:"Umniah-JO"},
];
var DEFAULT_PROXY_IDX = 0; // أول بروكسي افتراضي

// منافذ لكل فئة (يمكنك تعديلها)
var FIXED_PORT = {
  LOBBY: 443,
  MATCH: 20001,
  RECRUIT_SEARCH: 443,
  UPDATES: 80,
  CDN: 80
};

// تفضيل IPv4/IPv6 لكل فئة
var PREFER_IPV4_CAT = { LOBBY:true, MATCH:true, RECRUIT_SEARCH:false, UPDATES:false, CDN:false };
var PREFER_IPV6_CAT = { LOBBY:false, MATCH:false, RECRUIT_SEARCH:true,  UPDATES:false, CDN:false };

// سياسة الفئات
var STRICT_JO = { LOBBY:true, RECRUIT_SEARCH:false, MATCH:true, UPDATES:false, CDN:false };
var FORCE_PROXY_CAT = { LOBBY:false, MATCH:false, RECRUIT_SEARCH:true, UPDATES:false, CDN:false };
var BLOCK_NON_JO_CAT = { LOBBY:true, MATCH:true, RECRUIT_SEARCH:false, UPDATES:false, CDN:false };

// إن كان عميلك نفسه ليس أردني IP: أردننة المصدر عبر البروكسي
var REQUIRE_JO_SOURCE = true;
var FORCE_PROXY_IF_NOT_CLIENT_JO = true;

// DNS/Geo caching
var DNS_TTL_MS = 60*1000;    // 60s
var DNS_JITTER_MS = 10*1000; // 10s
var GEO_TTL_MS = 60*60*1000; // 1h

// Anti-flap للنتائج السلبية (غير أردني):
var NEG_CACHE_MS = 120*1000;

// عتبات الدرجات
var SCORE_ALLOW_DIRECT_STRICT   = 80; // للـ LOBBY/MATCH
var SCORE_ALLOW_DIRECT_RELAXED  = 60; // لفئات غير صارمة
var SCORE_BOOST_CATEGORY_V6     = 70; // IPv6 للفئة
var SCORE_V6_ANY_JO            = 50;  // أي IPv6 أردني
var SCORE_V4_JO                = 65;  // IPv4 أردني
var SCORE_PREFER_V4_MATCH_LOBBY = 10; // تعزيز بسيط لو فئة تفضّل IPv4 وجت A أردني
var SCORE_LEARN_POSITIVE        = 15; // تعلم تدريجي: كل مشاهدة أردنية +15 حتى 100
var SCORE_LEARN_DECAY           = 5;  // تناقص بسيط عند المشاهدات غير الأردنية

/* ========== نطاقات PUBG ========== */
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

/* ========== IPv4 سكني مُنظّف (JO) ========== */
var JO_V4_RANGES = [
  // Orange
  ["94.249.0.0","94.249.255.255"],
  ["86.111.0.0","86.111.255.255"],
  ["62.240.0.0","62.240.255.255"],
  ["212.118.0.0","212.118.127.255"],
  // Umniah
  ["109.107.224.0","109.107.255.255"],
  ["188.247.64.0","188.247.127.255"],
  // Zain
  ["91.106.96.0","91.106.111.255"],
  ["185.80.24.0","185.80.27.255"],
  ["37.44.32.0","37.44.47.255"],
  // Batelco / JDC
  ["212.35.64.0","212.35.127.255"],
  ["95.172.192.0","95.172.223.255"],
  ["46.248.192.0","46.248.223.255"],
  ["213.186.160.0","213.186.191.255"],
  ["194.165.128.0","194.165.159.255"],
  // إضافات أردنية شائعة
  ["95.177.0.0","95.177.255.255"],
  ["81.22.0.0","81.22.255.255"],
  ["46.32.96.0","46.32.98.255"],
  ["46.32.121.0","46.32.122.255"],
  ["176.29.252.0","176.29.255.255"],
  ["185.109.192.0","185.109.195.255"],
  ["37.152.0.0","37.152.7.255"],
  ["37.220.120.0","37.220.127.255"],
  ["91.186.224.0","91.186.239.255"],
  ["85.159.216.0","85.159.223.255"],
  ["217.23.32.0","217.23.47.255"]
];

/* ========== IPv6 “سكني متوسط” Builder (/36) ========== */
var V6_MEDIUM_PREFIXLEN = 36;
var V6_SAMPLES_PER_ISP = 4;
var V6_STEP_POWER = 4;

var JO_V6_SUPER = {
  ORANGE:  "2a00:18d8::/29",
  ZAIN:    "2a03:b640::/32",
  UMNIAH:  "2a03:6b00::/29",
  BATELCO: "2a01:9700::/29"
};

function expand6_(ip){
  if(ip.indexOf("::")===-1){
    var p=ip.split(":"); for(var i=0;i<p.length;i++){ if(p[i].length===0) p[i]="0"; }
    while(p.length<8) p.push("0"); return p;
  }
  var a=ip.split("::"), L=a[0]?a[0].split(":"):[], R=(a.length>1&&a[1])?a[1].split(":"):[];
  while(L.length+R.length<8) R.unshift("0"); return L.concat(R);
}
function fmt6_(v){return v.toString(16);}
function hexsToStr_(h){return h.map(fmt6_).join(":");}
function cidrSplitSample_(superCidr, targetLen, samples, stepPow){
  var sp=superCidr.split("/"); var base=expand6_(sp[0]); var p=parseInt(sp[1],10);
  if(isNaN(p)||isNaN(targetLen)||targetLen<p||targetLen>128) return [];
  var extra = targetLen-p, idx=Math.floor(p/16), used=p%16, room=16-used, take=Math.min(extra,room), rem=extra-take;
  var res=[], step=1<<Math.max(0,(stepPow||0));
  for(var i=0,k=0;k<samples;i+=step,k++){
    var h=base.slice();
    var add=(i & ((1<<take)-1)) << (room-take);
    var hv=parseInt(h[idx],16)||0; hv=((hv & (0xffff<<room))|add)&0xffff; h[idx]=hv.toString(16);
    var left=i>>>take, j=idx+1, bitsLeft=rem;
    while(bitsLeft>0 && j<8){
      var put=Math.min(16,bitsLeft), mask=(1<<put)-1;
      var v=((left & mask) << (16-put)) & 0xffff;
      h[j]=v.toString(16);
      left = left>>>put; bitsLeft-=put; j++;
    }
    var full=Math.floor(targetLen/16), r=targetLen%16;
    for(var t=full+1;t<8;t++) h[t]="0";
    if(r>0){
      var v2=parseInt(h[full],16)||0; v2 = v2 & (0xffff << (16-r)); h[full]=v2.toString(16);
    }
    res.push(hexsToStr_(h)+"::/"+targetLen);
  }
  return res;
}
function buildMediumV6Sets_(){
  var LOBBY=[].concat(
    cidrSplitSample_(JO_V6_SUPER.ORANGE,  V6_MEDIUM_PREFIXLEN, V6_SAMPLES_PER_ISP,     V6_STEP_POWER),
    cidrSplitSample_(JO_V6_SUPER.BATELCO, V6_MEDIUM_PREFIXLEN, Math.max(1,V6_SAMPLES_PER_ISP-2), V6_STEP_POWER)
  );
  var MATCH=[].concat(
    cidrSplitSample_(JO_V6_SUPER.ZAIN,    V6_MEDIUM_PREFIXLEN, V6_SAMPLES_PER_ISP+1,   V6_STEP_POWER),
    cidrSplitSample_(JO_V6_SUPER.ORANGE,  V6_MEDIUM_PREFIXLEN, 1,                      V6_STEP_POWER)
  );
  var RECRUIT=[].concat(
    cidrSplitSample_(JO_V6_SUPER.UMNIAH,  V6_MEDIUM_PREFIXLEN, V6_SAMPLES_PER_ISP,     V6_STEP_POWER),
    cidrSplitSample_(JO_V6_SUPER.ORANGE,  V6_MEDIUM_PREFIXLEN, 2,                      V6_STEP_POWER),
    cidrSplitSample_(JO_V6_SUPER.ZAIN,    V6_MEDIUM_PREFIXLEN, 1,                      V6_STEP_POWER)
  );
  var UPD = cidrSplitSample_(JO_V6_SUPER.UMNIAH, V6_MEDIUM_PREFIXLEN, 2, V6_STEP_POWER);
  var CDN = cidrSplitSample_(JO_V6_SUPER.ORANGE, V6_MEDIUM_PREFIXLEN, 2, V6_STEP_POWER);
  return { LOBBY:LOBBY, MATCH:MATCH, RECRUIT_SEARCH:RECRUIT, UPDATES:UPD, CDN:CDN };
}
var JO_V6_PREFIX = buildMediumV6Sets_();

/* ========== كاش/بيئة ========== */
var _root=(typeof globalThis!=="undefined"?globalThis:this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns) C.dns={};
if(!C.sticky) C.sticky={};
if(!C.geoClient) C.geoClient={ok:false,t:0};
if(!C.neg) C.neg={};          // negative cache (غير أردني)
if(!C.learn) C.learn={};      // تعلم لكل host: score 0..100
if(!C.portStick) C.portStick={};
if(!C.proxyStick) C.proxyStick={};

/* ========== أدوات عامة ========== */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=arr[i];if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++){if(shExpMatch(u,arr[i]))return true;}return false;}
function nowMs(){return(new Date()).getTime();}

function dnsResolveExPreferV4(host){
  var ip="",ip6="";
  if(typeof dnsResolveEx==="function"){
    var list=dnsResolveEx(host)||[];
    for(var i=0;i<list.length;i++){
      var a=list[i]||""; if(!a)continue;
      if(a.indexOf(":")!==-1){ if(!ip6) ip6=a; } else { if(!ip) ip=a; }
    }
  } else { try{ ip=dnsResolve(host)||""; }catch(e){} }
  return {ip:ip, ip6:ip6};
}
function dnsSticky(host){
  var now=nowMs(), st=C.sticky[host];
  if(st && now<st.exp) return st;
  var rr=C.dns[host];
  if(!(rr && (now-rr.t)<(DNS_TTL_MS + Math.floor(Math.random()*DNS_JITTER_MS)))){
    rr=dnsResolveExPreferV4(host); rr.t=now; C.dns[host]=rr;
  }
  C.sticky[host] = {ip:rr.ip||"", ip6:rr.ip6||"", exp:now+DNS_TTL_MS};
  return C.sticky[host];
}

/* IPv4 */
function ip4ToInt(ip){var p=ip.split(".");return((((parseInt(p[0])<<24)>>>0)+((parseInt(p[1])<<16)>>>0)+((parseInt(p[2])<<8)>>>0)+(parseInt(p[3])>>>0))>>>0);}
function isJOv4(ip){
  if(!ip||!/^\d+\.\d+\.\d+\.\d+$/.test(ip))return false;
  var n=ip4ToInt(ip);
  for(var i=0;i<JO_V4_RANGES.length;i++){
    var s=ip4ToInt(JO_V4_RANGES[i][0]); var e=ip4ToInt(JO_V4_RANGES[i][1]);
    if(n>=s&&n<=e) return true;
  }
  return false;
}

/* IPv6 */
function expand6(ip){
  if(ip.indexOf('::')===-1){var parts=ip.split(':');for(var k=0;k<parts.length;k++){if(parts[k].length===0)parts[k]="0";}while(parts.length<8)parts.push("0");return parts;}
  var p=ip.split('::'),l=p[0]?p[0].split(':'):[],r=(p.length>1&&p[1])?p[1].split(':'):[];
  while(l.length+r.length<8) r.unshift("0"); return l.concat(r);
}
function parse6(ip){var parts=expand6(ip.toLowerCase()),out=[];for(var i=0;i<8;i++){var v=parts[i].length?parseInt(parts[i],16):0;if(isNaN(v))v=0;out.push(v&0xffff);}return out;}
function matchV6CIDR(ip,cidr){
  var spl=cidr.split('/'),pre=spl[0],bits=parseInt(spl[1],10); if(isNaN(bits)||bits<0||bits>128)return false;
  var a=parse6(ip),b=parse6(pre),full=Math.floor(bits/16),rem=bits%16;
  for(var i=0;i<full;i++){if(a[i]!==b[i])return false;}
  if(rem===0)return true; var mask=0xffff<<(16-rem); return((a[full]&mask)===(b[full]&mask));
}
function isJOv6ForCat(ip,cat){ if(!ip||ip.indexOf(":")===-1)return false; var arr=JO_V6_PREFIX[cat]||[]; for(var i=0;i<arr.length;i++){ if(matchV6CIDR(ip,arr[i])) return true; } return false; }
function isJOv6Any(ip){ if(!ip||ip.indexOf(":")===-1)return false; var cats=["LOBBY","MATCH","RECRUIT_SEARCH","UPDATES","CDN"]; for(var i=0;i<cats.length;i++){ var arr=JO_V6_PREFIX[cats[i]]||[]; for(var j=0;j<arr.length;j++){ if(matchV6CIDR(ip,arr[j])) return true; } } return false; }

/* هوية العميل */
function anyMyIPs(){var ips=[];try{if(typeof myIpAddressEx==="function"){var xs=myIpAddressEx();if(xs&&xs.length){for(var i=0;i<xs.length;i++)ips.push(xs[i]);}}}catch(e){} if(!ips.length){try{var v4=myIpAddress();if(v4)ips.push(v4);}catch(e){}} return ips;}
function clientIsJO(){var now=nowMs(),g=C.geoClient;if(g&&(now-g.t)<GEO_TTL_MS)return g.ok;var ips=anyMyIPs(),ok=false;for(var i=0;i<ips.length;i++){var ip=ips[i];if(isJOv4(ip)||isJOv6Any(ip)){ok=true;break;}}C.geoClient={ok:ok,t:now};return ok;}

/* تصنيف الفئة */
function getCategoryFor(url,host){
  host=lc(host||"");
  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)||shExpMatch(url,"*/game/join*")||shExpMatch(url,"*/game/start*")||shExpMatch(url,"*/matchmaking/*")||shExpMatch(url,"*/mms/*")) return "MATCH";
  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH)||shExpMatch(url,"*/teamfinder/*")||shExpMatch(url,"*/recruit/*")) return "RECRUIT_SEARCH";
  if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES)) return "UPDATES";
  if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN)) return "CDN";
  return "LOBBY";
}

/* لصق بروكسي ومنافذ (شاردينغ لطيف) */
function portFor(cat, host){
  var base = FIXED_PORT[cat]||FIXED_PORT.LOBBY;
  var h = 0; for(var i=0;i<host.length;i++){ h=((h<<5)-h)+host.charCodeAt(i); h|=0; }
  var delta = Math.abs(h)%3; // يوزّع بين base, base+1, base+2 (إن أردت)
  return base + (cat==="MATCH"?0:delta); // للماتش إبقه ثابتًا
}
function pickProxyIdx(host,cat){
  var key=cat+"|"+host; var p=C.proxyStick[key]; if(typeof p==="number") return p;
  var h=0; for(var i=0;i<key.length;i++){ h=((h<<5)-h)+key.charCodeAt(i); h|=0; }
  p=Math.abs(h)%PROXY_POOL.length; C.proxyStick[key]=p; return p;
}
function proxyForCategory(cat,host){
  var port=portFor(cat,host);
  var idx=pickProxyIdx(host||"",cat);
  var ip=PROXY_POOL[idx].ip;
  return "PROXY "+ip+":"+port;
}

/* JordanScore + تعلم تكيفي + Anti-Flap */
function negCacheHit(host){var n=C.neg[host]; if(!n) return false; return (nowMs()-n)<NEG_CACHE_MS;}
function negCacheSet(host){C.neg[host]=nowMs();}

function learnScoreGet(host){var s=C.learn[host]; if(!s) return 0; return s|0;}
function learnScoreBump(host,delta){
  var s=learnScoreGet(host);
  s+=delta; if(s<0) s=0; if(s>100) s=100;
  C.learn[host]=s; return s;
}

function jordanScore(host,cat,rr){
  var score = learnScoreGet(host)*0.5; // نصف النقاط من التعلم السابق
  var preferV4 = PREFER_IPV4_CAT[cat]; var preferV6 = PREFER_IPV6_CAT[cat];

  // IPv6 للفئة أولاً
  if(rr.ip6 && isJOv6ForCat(rr.ip6, cat)) score += SCORE_BOOST_CATEGORY_V6;
  else if(rr.ip6 && isJOv6Any(rr.ip6))    score += SCORE_V6_ANY_JO;

  // IPv4
  if(rr.ip && isJOv4(rr.ip)){
    score += SCORE_V4_JO;
    if(preferV4 && (cat==="MATCH"||cat==="LOBBY")) score += SCORE_PREFER_V4_MATCH_LOBBY;
  }

  // تعزيز طفيف للفئة الحرجة
  if(cat==="MATCH"||cat==="LOBBY") score += 5;

  // سقف 100
  if(score>100) score=100;
  return Math.round(score);
}

/* منطق فحص أردني ذكي */
function hostIsJordanSmart(host,cat){
  host = host || "";
  if(/^\d+\.\d+\.\d+\.\d+$/.test(host)) { // literal IPv4
    if(isJOv4(host)){ learnScoreBump(host,SCORE_LEARN_POSITIVE); return {isJO:true, score:100}; }
    else { negCacheSet(host); learnScoreBump(host,-SCORE_LEARN_DECAY); return {isJO:false, score:0}; }
  }
  if(host.indexOf(":")!==-1){ // literal IPv6
    if(isJOv6Any(host)){ learnScoreBump(host,SCORE_LEARN_POSITIVE); return {isJO:true, score:100}; }
    else { negCacheSet(host); learnScoreBump(host,-SCORE_LEARN_DECAY); return {isJO:false, score:0}; }
  }

  if(negCacheHit(host)) return {isJO:false, score:learnScoreGet(host)};

  var rr=dnsSticky(host);
  // تفضيل البروتوكول حسب الفئة: ننقل IP المختار لأولوية التقييم فقط (لا نغيّر rr فعليًا)
  var score=jordanScore(host,cat,rr);
  var isJO = score >= (STRICT_JO[cat]?SCORE_ALLOW_DIRECT_STRICT:SCORE_ALLOW_DIRECT_RELAXED);

  // تعلّم تدريجي
  if(isJO) learnScoreBump(host,SCORE_LEARN_POSITIVE);
  else     learnScoreBump(host,-SCORE_LEARN_DECAY);

  if(!isJO) negCacheSet(host);
  return {isJO:isJO, score:score};
}

/* قرار الفئة */
function hostIsJordanAny(host,cat){
  var res = hostIsJordanSmart(host,cat);
  return res.isJO;
}

/* قرار نهائي */
function getCategoryForFast(url,host){ return getCategoryFor(url,host); } // alias

function FindProxyForURL(url, host){
  // أردننة المصدر لو جهازك ليس أردني
  if(!clientIsJO()){
    if(REQUIRE_JO_SOURCE && FORCE_PROXY_IF_NOT_CLIENT_JO){
      var c0 = getCategoryForFast(url,host||"");
      return proxyForCategory(c0, host||"");
    }
    return "PROXY 0.0.0.0:0";
  }

  var cat = getCategoryForFast(url,host||"");
  if(FORCE_PROXY_CAT[cat]) return proxyForCategory(cat, host||"");

  var isJO = hostIsJordanAny(host||"", cat);

  if(STRICT_JO[cat]){
    if(isJO) return "DIRECT";
    return "PROXY 0.0.0.0:0";
  }

  if(isJO) return "DIRECT";

  if(BLOCK_NON_JO_CAT[cat]) return "PROXY 0.0.0.0:0";

  // افتراضي: مر عبر بروكسي أردني (يزيد فرص الأردنيين في التيمفايندر/الخدمات غير الأردنية)
  return proxyForCategory(cat, host||"");
}
