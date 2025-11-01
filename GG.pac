/**** PAC: PUBG — JO Proxy (Port 20001 only) ****/
/* الهدف: كل ترافيك PUBG عبر بروكسي أردني على المنفذ 20001 فقط */

var PROXY_HOST = "91.106.109.12:20001";  // ← عدّل الـ IP إذا لزم

/* دومينات ببجي */
var PUBG_DOMAINS = [
  "*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com",
  "*.igamecj.com","intlsdk.igamecj.com","pay.igamecj.com.eo.dnse1.com",
  "*.gcloud.qq.com","gpubgm.com","*.vasdgame.com"
];

/* استثناءات وسائط وصور (تبقى DIRECT) */
var MEDIA = [
  "*.youtube.com","*.googlevideo.com","*.ytimg.com",
  "*.googleusercontent.com","lh3.googleusercontent.com","googlehosted.l.googleusercontent.com",
  "*.whatsapp.com","*.whatsapp.net",
  "*.snapchat.com","*.sc-cdn.net","*.snapcdn.io","*.snap-dev.net",
  "platform-lookaside.fbsbx.com","*.fbcdn.net","*.scontent.*.fbcdn.net",
  "browser-intake-datadoghq.com","*.browser-intake-datadoghq.com",
  "_dns.resolver.arpa"
];

/* دوال مساعدة بسيطة */
function m(s,p){return shExpMatch(s,p);}
function anyHost(h,arr){for(var i=0;i<arr.length;i++){var p=arr[i],suf=p.replace(/^\*\./,".");if(m(h,p)||h.slice(-suf.length)===suf)return true;}return false;}
function isLAN(h){
  if(!h||h.indexOf('.')==-1) return true;
  if(m(h,"localhost")||m(h,"localhost.*")||m(h,"127.*")||m(h,"[::1]")) return true;
  try{
    var ip=dnsResolve(h); if(!ip) return false;
    if(isInNet(ip,"10.0.0.0","255.0.0.0")) return true;
    if(isInNet(ip,"172.16.0.0","255.240.0.0")) return true;
    if(isInNet(ip,"192.168.0.0","255.255.0.0")) return true;
    if(isInNet(ip,"169.254.0.0","255.255.0.0")) return true;
    if(isInNet(ip,"100.64.0.0","255.192.0.0")) return true;
    if(isInNet(ip,"198.18.0.0","255.254.0.0")) return true;
  }catch(e){}
  return false;
}
function isMedia(h){h=h||"";h=h.toLowerCase();for(var i=0;i<MEDIA.length;i++){if(m(h,MEDIA[i])) return true;}return false;}

function FindProxyForURL(url, host){
  host = host || "";

  // bypass LAN/LOCAL/MEDIA
  if (isLAN(host) || isMedia(host)) return "DIRECT";

  // ببجي فقط → عبر بروكسي على المنفذ 20001
  if (anyHost(host, PUBG_DOMAINS)) return "PROXY "+PROXY_HOST;

  // غير ذلك → مباشر
  return "DIRECT";
}
