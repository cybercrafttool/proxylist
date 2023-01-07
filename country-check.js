import {
    readFileSync,
    readdirSync
} from 'fs'
import path, {
    basename,
    dirname
} from 'path'
import {
    fileURLToPath
} from 'url'
import geoip from 'geoip-country'
import {
    DataPipe
} from "./src/DataPipe.js"
const __dirname = dirname(fileURLToPath(
    import.meta.url));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))


const allPath = path.join(__dirname, 'results/all')
for (const file of readdirSync(allPath)) {
    const filepath = path.join(allPath, file)
    const filename = basename(filepath)
    const protocol = filename.replace(/\.proxy\.txt$/i, '')

    let i = 0
    for (const line of readFileSync(filepath).toString().split(/\r?\n/)) {

        const [ipAddress, port] = line.split(':')
        if (!ipAddress) continue
        const lookup = geoip.lookup(ipAddress)
        if (!lookup) continue
        DataPipe.emit('data', {
            protocol,
            ipAddress,
            port,
            countryCode: lookup.country,
            countryOnly: true
        })
        if (i++ == 100) {
            await sleep(100)
            i = 0
        }

    }

}