import { act } from "react-testing-library";
import debounce from 'lodash/debounce' 
import {TomTom, TomTomTestState, TomTomPoint} from '../tomtom'
import { MapOptions, PointTuple } from "leaflet";

function getApi(): TomTom{
    const state: TomTomTestState = {
        markers: {layers: [], __layers: []}
    }
    let cbs: Array<() => void> = []
    const stateChanged = debounce(() => {
        cbs.forEach(cb => cb())
        cbs = []
    }, 2)

    return {
        key: (key: string) => {},
        L: {
            map: function(id: string, options: MapOptions) {
                state.map = {
                    id,
                    options,
                    fitBounds: function(markers: any){
                        if(markers && markers.length === 0) {
                            throw new Error('markers not valid')
                        }
                    }
                }
                stateChanged()
                return state.map
            },
            TomTomMarkersLayer: class {
                addTo(domElement: any) {
                    state.markers.parent = domElement
                    stateChanged()
                    return this
                }
                clearLayers(){
                    state.markers.layers = []
                    state.markers.__layers = []
                    stateChanged()
                    return this
                }
                setMarkersData(pts: Array<PointTuple>){
                    state.markers.__layers = state.markers.__layers.concat(pts) 
                    stateChanged()
                    return this
                }
                addMarkers(){
                    state.markers.layers = state.markers.__layers
                    stateChanged()
                    return this
                }
                getBounds(){
                    return state.markers.layers.map(l => 'bound')
                 }
            }
        },
    
        controlPanel: function(options: any) {
            state.panel = {
                options
            }
            const panelApi = {
                addTo: function(domElement: any){
                    state.panel!.parent = {
                        el: domElement //what we returned as map
                    }
                    stateChanged()
                    return panelApi
                },
                addContent: function(domElement: any){
                    state.panel!.content = {
                        el: domElement
                    }
                    stateChanged()
                    return panelApi
                }
            }
            return panelApi
        },

        fuzzySearch: function() {
            let query: string
            let isFirstResultOnly = false
            let res: TomTomPoint | Array<TomTomPoint>
            const search = {
                query: (q: string) => {
                    query = q
                    return search
                },
                bestResult: (isBase: boolean) => {
                    isFirstResultOnly = isBase
                    return search
                },
                go: () => {
                    const baseResult = query.split(' ').map(str => parseFloat(str))
                    if (isFirstResultOnly) {
                        res = {position: {lat: baseResult[0], lon: baseResult[1]}}
                    } else {
                        res = [{position: {lat: baseResult[0], lon: baseResult[1]}}]
                        res.push({position: {lat: baseResult[0] + 10, lon: baseResult[1] + 10}})
                    }
                    
                    return search
                },
                then: (fn: (value: TomTomPoint | Array<TomTomPoint>) => any) => fn(res)
            }

            return search
        },

        getTestState: function () {
            return state
        },

        waitForChange: function() {
            return new Promise(resolve => {cbs.push(resolve)})
        }
    }
}

export default function(){
    return {
        then: jest.fn(cb => act(() => {cb(getApi())}))
    }
}