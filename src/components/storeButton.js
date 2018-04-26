import React, { Component } from 'react';

class StoreButton  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false
        } ;
        this._onClickHandler = this._onClickHandler.bind(this);
    }

    _onClickHandler(e) {
        const { callbackUrl } = this.props;
        this.sendToCallbackUrl(callbackUrl)
    }

    sendToCallbackUrl = (callbackUrl) => {
        console.log("Returning to ", callbackUrl);
        console.log("Stopping Propagation!");
        const { storeNum, storeName } = this.props;
        return window.location.replace(
            `${callbackUrl}?type=cod&storeId=${storeNum}&storeName=${storeName}`
        );
    };

    render () {
        return (
            <button
                data-id="__setLocation"
                data-storenum={this.props.storeNum}
                data-storename={this.props.storeName}
                type="button"
                className="button-set-store btn btn-success btn-lg"
                onClick={ this._onClickHandler }
            >
                Set Store{" "}
            </button>
        ) ;
    }
}

export default StoreButton
