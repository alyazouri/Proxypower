function FindProxyForURL(url, host) {

  // ==========================
  // CONFIGURATION
  // ==========================

  // Replace with your Jordan proxy IP or hostname
  var JO_PROXY = "SOCKS5 127.0.0.1"; 

  // Dedicated proxy ports per function
  var PORTS_CLASSIC   = [20001, 20002, 20003, 20004, 20005]; // Classic matches
  var PORTS_RECRUIT   = [10010, 10020, 10030, 10040, 10050]; // Recruitment / Team up
  var PORTS_SEARCH    = [12000, 12050, 12100, 12150, 12200, 12235]; // Lobby / Search

  // Sticky session (ping stability)
  var STICKY_MINUTES = 30;

  // Jordan IPv6 prefixes (Zain + Umniah)
  var JO_V6 = [
    "2a03:6b00::/29", "2a03:6b00:8000::/33", "2a03:6b00:c000::/34", // Umniah
    "2a03:b640::/32", "2a03:b640:8000::/33", "2a03:b640:c000::/34"  // Zain
  ];

  // PUBG domain categories
  var DOM_CLASSIC = ["igamecj.com", "tencentgames.com", "dlied1.qq.com", "dlied2.qq.com"];
  var DOM_RECRUIT = ["proximabeta.com", "pubgmobile.com"];
  var DOM_SEARCH  = ["qcloudcdn.com", "igamecj.com", "pubgmobile.com"];

  // ==========================
  // HELPERS
  // ==========================

  function stableHash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return Math.abs(h);
  }

  function pickStickyPort(host, ports) {
    var now = new Date();
    var bucket = Math.floor(now.getTime() / 60000 / STICKY_MINUTES);
    return ports[stableHash(host + bucket) % ports.length];
  }

  function endsWithDomain(h, list) {
    for (var i = 0; i < list.length; i++) {
      if (dnsDomainIs(h, list[i]) || shExpMatch(h, "*." + list[i])) return true;
    }
    return false;
  }

  function expandIPv6(ip) {
    if (ip.indexOf("::") < 0) return ip;
    var sides = ip.split("::");
    var left = sides[0].split(":");
    var right = sides[1].split(":");
    var missing = 8 - (left.length + right.length);
    var mid = Array(missing).fill("0");
    return left.concat(mid, right).map(function(x){return ("0000"+x).slice(-4);}).join(":");
  }

  function inRange(ip, cidr) {
    var [pref, bits] = cidr.split("/");
    var ipHex = expandIPv6(ip).replace(/:/g,"");
    var prefHex = expandIPv6(pref).replace(/:/g,"");
    var nibbles = Math.floor(bits/4);
    return ipHex.substring(0,nibbles) === prefHex.substring(0,nibbles);
  }

  function isJordan(ip) {
    if (!ip || ip.indexOf(":") < 0) return false;
    for (var i=0; i<JO_V6.length; i++) {
      if (inRange(ip, JO_V6[i])) return true;
    }
    return false;
  }

  function proxyFor(host, ports) {
    var port = pickStickyPort(host, ports);
    return JO_PROXY + ":" + port;
  }

  // ==========================
  // ROUTING LOGIC
  // ==========================

  var ip = dnsResolve(host);

  // CLASSIC MATCHES
  if (endsWithDomain(host, DOM_CLASSIC)) {
    if (ip && ip.indexOf(":")>=0 && isJordan(ip)) return "DIRECT";
    return proxyFor(host, PORTS_CLASSIC);
  }

  // RECRUITMENT
  if (endsWithDomain(host, DOM_RECRUIT)) {
    if (ip && ip.indexOf(":")>=0 && isJordan(ip)) return "DIRECT";
    return proxyFor(host, PORTS_RECRUIT);
  }

  // SEARCH
  if (endsWithDomain(host, DOM_SEARCH)) {
    if (ip && ip.indexOf(":")>=0 && isJordan(ip)) return "DIRECT";
    return proxyFor(host, PORTS_SEARCH);
  }

  return "DIRECT";
}
