(function(){

var PROXY_HOST="91.106.109.12";
var PROXY_PORT=443;
var ALLOW="PROXY "+PROXY_HOST+":"+PROXY_PORT;
var DROP="PROXY 0.0.0.0:0";
var DNS_TTL_MS=15000;
var LOCK_TTL_MS=90000;

var ROOT=(typeof globalThis!=="undefined"?globalThis:this);
if(!ROOT.__JQ_TIGHT__)ROOT.__JQ_TIGHT__={};
var ST=ROOT.__JQ_TIGHT__;
if(!ST.dns)ST.dns={};
if(!ST.lock)ST.lock={isp:null,score:0,t:0};
if(!ST.localPref)ST.localPref={pref:null,t:0};

var ISP_V6={
 UMNIAH:"2a03:b640",
 ZAIN:"2a03:6b00",
 ORANGE:"2a00:18d8"
};

var JO_V4_BLOCKS=[
 ["109.104.0.0","109.107.255.255"],
 ["176.16.0.0","176.23.255.255"],
 ["94.56.0.0","94.59.255.255"],
 ["94.64.0.0","94.72.255.255"]
];

var CLASS={
 MATCH:{
  url:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  host:["*.gcloud.qq.com","gpubgm.com","match.igamecj.com","match.proximabeta.com"]
 },
 RECRUIT:{
  url:["*/teamfinder/*","*/recruit/*","*/clan/*","*/social/*","*/search/*"],
  host:["teamfinder.igamecj.com","teamfinder.proximabeta.com","match.igamecj.com","match.proximabeta.com"]
 },
 LOBBY:{
  url:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  host:["*.pubgmobile.com","*.pubgmobile.net","*.proximabeta.com","*.igamecj.com"]
 },
 UPDATES:{
  url:["*/patch*","*/hotfix*","*/update*","*/download*","*/assets*","*/assetbundle*","*/obb*","*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"],
  host:["cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com","dlied1.qq.com","dlied2.qq.com","cdn.proximabeta.com","cdn.tencentgames.com","*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"]
 }
};

function dnsCached(h){
 var now=(new Date()).getTime();
 var e=ST.dns[h];
 if(e&&(now-e.t)<DNS_TTL_MS)return e.ip;
 var ip="";
 try{ip=dnsResolve(h)||"";}catch(_){ip="";}
 ST.dns[h]={ip:ip,t:now};
 return ip;
}

function ip4ToInt(ip){
 var p=ip.split(".");
 return(((parseInt(p[0])<<24)>>>0)+((parseInt(p[1])<<16)>>>0)+((parseInt(p[2])<<8)>>>0)+(parseInt(p[3])>>>0));
}

function inJordanV4(ip){
 if(!ip)return false;
 if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip))return false;
 var n=ip4ToInt(ip);
 for(var i=0;i<JO_V4_BLOCKS.length;i++){
  var lo=ip4ToInt(JO_V4_BLOCKS[i][0]);
  var hi=ip4ToInt(JO_V4_BLOCKS[i][1]);
  if(n>=lo&&n<=hi)return true;
 }
 return false;
}

function expandV6(ip){
 if(!ip)return"";
 if(ip.indexOf(":")===-1)return ip;
 if(ip.indexOf("::")===-1)return ip.toLowerCase();
 var seg=ip.split(":"),L=[],R=[],gap=false;
 for(var i=0;i<seg.length;i++){
  if(seg[i]===""){gap=true;continue;}
  if(!gap)L.push(seg[i]);else R.push(seg[i]);
 }
 var need=8-(L.length+R.length);
 var z=[];
 for(var j=0;j<need;j++)z.push("0");
 return L.concat(z).concat(R).join(":").toLowerCase();
}

function v6StartsWith(ip,pref){
 if(!ip)return false;
 if(ip.indexOf(":")===-1)return false;
 var full=expandV6(ip);
 pref=pref.toLowerCase().replace(/:+$/,'');
 return(full.indexOf(pref)===0);
}

function getLocalTight(){
 var now=(new Date()).getTime();
 if(ST.localPref.pref&&(now-ST.localPref.t)<DNS_TTL_MS)return ST.localPref.pref;
 var me="";
 try{me=myIpAddress();}catch(_){me="";}
 if(!me||me.indexOf(":")===-1){
  ST.localPref={pref:null,t:now};
  return null;
 }
 var low=me.toLowerCase();
 if(low.indexOf("fe80:")===0||low.indexOf("fd")===0){
  ST.localPref={pref:null,t:now};
  return null;
 }
 var full=expandV6(me);
 var parts=full.split(":");
 var tight=parts.slice(0,4).join(":");
 ST.localPref={pref:tight,t:now};
 return tight;
}

function ispClass(ip){
 if(!ip)return{isp:null,score:0,tier:null};

 var tight=getLocalTight();
 if(tight&&v6StartsWith(ip,tight)){
  return{isp:"LOCALPOP",score:120,tier:"tight"};
 }

 if(ip.indexOf(":")!==-1){
  if(v6StartsWith(ip,ISP_V6.UMNIAH))return{isp:"UMNIAH",score:100,tier:"ispv6"};
  if(v6StartsWith(ip,ISP_V6.ZAIN))return{isp:"ZAIN",score:100,tier:"ispv6"};
  if(v6StartsWith(ip,ISP_V6.ORANGE))return{isp:"ORANGE",score:100,tier:"ispv6"};
  return{isp:null,score:0,tier:null};
 }

 if(/^\d+\.\d+\.\d+\.\d+$/.test(ip)){
  if(inJordanV4(ip))return{isp:"JOV4",score:60,tier:"v4jo"};
 }

 return{isp:null,score:0,tier:null};
}

function matchAny(v,arr){
 if(!v)return false;
 v=v.toLowerCase();
 for(var i=0;i<arr.length;i++){
  var p=arr[i];
  if(shExpMatch(v,p))return true;
  if(p.indexOf("*.")===0){
   var suf=p.substring(1);
   if(v.length>=suf.length&&v.substring(v.length-suf.length)===suf)return true;
  }
 }
 return false;
}

function classifyFlow(url,host){
 if(matchAny(url,CLASS.MATCH.url)||matchAny(host,CLASS.MATCH.host))return"MATCH";
 if(matchAny(url,CLASS.RECRUIT.url)||matchAny(host,CLASS.RECRUIT.host))return"RECRUIT";
 if(matchAny(url,CLASS.LOBBY.url)||matchAny(host,CLASS.LOBBY.host))return"LOBBY";
 if(matchAny(url,CLASS.UPDATES.url)||matchAny(host,CLASS.UPDATES.host))return"UPDATES";
 return null;
}

function getLock(){
 var now=(new Date()).getTime();
 var L=ST.lock;
 if(L.isp&&(now-L.t)<LOCK_TTL_MS)return L;
 return{isp:null,score:0,t:0};
}

function setLock(isp,score){
 ST.lock={isp:isp,score:score,t:(new Date()).getTime()};
}

function allowMATCH(info){
 var lock=getLock();

 if(info.score===120){
  if(lock.score===120&&lock.isp!==info.isp)return false;
  setLock(info.isp,120);
  return true;
 }

 if(info.score===100){
  if(lock.score===120)return false;
  if(lock.score===100&&lock.isp!==info.isp)return false;
  setLock(info.isp,100);
  return true;
 }

 if(info.score===60){
  if(lock.score===120||lock.score===100)return false;
  if(lock.score===60&&lock.isp!==info.isp)return false;
  setLock(info.isp,60);
  return true;
 }

 return false;
}

function allowRECRUIT(info){
 if(info.score===120)return true;
 if(info.score===100)return true;
 if(info.score===60)return true;
 return false;
}

function allowLOBBY(info){
 if(info.score===120)return true;
 if(info.score===100)return true;
 if(info.score===60)return true;
 return false;
}

function allowUPDATES(info){
 if(info.score===120)return true;
 if(info.score===100)return true;
 if(info.score===60)return true;
 return false;
}

function policy(flow,info){
 if(flow==="MATCH")return allowMATCH(info);
 if(flow==="RECRUIT")return allowRECRUIT(info);
 if(flow==="LOBBY")return allowLOBBY(info);
 if(flow==="UPDATES")return allowUPDATES(info);
 return false;
}

function FindProxyForURL(url,host){
 if(host&&host.toLowerCase)host=host.toLowerCase();
 var flow=classifyFlow(url,host);
 if(!flow)return DROP;
 var dst=dnsCached(host);
 if(!dst)return DROP;
 var info=ispClass(dst);
 if(!policy(flow,info))return DROP;
 return ALLOW;
}

this.FindProxyForURL=FindProxyForURL;

})();
