import got from "got"
import {
    DataPipe
} from "./src/DataPipe.js"
import {
    load
} from "cheerio"
import glob from 'glob'

const scrapeHandler = async list => {
    const body = await got.get(list.link.url, list.gotOptions).text()
    const $ = load(body)
    list.items.map(item => {
        $(item.selector).each((i, el) => {
            const result = {}
            item.attributes.map(({
                name,
                selector,
                parse
            }) => {
                let text = $(el).find(selector).text()
                if (parse) text = parse(text, $(el).find(selector).html())
                result[name] = text

            })
            DataPipe.emit('data', result)
        })
    })
}

const apiHandler = async (list) => {
    const items = await list.getData()
    items.map(item => {
        const [ipAddress, port] = item.split(':')
        DataPipe.emit('data', {
            protocol: list.protocol,
            ipAddress,
            port
        })
    })

}

glob('./sources/**/*.js', async (er, files) => {
    files.map(async file => {
        const proxyFileMatcher = await import(file)
        const handlers = {
            'scrape': () => proxyFileMatcher.default.config.lists.map(scrapeHandler),
            'api': () => proxyFileMatcher.default.config.lists.map(apiHandler)
        }
        let handler = handlers[proxyFileMatcher.default.type]
        if (handler) handler()
        else throw new Error(`Tidak ada handler untuk ${proxyFileMatcher.default.type}`)
    })
})