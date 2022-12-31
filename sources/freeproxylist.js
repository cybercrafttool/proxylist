import {
    load
} from "cheerio"
import got from "got"

let startUrls = [
    'https://free-proxy-list.net/',
    'https://www.us-proxy.org/',
    'https://free-proxy-list.net/uk-proxy.html',
    'https://www.sslproxies.org/',
    'https://free-proxy-list.net/anonymous-proxy.html',
];

export const FreeProxyList = async ({
    protocol = 'all',
    country = 'all'
} = {}) => {
    if (!/https?/.test(protocol)) return []
    const bodies = await Promise.all(startUrls.map(url => got.get(url).text()))
    const body = bodies.join('')
    const $ = load(body)
    const results = []
    $('#proxylisttable tbody tr').each((el) => {
        const ip = $(el).find('td:nth-child(1)').text()
        const port = $(el).find('td:nth-child(2)').text()
        const countryCode = $(el).find('td:nth-child(3)').text().toLowerCase()
        if (country == 'all' || country == countryCode) results.push(`${ip}:${port}`)
    })
    return results
}