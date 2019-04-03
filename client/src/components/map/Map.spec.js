import Map from './Map'
import React from 'react'
import { render, cleanup, fireEvent} from 'react-testing-library';
import initTomTom from '../tom-tom-map/initTomTom'
import {getFromInput, getToInput, getSubmitSearch} from '../testUtils'

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
            const renderResult = render(<Map tomtom={tomtom}/>);

            const fromInput = getFromInput(renderResult)
            const toInput = getToInput(renderResult)
            const submitBtn = getSubmitSearch(renderResult)

            fireEvent.change(fromInput, {target: {value: '1 2'}})
            fireEvent.change(toInput, {target: {value: '5 7'}})
            fireEvent.click(submitBtn)

            await tomtom.waitForChange()

            expect(tomtom.getTestState().markers.layers).toEqual([[1, 2], [5, 7]])
        })
        
        it('should remove both markers', async () => {
            const renderResult = render(<Map tomtom={tomtom}/>);

            const fromInput = getFromInput(renderResult)
            const toInput = getToInput(renderResult)
            const submitBtn = getSubmitSearch(renderResult)

            fireEvent.change(fromInput, {target: {value: '1 2'}})
            fireEvent.change(toInput, {target: {value: '5 7'}})
            fireEvent.click(submitBtn)

            await tomtom.waitForChange()

            fireEvent.change(fromInput, {target: {value: ''}})
            fireEvent.change(toInput, {target: {value: ''}})
            fireEvent.click(submitBtn)

            await tomtom.waitForChange()

            expect(tomtom.getTestState().markers.layers).toEqual([])
        })
    })
})