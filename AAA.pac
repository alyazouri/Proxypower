/**** PAC: PUBG JO-Force (v9, Single-Proxy Always) ****/
/* هدف السكربت:
   - كل فئات PUBG تمر عبر بروكسي أردني واحد دائماً (هوية أردنية ثابتة).
   - لا DIRECT لأي حركة PUBG (لرفع نسبة لواعب الأردن).
   - بقية المواقع = DIRECT حتى ما يتأثر باقي التصفح.
   - خيار اختياري (مطفّي افتراضياً): DIRECT فقط لو الوجهة أردنية صِرفة (يفتح بسطر واحد).
*/

/* ==== بروكسي أردني واحد (عدّل هنا) ==== */
var PROXY_SINGLE = { ip:"91.106.109.12", port:443, label:"JO-Proxy" };
var PROXY_STR = "PROXY " + PROXY_SINGLE.ip + ":" + PROXY_SINGLE.port;

/* ==== (اختياري) السماح DIRECT للوجهات الأردنية الصِرفة؟ افتراضياً OFF ==== */
var ALLOW_DIRECT_FOR_STRICT_JO = false; // غيّرها إلى true إذا بدك الاستثناء الأردني الحقيقي

/* ==== نطاقات PUBG الأساسية ==== */
var PUBG_DOMAINS = {
  LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.igamecj.com","*.proximabeta.com"],
  MATCH:["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPD:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};
var PUBG_URL = {
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT:["*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*"],
  UPD:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

/* ==== (للاختيار الاختياري فقط) قوائم JO ==== */
var JO_V4 = [
  ["94.249.0.0","94.249.255.255"],["86.111.0.0","86.111.255.255"],["62.240.0.0","62.240.255.255"],["212.118.0.0","212.118.127.255"],
  ["109.107.224.0","109.107.255.255"],["188.247.64.0","188.247.127.255"],
  ["91.106.96.0","91.106.111.255"],["185.80.24.0","185.80.27.255"],["37.44.32.0","37.44.47.255"],
  ["212.35.64.0","212.35.127.255"],["95.172.192.0","95.172.223.255"],["46.248.192.0","46.248.223.255"],["213.186.160.0","213.186.191.255"],["194.165.128.0","194.165.159.255"],
  ["95.177.0.0","95.177.255.255"],["81.22.0.0","81.22.255.255"],["46.32.96.0","46.32.98.255"],["46.32.121.0","46.32.122.255"],
  ["176.29.252.0","176.29.255.255"],["185.109.192.0","185.109.195.255"],["37.152.0.0","37.152.7.255"],["37.220.120.0","37.220.127.255"],
  ["91.186.224.0","91.186.239.255"],["85.159.216.0","85.159.223.255"],["217.23.32.0","217.23.47.255"]
];
var JO_V6 = ["2a00:18d8::/29","2a03:b640::/32","2a03:6b00::/29","2a01:9700::/29"];
var JO_HOST_KEYS = ["zain","orange","umniah","batelco","jordan","-jo.","jo-"];

/* ==== أدوات ==== */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function hostMatch(h,arr){h=lc(h||""); if(!h) return false; for(var i=0;i<arr.length;i++){var p=arr[i]; if(shExpMatch(h,p))return true; if(p.indexOf("*.")===0){var suf=p.substring(1); if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;}} return false;}
function urlMatch(u,arr){if(!u||!arr) return false; for(var i=0;i<arr.length;i++){ if(shExpMatch(u,arr[i])) return true; } return false;}

/* تصنيف */
function cat(url,host){
  host=lc(host||"");
  if(urlMatch(url,PUBG_URL.MATCH)||hostMatch(host,PUBG_DOMAINS.MATCH)||shExpMatch(url,"*/game/join*")||shExpMatch(url,"*/game/start*")) return "MATCH";
  if(urlMatch(url,PUBG_URL.RECRUIT)||hostMatch(host,PUBG_DOMAINS.RECRUIT)) return "RECRUIT";
  if(urlMatch(url,PUBG_URL.UPD)||hostMatch(host,PUBG_DOMAINS.UPD)) return "UPD";
  if(urlMatch(url,PUBG_URL.CDN)||hostMatch(host,PUBG_DOMAINS.CDN)) return "CDN";
  if(urlMatch(url,PUBG_URL.LOBBY)||hostMatch(host,PUBG_DOMAINS.LOBBY)) return "LOBBY";
  return ""; // غير PUBG
}

/* (للاختيار الاختياري فقط) DNS */
var _root=(typeof globalThis!=="undefined"?globalThis:this);
if(!_root._PAC_V9) _root._PAC_V9={};
var C=_root._PAC_V9; if(!C.dns)C.dns={}; if(!C.exp)C.exp={};
function dnsEx(host){
  var t=(new Date()).getTime(), e=C.exp[host]||0;
  if(C.dns[host] && t<e) return C.dns[host];
  var ip="",ip6="";
  if(typeof dnsResolveEx==="function"){
    var xs=dnsResolveEx(host)||[];
    for(var i=0;i<xs.length;i++){var a=xs[i]||""; if(!a)continue; if(a.indexOf(":")!==-1){ if(!ip6) ip6=a; } else { if(!ip) ip=a; } }
  } else { try{ ip=dnsResolve(host)||""; }catch(e){} }
  var rr={ip:ip||"", ip6:ip6||""}; C.dns[host]=rr; C.exp[host]=t+60000; return rr; // TTL 60s
}

/* (للاختيار الاختياري فقط) مطابقة JO صارمة */
function ip4ToInt(ip){var p=ip.split(".");return((((parseInt(p[0])<<24)>>>0)+((parseInt(p[1])<<16)>>>0)+((parseInt(p[2])<<8)>>>0)+(parseInt(p[3])>>>0))>>>0);}
function inV4(ip,range){try{var n=ip4ToInt(ip), s=ip4ToInt(range[0]), e=ip4ToInt(range[1]); return n>=s&&n<=e;}catch(e){return false;}}
function expand6(ip){if(ip.indexOf("::")===-1){var parts=ip.split(":");for(var i=0;i<parts.length;i++){if(parts[i].length===0)parts[i]="0";}while(parts.length<8)parts.push("0");return parts;} var a=ip.split("::"),L=a[0]?a[0].split(":"):[],R=(a.length>1&&a[1])?a[1].split(":"):[];
while(L.length+R.length<8)R.unshift("0");return L.concat(R);}
function parse6(ip){var parts=expand6(ip.toLowerCase()),out=[];for(var i=0;i<8;i++){var v=parts[i].length?parseInt(parts[i],16):0;if(isNaN(v))v=0;out.push(v&0xffff);}return out;}
function matchV6(ip,cidr){try{var s=cidr.split("/"),pre=s[0],bits=parseInt(s[1],10),a=parse6(ip),b=parse6(pre),full=Math.floor(bits/16),rem=bits%16;for(var i=0;i<full;i++){if(a[i]!==b[i])return false;} if(rem===0)return true;var mask=0xffff<<(16-rem);return((a[full]&mask)===(b[full]&mask));}catch(e){return false;}}
function hostHasJOKey(host){host=lc(host||""); if(!host)return false; for(var i=0;i<JO_HOST_KEYS.length;i++){ if(host.indexOf(JO_HOST_KEYS[i])!==-1) return true; } return false;}
function isStrictJO(host){
  if(!ALLOW_DIRECT_FOR_STRICT_JO) return false;
  var rr=dnsEx(host||""); var ip=rr.ip||"", ip6=rr.ip6||"";
  if(ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)){ for(var i=0;i<JO_V4.length;i++){ if(inV4(ip,JO_V4[i])) return true; } }
  if(ip6 && ip6.indexOf(":")!==-1){ for(var j=0;j<JO_V6.length;j++){ if(matchV6(ip6,JO_V6[j])) return true; } }
  if(hostHasJOKey(host)) return true;
  return false;
}

/* ==== القرار النهائي ==== */
function FindProxyForURL(url, host){
  var bucket = cat(url, host||"");

  // غير PUBG = DIRECT
  if(!bucket) return "DIRECT";

  // افتراضي: كل PUBG عبر بروكسي أردني واحد (JO-Force)
  // هذا يعظّم نسبة لواعب الأردن لأنه يثبّت هويتك الجغرافية على الأردن طوال الوقت.
  // (اختياري) إذا فعلت ALLOW_DIRECT_FOR_STRICT_JO: اسمح DIRECT للوجهات الأردنية الصِرفة فقط.
  if(ALLOW_DIRECT_FOR_STRICT_JO && isStrictJO(host||"")) return "DIRECT";

  return PROXY_STR;
}
