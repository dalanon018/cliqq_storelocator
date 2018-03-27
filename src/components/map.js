import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Map extends Component {
    componentDidUpdate(prevProps, prevState) {
        if( prevProps.google !== this.props.google){
            this.loadMap();
        }
    }

    componentDidMount() {
        this.loadMap();
    }

    loadMap(){
        // load the google map
        if(this.props && this.props.google){
            //google is available
            const { google } = this.props; //get google prop from this.props and assign to variable google
            const maps = google.maps

            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);

            let zoom = 14;
            let defaultLng = 121.015;
            let defaultLat = 14.57;
            const center = new maps.LatLng(defaultLat, defaultLng);
            const mapConfig = Object.assign({}, {
                center: center,
                zoom: zoom
            })

            this.map = new maps.Map(node, mapConfig)
        }
    }

    render(){
        const style = {
            width: '65vw',
            height: '75vh'
        }

        return (
            <div ref='map' style={style}>
                Loading map...
            </div>
        )
    }
};
