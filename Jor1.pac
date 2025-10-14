function FindProxyForURL(url, host) {

var FORCE_PROXY = true
var FORBID_DIRECT_GLOBAL = true
var JO_ROUTE_ONLY = true
var GEO_ENFORCE_JO = true

var BLOCK_IR_TLDS = [".ir"]

var PROXY_POOL = [
{host:"91.106.109.12",region:"JO",socks:[20001,20002,20003,20004],http:[443,8080,8085,8443]},
{host:"91.106.109.11",region:"JO",socks:[20001,20002,20003,20004],http:[443,8080,8085,8443]},
{id:"JO_ULTRA_EDGE_02",region:"SA",ip:"91.106.109.12",port:1080,location:"Riyadh Backup",ping_guarantee:0.5,performance_score:0.85,optimization_techniques:["MULTI_PATH_OPTIMIZATION","EDGE_CACHING"]}
]

var DEFAULT_FALLBACK = "DIRECT"
var DNS_CACHE_TTL_MS = 30000
var JITTER_WINDOW_BASE_MS = 15000
var PING_TIMEOUT_MS = 160
var STICKY_TTL_MS = 120000

var WEIGHT_BASE = {20001:5,20002:4,20003:4,20004:4,443:5,8080:4,8085:3,8443:3}
var PREFER_JO_HOSTS = ["jo","jord","amman","zarqa","irbid","aqaba","jarash","maan","ajloun","madaba"]
var JO_LATENCY_ANCHORS = ["dns.google","orange.jo","umniah.com","zain.com","jordan.gov.jo"]

if (typeof globalThis === "undefined") { var globalThis = this }
if (!globalThis.__PAC_STATE__) { globalThis.__PAC_STATE__ = { DNS:{}, STICKY:{}, POOL_HEALTH:{}, WEIGHTS:{}, JO_POOL:[] } }
var STATE = globalThis.__PAC_STATE__
for (var k in WEIGHT_BASE) if (!STATE.WEIGHTS[k]) STATE.WEIGHTS[k] = WEIGHT_BASE[k]

var JO_IP_RANGES = [
{ip:"86.108.0.0",mask:"255.255.128.0"},
{ip:"176.29.0.0",mask:"255.255.0.0"},
{ip:"37.252.222.0",mask:"255.255.255.0"},
{ip:"91.223.202.0",mask:"255.255.255.0"},
{ip:"146.19.239.0",mask:"255.255.255.0"},
{ip:"146.19.246.0",mask:"255.255.255.0"},
{ip:"176.118.39.0",mask:"255.255.255.0"},
{ip:"185.40.19.0",mask:"255.255.255.0"},
{ip:"185.43.146.0",mask:"255.255.255.0"},
{ip:"185.163.205.0",mask:"255.255.255.0"},
{ip:"185.234.111.0",mask:"255.255.255.0"},
{ip:"185.241.62.0",mask:"255.255.255.0"},
{ip:"194.104.95.0",mask:"255.255.255.0"},
{ip:"195.18.9.0",mask:"255.255.255.0"},
{ip:"84.252.106.0",mask:"255.255.255.0"},
{ip:"91.212.0.0",mask:"255.255.255.0"},
{ip:"5.45.128.0",mask:"255.255.240.0"},
{ip:"46.185.128.0",mask:"255.255.128.0"},
{ip:"193.188.64.0",mask:"255.255.224.0"},
{ip:"194.165.128.0",mask:"255.255.224.0"},
{ip:"212.34.0.0",mask:"255.255.224.0"},
{ip:"212.118.0.0",mask:"255.255.224.0"},
{ip:"213.139.32.0",mask:"255.255.224.0"},
{ip:"80.90.160.0",mask:"255.255.240.0"},
{ip:"92.253.0.0",mask:"255.255.128.0"},
{ip:"185.98.220.0",mask:"255.255.255.0"},
{ip:"46.32.96.0",mask:"255.255.224.0"},
{ip:"77.245.0.0",mask:"255.255.240.0"},
{ip:"87.238.128.0",mask:"255.255.248.0"},
{ip:"94.142.32.0",mask:"255.255.224.0"},
{ip:"176.28.128.0",mask:"255.255.128.0"},
{ip:"185.109.192.0",mask:"255.255.252.0"},
{ip:"37.44.32.0",mask:"255.255.248.0"},
{ip:"37.152.0.0",mask:"255.255.248.0"},
{ip:"37.220.112.0",mask:"255.255.240.0"},
{ip:"37.220.120.0",mask:"255.255.248.0"},
{ip:"46.23.112.0",mask:"255.255.240.0"},
{ip:"46.248.192.0",mask:"255.255.224.0"},
{ip:"85.159.216.0",mask:"255.255.248.0"},
{ip:"91.106.96.0",mask:"255.255.248.0"},
{ip:"91.106.104.0",mask:"255.255.248.0"},
{ip:"91.186.224.0",mask:"255.255.240.0"},
{ip:"212.35.64.0",mask:"255.255.240.0"},
{ip:"212.35.80.0",mask:"255.255.240.0"},
{ip:"212.118.16.0",mask:"255.255.240.0"}
]

function dnsCachedResolve(h) {
var now = Date.now()
var e = STATE.DNS[h]
if (e && (now - e.ts) < DNS_CACHE_TTL_MS && e.ip) return e.ip
var ip = null
try { ip = dnsResolve(h) } catch(ex) { ip = null }
STATE.DNS[h] = { ip: ip, ts: now }
return ip
}

function isInJO(ip) {
for (var i=0;i<JO_IP_RANGES.length;i++)
if (isInNet(ip, JO_IP_RANGES[i].ip, JO_IP_RANGES[i].mask)) return true
return false
}

function proxyIp(p) {
if (p.ip) return p.ip
if (!p.host) return null
return dnsCachedResolve(p.host)
}

function proxyIsJO(p) {
var ip = proxyIp(p)
if (!ip) return false
return isInJO(ip)
}

function isBlockedIR(h) {
for (var i=0;i<BLOCK_IR_TLDS.length;i++)
if (shExpMatch(h,"*"+BLOCK_IR_TLDS[i]) || dnsDomainIs(h, BLOCK_IR_TLDS[i])) return true
return false
}

function linkQualityScore() {
var t0 = Date.now()
for (var i=0;i<JO_LATENCY_ANCHORS.length;i++) dnsCachedResolve(JO_LATENCY_ANCHORS[i])
return Date.now() - t0 || 999
}

function adaptiveJitter(q) {
if (q > PING_TIMEOUT_MS) return JITTER_WINDOW_BASE_MS*3
if (q > (PING_TIMEOUT_MS/2)) return JITTER_WINDOW_BASE_MS*2
return JITTER_WINDOW_BASE_MS
}

function hash32(s) {
var h = 2166136261 >>> 0
for (var i=0;i<s.length;i++) { h ^= s.charCodeAt(i); h = (h + ((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24))) >>> 0 }
return h >>> 0
}

function ensureJOPool() {
var out = []
for (var i=0;i<PROXY_POOL.length;i++) {
var p = PROXY_POOL[i]
if (JO_ROUTE_ONLY || GEO_ENFORCE_JO) {
if (proxyIsJO(p)) out.push(p)
} else {
out.push(p)
}
}
if (out.length === 0) out.push({host:"91.106.109.12",region:"JO",socks:[20001,20002,20003,20004],http:[443,8080,8085,8443]})
STATE.JO_POOL = out
}

function pickProxyFromPool(seed) {
var pool = STATE.JO_POOL.length ? STATE.JO_POOL : PROXY_POOL
return pool[ seed % pool.length ]
}

function buildProxyString(p,port) {
if (p.ip) return "SOCKS " + p.ip + ":" + (p.port || port)
for (var i=0;i<(p.socks||[]).length;i++)
if (p.socks[i] === port) return "SOCKS " + (p.host||p.ip) + ":" + port
return "PROXY " + (p.host||p.ip) + ":" + port
}

function pickWeightedPort(weights, seed) {
var list = []
for (var p in weights) {
var w = parseInt(weights[p],10) || 0
for (var i=0;i<w;i++) list.push(parseInt(p,10))
}
if (list.length === 0) return 443
return list[ seed % list.length ]
}

function rotateWeightsOnQuality(q) {
var b = q > PING_TIMEOUT_MS ? 2 : 1
if (q > PING_TIMEOUT_MS) { STATE.WEIGHTS[443]+=b; STATE.WEIGHTS[8080]+=b; STATE.WEIGHTS[8443]+=b }
else { STATE.WEIGHTS[20001]+=b; STATE.WEIGHTS[20002]+=b; STATE.WEIGHTS[20003]+=b; STATE.WEIGHTS[20004]+=b }
}

function buildFallbackChain(primary, port) {
var seq = []
seq.push(buildProxyString(primary, port))
for (var i=0;i<(primary.socks||[]).length;i++)
if (primary.socks[i] !== port) seq.push("SOCKS " + (primary.host||primary.ip) + ":" + primary.socks[i])
for (var j=0;j<(primary.http||[]).length;j++)
if (primary.http[j] !== port) seq.push("PROXY " + (primary.host||primary.ip) + ":" + primary.http[j])
var pool = STATE.JO_POOL.length ? STATE.JO_POOL : PROXY_POOL
for (var p=0;p<pool.length;p++) {
var alt = pool[p]
if (alt === primary) continue
seq.push("PROXY " + (alt.host||alt.ip) + ":" + (alt.http?.[0] || alt.port || 8080))
}
seq.push(DEFAULT_FALLBACK)
return seq.join("; ")
}

function hostMatchesAny(h, list) {
for (var i=0;i<list.length;i++) { var d=list[i]; if (dnsDomainIs(h,d) || shExpMatch(h,"*."+d) || h===d) return true }
return false
}

function urlPathKeywords(u) {
var k = ["match","matchmaking","team","ranked","tdm","classic","lobby","lobbies","search","recruit","update","patch","download","login","auth","account","friend"]
for (var i=0;i<k.length;i++) if (u.indexOf(k[i]) !== -1) return true
return false
}

var pubg_domains = [
"pubgmobile.com","www.pubgmobile.com","pubgm.com","gpubgm.com","g.pubgm.com","gpubgm.sys.tencent.com",
"pmsc.pubgmobile.com","pms.pubgmobile.com","file-pmco.pubgmobile.com","assets.pubgmobile.com",
"patch.pubgmobile.com","update.pubgmobile.com","download.pubgmobile.com","download.pubgm.com",
"cdn.pubgmobile.com","cdn.pubgm.com","dld.pubgmobile.com",
"api.pubg.com","api.pubgmobile.com","match.api.pubg.com","game.api.pubg.com",
"matchmaking.pubgmobile.com","match.pubgmobile.com","match-server.pubgmobile.com",
"game.pubg.com","battlegrounds.pubg.com","live.pubgmobile.com","clubopen.pubgmobile.com",
"accounts.pubgmobile.com","auth.pubgmobile.com","account.pubgmobile.com","login.pubgmobile.com",
"token.pubgmobile.com","msg.pubgmobile.com","chat.pubgmobile.com",
"pubgmobile.kr","pubgmobile.jp","pubgmobile.in","pubgmobile.vn","pubgmobile.tw",
"pmc.tencent.com","pmnc.pubg.com","pubg.co.kr","pubg.jp",
"tencentgames.com","qq.com","pg.qq.com","game.qq.com","qcloud.com","qcloudcdn.com","qiniucdn.com",
"tencentcloud.net","tencentcdn.org","tencent.com",
"akamai.net","akamaized.net","akamaitechnologies.com","edgesuite.net","edgekey.net",
"cloudfront.net","fastly.net","stackpathdns.com","stackpathcdn.com","hwcdn.net","cdn77.org",
"cdn.cloudflare.net","cdn.jsdelivr.net","jsdelivr.net",
"aliyuncs.com","alicdn.com","aliyun.com",
"storage.googleapis.com","googleapis.com",
"sentry.io","firebaseapp.com","firebaseio.com","google-analytics.com","analytics.pubgmobile.com",
"napubgm.broker.amsoveasea.com","gamelog.pubgmobile.com","report.pubgmobile.com","umpubg.tencentgames.com",
"ux.pubgmobile.com","dl.pubgm.com","res.pubgmobile.com","resources.pubgmobile.com",
"cdn.example.pubgmobile.com","static.pubgmobile.com"
]

try {
if (isBlockedIR(host)) return DEFAULT_FALLBACK
ensureJOPool()
var q = linkQualityScore()
var jWin = adaptiveJitter(q)
if (STATE.JO_POOL.length === 0) return DEFAULT_FALLBACK
var selectedPool = STATE.JO_POOL
var bestIdx = 0
var bestSeedBase = q
for (var i=0;i<selectedPool.length;i++) {
var ipx = proxyIp(selectedPool[i])
if (!ipx || (GEO_ENFORCE_JO && !isInJO(ipx))) continue
var s = hash32((selectedPool[i].host||selectedPool[i].ip||"x")+"|"+bestSeedBase)
if ((s>>>0) % 1000 < (hash32("jo-pref")%1000)) { bestIdx = i }
}
var candidate = selectedPool[bestIdx]
var bucket = Math.floor(Date.now()/jWin)
var seed = hash32(host + "|" + bucket + "|" + q)
var bq = q
var bonus = (bq < PING_TIMEOUT_MS)?2:0
STATE.WEIGHTS[20001]+=bonus
var port = pickWeightedPort(STATE.WEIGHTS, seed)
var sticky = STATE.STICKY[host]
if (sticky && (Date.now()-sticky.ts) < STICKY_TTL_MS) { candidate = sticky.selected; port = sticky.port }
else { STATE.STICKY[host] = { selected:candidate, port:port, ts:Date.now() } }
if (GEO_ENFORCE_JO && !proxyIsJO(candidate)) return DEFAULT_FALLBACK
return buildFallbackChain(candidate, port)
} catch(e) {
return DEFAULT_FALLBACK
}

if (FORBID_DIRECT_GLOBAL && (hostMatchesAny(host,pubg_domains) || urlPathKeywords(url))) return DEFAULT_FALLBACK
if (!FORCE_PROXY) return DEFAULT_FALLBACK
return DEFAULT_FALLBACK

}
