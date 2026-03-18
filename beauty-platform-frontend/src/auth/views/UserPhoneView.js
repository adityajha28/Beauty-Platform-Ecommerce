// src/auth/views/UserPhoneView.js
import React, { useState, useCallback } from 'react';
import { useAuth }       from '../../context/AuthContext';
import authService       from '../services/authService';
import FormCard          from '../components/FormCard';
import PhoneInput        from '../components/PhoneInput';
import InputField        from '../components/InputField';
import Checkbox          from '../components/Checkbox';
import SubmitButton      from '../components/SubmitButton';
import ErrorMessage      from '../components/ErrorMessage';

/* ─── VALIDATORS ─── */
const isValidPhone = (p)  => /^[6-9]\d{9}$/.test(p.replace(/\s/g, ''));
const isValidEmail = (e)  => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* ─── TABS ─── */
function FormTabs({ tab, setTab }) {
  return (
    <div className="form-tabs">
      <button
        className={`tab-btn${tab === 'login'  ? ' active' : ''}`}
        onClick={() => setTab('login')}
        type="button"
      >
        Login
      </button>
      <button
        className={`tab-btn${tab === 'signup' ? ' active' : ''}`}
        onClick={() => setTab('signup')}
        type="button"
      >
        Sign Up
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function UserPhoneView() {
  const {
    userTab, setUserTab,
    setView, setPhone: savePhone, setUserName: saveName,
    showToast,
  } = useAuth();

  /* ── Login state ── */
  const [loginCC,    setLoginCC]    = useState('+91');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginErr,   setLoginErr]   = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  /* ── Signup state ── */
  const [signupCC,    setSignupCC]    = useState('+91');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupName,  setSignupName]  = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupAgree, setSignupAgree] = useState(false);
  const [signupErr,   setSignupErr]   = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  /* ── OTP send flow ── */
  const sendOTP = useCallback(async (context) => {
    const isLogin = context === 'login';

    /* Validate */
    if (isLogin) {
      setLoginErr('');
      if (!isValidPhone(loginPhone)) {
        setLoginErr('Please enter a valid 10-digit WhatsApp number');
        return;
      }
    } else {
      setSignupErr('');
      if (!signupName.trim())          { setSignupErr('Please enter your full name'); return; }
      if (!isValidPhone(signupPhone))  { setSignupErr('Please enter a valid 10-digit WhatsApp number'); return; }
      if (!isValidEmail(signupEmail))  { setSignupErr('Please enter a valid email address'); return; }
      if (!signupAgree)                { setSignupErr('Please accept the Terms & Privacy Policy'); return; }
    }

    const cc    = isLogin ? loginCC    : signupCC;
    const phone = isLogin ? loginPhone : signupPhone;
    const fullPhone = `${cc}${phone}`;      // e.g. "+919876543210"
    const display   = `${cc} ${phone}`;    // e.g. "+91 9876543210"

    isLogin ? setLoginLoading(true) : setSignupLoading(true);

    try {
      await authService.sendOTP(fullPhone);

      /* Persist to context for OTPView */
      savePhone(display);
      if (!isLogin) saveName(signupName.trim());

      showToast(`OTP sent to ${display} via WhatsApp 💬`);
      setView('otp');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send OTP. Please try again.';
      isLogin ? setLoginErr(msg) : setSignupErr(msg);
    } finally {
      isLogin ? setLoginLoading(false) : setSignupLoading(false);
    }
  }, [
    loginCC, loginPhone, loginErr,
    signupCC, signupPhone, signupName, signupEmail, signupAgree,
    savePhone, saveName, setView, showToast,
  ]);

  /* ── Keyboard shortcut ── */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') sendOTP(userTab);
  }, [sendOTP, userTab]);

  return (
    <FormCard animKey={`user-phone-${userTab}`}>
      <FormTabs tab={userTab} setTab={setUserTab} />

      {/* ── LOGIN TAB ── */}
      {userTab === 'login' && (
        <div key="login-tab" onKeyDown={handleKeyDown}>
          <div className="card-hd">
            <div className="card-title">Welcome <em>back</em></div>
            <div className="card-sub">
              Enter your WhatsApp number to receive an OTP
            </div>
          </div>

          <div className="fields">
            <PhoneInput
              countryCode={loginCC}
              onCountryCode={setLoginCC}
              phone={loginPhone}
              onPhone={setLoginPhone}
              delay={0}
            />
          </div>

          {loginErr && <ErrorMessage message={loginErr} />}

          <SubmitButton
            variant="btn-wa"
            loading={loginLoading}
            onClick={() => sendOTP('login')}
            style={{ marginTop: '1.25rem' }}
          >
            💬 Send OTP on WhatsApp
          </SubmitButton>

          <p className="terms-text">
            By continuing you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      )}

      {/* ── SIGNUP TAB ── */}
      {userTab === 'signup' && (
        <div key="signup-tab" onKeyDown={handleKeyDown}>
          <div className="card-hd">
            <div className="card-title">Create <em>account</em></div>
            <div className="card-sub">
              Join thousands of Nagpur customers — it's free!
            </div>
          </div>

          <div className="fields">
            <InputField
              label="Full Name"
              icon="👤"
              type="text"
              value={signupName}
              onChange={e => setSignupName(e.target.value)}
              placeholder="Priya Sharma"
              autoComplete="name"
              delay={0}
            />

            <PhoneInput
              countryCode={signupCC}
              onCountryCode={setSignupCC}
              phone={signupPhone}
              onPhone={setSignupPhone}
              delay={1}
            />

            <InputField
              label="Email (optional)"
              icon="✉️"
              type="email"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              placeholder="priya@email.com"
              autoComplete="email"
              delay={2}
            />

            <Checkbox
              id="signup-agree"
              checked={signupAgree}
              onChange={e => setSignupAgree(e.target.checked)}
            >
              I agree to the{' '}
              <a href="/terms">Terms</a> and{' '}
              <a href="/privacy">Privacy Policy</a>
            </Checkbox>
          </div>

          {signupErr && <ErrorMessage message={signupErr} />}

          <SubmitButton
            variant="btn-wa"
            loading={signupLoading}
            onClick={() => sendOTP('signup')}
            style={{ marginTop: '1rem' }}
          >
            💬 Send OTP on WhatsApp
          </SubmitButton>
        </div>
      )}
    </FormCard>
  );
}