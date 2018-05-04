export const SCROLL_TO_STORE = 'SCROLL_TO_STORE';

export function scrollToStore(store_id){
    //process store details
    // console.log("zoom in action: ", store);
    return {
            type: SCROLL_TO_STORE,
            payload: store_id
    }
}
