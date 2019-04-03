import * as Leaflet from 'leaflet'

interface TomTomElementApi {
    addTo: (domElement: Map) => TomTomElementApi,
    addContent: (domElement: HTMLElement|null) => TomTomElementApi
}

interface TomTomPoint {
    position: {
        lat: number,
        lon: number
    }
}

interface TomTomSearchApi extends PromiseLike<TomTomPoint> {
    query: (query: string) => TomTomSearchApi,
    bestResult: (isBase: boolean) => TomTomSearchApi,
    go: () => TomTomSearchApi
}

interface TomTomTestState {
    map?: {
        id: string,
        options?: object,
        fitBounds: function
    },
    markers: {
        layers: Array<Leaflet.PointTuple>
        private __layers: Array<Leaflet.PointTuple>,
        parent?: object,
    },
    panel?: {
        options?: object,
        parent?: object,
        content?: object
    }
}
interface TomTomMapOptions extends Leaflet.MapOptions {
    source: string,
    basePath: string
}
interface TomTomMarkersLayer {
    addTo: (domElement: Map) => TomTomMarkersLayer,
    clearLayers: () => TomTomMarkersLayer,
    setMarkersData: (pts: Array<Leaflet.PointTuple>) => TomTomMarkersLayer,
    addMarkers: () => TomTomMarkersLayer,
    getBounds: () => any
}

interface TomTom {
    L: {
        map: (id: string, options: TomTomMapOptions) => Leaflet.Map | object,
        TomTomMarkersLayer: new () => TomTomMarkersLayer
    },
    key: (key: string) => void,
    controlPanel: (options: object) => TomTomElementApi,
    fuzzySearch: () => TomTomSearchApi,
    getTestState: () => TomTomTestState, //mine - for test only
    waitForChange: () => Promise //mine - for test only 
}

declare global {
    interface Window {
        tomtom: TomTom
    }
}

