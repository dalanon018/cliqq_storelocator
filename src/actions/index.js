import axios from 'axios';

export const FETCH_STORE = 'FETCH_STORE';

const ROOT_URL = `https://mapservice-backend.philseven.com/api/web/v3/locators/dropdowndata`
const STORE_LIST_URL=`https://mapservice-backend.philseven.com/api/web/v3/locators/storelist`
export function fetchStores(searchTerm){
    const url=`${ROOT_URL}?term=${searchTerm}`;
    const storeListURL =`${STORE_LIST_URL}?location=${searchTerm}`;
    console.log("Complete URL is : ", storeListURL);
    const fetchStoreForm = {
        term: searchTerm
    }

    const config = { headers: { 'Content-Type': 'multipart/form-data' }}
    let request = axios.post(STORE_LIST_URL, generateFetchStoreFormData(searchTerm), config)

    console.log("request is : ", request);

    return {
        type: FETCH_STORE,
        payload: request,
    }

}

function generateFetchStoreFormData(searchTerm){
    let bodyFormData = new FormData();
    bodyFormData.set('location', searchTerm);

    return bodyFormData
}
