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