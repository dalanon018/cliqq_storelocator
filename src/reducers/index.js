import { combineReducers } from 'redux';
import StoreReducer from './reducer_store';
import SearchTermReducer from './reducer_search_term';
import StoreZoomReducer from './reducer_store_zoom';
const rootReducer = combineReducers({
    storeList: StoreReducer,
    searchTerm: SearchTermReducer,
    zoomToStore: StoreZoomReducer,
    currentLocation: StoreReducer
})

export default rootReducer;
