import React from 'react'

class TomTomMap extends React.Component {
    render() {
        return <div id='map'></div>
    }

    componentDidMount() {
        const script = document.createElement('script');
        script.src = process.env.PUBLIC_URL + '/sdk/tomtom.min.js';
        document.body.appendChild(script);
        script.async = true;

        script.onload = () => {
            window.tomtom.L.map('map', {
                source: 'vector',
                key: 'y1DwPQ2fIfb58vST3GnjFugR2ttyEiGS',
                center: [37.769167, -122.478468],
                basePath: '/sdk',
                zoom: 15
            })
        }
    }
}

export default TomTomMap