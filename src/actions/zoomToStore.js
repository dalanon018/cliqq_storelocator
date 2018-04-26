
export const ZOOM_TO_STORE = 'ZOOM_TO_STORE';

export function zoomToStore(store){
    //process store details
    // console.log("zoom in action: ", store);
    return {
            type: ZOOM_TO_STORE,
            payload: store.STORE_NUM
    }
}
