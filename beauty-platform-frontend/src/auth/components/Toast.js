// src/auth/components/Toast.js
import React from 'react';
import { useToast } from '../hooks/useToast';

/**
 * Global toast — reads from AuthContext via useToast hook.
 * Renders once in AuthPage at root level.
 */
export default function Toast() {
  const toast = useToast();

  return (
    <div className={`auth-toast${toast ? ' visible' : ''}`} aria-live="polite">
      {toast?.message}
    </div>
  );
}