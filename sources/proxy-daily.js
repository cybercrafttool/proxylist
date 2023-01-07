import {
    load
} from "cheerio"
import got from "got"

const ProxyDaily = async ({
    protocol
}) => {
    const $ = load(await got.get('https://proxy-daily.com/').text())
    let nthChild = 0
    if (protocol === 'http') nthChild = 1
    else if (protocol === 'socks4') nthChild = 2
    else if (protocol === 'socks5') nthChild = 3

    const content = $($(`.freeProxyStyle`)[nthChild]).text()
    
    return content.split(/\r?\n/).filter(Boolean)
}
export default {
    name: "ProxyDaily.com",
    type: 'api',
    gotOptions: {},
    config: {
        lists: ['http', 'socks4', 'socks5'].map(protocol => {
            return {
                protocol,
                getData: () => ProxyDaily({
                    protocol
                })
            }
        })
    }
}