function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  var alwaysDirect = ["apple.com", "icloud.com", "google.com", "facebook.com", "instagram.com", "whatsapp.com", "telegram.org", "netflix.com", "spotify.com"];
  var preferMeasuredBest = ["example-game-service.com", "example-latency-sensitive.com"];

  function endsWithAny(name, list) {
    for (var i = 0; i < list.length; i++) {
      if (dnsDomainIs(name, list[i]) || shExpMatch(name, "*." + list[i])) return true;
    }
    return false;
  }

  if (!host || isPlainHostName(host)) return "DIRECT";

  if (isInNet(host, "10.0.0.0", "255.0.0.0") ||
      isInNet(host, "172.16.0.0", "255.240.0.0") ||
      isInNet(host, "192.168.0.0", "255.255.0.0") ||
      isInNet(host, "127.0.0.0", "255.0.0.0")) {
    return "DIRECT";
  }

  if (endsWithAny(host, alwaysDirect)) return "DIRECT";
  if (endsWithAny(host, preferMeasuredBest)) return "DIRECT";

  return "DIRECT";
}
