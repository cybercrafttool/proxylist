import got from "got"
import {
    DataPipe
} from "./src/DataPipe.js"
import {
    load
} from "cheerio"
import glob from 'glob'
import {
    findIpAddress
} from "./src/utils.js"
import {
    executablePath
} from 'puppeteer'
import puppeteer from "puppeteer-extra"
import {
    chunk
} from "underscore"
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

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

const scrapeIpAddOnly = async (lists = []) => {
    await Promise.all(lists.map(async list => {
        const body = await got.get(list.link).text()
        const ips = findIpAddress(body)
        for (const host of chunk(ips, 100)) {
            host.map(host => {
                const [ipAddress, port] = host.split(':')
                DataPipe.emit('data', {
                    protocol: list.protocol,
                    ipAddress,
                    port
                })
            })
        }
    })).catch(_ => console.error("error", _))
}

const scrapeIpAddOnlyHeadless = async (lists = []) => {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        executablePath: executablePath()
    })


    for (const items of chunk(lists, 2)) {
        await Promise.all(items.map(async (item, i) => {
            const page = await browser.newPage()
            try {

                await page.goto(item.link, {
                    waitUntil: item.domcontentloaded ? 'domcontentloaded' : undefined
                })
            } catch (error) {
                console.error("Tidak bisa mengakses halaman ini", item.link)
                await page.close()
                return
            }
            let content = await page.content()
            // jika ada cloudflare challenge.tunggu dulu sampai selesai
            if (content.includes('id="challenge-error-title"')) {
                await new Promise(async (resolve) => {
                    const id = setTimeout(resolve, 20000);
                    while (true) {
                        content = await page.content()
                        if (content.includes('id="challenge-error-title"')) {
                            await page.waitForTimeout(1000)
                        } else break
                    }
                    clearTimeout(id)
                    resolve(true)

                })
            }

            const ips = findIpAddress(content)
            for (const host of chunk(ips, 100)) {
                host.map(host => {
                    const [ipAddress, port] = host.split(':')
                    DataPipe.emit('data', {
                        protocol: item.protocol,
                        ipAddress,
                        port
                    })
                })
            }
            await page.close()
        }))

    }
    await browser.close()
}


process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

glob('./sources/**/*.js', async (er, files) => {
    for (const file of files) {
        const proxyFileMatcher = await import(file)
        const handlers = {
            'scrape': () => proxyFileMatcher.default.config.lists.map(scrapeHandler),
            'scrape-ipadd-only': () => scrapeIpAddOnly(proxyFileMatcher.default.config.lists),
            'scrape-ipadd-only-headless': () => scrapeIpAddOnlyHeadless(proxyFileMatcher.default.config.lists),
            'api': () => proxyFileMatcher.default.config.lists.map(apiHandler)
        }
        let handler = handlers[proxyFileMatcher.default.type]
        if (handler) await handler()
        else {
            console.error(new Error(`Tidak ada handler untuk ${proxyFileMatcher.default.type}`))
        }
    }
    process.exit()
})