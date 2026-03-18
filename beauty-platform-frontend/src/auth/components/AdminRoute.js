// src/auth/components/AdminRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../services/authService';

/**
 * AdminRoute — guards every /admin/* route.
 *
 * Behaviour:
 *  ✅  Token present + role is 'admin'   →  render children normally
 *  🔁  No token at all                   →  /auth?redirect=<current path>&mode=admin
 *  🔁  Token present but role is 'customer' →  redirect customer to home
 *
 * The `mode=admin` param tells AuthPage to open on the Admin tab directly
 * so the admin doesn't have to manually switch.
 *
 * Usage in App.js:
 *   <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
 */
export default function AdminRoute({ children }) {
  const location = useLocation();

  const token = tokenStorage.getAccess();
  const role  = tokenStorage.getRole();

  /* Not logged in at all */
  if (!token) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(location.pathname)}&mode=admin`}
        replace
      />
    );
  }

  /* Logged in as customer trying to reach admin panel */
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}