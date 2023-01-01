import {
    load
} from 'cheerio'
import _ from 'underscore'

let startUrls = []
for (let i = 1; i <= 100; i++) startUrls.push(`https://www.free-proxy-list.com/?search=1&page=${i}&port=&type%5B%5D=http&type%5B%5D=https&speed%5B%5D=3&connect_time%5B%5D=3&up_time=0&search=Search`)

let listDefinition = {
    debug: true,
    link: {
        url: null,
    },
    items: [{
        selector: 'table.proxy-list tbody tr',
        attributes: [{
                name: 'ipAddress',
                selector: 'td:nth-child(1)'
            },
            {
                name: 'port',
                selector: 'td:nth-child(3)',
                parse: function (text) {
                    var port = parseInt(text.trim());
                    if (_.isNaN(port)) return null;
                    return port;
                },
            },
            {
                name: 'countryCode',
                selector: 'td:nth-child(4)',
                parse: function (text, html) {
                    const $ = load(html)
                    const attrs = $('span').attr()
                    if (!attrs) return ''
                    return attrs['id'].trim().toLowerCase()
                },
            },
            {
                name: 'protocol',
                selector: 'td:nth-child(7)',
                parse: function (text) {
                    return 'http'
                },
            },
        ],
    }],
}


export default {
    name: "FreeProxyList",
    availableProtocols: ['http'],
    gotOptions: {},
    config: {
        lists: _.map(startUrls, function (startUrl) {
            return _.extend({}, listDefinition, {
                link: {
                    url: startUrl
                },
            });
        })
    }
}