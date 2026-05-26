// src/auth/views/SuccessView.js
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userStorage } from '../../utils/userStorage';
import FormCard    from '../components/FormCard';

/**
 * Success screen shown after:
 *  - Customer OTP verified  (variant = 'user')
 *  - Admin logged in        (variant = 'admin')
 *
 * Props:
 *  variant          'user' | 'admin'
 *  onRedirect       () => void   — called after `delay` ms to navigate away
 *  redirectDelay    number       — ms before onRedirect fires (default 2000)
 */
export default function SuccessView({
  variant       = 'user',
  onRedirect,
  redirectDelay = 2000,
}) {
  const { userName } = useAuth();
  const isAdmin      = variant === 'admin';
  const displayName  = userName || userStorage.getDisplayName();
  const firstName    = displayName?.split(' ')[0] || (isAdmin ? 'Admin' : 'there');

  useEffect(() => {
    if (!onRedirect) return;
    const t = setTimeout(onRedirect, redirectDelay);
    return () => clearTimeout(t);
  }, [onRedirect, redirectDelay]);

  return (
    <FormCard animKey={`success-${variant}`}>
      <div className="success-overlay">
        {/* Icon */}
        <div className={`success-icon${isAdmin ? ' admin-icon' : ''}`}>
          {isAdmin ? '🔐' : '✓'}
        </div>

        {/* Title */}
        <div className="success-title">
          {isAdmin
            ? <>Access <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Granted</em></>
            : <>You're <em style={{ fontStyle: 'italic', color: 'var(--r)' }}>in!</em></>
          }
        </div>

        {/* Subtitle */}
        <div className="success-sub">
          {isAdmin
            ? `Authenticated as Super Admin. Loading the dashboard…`
            : `Welcome to Oraya Beauty, ${firstName}. Your account is verified and ready.`
          }
        </div>

        {/* Animated redirect dots */}
        <div className="success-redirect" aria-live="polite">
          <div className={`redirect-dot${isAdmin ? ' gold' : ''}`} />
          <div className={`redirect-dot${isAdmin ? ' gold' : ''}`} />
          <div className={`redirect-dot${isAdmin ? ' gold' : ''}`} />
          <span>
            {isAdmin
              ? 'Redirecting to admin panel…'
              : 'Setting up your profile…'
            }
          </span>
        </div>
      </div>
    </FormCard>
  );
}