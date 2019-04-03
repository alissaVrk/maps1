import React from 'react'
import TomTomMap from '../tom-tom-map/TomTomMap'
import SearchPanel from './SearchPanel'
import compact from 'lodash/compact'
import { PointTuple } from 'leaflet';
import { TomTom } from '../tom-tom-map/tomtom';

interface MapProps {
    tomtom: TomTom
}

export default function Map(props: MapProps){
    const [tomtom, setTomTom] = React.useState<TomTom|undefined>()
    const [fromPt, setFromPt] = React.useState<PointTuple|undefined>()
    const [toPt, setToPt] = React.useState<PointTuple|undefined>()

    function searchRoutes(from: PointTuple, to: PointTuple){
        setFromPt(from)
        setToPt(to)
    }

    function onInitTomTom(tomtom: TomTom) {
        setTomTom(tomtom)
    }

    //this is for tests..
    React.useEffect(() => {
        if (!tomtom && props.tomtom) {
            setTomTom(props.tomtom)
        }
    }, [])

    const panelId = 'popup'
    const searchPanel = tomtom && <SearchPanel onSubmitSearch={searchRoutes} id={panelId} tomtom={tomtom}></SearchPanel>
    const markers = compact([fromPt, toPt]) 
    return <TomTomMap 
                panel={searchPanel} 
                panelId={panelId} 
                setTomTom={onInitTomTom}
                tomtom={tomtom}
                markers={markers}
            ></TomTomMap>
}