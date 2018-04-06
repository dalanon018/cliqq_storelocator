import { ZOOM_TO_STORE } from '../actions/zoomToStore';

export default function(state=[], action){
    console.log("Reducer Store Zoom Action received: ",action);
    console.log("watching for action: ",ZOOM_TO_STORE);
    switch(action.type){
        case ZOOM_TO_STORE:
            console.log("returning payload for zoom to Store");
            return [ action.payload];
        default:
            return state;
    }
}
