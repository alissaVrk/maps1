import { PointTuple } from 'leaflet';
import { TomTom } from "../../components/tom-tom-map/tomtom";
import uniqueId from 'lodash/uniqueId'

export function searchForPoint(tomtom: TomTom, addr: string) {
    if (!addr){
        return Promise.resolve(undefined)
    }
    return tomtom.fuzzySearch()
        .bestResult(true)
        .query(addr)
        .go()
        .then(res => [res.position.lat, res.position.lon] as PointTuple)
}

export function searchForRoutes(tomtom: TomTom, from: PointTuple, to: PointTuple) {
    return tomtom.routing()
        .locations([from, to])
        .maxAlternatives(2)
        .go()
        .then(res => {
            res.features.forEach(feature => {
                feature.id = uniqueId('feature-')
            })
            return res
        })
}



