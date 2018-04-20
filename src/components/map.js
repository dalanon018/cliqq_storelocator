import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import defaultStoreIcon from '../store_locator_marker.png';
class Map extends Component {
	state = {
		markers: [],
		defaultZoom: 14
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.google !== this.props.google) {
			this.loadMap();
		}
		if (prevProps.storeList !== this.props.storeList) {
			this.updateMap();
		}
		if (prevProps.zoomToStore !== this.props.zoomToStore) {
			this.centerOnMarker();
        }
        if(prevState.currentLocation !== this.state.currentLocation){
            this.recenterMapOnCurrentLocation();
		}
		if(prevProps.centerAroundCurrentLoc !== this.props.centerAroundCurrentLoc){
			this.getStoresAroundLocation();
		}
    }

    recenterMapOnCurrentLocation(){
		const map = this.map;
		const curr = this.state.currentLocation;

		const google = this.props.google;
		const maps = google.maps;

		if(map){
			let center = new maps.LatLng(curr.lat, curr.lng)
			map.panTo(center);
		}
    }

	componentDidMount() {
        this.loadMap();
	}

	getStoresAroundLocation(){
		if (this.props.centerAroundCurrentLoc){
            if(navigator && navigator.geolocation){
                navigator.geolocation.getCurrentPosition((pos) => {
                    const geoCoords = pos.coords;
                    this.setState({
                        currentLocation: {
                            lat: geoCoords.latitude,
                            lng: geoCoords.longitude
                        }
                    })
                })
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

	centerOnMarker() {
		console.log('centering on selected marker: ', this.props.zoomToStore);
		if (this.props.zoomToStore) {
			console.log('current markers are: ', this.state.markers);
			const storeId = this.props.zoomToStore['0'];
			const selectedMarker = this.state.markers.filter((marker) => {
				if (marker.get('store_id') === storeId) {
					console.log('marker found: ', marker);
				}
				return marker.get('store_id') === storeId;
			});
			if (selectedMarker.length) {
				console.log('selectedMarker position: ', selectedMarker['0'].getPosition());
				this.zoomOnSelectedMarker(selectedMarker['0']);
				// this.map.panTo(selectedMarker["0"].getPosition());
				// this.map.setZoom(19);
				console.log('selectedMarker is: ', selectedMarker);
			} else {
				console.log('no zoomToStore');
			}
		}
	}

	zoomOnSelectedMarker(marker) {
		const { google } = this.props;
		marker.setAnimation(google.maps.Animation.BOUNCE)
		this.map.setZoom(19);
		this.map.panTo(marker.getPosition());
	}

	setCenterOnFirstMarker(firstMarker) {
		console.log('centering on the first marker..');
		this.map.setZoom(this.state.defaultZoom - 2);
		this.map.panTo(firstMarker.getPosition());
	}

	generateMarkers() {
		const { google } = this.props;
		const currentMarkers = [];

		let storeProps = this.props.storeList["0"] || [];
        let stores = []
        if(this.props.storeList && storeProps.length){
            stores = storeProps.map( storeData => {
                return storeData;
            })
        }

		stores.map((storeData,idx) => {
			// console.log('Generating marker for ', location);
			setTimeout(() => {
				const marker = new google.maps.Marker({
					position: { lat: parseFloat(storeData.LATITUDE), lng: parseFloat(storeData.LONGITUDE) },
					map: this.map,
					title: storeData.STORE_NAME,
					icon: defaultStoreIcon,
					animation: google.maps.Animation.DROP,
					store_id: storeData.STORE_NUM
				});
				if (idx === 0) {
					this.setCenterOnFirstMarker(marker);
				}
				this.addMarkerClickListener(marker);
				currentMarkers.push(marker);
			}, 1500);
		});
		this.setState({ markers: currentMarkers });
	}

	addMarkerClickListener(marker) {
		// console.log('adding click listener for the marker: ', marker);
		marker.addListener('click', function() {
			this.map.setZoom(19);
			this.map.panTo(marker.getPosition());
		});
	}

	clearMarkers() {
		console.log('clearing markers: ', this.state.markers);
		this.state.markers.map((marker) => {
			marker.setMap(null);
		});
		this.setState({ markers: [] });
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
					gestureHandling: 'cooperative',
					styles: [
					  {
					    "featureType": "administrative",
					    "elementType": "geometry.stroke",
					    "stylers": [
					      {
					        "color": "#005338"
					      }
					    ]
					  },
					  {
					    "featureType": "administrative",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#ffffff"
					      }
					    ]
					  },
					  {
					    "featureType": "administrative",
					    "elementType": "labels.text.stroke",
					    "stylers": [
					      {
					        "color": "#005338"
					      }
					    ]
					  },
					  {
					    "featureType": "poi",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#ffffff"
					      }
					    ]
					  },
					  {
					    "featureType": "poi",
					    "elementType": "labels.text.stroke",
					    "stylers": [
					      {
					        "color": "#005338"
					      }
					    ]
					  },
					  {
					    "featureType": "poi.business",
					    "stylers": [
					      {
					        "visibility": "off"
					      }
					    ]
					  },
					  {
					    "featureType": "poi.park",
					    "elementType": "labels.text",
					    "stylers": [
					      {
					        "visibility": "off"
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "geometry.fill",
					    "stylers": [
					      {
					        "color": "#005338"
					      },
					      {
					        "visibility": "on"
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "geometry.stroke",
					    "stylers": [
					      {
					        "color": "#ffffff"
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "labels",
					    "stylers": [
					      {
					        "visibility": "on"
					      },
					      {
					        "weight": 2.5
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "labels.icon",
					    "stylers": [
					      {
					        "visibility": "off"
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "labels.text",
					    "stylers": [
					      {
					        "color": "#000000"
					      },
					      {
					        "visibility": "on"
					      },
					      {
					        "weight": 3.5
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "labels.text.fill",
					    "stylers": [
					      {
					        "color": "#ffffff"
					      },
					      {
					        "visibility": "on"
					      },
					      {
					        "weight": 3.5
					      }
					    ]
					  },
					  {
					    "featureType": "road",
					    "elementType": "labels.text.stroke",
					    "stylers": [
					      {
					        "color": "#005338"
					      },
					      {
					        "visibility": "on"
					      },
					      {
					        "weight": 3.5
					      }
					    ]
					  },
					  {
					    "featureType": "road.local",
					    "elementType": "geometry.stroke",
					    "stylers": [
					      {
					        "color": "#ffeb3b"
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
		const style = {
			width: '65vw',
			height: '87vh'
		};

		return (
			<div ref="map" className="mapDimensions">
				Loading map...
			</div>
		);
	}
}

function mapStateToProps({ storeList, zoomToStore }) {
	console.log('mapStateToProps for MAP component: ', storeList);
	console.log('mapStateToProps for MAP component - zoomToStore: ', zoomToStore);
	return { storeList, zoomToStore }; //es6 magic storeList:storeList
}

export default connect(mapStateToProps)(Map);
