import { combineReducers } from 'redux';
import StoreReducer from './reducer_store';
import SearchTermReducer from './reducer_search_term';
const rootReducer = combineReducers({
    storeList: StoreReducer,
    searchTerm: SearchTermReducer
})

export default rootReducer;
