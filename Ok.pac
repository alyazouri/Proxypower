function FindProxyForURL(url, host) {
  var P="PROXY 91.106.109.12:5000";
  if (isPlainHostName(host)||host==="127.0.0.1"||host==="localhost") return P;
  var ip = host;
  if (!(shExpMatch(host,"*:*")||shExpMatch(host,"*.*.*.*"))) {
    try { ip = dnsResolve(host); } catch(e) { ip=""; }
  }
  if (ip && shExpMatch(ip,"*:*")) {
    if (isInNetEx(ip,"2a03:b640:4000::","34")) return P;
    if (isInNetEx(ip,"2a03:b640:8000::","34")) return P;
    if (isInNetEx(ip,"2a03:b640:c000::","34")) return P;
  }
  return "PROXY 91.106.109.12:1080";
}
