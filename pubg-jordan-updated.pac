function FindProxyForURL(url, host) {

var FORCE_PROXY = true
var PROXY_HOST = "91.106.109.12"
var SOCKS_PORTS = [20001,20002,20003,20004]
var HTTP_PORTS = [443,8080,8085,8443]
var DEFAULT_FALLBACK = "DIRECT"
var DNS_CACHE_TTL_MS = 45000
var JITTER_WINDOW_MS = 30000
var PING_TIMEOUT_MS = 160
var HEAVY_WEIGHT_BONUS = 3
var LIGHT_WEIGHT_BONUS = 1
var WEIGHTS = {
20001:4,
20002:3,
20003:3,
20004:3,
443:4,
8080:3,
8085:2,
8443:2
}

if (typeof globalThis === "undefined") { var globalThis = this }
if (!globalThis.__PAC_DNS_CACHE__) { globalThis.__PAC_DNS_CACHE__ = {} }
var DNS_STORE = globalThis.__PAC_DNS_CACHE__

function dnsCachedResolve(h) {
var now = (new Date()).getTime()
var e = DNS_STORE[h]
if (e && (now - e.ts) < DNS_CACHE_TTL_MS && e.ip) { return e.ip }
try { var ip = dnsResolve(h) } catch(ex) { var ip = null }
DNS_STORE[h] = { ip: ip, ts: now }
return ip
}

function linkQualityScore() {
var start = (new Date()).getTime()
dnsCachedResolve("dns.google")
dnsCachedResolve("pubgmobile.com")
var dt = (new Date()).getTime() - start
return dt || 999
}

function boostWeights(qualityMs) {
var b = (qualityMs > PING_TIMEOUT_MS) ? HEAVY_WEIGHT_BONUS : LIGHT_WEIGHT_BONUS
if (qualityMs > PING_TIMEOUT_MS) {
WEIGHTS[443] = (WEIGHTS[443] || 0) + b
WEIGHTS[8080] = (WEIGHTS[8080] || 0) + b
WEIGHTS[8443] = (WEIGHTS[8443] || 0) + b
} else {
WEIGHTS[20001] = (WEIGHTS[20001] || 0) + b
WEIGHTS[20002] = (WEIGHTS[20002] || 0) + b
WEIGHTS[20003] = (WEIGHTS[20003] || 0) + b
WEIGHTS[20004] = (WEIGHTS[20004] || 0) + b
}
}

function hash32(s) {
var h = 2166136261 >>> 0
for (var i = 0; i < s.length; i++) {
h ^= s.charCodeAt(i)
h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
}
return h >>> 0
}

function pickWeightedPort(seed) {
var list = []
for (var p in WEIGHTS) {
var w = parseInt(WEIGHTS[p],10) || 0
for (var k = 0; k < w; k++) list.push(parseInt(p,10))
}
if (list.length === 0) return 443
return list[seed % list.length]
}

function proxyStringForPort(port) {
for (var i = 0; i < SOCKS_PORTS.length; i++)
if (SOCKS_PORTS[i] === port) return "SOCKS " + PROXY_HOST + ":" + port
return "PROXY " + PROXY_HOST + ":" + port
}

function buildProxyChain(primaryPort) {
var chain = []
chain.push(proxyStringForPort(primaryPort))
for (var i = 0; i < SOCKS_PORTS.length; i++)
if (SOCKS_PORTS[i] !== primaryPort) chain.push("SOCKS " + PROXY_HOST + ":" + SOCKS_PORTS[i])
for (var j = 0; j < HTTP_PORTS.length; j++)
if (HTTP_PORTS[j] !== primaryPort) chain.push("PROXY " + PROXY_HOST + ":" + HTTP_PORTS[j])
chain.push(DEFAULT_FALLBACK)
return chain.join("; ")
}

var pubg_domains = [
"pubgmobile.com",
"www.pubgmobile.com",
"pubgm.com",
"gpubgm.com",
"g.pubgm.com",
"gpubgm.sys.tencent.com",
"pmsc.pubgmobile.com",
"pms.pubgmobile.com",
"file-pmco.pubgmobile.com",
"assets.pubgmobile.com",
"patch.pubgmobile.com",
"update.pubgmobile.com",
"download.pubgmobile.com",
"download.pubgm.com",
"cdn.pubgmobile.com",
"cdn.pubgm.com",
"dld.pubgmobile.com",
"api.pubg.com",
"api.pubgmobile.com",
"match.api.pubg.com",
"game.api.pubg.com",
"matchmaking.pubgmobile.com",
"match.pubgmobile.com",
"match-server.pubgmobile.com",
"game.pubg.com",
"battlegrounds.pubg.com",
"live.pubgmobile.com",
"clubopen.pubgmobile.com",
"accounts.pubgmobile.com",
"auth.pubgmobile.com",
"account.pubgmobile.com",
"login.pubgmobile.com",
"token.pubgmobile.com",
"msg.pubgmobile.com",
"chat.pubgmobile.com",
"pubgmobile.kr",
"pubgmobile.jp",
"pubgmobile.in",
"pubgmobile.vn",
"pubgmobile.tw",
"pmc.tencent.com",
"pmnc.pubg.com",
"pubg.co.kr",
"pubg.jp",
"tencentgames.com",
"qq.com",
"pg.qq.com",
"game.qq.com",
"qcloud.com",
"qcloudcdn.com",
"qiniucdn.com",
"tencentcloud.net",
"tencentcdn.org",
"tencent.com",
"akamai.net",
"akamaized.net",
"akamaitechnologies.com",
"edgesuite.net",
"edgekey.net",
"cloudfront.net",
"fastly.net",
"stackpathdns.com",
"stackpathcdn.com",
"hwcdn.net",
"cdn77.org",
"cdn.cloudflare.net",
"cdn.jsdelivr.net",
"jsdelivr.net",
"aliyuncs.com",
"alicdn.com",
"aliyun.com",
"storage.googleapis.com",
"googleapis.com",
"sentry.io",
"firebaseapp.com",
"firebaseio.com",
"google-analytics.com",
"analytics.pubgmobile.com",
"napubgm.broker.amsoveasea.com",
"gamelog.pubgmobile.com",
"report.pubgmobile.com",
"umpubg.tencentgames.com",
"ux.pubgmobile.com",
"dl.pubgm.com",
"res.pubgmobile.com",
"resources.pubgmobile.com",
"cdn.example.pubgmobile.com",
"static.pubgmobile.com"
]

function hostMatchesAny(hostname, list) {
for (var i = 0; i < list.length; i++) {
var d = list[i]
if (dnsDomainIs(hostname, d) || shExpMatch(hostname, "*." + d) || hostname === d) return true
}
return false
}

function urlPathKeywords(u) {
var k = ["match","matchmaking","team","ranked","tdm","classic","lobby","lobbies","search","recruit","update","patch","download","login","auth","account","friend"]
for (var i = 0; i < k.length; i++)
if (u.indexOf(k[i]) !== -1) return true
return false
}

var pubg_ip_ranges = [
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

function ipInRanges(h) {
var ip = dnsCachedResolve(h)
if (!ip) return false
for (var i = 0; i < pubg_ip_ranges.length; i++)
if (isInNet(ip, pubg_ip_ranges[i].ip, pubg_ip_ranges[i].mask)) return true
return false
}

try {
if (hostMatchesAny(host, pubg_domains)) {
var q = linkQualityScore()
boostWeights(q)
var bucket = Math.floor((new Date()).getTime() / JITTER_WINDOW_MS)
var seed = hash32(host + "|" + bucket + "|" + q)
var port = pickWeightedPort(seed)
return buildProxyChain(port)
}
if (urlPathKeywords(url)) {
var q2 = linkQualityScore()
boostWeights(q2)
var bucket2 = Math.floor((new Date()).getTime() / JITTER_WINDOW_MS)
var seed2 = hash32(host + "|" + bucket2 + "|" + q2)
var port2 = pickWeightedPort(seed2)
return buildProxyChain(port2)
}
if (ipInRanges(host)) {
var q3 = linkQualityScore()
boostWeights(q3)
var bucket3 = Math.floor((new Date()).getTime() / JITTER_WINDOW_MS)
var seed3 = hash32(host + "|" + bucket3 + "|" + q3)
var port3 = pickWeightedPort(seed3)
return buildProxyChain(port3)
}
} catch(e) {
return DEFAULT_FALLBACK
}

if (!FORCE_PROXY) return DEFAULT_FALLBACK
return DEFAULT_FALLBACK

}
