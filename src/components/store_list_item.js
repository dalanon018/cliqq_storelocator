import React, { Component } from 'react'
import { connect } from "react-redux";

class StoreListItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedStore: ''
        };
        this.displayPhone = this.displayPhone.bind(this);
    }

    displayPhone = (telephone) => {
        let telText = telephone ? telephone : "(No telephone)"
       return (
            <div>
                <i className="fas fa-phone" />{" "}{telText}
            </div>
        );

    }

    render(){
        const { storeNum, storeName, address, regionName, telephone } = this.props;
        const scrollToListItem = this.props.storeScroll
        const isSelectedStore = scrollToListItem && scrollToListItem[0] && scrollToListItem[0] === storeNum ? true : false
        // console.log("is selectedStore?? : ", isSelectedStore);
        return (
            <div
                className={ isSelectedStore ? "selected-store row align-items-center" : "row align-items-center" }
                onClickCapture = {  this.props.handleZoomToStore }
            >
                <div className="col-4 align-self-start">
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
                        <span>{this.displayPhone(telephone)}</span>
                    </span>
                </div>
            </div>
            
        )

    }
}

function mapStateToProps({ storeScroll }) {
    return { storeScroll };
}

export default connect(mapStateToProps, null)(StoreListItem);
