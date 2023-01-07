import {
    load
} from "cheerio"
import got from "got"

const getData = async ({
    protocol
}) => {
    const target = new URL('http://proxydb.net/')
    if (protocol) target.searchParams.set('protocol', protocol)
    const $ = load(await got.get(target.toString()).text())
    const results = []
    $('table tbody tr td:first-child').each((i, el) => {
        const ip = $(el).text().trim()
        if (ip) results.push(ip)
    })
    return results
}

export default {
    name: "http://proxydb.net",
    type: 'api',
    gotOptions: {},
    config: {
        lists: ['http', 'https', 'socks4', 'socks5'].map(protocol => {
            return {
                protocol,
                getData: () => getData({
                    protocol
                })
            }
        })
    }
}