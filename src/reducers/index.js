import { combineReducers } from 'redux';
import StoreReducer from './reducer_store';
import StoreZoomReducer from './reducer_store_zoom';
import StoreScrollReducer from './reducer_scroll_store';
const rootReducer = combineReducers({
    storeList: StoreReducer,
    zoomToStore: StoreZoomReducer,
    currentLocation: StoreReducer,
    storeScroll: StoreScrollReducer
})

export default rootReducer;
