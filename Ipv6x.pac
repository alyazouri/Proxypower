function FindProxyForURL(url, host) {
var PROXY_HOSTS=["91.106.109.12"];
var PORTS={
LOBBY:[443,8080,8443],
MATCH:[20001,20002,20003,20000,17500,17000],
RECRUIT:[10010,10012,10013,10039,10096,10491,10612,11000,11455,12235,13748,13894],
UPDATE:[80,443,8080,8443],
CDN:[80,443,8080]
};
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
var JO_BIAS_KEYS=[
"jo",
"amman",
"madaba",
"zain",
"orange",
"umniah",
"batelco",
"vtelecom",
"jtc"
];
var JO_V6=[
["2a00:18d8:150::","2a00:18d8:150:88c:ffff:ffff:ffff:ffff"],
["2a00:18d8:150:938::","2a00:18d8:150:938:ffff:ffff:ffff:ffff"]
];
function buildChain(h){
return[
"HTTPS "+h+":8443",
"PROXY "+h+":8080",
"SOCKS5 "+h+":1080",
"SOCKS "+h+":1080"
].join("; ");
}
function isIPv6(h){return h.indexOf(":")!==-1;}
function exp6(s){
s=s.toLowerCase();
if(s.charAt(0)==="["&&s.charAt(s.length-1)==="]")s=s.slice(1,-1);
var parts=s.split("::"),a=parts[0]?parts[0].split(":"):[],b=(parts.length>1&&parts[1])?parts[1].split(":"):[];
var miss=8-(a.length+b.length),mid=[];
for(var i=0;i<miss;i++)mid.push("0");
var full=a.concat(mid,b);
for(var j=0;j<8;j++)full[j]=("0000"+(full[j]||"0")).slice(-4);
return full;
}
function cmp6(a,b){
for(var i=0;i<8;i++){
var da=parseInt(a[i],16),db=parseInt(b[i],16);
if(da<db)return-1;
if(da>db)return 1;
}
return 0;
}
function inV6Range(h,s,e){
var A=exp6(h),S=exp6(s),E=exp6(e);
return cmp6(A,S)>=0&&cmp6(A,E)<=0;
}
function anyMatch(h,arr){
for(var i=0;i<arr.length;i++){
if(dnsDomainIs(h,arr[i]))return true;
}
return false;
}
function hasKey(h,keys){
for(var i=0;i<keys.length;i++){
if(shExpMatch(h,"*"+keys[i]+"*"))return true;
}
return false;
}
function hash32(str){
var h=2166136261>>>0;
for(var i=0;i<str.length;i++){
h^=str.charCodeAt(i);
h=(h*16777619)>>>0;
}
return h>>>0;
}
function choose(arr,key){
return arr[hash32(key)%arr.length];
}
function getPort(u){
var m=u.match(/^[a-z]+:\/\//i),scheme=m?m[0].slice(0,-3).toLowerCase():"";
var p=parseInt(u.substring(u.lastIndexOf(":")+1))||0;
if(p)return p;
if(scheme==="https")return 443;
if(scheme==="http")return 80;
return 0;
}
function categoryForPort(p){
if(PORTS.MATCH.indexOf(p)!==-1)return"MATCH";
if(PORTS.LOBBY.indexOf(p)!==-1)return"LOBBY";
if(PORTS.RECRUIT.indexOf(p)!==-1)return"RECRUIT";
if(PORTS.UPDATE.indexOf(p)!==-1)return"UPDATE";
if(PORTS.CDN.indexOf(p)!==-1)return"CDN";
return null;
}
var h=(host||"").toLowerCase();
if(isPlainHostName(h)||h==="localhost"||h==="127.0.0.1")return"DIRECT";
if(anyMatch(h,YT_DOMAINS))return"DIRECT";
if(isIPv6(host)){
for(var i=0;i<JO_V6.length;i++){
if(inV6Range(host,JO_V6[i][0],JO_V6[i][1])){
var ph=choose(PROXY_HOSTS,host);
var port=getPort(url);
var cat=categoryForPort(port);
if(cat){
var portPick=choose(PORTS[cat],host+"|"+cat);
return buildChain(ph);
}
return buildChain(ph);
}
}
}
for(var d=0;d<PUBG_DOMAINS.length;d++){
if(dnsDomainIs(h,PUBG_DOMAINS[d])){
var ph1=choose(PROXY_HOSTS,h);
var p1=getPort(url);
var c1=categoryForPort(p1);
if(c1){
var _pp=choose(PORTS[c1],h+"|"+c1);
return buildChain(ph1);
}
return buildChain(ph1);
}
}
var p=getPort(url),cat=categoryForPort(p);
if(cat){
var ph2=choose(PROXY_HOSTS,h+"|p");
var _p2=choose(PORTS[cat],h+"|"+cat);
return buildChain(ph2);
}
if(hasKey(h,JO_BIAS_KEYS)){
var ph3=choose(PROXY_HOSTS,h+"|jo");
return buildChain(ph3);
}
return"DIRECT";
}
