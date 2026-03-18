// src/auth/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../services/authService';

/**
 * ProtectedRoute — guards any route that requires a logged-in customer.
 *
 * Behaviour:
 *  ✅  Token present + role is 'customer'  →  render children normally
 *  🔁  No token at all                    →  redirect to /auth?redirect=<current path>
 *  🔁  Token present but role is 'admin'  →  redirect admin away to /admin/dashboard
 *
 * The `redirect` query param is picked up by AuthPage after successful
 * login so the user lands back where they came from.
 *
 * Usage in App.js:
 *   <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const token = tokenStorage.getAccess();
  const role  = tokenStorage.getRole();

  /* Not logged in → go to auth, remember where we wanted to go */
  if (!token) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  /* Admin accidentally hitting a customer route → send to admin panel */
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}