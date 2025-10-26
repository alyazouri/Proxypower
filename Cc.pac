// JO-HARD-LOCK.pac
// قفل حديدي: 
// - فقط يسمح دومينات PUBG المعروفة.
// - فقط يسمح لسيرفرات موجودة جوّا الأردن (IPv4 أردني أو IPv6 أردني).
// - كل شيء ثاني بلوك فوري.
// - ما في fallback واسع ولا دومينات جديدة غريبة ولا استثناءات.

(function(){

  var PROXY_HOST = "91.106.109.12";
  var PROXY_PORT = 443;
  var ALLOW = "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  var BLOCK = "PROXY 0.0.0.0:0";

  var DNS_TTL = 15000;

  var ROOT = (typeof globalThis !== "undefined" ? globalThis : this);
  if (!ROOT._JO_HARD_CACHE) ROOT._JO_HARD_CACHE = {};
  var CACHE = ROOT._JO_HARD_CACHE;
  if (!CACHE.dns) CACHE.dns = {};

  // دومينات PUBG فقط. أي host مش هون = بلوك.
  var PUBG_HOSTS_STRICT = [
    "*.pubgmobile.com",
    "*.pubgmobile.net",
    "*.proximabeta.com",
    "*.igamecj.com",
    "*.gcloud.qq.com",
    "gpubgm.com",
    "teamfinder.igamecj.com",
    "teamfinder.proximabeta.com",
    "match.igamecj.com",
    "match.proximabeta.com",
    "cdn.pubgmobile.com",
    "updates.pubgmobile.com",
    "patch.igamecj.com",
    "hotfix.proximabeta.com",
    "dlied1.qq.com",
    "dlied2.qq.com",
    "cdn.proximabeta.com",
    "cdn.tencentgames.com",
    "*.qcloudcdn.com",
    "*.cloudfront.net",
    "*.edgesuite.net"
  ];

  function hostAllowedStrict(h){
    if(!h) return false;
    h = h.toLowerCase();
    for (var i=0;i<PUBG_HOSTS_STRICT.length;i++){
      var pat = PUBG_HOSTS_STRICT[i];
      if (shExpMatch(h, pat)) return true;
      if (pat.indexOf("*.")===0){
        var suf = pat.substring(1);
        if (h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;
      }
    }
    return false;
  }

  // رينجات IPv4 أردنية
  var JO_V4_RANGES = [
    ["109.104.0.0","109.104.255.255"],
    ["109.107.0.0","109.107.255.255"],
    ["109.125.0.0","109.125.255.255"],
    ["109.128.0.0","109.132.255.255"],
    ["176.16.0.0","176.23.255.255"],
    ["176.40.0.0","176.43.255.255"],
    ["176.47.0.0","176.52.255.255"],
    ["176.54.0.0","176.55.255.255"],
    ["176.58.0.0","176.58.255.255"],
    ["176.65.0.0","176.65.255.255"],
    ["176.67.0.0","176.67.255.255"],
    ["176.72.0.0","176.72.255.255"],
    ["176.81.0.0","176.81.255.255"],
    ["176.88.0.0","176.88.255.255"],
    ["176.93.0.0","176.93.255.255"],
    ["176.97.0.0","176.99.255.255"],
    ["94.56.0.0","94.59.255.255"],
    ["94.64.0.0","94.72.255.255"],
    ["94.104.0.0","94.111.255.255"],
    ["94.128.0.0","94.129.255.255"],
    ["94.134.0.0","94.135.255.255"],
    ["91.93.0.0","91.95.255.255"],
    ["91.104.0.0","91.104.255.255"],
    ["91.107.0.0","91.107.255.255"],
    ["91.109.0.0","91.111.255.255"],
    ["91.120.0.0","91.120.255.255"],
    ["91.122.0.0","91.122.255.255"],
    ["91.126.0.0","91.126.255.255"],
    ["91.132.0.0","91.133.255.255"],
    ["91.135.0.0","91.135.255.255"],
    ["91.143.0.0","91.143.255.255"],
    ["91.147.0.0","91.147.255.255"],
    ["91.149.0.0","91.149.255.255"],
    ["91.176.0.0","91.184.255.255"],
    ["91.186.0.0","91.186.255.255"],
    ["91.189.0.0","91.189.255.255"],
    ["91.191.0.0","91.193.255.255"],
    ["91.204.0.0","91.204.255.255"],
    ["91.206.0.0","91.206.255.255"],
    ["91.209.0.0","91.209.255.255"],
    ["91.225.0.0","91.225.255.255"],
    ["91.235.0.0","91.235.255.255"],
    ["91.238.0.0","91.238.255.255"],
    ["91.244.0.0","91.245.255.255"]
  ];

  // IPv6 أردني واسع (مزوّدين داخل الأردن)
  var JO_V6_WIDE = [
    "2a03:b640", // Umniah / Batelco Jordan
    "2a03:6b00", // Zain Jordan
    "2a00:18d8", // Orange Jordan
    "2a01:9700", // JDC / GO Jordan
    "2a0a:8c40"  // Mada Jordan
  ];

  // كاش DNS
  function dnsCached(h){
    if(!h) return "";
    var now = (new Date()).getTime();
    var e = CACHE.dns[h];
    if (e && (now - e.t) < DNS_TTL) return e.ip;
    var ip="";
    try{ ip = dnsResolve(h) || ""; }catch(_){ ip=""; }
    CACHE.dns[h] = { ip:ip, t:now };
    return ip;
  }

  // تحويل IPv4 لرقم
  function ip4ToInt(ip){
    var p=ip.split(".");
    return ( (parseInt(p[0])<<24)>>>0 ) +
           ( (parseInt(p[1])<<16)>>>0 ) +
           ( (parseInt(p[2])<<8)>>>0 ) +
             parseInt(p[3])>>>0;
  }

  function isJOv4(ip){
    if(!ip) return false;
    if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
    var n=ip4ToInt(ip);
    for (var i=0;i<JO_V4_RANGES.length;i++){
      var start=ip4ToInt(JO_V4_RANGES[i][0]);
      var end  =ip4ToInt(JO_V4_RANGES[i][1]);
      if(n>=start && n<=end) return true;
    }
    return false;
  }

  function expandIPv6(ip){
    if(!ip) return "";
    if(ip.indexOf(':')===-1) return ip; // IPv4
    if(ip.indexOf("::")===-1) return ip.toLowerCase();
    var parts=ip.split(":");
    var left=[], right=[], seen=false;
    for(var i=0;i<parts.length;i++){
      if(parts[i]===""){seen=true;continue;}
      if(!seen) left.push(parts[i]); else right.push(parts[i]);
    }
    var miss=8-(left.length+right.length);
    var zeros=[];
    for(var j=0;j<miss;j++) zeros.push("0");
    return (left.concat(zeros).concat(right)).join(":").toLowerCase();
  }

  function isJOv6(ip){
    if(!ip) return false;
    if(ip.indexOf(':')===-1) return false; // مش IPv6
    var full = expandIPv6(ip);
    for(var i=0;i<JO_V6_WIDE.length;i++){
      var pref = JO_V6_WIDE[i].toLowerCase().replace(/:+$/,'');
      if(full.indexOf(pref)===0) return true;
    }
    return false;
  }

  function FindProxyForURL(url, host){
    // الخطوة 1: إذا الهست مش من دومينات PUBG المعروفة -> بلوك
    if(!hostAllowedStrict(host)){
      return BLOCK;
    }

    // الخطوة 2: جيب IP السيرفر
    var dst = dnsCached(host);
    if(!dst){
      return BLOCK;
    }

    // الخطوة 3: لازم السيرفر يكون داخل الأردن:
    //  - IPv4 أردني
    //  - أو IPv6 أردني
    var allowedJO = false;
    if(/^\d+\.\d+\.\d+\.\d+$/.test(dst)){
      allowedJO = isJOv4(dst);
    } else {
      allowedJO = isJOv6(dst);
    }
    if(!allowedJO){
      return BLOCK;
    }

    // لو السيرفر فعلاً أردني -> اسمح وروّح على البروكسي الأردني
    return "PROXY " + PROXY_HOST + ":" + PROXY_PORT;
  }

  this.FindProxyForURL = FindProxyForURL;

})();
