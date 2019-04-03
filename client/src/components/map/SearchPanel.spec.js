import SearchPanel from './SearchPanel'
import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library';
import initTomTom from '../tom-tom-map/initTomTom'
import {getFromInput, getToInput, getSubmitSearch} from '../testUtils'

jest.mock('../tom-tom-map/initTomTom')
jest.mock('../hooks')

describe('SearchPanel', () => {
    let tomtom
    beforeEach(async () => {
        tomtom = await initTomTom();
    })

    afterEach(cleanup)

    it('renders without crashing', () => {
        render(<SearchPanel onSubmitSearch={() => {}} tomtom={tomtom}/>)
    })

    it('should call the callback with the pts on map', done => {
        const searchFn = jest.fn().mockImplementation((from, to) => {
            expect(from).toEqual([1, 2])
            expect(to).toEqual([5, 7])
            done()
        })
        
        const renderResult = render(<SearchPanel onSubmitSearch={searchFn} tomtom={tomtom}/>)
        const fromInput = getFromInput(renderResult)
        const toInput = getToInput(renderResult)
        const submitBtn = getSubmitSearch(renderResult)

        fireEvent.change(fromInput, {target: {value: '1 2'}})
        fireEvent.change(toInput, {target: {value: '5 7'}})

        expect(searchFn).not.toHaveBeenCalled()

        fireEvent.click(submitBtn)
    })

    it('should call the callback with null if no query passed', done => {
        const searchFn = jest.fn().mockImplementation((from, to) => {
            expect(from).toEqual([1, 2])
            expect(to).toEqual(undefined)
            done()
        })
        
        const renderResult = render(<SearchPanel onSubmitSearch={searchFn} tomtom={tomtom}/>)
        const fromInput = getFromInput(renderResult)
        const submitBtn = getSubmitSearch(renderResult)

        fireEvent.change(fromInput, {target: {value: '1 2'}})

        fireEvent.click(submitBtn)
    })
})