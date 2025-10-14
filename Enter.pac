function FindProxyForURL(url, host) {

var FORCE_ALL=true
var FORBID_DIRECT=true
var BLOCK_IR=true
var FORBID_NON_JO=true

var GAME_DOMAINS=[
"pubgmobile.com",
"*.pubgmobile.com",
"*.pubgmobile-*.com",
"proximabeta.com",
"*.proximabeta.com",
"tencent.com",
"*.tencent.com",
"tencentgames.com",
"*.tencentgames.com",
"gcloudsdk.com",
"*.gcloudsdk.com",
"igamecj.com",
"*.igamecj.com",
"qcloudcdn.com",
"*.qcloudcdn.com",
"cdngarena.com",
"*.cdngarena.com",
"glance-cdn.com",
"*.glance-cdn.com",
"vivox.com",
"*.vivox.com",
"akamaiedge.net",
"*.akamaiedge.net",
"akamaihd.net",
"*.akamaihd.net",
"akamai.net",
"*.akamai.net",
"akamaized.net",
"*.akamaized.net",
"edgekey.net",
"*.edgekey.net",
"edgesuite.net",
"*.edgesuite.net",
"awsstatic.com",
"*.awsstatic.com",
"amazonaws.com",
"*.amazonaws.com",
"googleapis.com",
"*.googleapis.com",
"googleusercontent.com",
"*.googleusercontent.com",
"gstatic.com",
"*.gstatic.com",
"google.com",
"*.google.com",
"apple.com",
"*.apple.com",
"cdn-apple.com",
"*.cdn-apple.com",
"unity3d.com",
"*.unity3d.com",
"cloudflare.com",
"*.cloudflare.com",
"cloudfront.net",
"*.cloudfront.net"
]

var PREFER_JO_HOSTS=[
"jo",
"jordan",
"amman",
"irbid",
"zarqa",
"salt",
"karak",
"jerash",
"mafraq",
"tafileh",
"maan",
"aqaba",
"madaba",
"balqa",
"ajloun",
"عمان",
"إربد",
"اربد",
"الزرقاء",
"السلط",
"الكرك",
"جرش",
"المفرق",
"الطفيلة",
"معان",
"العقبة",
"مادبا",
"البلقاء",
"عجلون",
"zain",
"orange",
"umniah",
"mada",
"damamax",
"vtel",
"jtc"
]

var AVOID_TLDS=[
".ir",
".ly"
]

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

var PROXIES=[
{ id:"ORANGE_CORE_1",  ip:"212.35.64.1",    http:[443,8080,8443], game:[20001,20002,20003,20004,8085] },
{ id:"ZAIN_CORE_1",    ip:"185.140.102.1",  http:[443,8080,8443], game:[20001,20002,20003,20004,8085] },
{ id:"UMNIAH_CORE_1",  ip:"82.102.41.3",    http:[443,8080,8443], game:[20001,20002,20003,20004,8085] },
{ id:"MADA_EDGE_1",    ip:"91.106.109.12",  http:[443,8080,8443], game:[20001,20002,20003,20004,8085] },
{ id:"MADA_EDGE_2",    ip:"91.106.109.11",  http:[443,8080,8443], game:[20001,20002,20003,20004,8085] },
{ id:"DAMAMAX_FBR_1",  ip:"82.212.107.34",  http:[443,8080,8443], game:[20001,20002,20003,20004,8085] },
{ id:"VTEL_FBR_1",     ip:"185.51.212.1",   http:[443,8080,8443], game:[20001,20002,20003,20004,8085] }
]

var WEIGHT_HTTP=[6,5,5,4,4,3,3]
var WEIGHT_GAME=[9,8,8,7,7,6,6]

var JITTER_WINDOW_MS=3000
var now_ms=Date.now()

function h32(s){var x=2166136261;for(var i=0;i<s.length;i++){x^=s.charCodeAt(i);x=(x>>>0)*16777619}return x>>>0}

function pickWeighted(arr,weights,seed){
  var sum=0;for(var i=0;i<weights.length;i++)sum+=weights[i]
  var r=(seed%sum)+1,acc=0
  for(var j=0;j<weights.length;j++){acc+=weights[j];if(r<=acc)return arr[Math.min(j,arr.length-1)]}
  return arr[0]
}

function inCIDR(ip,net,mask){return isInNet(ip,net,mask)}

function isJO(ip){
  for(var i=0;i<JO_IP_RANGES.length;i++){
    if(inCIDR(ip,JO_IP_RANGES[i][0],JO_IP_RANGES[i][1])) return true
  }
  return false
}

function hasJOHint(h){
  var l=h.toLowerCase()
  for(var i=0;i<PREFER_JO_HOSTS.length;i++){
    if(l.indexOf(PREFER_JO_HOSTS[i])>=0) return true
  }
  return false
}

function matchDomainList(h,arr){
  var l=h.toLowerCase()
  for(var i=0;i<arr.length;i++){
    var p=arr[i]
    if(p.indexOf("*")>=0){
      if(shExpMatch(l,p)) return true
    }else{
      if(dnsDomainIs(l,"."+p)||l===p) return true
    }
  }
  return false
}

function isGameHost(h){return matchDomainList(h,GAME_DOMAINS)}

function isBlockedTLD(h){
  var l=h.toLowerCase()
  for(var i=0;i<AVOID_TLDS.length;i++){
    if(shExpMatch(l,"*"+AVOID_TLDS[i])) return true
  }
  return false
}

function joBiasScore(baseIp,host){
  var s=h32(baseIp+"|"+host)
  var jitter=(s%JITTER_WINDOW_MS)
  var tilt=0
  if(hasJOHint(host)) tilt+=40
  if(isGameHost(host)) tilt+=60
  return (s%1000)+tilt - Math.floor(jitter/5)
}

function rankProxies(host){
  var list=[]
  for(var i=0;i<PROXIES.length;i++){
    var p=PROXIES[i]
    var sc=joBiasScore(p.ip,host)
    list.push({idx:i,score:sc})
  }
  list.sort(function(a,b){return b.score-a.score})
  return list.map(function(e){return e.idx})
}

function buildChain(idx,isGame){
  var p=PROXIES[idx]
  var seed=h32(host+p.ip+now_ms)
  var port=isGame?pickWeighted(p.game,WEIGHT_GAME,seed):pickWeighted(p.http,WEIGHT_HTTP,seed)
  var c1="PROXY "+p.ip+":"+port
  var c2="SOCKS5 "+p.ip+":"+port
  return c1+"; "+c2
}

var myip=""
try{myip=myIpAddress()}catch(e){}

if(BLOCK_IR && isBlockedTLD(host)) return "REJECT"

var host_is_jo=false
try{var rh=dnsResolve(host);if(rh){host_is_jo=isJO(rh)}}catch(e){}

if(FORBID_NON_JO && !host_is_jo && !hasJOHint(host) && !isGameHost(host)){
  var ord_neutral=rankProxies(host)
  var chain_neu=[]
  for(var n=0;n<ord_neutral.length;n++){chain_neu.push(buildChain(ord_neutral[n],false))}
  if(FORBID_DIRECT) return chain_neu.join("; ")
  return chain_neu.join("; ")+"; DIRECT"
}

var ord=rankProxies(host)
var chain=[]
for(var k=0;k<ord.length;k++){chain.push(buildChain(ord[k],true))}
if(FORBID_DIRECT) return chain.join("; ")
return chain.join("; ")+"; DIRECT"

}
