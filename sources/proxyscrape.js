import got from "got"
import {
    validateProtocol
} from "../validator.js"

const ProxyScrape = async ({
    protocol = 'all',
    timeout = 10000,
    country = 'all'
} = {}) => {
    const url = new URL('https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all')
    url.searchParams.set('protocol', protocol)
    url.searchParams.set('timeout', timeout.toString())
    url.searchParams.set('country', country)
    try {

        const resp = await got.get(url).text()
        return resp.split(/\r?\n/)
    } catch (error) {
        return []
    }

}



export default {
    name: "ProxyScrape",
    type: 'api',
    gotOptions: {},
    config: {
        lists: ['http', 'https', 'socks4', 'socks5'].map(protocol => {
            return {
                protocol,
                getData: () => ProxyScrape({
                    protocol
                })
            }
        })
    }
}