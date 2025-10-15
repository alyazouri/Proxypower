function FindProxyForURL(url, host) {

  var PROXIES = [
    { ip: "91.106.109.12", ports: [20001,443,8080], weight: 5 },
    { ip: "176.28.250.122", ports: [8080,443], weight: 3 },
    { ip: "79.173.251.142", ports: [8000,443], weight: 2 }
  ];

  var JO_IP_SUBNETS = [
    ["2.17.24.0","255.255.252.0"],
    ["37.202.64.0","255.255.192.0"],
    ["37.220.112.0","255.255.240.0"],
    ["46.185.128.0","255.255.128.0"],
    ["46.248.192.0","255.255.224.0"],
    ["46.32.96.0","255.255.224.0"],
    ["62.72.160.0","255.255.224.0"],
    ["79.173.192.0","255.255.192.0"],
    ["84.18.32.0","255.255.224.0"],
    ["86.108.0.0","255.255.128.0"],
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
    "match.*",
    "realtime.*"
  ];

  function isJordan(ip){
    if(!ip) return false;
    for(var i=0;i<JO_IP_SUBNETS.length;i++){
      if(isInNet(ip,JO_IP_SUBNETS[i][0],JO_IP_SUBNETS[i][1])) return true;
    }
    return false;
  }

  function cacheDNS(name){
    if(typeof __DNS==="undefined") __DNS={};
    var e=__DNS[name];
    var now=(new Date()).getTime();
    if(e && (now-e.t<60000)) return e.ip;
    var ip=dnsResolve(name);
    __DNS[name]={ip:ip,t:now};
    return ip;
  }

  function matchList(h,arr){
    for(var i=0;i<arr.length;i++){
      if(shExpMatch(h,arr[i])) return true;
    }
    return false;
  }

  function sleep(ms){
    var start=(new Date()).getTime();
    while((new Date()).getTime()-start<ms){}
  }

  function chooseProxy(){
    return PROXIES[0];
  }

  function autoReconnect(ip){
    var tries=0;
    while(!isJordan(ip) && tries<20){
      sleep(3000);
      ip=dnsResolve(host);
      tries++;
    }
    return isJordan(ip);
  }

  var h=(host||"").toLowerCase();
  var resolved=cacheDNS(h);
  var isJO=resolved && isJordan(resolved);
  var isGame=matchList(h,GAME_DOMAINS)||h.indexOf("pubg")!=-1;

  if(shExpMatch(h,"*.youtube.com")||shExpMatch(h,"*.googlevideo.com")||shExpMatch(h,"youtu.be*")) return "DIRECT";
  if(isJO) return "DIRECT";

  if(isGame){
    var p=chooseProxy();
    var ok=autoReconnect(resolved);
    if(ok) return "SOCKS5 "+p.ip+":20001";
    return "SOCKS5 "+p.ip+":20001";
  }

  return "DIRECT";
}
