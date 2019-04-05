import { act } from "react-testing-library";
import debounce from 'lodash/debounce'
import assign from 'lodash/assign' 
import range from 'lodash/range'
import { PointTuple } from "leaflet";

function getApi(){
    let state: any = {
        markers: {layers: [], __layers: []}
    }
    let cbs: Array<() => void> = []
    const stateChanged = debounce(() => {
        cbs.forEach(cb => cb())
        cbs = []
    })

    return {
        key: (key: string) => {},
        L: {
            map: function(id: string, options: any) {
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
                    return state.markers.layers.map(() => 'bound')
                 }
            },
            geoJson: (json: any, options: any) => {
                state.routes = {}
                
                const GeoJSON = {
                    addTo(element: any) {
                        state.routes.parent = element
                        if (options && options.style) {
                            state.routes.layers = json.features.map((feature: any) => assign(options.style(feature), feature))
                        }

                        stateChanged()
                        return GeoJSON
                    },
                    removeFrom(element: any) {
                        if (state.routes && element.id === state.routes.parent.id) {
                            delete state.routes
                        }
                    }
                }
                return GeoJSON
            
            }
        },
    
        controlPanel: function(options: any) {
            state.panel = {
                options
            }
            const panelApi = {
                addTo: function(domElement: any){
                    state.panel.parent = {
                        el: domElement //what we returned as map
                    }
                    stateChanged()
                    return panelApi
                },
                addContent: function(domElement: any){
                    state.panel.content = {
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
            let res: any
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
                then: (fn: any) => fn(res)
            }

            return search
        },

        routing: () => {
            let res = {}
            let pts: any
            let alts = 0
            const routingApi = {
                locations: (_pts: any) => {
                    pts = _pts 
                    return routingApi 
                },
                maxAlternatives: (num: number) => {
                    alts = num
                    return routingApi
                },
                go: () => {
                    res = {
                        features: range(alts + 1).map(index => ({
                            geometry: pts
                        }))
                    } 
                    return routingApi 
                },
                then: (fn: any) => Promise.resolve().then(() => fn(res))
            }
            return routingApi
        },

        getTestState: function () {
            return state
        },

        waitForChange: function() {
            return new Promise(resolve => {
                cbs.push(resolve)
                setTimeout(resolve, 10)
            })
        }
    }
}

export default function(){
    return {
        then: jest.fn(cb => act(() => {cb(getApi())}))
    }
}