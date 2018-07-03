import React, { Component } from "react";
import ReactDOM from 'react-dom'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { zoomToStore } from "../actions/zoomToStore";
import { setIsBlockingTrue } from "../actions/setIsBlocking";
import StoreButton from "../components/storeButton";
import StoreListItem from "../components/store_list_item";
import scrollIntoView from "scroll-into-view";
import NavigationModal from "../components/navigation_modal";
import ReactModal from "react-modal";
import { scrollToStore } from "../actions/scrollToStore";

ReactModal.setAppElement("#root");

class StoreList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStoreButton: false,
            selectedStore: '',
            modalShown: false,
            selectedStoreNumber: '',
            selectedStoreName:'',
            selectedStoreAddress:''
        };
        this.callZoomToStore = this.callZoomToStore.bind(this);
        this.backToTop = this.backToTop.bind(this);
        this.sendToCallbackUrl = this.sendToCallbackUrl.bind(this);
        this.storeLists = [];
        this._nodes = new Map();
        this.handleCloseModal = this.handleCloseModal.bind(this);

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
        // console.log("Store List mounted. [props]: ", this.props);
        this.setState((prevState, props) => ({
            showStoreButton: this.props.callbackUrl ? true : false,
        }));

    }

    sendToCallbackUrl= () => (event) => {
        const { paramMap, callbackUrl } = this.props;

        console.log("Returning to ", callbackUrl);
        // console.log("Stopping Propagation!");
        event.stopPropagation();
        const { selectedStoreNumber, selectedStoreName } = this.state;
        let paymentType = paramMap.modePayment ? paramMap.modePayment : 'cod'

        // this.toggleModal();
        let extendedUrlParam = paramMap.orderId ? "&orderId="+paramMap.orderId+"&term_maps" : null
        if(extendedUrlParam){
            console.log("Extended Url!: ", `${callbackUrl}?type=${paymentType}&storeId=${selectedStoreNumber}&storeName=${selectedStoreName}`+extendedUrlParam)
            return window.location.replace(
                `${callbackUrl}?type=${paymentType}&storeId=${selectedStoreNumber}&storeName=${selectedStoreName}`+extendedUrlParam
            );
        }
        else {
            console.info("Normal url");
            // return window.location = (
            //     `${callbackUrl}?type=${paymentType}&storeId=${selectedStoreNumber}&storeName=${selectedStoreName}`
            // );
            return window.location = 'https://www.google.com';
        }
    }

    callZoomToStore = (individualStoreData) => (event) => {
        console.log("Store List callZoomToStore: ", individualStoreData.STORE_NAME);
        // event.stopPropagation();
        this.props.zoomToStore(individualStoreData);
        this.props.scrollToStore(individualStoreData.STORE_NUM);
        this.setState({
            selectedStore: individualStoreData.STORE_NUM
        })

    }

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

            scrollIntoView(selectedNode,{
                time:0,
                align: {
                    top: 0
                }
            } )

            selectedNode.click();
        }
    }

    renderStore(storeData) {
        // console.log("storeData : ", storeData);
        //"list-store-" + storeData.STORE_NUM
        const { callbackUrl } = this.props;
        console.log("[StoreList Props] callbackUrl is :", callbackUrl);
        const showButton = callbackUrl ? (
            <StoreButton
                storeNum={storeData.STORE_NUM}
                storeName={storeData.STORE_NAME}
                handleClick={ (event) => {
                        this.toggleModal(storeData.STORE_NUM, storeData.STORE_NAME, storeData.ADDRESS)
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
                        handleZoomToStore={ this.callZoomToStore(storeData) }
                    />
                </div>
                <div className="col-12" >
                    { showButton }
                </div>
            </li>
        );
    }

    scrollToBottom() {
        console.log("scrolling to bottom");
        const scrollHeight = this.el.scrollHeight;

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

    toggleModal = (storeNumber, storeName, address) => {
        this.setState({
            modalShown: true,
            selectedStoreNumber: storeNumber,
            selectedStoreName: storeName,
            selectedStoreAddress: address
        });
    }

    handleCloseModal = () => {
        this.setState({ modalShown: false  });
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
                    {/* <NavigationPrompt when={ this.props.isBlocking } >
                        {
                            ({onConfirm, onCancel}) => (
                                <NavigationModal
                                    when={this.props.isBlocking} onCancel={onCancel} onConfirm={onConfirm}
                                />
                            )
                        }
                    </NavigationPrompt> */}
                    <ReactModal
                        isOpen={ this.state.modalShown }
                        contentLabel="Confirm Selection"
                        onRequestClose={ this.handleCloseModal }
                        shouldCloseOnEsc={false}
                        shouldCloseOnOverlayClick={false}
                        shouldFocusAfterRender={true}
                        className="confirm-modal"
                    >
                        <NavigationModal
                            selectedStoreName={this.state.selectedStoreName}
                            selectedStoreAddress={this.state.selectedStoreAddress}
                            handleCloseModal={ this.handleCloseModal }
                            sendToCallbackUrl= { (event) => {
                                this.sendToCallbackUrl()(event) }
                            }
                        />

                    </ReactModal>
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
    return bindActionCreators({ zoomToStore, scrollToStore, setIsBlockingTrue }, dispatch);
}

function mapStateToProps({ storeList, storeScroll, isBlocking }) {
    // console.log("searchTerm present? :", searchTerm)
    // console.log("isBlocking present? :", isBlocking);
    return { storeList, storeScroll, isBlocking }; //es6 magic storeList:storeList
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreList);
