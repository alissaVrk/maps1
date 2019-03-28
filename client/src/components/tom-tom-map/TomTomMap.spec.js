import TomTomMap from './TomTomMap'
import React from 'react'
import ReactDOM from 'react-dom'

jest.mock('./initTomTom')

describe('TomTomMap', () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<TomTomMap />, div);
        console.log(div.outerHTML)
        
    })
})