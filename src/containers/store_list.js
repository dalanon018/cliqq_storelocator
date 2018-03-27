import React, { Component } from 'react';
// import { GoogleMap, Marker } from "react-google-maps";
import { connect } from 'react-redux';

class StoreList extends Component {

    renderStore(storeData){

        console.log("storeData : " , storeData);

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
        const storeLocations = (storeData => {
            return storeData
        })
        return (
            <div className="storeList pt-4 pl-5 pr-5">
                <h3>Store list</h3>
                <div>
                    <ul className="list-group">
                        { this.props.storeList.map( (storeData,idx) =>
                            this.renderStore(storeData)
                        )}
                    </ul>
                </div>
            </div>

        )
    }
}

function mapStateToProps({ storeList }) {
    return { storeList } //es6 magic storeList:storeList
}

export default connect(mapStateToProps)(StoreList);
