function FindProxyForURL(url, host) {
  // يمكنك إبقاء هذا IP، أو الأفضل تضع اسم دومين للبروكسي يمتلك AAAA أردني للتحقق الفعلي أدناه:
  var PROXY_HOST = "91.106.109.12";           // يُستخدم في سطر PROXY
  var PROXY_HOSTNAME_V6 = "64:ff9b::5b6a:6d0c";                 // مثال: "proxy.example.jo" (اختياري للتحقق IPv6)

  // منافذ وأوزان
  var PORTS = {
    LOBBY: [443, 8080, 8443],
    MATCH: [20001, 20002, 20003],
    RECRUIT_SEARCH: [10010, 10012, 10013, 10039, 10096, 10491, 10612, 11000, 11455, 12235],
    UPDATES: [80, 443, 8443, 8080],
    CDNs: [80, 8080, 443]
  };
  var PORT_WEIGHTS = {
    LOBBY: [5, 3, 2],
    MATCH: [4, 2, 1],
    RECRUIT_SEARCH: [4, 3, 3, 2, 2, 2, 2, 2, 2, 1],
    UPDATES: [5, 3, 2, 1],
    CDNs: [3, 2, 2]
  };

  // سياسة
  var HARD_BLOCK_NON_JO = true;
  var BLOCK_REPLY = "PROXY 127.0.0.1:9";
  var STICKY_SALT = "JO_STICKY";
  var STICKY_TTL_MINUTES = 30;
  var JITTER_WINDOW = 3;
  var DST_RESOLVE_TTL_MS = 30000;

  // مدى الأردن IPv6 (مطابق لـ 2a00:18d8::/45)
  var JO_V6_48_RANGES = [
  ["2a03:6b00:0000:0000:0000:0000:0000:0000","2a03:6b00:ffff:ffff:ffff:ffff:ffff:ffff"], // --3
  ["2a03:6d00:0000:0000:0000:0000:0000:0000","2a03:6d00:ffff:ffff:ffff:ffff:ffff:ffff"], // --2
  ["2a00:18d8:0000:0000:0000:0000:0000:0000","2a00:18df:ffff:ffff:ffff:ffff:ffff:ffff"], // --1
  ["2a03:6b01:0000:0000:0000:0000:0000:0000","2a03:6b01:ffff:ffff:ffff:ffff:ffff:ffff"], // --4
  ["2a03:b640:0000:0000:0000:0000:0000:0000","2a03:b640:ffff:ffff:ffff:ffff:ffff:ffff"], // --5
  ["2a01:01d0:0000:0000:0000:0000:0000:0000","2a01:01d0:ffff:ffff:ffff:ffff:ffff:ffff"] //  --6
];

  // نطاقات PUBG
  var PUBG_DOMAINS = {
    LOBBY: ["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
    MATCH: ["*.gcloud.qq.com","gpubgm.com"],
    RECRUIT_SEARCH: ["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
    UPDATES: ["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
    CDNs: ["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
  };
  var URL_PATTERNS = {
    LOBBY: ["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
    MATCH: ["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
    RECRUIT_SEARCH: ["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
    UPDATES: ["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
    CDNs: ["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
  };

  // استثناء يوتيوب: DIRECT دائمًا
  var YOUTUBE_DOMAINS = [
    "*.youtube.com","youtu.be","*.googlevideo.com","youtubei.googleapis.com",
    "*.ytimg.com","*.yt3.ggpht.com","*.ggpht.com","*.withyoutube.com"
  ];

  // كاش داخلي
  var root = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};
  var now = new Date().getTime();

  // أدوات مساعدة
  function splitList(s){ return (s||"").replace(/\s+/g,"").split(/[\,\;]+/).filter(Boolean); }
  function has(fn){ try { return typeof this[fn]==="function"; } catch(e){ return false; } }
  function normIPv6(ip){ ip=(ip||"").replace(/^\[|\]$/g,""); var z=ip.indexOf("%"); return z>0?ip.slice(0,z):ip; }

  // IPv6 parsing بدون BigInt
  function expandIPv6(ip){
    ip = normIPv6(ip).toLowerCase();
    if (ip === "") return null;
    var parts = ip.split("::");
    var left  = parts[0].length ? parts[0].split(":") : [];
    var right = (parts.length>1 && parts[1].length) ? parts[1].split(":") : [];
    function pad(x){ return x === "" ? "0" : x; }
    for (var i=0;i<left.length;i++)  left[i]=pad(left[i]);
    for (var j=0;j<right.length;j++) right[j]=pad(right[j]);
    var missing = 8 - (left.length + right.length);
    if (parts.length === 1) missing = 0;
    if (missing < 0) return null;
    var mid=[]; for (var k=0;k<missing;k++) mid.push("0");
    var full=left.concat(mid,right); if (full.length!==8) return null;
    var out=[]; for (var t=0;t<8;t++){ var v=parseInt(full[t],16); if(!(v>=0&&v<=0xFFFF)) return null; out.push(v); }
    return out;
  }
  function cmpIPv6Words(a,b){ for (var i=0;i<8;i++){ if(a[i]<b[i])return-1; if(a[i]>b[i])return 1; } return 0; }
  function ipInRange(ip,s,e){ var ai=expandIPv6(ip),si=expandIPv6(s),ei=expandIPv6(e); if(!ai||!si||!ei) return false; return (cmpIPv6Words(si,ai)<=0)&&(cmpIPv6Words(ai,ei)<=0); }
  function ipInAnyRanges(ip, ranges){ for (var i=0;i<ranges.length;i++){ if (ipInRange(ip, ranges[i][0], ranges[i][1])) return true; } return false; }
  function isJordanV6(ip){ return ip && ip.indexOf(":")!==-1 && ipInAnyRanges(ip, JO_V6_48_RANGES); }

  // حلّ AAAA فقط
  function resolveV6(hostname){
    if (!hostname) return "";
    if (/^[0-9a-fA-F:\[\]]+$/.test(hostname)) return normIPv6(hostname); // IPv6 literal
    if (has("dnsResolveEx")){
      var lst = splitList(dnsResolveEx(hostname));
      for (var i=0;i<lst.length;i++){ var cand=normIPv6(lst[i]); if (cand && cand.indexOf(":")!==-1) return cand; }
    }
    return "";
  }

  // مطابقة
  function pathMatches(u, arr){ for (var i=0;i<arr.length;i++) if (shExpMatch(u,arr[i])) return true; return false; }
  function hostMatches(h, arr){
    for (var i=0;i<arr.length;i++){
      if (shExpMatch(h, arr[i])) return true;
      var p = arr[i].replace(/^\*\./,".");
      if (h.slice(-p.length)===p) return true;
    }
    return false;
  }

  // يوتيوب: DIRECT مبكراً
  if (hostMatches(host, YOUTUBE_DOMAINS) ||
      shExpMatch(url, "*youtube*") || shExpMatch(url, "*googlevideo*")) {
    return "DIRECT";
  }

  // اختيار منفذ + sticky
  function weightedPick(ports, weights){
    var sum=0; for (var i=0;i<weights.length;i++) sum+=(weights[i]||1);
    var jitter=(JITTER_WINDOW>0)?Math.floor(Math.random()*JITTER_WINDOW):0;
    var r=Math.floor(Math.random()*(sum+jitter))+1, acc=0;
    for (var k=0;k<ports.length;k++){ acc+=(weights[k]||1); if (r<=acc) return ports[k]; }
    return ports[0];
  }
  function proxyFor(category){
    var key=STICKY_SALT+"_PORT_"+category, ttl=STICKY_TTL_MINUTES*60000;
    var e=CACHE._PORT_STICKY[key];
    if (e && (now - e.t) < ttl) return "PROXY "+PROXY_HOST+":"+e.p;
    var p=weightedPick(PORTS[category], PORT_WEIGHTS[category]);
    CACHE._PORT_STICKY[key]={p:p, t:now};
    return "PROXY "+PROXY_HOST+":"+p;
  }

  // تحقق أن مسار "الإرسال والاستقبال" أردني قدر الإمكان:
  // 1) العميل IPv6 أردني
  var clientOK=(function(){
    if (!has("myIpAddressEx")) return false;
    var lst=splitList(myIpAddressEx());
    for (var i=0;i<lst.length;i++){
      if (isJordanV6(normIPv6(lst[i]))) return true;
    }
    return false;
  })();
  if (!clientOK) return HARD_BLOCK_NON_JO ? BLOCK_REPLY : "DIRECT";

  // 2) البروكسي IPv6 أردني (اختياري إن حطيت اسم دومين في PROXY_HOSTNAME_V6)
  function proxyIsJordan(){
    if (!PROXY_HOSTNAME_V6) return true; // ما عندنا شيء نتحقق منه
    if (!has("dnsResolveEx")) return true; // محرّك PAC ما يدعم التحقق
    var lst = splitList(dnsResolveEx(PROXY_HOSTNAME_V6));
    for (var i=0;i<lst.length;i++){
      var ip = normIPv6(lst[i]);
      if (ip && ip.indexOf(":")!==-1 && isJordanV6(ip)) return true;
    }
    return false;
  }
  if (!proxyIsJordan()) return HARD_BLOCK_NON_JO ? BLOCK_REPLY : "DIRECT";

  // 3) الوجهة IPv6 أردنية
  function requireJordanV6(category, h){
    var c=CACHE.DST_RESOLVE_CACHE[h];
    var ip=(c && (now - c.t) < DST_RESOLVE_TTL_MS) ? c.ipv6 : "";
    if (!ip) { ip=resolveV6(h); CACHE.DST_RESOLVE_CACHE[h]={ipv6:ip, t:now}; }
    if (!isJordanV6(ip)) return HARD_BLOCK_NON_JO ? BLOCK_REPLY : "DIRECT";
    return proxyFor(category);
  }

  // مسارات URL أولاً
  for (var cat in URL_PATTERNS) if (pathMatches(url, URL_PATTERNS[cat])) return requireJordanV6(cat, host);
  // ثم الدومينات
  for (var c in PUBG_DOMAINS) if (hostMatches(host, PUBG_DOMAINS[c])) return requireJordanV6(c, host);
  // وأخيراً فحص الوجهة مباشرة
  var dst=resolveV6(host);
  if (isJordanV6(dst)) return proxyFor("LOBBY");

  return HARD_BLOCK_NON_JO ? BLOCK_REPLY : "DIRECT";
}
