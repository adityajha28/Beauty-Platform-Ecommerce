// src/auth/components/AdminRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../services/authService';

/**
 * AdminRoute — guards every /admin/* route.
 *
 * Behaviour:
 *  ✅  Token present + role is 'admin'   →  render children normally
 *  🔁  No token at all                   →  /admin/login?redirect=<current path>
 *  🔁  Token present but role is 'customer' →  redirect customer to home
 */
export default function AdminRoute({ children }) {
  const location = useLocation();

  const token = tokenStorage.getAccess();
  const role  = tokenStorage.getRole();

  /* Not logged in at all */
  if (!token) {
    return (
      <Navigate
        to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  /* Logged in as customer (or unknown role) — send to admin login, not user home */
  if (role !== 'admin') {
    return (
      <Navigate
        to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}