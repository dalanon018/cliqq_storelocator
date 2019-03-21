import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchStores, getStoresOnCurrentLocation, getStoresByMobile } from "../actions/index";
import Loader from "react-loader";
import * as Papa from 'papaparse';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            storekeys: [],
            storeaddress: [],
            term: "",
            locationText: "Use My Location",
            touched: {
                term: false
            },
            getStoresOnCurrentLocationButtonClicked: false,
            isLoaded: true,
            sendSearchRequest: false,
            locationNotFound: false
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.getStoresOnCurrentLocation = this.getStoresOnCurrentLocation.bind(
            this
        );
        this._onKeyDown = this._onKeyDown.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        //this.parseCSV = this.parseCSV.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    componentDidMount() {
        if(this.props.mobileNumber){
          console.log("Mobile number is setup! retrieving recently visited stores... ", this.props.mobileNumber)
          this.getStoresByMobileNumber(this.props.mobileNumber);
          //th
        } else {
          console.log("No mobile number given.");
        }
        this.parseCSV("http://s3.philseven.com/public/ecms_stores.csv", this.updateData);
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.currentLocation !== this.props.currentLocation) {
            if (this.state.getStoresOnCurrentLocationButtonClicked)
                this.setState({ locationText: "Location Found" });
        }

        if(prevProps.storeList !== this.props.storeList){
            this.setState({ isLoaded: true})
        }

    }

    handleBlur = field => evt => {
        // console.log("handling blur for: ", field);
        this.setState({
            touched: { ...this.state.touched, [field]: true }
        });
    };

    validateForm(term) {
        return {
            term: term.length < 4
        };
    }

    getStoresByMobileNumber(mobileNumber){
      ///send action to retrieve stores using the given mobile number
      this.props.getStoresByMobile(mobileNumber);
    }

    getStoresOnCurrentLocation() {
        //send action to retrieve stores near user location
        console.log("Send get stores around location action...");
        this.setState({ getStoresOnCurrentLocationButtonClicked: true });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const geoCoords = pos.coords;
                    console.log(geoCoords);
                    this.props.getStoresOnCurrentLocation(geoCoords);
                },
                error => {
                    switch (error.code) {
                        case error.TIMEOUT:
                            console.log("getting coordinates timed out.");
                            break;
                        case error.PERMISSION_DENIED:
                            console.log(
                                "User did not consent to sharing location data"
                            );
                            this.setState({ locationText : "Not Found", locationNotFound: true});
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.log("Cannot get current user position");
                            break;
                        default:
                            console.log(
                                "Unexpected error occured. if you could show this to them: ",
                                error.code
                            );
                    }
                }
            );
        } else {
            console.warn("This browser does not support html5 geolocation");
        }
        this.setState({ locationText: "Loading..." });
    }

    //storeName
    //storeAddress
    //storeNumber
    //

    onFormSubmit(event) {
        //set get store location here
        if (!this.canSubmitStoreTerm()) {
            return;
        }
        event.preventDefault(); //prevent default submit form
        // console.log("onFormSubmit sendSearchRequest?: ", this.state.sendSearchRequest)

        // for parsing csv files
        // var data = Papa.parse("/cliqq_storelocator/src/ecms_stores.csv");
        // console.log('data ' + data.data)
        this._fetchStores(this.state.term);
        // this.props.getSearchTerm(this.state.term);
        // this.setState({'term': ''});
    }

    _fetchStores(term){
        let storekeyProp = this.state.storekeys
        let searchFlag = 0
        //console.log('storekeyProp ' + storekeyProp)
        this.setState({ isLoaded: false})
        if(parseInt(term, 10)){
          let storeNum = parseInt(term, 10)
          console.log('storeNum ' + storeNum)
          this.parseCSV();
          //console.log(storekeyProp.some(elem => elem.includes(storeNum)))
          for(let i=0; i<storekeyProp.length; i++){
            if(storekeyProp[i] == storeNum){
              this.props.fetchStores(this.state.storeaddress[i]);
              //this.setState({ term: this.state.storeaddress[i] })
              searchFlag = 1;
            }
            if((i+1) == storekeyProp.length && searchFlag == 0){
              this.props.fetchStores(term)
            }
          }
        } else {
          this.props.fetchStores(term);
        }
        this.setState({term: ""});
    }

    parseCSV(){
      // Parse CSV file
      // Papa.parse("http://s3.philseven.com/public/ecms_stores.csv", {
      Papa.parse("http://s3.philseven.com/public/ecms_stores.csv", {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: this.updateData
      });

    }

    // for (let i=0; i<results.data.length; i++){
    //   if(parseInt(termProp, 10) == results.data[i].store_key){
    //     // termProp = results.data[i].address
    //     termProp = results.data[i].address;
    //     console.log('termProp ' + termProp)
    //
    //   }
    // }
    // this.props.fetchStores();

    updateData(results) {

      let storeKeys = []
      let storeAddress = []
      for (let i=0; i<results.data.length; i++){
        //this.setState({ storekeys: results.data[i].store_key })
        storeKeys.push(results.data[i].store_key)
        storeAddress.push(results.data[i].address)
      };
      this.setState({ storekeys: storeKeys })
      this.setState({ storeaddress: storeAddress })
    }

    onInputChange(event) {
        // console.log("The term is : ", event.target.value);
        this.setState({ term: event.target.value });
    }

    _onKeyDown(event){

        if(event.keyCode !== 13){
            this.onInputChange(event);
            return;
        } else {
            const errors = this.validateForm(this.state.term);
            this.onInputChange(event);
            event.preventDefault();
            if(errors)
                console.warn("Cannot fetch stores on empty string")
            else {
                console.warn("Fetching stores on term: ", this.state.term);
                this._fetchStores(this.state.term);
            }
        }
    }

    canSubmitStoreTerm() {
        const { term } = this.state;
        const isEnabled = term.length > 3;

        return isEnabled;
    }

    render() {
        const errors = this.validateForm(this.state.term);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);
        // console.log("Search Bar Props: ", this.props);
        // console.log("Search Bar Props Location: ", this.props.location);
        return (
            <div className="main_search">
                <div className="row clearfix">
                    <div className="col-12">
                        <h3 className="h3 text-left">Find a 7-Eleven Store</h3>
                    </div>
                    <div className="col-12 pl-0 pr-0 d-none d-sm-block">
                        <div className="col-12 pl-0 pr-0">
                            <button
                                className="btn m-0 btn-lg btn-success w-100"
                                onClick={this.getStoresOnCurrentLocation}
                            >
                                <i className="fas fa-location-arrow" />{" "}
                                {this.state.locationText}
                            </button>
                        </div>
                        <div className="col-2" />
                        <div className="col-12 pt-0 pl-0 pr-0">
                            <span className="line-thru">
                                <h2>OR</h2>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row pt-2 clearfix">
                    <div className="col-12 pr-0 pl-0">
                        <form onSubmit={this.onFormSubmit}>
                            <div className="d-none d-sm-block">
                                <div className="form-group mb-0">
                                    <div className="form-label-group">
                                        <input
                                            id="store_search"
                                            className="pt-4 form-control"
                                            placeholder="Enter Province or City"
                                            autoFocus=""
                                            type="text"
                                            onInput={this.onInputChange}
                                            value={this.state.term}
                                            onBlur={this.handleBlur("term")}
                                            onKeyUp={this._onKeyDown }
                                        />
                                        <label htmlFor="store_search">
                                            Enter Province or City
                                        </label>
                                        <div
                                            className={
                                                errors.term &&
                                                this.state.touched.term
                                                    ? "form-text text-muted"
                                                    : "clean"
                                            }
                                        >
                                            <small className="form-text">
                                                Enter at least 3 letters for
                                                refined search.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                </div>
                                <Loader loaded={this.state.isLoaded}
                                    lines={11}
                                    length={1}
                                    width={5}
                                    corners={1}
                                    color="#078162"
                                    >
                                    <button
                                        className="btn mt-2 btn-lg btn-success w-100"
                                        disabled={!isEnabled}
                                    >
                                        <i className="fas fa-search" /> &nbsp; Find
                                        Stores
                                    </button>
                                </Loader>


                            </div>
                            <div className="col-12 d-block d-sm-none">
                                <div className="input-group mb-3">
                                    <input
                                        id="store_search"
                                        className="form-control"
                                        placeholder="Enter Province or City"
                                        aria-label="Enter Province or City"
                                        aria-describedby="basic-addon2"
                                        autoFocus=""
                                        type="text"
                                        onInput={this.onInputChange}
                                        value={this.state.term}
                                        onBlur={this.handleBlur("term")}
                                        onKeyUp={this._onKeyDown }
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn m-0 btn-lg btn-success w-100"
                                            onClick={
                                                this.getStoresOnCurrentLocation
                                            }
                                            type="button"
                                        >
                                            <i className="fas fa-location-arrow" />
                                        </button>
                                        <button
                                            // className="btn btn-outline-secondary"
                                            className="btn btn-lg btn-success"
                                            type="submit"
                                            disabled={!isEnabled}
                                        >
                                            <i className="fas fa-search" />
                                        </button>
                                    </div>
                                </div>
                                <span className="text-muted">
                                    Enter Province/City, or Click on Location
                                    Button to use your location.
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ currentLocation, storeList }) {
    return { currentLocation, storeList };
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(
            { fetchStores, getStoresByMobile, getStoresOnCurrentLocation },
            dispatch
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
