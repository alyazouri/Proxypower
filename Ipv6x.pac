// jo_pubg_autoping_dynamic.pac
var PROXY = "PROXY 91.106.109.12:1080";
var FORCE_JO_PROXY = false;

var PUBG_DOMAINS = [
  "*.proximabeta.com",
  "*.igamecj.com",
  "*.tencentgames.com",
  "*.tencent.com",
  "*.pubgmobile.com",
  "*.pubgmobile.net",
  "*.gcloud.qq.com",
  "*.cdn.pubgmobile.com",
  "*.dl.pubgmobile.com",
  "*.app.pubgmobile.com",
  "*.unity3d.com",
  "*.akamaized.net"
];

// استثناء YouTube + Shahid
var EXCLUDE_DOMAINS = [
  "*.youtube.com",
  "*.googlevideo.com",
  "*.ytimg.com",
  "*.shahid.net",
  "*.mbc.net"
];

var MATCH_PORTS   = {20001:true,20002:true,20003:true};
var RECRUIT_PORTS = {10010:true,11000:true};


var JO_V6_RANGES = [
  ["fdd8:a491:44ac:0000:0000:0000:0000:0000","fdd8:a491:44ac:ffff:ffff:ffff:ffff:ffff"]
];
// ===== Helpers =====
function pad4(h){h=h||"0";return("0000"+h).slice(-4).toLowerCase();}
function expandIPv6ToHex(ip){
  if(!ip)return null;
  if(ip[0]=="["&&ip[ip.length-1]=="]")ip=ip.slice(1,-1);
  if(ip.indexOf(":")==-1)return null;
  var v4=ip.lastIndexOf(".");
  var tail=[];
  if(v4>0){
    var m=ip.slice(ip.lastIndexOf(":")+1).split(".");
    if(m.length==4){
      var hi=((parseInt(m[0],10)<<8)|parseInt(m[1],10)).toString(16);
      var lo=((parseInt(m[2],10)<<8)|parseInt(m[3],10)).toString(16);
      tail=[pad4(hi),pad4(lo)];
      ip=ip.slice(0,ip.lastIndexOf(":"));
    }
  }
  var parts=ip.split("::");
  var left=parts[0]?parts[0].split(":"):[];
  var right=(parts.length>1&&parts[1])?parts[1].split(":"):[];
  var miss=8-(left.length+right.length+tail.length);
  if(miss<0)return null;
  var mid=[];for(var i=0;i<miss;i++)mid.push("0");
  var full=left.concat(mid).concat(right).map(pad4).concat(tail);
  if(full.length!=8)return null;
  return full.join("");
}
function ipv6HexInRange(hex,from,to){return(hex>=from&&hex<=to);}
function resolveToIPv6(host){
  if(host.indexOf(":")!==-1)return host;
  try{var r=dnsResolve(host);if(r&&r.indexOf(":")!==-1)return r;}catch(e){}
  return null;
}
function isDomainMatch(host,pattern){
  var h=host.toLowerCase(),p=pattern.toLowerCase();
  if(p.indexOf("*.")==0){var base=p.slice(2);return(h===base||h.endsWith("."+base));}
  return h===p;
}
function isPUBGDomain(host){
  for(var i=0;i<PUBG_DOMAINS.length;i++)
    if(isDomainMatch(host,PUBG_DOMAINS[i]))return true;
  return false;
}
function isExcludedDomain(host){
  for(var i=0;i<EXCLUDE_DOMAINS.length;i++)
    if(isDomainMatch(host,EXCLUDE_DOMAINS[i]))return true;
  return false;
}
function extractPort(u){
  var m=u.match(/^[a-z0-9+.-]+:\/\/\[[^\]]+\]:(\d+)(?:\/|$)/i);
  if(m&&m[1])return parseInt(m[1],10);
  m=u.match(/^[a-z0-9+.-]+:\/\/[^\/]*:(\d+)(?:\/|$)/i);
  if(m&&m[1])return parseInt(m[1],10);
  if(u.indexOf("https:")==0)return 443;
  if(u.indexOf("http:")==0)return 80;
  return -1;
}

// ===== Auto-Ping =====
var PING_CACHE={value:"PROXY",ms:0,ts:0};
var PING_TARGET="91.106.109.12";
var PING_CACHE_TTL_MS=60000;
var THRESH_FAST=30,THRESH_SLOW=60;
function nowMs(){return(new Date()).getTime();}
function measureProxyLatencyMs(){var t1=nowMs();try{dnsResolve(PING_TARGET);}catch(e){}var t2=nowMs();return Math.max(0,t2-t1);}
function decideRouteByLatency(){
  var t=nowMs();
  if(t-PING_CACHE.ts<PING_CACHE_TTL_MS&&PING_CACHE.ms>0)return PING_CACHE.value;
  var ms=measureProxyLatencyMs(),val=PING_CACHE.value;
  if(val==="PROXY"){if(ms>THRESH_SLOW)val="DIRECT";}
  else{if(ms<THRESH_FAST)val="PROXY";}
  PING_CACHE={value:val,ms:ms,ts:t};
  return val;
}

// ===== Main =====
function FindProxyForURL(url,host){
  if(isPlainHostName(host)||host==="localhost")return"DIRECT";

  // ✅ استثناء YouTube + Shahid دائمًا DIRECT
  if(isExcludedDomain(host))return"DIRECT";

  var port=extractPort(url);
  if(MATCH_PORTS[port]||RECRUIT_PORTS[port])return PROXY;

  if(isPUBGDomain(host)){
    var dyn=decideRouteByLatency();
    return(dyn==="PROXY")?PROXY:"DIRECT";
  }

  var v6=resolveToIPv6(host);
  if(v6){
    var hex=expandIPv6ToHex(v6);
    if(hex){
      for(var i=0;i<JO_V6_RANGES.length;i++){
        var from=JO_V6_RANGES[i][0].replace(/:/g,"").toLowerCase();
        var to  =JO_V6_RANGES[i][1].replace(/:/g,"").toLowerCase();
        if(ipv6HexInRange(hex,from,to))
          return FORCE_JO_PROXY?PROXY:"DIRECT";
      }
    }
  }

  var defDyn=decideRouteByLatency();
  return(defDyn==="PROXY")?PROXY:"DIRECT";
}
