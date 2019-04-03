import React from 'react'
import TomTomMap from '../tom-tom-map/TomTomMap'
import SearchPanel from './SearchPanel'
import compact from 'lodash/compact'

export default function Map(props){
    const [tomtom, setTomTom] = React.useState(null)
    const [fromPt, setFromPt] = React.useState(null)
    const [toPt, setToPt] = React.useState(null)

    function searchRoutes(from, to){
        setFromPt(from)
        setToPt(to)
    }

    function onInitTomTom(tomtom) {
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