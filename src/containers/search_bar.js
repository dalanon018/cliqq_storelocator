import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchStores, getStoresOnCurrentLocation } from '../actions/index';
import { getSearchTerm } from '../actions/getSearchTerm';
class SearchBar extends Component {
	constructor(props) {
		super(props);
        this.state = { 
			term: '',
			locationText: "Use My Location",
			touched: {
				term: false,
			},
			getStoresOnCurrentLocationButtonClicked: false
        };

		this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
		this.getStoresOnCurrentLocation = this.getStoresOnCurrentLocation.bind(this);
		// this.handleBlur = this.handleBlur.bind(this);
    }
    
	componentDidUpdate(prevProps, prevState) {
		if(prevProps.currentLocation !== this.props.currentLocation){
			if(this.state.getStoresOnCurrentLocationButtonClicked)
				this.setState({ locationText: "Location Found" });
		}
	}

	handleBlur = (field) => (evt) => {
		console.log("handling blur for: ", field)
		this.setState({
			touched: { ...this.state.touched, [field]: true }
		});
	}

	validateForm(term){
		return {
			term: term.length < 4,
		};
	}

    getStoresOnCurrentLocation(){
        //send action to retrieve stores near user location
        console.log("Send get stores around location action...");
		this.setState({ getStoresOnCurrentLocationButtonClicked : true });
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const geoCoords = pos.coords;
					console.log(geoCoords);
					this.props.getStoresOnCurrentLocation(geoCoords);	
				},
				(error) => {
					switch (error.code) {
						case error.TIMEOUT:
							console.log('getting coordinates timed out.');
							break;
						case error.PERMISSION_DENIED:
							console.log('User did not consent to sharing location data');
							break;
						case error.POSITION_UNAVAILABLE:
							console.log('Cannot get current user position');
							break;
						default:
							console.log('Unexpected error occured. if you could show this to them: ', error.code);
					}
				}
			);
		} else {
			console.warn("This browser does not support html5 geolocation");
		}
        this.setState({locationText:"Loading..."})
    }

	onFormSubmit(event) {
		//set get store location here
		if(!this.canSubmitStoreTerm()){
			
			return;
		}
		event.preventDefault(); //prevent default submit form
		this.props.fetchStores(this.state.term);
		// this.props.getSearchTerm(this.state.term);
		// this.setState({'term': ''});
	}

	onInputChange(event) {
		// console.log("The term is : ", event.target.value);
		this.setState({ term: event.target.value });
	}

	canSubmitStoreTerm(){
		const { term } = this.state;
		const isEnabled = term.length > 3;

		return isEnabled;
	}

	render() {
		const errors = this.validateForm(this.state.term);
		const isEnabled = !Object.keys(errors).some( x => errors[x]);
		
		return (
			<div className="main_search">
				<div className="row clearfix">
					<div className="mx-auto">
						<h3>Find a 7-Eleven Store</h3>
					</div>
					<div className="col-12 pl-0 pr-0">
						<button className="btn m-0 btn-lg btn-success w-100" onClick={ this.getStoresOnCurrentLocation }>
							<i className="fas fa-location-arrow" /> &nbsp; {this.state.locationText}
						</button>
					</div>
					<div className="col-2" />
					<div className="col-12 pt-1 pl-0 pr-0">
						<span className="line-thru">
							<h2>OR</h2>
						</span>
					</div>
				</div>
				<div className="row pt-3 clearfix">
					<div className="col-12 pr-0 pl-0">
						<form onSubmit={this.onFormSubmit}>
							<div className="form-group">
								<div className="form-label-group">
									<input
										id="store_search"
										className="pt-4 form-control"
										placeholder="Enter Province or City"
										autoFocus=""
										type="text"
										onChange={this.onInputChange}
										value={this.state.term}
										onBlur={this.handleBlur('term')}
									/>
									<label htmlFor="store_search">Enter Province or City</label>
									<div className={ errors.term && this.state.touched.term ? "form-text text-muted" : "clean" }>
										<small className="form-text">Enter at least 3 letters for refined search.</small>
									</div>
								</div>
							</div>
							
							<button className="btn mt-2 btn-lg btn-success w-100" disabled={!isEnabled}>
								<i className="fas fa-search" /> &nbsp; Find Stores
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ currentLocation }) {
    return { currentLocation }
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators({ fetchStores, getSearchTerm, getStoresOnCurrentLocation }, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
