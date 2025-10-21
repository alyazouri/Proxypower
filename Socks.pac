function FindProxyForURL(url, host) {
  const CONFIG = {
    PROXY_HOST: { type: "SOCKS5H", host: "91.106.109.12", port: 1080 },
    JO_BASE_RANGES: [
      ["92.253.35.0","92.253.35.255"],
      ["92.253.127.0","92.253.127.255"],
      ["94.249.71.0","94.249.71.255"],
      ["94.249.76.0","94.249.76.255"],
      ["86.108.103.0","86.108.103.255"],
      ["86.108.63.0","86.108.63.255"],
      ["86.108.88.0","86.108.88.255"],
      ["86.108.81.0","86.108.81.255"],
      ["213.139.42.0","213.139.42.255"],
      ["213.139.41.0","213.139.41.255"],
      ["46.185.135.0","46.185.135.255"],
      ["46.185.143.0","46.185.143.255"],
      ["46.185.192.0","46.185.192.255"]
    ],
    DNS_CACHE_TTL: 30,
    BLOCK_REPLY: "PROXY 0.0.0.0:0"
  };

  var EXCEPT = ["*.youtube.com","*.googlevideo.com","*.ytimg.com","youtu.be","*.youtubei.googleapis.com","*.yt3.ggpht.com","*.shahid.net","*.shahid.mbc.net"];

  function ipToInt(ip){ if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return -1; var p=ip.split("."); return (p[0]<<24>>>0)+(p[1]<<16)+(p[2]<<8)+(p[3]|0); }
  function sizeOfRange(r){ var s=ipToInt(r[0]),e=ipToInt(r[1]); return (s<0||e<0||e<s)?0:(e-s+1); }
  function currentJoRanges(){ var b=CONFIG.JO_BASE_RANGES,t=0,s=[]; for(var i=0;i<b.length;i++){ var z=sizeOfRange(b[i]); s.push(z); t+=z; } if(t<=0) return b.slice(); var p=Math.floor(Date.now()/1000)%t,a=0,h=0; for(var j=0;j<b.length;j++){ var n=a+s[j]; if(p<n){ h=j; break;} a=n;} var o=[]; for(var k=0;k<b.length;k++) o.push(b[(h+k)%b.length]); return o; }
  function ipInRanges(ip,rs){ var n=ipToInt(ip); if(n<0) return false; for(var i=0;i<rs.length;i++){ var s=ipToInt(rs[i][0]),e=ipToInt(rs[i][1]); if(n>=s&&n<=e) return true; } return false; }
  function ipInJordan(ip){ return ipInRanges(ip, currentJoRanges()); }

  var DNS_CACHE={};
  function dnsResolveCached(name){ try{ var now=(new Date()).getTime()/1000; var e=DNS_CACHE[name]; if(e&&(now-e.ts)<CONFIG.DNS_CACHE_TTL) return e.ip; var ip=dnsResolve(name); DNS_CACHE[name]={ip:ip,ts:now}; return ip;}catch(ex){return null;} }

  function isIpLiteral(h){ return /^\d+\.\d+\.\d+\.\d+$/.test(h); }
  function mustBeJordan(h){ var ip=isIpLiteral(h)?h:dnsResolveCached(h); return ip?ipInJordan(ip):false; }
  function proxy(){ return CONFIG.PROXY_HOST.type+" "+CONFIG.PROXY_HOST.host+":"+CONFIG.PROXY_HOST.port; }

  if (isPlainHostName(host) || host==="127.0.0.1" || host==="localhost") return "DIRECT";
  for (var i=0;i<EXCEPT.length;i++) if (shExpMatch(host,EXCEPT[i])) return "DIRECT";

  var myIP = myIpAddress();
  if (!(myIP && ipInJordan(myIP))) return CONFIG.BLOCK_REPLY;

  if (mustBeJordan(host)) return proxy();

  var dst = dnsResolveCached(host);
  if (dst && ipInJordan(dst)) return proxy();

  return CONFIG.BLOCK_REPLY;
}
