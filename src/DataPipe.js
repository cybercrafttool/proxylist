import EventEmitter from 'events'
import path, {
    dirname
} from 'path';
import {
    fileURLToPath
} from 'url';
import {
    find
} from 'find-in-files'
import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    rmSync,
} from 'fs'

const __dirname = dirname(fileURLToPath(
    import.meta.url));

const CountryCode = JSON.parse(readFileSync(path.join(__dirname, '../country-code.json')))

const folderResults = path.join(__dirname, '../results')
const folderCountries = path.join(folderResults, '/countries');
const folderAll = path.join(folderResults, '/all');
// refresh
existsSync(folderResults) && rmSync(folderResults, {
    recursive: true,
    force: true
})
mkdirSync(folderCountries, {
    recursive: true
})
mkdirSync(folderAll, {
    recursive: true
})

export const DataPipe = new EventEmitter()

DataPipe.on('data', async ({
    ipAddress,
    port,
    countryCode,
    protocol
}) => {
    const hostname = `${ipAddress}:${port}`
    // Process by country
    // const countryExist = (await find(hostname, folderCountries, '.proxy.txt$')).length
    const countryExist = false // disable duplicate for now
    if (!countryExist) {
        // only process country code listing
        if (CountryCode[countryCode]) {
            const folderCountry = path.join(folderCountries, CountryCode[countryCode]);
            !existsSync(folderCountry) && mkdirSync(folderCountry, {
                recursive: true
            })

            appendFileSync(path.join(folderCountry, `${protocol}.proxy.txt`), `${hostname}\n`)
        }

    }


    // Process By All
    const protocolPath = path.join(folderAll, `${protocol}.proxy.txt`);
    // const exist = (await find(hostname, folderAll, '.proxy.txt$')).length
    const exist = false // disable duplicate for now
    if (!exist) appendFileSync(protocolPath, hostname + '\n')
    console.log(hostname)

})