// src/services/authService.js
import API from '../../services/api';

/* ─────────────────────────────────────────────────────────────
   TOKEN STORAGE HELPERS
   Keeps token management in one place — easy to swap to
   httpOnly cookies or a secure storage lib later.
───────────────────────────────────────────────────────────── */
const TOKEN_KEY   = 'bb_access_token';
const REFRESH_KEY = 'bb_refresh_token';
const ROLE_KEY    = 'bb_role';

export const tokenStorage = {
  set(accessToken, refreshToken, role) {
    localStorage.setItem(TOKEN_KEY,   accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(ROLE_KEY,    role);
  },
  getAccess()  { return localStorage.getItem(TOKEN_KEY);   },
  getRefresh() { return localStorage.getItem(REFRESH_KEY); },
  getRole()    { return localStorage.getItem(ROLE_KEY);    },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
  isLoggedIn() { return !!localStorage.getItem(TOKEN_KEY); },
};

/* ─────────────────────────────────────────────────────────────
   AUTH SERVICE
───────────────────────────────────────────────────────────── */
const authService = {

  /* ── ADMIN ─────────────────────────────────────────────── */

  /**
   * POST /auth/admin/login
   * @param {string} email
   * @param {string} password
   * @returns {{ accessToken, refreshToken, user }}
   */
  adminLogin: (email, password) =>
    API.post('/auth/admin/login', { email, password }),

  /* ── CUSTOMER OTP ───────────────────────────────────────── */

  /**
   * POST /auth/customer/send-otp
   * @param {string} phone  — full number with country code e.g. "+919876543210"
   * @returns {{ message: string }}
   */
  sendOTP: (phone) =>
    API.post('/auth/customer/send-otp', { phone }),

  /**
   * POST /auth/customer/verify-otp
   * @param {string} phone
   * @param {string} otp   — 6-digit string
   * @returns {{ accessToken, refreshToken, user, isNewUser }}
   */
  verifyOTP: (phone, otp) =>
    API.post('/auth/customer/verify-otp', { phone, otp }),

  /**
   * POST /auth/customer/register
   * Called after OTP verification when isNewUser === true
   * Sends the user's name to complete profile setup.
   * @param {string} phone
   * @param {string} name
   * @param {string} email  (optional)
   * @returns {{ user }}
   */
  completeProfile: (phone, name, email = '') =>
    API.post('/auth/customer/register', { phone, name, email }),

  /* ── TOKEN ──────────────────────────────────────────────── */

  /**
   * POST /auth/refresh-token
   * @param {string} refreshToken
   * @returns {{ accessToken, refreshToken }}
   */
  refreshToken: (refreshToken) =>
    API.post('/auth/refresh-token', { refreshToken }),

  /**
   * POST /auth/logout  (invalidates refresh token server-side)
   */
  logout: () => {
    const refreshToken = tokenStorage.getRefresh();
    tokenStorage.clear();
    return refreshToken
      ? API.post('/auth/logout', { refreshToken }).catch(() => {})
      : Promise.resolve();
  },

  /* ── ADMIN: FORGOT PASSWORD ─────────────────────────────── */

  /**
   * POST /auth/admin/forgot-password
   * @param {string} email
   * @returns {{ message: string }}
   */
  forgotPassword: (email) =>
    API.post('/auth/admin/forgot-password', { email }),

  /**
   * POST /auth/admin/reset-password
   * @param {string} token   — from email link
   * @param {string} password
   * @returns {{ message: string }}
   */
  resetPassword: (token, password) =>
    API.post('/auth/admin/reset-password', { token, password }),
};

export default authService;