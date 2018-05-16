import React, { Component } from "react";
// import { GoogleMap, Marker } from "react-google-maps";
import ReactDOM from 'react-dom'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { zoomToStore } from "../actions/zoomToStore";
import StoreButton from "../components/storeButton";
import StoreListItem from "../components/store_list_item";
import scrollIntoView from "scroll-into-view"
class StoreList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStoreButton: false,
            selectedStore: ''
        };
        this.zoomToStore = this.zoomToStore.bind(this);
        this.backToTop = this.backToTop.bind(this);
        this.sendToCallbackUrl = this.sendToCallbackUrl.bind(this);
        this.storeLists = [];
        this._nodes = new Map();
    }

    zoomToStore = (individualStoreData) => (event) => {
        console.log("Zoom to store: ", individualStoreData.STORE_NAME);
        event.stopPropagation();
        this.props.zoomToStore(individualStoreData);
        this.setState({
            selectedStore: individualStoreData.STORE_NUM
        })
        
    }

    componentDidUpdate(prevProps, prevState) {
        
        if(prevProps.storeScroll !== this.props.storeScroll){
            this.scrollToSelectedStore();
        }
        if (
            prevProps.storeList &&
            prevProps.storeList["0"] !== this.props.storeList["0"]
        ) {
            console.log("rerendering......");
            // this.render();
            this.storeLists = [];
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
        if(event.stopPropagation){
            event.stopPropagation();
        }

        return window.location.replace(
            `${callbackUrl}?type=cod&storeId=${storeNum}&storeName=${storeName}`
        );
    };

    scrollToSelectedStore = () => {
        console.log("Scrolling to the selected store!: ", this.props.storeScroll);
        const { storeScroll } = this.props; 
        
        let _storeRef = storeScroll[0];
        console.log("Current store list: ", this._nodes);

        const node = this._nodes.get(_storeRef);
        console.log("after finding node :",node);
        if (node) {
            const selectedNode = ReactDOM.findDOMNode(node);
            selectedNode.setAttribute('selectedStore', _storeRef);
            selectedNode.scrollIntoView({block: 'center', behavior: 'auto'});
            
            // React.cloneElement(
            //     node,
            //     {selectedStore: _storeRef},
            //     null
            // )
            scrollIntoView(selectedNode,{
                time:0,
                align: {
                    top: 0
                }
            } )
            
            selectedNode.click();
            console.log("clicking");
            
        }
    }   

    renderStore(storeData) {
        // console.log("storeData : ", storeData);
        //"list-store-" + storeData.STORE_NUM
        const { callbackUrl, paramMap } = this.props;
        console.log("[StoreList Props] callbackUrl is :", callbackUrl);
        const showButton = callbackUrl ? (
            <StoreButton
                    storeNum={storeData.STORE_NUM}
                    storeName={storeData.STORE_NAME}
                    callbackUrl={ callbackUrl }
                    paramMap = { paramMap }
                    onClick={
                        this.sendToCallbackUrl(storeData.STORE_NUM, storeData.STORE_NAME, callbackUrl)
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
            >
            <div
                ref={ (element) => { this._nodes.set(storeData.STORE_NUM, element)}}
            >
                <StoreListItem 
                    storeName={storeData.STORE_NAME}
                    storeNum={storeData.STORE_NUM}
                    address={storeData.ADDRESS}
                    regionName={storeData.REGION_NAME}
                    telephone={storeData.TEL_NO}
                    storeData = { storeData }
                    storeListItemRef = { el => this.storeListItems = el }
                    selectedStore = { this.state.selectedStore === storeData.STORE_NUM ? storeData.STORE_NUM : null }
                    onClickCapture={ this.zoomToStore(storeData) }
                />
            </div>
                
                {/* <div key={storeData.STORE_NUM} 
                    className={ this.state.selectedStore===storeData.STORE_NUM ? "selected-store row" : "row" } 
                    onClickCapture={ this.zoomToStore(storeData) }
                    >
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
                </div> */}
                <div className="col-12" onClick={ (e) => {
                    e.stopPropagation() }
                }> { showButton }
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
        // const height = this.el.clientHeight;
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
            top: scrollHeight,
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
        // console.log("StoreList: ", this.props.storeList);
        // console.log("searchTerm: ", this.props.searchTerm);
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
                        <ul className="lithis.st-group storeList">
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

function mapStateToProps({ storeList, storeScroll }) {
    // console.log("searchTerm present? :", searchTerm)
    // console.log("storeList present? :", storeList);
    return { storeList, storeScroll }; //es6 magic storeList:storeList
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreList);
