// src/auth/views/OTPView.js
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth }     from '../../context/AuthContext';
import authService, { tokenStorage } from '../services/authService';
import FormCard        from '../components/FormCard';
import BackButton      from '../components/BackButton';
import SubmitButton    from '../components/SubmitButton';
import ErrorMessage    from '../components/ErrorMessage';
import OTPBoxes        from '../otp/OTPBoxes';
import OTPTimer        from '../otp/OTPTimer';
import { useOTPTimer } from '../hooks/useOTPTimer';

/* ── helpers ── */
const rawPhone = (display) => display.replace(/\s/g, '');  // "+91 9876..." → "+919876..."

export default function OTPView() {
  const {
    phone,           // display string e.g. "+91 98765 43210"
    userName,        // '' for login, name for signup
    userTab,         // 'login' | 'signup'
    setView,
    setUserName,
    showToast,
  } = useAuth();

  const [otp,     setOtp]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const timer = useOTPTimer(30);

  /* Start timer when view mounts */
  useEffect(() => {
    timer.start();
    return () => timer.reset();
  }, []); // eslint-disable-line

  /* ── RESEND ── */
  const handleResend = useCallback(async () => {
    setOtp('');
    setError('');
    try {
      await authService.sendOTP(rawPhone(phone));
      timer.start();
      showToast('New OTP sent via WhatsApp 💬');
    } catch {
      setError('Failed to resend OTP. Please try again.');
    }
  }, [phone, timer, showToast]);

  /* ── VERIFY ── */
  const handleVerify = useCallback(async (otpValue = otp) => {
    const code = otpValue.replace(/\s/g, '');
    if (code.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.verifyOTP(rawPhone(phone), code);

      /* Store tokens */
      tokenStorage.set(data.accessToken, data.refreshToken, 'customer');

      /* If this is a signup and backend returns isNewUser, complete profile */
      if (userTab === 'signup' && data.isNewUser && userName) {
        try {
          await authService.completeProfile(rawPhone(phone), userName, '');
        } catch {
          /* profile can be completed later — non-blocking */
        }
      }

      /* Update display name from backend if available */
      if (data.user?.name) setUserName(data.user.name);

      timer.reset();
      showToast('Welcome to Bella Beauty! 🌸');
      setView('success');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Incorrect OTP. Please try again.';
      setError(msg);
      setOtp('');
    } finally {
      setLoading(false);
    }
  }, [otp, phone, userTab, userName, timer, showToast, setView, setUserName]);

  /* Auto-submit when all 6 digits entered */
  const handleComplete = useCallback((fullOtp) => {
    handleVerify(fullOtp);
  }, [handleVerify]);

  /* Enter key */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleVerify();
  }, [handleVerify]);

  return (
    <FormCard animKey="otp-view">
      <BackButton onClick={() => setView('phone')} />

      <div className="card-hd">
        <div className="card-title">Verify <em>OTP</em></div>
        <div className="card-sub">Code sent to {phone}</div>
      </div>

      {/* WhatsApp confirmation banner */}
      <div className="otp-sent-info">
        <div className="otp-wa-ico" aria-hidden="true">💬</div>
        <div className="otp-sent-text">
          OTP sent to{' '}
          <span className="otp-sent-num">{phone}</span>{' '}
          via WhatsApp. Check your messages!
        </div>
      </div>

      {/* 6-box input */}
      <div onKeyDown={handleKeyDown}>
        <OTPBoxes
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          autoFocus
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <SubmitButton
        variant="btn-user"
        loading={loading}
        onClick={() => handleVerify()}
        style={{ marginTop: '1rem' }}
      >
        ✓ Verify &amp; Continue
      </SubmitButton>

      <OTPTimer
        seconds={timer.seconds}
        isExpired={timer.isExpired}
        onResend={handleResend}
      />
    </FormCard>
  );
}