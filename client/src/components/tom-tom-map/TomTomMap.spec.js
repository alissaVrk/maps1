import TomTomMap from './TomTomMap'
import React from 'react'
import { render } from 'react-testing-library';
import defer from 'lodash/defer'
import initTomTom from './initTomTom'

jest.mock('./initTomTom')
jest.mock('../hooks')

describe('TomTomMap', () => {
    function renderMap(props){
        return new Promise(resolve => {
            let rendered

            const setTomTom = tomtom => {
                const state = tomtom.getTestState()
                
                defer(() => {
                    rendered.rerender(<TomTomMap tomtom={tomtom} setTomTom={() => {}} {...props}/>) //this is not good, it calls the onMount again
                    state.parent = rendered.container

                    resolve(state)
                })
            }

            rendered = render(<TomTomMap setTomTom={setTomTom} {...props}/>)
        })
    }
    it('renders without crashing', async () => {
        /** @type TomTomTestState  */
        const tState = await renderMap()
        expect(tState.map.id).toEqual('map')
        expect(tState.panel).toBeUndefined()
    })

    it('should render with tomtom given in props', async () => {
        const tomtom = await initTomTom()
        render(<TomTomMap setTomTom={() => {}} tomtom={tomtom}/>)
        expect(tomtom.getTestState().map.id).toEqual('map')
    })

    it('should render passed panel on map', async () => {
        const panelId = 'myTestPanel'
        const panel = <div id={panelId}></div>
        const tState = await renderMap({panel, panelId})
        expect(tState.panel.parent.el.id).toEqual('map')
        expect(tState.panel.content.el.id).toEqual(panelId)
    })

    it('should render markers', async () => {
        const tState = await renderMap({markers: [[2, 3], [6, 6]]})
        
        expect(tState.markers.layers).toEqual([[2, 3], [6, 6]])
        expect(tState.markers.parent.id).toEqual('map')
    })
   
})