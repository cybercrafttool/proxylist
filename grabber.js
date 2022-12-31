import {
    ProxyScrape
} from "./src/proxyscrape.js"
import {
    writeFileSync
} from 'fs'

writeFileSync('proxyscrape.txt', (await ProxyScrape()).join("\n"))