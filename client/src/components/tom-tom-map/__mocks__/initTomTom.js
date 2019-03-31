function getApi(){
    const state = {}

    return {
        L: {
            map: function(id, options) {
                state.map = {
                    id: 'map',
                    options
                }
                return state.map
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
                    return panelApi
                },
                addContent: function(domElement){
                    state.panel.content = {
                        el: domElement
                    }
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
        }
    }
}

export default function() {
    return {
        then: fn => fn(getApi())
    }
}