import axios from "axios";

import {
getAccessToken,
getRefreshToken,
setAccessToken,
clearTokens
} from "../utils/tokenManager";

const API = axios.create({

baseURL:"http://localhost:5000/api",

headers:{
"Content-Type":"application/json"
}

});

/* REQUEST INTERCEPTOR */

API.interceptors.request.use((config)=>{

const token = getAccessToken();

if(token){

config.headers.Authorization = `Bearer ${token}`;

}

return config;

});

/* RESPONSE INTERCEPTOR */

API.interceptors.response.use(

(response)=>response,

async(error)=>{

const originalRequest = error.config;

if(error.response?.status === 401 && !originalRequest._retry){

originalRequest._retry = true;

try{

const refreshToken = getRefreshToken();

const res = await axios.post(

"http://localhost:5000/api/auth/refresh-token",

{refreshToken}

);

const newAccessToken = res.data.accessToken;

setAccessToken(newAccessToken);

originalRequest.headers.Authorization =
`Bearer ${newAccessToken}`;

return API(originalRequest);

}catch(refreshError){

clearTokens();

window.location.href="/login";

}

}

return Promise.reject(error);

}

);

export default API;