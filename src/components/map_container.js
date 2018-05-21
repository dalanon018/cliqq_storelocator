import React, { Component } from 'react';
import Map from '../containers/map';
import { GoogleApiWrapper } from 'google-maps-react'
const GMAPS_API_KEY='AIzaSyDk46zyo3PyWCtpQkSUpTAJHbZoiQikF9A';

export class MapContainer extends Component {
    static defautProps = {
        center: { lng: 121.015,
                  lat: 14.57},
        zoom: 12
    }

    constructor(props){
        super(props);
        this.state = {
            markers: [],
        }
    }

    render() {
        return (
          <Map google={this.props.google} />
        )
    }
}

export default GoogleApiWrapper({
    apiKey: GMAPS_API_KEY,
    libraries: ['places', 'geometry']
})(MapContainer)

// export default (props) => {
//
//     return(
//         <div >
//             Map Component
//             <Map
//                 containerElement ={ <div style={{height: `100vh` , width: `inherit` }} /> }
//                 mapElement = { <div style={{ height: `100%` }} /> }
//             />
//         </div>
//
//     );
//
// };
