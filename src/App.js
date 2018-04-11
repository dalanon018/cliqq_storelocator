import React, { Component } from 'react';
// import logo from './logo.svg';
import seven_eleven_logo from './header3.png';
import './App.css';
import SearchBar from './containers/search_bar';
import MapContainer from './containers/map_container';
import StoreList from './containers/store_list';
class App extends Component {
  render() {
    return (
      <div className="App container-fluid pr-0 pl-0">
        <header className="App-header navbar-pale">
          <img src={seven_eleven_logo} className="App-logo" alt="logo" />
          {/* <h1 className="App-title">Welcome to React</h1> */}
        </header>
        {/* <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        <div className="row">
            <div className="sidebar">
                <SearchBar />
                <StoreList />
            </div>
            <div className="map">
                <MapContainer/>
            </div>
        </div>

      </div>

    );
  }
}

export default App;
