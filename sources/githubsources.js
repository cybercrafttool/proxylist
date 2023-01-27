const http = ['https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt', 'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt', 'https://raw.githubusercontent.com/jetkai/proxy-list/main/archive/txt/proxies-http.txt']

const https = ['https://raw.githubusercontent.com/jetkai/proxy-list/main/archive/txt/proxies-https.txt']
const socks4 = ['https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt', 'https://raw.githubusercontent.com/jetkai/proxy-list/main/archive/txt/proxies-socks4.txt']
const socks5 = ['https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt', 'https://raw.githubusercontent.com/jetkai/proxy-list/main/archive/txt/proxies-socks5.txt']

const allUnverified = ['https://github.com/sunny9577/proxy-scraper/raw/master/proxies.txt', 'https://github.com/mertguvencli/http-proxy-list/raw/main/proxy-list/data.txt']
export default {
    name: "Github sources",
    type: 'scrape-ipadd-only',
    gotOptions: {},
    config: {
        lists: [
            ...http.map(_ => ({
                protocol: 'http',
                link: _
            })), ...https.map(_ => ({
                protocol: 'https',
                link: _
            })), ...socks4.map(_ => ({
                protocol: 'socks4',
                link: _
            })), ...socks5.map(_ => ({
                protocol: 'socks5',
                link: _
            })), ...allUnverified.map(_ => ({
                protocol: 'all-unverified',
                link: _
            })),
        ]

    }
}