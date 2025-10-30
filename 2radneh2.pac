function FindProxyForURL(url, host) {
  // =====================[ إعدادات عامة ]=====================
  var PROXY_HOSTS = ["91.106.109.12"];
  var FORBID_NON_JO = true;
  var BLOCK_REPLY = "PROXY 0.0.0.0:0";

  // منافذ/أوزان
  var PORTS = {
    LOBBY:           [443, 8443],
    MATCH:           [20001, 20003],
    RECRUIT_SEARCH:  [10012, 10013],
    UPDATES:         [80, 443, 8443],
    CDNs:            [80, 443]
  };
  var PORT_WEIGHTS = {
    LOBBY:           [5, 3],
    MATCH:           [3, 2],
    RECRUIT_SEARCH:  [3, 2],
    UPDATES:         [5, 3, 2],
    CDNs:            [3, 2]
  };

  // =====================[ استثناءات مباشرة ]=====================
  var EXCLUDE_DOMAINS = [
    // YouTube
    "*.youtube.com","*.googlevideo.com","*.ytimg.com","*.youtubei.googleapis.com","youtu.be",
    // Shahid
    "shahid.net","*.shahid.net","shahid.mbc.net","*.shahid.mbc.net","static.shahid.net","*.static.shahid.net","mbc.net","*.mbc.net"
  ];

  // =====================[ نطاقات أردنية عامة ]=====================
  var JO_IP_RANGES = [
    ["176.16.0.0","176.23.255.255"],
    ["176.47.0.0","176.52.255.255"],
    ["91.176.0.0","91.184.255.255"],
    ["109.86.0.0","109.86.255.255"],
    ["176.97.0.0","176.99.255.255"],
    ["94.64.0.0","94.72.255.255"],
    ["94.104.0.0","94.111.255.255"],
    ["109.128.0.0","109.132.255.255"],
    ["176.40.0.0","176.43.255.255"],
    ["217.96.0.1","217.99.255.255"],
    ["94.56.0.0","94.59.255.255"],
    ["91.93.0.0","91.95.255.255"],
    ["91.109.0.0","91.111.255.255"],
    ["91.191.0.0","91.193.255.255"],
    ["217.20.0.1","217.22.255.255"],
    ["217.52.0.1","217.54.255.255"],
    ["217.136.0.1","217.138.255.255"],
    ["217.142.0.1","217.144.255.255"],
    ["217.163.0.1","217.165.255.255"],
    ["109.82.0.0","109.83.255.255"],
    ["91.86.0.0","91.87.255.255"],
    ["91.132.0.0","91.133.255.255"],
    ["91.198.0.0","91.199.255.255"],
    ["91.227.0.0","91.228.255.255"],
    ["91.230.0.0","91.231.255.255"],
    ["91.244.0.0","91.245.255.255"],
    ["176.12.0.0","176.13.255.255"],
    ["176.54.0.0","176.55.255.255"],
    ["217.12.0.1","217.13.255.255"],
    ["217.30.0.1","217.31.255.255"],
    ["217.72.0.1","217.73.255.255"],
    ["217.156.0.1","217.157.255.255"],
    ["94.50.0.0","94.51.255.255"],
    ["94.128.0.0","94.129.255.255"],
    ["94.134.0.0","94.135.255.255"],
    ["91.84.0.0","91.84.255.255"],
    ["91.104.0.0","91.104.255.255"],
    ["91.107.0.0","91.107.255.255"],
    ["91.120.0.0","91.120.255.255"],
    ["91.122.0.0","91.122.255.255"],
    ["91.126.0.0","91.126.255.255"],
    ["91.135.0.0","91.135.255.255"],
    ["91.143.0.0","91.143.255.255"],
    ["91.147.0.0","91.147.255.255"],
    ["91.149.0.0","91.149.255.255"],
    ["91.186.0.0","91.186.255.255"],
    ["91.189.0.0","91.189.255.255"],
    ["91.204.0.0","91.204.255.255"],
    ["91.206.0.0","91.206.255.255"],
    ["91.209.0.0","91.209.255.255"],
    ["91.225.0.0","91.225.255.255"],
    ["91.235.0.0","91.235.255.255"],
    ["91.238.0.0","91.238.255.255"],
    ["91.252.0.0","91.252.255.255"],
    ["109.104.0.0","109.104.255.255"],
    ["109.125.0.0","109.125.255.255"],
    ["176.8.0.0","176.8.255.255"],
    ["176.33.0.0","176.33.255.255"],
    ["176.58.0.0","176.58.255.255"],
    ["176.65.0.0","176.65.255.255"],
    ["176.67.0.0","176.67.255.255"],
    ["176.72.0.0","176.72.255.255"],
    ["176.81.0.0","176.81.255.255"],
    ["176.88.0.0","176.88.255.255"],
    ["176.93.0.0","176.93.255.255"],
    ["176.115.0.0","176.115.255.255"],
    ["217.8.0.1","217.8.255.255"],
    ["217.18.0.1","217.18.255.255"],
    ["217.27.0.1","217.27.255.255"],
    ["217.61.0.1","217.61.255.255"],
    ["217.64.0.1","217.64.255.255"],
    ["217.70.0.1","217.70.255.255"],
    ["217.79.0.1","217.79.255.255"],
    ["217.119.0.1","217.119.255.255"],
    ["217.129.0.1","217.129.255.255"],
    ["217.132.0.1","217.132.255.255"],
    ["217.147.0.1","217.147.255.255"],
    ["217.154.0.1","217.154.255.255"],
    ["217.160.0.1","217.160.255.255"],
    ["217.168.0.1","217.168.255.255"],
    ["217.170.0.1","217.170.255.255"],
    ["217.175.0.1","217.175.255.255"],
    ["217.178.0.1","217.178.255.255"],
    ["94.16.0.0","94.16.255.255"],
    ["94.20.0.0","94.20.255.255"],
    ["94.25.0.0","94.25.255.255"],
    ["94.27.0.0","94.27.255.255"],
    ["94.77.0.0","94.77.255.255"],
    ["94.102.0.0","94.102.255.255"],
    ["94.119.0.0","94.119.255.255"]
  ];

  // =====================[ مجموعات سكنية: Fiber / DSL / Mobile ]=====================
  // بذور قابلة للتعديل (زد/نقّص/جزّئ لـ /24 حسب الحاجة)
  var FIBER_JO = [
    ["109.107.0.0","109.107.127.255"], // أولوية عليا (طلبك)
    ["94.104.0.0","94.111.255.255"],   // بذرة فايبر واسعة
    ["217.96.0.1","217.99.255.255"]    // بذرة فايبر/FTTH
  ];
  var DSL_JO = [
    ["176.16.0.0","176.23.255.255"],
    ["94.56.0.0","94.59.255.255"],
    ["94.64.0.0","94.72.255.255"]
  ];
  var MOBILE_JO = [
    ["91.176.0.0","91.184.255.255"],
    ["176.40.0.0","176.43.255.255"]
  ];

  // =====================[ سياسة كل فئة بالنسبة للمجموعة ]=====================
  // MODES: "STRICT" = لازم ضمن المجموعة المحددة، "PREFER" = يفضل المجموعة وإلا ي fallback على ANY_JO، "ANY_JO" = أي أردني
  var CATEGORY_GROUP_MODE = {
    LOBBY:          {mode:"STRICT", groups:["FIBER"]},             // لوبي فقط فايبر + ضمن أولوية /17 لاحقاً
    MATCH:          {mode:"STRICT", groups:["FIBER"]},             // ماتش فقط فايبر + ضمن أولوية /17 لاحقاً
    RECRUIT_SEARCH: {mode:"PREFER", groups:["FIBER","DSL"]},       // يفضّل فايبر/DSL، ويسمح بأي أردني لو ما توفر
    UPDATES:        {mode:"ANY_JO", groups:["FIBER","DSL","MOBILE"]},
    CDNs:           {mode:"ANY_JO", groups:["FIBER","DSL","MOBILE"]}
  };

  // =====================[ أولوية لوبي/ماتش ]=====================
  var LOBBY_MATCH_PRIORITY = [
    ["109.107.0.0","109.107.127.255"]
  ];
  var RECRUIT_PRIORITY = [
    ["109.107.0.0","109.107.127.255"],
    ["176.16.0.0","176.23.255.255"],
    ["94.64.0.0","94.72.255.255"],
    ["217.96.0.1","217.99.255.255"],
    ["217.20.0.1","217.22.255.255"],
    ["94.104.0.0","94.111.255.255"],
    ["94.56.0.0","94.59.255.255"]
  ];

  // =====================[ Sticky/Deterministic ]=====================
  var STICKY_SALT = "JO_STICKY_V3";
  var STICKY_TTL_MINUTES = 90;
  var JITTER_WINDOW = 5 * 60 * 1000;
  var DST_RESOLVE_TTL_MS = 20 * 1000;

  var now = new Date().getTime();
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};
  if (!CACHE._PROXY_PICK) CACHE._PROXY_PICK = {};

  // PUBG domains & paths
  var PUBG_DOMAINS = {
    LOBBY:           ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH:           ["*.gcloud.qq.com","gpubgm.com"],
    RECRUIT_SEARCH:  ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    UPDATES:         ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
    CDNs:            ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };
  var URL_PATTERNS = {
    LOBBY:           ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH:           ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH:  ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES:         ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
    CDNs:            ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  // =====================[ دوال مساعدة ]=====================
  function ipToInt(ip){var a=ip.split(".");return (parseInt(a[0])<<24)+(parseInt(a[1])<<16)+(parseInt(a[2])<<8)+parseInt(a[3]);}
  function ipInRangeList(ip, list){if(!ip) return false;var n=ipToInt(ip);for(var i=0;i<list.length;i++){var s=ipToInt(list[i][0]);var e=ipToInt(list[i][1]);if(n>=s && n<=e) return true;}return false;}
  function ipInJordan(ip){return ipInRangeList(ip, JO_IP_RANGES);}
  function shMatchAny(h, pats){for(var i=0;i<pats.length;i++){if(shExpMatch(h, pats[i])) return true;var p=pats[i].replace(/^\*\./,".");if(h.slice(-p.length)===p) return true;}return false;}
  function pathMatches(u,pats){for(var i=0;i<pats.length;i++) if(shExpMatch(u,pats[i])) return true;return false;}
  function djb2(s){var h=5381;for(var i=0;i<s.length;i++) h=((h<<5)+h)+s.charCodeAt(i);return h>>>0;}
  function resolveDstCached(h,ttl){if(!h) return "";if(/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;var c=CACHE.DST_RESOLVE_CACHE[h];if(c && (now-c.t)<ttl) return c.ip;var r=dnsResolve(h);var ip=(r && r!=="0.0.0.0")?r:"";CACHE.DST_RESOLVE_CACHE[h]={ip:ip,t:now};return ip;}
  function pickProxyHostDeterministic(h){var key=STICKY_SALT+"_PHOST";var ttl=(STICKY_TTL_MINUTES*60*1000)+(Math.floor(Math.random()*2-1)*JITTER_WINDOW);var e=CACHE._PROXY_PICK[key];if(e && (now-e.t)<ttl) return e.h;var idx=djb2(h||"X")%PROXY_HOSTS.length;var chosen=PROXY_HOSTS[idx];CACHE._PROXY_PICK[key]={h:chosen,t:now};return chosen;}
  function deterministicWeightedPick(cat,h){var ports=PORTS[cat], w=PORT_WEIGHTS[cat];var tot=0;for(var i=0;i<w.length;i++) tot+=(w[i]||1);var rnd=(djb2(STICKY_SALT+"|"+cat+"|"+(h||""))%tot)+1;var acc=0;for(var k=0;k<ports.length;k++){acc+=(w[k]||1);if(rnd<=acc) return ports[k];}return ports[0];}
  function proxyForCategory(cat,h){var ph=pickProxyHostDeterministic(h);var key=STICKY_SALT+"_PORT_"+cat;var base=STICKY_TTL_MINUTES*60*1000;var ttl=base+(Math.floor(Math.random()*2-1)*JITTER_WINDOW);var e=CACHE._PORT_STICKY[key];if(e && (now-e.t)<ttl) return "PROXY "+ph+":"+e.p;var p=deterministicWeightedPick(cat,h);CACHE._PORT_STICKY[key]={p:p,t:now};return "PROXY "+ph+":"+p;}

  // تحقق أردنية العميل والبروكسي
  var geoTTL=STICKY_TTL_MINUTES*60*1000, ckey=STICKY_SALT+"_CLIENT_JO";
  var cE=CACHE[ckey], clientOK;
  if(cE && (now-cE.t)<geoTTL){clientOK=cE.ok;} else {clientOK=ipInJordan(resolveDstCached(myIpAddress(), DST_RESOLVE_TTL_MS));CACHE[ckey]={ok:clientOK,t:now};}
  var chosenProxyHost=pickProxyHostDeterministic(host);
  var proxyOK=ipInJordan(chosenProxyHost);
  if(!(clientOK && proxyOK)) return FORBID_NON_JO?BLOCK_REPLY:"DIRECT";

  // محلي ودومينات مستثناة
  if (isPlainHostName(host) || shExpMatch(host,"localhost") ||
      shExpMatch(host,"127.*") || shExpMatch(host,"10.*") ||
      shExpMatch(host,"192.168.*") || shExpMatch(host,"172.16.*") || shExpMatch(host,"172.31.*")) return "DIRECT";
  if (shMatchAny(host, EXCLUDE_DOMAINS)) return "DIRECT";

  // =====================[ منطق المجموعات ]=====================
  function ipInGroup(ip, groupName){
    if(groupName==="FIBER") return ipInRangeList(ip, FIBER_JO);
    if(groupName==="DSL")   return ipInRangeList(ip, DSL_JO);
    if(groupName==="MOBILE")return ipInRangeList(ip, MOBILE_JO);
    if(groupName==="ANY_JO")return ipInJordan(ip);
    return false;
  }
  function enforceGroup(cat, h, priorityRanges){
    var cfg = CATEGORY_GROUP_MODE[cat]; var ip = resolveDstCached(h, DST_RESOLVE_TTL_MS);
    // لازم أردني أولاً دائماً
    if (!ipInJordan(ip)) return FORBID_NON_JO?BLOCK_REPLY:"DIRECT";

    // أولوية صارمة للّوبي/الماتش على /17 المحدد
    if ((cat==="LOBBY"||cat==="MATCH") && !ipInRangeList(ip, priorityRanges)) {
      return FORBID_NON_JO?BLOCK_REPLY:"DIRECT";
    }

    if (cfg.mode==="ANY_JO") {
      return proxyForCategory(cat, h);
    }

    // تحقق من المجموعات المطلوبة
    var ok=false;
    for (var i=0;i<cfg.groups.length;i++){
      if (ipInGroup(ip, cfg.groups[i])) { ok=true; break; }
    }
    if (cfg.mode==="STRICT") {
      return ok ? proxyForCategory(cat, h) : (FORBID_NON_JO?BLOCK_REPLY:"DIRECT");
    } else if (cfg.mode==="PREFER") {
      if (ok) return proxyForCategory(cat, h);
      // fallback لأي أردني
      return proxyForCategory(cat, h);
    }
    // افتراضي
    return proxyForCategory(cat, h);
  }

  // =====================[ تصنيف حسب URL أولاً ]=====================
  if (pathMatches(url, URL_PATTERNS.LOBBY))           return enforceGroup("LOBBY", host, LOBBY_MATCH_PRIORITY);
  if (pathMatches(url, URL_PATTERNS.MATCH))           return enforceGroup("MATCH", host, LOBBY_MATCH_PRIORITY);
  if (pathMatches(url, URL_PATTERNS.RECRUIT_SEARCH))  return enforceGroup("RECRUIT_SEARCH", host, RECRUIT_PRIORITY);
  if (pathMatches(url, URL_PATTERNS.UPDATES))         return enforceGroup("UPDATES", host, []);
  if (pathMatches(url, URL_PATTERNS.CDNs))            return enforceGroup("CDNs", host, []);

  // =====================[ تصنيف حسب الدومين ثانياً ]=====================
  if (shMatchAny(host, PUBG_DOMAINS.LOBBY))           return enforceGroup("LOBBY", host, LOBBY_MATCH_PRIORITY);
  if (shMatchAny(host, PUBG_DOMAINS.MATCH))           return enforceGroup("MATCH", host, LOBBY_MATCH_PRIORITY);
  if (shMatchAny(host, PUBG_DOMAINS.RECRUIT_SEARCH))  return enforceGroup("RECRUIT_SEARCH", host, RECRUIT_PRIORITY);
  if (shMatchAny(host, PUBG_DOMAINS.UPDATES))         return enforceGroup("UPDATES", host, []);
  if (shMatchAny(host, PUBG_DOMAINS.CDNs))            return enforceGroup("CDNs", host, []);

  // =====================[ فحص مباشر عبر IP ]=====================
  var dst = /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : resolveDstCached(host, DST_RESOLVE_TTL_MS);
  if (dst && ipInRangeList(dst, LOBBY_MATCH_PRIORITY)) return enforceGroup("LOBBY", host, LOBBY_MATCH_PRIORITY);
  if (dst && ipInRangeList(dst, RECRUIT_PRIORITY))     return enforceGroup("RECRUIT_SEARCH", host, RECRUIT_PRIORITY);
  if (dst && ipInJordan(dst))                          return enforceGroup("UPDATES", host, []);

  return FORBID_NON_JO ? BLOCK_REPLY : "DIRECT";
}
