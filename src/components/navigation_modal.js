import React, { Component } from 'react';

class NavigationModal extends Component {
    render(){
        return (
            <div className="modal-content" data-backdrop="static" data-keyboard="false">
                <div className="modal-body">
                    <p>Proceed with this store?</p>
                    <h5>
                        { this.props.selectedStoreName }
                    </h5>
                    
                    { this.props.selectedStoreAddress }    
                </div>
                <div className="modal-footer">
                    <button 
                        className="btn btn-secondary" 
                        onClick={this.props.handleCloseModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick= { 
                            this.props.sendToCallbackUrl  
                        }
                    >
                    Confirm
                    </button>
                </div>
            </div>
        )
    }    
}    

export default NavigationModal;
