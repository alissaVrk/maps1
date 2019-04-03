import React from 'react'
import PropTypes from 'prop-types'
import initTomTom from './initTomTom'
import {wrapAsync} from '../hooks'

function TomTomMap(props) {
    const map = React.useRef(null)
    const mapEl = React.useRef(null)
    const markersGroup = React.useRef(null)


    React.useEffect(() => {
        !props.tomtom && initTomTom().then(tomtom => {
            wrapAsync(() => props.setTomTom(tomtom))
        })
    }, [])

    //init map
    React.useEffect(() => {
        if (!props.tomtom) {
            return
        }
        const tomtom = props.tomtom
        map.current = tomtom.L.map('map', {
            source: 'vector',
            center: [37.769167, -122.478468],
            basePath: '/sdk',
            zoom: 15
        })

        if (props.panel) {
            tomtom.controlPanel({
                position: 'topright',
                collapsed: false,
                close: null
            })
                .addTo(map.current)
                .addContent(mapEl.current.querySelector(`#${props.panelId}`))
        }

        markersGroup.current = new tomtom.L.TomTomMarkersLayer().addTo(map.current)
    }, [props.tomtom])

    //paint markers
    React.useEffect(() => {
        if (!props.tomtom) {
            return
        }

        markersGroup.current.clearLayers()
        if (props.markers && props.markers.length > 0) {
            markersGroup.current.setMarkersData(props.markers)
                .addMarkers()
            map.current.fitBounds(markersGroup.current.getBounds())
        }

    }, [props.tomtom, props.markers])

    return <div id='map' key='tmap' ref={mapEl}>
        {props.panel}
    </div>

}

TomTomMap.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    tomtom: PropTypes.object,
    setTomTom: PropTypes.func.isRequired,
    panel: PropTypes.any,
    panelId: PropTypes.string
}
export default TomTomMap