// src/auth/pages/AuthPage.js
import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

/* CSS — imported ONCE here, applies to all auth children */
import '../styles/auth.css';

/* Token storage — guards already-logged-in users at the page level */
import { tokenStorage } from '../services/authService';

/* Context */
import { AuthProvider, useAuth } from '../../context/AuthContext';

/* Layout */
import Shell        from '../layout/Shell';
import ModeSwitcher from '../components/ModeSwitcher';
import Toast        from '../components/Toast';

/* Views */
import UserPhoneView      from '../views/UserPhoneView';
import OTPView            from '../views/OTPView';
import SuccessView        from '../views/SuccessView';
import AdminLoginView     from '../views/AdminLoginView';
import ForgotPasswordView from '../views/ForgotPasswordView';

/* ══════════════════════════════════════════════════════════
   INNER ROUTER — lives inside <AuthProvider>
   Reads mode + view from AuthContext and renders the
   correct view component.
══════════════════════════════════════════════════════════ */
function AuthRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, view, setMode, setView } = useAuth();

  /* Read ?mode=admin from URL and pre-select Admin tab */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'admin') {
      setMode('admin');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync mode changes to the correct default view */
  useEffect(() => {
    if (mode === 'admin' && !['admin-login', 'forgot', 'admin-success'].includes(view)) {
      setView('admin-login');
    }
    if (mode === 'user' && !['phone', 'otp', 'success'].includes(view)) {
      setView('phone');
    }
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Resolve the ?redirect= param — used by ProtectedRoute / AdminRoute */
  const getRedirectTarget = useCallback((fallback) => {
    const params   = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    return redirect ? decodeURIComponent(redirect) : fallback;
  }, [location.search]);

  /* Called by SuccessView after user login animation completes */
  const handleUserRedirect = useCallback(() => {
    navigate(getRedirectTarget('/'), { replace: true });
  }, [navigate, getRedirectTarget]);

  /* Called by SuccessView after admin login animation completes */
  const handleAdminRedirect = useCallback(() => {
    navigate(getRedirectTarget('/admin/dashboard'), { replace: true });
  }, [navigate, getRedirectTarget]);

  /* Render the active view based on mode + view state */
  const renderView = () => {
    /* ── USER FLOWS ── */
    if (mode === 'user') {
      if (view === 'phone')   return <UserPhoneView />;
      if (view === 'otp')     return <OTPView />;
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
    }

    /* ── ADMIN FLOWS ── */
    if (mode === 'admin') {
      if (view === 'admin-login') return <AdminLoginView />;
      if (view === 'forgot')      return <ForgotPasswordView />;
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
    }

    return null;
  };

  return (
    <Shell>
      {/* Mode switcher — Customer / Admin pill toggle */}
      <ModeSwitcher />

      {/* Active view — swaps with animation via FormCard key prop */}
      {renderView()}

      {/* Global fixed-position toast */}
      <Toast />
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE EXPORT
   This is the component you attach to <Route path="/auth">.

   Gate logic (runs before any UI renders):
   ┌─────────────────────────────────────────────────────┐
   │  Already logged in as admin?  →  /admin/dashboard   │
   │  Already logged in as user?   →  / (or ?redirect)   │
   │  Not logged in?               →  show auth UI       │
   └─────────────────────────────────────────────────────┘
══════════════════════════════════════════════════════════ */
export default function AuthPage() {
  const location = useLocation();
  const token    = tokenStorage.getAccess();
  const role     = tokenStorage.getRole();

  /* Already authenticated — skip the auth page */
  if (token) {
    const params    = new URLSearchParams(location.search);
    const redirect  = params.get('redirect');
    const fallback  = role === 'admin' ? '/admin/dashboard' : '/';
    const target    = redirect ? decodeURIComponent(redirect) : fallback;
    return <Navigate to={target} replace />;
  }

  /* Not authenticated — render the auth UI */
  return (
    <AuthProvider>
      <AuthRouter />
    </AuthProvider>
  );
}