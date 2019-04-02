import React from 'react'
import PropTypes from 'prop-types';
import {searchForPoint} from '../../store/tomtom/search'
import {wrapAsync} from '../hooks'

export default function SearchPanel(props){

    const fromInput = React.useRef(null)
    const toInput = React.useRef(null)

    function onSubmit(event){
        const fromQuery = fromInput.current.value
        const toQuery = toInput.current.value
        Promise.all([
            searchForPoint(props.tomtom, fromQuery),
            searchForPoint(props.tomtom, toQuery)
        ])
        .then(([fromPt, toPt]) => wrapAsync(() => props.onSubmitSearch(fromPt, toPt)))
        
        event.preventDefault()
    }

    return <form id={props.id} onSubmit={onSubmit} key='panel'>
                <label>From: <input type='text' ref={fromInput} key='from'></input></label>
                <label>To: <input type='text' ref={toInput} kry='to'></input></label>
                <input type='submit' value='Get Routes' key='submitSearch'></input>
            </form>
}

SearchPanel.propTypes = {
    onSubmitSearch: PropTypes.func.isRequired,
    tomtom: PropTypes.object.isRequired
}