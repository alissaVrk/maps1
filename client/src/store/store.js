import {searchForPoint} from './tomtom/search'

const store = {
    startPoint: [],
    endPoint: []
}

function searchRoutes(startQuery, endQuery) {
    Promise.all([
        searchForPoint(startQuery),
        searchForPoint(endQuery)
    ]).then(([startPt, endPt]) => {
        store.startPoint = startPt
        store.endPoint = endPt
        //set state to root?

        return 
    })
    
}


export default {
    store,
    actions: {
        setStart: point => {store.startPoint = point},
        setEnd: point => {store.endPoint = point} 
    }
}