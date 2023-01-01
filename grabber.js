import got from "got"
import freeproxylist from "./sources/freeproxylist.js"
import {
    DataPipe
} from "./src/DataPipe.js"
import {
    load
} from "cheerio"


freeproxylist.config.lists.map(async list => {
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
                if (parse) text = parse(text)
                result[name] = text

            })
            DataPipe.emit('data', result)
        })
    })
})