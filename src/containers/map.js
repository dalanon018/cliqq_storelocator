import React, { Component } from "react";
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import defaultStoreIcon from "../store_locator_marker.png";
import { scrollToStore } from "../actions/scrollToStore";
class Map extends Component {
    state = {
        markers: [],
        defaultZoom: 14,
        clickedMarker: null,
        lastClickedMarker: null
    };

    componentDidMount() {
        this.loadMap();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
        if (prevProps.storeList !== this.props.storeList
            // && prevProps.storeList[0] !== this.props.storeList[0]
            // && prevProps.storeList[1] !== this.props.storeList[1]
            ) {
                this.updateMap();
        } else {
            console.warn("No map update needed.");
        }
        if (prevProps.zoomToStore !== this.props.zoomToStore) {
            this.centerOnMarker();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
            this.recenterMapOnCurrentLocation();
        }
        if (
            prevProps.centerAroundCurrentLoc !==
            this.props.centerAroundCurrentLoc
        ) {
            this.getStoresAroundLocation();
        }
    }

    recenterMapOnCurrentLocation() {
        const map = this.map;
        const curr = this.state.currentLocation;

        const google = this.props.google;
        const maps = google.maps;

        if (map) {
            let center = new maps.LatLng(curr.lat, curr.lng);
            map.panTo(center);
        }
    }

    getStoresAroundLocation() {
        if (this.props.centerAroundCurrentLoc) {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    const geoCoords = pos.coords;
                    this.setState({
                        currentLocation: {
                            lat: geoCoords.latitude,
                            lng: geoCoords.longitude
                        }
                    });
                });
            }
        }
    }

    updateMap() {
        this.map.setZoom(this.state.defaultZoom);
        this.clearMarkers();
        if (this.props && this.props.google) {
            this.generateMarkers();
        }
    }

    getMarker(markerId){
        const filteredMarkers = this.state.markers.filter(marker => {
            return marker.get("store_id") === markerId
        })

        if(filteredMarkers){
            return filteredMarkers[0]
        }
    }

    centerOnMarker() {
        // console.log("centering on selected marker: ", this.props.zoomToStore);
        if (this.props.zoomToStore) {
            // console.log("current markers are: ", this.state.markers);
            const storeId = this.props.zoomToStore["0"];
            const selectedMarker = this.state.markers.filter(marker => {
                if (marker.get("store_id") === storeId) {
                    // console.log("marker found: ", marker);
                }
                return marker.get("store_id") === storeId;
            });
            if (selectedMarker.length) {
                // console.log(
                //     "selectedMarker position: ",
                //     selectedMarker["0"].getPosition()
                // );
                this.zoomOnSelectedMarker(selectedMarker["0"]);
                // this.map.panTo(selectedMarker["0"].getPosition());
                // this.map.setZoom(19);
                // console.log("selectedMarker is: ", selectedMarker);
            } else {
                console.log("no zoomToStore");
            }
        }
    }

    zoomOnSelectedMarker(marker) {
        // const { google } = this.props;
        this.toggleMarkerBounce(marker.get("store_id"))
        // marker.setAnimation(google.maps.Animation.BOUNCE);
        this.map.setZoom(19);
        this.map.panTo(marker.getPosition());
        console.log("Scroll to Selected Store hook");

    }

    scrollToSelectedStore(storeId) {
        console.log("Sending scrollToStore action. <" + storeId + ">")
        this.props.scrollToStore(storeId);
    }

    setCenterOnFirstMarker(firstMarker) {
        // console.log("centering on the first marker..");
        this.map.setZoom(this.state.defaultZoom - 2);
        this.map.panTo(firstMarker.getPosition());
    }

    generateMarkers() {
        const { google } = this.props;
        // const currentMarkers = [];

        let storeProps = this.props.storeList["0"] || [];
        let stores = [];
        if (this.props.storeList && storeProps.length) {
            stores = storeProps.map(storeData => {
                return storeData;
            });
        }
        var self = this;
        if (stores) {
            let currentMapMarkers = stores.map((storeData, idx) => {
                // console.log('Generating marker for ', location);

                const marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(storeData.LATITUDE),
                        lng: parseFloat(storeData.LONGITUDE)
                    },
                    map: this.map,
                    title: storeData.STORE_NAME,
                    icon: defaultStoreIcon,
                    animation: google.maps.Animation.DROP,
                    store_id: storeData.STORE_NUM
                });
                if (idx === 0) {
                    this.setCenterOnFirstMarker(marker);
                }
                this.addMarkerClickListener(marker,self);
                // setTimeout(() => {
                //     marker.setMap(this.map)
                // })
                return marker
            });
            // console.log("currentMapMarker: ", currentMapMarkers);
            this.setState({ markers: currentMapMarkers });
        }
    }

    addMarkerClickListener(marker, self) {
        // console.log('adding click listener for the marker: ', marker);
        // const { google } = this.props;
        marker.addListener("click", function() {
            this.map.setZoom(19);
            this.map.panTo(marker.getPosition());
            self.toggleMarkerBounce(marker.get("store_id"));
            self.scrollToSelectedStore(marker.get("store_id"));
        });

    }

    toggleMarkerBounce = (marker) => {
        console.info("Toggling Bounce for marker : ", marker);
        const { google } = this.props;
        const { lastClickedMarker } = this.state
        this.setState({clickedMarker: marker})
        if(lastClickedMarker !== marker){
            let markerObj = this.getMarker(marker);
            markerObj.setAnimation(google.maps.Animation.BOUNCE);
            if(lastClickedMarker){
                let lcMObj = this.getMarker(lastClickedMarker);
                if(lcMObj){
                    lcMObj.setAnimation(null);
                }
                this.setState({lastClickedMarker: marker});
            } else {
                this.setState({lastClickedMarker: marker});
            }
        }

    }

    clearMarkers() {
        // console.log("clearing markers: ", this.state.markers);
        if(this.state.markers.length){
            this.state.markers.forEach(marker => {
                marker.setMap(null);
            });

            this.setState({ markers: [] });
        }

    }

    loadMap() {
        // load the google map
        this.clearMarkers();
        if (this.props && this.props.google) {
            //google is available
            const { google } = this.props; //get google prop from this.props and assign to variable google
            const maps = google.maps;

            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);

            let defaultLng = 121.015;
            let defaultLat = 14.57;
            const center = new maps.LatLng(defaultLat, defaultLng);
            const mapConfig = Object.assign(
                {},
                {
                    center: center,
                    zoom: this.state.defaultZoom,
                    gestureHandling: "cooperative",
                    styles: [
                        {
                            featureType: "administrative",
                            elementType: "geometry.stroke",
                            stylers: [
                                {
                                    color: "#005338"
                                }
                            ]
                        },
                        {
                            featureType: "administrative",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#000000"
                                }
                            ]
                        },
                        {
                            featureType: "administrative",
                            elementType: "labels.text.stroke",
                            stylers: [
                                {
                                    color: "#000000"
                                },
                                {
                                    visibility: "off"
                                }
                            ]
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#000000"
                                }
                            ]
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.stroke",
                            stylers: [
                                {
                                    color: "#ffffff"
                                },
                                {
                                    visibility: "off"
                                }
                            ]
                        },
                        {
                            featureType: "poi.business",
                            stylers: [
                                {
                                    visibility: "off"
                                }
                            ]
                        },
                        {
                            featureType: "poi.park",
                            elementType: "labels.text",
                            stylers: [
                                {
                                    visibility: "off"
                                }
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.fill",
                            stylers: [
                                {
                                    color: "#A5E186"
                                },
                                {
                                    visibility: "on"
                                }
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [
                                {
                                    color: "#ffffff"
                                }
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "labels",
                            stylers: [
                                {
                                    visibility: "on"
                                },
                                {
                                    weight: 2.5
                                }
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "labels.icon",
                            stylers: [
                                {
                                    visibility: "off"
                                }
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text",
                            stylers: [
                                {
                                    color: "#000000"
                                },
                                {
                                    visibility: "on"
                                },
                                {
                                    weight: 3.5
                                }
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#ffffff"
                                },
                                {
                                    visibility: "on"
                                },
                                {
                                    weight: 3.5
                                }
                            ]
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.stroke",
                            stylers: [
                                {
                                    color: "#005338"
                                },
                                {
                                    visibility: "off"
                                },
                                {
                                    weight: 3.5
                                }
                            ]
                        },
                        {
                            featureType: "road.local",
                            elementType: "geometry.stroke",
                            stylers: [
                                {
                                    color: "#ffeb3b"
                                },
                                {
                                    visibility: "off"
                                }
                            ]
                        }
                    ]
                }
            );

            this.map = new maps.Map(node, mapConfig);
            //** LOAD MAP MARKERS **//
            this.generateMarkers(google);
        }
    }

    render() {
        return (
            <div ref="map" className="mapDimensions">
                Loading map...
            </div>
        );
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({ scrollToStore }, dispatch);
}

function mapStateToProps({ storeList, zoomToStore }) {
    // console.log("mapStateToProps for MAP component: ", storeList);
    // console.log(
    //     "mapStateToProps for MAP component - zoomToStore: ",
    //     zoomToStore
    // );
    return { storeList, zoomToStore }; //es6 magic storeList:storeList
}

export default connect(mapStateToProps,mapDispatchToProps)(Map);
