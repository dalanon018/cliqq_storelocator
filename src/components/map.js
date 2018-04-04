import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import defaultStoreIcon from '../store_locator_marker.png';
class Map extends Component {

    state = {
        markers: []
    }


    componentDidUpdate(prevProps, prevState) {
        if( prevProps.google !== this.props.google){
            this.loadMap();
        }
        if(prevProps.storeList !== this.props.storeList){
            this.updateMap();
        }
    }

    componentDidMount() {
        this.loadMap();
    }

    updateMap(){
        this.clearMarkers();
        if(this.props && this.props.google){
            this.generateMarkers();
        }
    }

    generateMarkers(){
        const {google} = this.props;
        const currentMarkers = []
        this.props.storeList.map( storeData => {
            storeData.map( location => {
                console.log("Generating marker for ", location);
                setTimeout(() =>{
                    const marker = new google.maps.Marker({
                        position: { lat: parseFloat(location.LATITUDE), lng: parseFloat(location.LONGITUDE) },
                        map: this.map,
                        title: location.STORE_NAME,
                        icon: defaultStoreIcon,
                        animation: google.maps.Animation.DROP
                    });
                    currentMarkers.push(marker);
                }, 1500)


            });
        });
        this.setState({ markers: currentMarkers });
    }

    clearMarkers(){
        console.log("clearing markers: ", this.state.markers);
        this.state.markers.map( marker => {
            marker.setMap(null);
        })
        this.setState({ markers: []});
    }

    loadMap(){
        // load the google map
        this.clearMarkers();
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
                zoom: zoom,
                gestureHandling: 'cooperative'
            })

            this.map = new maps.Map(node, mapConfig)

            //** LOAD MAP MARKERS **//
            this.generateMarkers(google);
        }
    }

    render(){
        const style = {
            width: '65vw',
            height: '87vh'
        }

        return (
            <div ref='map' style={style}>
                Loading map...
            </div>
        )
    }
};

function mapStateToProps({ storeList }) {
    console.log("mapStateToProps for MAP component: ", storeList);
    return { storeList } //es6 magic storeList:storeList
}

export default connect(mapStateToProps)(Map)
