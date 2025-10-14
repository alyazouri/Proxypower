function FindProxyForURL(url, host) {

var FORCE_JO_ROUTE=true
var BLOCK_IR=true
var FORBID_DIRECT=true

var PROXY_JO={
ip:"91.106.109.12",
ports:[443,8080,8443,20001,20002,20003,20004]
}

var GAME_DOMAINS=[
"pubgmobile.com","*.pubgmobile.com","*.pubgmobile-*.com",
"proximabeta.com","*.proximabeta.com",
"tencent.com","*.tencent.com","tencentgames.com","*.tencentgames.com",
"igamecj.com","*.igamecj.com",
"gcloudsdk.com","*.gcloudsdk.com",
"qcloudcdn.com","*.qcloudcdn.com",
"vivox.com","*.vivox.com",
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
"jo",
"amman",
"abdali",
"ashrafieh",
"marka",
"shafabadran",
"sweileh",
"khalda",
"dabouq",
"zarqa",
"irbid",
"aqaba",
"salt",
"balqa",
"mafraq",
"madaba",
"karak",
"jerash",
"ajloun",
"tafileh",
"maan",
"ramtha",
"zain",
"orange",
"umniah",
"mada",
"damamax",
"vtel",
"jtc",
"jo-ix",
"jordan-ix",
"data-center",
"datacenter",
"dc-amman",
"pop-amman",
"pop-aqaba"
]

var REGION_WEIGHT={
"amman":50,
"abdali":22,
"marka":18,
"shafabadran":14,
"aqaba":30,
"zarqa":30,
"irbid":30,
"salt":22,
"balqa":22,
"mafraq":18,
"madaba":16,
"karak":16,
"jerash":14,
"ajloun":14,
"tafileh":12,
"maan":12,
"ramtha":12,
"jo-ix":40,
"jordan-ix":40,
"dc-amman":28,
"datacenter":26,
"data-center":26,
"pop-amman":20,
"pop-aqaba":20,
"zain":40,
"orange":40,
"umniah":35,
"mada":35,
"damamax":25,
"vtel":20,
"jtc":18
}

var AVOID_TLDS=[".ir",".ly"]

var JO_RANGES=[
["185.140.0.0","255.255.0.0"],
["212.35.0.0","255.255.0.0"],
["82.102.0.0","255.255.0.0"],
["91.106.0.0","255.255.0.0"],
["82.212.64.0","255.255.192.0"],
["176.57.0.0","255.255.240.0"],
["176.28.128.0","255.255.128.0"],
["176.29.0.0","255.255.0.0"],
["94.249.0.0","255.255.128.0"],
["46.185.0.0","255.255.0.0"],
["46.32.96.0","255.255.224.0"],
["37.202.64.0","255.255.192.0"],
["185.51.212.0","255.255.255.0"],
["92.253.0.0","255.255.0.0"],
["149.200.128.0","255.255.128.0"],
["79.173.248.0","255.255.248.0"]
]

var BLOCKED_RANGES=[
["5.160.0.0","255.224.0.0"],
["2.176.0.0","255.240.0.0"],
["37.255.0.0","255.255.0.0"],
["79.132.192.0","255.255.192.0"],
["80.191.0.0","255.255.0.0"],
["91.98.0.0","255.254.0.0"],
["151.232.0.0","255.248.0.0"]
]

function isInCIDR(ip,net,mask){return isInNet(ip,net,mask)}
function isInRanges(ip,rs){for(var i=0;i<rs.length;i++){if(isInCIDR(ip,rs[i][0],rs[i][1]))return true}return false}
function isJO(ip){return isInRanges(ip,JO_RANGES)}
function isIR(ip){return isInRanges(ip,BLOCKED_RANGES)}

function matchDomainList(h,arr){
var l=h.toLowerCase()
for(var i=0;i<arr.length;i++){
var p=arr[i]
if(p.indexOf("*")>=0){ if(shExpMatch(l,p)) return true } else { if(dnsDomainIs(l,"."+p)||l===p) return true }
}
return false
}

function isGameHost(h){return matchDomainList(h,GAME_DOMAINS)}
function isBlockedTLD(h){var l=h.toLowerCase();for(var i=0;i<AVOID_TLDS.length;i++){if(shExpMatch(l,"*"+AVOID_TLDS[i]))return true}return false}

function h32(s){var x=2166136261;for(var i=0;i<s.length;i++){x^=s.charCodeAt(i);x=(x>>>0)*16777619}return x>>>0}
function pickPort(ports,seed){return ports[seed%ports.length]}
function weightByRegion(h){
var l=h.toLowerCase(),w=0
for(var k in REGION_WEIGHT){ if(l.indexOf(k)>=0) w+=REGION_WEIGHT[k] }
for(var j=0;j<PREFER_JO_HOSTS.length;j++){ if(l.indexOf(PREFER_JO_HOSTS[j])>=0) w+=2 }
return w
}

var resolved=""
try{resolved=dnsResolve(host)}catch(_){resolved=""}

if(isBlockedTLD(host)) return "REJECT"
if(resolved && isIR(resolved)) return "REJECT"

var seed=h32(host)
var port=pickPort(PROXY_JO.ports,seed)
var chain="PROXY "+PROXY_JO.ip+":"+port+"; SOCKS5 "+PROXY_JO.ip+":"+port

var score=0
if(resolved && isJO(resolved)) score+=200
if(isGameHost(host)) score+=120
score+=weightByRegion(host)

if(FORCE_JO_ROUTE) score+=50

if(score>=0) return chain
if(FORBID_DIRECT) return chain
return "DIRECT"

}
