// JO-HARD-MODE PAC (النسخة النهائية) — بروكسي ثابت: 91.106.109.12
// صارم جداً: أي مسار غير أردني => PROXY 0.0.0.0:0

var PROXY_CANDIDATES = ["91.106.109.12"];

var FIXED_PORT = {
  LOBBY:            443,
  MATCH:            20001,
  RECRUIT_SEARCH:   443,
  UPDATES:          80,
  CDN:              80
};

var JO_V6_PREFIX = {
  LOBBY: ["2a01:9700::/29"],
  MATCH: ["2a03:b640::/32"],
  RECRUIT_SEARCH: ["2a03:6b00::/29"],
  UPDATES: ["2a03:6b00::/29"],
  CDN: ["2a03:6b00::/29"]
};

var JO_V4_RANGES = [
  ["5.62.128.0","5.62.255.255"],     // 5.62.128.0/17
  ["5.62.0.0","5.62.255.255"],       // 5.62.0.0/16
  ["81.22.0.0","81.22.255.255"],     // 81.22.0.0/16
  ["62.240.0.0","62.240.255.255"],   // 62.240.0.0/16
  ["213.244.0.0","213.244.255.255"], // 213.244.0.0/16
  ["95.177.0.0","95.177.255.255"],   // 95.177.0.0/16
  ["212.101.0.0","212.101.255.255"], // 212.101.0.0/16
  ["86.111.0.0","86.111.255.255"]    // 86.111.0.0/16
];

var DNS_TTL_MS = 15*1000;
var PROXY_STICKY_TTL_MS = 60*1000;
var GEO_TTL_MS = 60*60*1000;

var _root = (typeof globalThis!=="undefined"? globalThis : this);
if(!_root._PAC_HARDCACHE) _root._PAC_HARDCACHE = {};
var C = _root._PAC_HARDCACHE;
if(!C.dns) C.dns = {};
if(!C.proxyPick) C.proxyPick = {host:null, t:0, lat:99999};
if(!C.geoClient) C.geoClient = {ok:false, t:0};
if(!C.geoProxy)  C.geoProxy  = {ok:false, t:0};

var PUBG_DOMAINS = {
  LOBBY:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"],
  MATCH:["*.gcloud.qq.com","gpubgm.com"],
  RECRUIT_SEARCH:["match.igamecj.com","match.proximabeta.com","teamfinder.igamecj.com","teamfinder.proximabeta.com"],
  UPDATES:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","gpubgm.com"],
  CDN:["cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
};

var URL_PATTERNS = {
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

function lc(s){ return s && s.toLowerCase ? s.toLowerCase() : s; }

function hostMatch(h, arr){
  h = lc(h);
  if(!h) return false;
  for(var i=0;i<arr.length;i++){
    var pat = arr[i];
    if(shExpMatch(h,pat)) return true;
    if(pat.indexOf("*.")===0){
      var suf = pat.substring(1);
      if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;
    }
  }
  return false;
}

function urlMatch(u, arr){
  if(!u) return false;
  for(var i=0;i<arr.length;i++){
    if(shExpMatch(u, arr[i])) return true;
  }
  return false;
}

function dnsResolveExCached(h){
  if(!h) return {ip:"", ip6:"", t:0};
  var now = (new Date()).getTime();
  var e = C.dns[h];
  if(e && (now-e.t)<DNS_TTL_MS) return e;
  var ip="", ip6="";
  try{
    if(typeof dnsResolveEx==="function"){
      var list=dnsResolveEx(h) || [];
      for(var i=0;i<list.length;i++){
        var a=list[i];
        if(a && a.indexOf(":")!==-1){ ip6=a; } else if(a){ ip=a; }
      }
    } else {
      ip = dnsResolve(h) || "";
    }
  }catch(err){}
  var obj={ip:ip, ip6:ip6, t:now};
  C.dns[h]=obj;
  return obj;
}

function ip4ToInt(ip){
  var p = ip.split(".");
  return ( (parseInt(p[0])<<24)>>>0 ) +
         ( (parseInt(p[1])<<16)>>>0 ) +
         ( (parseInt(p[2])<<8)>>>0 ) +
         ( parseInt(p[3])>>>0 );
}
function isJOv4(ip){
  if(!ip) return false;
  if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return false;
  var n = ip4ToInt(ip);
  for(var i=0;i<JO_V4_RANGES.length;i++){
    var s = ip4ToInt(JO_V4_RANGES[i][0]);
    var e = ip4ToInt(JO_V4_RANGES[i][1]);
    if(n>=s && n<=e) return true;
  }
  return false;
}

function expand6(ip){
  if(ip.indexOf('::')===-1){
    var parts=ip.split(':');
    for(var k=0;k<parts.length;k++){ if(parts[k].length===0) parts[k]="0"; }
    while(parts.length<8) parts.push("0");
    return parts;
  }
  var left=[], right=[];
  var p=ip.split('::');
  var l = p[0].length? p[0].split(':'): [];
  var r = p.length>1 && p[1].length? p[1].split(':'): [];
  left=l; right=r;
  while(left.length+right.length<8) right.unshift("0");
  return left.concat(right);
}
function parse6(ip){
  var parts = expand6(ip.toLowerCase());
  var out=[];
  for(var i=0;i<8;i++){
    var v = parts[i].length? parseInt(parts[i],16):0;
    if(isNaN(v)) v=0;
    out.push(v & 0xffff);
  }
  return out;
}
function matchV6CIDR(ip, cidr){
  var spl=cidr.split('/');
  var pre=spl[0], bits=parseInt(spl[1],10);
  if(isNaN(bits)||bits<0||bits>128) return false;
  var a=parse6(ip);
  var b=parse6(pre);
  var full=Math.floor(bits/16), rem=bits%16;
  for(var i=0;i<full;i++){
    if(a[i]!==b[i]) return false;
  }
  if(rem===0) return true;
  var mask = 0xffff << (16-rem);
  return ( (a[full] & mask) === (b[full] & mask) );
}
function isJOv6ForCat(ip,cat){
  if(!ip || ip.indexOf(":")===-1) return false;
  var prefArr = JO_V6_PREFIX[cat]; if(!prefArr) return false;
  for(var i=0;i<prefArr.length;i++){
    if(matchV6CIDR(ip, prefArr[i])) return true;
  }
  return false;
}

function measureProxyLatency(h){
  if(/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.indexOf(':')!==-1){
    return 1;
  }
  try{
    var t0=(new Date()).getTime();
    var r=dnsResolve(h);
    var dt=(new Date()).getTime()-t0;
    if(!r) return 99999;
    return dt>0?dt:1;
  }catch(e){return 99999;}
}

function pickProxyHost(){
  var now=(new Date()).getTime();
  if(C.proxyPick.host && (now-C.proxyPick.t)<PROXY_STICKY_TTL_MS){
    return C.proxyPick.host;
  }
  var best=null, bestLat=99999;
  for(var i=0;i<PROXY_CANDIDATES.length;i++){
    var cand=PROXY_CANDIDATES[i];
    var lat=measureProxyLatency(cand);
    if(lat<bestLat){bestLat=lat;best=cand;}
  }
  if(!best) best=PROXY_CANDIDATES[0];
  C.proxyPick={host:best,t:now,lat:bestLat};
  return best;
}

function proxyFor(cat){
  var h=pickProxyHost();
  var pt=FIXED_PORT[cat]||443;
  return "PROXY "+h+":"+pt;
}

function anyMyIPs(){
  var ips=[];
  try{
    if(typeof myIpAddressEx==="function"){
      var xs=myIpAddressEx();
      if(xs && xs.length){ for(var i=0;i<xs.length;i++) ips.push(xs[i]); }
    }
  }catch(e){}
  if(!ips.length){
    try{ var v4=myIpAddress(); if(v4) ips.push(v4); }catch(e){}
  }
  return ips;
}

function clientIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoClient;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var ips=anyMyIPs();
  var ok=false;
  for(var i=0;i<ips.length;i++){
    var ip=ips[i];
    if(isJOv4(ip) || isJOv6ForCat(ip,"LOBBY") || isJOv6ForCat(ip,"MATCH")){ ok=true; break; }
  }
  C.geoClient={ok:ok,t:now};
  return ok;
}

function proxyIsJO(){
  var now=(new Date()).getTime();
  var g=C.geoProxy;
  if(g && (now-g.t)<GEO_TTL_MS) return g.ok;
  var p=pickProxyHost();
  var ok=false;
  if(/^\d+\.\d+\.\d+\.\d+$/.test(p)){
    ok = isJOv4(p);
  } else if(p.indexOf(":")!==-1){
    ok = isJOv6ForCat(p,"LOBBY") || isJOv6ForCat(p,"MATCH");
  } else {
    var rr=dnsResolveExCached(p);
    ok = isJOv4(rr.ip) || isJOv6ForCat(rr.ip6,"LOBBY") || isJOv6ForCat(rr.ip6,"MATCH");
  }
  C.geoProxy={ok:ok,t:now};
  return ok;
}

function stripV6Brackets(h){
  if(h && h.charAt(0)==="[" && h.charAt(h.length-1)==="]") return h.substring(1,h.length-1);
  return h;
}

function enforceCat(cat, host){
  host = stripV6Brackets(host);
  var ip = host;
  if(ip.indexOf(':')===-1 && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)){
    var rr=dnsResolveExCached(host);
    if(rr.ip6 && isJOv6ForCat(rr.ip6,cat)) return proxyFor(cat);
    if(rr.ip && isJOv4(rr.ip)) return proxyFor(cat);
  }
  if(isJOv6ForCat(ip,cat)) return proxyFor(cat);
  if(isJOv4(ip)) return proxyFor(cat);
  return "PROXY 0.0.0.0:0";
}

function FindProxyForURL(url, host){
  host = lc(host);
  if(!clientIsJO() || !proxyIsJO()){
    return "PROXY 0.0.0.0:0";
  }

  if( urlMatch(url,URL_PATTERNS.MATCH)    ||
      hostMatch(host,PUBG_DOMAINS.MATCH)  ||
      shExpMatch(url,"*/game/join*")      ||
      shExpMatch(url,"*/game/start*")     ||
      shExpMatch(url,"*/matchmaking/*")   ||
      shExpMatch(url,"*/mms/*")
    ){
    return enforceCat("MATCH", host);
  }

  if( urlMatch(url,URL_PATTERNS.LOBBY)            ||
      hostMatch(host,PUBG_DOMAINS.LOBBY)          ||
      urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH)   ||
      hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) ||
      shExpMatch(url,"*/status/heartbeat*")       ||
      shExpMatch(url,"*/friends/*")               ||
      shExpMatch(url,"*/teamfinder/*")            ||
      shExpMatch(url,"*/recruit/*")
    ){
    return enforceCat("LOBBY", host);
  }

  if( urlMatch(url,URL_PATTERNS.UPDATES) ||
      urlMatch(url,URL_PATTERNS.CDN)     ||
      hostMatch(host,PUBG_DOMAINS.UPDATES) ||
      hostMatch(host,PUBG_DOMAINS.CDN)
    ){
    return enforceCat("LOBBY", host);
  }

  return "PROXY 0.0.0.0:0";
}
