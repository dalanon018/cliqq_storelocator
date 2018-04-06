import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import defaultStoreIcon from '../store_locator_marker.png';
class Map extends Component {

    state = {
        markers: [],
        defaultZoom: 14
    }


    componentDidUpdate(prevProps, prevState) {
        if( prevProps.google !== this.props.google){
            this.loadMap();
        }
        if(prevProps.storeList !== this.props.storeList){
            this.updateMap();
        }
        if(prevProps.zoomToStore !== this.props.zoomToStore){
            this.centerOnMarker();
        }
    }

    componentDidMount() {
        this.loadMap();
    }

    updateMap(){
        this.map.setZoom(this.state.defaultZoom)
        this.clearMarkers();
        if(this.props && this.props.google){
            this.generateMarkers();
        }
    }

    centerOnMarker(){
        console.log("centering on selected marker: ", this.props.zoomToStore)
        if(this.props.zoomToStore){

            console.log("current markers are: ", this.state.markers);
            const storeId = this.props.zoomToStore["0"]
            const selectedMarker = this.state.markers.filter(marker => {
                if(marker.get("store_id") === storeId){
                    console.log("marker found: ", marker)
                }
                return marker.get("store_id") === storeId
            })
            if(selectedMarker.length){
                console.log("selectedMarker position: ", selectedMarker["0"].getPosition())
                this.map.panTo(selectedMarker["0"].getPosition());
                this.map.setZoom(19);
                console.log("selectedMarker is: ", selectedMarker)
            } else {
                console.log("no zoomToStore");
            }
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
                        animation: google.maps.Animation.DROP,
                        store_id: location.STORE_NUM
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

            let defaultLng = 121.015;
            let defaultLat = 14.57;
            const center = new maps.LatLng(defaultLat, defaultLng);
            const mapConfig = Object.assign({}, {
                center: center,
                zoom: this.state.defaultZoom,
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

function mapStateToProps({ storeList, zoomToStore }) {
    console.log("mapStateToProps for MAP component: ", storeList);
    console.log("mapStateToProps for MAP component - zoomToStore: ", zoomToStore);
    return { storeList, zoomToStore } //es6 magic storeList:storeList
}

export default connect(mapStateToProps)(Map)
