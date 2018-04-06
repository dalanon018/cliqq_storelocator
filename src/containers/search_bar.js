import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchStores } from '../actions/index'
import { getSearchTerm } from '../actions/getSearchTerm'
class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = { 'term' :'' };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    onFormSubmit(event){
        //set get store location here
        event.preventDefault(); //prevent default submit form

        this.props.fetchStores(this.state.term);
        this.props.getSearchTerm(this.state.term);
        // this.setState({'term': ''});
    }

    onInputChange(event){
        // console.log("The term is : ", event.target.value);
        this.setState({term: event.target.value});
    }

    render() {
        return(

            <div className="main_search pt-4 pl-5 pr-5 pb-2">
              <div className="row clearfix">
                <div className="mx-auto"><h3>Find a 7-Eleven Store</h3></div>
                <div className="col-12 pl-0 pr-0">
                  <button className="btn m-0 btn-lg btn-success w-100"><i className="fas fa-location-arrow"></i> &nbsp; Use My Location</button>
                </div>
                <div className="col-2"></div>
                <div className="col-12 pt-1 pl-0 pr-0">
                  <span className="line-thru"><h2>OR</h2></span>
                </div>
              </div>
              <div className="row pt-3 clearfix">
                <div className="col-12 pr-0 pl-0">
                    <form onSubmit = { this.onFormSubmit } >
                        <div className="form-label-group">
                        <input id="store_search"
                            className="pt-4 form-control"
                            placeholder="Enter Province or City"
                            autoFocus=""
                            type="text"
                            onChange={this.onInputChange}
                            value= { this.state.term }
                            />
                            <label htmlFor="store_search">Enter Province or City</label>
                        </div>
                        <button className="btn mt-2 btn-lg btn-success w-100"><i className="fas fa-search"></i> &nbsp; Find Stores</button>
                    </form>
                </div>
              </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch){
    return {
        ...bindActionCreators({fetchStores, getSearchTerm}, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(SearchBar);
