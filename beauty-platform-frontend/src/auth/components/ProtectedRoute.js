// src/auth/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../services/authService';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const token = tokenStorage.getAccess();
  const role  = tokenStorage.getRole();

  const fullPath = location.pathname + location.search;

  /* Not logged in */
  if (!token) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(fullPath)}`}
        replace
      />
    );
  }

  /* Admin trying to access user routes */
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}