import React, { Component } from 'react';
class StoreButton  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false
        } ;
    }

    // setIsBlockingTrue = () => {
    //     this.setState({isBlocking:true});        
    //     console.info("setting isBlocking to true:", this.state.isBlocking);
    //     this.props.setIsBlockingTrue(true);
    // }

    render () {
        return (
            <div className="store-button">
                <button
                    data-id="__setLocation"
                    data-storenum={this.props.storeNum}
                    data-storename={this.props.storeName}
                    type="button"
                    className="button-set-store btn btn-success btn-lg"
                    data-toggle="modal"
                    data-target="#confirmSelection"
                    onClick={ 
                        this.props.handleClick
                    }
                >
                Set Store{" "}
                </button>
            </div>
        );
    }
}

export default StoreButton

