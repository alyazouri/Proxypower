function FindProxyForURL(url, host) {
var PROXY_HOSTS=["91.106.109.12"];
var PROXY_CHAIN=function(h){return["HTTPS "+h+":8443","PROXY "+h+":8080","SOCKS5 "+h+":1080","SOCKS "+h+":1080"].join("; ");};
var BLACKHOLE="PROXY 0.0.0.0:9";
var PUBG_DOMAINS=[
".proximabeta.com",
".igamecj.com",
".tencentgames.com",
".tencent.com",
".pubgmobile.com",
".pubgmobile.net",
".gcloud.qq.com",
".cdn.pubgmobile.com",
".pubgmobilecdn.com",
".awsstatic.com"
];
var YT_DOMAINS=[
".youtube.com",
".googlevideo.com",
".ytimg.com",
".yt.be"
];
var JO_V6=[
["2a00:18d8:150::","2a00:18d8:150:88c:ffff:ffff:ffff:ffff"],
["2a00:18d8:150:938::","2a00:18d8:150:938:ffff:ffff:ffff:ffff"]
];
var PORTS_TCP=[10012,17000,17500,18081,20000,20001,20002,20371,80,443];
var PORTS_UDP=[8011,9030,10010,10013,10039,10096,10491,10612,11455,12235,13748,13894,13972,17000,17500,20000,20001,20002];
var PORT_RANGES=[[12070,12460],[41182,41192]];
function isIPv6(h){return h.indexOf(":")!==-1;}
function exp6(s){s=s.toLowerCase();if(s.charAt(0)==="["&&s.charAt(s.length-1)==="]")s=s.slice(1,-1);var p=s.split("::"),a=p[0]?p[0].split(":"):[],b=(p.length>1&&p[1])?p[1].split(":"):[];var m=8-(a.length+b.length),mid=[];for(var i=0;i<m;i++)mid.push("0");var f=a.concat(mid,b);for(var j=0;j<8;j++)f[j]=("0000"+(f[j]||"0")).slice(-4);return f;}
function cmp6(a,b){for(var i=0;i<8;i++){var da=parseInt(a[i],16),db=parseInt(b[i],16);if(da<db)return-1;if(da>db)return 1;}return 0;}
function inV6(h,s,e){var A=exp6(h),S=exp6(s),E=exp6(e);return cmp6(A,S)>=0&&cmp6(A,E)<=0;}
function anyMatch(h,arr){for(var i=0;i<arr.length;i++){if(dnsDomainIs(h,arr[i]))return true;}return false;}
function hash32(str){var h=2166136261>>>0;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=(h*16777619)>>>0;}return h>>>0;}
function choose(arr,key){return arr[hash32(key)%arr.length];}
function getScheme(u){var m=u.match(/^([a-z]+):\/\//i);return m?m[1].toLowerCase():"";}
function getPort(u){var p=parseInt(u.substring(u.lastIndexOf(":")+1))||0;if(p)return p;var s=getScheme(u);if(s==="https")return 443;if(s==="http")return 80;return 0;}
function inRanges(p,rs){for(var i=0;i<rs.length;i++){if(p>=rs[i][0]&&p<=rs[i][1])return true;}return false;}
function isPubgPort(p){if(PORTS_TCP.indexOf(p)!==-1||PORTS_UDP.indexOf(p)!==-1)return true;return inRanges(p,PORT_RANGES);}
var h=(host||"").toLowerCase();
if(anyMatch(h,YT_DOMAINS))return"DIRECT";
var ph=choose(PROXY_HOSTS,h||host);
function allowOnlyIfJOv6(dst){
if(isIPv6(dst)){for(var i=0;i<JO_V6.length;i++){if(inV6(dst,JO_V6[i][0],JO_V6[i][1]))return PROXY_CHAIN(ph);}return BLACKHOLE;}
var r=dnsResolve(dst);
if(r&&r.indexOf(":")===-1)return BLACKHOLE;
return BLACKHOLE;
}
if(isIPv6(host)){}
else{
var rIP=dnsResolve(h);
if(rIP&&rIP.indexOf(":")===-1){}
}
if(anyMatch(h,PUBG_DOMAINS))return allowOnlyIfJOv6(host);
var p=getPort(url);
if(isPubgPort(p))return allowOnlyIfJOv6(host);
return BLACKHOLE;
}
