import _ from 'underscore'

let startUrls = [

];

for (let i = 1; i <= 10; i++) startUrls.push(`http://proxy-list.org/english/index.php?p=${i}`)


let listDefinition = {
    link: {
        url: null,
    },
    items: [{
        selector: '.table-wrap ul:not(:first-child)',
        attributes: [{
                name: 'ipAddress',
                selector: 'li.proxy',
                parse: function (text) {
                    text = text.replace(/^Proxy\('/i).replace(/'\)$/)
                    text = Buffer.from(text, 'base64').toString()
                    const [ip, port] = text.trim().split(':')
                    return ip
                }
            },
            {
                name: 'port',
                selector: 'li.proxy',
                parse: function (text) {
                    text = text.replace(/^Proxy\('/i).replace(/'\)$/)
                    text = Buffer.from(text, 'base64').toString()
                    const [ip, _port] = text.trim().split(':')
                    let port = parseInt(_port);
                    if (_.isNaN(port)) return null;
                    return port;
                }
            },
            {
                name: 'countryCode',
                selector: 'li.country-city .country-code .flag',
                parse: function (text) {
                    text = text.trim().toLowerCase();
                    const splitted = text.split(/\s+/)
                    return splitted[0]
                },
            },
            {
                name: 'protocol',
                selector: 'li',
                parse: function (text) {
                    return 'http'
                },
            },
        ],
    }],
}


export default {
    name: "ProxyList",
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