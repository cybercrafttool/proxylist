import got from "got"
import {
    DataPipe
} from "./src/DataPipe.js"
import {
    load
} from "cheerio"
import glob from 'glob'

const handler = async list => {
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


glob('./sources/**/*.js', async (er, files) => {
    files.map(async file => {
        const proxyFileMatcher = await import(file)

        proxyFileMatcher.default.config.lists.map(handler)
    })
})