import got from "got"
import {
    validateProtocol
} from "../validator.js"

export const ProxyScrape = async ({
    protocol = 'all',
    timeout = 10000,
    country = 'all'
} = {}) => {
    const url = new URL('https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all')
    url.searchParams.set('protocol', validateProtocol(protocol))
    url.searchParams.set('timeout', timeout.toString())
    url.searchParams.set('country', country)

    const resp = await got.get(url).text()
    return resp.split(/\r?\n/)
}
