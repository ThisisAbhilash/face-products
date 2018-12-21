import { SORT_ORDERS, url } from "./utils";

export const GET_PRODUCT = (page, limit, sortOn) => {
    return new Promise(async (resolve, reject) => {
        let apiUrl = `${url}/api/products?_page=${page}&_limit=${limit}`;
        if(sortOn && sortOn.length) {
            apiUrl = apiUrl + `&_sort=${sortOn}`;
        }
        let data = await (await fetch(apiUrl)).json();
        if(!(data instanceof Error)) {
            return resolve(data);
        }
        return reject(data);
    });
}
