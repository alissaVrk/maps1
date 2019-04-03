
import { TomTom } from './tomtom'

export default function () : PromiseLike<TomTom> {
        const script = document.createElement('script');
        script.src = process.env.PUBLIC_URL + '/sdk/tomtom.min.js';
        document.body.appendChild(script);
        script.async = true;

        return new Promise((resolve: (value: TomTom) => void) => {
            script.onload = () => {
                resolve(window.tomtom)
            }
        })
            .then((tomtom) => {
                tomtom.key('y1DwPQ2fIfb58vST3GnjFugR2ttyEiGS')
                return tomtom
            })
    }