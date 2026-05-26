// src/auth/views/AdminLoginView.js
import React, { useState, useCallback } from 'react';
import { useAuth }       from '../../context/AuthContext';
import authService, { tokenStorage } from '../services/authService';
import FormCard          from '../components/FormCard';
import InputField        from '../components/InputField';
import Checkbox          from '../components/Checkbox';
import SubmitButton      from '../components/SubmitButton';
import ErrorMessage      from '../components/ErrorMessage';
import BackButton        from '../components/BackButton';
import { useNavigate, useLocation } from 'react-router-dom';

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function AdminLoginView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setView, setUserName, showToast } = useAuth();

  const getRedirectTarget = () => {
    const redirect = new URLSearchParams(location.search).get('redirect');
    return redirect ? decodeURIComponent(redirect) : '/admin/dashboard';
  };

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [remember,  setRemember]  = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleLogin = useCallback(async () => {
    setError('');

    /* Client-side validation */
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data } = await authService.adminLogin(normalizedEmail, password);

      if (!data?.accessToken) {
        setError('Login succeeded but no token was returned. Check the API response.');
        return;
      }

      /* Persist tokens (bb_* + access_token for axios) */
      tokenStorage.set(data.accessToken, data.refreshToken, 'admin');

      if (!remember) {
        sessionStorage.setItem('bb_session_only', '1');
      }

      if (data.user?.name || data.user?.email) {
        setUserName(data.user.name || data.user.email);
      }

      showToast('Welcome back, Admin! 🔐');
      navigate(getRedirectTarget(), { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [email, password, remember, setView, setUserName, showToast, navigate, location.search]);

  /* Enter key submit */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleLogin();
  }, [handleLogin]);

  return (
    <FormCard animKey="admin-login">
      <BackButton onClick={() => navigate('/')} label="Back to home" />
      <div className="card-hd">
        <div className="card-title">
          <span className="admin-title-row">
            <span aria-hidden="true">🔐</span>
            Admin <em>Login</em>
          </span>
        </div>
        <div className="card-sub">
          Restricted access — authorised personnel only
        </div>
      </div>

      <div className="fields" onKeyDown={handleKeyDown}>
        <InputField
          label="Email Address"
          icon="✉️"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@orayabeauty.in"
          autoComplete="email"
          name="admin-email"
          delay={0}
        />

        <div className="field" style={{ animationDelay: '.05s' }}>
          <label>Password</label>
          <InputField
            icon="🔒"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            name="admin-password"
          />
          <button
            className="forgot-link"
            onClick={() => setView('forgot')}
            type="button"
          >
            Forgot password?
          </button>
        </div>

        <Checkbox
          id="remember-me"
          checked={remember}
          onChange={e => setRemember(e.target.checked)}
        >
          Remember this device for 30 days
        </Checkbox>
      </div>

      {error && <ErrorMessage message={error} />}

      <SubmitButton
        variant="btn-admin"
        loading={loading}
        onClick={handleLogin}
        style={{ marginTop: '1rem' }}
      >
        🔐 Secure Login
      </SubmitButton>

      <p className="terms-text" style={{ marginTop: '.85rem' }}>
        Admin access is logged. Unauthorised attempts are reported.
      </p>
    </FormCard>
  );
}