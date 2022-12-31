import {
    ProxyScrape
} from "./src/proxyscrape.js"
import {
    existsSync,
    mkdirSync,
    readFile,
    readFileSync,
    writeFileSync
} from 'fs'

writeFileSync('http.txt', (await ProxyScrape({protocol:'http'})).join("\n"))
writeFileSync('socks4.txt', (await ProxyScrape({protocol:'socks4'})).join("\n"))
writeFileSync('socks5.txt', (await ProxyScrape({protocol:'socks5'})).join("\n"))

const countryCode = readFileSync('country-code.json')
const countries = JSON.parse(countryCode.toString())
Object.keys(countries).map(async code => {
    const country = countries[code];
    !existsSync(country) && mkdirSync(country, {
        recursive: true
    })
    const [http, socks4, socks5] = await Promise.all([
        ProxyScrape({
            protocol: 'http',
            country: code
        }),
        ProxyScrape({
            protocol: 'socks4',
            country: code
        }),
        ProxyScrape({
            protocol: 'socks5',
            country: code
        }),
    ])
    writeFileSync(`${country}/http.txt`, http.join('\n'))
    writeFileSync(`${country}/socks4.txt`, socks4.join('\n'))
    writeFileSync(`${country}/socks5.txt`, socks5.join('\n'))
})