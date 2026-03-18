import axios from "axios";
import { getAccessToken, clearTokens } from "../utils/tokenManager";

/* -------------------- */
/* AXIOS INSTANCE */
/* -------------------- */

const API = axios.create({

  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json"
  },

  timeout: 15000

});


/* -------------------- */
/* REQUEST INTERCEPTOR */
/* Attach JWT Token */
/* -------------------- */

API.interceptors.request.use(

  (config) => {

    const token = getAccessToken();

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


/* -------------------- */
/* RESPONSE INTERCEPTOR */
/* Global Error Handling */
/* -------------------- */

API.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    const status = error.response?.status;

    /* Unauthorized / token expired */

    if (status === 401) {

      console.warn("Session expired. Logging out.");

      clearTokens();

      window.location.href = "/login";

    }

    /* Forbidden */

    if (status === 403) {

      console.warn("Access denied.");

    }

    /* Server error */

    if (status >= 500) {

      console.error("Server error. Try again later.");

    }

    return Promise.reject(error);

  }

);

export default API;