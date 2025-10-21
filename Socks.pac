function FindProxyForURL(url, host) {
  var PROXY_DEFAULT = "SOCKS5 91.106.109.12:1080";
  var PROXIES_MATCH = ["SOCKS5 91.106.109.12:20001"];
  var DROP = "PROXY 0.0.0.0:0";

  if (isPlainHostName(host) || host === "localhost") return PROXY_DEFAULT;

  var h = host.toLowerCase();
  var p = extractPort(url);

  if (isPubg(h) && isMatchPort(p)) {
    var ip = dnsResolve(host);
    if (ip && isIPv6Literal(ip) && isInNet(ip, "2a01:9700::", "ffff:ffe0:0000:0000:0000:0000:0000:0000"))
      return pickProxy(PROXIES_MATCH, host, url);
    return DROP;
  }

  if (isPubg(h)) return PROXY_DEFAULT;

  return PROXY_DEFAULT;

  function isPubg(h) {
    if (dnsDomainIs(h, "pubgmobile.com") || shExpMatch(h, "*.pubgmobile.com")) return true;
    if (dnsDomainIs(h, "igamecj.com")      || shExpMatch(h, "*.igamecj.com"))      return true;
    if (dnsDomainIs(h, "proximabeta.com")  || shExpMatch(h, "*.proximabeta.com"))  return true;
    if (dnsDomainIs(h, "tencent.com")      || shExpMatch(h, "*.tencent.com"))      return true;
    if (dnsDomainIs(h, "qcloudcdn.com")    || shExpMatch(h, "*.qcloudcdn.com"))    return true;
    if (dnsDomainIs(h, "gcloudsdk.com")    || shExpMatch(h, "*.gcloudsdk.com"))    return true;
    return false;
  }

  function isMatchPort(port) {
    return port >= 20001 && port <= 20003;
  }

  function extractPort(u) {
    var m = u.match(/^[a-z]+:\/\/[^\/:]+:(\d+)/i);
    if (m && m[1]) return parseInt(m[1], 10);
    if (u.indexOf("https://") === 0) return 443;
    if (u.indexOf("http://")  === 0) return 80;
    return 443;
  }

  function isIPv6Literal(s) {
    return s.indexOf(":") !== -1 && s.indexOf("[") === -1 && s.indexOf("]") === -1;
  }

  function pickProxy(list, host, url) {
    if (!list || list.length === 0) return PROXY_DEFAULT;
    var key = host + "|" + url;
    var h = 0;
    for (var i = 0; i < key.length; i++) h = ((h << 5) - h) + key.charCodeAt(i);
    h = Math.abs(h);
    return list[h % list.length];
  }
}
