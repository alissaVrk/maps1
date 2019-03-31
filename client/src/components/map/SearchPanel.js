import React from 'react'
import PropTypes from 'prop-types';

export default function SearchPanel(props){

    const fromInput = React.useRef(null)
    const toInput = React.useRef(null)

    function onSubmit(){
        const fromQuery = fromInput.current.value
        const toQuery = toInput.current.value
        props.onSubmitSearch(fromQuery, toQuery)
    }

    return <form id={props.id} onSubmit={onSubmit}>
                <label>From: <input type='text' ref={fromInput}></input></label>
                <label>To: <input type='text' ref={toInput}></input></label>
                <input type='submit' value='Get Routes'></input>
            </form>
}

SearchPanel.propTypes = {
    onSubmitSearch: PropTypes.func.isRequired
}