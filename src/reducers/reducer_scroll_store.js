import { SCROLL_TO_STORE } from '../actions/scrollToStore';

export default function(state=[] , action){
    // console.log("Reducer SCROLL_TO_STORE activated: ",action);
    // console.log("watching for action: ",SCROLL_TO_STORE);
    switch(action.type){
        case SCROLL_TO_STORE:
            console.log("SCROLL_TO_STORE reached, returning payload for scroll to Store");
            return [ action.payload];
        default:
            return state;
    }
}
