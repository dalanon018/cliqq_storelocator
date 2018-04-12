import React, { Component } from 'react';
// import { GoogleMap, Marker } from "react-google-maps";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { zoomToStore } from '../actions/zoomToStore';
class StoreList extends Component {

    constructor(props) {
        super(props);
        this.state = {} ;
        this.zoomToStore = this.zoomToStore.bind(this);
    }

    zoomToStore(individualStoreData){
        console.log("Zoom to store: ", individualStoreData.STORE_NAME);
        this.props.zoomToStore(individualStoreData)
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.storeList && prevProps.storeList["0"] !== this.props.storeList["0"]){
            console.log("rerendering......");
            // this.render();
        }
    }

    renderStore(storeData){

        console.log("storeData : " , storeData);

        return (
            
            <li className="list-group-item" key={storeData.STORE_NUM} onClick={ () => this.zoomToStore(storeData) } >
                <div key={ storeData.STORE_NUM } className="row">
                    <div className="col-2">
                        <span className="store-number"> {storeData.STORE_NUM} </span>
                    </div>
                    <div className="col-10">
                        <b>{storeData.STORE_NAME}</b>
                        <br/>
                        <span className="text-left">
                            <p>{storeData.ADDRESS}</p>
                            <p>{storeData.REGION_NAME}</p>
                        </span>
                        {/* <p>{individualStoreData.CITY}</p> */}

                    </div>
                </div>
            </li>
            
            // <li key={individualStoreData.STORE_NUM} >
            //     <div key={ individualStoreData.STORE_NUM } className="row">
            //         <div className="col-1">{individualStoreData.STORE_NUM}</div>
            //         <div className="col-10">
            //         <b>{individualStoreData.STORE_NAME}</b>
            //         <br/>
            //         <span>{individualStoreData.ADDRESS}</span>
            //         <p>{individualStoreData.CIY}</p>
            //         <p>{individualStoreData.REGION_NAME}</p>
            //         </div>
            //     </div>
            // </li>
        );
    }

    render() {
        console.log("StoreList: " , this.props.storeList);
        console.log("searchTerm: " , this.props.searchTerm);
        let storeProps = this.props.storeList["0"] || [];
        let stores = []
        if(this.props.storeList && storeProps.length){
            stores = storeProps.map( storeData => {
                return storeData;
            })
        }

        console.log("Stores! : ", stores);

        if(!stores.length && this.props.storeList["1"]) {
            console.log("no store found!");
            console.log("this.props.storeList.status : ", this.props.storeList.status)
            
            return (
                <div className="pt-2 pl-5 pr-5">
                    <h4>No Stores Found.</h4>
                </div>
            )
        }

        if(stores.length){
            return (
                <div className="pt-2 pl-5 pr-5">
                    <h4>Store List</h4>
                    <div>
                        <ul className="list-group storeList">
                            { stores.map( (storeData,idx) =>
                                this.renderStore(storeData)
                            )}
                        </ul>
                    </div>
                </div>
            )
        }

        return (
            <div className="pt-2 pl-5 pr-5">

            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({zoomToStore}, dispatch)
}

function mapStateToProps({ storeList }) {
    // console.log("searchTerm present? :", searchTerm)
    console.log("storeList present? :", storeList)
    return { storeList } //es6 magic storeList:storeList
}



export default connect(mapStateToProps,mapDispatchToProps)(StoreList);
