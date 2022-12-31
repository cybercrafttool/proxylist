import {
    ProxyScrape
} from "./src/proxyscrape.js"
import {
    writeFileSync
} from 'fs'

writeFileSync('http.txt', (await ProxyScrape({protocol:'http'})).join("\n"))
writeFileSync('socks4.txt', (await ProxyScrape({protocol:'socks4'})).join("\n"))
writeFileSync('socks5.txt', (await ProxyScrape({protocol:'socks5'})).join("\n"))