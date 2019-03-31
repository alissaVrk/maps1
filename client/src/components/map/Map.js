import React from 'react'
import TomTomMap from '../tom-tom-map/TomTomMap'
import SearchPanel from './SearchPanel'

export default function Map(props){
    function searchRoutes(from, to){
        console.log(from, to)
    }

    const searchPanel = <SearchPanel onSubmitSearch={searchRoutes} id='popup'></SearchPanel>
    return <TomTomMap panel={searchPanel} panelId='popup'></TomTomMap>
}