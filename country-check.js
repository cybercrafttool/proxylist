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



const allPath = path.join(__dirname, 'results/all')
for (const file of readdirSync(allPath)) {
    const filepath = path.join(allPath, file)
    const filename = basename(filepath)
    const protocol = filename.replace(/\.proxy\.txt$/i, '')
    readFileSync(filepath).toString().split(/\r?\n/).map(line => {
        const [ipAddress, port] = line.split(':')
        if (!ipAddress) return
        const lookup = geoip.lookup(ipAddress)
        if (!lookup) return
        DataPipe.emit('data', {
            protocol,
            ipAddress,
            port,
            countryCode: lookup.country,
            countryOnly: true
        })

    })

}