// src/auth/context/AuthContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';

/* ─── SHAPE ─────────────────────────────────────────────
   mode:       'user' | 'admin'
   userTab:    'login' | 'signup'
   view:       'phone' | 'otp' | 'success' | 'admin-success' | 'forgot'
   phone:      full phone string e.g. "+91 9876543210"
   userName:   string (from signup form)
   toast:      { message, id }  — null when hidden
   loading:    boolean
   error:      { field: string, message: string } | null
───────────────────────────────────────────────────────── */
const initialState = {
  mode:     'user',
  userTab:  'login',
  view:     'phone',
  phone:    '',
  userName: '',
  toast:    null,
  loading:  false,
  error:    null,
};

/* ─── REDUCER ─── */
function authReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode:    action.payload,
        view:    action.payload === 'admin' ? 'admin-login' : 'phone',
        error:   null,
        loading: false,
      };
    case 'SET_USER_TAB':
      return { ...state, userTab: action.payload, error: null };
    case 'SET_VIEW':
      return { ...state, view: action.payload, error: null };
    case 'SET_PHONE':
      return { ...state, phone: action.payload };
    case 'SET_USERNAME':
      return { ...state, userName: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SHOW_TOAST':
      return { ...state, toast: { message: action.payload, id: Date.now() } };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

/* ─── CONTEXT ─── */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setMode     = useCallback((m)    => dispatch({ type: 'SET_MODE',     payload: m }), []);
  const setUserTab  = useCallback((t)    => dispatch({ type: 'SET_USER_TAB', payload: t }), []);
  const setView     = useCallback((v)    => dispatch({ type: 'SET_VIEW',     payload: v }), []);
  const setPhone    = useCallback((p)    => dispatch({ type: 'SET_PHONE',    payload: p }), []);
  const setUserName = useCallback((n)    => dispatch({ type: 'SET_USERNAME', payload: n }), []);
  const setLoading  = useCallback((b)    => dispatch({ type: 'SET_LOADING',  payload: b }), []);
  const setError    = useCallback((e)    => dispatch({ type: 'SET_ERROR',    payload: e }), []);
  const clearError  = useCallback(()     => dispatch({ type: 'CLEAR_ERROR' }), []);
  const showToast   = useCallback((msg)  => dispatch({ type: 'SHOW_TOAST',   payload: msg }), []);
  const hideToast   = useCallback(()     => dispatch({ type: 'HIDE_TOAST' }), []);

  return (
    <AuthContext.Provider value={{
      ...state,
      setMode, setUserTab, setView,
      setPhone, setUserName,
      setLoading, setError, clearError,
      showToast, hideToast,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}