// src/auth/pages/AdminAuthPage.js
import React, { useCallback, useSyncExternalStore } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

import '../styles/auth.css';

import { tokenStorage } from '../services/authService';
import { AuthProvider, useAuth } from '../../context/AuthContext';

import Shell from '../layout/Shell';
import Toast from '../components/Toast';

import AdminLoginView from '../views/AdminLoginView';
import ForgotPasswordView from '../views/ForgotPasswordView';
import SuccessView from '../views/SuccessView';

function AdminRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { view, setView } = useAuth();

  const getRedirectTarget = useCallback((fallback) => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    return redirect ? decodeURIComponent(redirect) : fallback;
  }, [location.search]);

  const handleAdminRedirect = useCallback(() => {
    navigate(getRedirectTarget('/admin/dashboard'), { replace: true });
  }, [navigate, getRedirectTarget]);

  const renderView = () => {
    if (view === 'forgot') return <ForgotPasswordView />;
    if (view === 'admin-success') {
      return (
        <SuccessView
          variant="admin"
          onRedirect={handleAdminRedirect}
          redirectDelay={2000}
        />
      );
    }
    return <AdminLoginView />;
  };

  return (
    <Shell>
      {renderView()}
      <Toast />
    </Shell>
  );
}

function subscribeToAuthStorage(onStoreChange) {
  const handler = () => onStoreChange();
  window.addEventListener('oraya-auth-changed', handler);
  return () => window.removeEventListener('oraya-auth-changed', handler);
}

function getAuthSnapshot() {
  return `${tokenStorage.getAccess() || ''}|${tokenStorage.getRole() || ''}`;
}

export default function AdminAuthPage() {
  const location = useLocation();
  useSyncExternalStore(subscribeToAuthStorage, getAuthSnapshot, getAuthSnapshot);

  const token = tokenStorage.getAccess();
  const role = tokenStorage.getRole();

  if (token && role === 'admin') {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    const target = redirect
      ? decodeURIComponent(redirect)
      : '/admin/dashboard';

    return <Navigate to={target} replace />;
  }

  return (
    <AuthProvider>
      <AdminRouter />
    </AuthProvider>
  );
}