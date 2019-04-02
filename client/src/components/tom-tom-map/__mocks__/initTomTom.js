import { act } from "react-testing-library";
import debounce from 'lodash/debounce' 


function getApi(){
    const state = {}
    let cbs = []
    const stateChanged = debounce(() => {
        cbs.forEach(cb => cb())
        cbs = []
    }, 2)

    return {
        L: {
            map: function(id, options) {
                state.map = {
                    id: 'map',
                    options,
                    fitBounds: function(){

                    }
                }
                stateChanged()
                return state.map
            },
            TomTomMarkersLayer: class {
                constructor() {
                    state.markers = {layers: [], __layers: []}
                }
                addTo(domElement) {
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
                setMarkersData(pts){
                    state.markers.__layers = state.markers.__layers.concat(pts) 
                    stateChanged()
                    return this
                }
                addMarkers(){
                    state.markers.layers = state.markers.__layers
                    stateChanged()
                    return this
                }
                getBounds(){ }
            }
        },
    
        controlPanel: function(options) {
            state.panel = {
                options
            }
            const panelApi = {
                addTo: function(domElement){
                    state.panel.parent = {
                        el: domElement //what we returned as map
                    }
                    stateChanged()
                    return panelApi
                },
                addContent: function(domElement){
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
            let query = null
            let isFirstResultOnly = false
            let res = null
            const search = {
                query: q => {
                    query = q
                    return search
                },
                bestResult: (isBase) => {
                    isFirstResultOnly = isBase
                    return search
                },
                go: () => {
                    const baseResult = query.split(' ').map(str => parseFloat(str))
                    if (isFirstResultOnly) {
                        res = {position: {lat: baseResult[0], lon: baseResult[1]}}
                    } else {
                        res = [baseResult]
                        res.push({position: {lat: baseResult[0] + 10, lon: baseResult[1] + 10}})
                    }
                    
                    return search
                },
                then: fn => fn(res)
            }

            return search
        },

        getTestState: function () {
            return state
        },

        waitForChange: function(cb) {
            return new Promise(resolve => {cbs.push(resolve)})
        }
    }
}

export default function() {
    return {
        then: jest.fn(cb => act(() => {cb(getApi())}))
    }
}