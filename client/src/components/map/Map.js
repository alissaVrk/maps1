import React from 'react'
import TomTomMap from '../tom-tom-map/TomTomMap'
import SearchPanel from './SearchPanel'

export default function Map(props){
    function searchRoutes(from, to){
        console.log(from, to)
    }

    const [tomtom, setTomTom] = React.useState(null)

    const panelId = 'popup'
    const searchPanel = <SearchPanel onSubmitSearch={searchRoutes} id={panelId} tomtom={tomtom}></SearchPanel>
    return <TomTomMap panel={searchPanel} panelId={panelId} setTomTom={setTomTom}></TomTomMap>
}