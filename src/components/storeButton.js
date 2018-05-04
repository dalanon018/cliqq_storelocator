import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
class StoreButton  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false,
            isBlocking: false
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
        const { isBlocking } = this.state;
        return (
            <span>
                <Prompt
                    when={isBlocking}
                    message={location =>
                        `Are you sure you want to go to select this store?`
                    }
                />  
                <button
                    data-id="__setLocation"
                    data-storenum={this.props.storeNum}
                    data-storename={this.props.storeName}
                    type="button"
                    className="button-set-store btn btn-success btn-lg"
                    onClick={ (event) => {
                        this.setState({isBlocking:true});
                        this._onClickHandler(event);
                    }}
                >
                Set Store{" "}
                </button>
            </span>
        );
    }
}

export default StoreButton
