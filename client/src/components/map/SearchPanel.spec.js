import SearchPanel from './SearchPanel'
import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library';
import initTomTom from '../tom-tom-map/initTomTom'

jest.mock('../tom-tom-map/initTomTom')


describe('SearchPanel', () => {
    let tomtom
    beforeEach(() => {
        initTomTom().then(_tomtom => {tomtom = _tomtom})
    })

    afterEach(cleanup)

    it('renders without crashing', () => {
        const {container} = render(<SearchPanel onSubmitSearch={() => {}}/>)
        console.log(container.outerHTML)
    })

    it('should call the callback with the pts on map', done => {
        const searchFn = jest.fn().mockImplementation((from, to) => {
            expect(from).toEqual([1, 2])
            expect(to).toEqual([5, 7])
            done()
        })
        
        const {getByLabelText, getByDisplayValue} = render(<SearchPanel onSubmitSearch={searchFn} tomtom={tomtom}/>)
        const fromInput = getByLabelText('from', {exact: false})
        const toInput = getByLabelText('to', {exact: false})
        const submitBtn = getByDisplayValue('routes', {exact: false})

        fireEvent.change(fromInput, {target: {value: '1 2'}})
        fireEvent.change(toInput, {target: {value: '5 7'}})

        expect(searchFn).not.toHaveBeenCalled()

        fireEvent.click(submitBtn)
    })

    it('should call the callback with null if no query passed', done => {
        const searchFn = jest.fn().mockImplementation((from, to) => {
            expect(from).toEqual([1, 2])
            expect(to).toEqual(null)
            done()
        })
        
        const {getByLabelText, getByDisplayValue} = render(<SearchPanel onSubmitSearch={searchFn} tomtom={tomtom}/>)
        const fromInput = getByLabelText('from', {exact: false})
        const submitBtn = getByDisplayValue('routes', {exact: false})

        fireEvent.change(fromInput, {target: {value: '1 2'}})

        fireEvent.click(submitBtn)
    })
})