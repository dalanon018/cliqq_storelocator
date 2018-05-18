import React, { Component } from 'react';

class NavigationModal extends Component {
    constructor(props){
        super(props);
        this.handleCloseClick = this.handleCloseClick.bind(this);
    }    

    componentDidMount() {
        const { handleModalCloseClick } = this.props;
    }

    handleCloseClick() {
        const { handleModalCloseClick } = this.props;
    }

    render(){
        console.log("Navigation Modal: THIS PROPS SHOW", this.props.show);
        if(!this.props.show){
            return null;
        } else {
            console.log("Showing Modal:", true);
            return (
                <div className="modal fade" tabIndex="-1" role="dialog" aria-hidden>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Store</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to select {this.props.storeName}?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Confirm</button>
                                <button type="button" 
                                    className="btn btn-secondary" 
                                    data-dismiss="modal" 
                                    onClick={this.props.onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
    }    
}    

export default NavigationModal;
