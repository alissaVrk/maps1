import React from 'react'
import initTomTom from './initTomTom'

class TomTomMap extends React.Component {
    constructor(props) {
        super(props)
        this.fromInput = React.createRef()
        this.toInput = React.createRef()
        this.searchForRoute = this.searchForRoute.bind(this)
    }

    searchForRoute() {
        const fromQuery = this.fromInput.current.value
        const toQuery = this.toInput.current.value
        const fromPoint = []
        this.props.actions.setFrom()
        this.props.actions.findRoutes(fromQuery, toQuery)
    }

    render() {
        return <div id='map'>
            <form id='popup' onSubmit={this.searchForRoute}>
                <label>From: <input type='text' ref={this.fromInput}></input></label>
                <label>To: <input type='text' ref={this.toInput}></input></label>
                <input type='submit' value='Get Routes'></input>
            </form>
        </div>
    }

    componentDidMount() {
        initTomTom().then(tomtom => {
            const map = tomtom.L.map('map', {
                source: 'vector',
                center: [37.769167, -122.478468],
                basePath: '/sdk',
                zoom: 15
            })

            tomtom.controlPanel({
                position: 'topright',
                collapsed: false,
                close: null
            })
                .addTo(map)
                .addContent(document.getElementById('popup'))
        })
        
    }
}

export default TomTomMap