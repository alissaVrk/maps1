import React, { MutableRefObject } from 'react'
import initTomTom from './initTomTom'
import {wrapAsync} from '../hooks'
import { TomTom, TomTomMarkersLayer, TomTomRouteProperties } from './tomtom';
import { PointTuple, Map, Layer} from 'leaflet';
import { FeatureCollection, LineString} from 'geojson';

interface TomTomMapProps {
    tomtom?: TomTom,
    setTomTom: (tomtom: TomTom) => void,
    panel?: JSX.Element,
    panelId?: string,
    markers?: Array<PointTuple>,
    routes?: FeatureCollection<LineString, TomTomRouteProperties>
}

function TomTomMap(props: TomTomMapProps) {
    const map: MutableRefObject<Map> = React.useRef({} as Map)
    const mapEl: MutableRefObject<HTMLDivElement> = React.useRef({} as HTMLDivElement)
    const markersGroup: MutableRefObject<TomTomMarkersLayer> = React.useRef({} as TomTomMarkersLayer)
    const routesLayer: MutableRefObject<Layer|undefined> = React.useRef()


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
        }) as Map

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

    //routes
    React.useEffect(() => {
        if (!props.tomtom){
            return
        }
        if (routesLayer.current) {
            routesLayer.current.removeFrom(map.current)
        }
        
        if (!props.routes) {
            return
        }

        const colors = ['red', 'blue', 'yellow']
        type indexableObject = {[index: string]: string}
        
        const routesColors: indexableObject = props.routes.features.reduce((acc: indexableObject, currentVal, index) => {
            acc[currentVal.id!] = colors[index]
            return acc
        }, {})

        routesLayer.current = props.tomtom.L.geoJson(props.routes, {style: (feature) => {
            if (!feature || !feature.id) {
                throw new Error('no route here')
            }
            return {color: routesColors[feature.id]}
        }})
        routesLayer.current.addTo(map.current)
    }, [props.tomtom, props.routes])

    return <div id='map' key='tmap' ref={mapEl}>
        {props.panel}
    </div>
}

export default TomTomMap