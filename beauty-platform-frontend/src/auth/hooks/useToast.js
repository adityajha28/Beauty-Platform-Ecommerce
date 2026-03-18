// src/auth/hooks/useToast.js
import { useEffect } from 'react';
import { useAuth }   from '../../context/AuthContext';

/**
 * Watches auth context toast state.
 * Auto-dismisses after `duration` ms.
 */
export function useToast(duration = 2800) {
  const { toast, hideToast } = useAuth();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hideToast, duration);
    return () => clearTimeout(t);
  }, [toast, hideToast, duration]);

  return toast;
}