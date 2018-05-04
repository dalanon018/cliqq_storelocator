import React, { Component } from 'react'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { zoomToStore } from "../actions/zoomToStore";
import { scrollToStore } from "../actions/scrollToStore";

class StoreListItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedStore: ''
        };
    }
                
    zoomToStore = (individualStoreData) => (event) => {
        console.log("StoreListItem Zoom to store: ", individualStoreData.STORE_NAME);
        event.stopPropagation();
        this.props.zoomToStore(individualStoreData);
        this.setState({
            selectedStore: individualStoreData.STORE_NUM
        })
        this.props.scrollToStore(individualStoreData.STORE_NUM);
        
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.storeScroll !== this.props.storeScroll){
            console.log("Update this shit item and highlight green the fucking selected");
        }
    }

    render(){
        const { storeData, storeNum, storeName, address, regionName, selectedStore } = this.props;
        const scrollToListItem = this.props.storeScroll
        const isSelectedStore = scrollToListItem && scrollToListItem[0] && scrollToListItem[0] === storeNum ? true : false
        console.log("is selectedStore?? : ", isSelectedStore);
        return (
            <div
                className={ isSelectedStore ? "selected-store row align-items-center" : "row align-items-center" }
                onClickCapture = { this.zoomToStore(storeData) }
            >
                <div className="col-4 align-self-center">
                    <span className="store-number">
                        {" "}
                        {storeNum}
                        {" "}
                    </span>
                </div>
                <div className="col-8">
                    <b>{storeName}</b>
                    <br />
                    <span className="text-left">
                        <p>{address}</p>
                        <p>{regionName}</p>
                    </span>
                </div>
            </div>
            
        )

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ zoomToStore, scrollToStore }, dispatch);
}

function mapStateToProps({ storeScroll }) {
    return { storeScroll };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreListItem);
