// ===========================================
// 🟢 PUBG Mobile Jordan-only PAC Script v4.0
// كل وظيفة داخل اللعبة لها دومينات وبورتات منفصلة
// ===========================================

// --- 🧭 بروكسيات أردنية حسب المزود (مرتبة بالأولوية) ---
var JO_PROXIES = {
  ORANGE:  ["PROXY 91.106.109.12:443", "PROXY 94.249.0.12:443"],
  ZAIN:    ["PROXY 89.187.57.10:443", "PROXY 89.187.57.12:443"],
  UMNIAH:  ["PROXY 109.107.225.10:443", "PROXY 109.107.225.11:443"],
  GO:      ["PROXY 37.17.200.10:443", "PROXY 37.17.200.12:443"]
};

// --- 🌍 نطاقات IPv4/IPv6 أردنية ---
var JO_RANGES = {
  ORANGE: ["91.106.0.0/16","94.249.0.0/16","196.52.0.0/16","212.34.0.0/19"],
  ZAIN:   ["89.187.0.0/16","37.17.192.0/20","213.139.32.0/19"],
  UMNIAH: ["109.107.224.0/19","46.185.128.0/18"],
  GO:     ["5.45.128.0/20","41.222.0.0/16"]
};
var JO_V6_PREFIXES = ["2a00:18d8::/29","2a03:6b00::/29","2a03:b640::/32"];

// ================================
// 🧩 تقسيم الوظائف داخل اللعبة
// ================================

// 🎯 1. LOBBY / LOGIN / TOKEN AUTH
var LOBBY = {
  DOMAINS: [
    "lobby.igamecj.com", "lite-ios.igamecj.com", "mgl.lobby.igamecj.com",
    "mtw.lobby.igamecj.com", "mkn.lobby.igamecj.com",
    "account.pubgmobile.com", "auth.igamecj.com"
  ],
  PORTS: [443,8443]
};

// ⚔️ 2. MATCH / GAMEPLAY (UDP-heavy)
var MATCH = {
  DOMAINS: [
    "match.igamecj.com","mkr.lobby.igamecj.com","mvn.lobby.igamecj.com",
    "msl.match.igamecj.com","mgw.match.igamecj.com"
  ],
  PORTS: [20001,20002,20003,20004,20005]
};

// 🕹️ 3. RECRUIT / TEAM / SEARCH
var RECRUIT = {
  DOMAINS: [
    "recruit-search.igamecj.com","search.igamecj.com","team.igamecj.com"
  ],
  PORTS: [10010,10011,10012,10013]
};

// 📦 4. UPDATES / PATCHES / RESOURCES
var UPDATES = {
  DOMAINS: [
    "update.igamecj.com","updates.pubg.com","filegcp.igamecj.com","patch.igamecj.com"
  ],
  PORTS: [80,443,8443]
};

// 🌐 5. CDN / DOWNLOAD / ASSETS
var CDN = {
  DOMAINS: [
    "cdn.pubg.com","cdn.igamecj.com","gcpcdntest.igamecj.com","appdl.pubg.com",
    "cdn.tensafe.com"
  ],
  PORTS: [80,443]
};

// 🧑‍🤝‍🧑 6. FRIENDS / CHAT / SOCIAL
var FRIENDS = {
  DOMAINS: [
    "friend.igamecj.com","chat.igamecj.com","msg.igamecj.com"
  ],
  PORTS: [443,8080,8443]
};

// 📊 7. TELEMETRY / ANALYTICS / ANTI-CHEAT
var ANALYTICS = {
  DOMAINS: [
    "log.igamecj.com","metric.igamecj.com","tss.pubgmobile.com",
    "anti-cheat.pubgmobile.com","report.pubgmobile.com"
  ],
  PORTS: [443,8443]
};

// ==========================================
// 🧠 دوال المساعدة
// ==========================================
function ipv4ToInt(ip){var p=ip.split('.');return((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3])>>>0;}
function isIpv4InCidr(ip,cidr){var parts=cidr.split('/');var base=ipv4ToInt(parts[0]);var bits=parseInt(parts[1],10);var mask=bits===0?0:(~((1<<(32-bits))-1))>>>0;var num=ipv4ToInt(ip);return((num&mask)>>>0)===((base&mask)>>>0);}
function whichISP(ip){
  if(!ip || ip.indexOf(":")!==-1)return null;
  for(var isp in JO_RANGES){var arr=JO_RANGES[isp];
    for(var i=0;i<arr.length;i++){if(isIpv4InCidr(ip,arr[i]))return isp;}
  }return null;
}
function pickProxy(isp){
  if(!isp) isp="ORANGE";
  var list=JO_PROXIES[isp];
  return list[Math.floor(Math.random()*list.length)];
}
function isInList(host,list){
  for(var i=0;i<list.length;i++){if(shExpMatch(host,"*"+list[i]+"*"))return true;}
  return false;
}
function extractPort(url){var m=url.match(/:(\d+)(\/|$)/);return m?parseInt(m[1]):80;}

// ==========================================
// 🕹️ الدالة الرئيسية
// ==========================================
function FindProxyForURL(url, host){
  var ip = dnsResolve(host);
  var port = extractPort(url);
  var isp = whichISP(ip);

  // 1. MATCH — أردني فقط
  if(isInList(host, MATCH.DOMAINS) && MATCH.PORTS.indexOf(port)!==-1){
    if(isp) return pickProxy(isp);
    return "PROXY 127.0.0.1:9"; // block non-JO
  }

  // 2. RECRUIT — أردني فقط
  if(isInList(host, RECRUIT.DOMAINS) && RECRUIT.PORTS.indexOf(port)!==-1){
    if(isp) return pickProxy(isp);
    return "PROXY 127.0.0.1:9";
  }

  // 3. LOBBY / LOGIN
  if(isInList(host, LOBBY.DOMAINS) && LOBBY.PORTS.indexOf(port)!==-1){
    return pickProxy(isp || "ORANGE");
  }

  // 4. UPDATES
  if(isInList(host, UPDATES.DOMAINS)){
    return pickProxy(isp || "ORANGE");
  }

  // 5. CDN
  if(isInList(host, CDN.DOMAINS)){
    return pickProxy(isp || "ORANGE");
  }

  // 6. FRIENDS / CHAT
  if(isInList(host, FRIENDS.DOMAINS)){
    return pickProxy(isp || "ZAIN"); // غالبًا chat يستخدم بنى zain/umniah
  }

  // 7. ANALYTICS / ANTI-CHEAT
  if(isInList(host, ANALYTICS.DOMAINS)){
    return pickProxy(isp || "UMNIAH");
  }

  // 8. نطاق أردني غير PUBG
  if(isp){
    return pickProxy(isp);
  }

  // 9. أي شيء غير معروف — يبقى أردني (ORANGE افتراضي)
  return pickProxy("ORANGE");
}
