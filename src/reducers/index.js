import { combineReducers } from 'redux';
import StoreReducer from './reducer_store';

const rootReducer = combineReducers({
    storeList: StoreReducer
})

export default rootReducer;
