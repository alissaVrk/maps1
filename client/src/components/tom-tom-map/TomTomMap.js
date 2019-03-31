import React from 'react'
import initTomTom from './initTomTom'

function TomTomMap(props) {

    const mapEl = React.useRef(null)

    React.useEffect(() => {
        initTomTom().then(tomtom => {
            if (props.setTomTom) {
                props.setTomTom(tomtom)
            }

            const map = tomtom.L.map('map', {
                source: 'vector',
                center: [37.769167, -122.478468],
                basePath: '/sdk',
                zoom: 15
            })

            if (props.panel) {
                tomtom.controlPanel({
                    position: 'topright',
                    collapsed: false,
                    close: null
                })
                    .addTo(map)
                    .addContent(mapEl.current.querySelector(`#${props.panelId}`))
            }
        })
    }, [])

    return <div id='map' ref={mapEl}>
        {props.panel}
    </div>

}

export default TomTomMap