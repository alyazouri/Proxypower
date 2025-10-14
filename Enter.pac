function FindProxyForURL(url, host) {

var FORCE_ALL=true
var FORBID_DIRECT=true
var BLOCK_IR=true
var FORCE_JO_ROUTE=true

var DNS_CACHE_TTL_MS=60000
var JITTER_WINDOW_MS=3500

var GAME_DOMAINS=[
"pubgmobile.com","*.pubgmobile.com","*.pubgmobile-*.com",
"proximabeta.com","*.proximabeta.com",
"tencent.com","*.tencent.com","tencentgames.com","*.tencentgames.com",
"gcloudsdk.com","*.gcloudsdk.com","igamecj.com","*.igamecj.com",
"qcloudcdn.com","*.qcloudcdn.com","cdngarena.com","*.cdngarena.com",
"glance-cdn.com","*.glance-cdn.com","vivox.com","*.vivox.com",
"akamaiedge.net","*.akamaiedge.net","akamaihd.net","*.akamaihd.net",
"akamai.net","*.akamai.net","akamaized.net","*.akamaized.net",
"edgesuite.net","*.edgesuite.net","edgekey.net","*.edgekey.net",
"cloudfront.net","*.cloudfront.net","cloudflare.com","*.cloudflare.com",
"googleapis.com","*.googleapis.com","gstatic.com","*.gstatic.com",
"googleusercontent.com","*.googleusercontent.com",
"apple.com","*.apple.com","cdn-apple.com","*.cdn-apple.com",
"unity3d.com","*.unity3d.com"
]

var PREFER_JO_HOSTS=[
"jo","jordan","amman","irbid","zarqa","salt","karak","jerash","mafraq","tafileh","maan","aqaba","madaba","balqa","ajloun",
"عمان","إربد","اربد","الزرقاء","السلط","الكرك","جرش","المفرق","الطفيلة","معان","العقبة","مادبا","البلقاء","عجلون",
"zain","orange","umniah","mada","damamax","vtel","jtc"
]

var AVOID_TLDS=[".ir",".ly"]

var JO_IP_RANGES=[
["185.140.0.0","255.255.0.0"],
["212.35.0.0","255.255.0.0"],
["82.102.0.0","255.255.0.0"],
["82.212.64.0","255.255.192.0"],
["176.57.0.0","255.255.240.0"],
["176.28.128.0","255.255.128.0"],
["176.29.0.0","255.255.0.0"],
["94.249.0.0","255.255.128.0"],
["46.185.0.0","255.255.0.0"],
["46.32.96.0","255.255.224.0"],
["37.202.64.0","255.255.192.0"],
["91.106.96.0","255.255.224.0"],
["185.51.212.0","255.255.255.0"],
["92.253.0.0","255.255.0.0"],
["149.200.128.0","255.255.128.0"],
["79.173.248.0","255.255.248.0"]
]

var IR_IP_RANGES=[
["5.160.0.0","255.224.0.0"],
["2.176.0.0","255.240.0.0"],
["37.255.0.0","255.255.0.0"],
["46.224.0.0","255.224.0.0"],
["79.132.192.0","255.255.192.0"],
["80.191.0.0","255.255.0.0"],
["81.31.160.0","255.255.224.0"],
["91.98.0.0","255.254.0.0"],
["109.94.160.0","255.255.224.0"],
["151.232.0.0","255.248.0.0"],
["176.65.0.0","255.255.0.0"],
["178.236.32.0","255.255.224.0"],
["188.212.0.0","255.252.0.0"],
["185.49.84.0","255.255.252.0"]
]

var PROXIES=[
{ id:"ORANGE_CORE_1",  ip:"212.35.64.1",    http:[443,8080,8443], game:[20001,20002,20003,20004,8085], isp:"ORANGE" },
{ id:"ZAIN_CORE_1",    ip:"185.140.102.1",  http:[443,8080,8443], game:[20001,20002,20003,20004,8085], isp:"ZAIN" },
{ id:"UMNIAH_CORE_1",  ip:"82.102.41.3",    http:[443,8080,8443], game:[20001,20002,20003,20004,8085], isp:"UMNIAH" },
{ id:"MADA_EDGE_1",    ip:"91.106.109.12",  http:[443,8080,8443], game:[20001,20002,20003,20004,8085], isp:"MADA" },
{ id:"MADA_EDGE_2",    ip:"91.106.109.11",  http:[443,8080,8443], game:[20001,20002,20003,20004,8085], isp:"MADA" },
{ id:"DAMAMAX_FBR_1",  ip:"82.212.107.34",  http:[443,8080,8443], game:[20001,20002,20003,20004,8085], isp:"DAMAMAX" },
{ id:"VTEL_FBR_1",     ip:"185.51.212.1",   http:[443,8080,8443], game:[20001,20002,20003,20004,8085], isp:"VTEL" }
]

var ISP_PREF={"ORANGE":6,"ZAIN":6,"UMNIAH":6,"MADA":7,"DAMAMAX":5,"VTEL":5}

var WEIGHT_HTTP=[6,6,5,4,4,3,3]
var WEIGHT_GAME=[10,9,8,7,6,5,5]

var now_ms=Date.now()
var DNS_CACHE={}
var CACHE_TTL=DNS_CACHE_TTL_MS

function h32(s){var x=2166136261;for(var i=0;i<s.length;i++){x^=s.charCodeAt(i);x=(x>>>0)*16777619}return x>>>0}
function inCIDR(ip,net,mask){return isInNet(ip,net,mask)}
function isInRanges(ip,rs){for(var i=0;i<rs.length;i++){if(inCIDR(ip,rs[i][0],rs[i][1]))return true}return false}
function isJO(ip){return isInRanges(ip,JO_IP_RANGES)}
function isIR(ip){return isInRanges(ip,IR_IP_RANGES)}
function matchList(h,arr){var l=h.toLowerCase();for(var i=0;i<arr.length;i++){var p=arr[i];if(p.indexOf("*")>=0){if(shExpMatch(l,p))return true}else{if(dnsDomainIs(l,"."+p)||l===p)return true}}return false}
function hasJOHint(h){var l=h.toLowerCase();for(var i=0;i<PREFER_JO_HOSTS.length;i++){if(l.indexOf(PREFER_JO_HOSTS[i])>=0)return true}return false}
function isGameHost(h){return matchList(h,GAME_DOMAINS)}
function isBlockedTLD(h){var l=h.toLowerCase();for(var i=0;i<AVOID_TLDS.length;i++){if(shExpMatch(l,"*"+AVOID_TLDS[i]))return true}return false}

function dnsCached(host){
  var e=DNS_CACHE[host]
  if(e && (now_ms-e.t)<=CACHE_TTL) return e.ip
  try{var r=dnsResolve(host);if(r){DNS_CACHE[host]={ip:r,t:now_ms};return r}}catch(_){}
  return null
}

function joBiasScore(px,host,resolved){
  var s=h32(px.ip+"|"+host+"|"+(resolved||"x"))
  var jitter=(s%JITTER_WINDOW_MS)
  var tilt=0
  if(ISP_PREF[px.isp]) tilt+=ISP_PREF[px.isp]
  if(isGameHost(host)) tilt+=80
  if(hasJOHint(host)) tilt+=40
  if(resolved && isJO(resolved)) tilt+=120
  if(resolved && isIR(resolved)) tilt-=200
  if(isBlockedTLD(host)) tilt-=300
  return (s%1000)+tilt - Math.floor(jitter/6)
}

function rankProxies(host,resolved){
  var L=[]
  for(var i=0;i<PROXIES.length;i++){
    var sc=joBiasScore(PROXIES[i],host,resolved)
    L.push({i:i,sc:sc})
  }
  L.sort(function(a,b){return b.sc-a.sc})
  return L.map(function(e){return e.i})
}

function pickWeighted(arr,weights,seed){
  var sum=0;for(var i=0;i<weights.length;i++)sum+=weights[i]
  var r=(seed%sum)+1,acc=0
  for(var j=0;j<weights.length;j++){acc+=weights[j];if(r<=acc)return arr[Math.min(j,arr.length-1)]}
  return arr[0]
}

function chain(idx,isGame){
  var p=PROXIES[idx]
  var seed=h32(host+p.ip+now_ms)
  var port=isGame?pickWeighted(p.game,WEIGHT_GAME,seed):pickWeighted(p.http,WEIGHT_HTTP,seed)
  var c1="PROXY "+p.ip+":"+port
  var c2="SOCKS5 "+p.ip+":"+port
  return c1+"; "+c2
}

var myip=""
try{myip=myIpAddress()}catch(_){}

if(BLOCK_IR && isBlockedTLD(host)) return "REJECT"

var resolved=dnsCached(host)
var host_is_jo=false
if(resolved){host_is_jo=isJO(resolved)}
var host_is_ir=false
if(resolved){host_is_ir=isIR(resolved)}

if(host_is_ir) return "REJECT"

var enforceJO=(FORCE_JO_ROUTE && (isGameHost(host) || hasJOHint(host) || host_is_jo || FORCE_ALL))

if(enforceJO){
  var order=rankProxies(host,resolved)
  var out=[]
  for(var k=0;k<order.length;k++) out.push(chain(order[k],true))
  if(FORBID_DIRECT) return out.join("; ")
  return out.join("; ")+"; DIRECT"
}

var order2=rankProxies(host,resolved)
var out2=[]
for(var m=0;m<order2.length;m++) out2.push(chain(order2[m],false))
if(FORBID_DIRECT) return out2.join("; ")
return out2.join("; ")+"; DIRECT"

}
