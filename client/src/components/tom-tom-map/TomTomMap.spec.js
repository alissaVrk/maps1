import TomTomMap from './TomTomMap'
import React from 'react'
import ReactDOM from 'react-dom'

jest.mock('./initTomTom')

describe('TomTomMap', () => {
    function renderMap(parent, props){
        return new Promise(resolve => {
            const setTomTom = tomtom => {
                resolve(tomtom.getTestState())
            }
            ReactDOM.render(<TomTomMap setTomTom={setTomTom} {...props}/>, parent)
        })
    }
    it('renders without crashing', async () => {
        const div = document.createElement('div');
        const tState = await renderMap(div)
        expect(tState.map.id).toEqual('map')
        expect(tState.panel).toBeUndefined()
    })

    it('should render passed panel on map', async () => {
        const div = document.createElement('div');
        const panelId = 'myTestPanel'
        const panel = <div id={panelId}></div>
        const tState = await renderMap(div, {panel, panelId})
        expect(tState.panel.parent.el.id).toEqual('map')
        expect(tState.panel.content.el.id).toEqual(panelId)
    })
})