import { FETCH_STORE } from '../actions/index';

export default function(state=[], action){
    console.log("Action received: ",action);
    switch(action.type){
        case FETCH_STORE:
            return [ action.payload.data ];
        default:
            return state;
    }
}
