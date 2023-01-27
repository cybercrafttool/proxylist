export default {
    name: "Blackhatworld",
    type: 'scrape-ipadd-only-headless',
    gotOptions: {},
    config: {
        lists: [
            ...[
                'https://www.blackhatworld.com/seo/100-scrapebox-proxies.297574/',
                'https://www.blackhatworld.com/seo/gscraper-proxies.703493/',
                'https://www.blackhatworld.com/seo/port-scanned-proxies.988868/',
                'https://www.blackhatworld.com/seo/gsa-proxies-proxygo.830325/',
                'https://www.blackhatworld.com/seo/socks-proxies-occasional-update.803039/',
                'https://www.blackhatworld.com/seo/anonymous-proxies.806981/',
                'https://www.blackhatworld.com/seo/tunnel-connect-proxies.951125/',
                'https://www.blackhatworld.com/seo/socks-4-5-split-lists.979230/',
                'https://www.blackhatworld.com/seo/transparent-proxies-proxygo.890330/',
                'https://www.blackhatworld.com/seo/proxy-dump-tested.1084114/',
                'https://www.blackhatworld.com/seo/mixed-proxys-all-types.922566/',
            ].map(_ => ({
                protocol: 'http',
                link: _
            })),
            ...[
                'https://www.blackhatworld.com/seo/ssl-proxies-occasional-update.927669/',
            ].map(_ => ({
                protocol: 'https',
                link: _
            }))
        ]

    }
}