

export function searchForPoint(addr) {
    //TODO: find a better place to take the API from
    return window.tomtom.fuzzySearch()
        .bestResult(true)
        .query(addr)
        .go()
        .then(res => {console.log('RERERE', res); return res})
}



