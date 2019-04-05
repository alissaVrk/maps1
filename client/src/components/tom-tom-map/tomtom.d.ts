import { FeatureCollection, Feature, GeoJson, LineString, GeoJsonProperties } from 'geojson';
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

interface TomTomRoute extends GeoJSON {
    
}
interface TomTomSegmentSummery {
    lengthInMeters: number,
    travelTimeInSeconds: number,
    trafficDelayInSeconds: number,
    departureTime: Date,
    arrivalTime: Date
}
interface TomTomRouteProperties extends GeoJsonProperties {
    summary: TomTomSegmentSummery,
    sections: Array<{
        startPointIndex: number, 
        endPointIndex: number,
        sectionType: string, //'TRAVEL_MODE'
        travelMode: string //basically an enum 
    }>,
    segmentSummary: TomTomSegmentSummery[]
}


interface TomTomRoutingApi extends PromiseLike<FeatureCollection<LineString, TomTomRouteProperties>> {
    locations: (pts: Array<Leaflet.PointTuple>) => TomTomRoutingApi
    maxAlternatives: (num: number) => TomTomRoutingApi
    go: () => TomTomRoutingApi
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
        map: (id: string, options: TomTomMapOptions) => Leaflet.Map,
        TomTomMarkersLayer: new () => TomTomMarkersLayer,
        geoJson: (json: FeatureCollection, options?: Leaflet.GeoJSONOptions<Feature>) => Leaflet.Layer
    },
    key: (key: string) => void,
    controlPanel: (options: object) => TomTomElementApi,
    fuzzySearch: () => TomTomSearchApi,
    routing: () => TomTomRoutingApi,
    getTestState: () => TomTomTestState, //mine - for test only
    waitForChange: () => Promise //mine - for test only 
}

declare global {
    interface Window {
        tomtom: TomTom
    }
}

