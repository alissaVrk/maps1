const api =  {
    L: {
        map: function(id, options) {
            return document.getElementById(id)
        }
    },

    controlPanel: function(options) {
        const panelApi = {
            addTo: function(domElement){
                return panelApi
            },
            addContent: function(domElement){
                return panelApi
            }
        }
        return panelApi
    }
}

export default function() {
    return {
        then: fn => fn(api)
    }
}