// =====================
// PAC: Jordan-only Route
// =====================

// عدّل هذا للسيرفر/البروكسي الأردني تبعك
var PROXY_JO = "PROXY 46.32.99.10:8080";   // مثال: زين عمّان
// سلوك الحظر: استخدم "PROXY 0.0.0.0:0" لمنع الاتصال نهائياً، أو "DIRECT" لتجاوز البروكسي
var BLOCK_NON_JO = "PROXY 0.0.0.0:0";

// نطاقات أردنية مؤكّدة (BGP/WHOIS) — مختصرة ومفيدة للمنزل/الألعاب (يمكنك الإضافة)
var JO_RANGES = [
    ["212.35.64.0","255.255.240.0"],
    ["92.241.32.0","255.255.240.0"],
    ["46.32.96.0","255.255.240.0"],
    ["188.247.64.0","255.255.240.0"]
];

// ——— أدوات مساعدة IPv4 ———
function ip2num(ip){var a=ip.split('.');return ((+a[0])<<24)+((+a[1])<<16)+((+a[2])<<8)+(+a[3]);}
function mask2num(m){return ip2num(m);}
function inCIDR(ip, base, mask){var n=mask2num(mask);return (ip2num(ip)&n)===(ip2num(base)&n);}

// تحقق داخلي: نطاقات محلية/داخلية — دايمًا DIRECT
function isPrivateOrLocal(host, ip){
  if (isPlainHostName(host)) return true;
  if (!ip) return false;
  if (isInNet(ip, "10.0.0.0", "255.0.0.0")) return true;
  if (isInNet(ip, "172.16.0.0", "255.240.0.0")) return true;
  if (isInNet(ip, "192.168.0.0", "255.255.0.0")) return true;
  if (isInNet(ip, "127.0.0.0", "255.0.0.0")) return true;
  return false;
}

// فحص كون الوجهة أردنية
function isJordanIP(ip){
  for (var i=0;i<JO_RANGES.length;i++){
    if (inCIDR(ip, JO_RANGES[i][0], JO_RANGES[i][1])) return true;
  }
  return false;
}

// أولوية إضافية: نفس /20 تبع عنوانك العام (لتقليل البنق)
// (اختياري — يفيد الألعاب)
// ملاحظة: PAC لا يوفّر طريقة مباشرة لمعرفة /20 الحالي إلا بتقريب، نستخدم netmask /20
function sameClientSlash20(ip){
  try {
    var me = myIpAddress();
    // قناع /20
    var mask = "255.255.240.0";
    return inCIDR(ip, me, mask);
  } catch(e){ return false; }
}

// ——— الدالة الرئيسية ———
function FindProxyForURL(url, host) {
  var ip = dnsResolve(host);
  // اسم محلي/شبكات خاصة = DIRECT
  if (isPrivateOrLocal(host, ip)) return "DIRECT";
  // إن فشل الـ DNS
  if (!ip) return BLOCK_NON_JO;

  // أولوية قصوى: نفس /20 تبعك (أقرب POP) → بروكسي أردني
  if (sameClientSlash20(ip)) return PROXY_JO;

  // الوجهة ضمن نطاق أردني معروف → بروكسي أردني
  if (isJordanIP(ip)) return PROXY_JO;

  // غير أردني → محظور (أو DIRECT لو تحب التجاوز)
  return BLOCK_NON_JO;
}
