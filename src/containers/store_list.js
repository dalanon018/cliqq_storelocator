import React, { Component } from "react";
// import { GoogleMap, Marker } from "react-google-maps";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { zoomToStore } from "../actions/zoomToStore";
import StoreButton from "../components/storeButton";
class StoreList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStoreButton: false
        };
        this.zoomToStore = this.zoomToStore.bind(this);
        this.backToTop = this.backToTop.bind(this);
        this.sendToCallbackUrl = this.sendToCallbackUrl.bind(this);
        this.handleChildClick = this.handleChildClick.bind(this);
    }

    zoomToStore = (individualStoreData) => (event) => {
        console.log("Zoom to store: ", individualStoreData.STORE_NAME);
        event.stopPropagation();
        this.props.zoomToStore(individualStoreData);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.storeList &&
            prevProps.storeList["0"] !== this.props.storeList["0"]
        ) {
            console.log("rerendering......");
            // this.render();
            this.scrollToBottom();
        }
    }

    componentDidMount() {
        console.log("Store List mounted. [props]: ", this.props);
        this.setState((prevState, props) => ({
            showStoreButton: this.props.callbackUrl ? true : false
        }));
    }

    sendToCallbackUrl = (storeNum, storeName, callbackUrl) => (event) => {
        console.log("Returning to ", callbackUrl);
        console.log("Stopping Propagation!");
        event.stopPropagation();

        return window.location.replace(
            `${callbackUrl}?type=cod&storeId=${storeNum}&storeName=${storeName}`
        );
    };

    handleChildClick(event) {
        // event.stopPropagation();
        console.log("Handling child click");
        alert("child button is clicked");
    }

    renderStore(storeData) {
        // console.log("storeData : ", storeData);
        const { callbackUrl } = this.props;
        console.log("[StoreList Props] callbackUrl is :", callbackUrl);
        const showButton = callbackUrl ? (
            <StoreButton
                storeNum={storeData.STORE_NUM}
                storeName={storeData.STORE_NAME}
                onClick={ (event) => {
                    this.handleChildClick(event)
                    }
                }  
            />
        ) : (
            " "
        );
        return (
            <li
                className="list-group-item list-group-item-action waves-effect"
                data-toggle="list"
                key={storeData.STORE_NUM}
                onClickCapture={ (event) => {this.zoomToStore(storeData,event)}}
            >
                <div key={storeData.STORE_NUM} className="row">
                    <div className="col-3">
                        <span className="store-number">
                            {" "}
                            {storeData.STORE_NUM}{" "}
                        </span>
                    </div>
                    <div className="col-9">
                        <b>{storeData.STORE_NAME}</b>
                        <br />
                        <span className="text-left">
                            <p>{storeData.ADDRESS}</p>
                            <p>{storeData.REGION_NAME}</p>
                        </span>
                    </div>
                    <div className="col-12">{ showButton }</div>
                    <StoreButton
                storeNum={storeData.STORE_NUM}
                storeName={storeData.STORE_NAME}
                onClick={ (event) => {
                    this.handleChildClick
                    }
                }  
            />
                </div>
            </li>
        );
    }

    scrollToBottom() {
        console.log("scrolling to bottom");
        //the modern way but not currently supported in all browsers
        // this.el.scrollIntoView({behavior:'smooth'});

        //the currently javascript way

        const scrollHeight = this.el.scrollHeight;
        // console.log("scrollHeight: ", scrollHeight);
        const height = this.el.clientHeight;
        // console.log("height :", height);

        // const maxScrollTop = scrollHeight - height;
        // console.log("max scroll height: ", maxScrollTop);
        // this.el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;

        // this.el.scrollTop = this.el.scrollHeight;
        // this.el.scrollthis.el.scrollHeight
        if (!this.el) {
            window.scroll({
                left: 0,
                top: 326,
                behavior: "smooth"
            });
        }

        window.scroll({
            left: 0,
            top: this.el.scrollHeight,
            behavior: "smooth"
        });
    }

    backToTop() {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        });
    }

    render() {
        console.log("StoreList: ", this.props.storeList);
        console.log("searchTerm: ", this.props.searchTerm);
        let storeProps = this.props.storeList["0"] || [];
        let stores = [];
        if (this.props.storeList && storeProps.length) {
            stores = storeProps.map(storeData => {
                return storeData;
            });
        }

        // console.log("Stores! : ", stores);

        if (!stores.length && this.props.storeList["1"]) {
            // console.log("no store found!");
            console.log(
                "this.props.storeList.status : ",
                this.props.storeList.status
            );

            return (
                <div
                    ref={el => {
                        this.el = el;
                    }}
                    className="store_list_container"
                >
                    <h4>No Stores Found.</h4>
                </div>
            );
        }

        if (stores.length) {
            let holderText = this.props.storeList["1"]
                ? this.props.storeList["1"]
                : "Your Location";
            let completeHolderText = "Stores Near " + holderText;
            if (this.props.storeList["1"] === "mobileNumber") {
                completeHolderText = "Recently Visited Store";
            }
            return (
                <div
                    ref={el => {
                        this.el = el;
                    }}
                    className="store_list_container"
                >
                    <h4 className="h4">{completeHolderText}</h4>
                    <span onClick={this.backToTop}>Back to Top</span>

                    <div>
                        <ul className="list-group storeList">
                            {stores.map((storeData, idx) =>
                                this.renderStore(storeData)
                            )}
                        </ul>
                    </div>
                </div>
            );
        }

        return <div className="store_list_container" />;
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ zoomToStore }, dispatch);
}

function mapStateToProps({ storeList }) {
    // console.log("searchTerm present? :", searchTerm)
    // console.log("storeList present? :", storeList);
    return { storeList }; //es6 magic storeList:storeList
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreList);
