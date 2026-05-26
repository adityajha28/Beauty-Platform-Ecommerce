// src/auth/pages/AuthPage.js
import React, { useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

import '../styles/auth.css';

import { tokenStorage, AUTH_FLOW_KEY } from '../services/authService';
import { userStorage } from '../../utils/userStorage';
import { AuthProvider, useAuth } from '../../context/AuthContext';

import Shell from '../layout/Shell';
import Toast from '../components/Toast';

import UserPhoneView from '../views/UserPhoneView';
import OTPView from '../views/OTPView';
import SuccessView from '../views/SuccessView';
import AuthTabSync from '../components/AuthTabSync';

function resolvePostAuthPath(locationSearch) {
  const params = new URLSearchParams(locationSearch);
  const redirect = params.get('redirect');
  const after = redirect ? decodeURIComponent(redirect) : '/account';

  const flow = sessionStorage.getItem(AUTH_FLOW_KEY);
  const isSignup =
    flow === 'signup' ||
    userStorage.getIsNewUser();

  const needsOnboarding =
    isSignup &&
    !userStorage.isOnboardingDone() &&
    userStorage.getAddresses().length === 0;

  if (needsOnboarding) {
    return {
      pathname: '/onboarding',
      search: `?redirect=${encodeURIComponent(after)}`,
    };
  }

  const path = after.startsWith('/') ? after : `/${after}`;
  const q = path.indexOf('?');
  if (q === -1) return { pathname: path };
  return { pathname: path.slice(0, q), search: path.slice(q) };
}

function AuthRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { view } = useAuth();

  const handleUserRedirect = useCallback(() => {
    const target = resolvePostAuthPath(location.search);
    navigate(target, { replace: true });
  }, [navigate, location.search]);

  const renderView = () => {
    if (view === 'phone') return <UserPhoneView />;
    if (view === 'otp') return <OTPView />;
    if (view === 'success') {
      return (
        <SuccessView
          variant="user"
          onRedirect={handleUserRedirect}
          redirectDelay={2000}
        />
      );
    }
    return <UserPhoneView />;
  };

  /* Logged-in user opened /auth — skip only if not finishing OTP success */
  const token = tokenStorage.getAccess();
  const role = tokenStorage.getRole();

  if (token && role === 'admin') {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    const target = redirect ? decodeURIComponent(redirect) : '/admin/dashboard';
    return <Navigate to={target} replace />;
  }

  if (token && role === 'customer' && view !== 'otp' && view !== 'success') {
    const target = resolvePostAuthPath(location.search);
    return <Navigate to={target} replace />;
  }

  return (
    <Shell>
      <AuthTabSync />
      {renderView()}
      <Toast />
    </Shell>
  );
}

export default function AuthPage() {
  return (
    <AuthProvider>
      <AuthRouter />
    </AuthProvider>
  );
}
