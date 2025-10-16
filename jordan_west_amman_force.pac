function FindProxyForURL(url, host) {

  var DIRECT = "DIRECT";
  var PROXIES = "PROXY 91.106.109.12:20001; PROXY 91.106.109.12:443; DIRECT";

  var WEST_AMMAN_24 = [
    ["176.28.179.0","255.255.255.0"],
    ["176.28.184.0","255.255.255.0"],
    ["176.28.221.0","255.255.255.0"],
    ["176.28.252.0","255.255.255.0"]
  ];

  var PARENT_JO = ["176.28.128.0","255.255.128.0"];

  if (isPlainHostName(host)) return DIRECT;
  if (shExpMatch(host, "localhost")) return DIRECT;
  if (shExpMatch(host, "*.google.com") || shExpMatch(host, "google.com")) return DIRECT;
  if (shExpMatch(host, "*.youtube.com") || shExpMatch(host, "youtube.com")) return DIRECT;

  for (var i = 0; i < WEST_AMMAN_24.length; i++) {
    try {
      if (isInNet(host, WEST_AMMAN_24[i][0], WEST_AMMAN_24[i][1])) return PROXIES;
    } catch(e){}
  }

  try {
    if (isInNet(host, PARENT_JO[0], PARENT_JO[1])) return PROXIES;
  } catch(e){}

  return DIRECT;
}