import { PointTuple } from 'leaflet';
import { TomTom } from "../../components/tom-tom-map/tomtom";

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



