import Map from './Map'
import React from 'react'
import ReactDOM from 'react-dom'

jest.mock('../tom-tom-map/initTomTom')

describe('Map', () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Map />, div);
        expect(div.querySelector(`#popup`).id).toEqual('popup')
    })
})