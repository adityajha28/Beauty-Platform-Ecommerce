// src/auth/views/AdminLoginView.js
import React, { useState, useCallback } from 'react';
import { useAuth }       from '../../context/AuthContext';
import authService, { tokenStorage } from '../services/authService';
import FormCard          from '../components/FormCard';
import InputField        from '../components/InputField';
import Checkbox          from '../components/Checkbox';
import SubmitButton      from '../components/SubmitButton';
import ErrorMessage      from '../components/ErrorMessage';

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function AdminLoginView() {
  const { setView, setUserName, showToast } = useAuth();

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
      const { data } = await authService.adminLogin(email, password);

      /* Persist tokens */
      tokenStorage.set(data.accessToken, data.refreshToken, 'admin');

      /* Optional: store session in sessionStorage if "remember me" unchecked */
      if (!remember) {
        sessionStorage.setItem('bb_session_only', '1');
      }

      if (data.user?.name) setUserName(data.user.name);

      showToast('Welcome back, Admin! 🔐');
      setView('admin-success');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [email, password, remember, setView, setUserName, showToast]);

  /* Enter key submit */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleLogin();
  }, [handleLogin]);

  return (
    <FormCard animKey="admin-login">
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
          placeholder="admin@bellabeauty.in"
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