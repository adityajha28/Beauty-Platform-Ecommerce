// src/auth/views/ForgotPasswordView.js
import React, { useState, useCallback } from 'react';
import { useAuth }  from '../../context/AuthContext';
import authService  from '../services/authService';
import FormCard     from '../components/FormCard';
import BackButton   from '../components/BackButton';
import InputField   from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import ErrorMessage from '../components/ErrorMessage';

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function ForgotPasswordView() {
  const { setView, showToast } = useAuth();

  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSend = useCallback(async () => {
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid admin email address');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      showToast(`Reset link sent to ${email} 📧`);
      /* After 2s, return to admin login */
      setTimeout(() => setView('admin-login'), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send reset link. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [email, setView, showToast]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleSend();
  }, [handleSend]);

  return (
    <FormCard animKey="forgot-pw">
      <BackButton onClick={() => setView('admin-login')} label="Back to Login" />

      <div className="card-hd">
        <div className="card-title">Reset <em>Password</em></div>
        <div className="card-sub">
          {sent
            ? `A reset link has been sent to ${email}. Check your inbox.`
            : 'Enter your admin email to receive a password reset link'
          }
        </div>
      </div>

      {!sent && (
        <>
          <div className="fields" onKeyDown={handleKeyDown}>
            <InputField
              label="Admin Email"
              icon="✉️"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@bellabeauty.in"
              autoComplete="email"
              delay={0}
            />
          </div>

          {error && <ErrorMessage message={error} />}

          <SubmitButton
            variant="btn-admin"
            loading={loading}
            onClick={handleSend}
            style={{ marginTop: '1.25rem' }}
          >
            📧 Send Reset Link
          </SubmitButton>
        </>
      )}

      {sent && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--muted)', fontSize: '.82rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>📧</div>
          Returning to login…
        </div>
      )}
    </FormCard>
  );
}