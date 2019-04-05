import React from 'react'
import TomTomMap from '../tom-tom-map/TomTomMap'
import SearchPanel from './SearchPanel'
import compact from 'lodash/compact'
import {searchForRoutes} from '../../store/tomtom/search'
import {wrapAsync} from '../hooks'
import { PointTuple, GeoJSON } from 'leaflet';
import { TomTom } from '../tom-tom-map/tomtom';


interface MapProps {
    tomtom: TomTom
}

export default function Map(props: MapProps){
    const [tomtom, setTomTom] = React.useState<TomTom|undefined>()
    const [fromPt, setFromPt] = React.useState<PointTuple|undefined>()
    const [toPt, setToPt] = React.useState<PointTuple|undefined>()
    const [routes, setRoutes] = React.useState()

    function searchPoints(from: PointTuple, to: PointTuple){
        setFromPt(from)
        setToPt(to)
        setRoutes(undefined)
    }

    function searchRoutes(){
        if (!tomtom || !fromPt || !toPt) {
            return
        }
        searchForRoutes(tomtom, fromPt, toPt)
            .then(rs => wrapAsync(() => setRoutes(rs)))
    }

    function onInitTomTom(tomtom: TomTom) {
        setTomTom(tomtom)
    }

    React.useEffect(() => {
        if (!tomtom && props.tomtom) {
            setTomTom(props.tomtom)
        }
    }, [])

    const panelId = 'popup'
    const searchPanel = tomtom && <SearchPanel 
                onSubmitSearch={searchPoints} 
                id={panelId} 
                tomtom={tomtom}
                onGetRoutes={searchRoutes} />

    const markers = compact([fromPt, toPt])

    return <TomTomMap 
                panel={searchPanel} 
                panelId={panelId} 
                setTomTom={onInitTomTom}
                tomtom={tomtom}
                markers={markers}
                routes={routes}
            />
}