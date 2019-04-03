import React from 'react'
import {searchForPoint} from '../../store/tomtom/search'
import {wrapAsync} from '../hooks'
import { TomTom } from '../tom-tom-map/tomtom';
import { PointTuple } from 'leaflet';

interface SearchPanelProps {
    onSubmitSearch(fromPt?: PointTuple, toPt?: PointTuple): void,
    tomtom: TomTom,
    id: string
}

export default function SearchPanel(props: SearchPanelProps){

    const fromInput: React.MutableRefObject<HTMLInputElement> = React.useRef({} as HTMLInputElement)
    const toInput: React.MutableRefObject<HTMLInputElement> = React.useRef({} as HTMLInputElement)

    function onSubmit(event: React.FormEvent){
        const fromQuery: string = fromInput.current.value
        const toQuery: string= toInput.current.value
        Promise.all([
            searchForPoint(props.tomtom, fromQuery),
            searchForPoint(props.tomtom, toQuery)
        ])
        .then(([fromPt, toPt]) => wrapAsync(() => props.onSubmitSearch(fromPt, toPt)))
        
        event.preventDefault()
    }

    return <form id={props.id} onSubmit={onSubmit} key='panel'>
                <label>From: <input type='text' ref={fromInput} key='from'></input></label>
                <label>To: <input type='text' ref={toInput} key='to'></input></label>
                <input type='submit' value='Get Routes' key='submitSearch'></input>
            </form>
}