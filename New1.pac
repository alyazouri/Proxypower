// ================= PROXIES =================

var MATCH_JO = "PROXY 178.238.184.2:20005";   // بروكسي الماتش (بورت مخصص)

var LOBBY_POOL = [
  "PROXY 213.186.160.242:443",
  "PROXY 46.185.139.47:443",
  "PROXY 178.238.184.2:20005"
];

var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= JORDAN MATCH (STRONG) =================

var JORDAN_MATCH_IPV4 = [
  ["2.17.24.0", "255.255.252.0"],
  ["37.44.32.0", "255.255.248.0"],
  ["37.152.0.0", "255.255.248.0"],
  ["37.220.112.0", "255.255.240.0"],
  ["46.23.112.0", "255.255.240.0"],
  ["46.32.96.0", "255.255.224.0"],
  ["46.248.192.0", "255.255.224.0"],
  ["46.185.128.0", "255.255.128.0"],   // merged fully
  ["77.245.0.0", "255.255.240.0"],
  ["79.173.192.0", "255.255.192.0"],   // merged fully
  ["80.90.160.0", "255.255.240.0"],
  ["85.159.216.0", "255.255.248.0"],
  ["86.108.0.0", "255.255.128.0"],     // merged fully
  ["87.238.128.0", "255.255.248.0"],
  ["91.106.96.0", "255.255.248.0"],
  ["91.186.224.0", "255.255.224.0"],
  ["92.241.32.0", "255.255.224.0"],
  ["92.253.0.0", "255.255.128.0"],
  ["94.127.208.0", "255.255.248.0"],
  ["94.142.32.0", "255.255.224.0"],
  ["94.249.0.0", "255.255.128.0"],
  ["95.172.192.0", "255.255.192.0"],
  ["109.107.224.0", "255.255.224.0"],
  ["141.105.56.0", "255.255.248.0"],
  ["176.28.128.0", "255.255.128.0"],
  ["176.29.0.0", "255.255.0.0"],
  ["178.238.176.0", "255.255.248.0"],
  ["185.12.244.0", "255.255.252.0"],
  ["185.14.132.0", "255.255.252.0"],
  ["185.19.112.0", "255.255.252.0"],
  ["185.80.24.0", "255.255.252.0"],
  ["185.109.192.0", "255.255.252.0"],
  ["188.247.64.0", "255.255.224.0"],
  ["212.34.0.0", "255.255.224.0"],
  ["212.35.64.0", "255.255.224.0"],
  ["212.118.0.0", "255.255.224.0"],
  ["213.139.32.0", "255.255.224.0"]
];

// ================= JORDAN WIDE (LOBBY) =================

var JORDAN_WIDE_IPV4 = [
  ["2.17.24.0", "255.255.252.0"],
  ["37.44.32.0", "255.255.248.0"],
  ["37.152.0.0", "255.255.248.0"],
  ["37.220.112.0", "255.255.240.0"],
  ["46.23.112.0", "255.255.240.0"],
  ["46.32.96.0", "255.255.224.0"],
  ["46.248.192.0", "255.255.224.0"],
  ["46.185.128.0", "255.255.128.0"],   // merged fully
  ["77.245.0.0", "255.255.240.0"],
  ["79.173.192.0", "255.255.192.0"],   // merged fully
  ["80.90.160.0", "255.255.240.0"],
  ["85.159.216.0", "255.255.248.0"],
  ["86.108.0.0", "255.255.128.0"],     // merged fully
  ["87.238.128.0", "255.255.248.0"],
  ["91.106.96.0", "255.255.248.0"],
  ["91.186.224.0", "255.255.224.0"],
  ["92.241.32.0", "255.255.224.0"],
  ["92.253.0.0", "255.255.128.0"],
  ["94.127.208.0", "255.255.248.0"],
  ["94.142.32.0", "255.255.224.0"],
  ["94.249.0.0", "255.255.128.0"],
  ["95.172.192.0", "255.255.192.0"],
  ["109.107.224.0", "255.255.224.0"],
  ["141.105.56.0", "255.255.248.0"],
  ["176.28.128.0", "255.255.128.0"],
  ["176.29.0.0", "255.255.0.0"],
  ["178.238.176.0", "255.255.248.0"],
  ["185.12.244.0", "255.255.252.0"],
  ["185.14.132.0", "255.255.252.0"],
  ["185.19.112.0", "255.255.252.0"],
  ["185.80.24.0", "255.255.252.0"],
  ["185.109.192.0", "255.255.252.0"],
  ["188.247.64.0", "255.255.224.0"],
  ["212.34.0.0", "255.255.224.0"],
  ["212.35.64.0", "255.255.224.0"],
  ["212.118.0.0", "255.255.224.0"],
  ["213.139.32.0", "255.255.224.0"]
];

// ================= BLACKLIST: EU + RUSSIA + ASIA =================

var GEO_BLACKLIST = [
  // Europe (wide)
  ["51.0.0.0","255.0.0.0"],
  // Russia
  ["31.128.0.0","255.192.0.0"],
  ["95.24.0.0","255.248.0.0"],
  ["178.64.0.0","255.192.0.0"],
  // Asia (far & wide)
  ["1.0.0.0","255.0.0.0"],
  ["14.0.0.0","255.0.0.0"],
  ["27.0.0.0","255.0.0.0"],
  ["36.0.0.0","255.0.0.0"],
  ["39.0.0.0","255.0.0.0"],
  ["42.0.0.0","255.0.0.0"],
  ["49.0.0.0","255.0.0.0"],
  ["58.0.0.0","255.0.0.0"],
  ["59.0.0.0","255.0.0.0"],
  ["187.0.0.0","255.0.0.0"],
  ["200.0.0.0","255.0.0.0"],
  ["60.0.0.0","255.0.0.0"]
];

// ================= SESSION =================

var SESSION = {
  matchNet: null,
  matchHost: null,
  dnsCache: {}
};

// ================= HELPERS =================

function norm(h){ var i=h.indexOf(":"); return i>-1?h.substring(0,i):h; }

function isInList(ip, list){
  for (var i=0;i<list.length;i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

function resolvePinned(host){
  if (SESSION.dnsCache[host]) return SESSION.dnsCache[host];
  var ip = dnsResolve(host);
  if (ip) SESSION.dnsCache[host] = ip;
  return ip;
}

function pickLobbyProxy(host){
  var h=0;
  for (var i=0;i<host.length;i++)
    h=(h+host.charCodeAt(i))%LOBBY_POOL.length;
  return LOBBY_POOL[h];
}

// ================= DETECTION =================

function isPUBG(h){
  return /pubg|pubgm|tencent|krafton|lightspeed|levelinfinite/i.test(h);
}

function isMatch(u,h){
  return /match|battle|game|combat|realtime|sync|udp|tick|room/i.test(u+h);
}

function isLobby(u,h){
  return /lobby|matchmaking|queue|dispatch|gateway|region|join|recruit/i.test(u+h);
}

function isSocial(u,h){
  return /friend|invite|squad|team|party|clan|presence|social/i.test(u+h);
}

function isCDN(u,h){
  return /cdn|asset|resource|patch|update|media|content/i.test(u+h);
}

// ================= MAIN =================

function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());

  if (!isPUBG(host)) return DIRECT;

  var ip = resolvePinned(host);

  if (!ip || ip.indexOf(":")>-1) return BLOCK;

  // HARD GEO BLOCK
  if (isInList(ip, GEO_BLACKLIST)) return BLOCK;

  // MATCH (STRONG ONLY)
  if (isMatch(url, host)) {

    if (!isInList(ip, JORDAN_MATCH_IPV4)) return BLOCK;

    var net24 = ip.split('.').slice(0,3).join('.');

    if (!SESSION.matchNet) {
      SESSION.matchNet = net24;
      SESSION.matchHost = host;
      return MATCH_JO;
    }

    if (host !== SESSION.matchHost) return BLOCK;
    if (net24 !== SESSION.matchNet) return BLOCK;

    return MATCH_JO;
  }

  // LOBBY / SOCIAL / CDN
  if (isLobby(url, host) || isSocial(url, host) || isCDN(url, host)) {
    if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
    return pickLobbyProxy(host);
  }

  return pickLobbyProxy(host);
}
