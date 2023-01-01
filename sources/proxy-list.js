import {
    load
} from "cheerio"
import got from "got"
export const ProxyList = async ({
    protocol = 'all',
    country = 'all'
} = {}) => {
    const body = await got.get('http://proxy-list.org/english/index.php?p=1').text()
    const $ = load(body)
    const results = []
    $('.table-wrap ul:not(:first-child)').each((el) => {
        console.log($(el).find('.proxy').text())
    })
}
// ProxyList()
