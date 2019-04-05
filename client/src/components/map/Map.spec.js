import Map from './Map'
import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library';
import initTomTom from '../tom-tom-map/initTomTom'
import { getFromInput, getToInput, getSubmitSearch, getSearchForRoutes } from '../testUtils'

jest.mock('../tom-tom-map/initTomTom')
jest.mock('../hooks')

describe('Map', () => {

    let tomtom
    beforeEach(async () => {
        tomtom = await initTomTom();
    })

    afterEach(cleanup)

    it('renders without crashing', () => {
        const { container } = render(<Map />);
        expect(container.querySelector(`#popup`).id).toEqual('popup')
    })

    function searchPoints(renderResult, from, to) {
        const fromInput = getFromInput(renderResult)
        const toInput = getToInput(renderResult)
        const submitBtn = getSubmitSearch(renderResult)

        fireEvent.change(fromInput, { target: { value: from.join(' ') } })
        fireEvent.change(toInput, { target: { value: to.join(' ') } })
        fireEvent.click(submitBtn)
    }
    describe('on search', () => {

        it('should add from and to markers', async () => {
            const renderResult = render(<Map tomtom={tomtom} />);

            searchPoints(renderResult, [1, 2], [5, 7])
            await tomtom.waitForChange()

            expect(tomtom.getTestState().markers.layers).toEqual([[1, 2], [5, 7]])
        })

        it('should remove both markers', async () => {
            const renderResult = render(<Map tomtom={tomtom} />);

            searchPoints(renderResult, [1, 2], [5, 7])
            await tomtom.waitForChange()

            searchPoints(renderResult, [], [])
            await tomtom.waitForChange()

            expect(tomtom.getTestState().markers.layers).toEqual([])
        })
    })

    describe('on route search', () => {

        it('should add routes', async () => {
            const renderResult = render(<Map tomtom={tomtom} />);

            searchPoints(renderResult, [1, 2], [5, 7])
            const routesBtn = getSearchForRoutes(renderResult)
            await tomtom.waitForChange()

            fireEvent.click(routesBtn)
            await tomtom.waitForChange()

            const routes = tomtom.getTestState().routes
            expect(routes.layers.length).toEqual(3)
            const pts = [[1, 2], [5, 7]]
            expect(routes.layers.map(l => l.geometry)).toEqual([pts, pts, pts])
            expect(typeof routes.layers.map(l => l.color)[0]).toBe('string')
        })

        it('should replace routes', async () => {
            const renderResult = render(<Map tomtom={tomtom} />);

            searchPoints(renderResult, [1, 2], [5, 7])
            const routesBtn = getSearchForRoutes(renderResult)
            await tomtom.waitForChange()

            fireEvent.click(routesBtn)
            await tomtom.waitForChange()

            const pts = [[5, 6], [8, 9]]
            searchPoints(renderResult, pts[0], pts[1])
            await tomtom.waitForChange()

            fireEvent.click(routesBtn)
            await tomtom.waitForChange()

            const routes = tomtom.getTestState().routes
            expect(routes.layers.length).toEqual(3)
            expect(routes.layers.map(l => l.geometry)).toEqual([pts, pts, pts])
        })

        it('should not search for routes if there is missing from/to', async () => {
            const renderResult = render(<Map tomtom={tomtom} />);

            searchPoints(renderResult, [1, 2], [])
            const routesBtn = getSearchForRoutes(renderResult)
            await tomtom.waitForChange()

            fireEvent.click(routesBtn)
            await tomtom.waitForChange()

            const routes = tomtom.getTestState().routes
            expect(routes).toBeUndefined()
        })

        it('should clear routes if a new search is commited', async () => {
            const renderResult = render(<Map tomtom={tomtom} />);

            searchPoints(renderResult, [1, 2], [5, 7])
            const routesBtn = getSearchForRoutes(renderResult)
            await tomtom.waitForChange()

            fireEvent.click(routesBtn)
            await tomtom.waitForChange()

            const pts = [[5, 6], [8, 9]]
            searchPoints(renderResult, pts[0], pts[1])
            await tomtom.waitForChange()

            const routes = tomtom.getTestState().routes
            expect(routes).toBeUndefined()
        })
    })
})