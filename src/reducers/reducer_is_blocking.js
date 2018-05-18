import { SET_IS_BLOCKING } from '../actions/setIsBlocking';

export default function(state=[], action){
    switch(action.type){
        case SET_IS_BLOCKING:
            return action.payload
        default:
            return state;
    }
}