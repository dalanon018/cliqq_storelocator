
export const FETCH_STORE_TERM = 'FETCH_STORE_TERM';
export function getSearchTerm(searchTerm){
    return {
        type: FETCH_STORE_TERM,
        payload: searchTerm
    }
}
