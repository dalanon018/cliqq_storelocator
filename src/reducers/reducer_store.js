import { FETCH_STORE, FETCH_STORE_AROUND_LOCATION,FETCH_STORE_FAILED, FETCH_STORE_BY_MOBILE } from '../actions/index';
export default function(state=[], action){
    console.log("Reducer Store Action received: ",action);
    switch(action.type){
        case `${FETCH_STORE}_PENDING`:
            console.log("Sending a pending state...");
            return {
                status: 'pending'
            }

        case FETCH_STORE:
            // console.log("returning payload: ", action.payload);
            // console.log("Is there meta? ", action.meta);
            const { term } = action.meta
            if(term){
                return [ action.payload.data, term ]; 
            }
                
            return [ action.payload.data ];
                        
        case FETCH_STORE_AROUND_LOCATION:
            console.log("returning stores around given location:");
            return [ action.payload.data ];
        case FETCH_STORE_FAILED:
            console.log("returning failed get stores:");
            return [ null ];    
        case FETCH_STORE_BY_MOBILE:
            console.log("returning stores by given mobile:");
            const { mobileNumber } = action.meta
            if(mobileNumber){
                return [ action.payload.data, mobileNumber ];
            }

            return [ action.payload.data ];
        default:
            return state;
    }
}
