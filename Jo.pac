function FindProxyForURL(url, host) {
if (isPlainHostName(host) || host === "127.0.0.1" || host === "localhost") return "DIRECT";
var PROXY_HOST = "91.106.109.12";
var PORTS = {
  LOBBY: [443,8080,8443],
  MATCH: [20001,20002,20003],
  RECRUIT_SEARCH: [10010,10012,10013,10039,10096,10491,10612,11000,11455,12235],
  UPDATES: [80,443,8443,8080],
  CDNs: [80,8080,443]
};
var PORT_WEIGHTS = {
  LOBBY: [5,3,2],
  MATCH: [4,2,1],
  RECRUIT_SEARCH: [4,3,3,2,2,2,2,2,2,1],
  UPDATES: [5,3,2,1],
  CDNs: [3,2,2]
};
var JO_IP_RANGES = [
["176.29.0.0","176.29.255.255"],["86.108.0.0","86.108.127.255"],["46.185.128.0","46.185.255.255"],["92.253.0.0","92.253.127.255"],
["94.249.0.0","94.249.127.255"],["149.200.128.0","149.200.255.255"],["176.28.128.0","176.28.255.255"],["79.173.192.0","79.173.255.255"],
["82.212.64.0","82.212.127.255"],["37.202.64.0","37.202.127.255"],["178.77.128.0","178.77.191.255"],["213.139.32.0","213.139.63.255"],
["109.107.224.0","109.107.255.255"],["212.34.0.0","212.34.31.255"],["95.172.192.0","95.172.223.255"],["212.35.64.0","212.35.95.255"],
["91.186.224.0","91.186.255.255"],["212.118.0.0","212.118.31.255"],["37.123.64.0","37.123.95.255"],["46.248.192.0","46.248.223.255"],
["62.72.160.0","62.72.191.255"],["79.134.128.0","79.134.159.255"],["84.18.32.0","84.18.63.255"],["84.18.64.0","84.18.95.255"],
["92.241.32.0","92.241.63.255"],["94.142.32.0","94.142.63.255"],["176.57.0.0","176.57.31.255"],["188.123.160.0","188.123.191.255"],
["188.247.64.0","188.247.95.255"],["194.165.128.0","194.165.159.255"],["213.186.160.0","213.186.191.255"],["46.32.96.0","46.32.111.255"],
["37.220.112.0","37.220.127.255"],["91.106.96.0","91.106.111.255"],["5.45.128.0","5.45.143.255"],["37.17.192.0","37.17.207.255"],
["46.23.112.0","46.23.127.255"],["77.245.0.0","77.245.15.255"],["80.90.160.0","80.90.175.255"],["81.28.112.0","81.28.127.255"],
["95.141.208.0","95.141.223.255"],["178.238.176.0","178.238.191.255"],["217.23.32.0","217.23.47.255"],["217.29.240.0","217.29.255.255"],
["217.144.0.0","217.144.15.255"],["37.152.0.0","37.152.7.255"],["37.220.120.0","37.220.127.255"],["81.21.8.0","81.21.15.255"],
["81.21.0.0","81.21.0.255"],["81.21.5.0","81.21.5.255"],["81.21.6.0","81.21.6.255"]
];
var STRICT_JO_FOR = { LOBBY: true, MATCH: true, RECRUIT_SEARCH: true };
var BLOCK_REPLY = "PROXY 0.0.0.0:0";
var STICKY_TTL = 30*60*1000;
var DST_TTL = 60*1000;
var now = Date.now();
var CACHE = (globalThis||this)._PAC_CACHE||((globalThis||this)._PAC_CACHE={});
CACHE.DST_RESOLVE_CACHE = CACHE.DST_RESOLVE_CACHE||{};
CACHE._PORT_STICKY = CACHE._PORT_STICKY||{};
var PUBG_DOMAINS = {
LOBBY: ["*.pubgmobile.*","*.proximabeta.com","*.igamecj.com"],
MATCH: ["*.gcloud.qq.com","gpubgm.com"],
RECRUIT_SEARCH: ["match.*.com","teamfinder.*.com"],
UPDATES: ["*pubgmobile.com","patch.*.com","hotfix.*.com","*.qq.com","gpubgm.com"],
CDNs: ["cdn.*.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};
var URL_PATTERNS = {
LOBBY: ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
MATCH: ["*/matchmaking/*","*/mms/*","*/game/*","*/report/battle*"],
RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
UPDATES: ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/obb*"],
CDNs: ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};
function ipToInt(ip){var p=ip.split(".");return(p[0]<<24)+(p[1]<<16)+(p[2]<<8)+(+p[3]);}
function ipInRange(ip){if(!ip) return false;var ipNum=ipToInt(ip);for(var i=0;i<JO_IP_RANGES.length;i++){var r=JO_IP_RANGES[i];if(ipNum>=ipToInt(r[0])&&ipNum<=ipToInt(r[1])) return true;}return false;}
function hostMatches(h,patterns){for(var i=0;i<patterns.length;i++){var p=patterns[i];if(shExpMatch(h,p)||h.endsWith(p.replace(/^\*\./,"."))) return true;}return false;}
function pathMatches(u,patterns){for(var i=0;i<patterns.length;i++){if(shExpMatch(u,patterns[i])) return true;}return false;}
function weightedPick(ports,weights){var sum=0;for(var i=0;i<weights.length;i++) sum+=(weights[i]||1);var r=Math.random()*(sum+(Math.random()*3|0))+1;var acc=0;for(var j=0;j<ports.length;j++){acc+=(weights[j]||1);if(r<=acc) return ports[j];}return ports[0];}
function proxyForCategory(cat){var key="JO_STICKY_PORT_"+cat;var e=CACHE._PORT_STICKY[key];if(e&&(now-e.t)<STICKY_TTL) return "PROXY "+PROXY_HOST+":"+e.p;var p=weightedPick(PORTS[cat],PORT_WEIGHTS[cat]);CACHE._PORT_STICKY[key]={p:p,t:now};return "PROXY "+PROXY_HOST+":"+p;}
function resolveDst(h){if(!h||/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;var c=CACHE.DST_RESOLVE_CACHE[h];if(c&&(now-c.t)<DST_TTL) return c.ip;var ip=dnsResolve(h)||"";CACHE.DST_RESOLVE_CACHE[h]={ip:ip,t:now};return ip;}
if(!ipInRange(PROXY_HOST)) return BLOCK_REPLY;
var cats=["MATCH","RECRUIT_SEARCH","LOBBY","UPDATES","CDNs"];
for(var i=0;i<cats.length;i++){var c=cats[i];if(pathMatches(url,URL_PATTERNS[c])||hostMatches(host,PUBG_DOMAINS[c])){if((c==="MATCH"||c==="RECRUIT_SEARCH"||c==="LOBBY")&&!ipInRange(resolveDst(host))) return BLOCK_REPLY;return STRICT_JO_FOR[c]&&!ipInRange(resolveDst(host))?BLOCK_REPLY:proxyForCategory(c);}}
var dst=resolveDst(host);
return dst&&ipInRange(dst)?proxyForCategory("LOBBY"):"DIRECT";
}
