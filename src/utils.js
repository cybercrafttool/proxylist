export const findIpAddress = (body) => {
    let regex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+/g
    const results = []
    for (const match of body.matchAll(regex)) {
        const ip = match[0]
        results.push(ip)
    }
    return results
}
