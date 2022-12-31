export const validateProtocol = (protocol) => {
    const proxyTypes = ['http', 'socks4', 'socks5', 'all']
    if (!proxyTypes.includes(protocol)) throw new Error(`Protocol mus be ${JSON.stringify(proxyTypes)}`)
    return protocol
}