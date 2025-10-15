function FindProxyForURL(url, host) {
var FORBID_DIRECT_GLOBAL = false;
var PROXIES = [
{ip:"91.106.109.12",ports:[1080,20001,8080],weight:5},
{ip:"176.28.250.122",ports:[8080,443],weight:3},
{ip:"79.173.251.142",ports:[8000,443],weight:2}
];
var JO_IP_SUBNETS = [
["2.17.24.0","255.255.252.0"],
["37.202.64.0","255.255.192.0"],
["91.106.96.0","255.255.224.0"],
["91.106.100.0","255.255.252.0"],
["91.106.104.0","255.255.248.0"],
["91.186.224.0","255.255.224.0"],
["109.107.224.0","255.255.224.0"],
["109.107.228.0","255.255.255.0"],
["109.107.240.0","255.255.255.0"],
["109.107.241.0","255.255.255.0"],
["109.107.242.0","255.255.255.0"],
["109.107.243.0","255.255.255.0"],
["109.107.244.0","255.255.255.0"],
["109.107.245.0","255.255.255.0"],
["109.107.246.0","255.255.255.0"],
["109.107.247.0","255.255.255.0"],
["109.107.248.0","255.255.255.0"],
["109.107.249.0","255.255.255.0"],
["109.107.250.0","255.255.255.0"],
["109.107.251.0","255.255.255.0"],
["109.107.252.0","255.255.255.0"],
["109.107.253.0","255.255.255.0"],
["109.107.254.0","255.255.255.0"],
["109.107.255.0","255.255.255.0"],
["109.237.192.0","255.255.255.0"],
["109.237.193.0","255.255.255.0"],
["109.237.194.0","255.255.255.0"],
["109.237.195.0","255.255.255.0"],
["109.237.196.0","255.255.255.0"],
["109.237.197.0","255.255.255.0"],
["109.237.198.0","255.255.255.0"],
["109.237.199.0","255.255.255.0"],
["109.237.200.0","255.255.255.0"],
["109.237.201.0","255.255.255.0"],
["109.237.202.0","255.255.255.0"],
["109.237.203.0","255.255.255.0"],
["109.237.204.0","255.255.255.0"],
["109.237.205.0","255.255.255.0"],
["109.237.206.0","255.255.255.0"],
["109.237.207.0","255.255.255.0"]
];
var DNS_CACHE_TTL_BASE_MS = 45000;
var DNS_CACHE_TTL_MIN_MS = 8000;
var PROBE_COUNT = 3;
var EWMA_ALPHA = 0.3;
var VARIANCE_ALPHA = 0.2;
var STICKY_PORT_TTL = 1800000;
var PROXY_STICKY_TTL = 1800000;
var SWITCH_THRESHOLD = 1.5;
var FAILURE_BACKOFF_BASE = 60000;
var MAX_FAILURE_BACKOFF = 1200000;
var LOBBY_DOMAINS = [
"*.pubgmobile.com",
"*.pubg.com",
"*.tencentgames.com",
"*.igamecj.com",
"lobby.*",
"login.*",
"friend.*",
"social.*",
"matchmaking.*"
];
var GAME_DOMAINS = [
"*.pubgmobile.com",
"*.pubg.com",
"*.igamecj.com",
"*.gcloud.qq.com",
"*.qcloud.com",
"*.garena.com",
"*.umeng.com",
"game.*",
"battle.*",
"realtime.*"
];
if(typeof __JO_ADV==="undefined"){__JO_ADV={dns:{},proxies:{},stickyPorts:{},sessions:{}}}
for(var i=0;i<PROXIES.length;i++){var p=PROXIES[i];if(!__JO_ADV.proxies[p.ip]){__JO_ADV.proxies[p.ip]={ewma:null,variance:null,lastProbe:0,failures:0,backoffUntil:0}}}
function nowMs(){return(new Date()).getTime()}
function cacheDNS(name){var e=__JO_ADV.dns[name];var n=nowMs();if(e&&(n-e.t)<(e.ttl||DNS_CACHE_TTL_BASE_MS))return e.ip;var ip=dnsResolve(name);if(ip){__JO_ADV.dns[name]={ip:ip,t:n,ttl:DNS_CACHE_TTL_BASE_MS};return ip}else{__JO_ADV.dns[name]={ip:null,t:n,ttl:DNS_CACHE_TTL_MIN_MS};return null}}
function isIPInJordan(ip){if(!ip)return false;for(var i=0;i<JO_IP_SUBNETS.length;i++){if(isInNet(ip,JO_IP_SUBNETS[i][0],JO_IP_SUBNETS[i][1]))return true}return false}
function isYouTubeHost(h){var x=h.toLowerCase();if(shExpMatch(x,"*.youtube.com"))return true;if(shExpMatch(x,"*.googlevideo.com"))return true;if(shExpMatch(x,"*.ytimg.com"))return true;if(shExpMatch(x,"*.yt3.ggpht.com"))return true;if(shExpMatch(x,"*.youtubei.googleapis.com"))return true;if(x==="youtu.be"||shExpMatch(x,"youtu.be*"))return true;return false}
function matchAny(h,arr){for(var i=0;i<arr.length;i++){if(shExpMatch(h,arr[i]))return true}return false}
function multiProbe(target,n){var samples=[];var ip=null;for(var k=0;k<n;k++){var t0=nowMs();var r=dnsResolve(target);var t1=nowMs();if(!ip&&r)ip=r;samples.push(t1-t0)}var sum=0;for(var s=0;s<samples.length;s++)sum+=samples[s];var mean=sum/samples.length;var vsum=0;for(var s=0;s<samples.length;s++)vsum+=Math.pow(samples[s]-mean,2);var variance=vsum/samples.length;return{ip:ip,mean:mean,variance:variance,samples:samples}}
function updateProxyStats(proxyIp,sampleMean,sampleVar){var st=__JO_ADV.proxies[proxyIp];if(!st)return;if(st.ewma===null)st.ewma=sampleMean;else st.ewma=(1-EWMA_ALPHA)*st.ewma+EWMA_ALPHA*sampleMean;if(st.variance===null)st.variance=sampleVar;else st.variance=(1-VARIANCE_ALPHA)*st.variance+VARIANCE_ALPHA*sampleVar;st.lastProbe=nowMs()}
function proxyBackoff(proxyIp){var st=__JO_ADV.proxies[proxyIp];if(!st)return;st.failures=(st.failures||0)+1;var backoff=Math.min(MAX_FAILURE_BACKOFF,FAILURE_BACKOFF_BASE*Math.pow(2,st.failures-1));st.backoffUntil=nowMs()+backoff}
function isProxyAvailable(proxyIp){var st=__JO_ADV.proxies[proxyIp];if(!st)return true;return(st.backoffUntil||0)<nowMs()}
function hashHostToIndex(host,n){var h=0;for(var i=0;i<host.length;i++)h=((h<<5)-h)+host.charCodeAt(i);return Math.abs(h)%n}
function getStickyPort(host,proxy){var key=host+"@"+proxy.ip;var rec=__JO_ADV.stickyPorts[key];var n=nowMs();if(rec&&(n-rec.t)<STICKY_PORT_TTL)return rec.port;var ports=proxy.ports&&proxy.ports.length?proxy.ports.slice():[443];ports.sort(function(a,b){if(a===20001)return-1;if(b===20001)return 1;return a-b});var idx=hashHostToIndex(host,ports.length);var port=ports[idx];__JO_ADV.stickyPorts[key]={port:port,t:n,tried:[port]};return port}
function evaluateProxy(proxy,host){if(!isProxyAvailable(proxy.ip))return{ok:false,score:-99999};var probe=multiProbe(proxy.ip,PROBE_COUNT);if(!probe.ip){proxyBackoff(proxy.ip);return{ok:false,score:-99999}}updateProxyStats(proxy.ip,probe.mean,probe.variance);var st=__JO_ADV.proxies[proxy.ip];var mean=st.ewma||probe.mean;var variance=st.variance||probe.variance;var varianceFactor=1+Math.sqrt(variance)/(1+mean);var score=proxy.weight/(1+mean)/varianceFactor;if(proxy.ports&&proxy.ports.indexOf(20001)!==-1)score*=1.12;return{ok:true,score:score,mean:mean,variance:variance,probe:probe}}
function chooseBestProxyForHost(host){var best=null;var bestScore=-999999;for(var i=0;i<PROXIES.length;i++){var ev=evaluateProxy(PROXIES[i],host);if(ev.ok&&ev.score>bestScore){bestScore=ev.score;best={proxy:PROXIES[i],eval:ev}}}return best}
function decideProxySwitch(host,candidate){var session=__JO_ADV.sessions[host];if(!session||!session.proxyIp){__JO_ADV.sessions[host]={proxyIp:candidate.proxy.ip,t:nowMs(),backoffUntil:0};return candidate.proxy}if(session.proxyIp===candidate.proxy.ip){session.t=nowMs();return candidate.proxy}var curr=__JO_ADV.proxies[session.proxyIp];var currScore=curr&&curr.ewma?(1/(1+curr.ewma)):0.0001;var candScore=candidate.eval.score||0;if(candScore>currScore*SWITCH_THRESHOLD){__JO_ADV.sessions[host]={proxyIp:candidate.proxy.ip,t:nowMs(),backoffUntil:0};return candidate.proxy}for(var i=0;i<PROXIES.length;i++){if(PROXIES[i].ip===session.proxyIp)return PROXIES[i]}__JO_ADV.sessions[host]={proxyIp:candidate.proxy.ip,t:nowMs(),backoffUntil:0};return candidate.proxy}
var h=host?host.toLowerCase():"";
if(isYouTubeHost(h))return"DIRECT";
var resolved=cacheDNS(h);
var hostIsJordanIP=resolved&&isIPInJordan(resolved);
var isLobby=matchAny(h,LOBBY_DOMAINS);
var isGame=matchAny(h,GAME_DOMAINS)||h.indexOf("pubg")!==-1||h.indexOf("tencent")!==-1;
if(hostIsJordanIP&&!FORBID_DIRECT_GLOBAL&&!isGame&&!isLobby)return"DIRECT";
var candidate=chooseBestProxyForHost(h);
if(!candidate){var fb=PROXIES[0];var fbPort=getStickyPort(h,fb);if(!FORBID_DIRECT_GLOBAL&&hostIsJordanIP)return"DIRECT";return"PROXY "+fb.ip+":"+fbPort}
var chosen=decideProxySwitch(h,candidate);
if(isGame){var gp=getStickyPort(h,chosen);return"SOCKS5 "+chosen.ip+":"+gp}
if(isLobby){var lp=getStickyPort(h,chosen);return"PROXY "+chosen.ip+":"+lp}
var hp=getStickyPort(h,chosen);
if(FORBID_DIRECT_GLOBAL)return"PROXY "+chosen.ip+":"+hp;
if(hostIsJordanIP)return"DIRECT";
return"PROXY "+chosen.ip+":"+hp
}
