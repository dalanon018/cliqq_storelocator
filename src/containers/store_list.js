import React, { Component } from 'react';
// import { GoogleMap, Marker } from "react-google-maps";
import { connect } from 'react-redux';

class StoreList extends Component {

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.storeList !== this.props.storeList){
            this.render();
        }
    }

    renderStore(storeData){

        // console.log("storeData : " , storeData);

        return (
            storeData.map( individualStoreData =>
                <li key={individualStoreData.STORE_NUM} >
                    <div key={ individualStoreData.STORE_NUM } className="row">
                        <div className="col-1">{individualStoreData.STORE_NUM}</div>
                        <div className="col-10">
                            <b>{individualStoreData.STORE_NAME}</b>
                            <br/>
                            <span>{individualStoreData.ADDRESS}</span>
                            <p>{individualStoreData.CIY}</p>
                            <p>{individualStoreData.REGION_NAME}</p>
                        </div>
                    </div>
                </li>
            )
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
        console.log("StoreList: " , this.props.storeList.length);
        console.log("searchTerm: " , this.props.searchTerm.length);
        if(this.props.searchTerm.length >= 1 && this.props.storeList.length <= 1) {
            console.log("no store found!");
            return (
                <div className="pt-2 pl-5 pr-5">
                    <h4>No Store Found</h4>
                </div>
            )
        }

        if(this.props.storeList[0].length >= 2){
            return (
                <div className="pt-2 pl-5 pr-5">
                    <h4>Store List</h4>
                    <div>
                        <ul className="list-group storeList">
                            { this.props.storeList.map( (storeData,idx) =>
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

function mapStateToProps({ storeList, searchTerm }) {
    console.log("searchTerm present? :", searchTerm)
    console.log("storeList present? :", storeList)
    return { storeList, searchTerm } //es6 magic storeList:storeList
}

export default connect(mapStateToProps)(StoreList);
