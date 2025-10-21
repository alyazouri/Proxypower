function FindProxyForURL(url, host) {
  var PROXY_HOST         = "91.106.109.12";
  var PORTS              = { LOBBY:[443,8080,8443], MATCH:[20001,20002,20003], RECRUIT_SEARCH:[10010,10012,10013,10039,10096,10491,10612,11000,11455,12235], UPDATES:[80,443,8443,8080], CDNs:[80,8080,443] };
  var PORT_WEIGHTS       = { LOBBY:[5,3,2], MATCH:[4,2,1], RECRUIT_SEARCH:[4,3,3,2,2,2,2,2,2,1], UPDATES:[5,3,2,1], CDNs:[3,2,2] };

  var JO_IP_RANGES = [
    ["94.249.0.0","94.249.127.255"],
    ["109.107.0.0","109.107.255.255"],
    ["92.241.32.0","92.241.63.255"],
    ["212.35.0.0","212.35.255.255"],
    ["212.118.0.0","212.118.255.255"]
  ];

  var PUBG_DOMAINS = {
    LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH:["*.gcloud.qq.com","gpubgm.com"],
    RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
    CDNs:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };
  var URL_PATTERNS = {
    LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
    CDNs:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  var STRICT_JO_FOR       = { LOBBY:true, MATCH:true, RECRUIT_SEARCH:true, UPDATES:true, CDNs:true };
  var FORBID_NON_JO       = true;
  var BLOCK_REPLY         = "PROXY 0.0.0.0:0";
  var STICKY_SALT         = "JO_STICKY";
  var STICKY_TTL_MINUTES  = 30;
  var JITTER_WINDOW       = 2;
  var DST_RESOLVE_TTL_MS  = 30000;
  var now                 = new Date().getTime();
  var root                = (typeof globalThis!=="undefined"?globalThis:this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};

  function ipToInt(ip){var p=ip.split(".");return ((parseInt(p[0],10)<<24)>>>0)+((parseInt(p[1],10)<<16)>>>0)+((parseInt(p[2],10)<<8)>>>0)+(parseInt(p[3],10)>>>0);}
  function ipInRange(ip,a,b){if(!ip)return false;var n=ipToInt(ip),s=ipToInt(a),e=ipToInt(b);return (n>=s&&n<=e);}
  function ipInAnyJO(ip){if(!ip)return false;for(var i=0;i<JO_IP_RANGES.length;i++){if(ipInRange(ip,JO_IP_RANGES[i][0],JO_IP_RANGES[i][1]))return true;}return false;}
  function hostMatchesAny(h,arr){for(var i=0;i<arr.length;i++){var pat=arr[i];if(shExpMatch(h,pat))return true;var p=pat.replace(/^\*\./,".");if(h.slice(-p.length)===p)return true;}return false;}
  function pathMatches(u,arr){for(var i=0;i<arr.length;i++)if(shExpMatch(u,arr[i]))return true;return false;}
  function weightedPick(ports,w){var sum=0;for(var i=0;i<w.length;i++)sum+=(w[i]||1);var r=Math.floor(Math.random()*(sum+JITTER_WINDOW))+1,acc=0;for(var k=0;k<ports.length;k++){acc+=(w[k]||1);if(r<=acc)return ports[k];}return ports[0];}
  function proxyFor(cat){var key=STICKY_SALT+"_PORT_"+cat,ttl=STICKY_TTL_MINUTES*60000,e=CACHE._PORT_STICKY[key];if(e&&(now-e.t)<ttl)return "PROXY "+PROXY_HOST+":"+e.p;var p=weightedPick(PORTS[cat],PORT_WEIGHTS[cat]);CACHE._PORT_STICKY[key]={p:p,t:now};return "PROXY "+PROXY_HOST+":"+p;}
  function resolveDst(h,ttl){if(!h)return "";if(/^\d+\.\d+\.\d+\.\d+$/.test(h))return h;var c=CACHE.DST_RESOLVE_CACHE[h];if(c&&(now-c.t)<ttl)return c.ip;var r=dnsResolve(h);var ip=(r&&r!=="0.0.0.0")?r:"";CACHE.DST_RESOLVE_CACHE[h]={ip:ip,t:now};return ip;}
  function requireJO(cat,h){var ip=resolveDst(h,DST_RESOLVE_TTL_MS);if(!ipInAnyJO(ip))return FORBID_NON_JO?BLOCK_REPLY:"DIRECT";return proxyFor(cat);}

  if (isPlainHostName(host) || host==="127.0.0.1" || host==="localhost") return "DIRECT";

  for (var cat in URL_PATTERNS) if (pathMatches(url, URL_PATTERNS[cat])) return STRICT_JO_FOR[cat]?requireJO(cat,host):proxyFor(cat);
  for (var c in PUBG_DOMAINS) if (hostMatchesAny(host, PUBG_DOMAINS[c])) return STRICT_JO_FOR[c]?requireJO(c,host):proxyFor(c);

  var dst = /^\d+\.\d+\.\d+\.\d+$/.test(host)?host:resolveDst(host,DST_RESOLVE_TTL_MS);
  if (dst && ipInAnyJO(dst)) return proxyFor("LOBBY");
  return FORBID_NON_JO?BLOCK_REPLY:"DIRECT";
}
