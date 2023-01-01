import _ from 'underscore'

let startUrls = [
    'https://free-proxy-list.net/',
    'https://www.us-proxy.org/',
    'https://free-proxy-list.net/uk-proxy.html',
    'https://www.sslproxies.org/',
    'https://free-proxy-list.net/anonymous-proxy.html',
];

let listDefinition = {
    link: {
        url: null,
    },
    items: [{
        selector: '.fpl-list table tbody tr',
        attributes: [{
                name: 'ipAddress',
                selector: 'td:nth-child(1)',
            },
            {
                name: 'port',
                selector: 'td:nth-child(2)',
                parse: function (text) {
                    var port = parseInt(text);
                    if (_.isNaN(port)) return null;
                    return port;
                },
            },
            {
                name: 'countryCode',
                selector: 'td:nth-child(3)',
                parse: function (text) {
                    text = text.trim().toLowerCase();
                    return text
                },
            },
            {
                name: 'protocol',
                selector: 'td:nth-child(7)',
                parse: function (text) {
                    return text == 'yes' ? 'https' : 'http'
                },
            },
        ],
    }],
}


export default {
    name: "FreeProxyList",
    type: 'scrape',
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