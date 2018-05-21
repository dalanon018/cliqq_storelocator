import React, { Component } from "react";
// import logo from './logo.svg';
import seven_eleven_logo from "./header3.png";
import "./App.css";
import SearchBar from "./containers/search_bar";
import MapContainer from "./components/map_container";
import StoreList from "./containers/store_list";
import queryString from "query-string";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CliqqMerchantForm from "./components/cliqqapp-merchant-form"
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mobileNumber: "",
            callbackUrl: "",
            submitted: false,
            paramMap: {},
            isBlocking: false
        };
    }

    componentWillMount() {
        this.parseQueryString();
    }

    parseQueryString() {
        console.log("Url params? : ", window.location.search);

        const urlParams = window.location.search;
        if (urlParams) {
            let paramMap = queryString.parse(urlParams);
            console.log(paramMap);

            console.log("Mobile Number given: ", paramMap.mobileNumber);
            console.log("Callback URL given: ", paramMap.callbackUrl);
            console.log("Submitted Flag given: ", paramMap.submitted);
            console.log("modePayment Flag given: ", paramMap.modePayment);
            
            this.setState({
                mobileNumber: paramMap.mobileNumber,
                callbackUrl: paramMap.callbackUrl,
                submitted: paramMap.submitted === "true",
                modePayment: paramMap.modePayment,
                paramMap: paramMap
            });
        }
    }

    render() {
        console.log("window location :", window.location);
		const { mobileNumber, callbackUrl, paramMap } = this.state;
		console.log("passing mobile number : ", mobileNumber);
        // console.log("this props : ", this.props);
        return (
            <Router>
                <div className="App container-fluid pr-0 pl-0">
                    <header className="App-header navbar-pale">
                        <img
                            src={seven_eleven_logo}
                            className="App-logo"
                            alt="logo"
                        />
                        {/* <h1 className="App-title">Welcome to React</h1> */}
                    </header>
                    {/* <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
            </p> */}
                    <div className="row no-gutters">
                        <div className="col-md-3 col-xs-12">
                            <div className="order-1">
                                <SearchBar mobileNumber={mobileNumber} />
                            </div>

                            <div className="d-none d-sm-block">
                                <StoreList 
                                    callbackUrl={callbackUrl} 
                                    paramMap={paramMap}
                                />
                            </div>
                        </div>
                        <div className="col-md-9 col-xs-12 order-xs-2">
                            <MapContainer />
                        </div>
                        <div className="d-block d-sm-none order-xs-3">
                            <StoreList 
                                callbackUrl={callbackUrl} 
                                showBackToTopButton="true" 
                                paramMap={paramMap}
                            />
                        </div>
                    </div>
                </div>
            </Router>
            
        );
    }
}

export default App;
