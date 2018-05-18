import { combineReducers } from 'redux';
import StoreReducer from './reducer_store';
import StoreZoomReducer from './reducer_store_zoom';
import StoreScrollReducer from './reducer_scroll_store';
import IsBlockingReducer from './reducer_is_blocking';
const rootReducer = combineReducers({
    storeList: StoreReducer,
    zoomToStore: StoreZoomReducer,
    currentLocation: StoreReducer,
    storeScroll: StoreScrollReducer,
    isBlocking: IsBlockingReducer
})

export default rootReducer;
