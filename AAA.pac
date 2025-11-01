/**** PAC: PUBG JO PROXY-ONLY (v5) ****/
/* سياسة مختصرة:
   - كل فئات PUBG (LOBBY/MATCH/RECRUIT/CDN/UPDATES) = PROXY أردني إلزامي فقط (لا يوجد DIRECT).
   - سلسلة فشل تلقائية عبر عدة بروكسيات أردنية (residential/CGNAT أفضل).
   - بقية المواقع = DIRECT (عشان ما يأثر على تصفحك العام).
   - لا نعتمد على أي كشف Geo/IP: مجرد إجبار مرور PUBG عبر بروكسيات داخل JO.
*/

/* ========= بروكسيات أردنية =========
   نصيحة: حط عناوين سكنية/4G/5G داخل الأردن لنتيجة أقوى. */
var PROXY_POOL = [
  {ip:"91.106.109.12", label:"Zain-JO"},
  // أضف المزيد لثبات أعلى (أوصي 3+):
  // {ip:"94.249.xx.xx", label:"Orange-JO"},
  // {ip:"109.107.xx.xx", label:"Umniah-JO"},
  // {ip:"212.35.xx.xx", label:"Batelco-JO"},
];

/* منافذ ثابتة لكل فئة (MATCH يفضل 20001) */
var FIXED_PORT = { LOBBY:443, MATCH:20001, RECRUIT_SEARCH:443, UPDATES:80, CDN:80 };

/* ========= نطاقات/أنماط PUBG ========= */
var PUBG_DOMAINS = {
  LOBBY:[
    "*.pubgmobile.com","*.pubgmobile.net","*.igamecj.com","*.proximabeta.com"
  ],
  MATCH:[
    "*.gcloud.qq.com","gpubgm.com"
  ],
  RECRUIT_SEARCH:[
    "match.igamecj.com","match.proximabeta.com",
    "teamfinder.igamecj.com","teamfinder.proximabeta.com"
  ],
  UPDATES:[
    "cdn.pubgmobile.com","updates.pubgmobile.com","patch.igamecj.com","hotfix.proximabeta.com",
    "dlied1.qq.com","dlied2.qq.com","gpubgm.com"
  ],
  CDN:[
    "cdn.igamecj.com","cdn.proximabeta.com","cdn.tencentgames.com",
    "*.qcloudcdn.com","*.cloudfront.net","*.edgesuite.net"
  ]
};

/* أنماط URLs محسّنة (احتياط) */
var URL_PATTERNS = {
  LOBBY:["*/account/login*","*/client/version*","*/status/heartbeat*","*/presence/*","*/friends/*"],
  MATCH:["*/matchmaking/*","*/mms/*","*/game/start*","*/game/join*","*/report/battle*"],
  RECRUIT_SEARCH:["*/teamfinder/*","*/clan/*","*/social/*","*/search/*","*/recruit/*"],
  UPDATES:["*/patch*","*/hotfix/*","*/update*","*/download*","*/assets/*","*/assetbundle*","*/obb*"],
  CDN:["*/cdn/*","*/static/*","*/image/*","*/media/*","*/video/*","*/res/*","*/pkg/*"]
};

/* ========= أدوات أساسية ========= */
function lc(s){return s&&s.toLowerCase?s.toLowerCase():s;}
function hostMatch(h,arr){h=lc(h||""); if(!h)return false; for(var i=0;i<arr.length;i++){var p=arr[i]; if(shExpMatch(h,p))return true; if(p.indexOf("*.")===0){var suf=p.substring(1); if(h.length>=suf.length && h.substring(h.length-suf.length)===suf) return true;}} return false;}
function urlMatch(u,arr){if(!u)return false; for(var i=0;i<arr.length;i++){ if(shExpMatch(u,arr[i])) return true; } return false;}

/* تصنيف سريع */
function getCategoryFor(url,host){
  host=lc(host||"");
  if(urlMatch(url,URL_PATTERNS.MATCH) || hostMatch(host,PUBG_DOMAINS.MATCH) || shExpMatch(url,"*/game/join*") || shExpMatch(url,"*/game/start*") || shExpMatch(url,"*/matchmaking/*") || shExpMatch(url,"*/mms/*")) return "MATCH";
  if(urlMatch(url,URL_PATTERNS.RECRUIT_SEARCH) || hostMatch(host,PUBG_DOMAINS.RECRUIT_SEARCH) || shExpMatch(url,"*/teamfinder/*") || shExpMatch(url,"*/recruit/*")) return "RECRUIT_SEARCH";
  if(urlMatch(url,URL_PATTERNS.UPDATES) || hostMatch(host,PUBG_DOMAINS.UPDATES)) return "UPDATES";
  if(urlMatch(url,URL_PATTERNS.CDN) || hostMatch(host,PUBG_DOMAINS.CDN)) return "CDN";
  if(hostMatch(host,PUBG_DOMAINS.LOBBY) || urlMatch(url,URL_PATTERNS.LOBBY)) return "LOBBY";
  return ""; // غير PUBG
}

/* توزيع ثابت بسيط للمنافذ (MATCH ثابت) */
function portFor(cat, host){
  var base = FIXED_PORT[cat] || 443;
  if(cat==="MATCH") return base;
  var h=0, s=(host||""); for(var i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i); h|=0;}
  return base + (Math.abs(h)%3); // تنويع خفيف: 0..2
}

/* سلسلة بروكسيات (Failover) للفئة */
function proxyChain(cat, host){
  if(!PROXY_POOL.length) return "PROXY 0.0.0.0:0";
  var key = (cat||"")+"|"+(host||"");
  var h=0; for(var i=0;i<key.length;i++){h=((h<<5)-h)+key.charCodeAt(i); h|=0;}
  var start = Math.abs(h) % PROXY_POOL.length;
  var port = portFor(cat||"LOBBY", host||"");
  var chain = [];
  for(var k=0;k<PROXY_POOL.length;k++){
    var idx = (start+k) % PROXY_POOL.length;
    chain.push("PROXY "+PROXY_POOL[idx].ip+":"+port);
  }
  chain.push("PROXY 0.0.0.0:0"); // لا DIRECT أبداً لفئات PUBG
  return chain.join("; ");
}

/* القرار النهائي */
function FindProxyForURL(url, host){
  var cat = getCategoryFor(url, host||"");
  if(cat){ // أي فئة PUBG
    return proxyChain(cat, host||"");
  }
  // غير PUBG: خليه مباشر
  return "DIRECT";
}
