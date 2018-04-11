import axios from 'axios';

export const FETCH_STORE = 'FETCH_STORE';
export const FETCH_STORE_AROUND_LOCATION = 'FETCH_STORE_AROUND_LOCATION';
export const FETCH_STORE_FAILED = 'FETCH_STORE_FAILED';
const config = { headers: { 'Content-Type': 'multipart/form-data' } };
// const ROOT_URL = `https://mapservice-backend.philseven.com/api/web/v3/locators/dropdowndata`;
const STORE_LIST_URL = `https://mapservice-backend.philseven.com/api/web/v3/locators/storelist`;
export async function fetchStores(searchTerm) {
	// const url=`${ROOT_URL}?term=${searchTerm}`;
	// const storeListURL =`${STORE_LIST_URL}?location=${searchTerm}`;
	// console.log("Complete URL is : ", storeListURL);
	// const fetchStoreForm = {
	//     term: searchTerm
	// }

	let request = await axios.post(
		STORE_LIST_URL,
		generateFetchStoreFormData(searchTerm), 
		config
	);

	console.log('request is : ', request);

	return {
		type: FETCH_STORE,
		meta: { term: searchTerm },
		payload: request
	};
}

export function getStoresOnCurrentLocation(locationData) {
	console.log('getStoresOnCurrentLocation: ', locationData);
	let storesAroundLocationRequest = axios.post(
		STORE_LIST_URL,
		generateFetchStoresAroundLocationFormData(locationData),
		config
	);

	return {
		type: FETCH_STORE_AROUND_LOCATION,
		payload: storesAroundLocationRequest
	};
}

function generateFetchStoreFormData(searchTerm) {
	let bodyFormData = new FormData();
	bodyFormData.set('location', searchTerm);

	return bodyFormData;
}

function generateFetchStoresAroundLocationFormData(coords) {
	let bodyFormData = new FormData();
	console.log('latitude : ', coords.latitude);
	console.log('longitude : ', coords.longitude);

	bodyFormData.set('latitude', coords.latitude);
	bodyFormData.set('longitude', coords.longitude);
	bodyFormData.set('distance', '1000');

	console.log('Form Data for getting stores near location: ', JSON.stringify(bodyFormData));
	return bodyFormData;
}
