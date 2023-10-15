const axios = require('axios').default;

export function getData(url = "", query = "") {
    const res = axios.get(url + (query ? "?" + query : ""), {
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            'withCredentials': false,
        }
    }).then(resp => {
        return resp.data;
    });

    return res;
}

export function postData(url = "", postBody)
{
    const res = axios.post(url, postBody, {
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            'withCredentials': false,
        }
    }).then(resp => {
        return resp.data;
    });

    return res;
}