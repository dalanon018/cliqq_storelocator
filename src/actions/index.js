import axios from 'axios';

export const FETCH_STORE = 'FETCH_STORE';
export const FETCH_STORE_AROUND_LOCATION = 'FETCH_STORE_AROUND_LOCATION';
export const FETCH_STORE_FAILED = 'FETCH_STORE_FAILED';
export const FETCH_STORE_BY_MOBILE = 'FETCH_STORE_BY_MOBILE';

const config = { headers: { 'Content-Type': 'multipart/form-data' } };

//const ROOT_URL = `https://mapservice-backend.philseven.com/api/web/v3/locators/dropdowndata`;
const STORE_LIST_URL = `https://mapservice-backend.philseven.com/api/web/v3/locators/storelist`;
// const CLIQQ_APP_STORE_LOCATOR_URL = `https://emap.cliqq.net.com/api/web/v3/locators/storelist`;
export async function fetchStores(searchTerm) {
	// const url=`${ROOT_URL}?term=${searchTerm}`;
	// const storeListURL =`${STORE_LIST_URL}?location=${searchTerm}`;
	// console.log("Complete URL is : ", storeListURL);
	// const fetchStoreForm = {
	//     term: searchTerm
	// }
  var request
  let request1 = await axios.get('https://mapservice-backend.philseven.com/api/web/v3/locators/dropdowndata', {
    params: {
      term: searchTerm
    }})
    if(request1.data.length === 1){
      request = await axios.post(
     		STORE_LIST_URL,
     		generateFetchStoreFormData(request1.data[0].value),
     		config
   	  );
    } else {
      request = await axios.post(
     		STORE_LIST_URL,
     		generateFetchStoreFormData(searchTerm),
     		config
   	  );
    }


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

export function getStoresByMobile(mobileNumber){
	let storesByMobile = axios.post(
		STORE_LIST_URL,
		generateFetchStoreByMobileFormData(mobileNumber),
		config
	)

	return {
		type: FETCH_STORE_BY_MOBILE,
		meta: { mobileNumber: 'mobileNumber'},
		payload: storesByMobile
	}
}

function generateFetchStoreFormData(searchTerm) {
  let bodyFormData = new FormData();
  var test = bodyFormData.set('location', searchTerm);
  console.log ('test ' + test)
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

function generateFetchStoreByMobileFormData(mobileNumber){
	let bodyFormData = new FormData();

	bodyFormData.set('mobileNumber', mobileNumber);

	return bodyFormData;
}
