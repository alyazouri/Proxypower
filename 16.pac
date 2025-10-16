var PROXY_HOST =
"91.106.109.12";

var LOBBY_PORTS =
[443,8080,8443];

var GAME_PORTS =
[20001,20003,20002];

var GAME_WEIGHTS =
[4,2,1];

var UPDATE_PORTS =
[8443,443,8080,80];

var UPDATE_WEIGHTS =
[5,3,2,1];

var RECRUIT_PORTS =
[10010,10012,10013,10039,10096,10491,10612,11000,11455,12235,13748,13894];

var RECRUIT_WEIGHTS =
[4,3,3,2,2,2,2,2,2,2,1,1];

var FALLBACK_PORTS =
[8085,1080,5000];

var STICKY_SALT =
"JO_STICKY";

var JITTER_WINDOW =
3;

var FORBID_NON_JO_PROXY =
true;

var PUBG_DOMAINS =
[
"*.proximabeta.com",
"*.igamecj.com",
"*.tencentgames.com",
"*.tencent.com",
"*.pubgmobile.com",
"*.pubgmobile.net",
"*.gcloud.qq.com",
"*.cdn.pubgmobile.com"
];

var GAME_DOMAIN_HINTS =
[
"*.gcloud.qq.com",
"*.igamecj.com",
"*.proximabeta.com"
];

var UPDATE_DOMAINS =
[
"*.cdn.pubgmobile.com",
"*.cdn.tencent.com",
"*.download.*",
"*.patch.*",
"*.update.*",
"*.dl.*",
"*.cdn.*"
];

var RECRUIT_DOMAINS =
[
"*.social.*",
"*.friend*.*",
"*.recruit*.*",
"*.clan*.*",
"*.guild*.*",
"*.party*.*",
"*.matchmaking*.*",
"*.lobby*.*",
"*.presence*.*",
"*.voice.*",
"*.rtc.*"
];

var JO_IP_SUBNETS =
[
["2.59.52.0","255.255.252.0"],
["5.45.128.0","255.255.240.0"],
["5.198.240.0","255.255.248.0"],
["5.199.184.0","255.255.252.0"],
["37.17.192.0","255.255.240.0"],
["37.44.32.0","255.255.248.0"],
["37.75.144.0","255.255.248.0"],
["37.123.64.0","255.255.224.0"],
["37.152.0.0","255.255.248.0"],
["37.202.64.0","255.255.192.0"],
["37.220.112.0","255.255.240.0"],
["37.252.222.0","255.255.255.0"],
["45.142.196.0","255.255.252.0"],
["46.23.112.0","255.255.240.0"],
["46.32.96.0","255.255.224.0"],
["46.185.128.0","255.255.128.0"],
["46.248.192.0","255.255.224.0"],
["62.72.160.0","255.255.224.0"],
["77.245.0.0","255.255.240.0"],
["79.134.128.0","255.255.224.0"],
["79.173.192.0","255.255.192.0"],
["80.90.160.0","255.255.240.0"],
["81.21.0.0","255.255.240.0"],
["81.28.112.0","255.255.240.0"],
["82.212.64.0","255.255.192.0"],
["84.18.32.0","255.255.224.0"],
["84.18.64.0","255.255.224.0"],
["84.252.106.0","255.255.255.0"],
["85.159.216.0","255.255.248.0"],
["86.108.0.0","255.255.128.0"],
["87.236.232.0","255.255.248.0"],
["87.238.128.0","255.255.248.0"],
["89.20.49.0","255.255.255.0"],
["89.28.216.0","255.255.248.0"],
["91.106.96.0","255.255.240.0"],
["91.132.100.0","255.255.255.0"],
["91.186.224.0","255.255.224.0"],
["91.212.0.0","255.255.255.0"],
["91.223.202.0","255.255.255.0"],
["92.241.32.0","255.255.224.0"],
["92.253.0.0","255.255.128.0"],
["93.93.144.0","255.255.248.0"],
["93.95.200.0","255.255.248.0"],
["93.115.2.0","255.255.255.0"],
["93.115.3.0","255.255.255.0"],
["93.115.15.0","255.255.255.0"],
["93.191.176.0","255.255.248.0"],
["94.127.208.0","255.255.248.0"],
["94.142.32.0","255.255.224.0"],
["94.249.0.0","255.255.128.0"],
["95.141.208.0","255.255.240.0"],
["95.172.192.0","255.255.224.0"],
["109.107.224.0","255.255.224.0"],
["109.237.192.0","255.255.240.0"],
["141.0.0.0","255.255.248.0"],
["141.98.64.0","255.255.252.0"],
["141.105.56.0","255.255.248.0"],
["146.19.239.0","255.255.255.0"],
["146.19.246.0","255.255.255.0"],
["149.200.128.0","255.255.128.0"],
["176.28.128.0","255.255.128.0"],
["176.29.0.0","255.255.0.0"],
["176.57.0.0","255.255.224.0"],
["176.57.48.0","255.255.240.0"],
["176.118.39.0","255.255.255.0"],
["176.241.64.0","255.255.248.0"],
["178.20.184.0","255.255.248.0"],
["178.77.128.0","255.255.192.0"],
["178.238.176.0","255.255.240.0"],
["185.10.216.0","255.255.252.0"],
["185.12.244.0","255.255.252.0"],
["185.14.132.0","255.255.252.0"],
["185.19.112.0","255.255.252.0"],
["185.24.128.0","255.255.252.0"],
["185.30.248.0","255.255.252.0"],
["185.33.28.0","255.255.252.0"],
["185.40.19.0","255.255.255.0"],
["185.43.146.0","255.255.255.0"],
["185.51.212.0","255.255.252.0"],
["185.57.120.0","255.255.252.0"],
["185.80.24.0","255.255.252.0"],
["185.80.104.0","255.255.252.0"],
["185.98.220.0","255.255.252.0"],
["185.98.224.0","255.255.252.0"],
["185.109.120.0","255.255.252.0"],
["185.109.192.0","255.255.252.0"],
["185.135.200.0","255.255.252.0"],
["185.139.220.0","255.255.252.0"],
["185.159.180.0","255.255.252.0"],
["185.160.236.0","255.255.252.0"],
["185.163.205.0","255.255.255.0"],
["185.173.56.0","255.255.252.0"],
["185.175.248.0","255.255.252.0"],
["185.176.44.0","255.255.252.0"],
["185.180.80.0","255.255.252.0"],
["185.182.136.0","255.255.252.0"],
["185.193.176.0","255.255.252.0"],
["185.197.176.0","255.255.252.0"],
["185.200.128.0","255.255.252.0"],
["185.234.111.0","255.255.255.0"],
["185.241.62.0","255.255.255.0"],
["185.253.112.0","255.255.252.0"],
["188.123.160.0","255.255.224.0"],
["188.247.64.0","255.255.224.0"],
["193.188.64.0","255.255.224.0"],
["193.203.24.0","255.255.254.0"],
["193.203.110.0","255.255.254.0"],
["194.104.95.0","255.255.255.0"],
["194.165.128.0","255.255.224.0"],
["195.18.9.0","255.255.255.0"],
["212.34.0.0","255.255.224.0"],
["212.35.64.0","255.255.224.0"],
["212.118.0.0","255.255.224.0"],
["213.139.32.0","255.255.224.0"],
["213.186.160.0","255.255.224.0"],
["217.23.32.0","255.255.240.0"],
["217.29.240.0","255.255.240.0"],
["217.144.0.0","255.255.240.0"]
];

var JO_IPv6_SUBNETS =
[
["2001:32c0::","/29"],
["2a00:18d0::","/32"],
["2a00:18d8::","/29"],
["2a00:4620::","/32"],
["2a00:76e0::","/32"],
["2a00:b860::","/32"],
["2a00:caa0::","/32"],
["2a01:1d0::","/29"],
["2a01:9700::","/29"],
["2a01:e240::","/29"],
["2a01:ee40::","/29"],
["2a02:9c0::","/29"],
["2a02:2558::","/29"],
["2a02:25d8::","/32"],
["2a02:5b60::","/32"],
["2a02:c040::","/29"],
["2a02:e680::","/29"],
["2a02:f0c0::","/29"],
["2a03:6b00::","/29"],
["2a03:6d00::","/32"],
["2a03:b640::","/32"],
["2a04:6200::","/29"],
["2a05:74c0::","/29"],
["2a05:7500::","/29"],
["2a06:9bc0::","/29"],
["2a06:bd80::","/29"],
["2a07:140::","/29"],
["2a0a:2740::","/29"],
["2a0c:39c0::","/29"],
["2a0d:cf40::","/29"],
["2a10:1100::","/29"],
["2a10:9740::","/29"],
["2a10:d800::","/29"],
["2a11:d180::","/29"],
["2a13:1f00::","/29"],
["2a13:5c00::","/29"],
["2a13:8d40::","/29"],
["2a14:1a40::","/29"],
["2a14:2840::","/29"],
["2001:67c:2124::","/48"]
];

function _isIPv4InList(ip, list) {
  for (var i=0;i<list.length;i++) if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

function _isIPv6InList(addr, list) {
  if (!addr || addr.indexOf(":") === -1) return false;
  var a = addr.toLowerCase().replace(/::/g,":");
  var hex = a.split(":");
  var full = [];
  for (var i=0;i<8;i++) full[i] = "0000";
  var idx = 0;
  for (var j=0;j<hex.length;j++) {
    if (hex[j]==="") {
      var missing = 9 - hex.length;
      for (var k=0;k<missing;k++) full[idx++]="0000";
    } else {
      var h = ("0000"+hex[j]).slice(-4);
      full[idx++]=h;
    }
  }
  var bits = full.join("");
  for (var n=0;n<list.length;n++) {
    var pfx = list[n][0].toLowerCase();
    var plen = parseInt(list[n][1].slice(1),10);
    var ph = pfx.replace(/::/g,":").split(":");
    var pf = [];
    for (var t=0;t<8;t++) pf[t] = "0000";
    var pidx = 0;
    for (var u=0;u<ph.length;u++) {
      if (ph[u]==="") {
        var miss = 9 - ph.length;
        for (var w=0;w<miss;w++) pf[pidx++]="0000";
      } else {
        pf[pidx++]=("0000"+ph[u]).slice(-4);
      }
    }
    var pbits = pf.join("");
    var nibbles = Math.floor(plen/4);
    if (bits.slice(0,nibbles) === pbits.slice(0,nibbles)) return true;
  }
  return false;
}

function _hash(s) {
  var h = 2166136261;
  for (var i=0;i<s.length;i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
  return h >>> 0;
}

function _pickWeighted(host, list, weights, jitter) {
  var base = _hash(STICKY_SALT + "|" + host);
  var j = (base % (jitter*2+1)) - jitter;
  var bucket = (base + j + 0x7fffffff) >>> 0;
  var total = 0;
  for (var i=0;i<weights.length;i++) total += weights[i];
  var r = bucket % total;
  var acc = 0;
  for (var k=0;k<list.length;k++) { acc += weights[k]; if (r < acc) return list[k]; }
  return list[0];
}

function _pickRoundRobin(host, list, jitter) {
  var base = _hash(STICKY_SALT + "|" + host);
  var j = (base % (jitter*2+1)) - jitter;
  var idx = Math.abs((base + j)) % list.length;
  return list[idx];
}

function _anyMatch(host, globs) {
  for (var i=0;i<globs.length;i++) if (shExpMatch(host, globs[i])) return true;
  return false;
}

function _resolveOrNull(h) {
  try { return dnsResolve(h); } catch(e) { return null; }
}

function _proxyInJordan() {
  var p = PROXY_HOST;
  var ip = _resolveOrNull(p);
  if (!ip) {
    var ip4 = (/^[0-9.]+$/.test(p)) ? p : null;
    var ip6 = (/^[0-9a-f:]+$/i.test(p)) ? p : null;
    if (ip4 && _isIPv4InList(ip4, JO_IP_SUBNETS)) return true;
    if (ip6 && _isIPv6InList(ip6, JO_IPv6_SUBNETS)) return true;
    return !FORBID_NON_JO_PROXY;
  }
  if (ip.indexOf(":")>-1) return _isIPv6InList(ip, JO_IPv6_SUBNETS);
  return _isIPv4InList(ip, JO_IP_SUBNETS);
}

function _chain(port) {
  return "PROXY " + PROXY_HOST + ":" + port;
}

function _buildChain(port, fallbacks) {
  var s = _chain(port);
  for (var i=0;i<fallbacks.length;i++) s += "; " + _chain(fallbacks[i]);
  return s;
}

function _selectPortByCategory(host) {
  if (_anyMatch(host, UPDATE_DOMAINS))
    return _pickWeighted(host, UPDATE_PORTS, UPDATE_WEIGHTS, JITTER_WINDOW);
  if (_anyMatch(host, RECRUIT_DOMAINS))
    return _pickWeighted(host, RECRUIT_PORTS, RECRUIT_WEIGHTS, JITTER_WINDOW);
  if (_anyMatch(host, GAME_DOMAIN_HINTS))
    return _pickWeighted(host, GAME_PORTS, GAME_WEIGHTS, JITTER_WINDOW);
  return _pickRoundRobin(host, LOBBY_PORTS, JITTER_WINDOW);
}

function _fallbackSetFor(host) {
  if (_anyMatch(host, UPDATE_DOMAINS)) return [443,8080,8443];
  if (_anyMatch(host, RECRUIT_DOMAINS)) return [443,8080,8443];
  if (_anyMatch(host, GAME_DOMAIN_HINTS)) return LOBBY_PORTS;
  return FALLBACK_PORTS;
}

function FindProxyForURL(url, host) {
  if (FORBID_NON_JO_PROXY && !_proxyInJordan()) return "DIRECT";
  var port = _selectPortByCategory(host);
  var fb = _fallbackSetFor(host);
  var chain = _buildChain(port, fb);
  if (_anyMatch(host, PUBG_DOMAINS)) return chain;
  var ip = _resolveOrNull(host);
  if (ip && _isIPv4InList(ip, JO_IP_SUBNETS)) return chain;
  return chain;
}
