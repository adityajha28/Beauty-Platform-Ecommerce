import axios from "axios";

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../utils/tokenManager";
import { tokenStorage } from "../auth/services/authService";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/** Auth endpoints that must NOT trigger a global logout redirect on 401 */
function isPublicAuthRequest(url = "") {
  return /\/auth\/(admin\/login|admin\/forgot-password|admin\/reset-password|customer\/(send-otp|verify-otp|register)|refresh-token|logout)/.test(
    url
  );
}

function syncAccessToken(accessToken) {
  if (!accessToken) return;
  setAccessToken(accessToken);
  if (localStorage.getItem("bb_access_token")) {
    localStorage.setItem("bb_access_token", accessToken);
  }
}

function syncRefreshToken(refreshToken) {
  if (!refreshToken) return;
  setRefreshToken(refreshToken);
  if (localStorage.getItem("bb_refresh_token")) {
    localStorage.setItem("bb_refresh_token", refreshToken);
  }
}

function clearSessionAndRedirect() {
  const path = window.location.pathname;
  const role = localStorage.getItem("bb_role");
  const isAdminSession = path.startsWith("/admin") || role === "admin";

  tokenStorage.clear();

  if (isAdminSession) {
    const redirect = encodeURIComponent(path.startsWith("/admin") ? path : "/admin/dashboard");
    window.location.href = `/admin/login?redirect=${redirect}`;
    return;
  }

  window.location.href = "/auth?mode=login";
}

/* REQUEST INTERCEPTOR */
API.interceptors.request.use((config) => {
  const token = getAccessToken() || tokenStorage.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* RESPONSE INTERCEPTOR */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    /* Let login / OTP forms show their own errors */
    if (originalRequest.skipAuthRedirect || isPublicAuthRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = getRefreshToken() || tokenStorage.getRefresh();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/refresh-token",
        { refreshToken }
      );

      const newAccessToken = res.data.accessToken;
      const newRefreshToken = res.data.refreshToken;

      syncAccessToken(newAccessToken);
      if (newRefreshToken) {
        syncRefreshToken(newRefreshToken);
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(originalRequest);
    } catch {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }
  }
);

export default API;
