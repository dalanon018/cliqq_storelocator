import { FETCH_STORE_TERM } from '../actions/getSearchTerm';

export default function(state=[], action){
    console.log("Reducer Search Term Action received: ",action);
    switch(action.type){
        case FETCH_STORE_TERM:
            return [ action.payload ];
        default:
            return state;
    }
}
