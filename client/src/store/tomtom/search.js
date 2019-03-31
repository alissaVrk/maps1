

export function searchForPoint(tomtom, addr) {
    if (!addr) {
        return null
    }
    return tomtom.fuzzySearch()
        .bestResult(true)
        .query(addr)
        .go()
        .then(res => [res.position.lat, res.position.lon])
}



