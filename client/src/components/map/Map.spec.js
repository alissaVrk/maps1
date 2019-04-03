import Map from './Map'
import React from 'react'
import { render, cleanup, fireEvent, act } from 'react-testing-library';
import initTomTom from '../tom-tom-map/initTomTom'

jest.mock('../tom-tom-map/initTomTom')
jest.mock('../hooks')

describe('Map', () => {

    let tomtom
    beforeEach(async () => {
        tomtom = await initTomTom();
    })

    afterEach(cleanup)

    it('renders without crashing', () => {
        const {container} = render(<Map />);
        expect(container.querySelector(`#popup`).id).toEqual('popup')
    })

    describe('on search', () => {

        it('should add from and to markers', async () => {
            const {getByLabelText, getByDisplayValue} = render(<Map tomtom={tomtom}/>);

            const fromInput = getByLabelText('from', {exact: false})
            const toInput = getByLabelText('to', {exact: false})
            const submitBtn = getByDisplayValue('routes', {exact: false})

            fireEvent.change(fromInput, {target: {value: '1 2'}})
            fireEvent.change(toInput, {target: {value: '5 7'}})
            fireEvent.click(submitBtn)

            await tomtom.waitForChange()

            expect(tomtom.getTestState().markers.layers).toEqual([[1, 2], [5, 7]])
        })
        
        it('should remove both markers', () => {

        })
    })
})