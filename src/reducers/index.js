import { combineReducers } from 'redux';
import StoreReducer from './reducer_store';
import SearchTermReducer from './reducer_search_term';
import StoreZoomReducer from './reducer_store_zoom';
import StoreScrollReducer from './reducer_scroll_store';
const rootReducer = combineReducers({
    storeList: StoreReducer,
    searchTerm: SearchTermReducer,
    zoomToStore: StoreZoomReducer,
    currentLocation: StoreReducer,
    storeScroll: StoreScrollReducer
})

export default rootReducer;
