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
["185.96.70.36","255.255.255.255"]
];

var JO_IPv6_SUBNETS =
[
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
