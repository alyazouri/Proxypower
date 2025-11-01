/**** PAC: PUBG JO HARD-LOCK (v3) ****/
/* سياسة مختصرة:
   - LOBBY/MATCH/RECRUIT: دائماً عبر بروكسي أردني. Direct فقط بعد تأكيدين متتالين أنه JO.
   - CDN/UPDATES: Direct لو JO، وإلا عبر بروكسي.
   - عميلك لو مش JO: إجبار بروكسي أردني لكل الفئات.
   - Anti-Flap طويل + لصق جلسة + تأكيد مزدوج (Two-Hit Confirm).
*/

var PROXY_POOL = [
  {ip:"91.106.109.12", label:"Zain-JO"},
  // زوّدها لو عندك بروكسيات JO إضافية لثبات أعلى:
  // {ip:"94.249.xx.xx", label:"Orange-JO"},
  // {ip:"109.107.xx.xx", label:"Umniah-JO"},
  // {ip:"212.35.xx.xx", label:"Batelco-JO"},
];
var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };
var REQUIRE_JO_SOURCE = true, FORCE_PROXY_IF_NOT_CLIENT_JO = true;

/* تصنيف الدومينات/الروابط (كما هو) */
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

/* IPv4 أردني (قائمتك كما هي ويمكنك الزيادة) */
var JO_V4_RANGES = [
  ["94.249.0.0","94.249.255.255"],["86.111.0.0","86.111.255.255"],["62.240.0.0","62.240.255.255"],["212.118.0.0","212.118.127.255"],
  ["109.107.224.0","109.107.255.255"],["188.247.64.0","188.247.127.255"],
  ["91.106.96.0","91.106.111.255"],["185.80.24.0","185.80.27.255"],["37.44.32.0","37.44.47.255"],
  ["212.35.64.0","212.35.127.255"],["95.172.192.0","95.172.223.255"],["46.248.192.0","46.248.223.255"],["213.186.160.0","213.186.191.255"],["194.165.128.0","194.165.159.255"],
  ["95.177.0.0","95.177.255.255"],["81.22.0.0","81.22.255.255"],["46.32.96.0","46.32.98.255"],["46.32.121.0","46.32.122.255"],
  ["176.29.252.0","176.29.255.255"],["185.109.192.0","185.109.195.255"],["37.152.0.0","37.152.7.255"],["37.220.120.0","37.220.127.255"],
  ["91.186.224.0","91.186.239.255"],["85.159.216.0","85.159.223.255"],["217.23.32.0","217.23.47.255"]
];

/* IPv6 “سكني متوسط” (/36) كما هو */
var JO_V6_SUPER = { ORANGE:"2a00:18d8::/29", ZAIN:"2a03:b640::/32", UMNIAH:"2a03:6b00::/29", BATELCO:"2a01:9700::/29" };
var V6_MEDIUM_PREFIXLEN=36,V6_SAMPLES_PER_ISP=4,V6_STEP_POWER=4;

/* ====== كاش/حالة ====== */
var _root=(typeof globalThis!=="undefined"?globalThis:this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE={};
var C=_root._PAC_HARDCACHE;
if(!C.dns)C.dns={}; if(!C.sticky)C.sticky={}; if(!C.geoClient)C.geoClient={ok:false,t:0};
if(!C.neg)C.neg={}; if(!C.learn)C.learn={}; if(!C.proxyStick)C.proxyStick={};
if(!C.sessionJOLock) C.sessionJOLock={ LOBBY:false, MATCH:false, RECRUIT_SEARCH:false };
if(!C.twoHit) C.twoHit={}; // تأكيد مزدوج لكل host+cat

/* ====== أدوات ====== */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function urlMatch(u,arr){if(!u)return false;for(var i=0;i<arr.length;i++){if(shExpMatch(u,arr[i]))return true;}return false;}
function hostMatch(h,arr){h=lc(h);if(!h)return false;for(var i=0;i<arr.length;i++){var p=arr[i];if(shExpMatch(h,p))return true;if(p.indexOf("*.")===0){var suf=p.substring(1);if(h.length>=suf.length&&h.substring(h.length-suf.length)===suf)return true;}}return false;}
function nowMs(){return (new Date()).getTime();}

function dnsResolveExPreferV4(host){
  var ip="",ip6="";
  if(typeof dnsResolveEx==="function"){
    var list=dnsResolveEx(host)||[];
    for(var i=0;i<list.length;i++){var a=list[i]||"";if(!a)continue;
      if(a.indexOf(":")!==-1){ if(!ip6) ip6=a; } else { if(!ip) ip=a; }
    }
  } else { try{ ip=dnsResolve(host)||""; }catch(e){} }
  return {ip:ip, ip6:ip6};
}
var DNS_TTL_MS=60*1000, DNS_JITTER_MS=10*1000, GEO_TTL_MS=60*60*1000, NEG_CACHE_MS=10*60*1000;
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

/* IPv4/IPv6 تعرّف JO */
function ip4ToInt(ip){var p=ip.split(".");return((((parseInt(p[0])<<24)>>>0)+((parseInt(p[1])<<16)>>>0)+((parseInt(p[2])<<8)>>>0)+(parseInt(p[3])>>>0))>>>0);}
function isJOv4(ip){if(!ip||!/^\d+\.\d+\.\d+\.\d+$/.test(ip))return false;var n=ip4ToInt(ip);
  for(var i=0;i<JO_V4_RANGES.length;i++){var s=ip4ToInt(JO_V4_RANGES[i][0]);var e=ip4ToInt(JO_V4_RANGES[i][1]);if(n>=s&&n<=e)return true;}return false;}
function expand6(ip){if(ip.indexOf('::')===-1){var parts=ip.split(':');for(var k=0;k<parts.length;k++){if(parts[k].length===0)parts[k]="0";}while(parts.length<8)parts.push("0");return parts;}
  var p=ip.split('::'),l=p[0]?p[0].split(':'):[],r=(p.length>1&&p[1])?p[1].split(':'):[];
  while(l.length+r.length<8)r.unshift("0");return l.concat(r);}
function parse6(ip){var parts=expand6(ip.toLowerCase()),out=[];for(var i=0;i<8;i++){var v=parts[i].length?parseInt(parts[i],16):0;if(isNaN(v))v=0;out.push(v&0xffff);}return out;}
function matchV6CIDR(ip,cidr){var spl=cidr.split('/'),pre=spl[0],bits=parseInt(spl[1],10);if(isNaN(bits)||bits<0||bits>128)return false;var a=parse6(ip),b=parse6(pre),full=Math.floor(bits/16),rem=bits%16;for(var i=0;i<full;i++){if(a[i]!==b[i])return false;}if(rem===0)return true;var mask=0xffff<<(16-rem);return((a[full]&mask)===(b[full]&mask));}
function cidrSplitSample_(superCidr,targetLen,samples,stepPow){
  function expand6_(ip){if(ip.indexOf("::")===-1){var p=ip.split(":");for(var i=0;i<p.length;i++){if(p[i].length===0)p[i]="0";}while(p.length<8)p.push("0");return p;}
    var a=ip.split("::"),L=a[0]?a[0].split(":"):[],R=(a.length>1&&a[1])?a[1].split(":"):[];
    while(L.length+R.length<8)R.unshift("0");return L.concat(R);}
  function fmt6_(v){return v.toString(16);} function hexsToStr_(h){return h.map(fmt6_).join(":");}
  var sp=superCidr.split("/");var base=expand6_(sp[0]);var p=parseInt(sp[1],10);if(isNaN(p)||isNaN(targetLen)||targetLen<p||targetLen>128)return[];
  var extra=targetLen-p,idx=Math.floor(p/16),used=p%16,room=16-used,take=Math.min(extra,room),rem=extra-take,res=[],step=1<<Math.max(0,(stepPow||0));
  for(var i=0,k=0;k<samples;i+=step,k++){
    var h=base.slice(),add=(i & ((1<<take)-1)) << (room-take),hv=parseInt(h[idx],16)||0;hv=((hv & (0xffff<<room))|add)&0xffff;h[idx]=hv.toString(16);
    var left=i>>>take,j=idx+1,bitsLeft=rem;while(bitsLeft>0&&j<8){var put=Math.min(16,bitsLeft),mask=(1<<put)-1;var v=((left & mask) << (16-put)) & 0xffff;h[j]=v.toString(16);left=left>>>put;bitsLeft-=put;j++;}
    var full=Math.floor(targetLen/16),r=targetLen%16;for(var t=full+1;t<8;t++)h[t]="0"; if(r>0){var v2=parseInt(h[full],16)||0;v2=v2 & (0xffff << (16-r));h[full]=v2.toString(16);}
    res.push(hexsToStr_(h)+"::/"+targetLen);
  } return res;
}
function buildMediumV6Sets_(){
  var LOBBY=[].concat(cidrSplitSample_(JO_V6_SUPER.ORANGE,36,4,4),cidrSplitSample_(JO_V6_SUPER.BATELCO,36,2,4));
  var MATCH=[].concat(cidrSplitSample_(JO_V6_SUPER.ZAIN,36,5,4),cidrSplitSample_(JO_V6_SUPER.ORANGE,36,1,4));
  var RECRUIT=[].concat(cidrSplitSample_(JO_V6_SUPER.UMNIAH,36,4,4),cidrSplitSample_(JO_V6_SUPER.ORANGE,36,2,4),cidrSplitSample_(JO_V6_SUPER.ZAIN,36,1,4));
  var UPD = cidrSplitSample_(JO_V6_SUPER.UMNIAH,36,2,4);
  var CDN = cidrSplitSample_(JO_V6_SUPER.ORANGE,36,2,4);
  return { LOBBY:LOBBY, MATCH:MATCH, RECRUIT_SEARCH:RECRUIT, UPDATES:UPD, CDN:CDN };
}
var JO_V6_PREFIX = buildMediumV6Sets_();
function isJOv6ForCat(ip,cat){ if(!ip||ip.indexOf(":")===-1)return false; var arr=JO_V6_PREFIX[cat]||[]; for(var i=0;i<arr.length;i++){ if(matchV6CIDR(ip,arr[i])) return true; } return false; }
function isJOv6Any(ip){ if(!ip||ip.indexOf(":")===-1)return false; var cats=["LOBBY","MATCH","RECRUIT_SEARCH","UPDATES","CDN"]; for(var i=0;i<cats.length;i++){ var arr=JO_V6_PREFIX[cats[i]]||[]; for(var j=0;j<arr.length;j++){ if(matchV6CIDR(ip,arr[j])) return true; } } return false; }

/* تصنيف */
function getCategoryFor(url,host){
  host=lc(host||"");
  if(urlMatch(url,URL_PATTERNS.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)||shExpMatch(url,"*/game/join*")||shExpMatch(url,"*/game/start*")||shExpMatch(url,"*/matchmaking/*")||shExpMatch(url,"*/mms/*")) return "MATCH";
  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)||hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH)||shExpMatch(url,"*/teamfinder/*")||shExpMatch(url,"*/recruit/*")) return "RECRUIT_SEARCH";
  if(urlMatch(url,URL_PATTERNS.UPDATES)||hostMatch(host,PUBG_DOMAINS.UPDATES)) return "UPDATES";
  if(urlMatch(url,URL_PATTERNS.CDN)||hostMatch(host,PUBG_DOMAINS.CDN)) return "CDN";
  return "LOBBY";
}

/* اختيار بروكسي */
function pickProxyIdx(key){var p=C.proxyStick[key];if(typeof p==="number") return p; var h=0;for(var i=0;i<key.length;i++){h=((h<<5)-h)+key.charCodeAt(i);h|=0;} p=Math.abs(h)%PROXY_POOL.length; C.proxyStick[key]=p; return p;}
function portFor(cat,host){var base=FIXED_PORT[cat]||FIXED_PORT.LOBBY; if(cat==="MATCH") return base; var h=0; for(var i=0;i<(host||"").length;i++){h=((h<<5)-h)+(host.charCodeAt(i)||0);h|=0;} return base + (Math.abs(h)%3);}
function proxyForCategory(cat,host){var idx=pickProxyIdx((cat||"")+"|"+(host||"")); var ip=PROXY_POOL[idx].ip; return "PROXY "+ip+":"+(portFor(cat,host||""));}

/* تعلم/نفي/تأكيد مزدوج */
function negSet(host){C.neg[host]=nowMs();}
function negHit(host){var t=C.neg[host];return t && (nowMs()-t)<NEG_CACHE_MS;}
function learnGet(key){return C.learn[key]|0;}
function learnBump(key,delta){var s=learnGet(key)+delta; if(s<0)s=0;if(s>100)s=100; C.learn[key]=s; return s;}
function twoHitKey(host,cat){return (cat||"")+"|"+(host||"");}
function twoHitMark(host,cat,isJO){var k=twoHitKey(host,cat); var v=C.twoHit[k]||0; if(isJO){v=Math.min(2,v+1);} else {v=0;} C.twoHit[k]=v; return v;}
function twoHitOK(host,cat){return (C.twoHit[twoHitKey(host,cat)]||0)>=2;}

/* عميلك JO؟ */
function anyMyIPs(){var ips=[];try{if(typeof myIpAddressEx==="function"){var xs=myIpAddressEx();if(xs&&xs.length){for(var i=0;i<xs.length;i++)ips.push(xs[i]);}}}catch(e){} if(!ips.length){try{var v4=myIpAddress();if(v4)ips.push(v4);}catch(e){}} return ips;}
function clientIsJO(){var g=C.geoClient,now=nowMs(); if(g&&(now-g.t)<GEO_TTL_MS) return g.ok; var ips=anyMyIPs(),ok=false; for(var i=0;i<ips.length;i++){var ip=ips[i]; if(isJOv4(ip)||isJOv6Any(ip)){ok=true;break;}} C.geoClient={ok:ok,t:now}; return ok;}

/* فحص JO للمضيف */
function hostJO(host,cat){
  if(!host) return {isJO:false};
  if(/^\d+\.\d+\.\d+\.\d+$/.test(host)) { if(isJOv4(host)){learnBump(host,10); return {isJO:true};} negSet(host); learnBump(host,-5); return {isJO:false}; }
  if(host.indexOf(":")!==-1) { if(isJOv6Any(host)){learnBump(host,10); return {isJO:true};} negSet(host); learnBump(host,-5); return {isJO:false}; }
  if(negHit(host)) return {isJO:false};
  var rr=dnsSticky(host), isjo = (rr.ip && isJOv4(rr.ip)) || (rr.ip6 && (isJOv6ForCat(rr.ip6,cat)||isJOv6Any(rr.ip6)));
  if(isjo) learnBump(host,10); else {learnBump(host,-5); negSet(host);}
  return {isJO:isjo, ip:rr.ip||"", ip6:rr.ip6||""};
}

/* قرار نهائي */
function FindProxyForURL(url, host){
  var cat = getCategoryFor(url, host||"");

  // لو عميلك مش JO: إجبار بروكسي أردني لكل شيء
  if(!clientIsJO()){
    if(REQUIRE_JO_SOURCE && FORCE_PROXY_IF_NOT_CLIENT_JO){ return proxyForCategory(cat, host||""); }
    return "PROXY 0.0.0.0:0";
  }

  var hres = hostJO(host||"", cat);
  var hardCats = (cat==="LOBBY"||cat==="MATCH"||cat==="RECRUIT_SEARCH");

  // تأكيد مزدوج + قفل جلسة
  if(hres.isJO){
    if(twoHitMark(host||"",cat,true)>=2){ C.sessionJOLock[cat]=true; }
  } else {
    twoHitMark(host||"",cat,false);
  }

  // HARD-LOCK: الفئات الحرِجة تمر بالبروكسي الأردني دائماً
  if(hardCats){
    // اسمح DIRECT فقط إذا تأكد مرتين متتاليتين أنه JO (لتجنب False-positive)
    if(hres.isJO && twoHitOK(host||"",cat)) return "DIRECT";
    return proxyForCategory(cat, host||"");
  }

  // CDN/UPDATES: Direct لو JO، غير ذلك بروكسي لتظل أردني المصدر
  if(hres.isJO) return "DIRECT";
  return proxyForCategory(cat, host||"");
}
