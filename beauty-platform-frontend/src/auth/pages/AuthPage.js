// src/auth/pages/AuthPage.js
import React, { useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

import '../styles/auth.css';

import { tokenStorage } from '../services/authService';
import { AuthProvider, useAuth } from '../../context/AuthContext';

import Shell from '../layout/Shell';
import Toast from '../components/Toast';

import UserPhoneView from '../views/UserPhoneView';
import OTPView from '../views/OTPView';
import SuccessView from '../views/SuccessView';

function AuthRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { view } = useAuth();

  const getRedirectTarget = useCallback((fallback) => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    return redirect ? decodeURIComponent(redirect) : fallback;
  }, [location.search]);

  const handleUserRedirect = useCallback(() => {
    navigate(getRedirectTarget('/'), { replace: true });
  }, [navigate, getRedirectTarget]);

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

  return (
    <Shell>
      {renderView()}
      <Toast />
    </Shell>
  );
}

export default function AuthPage() {
  const location = useLocation();
  const token = tokenStorage.getAccess();
  const role = tokenStorage.getRole();

  if (token) {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    const fallback = role === 'admin' ? '/admin/dashboard' : '/';
    const target = redirect ? decodeURIComponent(redirect) : fallback;
    return <Navigate to={target} replace />;
  }

  return (
    <AuthProvider>
      <AuthRouter />
    </AuthProvider>
  );
}