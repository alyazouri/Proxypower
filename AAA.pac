/**** PAC: PUBG — JO-ONLY with Timed Escalation (v8, single proxy) ****/
/* فلسفة العمل:
   1) MATCH: مرحلة JO-ONLY (بلوك كامل لغير الأردني) ثم تصعيد تلقائي بعد مهلة إلى بروكسي أردني.
   2) LOBBY/RECRUIT: دائماً عبر بروكسي أردني واحد (لإبراز الهوية الأردنية).
   3) CDN/UPDATES: DIRECT (يمكن جعلها بروكسي بسطر واحد).
*/

/* ==== إعداد بروكسي واحد (عدّل IP فقط) ==== */
var PROXY_SINGLE = { ip:"91.106.109.12", port:443, label:"JO-Proxy" };
var PROXY_STR = "PROXY " + PROXY_SINGLE.ip + ":" + PROXY_SINGLE.port;

/* ==== مهلة التصعيد للماتش (بالدقائق) ==== */
var MATCH_JO_ONLY_MINUTES = 6;

/* ==== نطاقات PUBG ==== */
var B_DOM = {
  LOBBY:   ["*.pubgmobile.com","*.pubgmobile.net","*.igamecj.com","*.proximabeta.com"],
  MATCH:   ["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPD:     ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN:     ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};
var B_URL = {
  LOBBY:   ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:   ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT: ["*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*"],
  UPD:     ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:     ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

/* ==== قوائم JO (هوب/سكني/سوبرنت) ==== */
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
var JO_HOST_KEYS = ["zain","orange","umniah","batelco","jo-","-jo.","jordan"];

/* ==== كاش داخلي ==== */
var _root=(typeof globalThis!=="undefined"?globalThis:this);
if(!_root._PAC_V8) _root._PAC_V8={};
var C=_root._PAC_V8;
if(!C.dns)C.dns={};
if(!C.exp)C.exp={};          // DNS expiry
if(!C.matchStart)C.matchStart=0; // بداية مرحلة JO-ONLY للماتش (ms)

/* ==== أدوات ==== */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function now(){return (new Date()).getTime();}
function hostMatch(h,arr){h=lc(h||""); if(!h) return false; for(var i=0;i<arr.length;i++){var p=arr[i]; if(shExpMatch(h,p))return true; if(p.indexOf("*.")===0){var suf=p.substring(1); if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;}} return false;}
function urlMatch(u,arr){if(!u||!arr) return false; for(var i=0;i<arr.length;i++){ if(shExpMatch(u,arr[i])) return true; } return false;}

function dnsEx(host){
  var t=now(), e=C.exp[host]||0;
  if(C.dns[host] && t<e) return C.dns[host];
  var ip="",ip6="";
  if(typeof dnsResolveEx==="function"){
    var xs=dnsResolveEx(host)||[];
    for(var i=0;i<xs.length;i++){var a=xs[i]||""; if(!a)continue; if(a.indexOf(":")!==-1){ if(!ip6) ip6=a;} else { if(!ip) ip=a; } }
  } else { try{ ip=dnsResolve(host)||""; }catch(e){} }
  var rr={ip:ip||"", ip6:ip6||""}; C.dns[host]=rr; C.exp[host]=t+60000; return rr; // TTL 60s
}

/* IPv4/IPv6 matchers */
function ip4ToInt(ip){var p=ip.split(".");return((((parseInt(p[0])<<24)>>>0)+((parseInt(p[1])<<16)>>>0)+((parseInt(p[2])<<8)>>>0)+(parseInt(p[3])>>>0))>>>0);}
function inV4(ip,range){try{var n=ip4ToInt(ip), s=ip4ToInt(range[0]), e=ip4ToInt(range[1]); return n>=s&&n<=e;}catch(e){return false;}}
function expand6(ip){if(ip.indexOf("::")===-1){var parts=ip.split(":");for(var i=0;i<parts.length;i++){if(parts[i].length===0)parts[i]="0";}while(parts.length<8)parts.push("0");return parts;} var a=ip.split("::"),L=a[0]?a[0].split(":"):[],R=(a.length>1&&a[1])?a[1].split(":"):[];
while(L.length+R.length<8)R.unshift("0");return L.concat(R);}
function parse6(ip){var parts=expand6(ip.toLowerCase()),out=[];for(var i=0;i<8;i++){var v=parts[i].length?parseInt(parts[i],16):0;if(isNaN(v))v=0;out.push(v&0xffff);}return out;}
function matchV6(ip,cidr){try{var s=cidr.split("/"),pre=s[0],bits=parseInt(s[1],10),a=parse6(ip),b=parse6(pre),full=Math.floor(bits/16),rem=bits%16;for(var i=0;i<full;i++){if(a[i]!==b[i])return false;} if(rem===0)return true;var mask=0xffff<<(16-rem);return((a[full]&mask)===(b[full]&mask));}catch(e){return false;}}
function isJO(ip,ip6){
  if(ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)){ for(var i=0;i<JO_V4.length;i++){ if(inV4(ip,JO_V4[i])) return true; } }
  if(ip6 && ip6.indexOf(":")!==-1){ for(var j=0;j<JO_V6.length;j++){ if(matchV6(ip6,JO_V6[j])) return true; } }
  return false;
}
function hostJOKey(host){host=lc(host||""); if(!host) return false; for(var i=0;i<JO_HOST_KEYS.length;i++){ if(host.indexOf(JO_HOST_KEYS[i])!==-1) return true; } return false;}

/* تصنيف */
function cat(url,host){
  host=lc(host||"");
  if(urlMatch(url,B_URL.MATCH)||hostMatch(host,B_DOM.MATCH)||shExpMatch(url,"*/game/join*")||shExpMatch(url,"*/game/start*")) return "MATCH";
  if(urlMatch(url,B_URL.RECRUIT)||hostMatch(host,B_DOM.RECRUIT)) return "RECRUIT";
  if(urlMatch(url,B_URL.UPD)||hostMatch(host,B_DOM.UPD)) return "UPD";
  if(urlMatch(url,B_URL.CDN)||hostMatch(host,B_DOM.CDN)) return "CDN";
  if(urlMatch(url,B_URL.LOBBY)||hostMatch(host,B_DOM.LOBBY)) return "LOBBY";
  return ""; // غير PUBG
}

/* القرار */
function FindProxyForURL(url, host){
  host = host || "";
  var c = cat(url, host);

  // غير PUBG: دايركت
  if(!c) return "DIRECT";

  // LOBBY/RECRUIT: دائماً عبر بروكسي واحد (هوية JO واضحة)
  if(c==="LOBBY" || c==="RECRUIT") return PROXY_STR;

  // CDN/UPD: DIRECT افتراضياً (إن أردتها بروكسي غيّر السطر التالي)
  if(c==="CDN" || c==="UPD") return "DIRECT"; // ← بدّلها إلى PROXY_STR لو بدك تشدد

  // MATCH: JO-ONLY ثم تصعيد
  // تحديد بداية المرحلة إن لم تكن مضبوطة
  if(C.matchStart===0) C.matchStart = now();

  var rr = dnsEx(host);
  var joOK = isJO(rr.ip||"", rr.ip6||"") || hostJOKey(host);

  var elapsedMin = (now() - C.matchStart) / 60000.0;
  if(elapsedMin < MATCH_JO_ONLY_MINUTES){
    // المرحلة الأولى: JO-ONLY صارم
    if(joOK) return "DIRECT";
    return "PROXY 0.0.0.0:0"; // بلوك كامل لغير الأردني
  } else {
    // التصعيد: مرّر غير الأردني عبر البروكسي الأردني
    if(joOK) return "DIRECT";
    return PROXY_STR;
  }
}
