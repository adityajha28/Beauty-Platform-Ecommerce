// src/auth/views/UserPhoneView.js
import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService, { AUTH_FLOW_KEY } from "../services/authService";
import { userStorage } from "../../utils/userStorage";
import FormCard from "../components/FormCard";
import PhoneInput from "../components/PhoneInput";
import InputField from "../components/InputField";
import Checkbox from "../components/Checkbox";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";

const isValidPhone = (p) => /^[6-9]\d{9}$/.test(p.replace(/\s/g, ""));
const isValidEmail = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function FormTabs({ tab, onTabChange }) {
  return (
    <div className="form-tabs form-tabs--pill" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={tab === "login"}
        className={`tab-btn${tab === "login" ? " active" : ""}`}
        onClick={() => onTabChange("login")}
      >
        Login
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={tab === "signup"}
        className={`tab-btn${tab === "signup" ? " active" : ""}`}
        onClick={() => onTabChange("signup")}
      >
        Sign Up
      </button>
    </div>
  );
}

export default function UserPhoneView() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userTab,
    setUserTab,
    setView,
    setPhone: savePhone,
    setUserName: saveName,
    showToast,
  } = useAuth();

  const [loginCC, setLoginCC] = useState("+91");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginHint, setLoginHint] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupCC, setSignupCC] = useState("+91");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupAgree, setSignupAgree] = useState(false);
  const [signupErr, setSignupErr] = useState("");
  const [signupHint, setSignupHint] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);

  const switchTab = useCallback(
    (tab) => {
      setUserTab(tab);
      setLoginErr("");
      setSignupErr("");
      setLoginHint(null);
      setSignupHint(null);
      const params = new URLSearchParams(location.search);
      params.set("mode", tab);
      const search = params.toString();
      navigate({ pathname: "/auth", search }, { replace: true });
    },
    [setUserTab, navigate, location.search]
  );

  const goToSignupWithPhone = useCallback(() => {
    setSignupPhone(loginPhone);
    setSignupCC(loginCC);
    switchTab("signup");
    setLoginHint(null);
    setSignupErr("");
  }, [loginPhone, loginCC, switchTab]);

  const goToLoginWithPhone = useCallback(() => {
    setLoginPhone(signupPhone);
    setLoginCC(signupCC);
    switchTab("login");
    setSignupHint(null);
    setLoginErr("");
  }, [signupPhone, signupCC, switchTab]);

  const sendOTP = useCallback(
    async (context) => {
      const isLogin = context === "login";

      if (isLogin) {
        setLoginErr("");
        setLoginHint(null);
        if (!isValidPhone(loginPhone)) {
          setLoginErr("Please enter a valid 10-digit WhatsApp number");
          return;
        }
      } else {
        setSignupErr("");
        setSignupHint(null);
        if (!signupName.trim()) {
          setSignupErr("Please enter your full name");
          return;
        }
        if (!isValidPhone(signupPhone)) {
          setSignupErr("Please enter a valid 10-digit WhatsApp number");
          return;
        }
        if (!isValidEmail(signupEmail)) {
          setSignupErr("Please enter a valid email address");
          return;
        }
        if (!signupAgree) {
          setSignupErr("Please accept the Terms & Privacy Policy");
          return;
        }
      }

      const cc = isLogin ? loginCC : signupCC;
      const phone = isLogin ? loginPhone : signupPhone;
      const fullPhone = `${cc}${phone}`;
      const display = `${cc} ${phone}`;

      isLogin ? setLoginLoading(true) : setSignupLoading(true);

      try {
        const mode = isLogin ? "login" : "signup";
        sessionStorage.setItem(AUTH_FLOW_KEY, mode);
        await authService.sendOTP(fullPhone, mode);

        savePhone(display);
        if (!isLogin) {
          const trimmedName = signupName.trim();
          const trimmedEmail = signupEmail.trim();
          userStorage.beginCustomerSession({
            phone: fullPhone,
            name: trimmedName,
            email: trimmedEmail,
            isNewUser: true,
            resetLocal: true,
          });
          saveName(trimmedName);
        }

        showToast(`OTP sent to ${display} via WhatsApp 💬`);
        setView("otp");
      } catch (err) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to send OTP. Please try again.";

        if (isLogin && status === 404) {
          setLoginErr("No account found for this number.");
          setLoginHint({
            text: "This number is not registered. Please sign up first.",
            action: "Create account",
            onAction: goToSignupWithPhone,
          });
        } else if (!isLogin && status === 409) {
          setSignupErr("An account already exists with this number.");
          setSignupHint({
            text: "You already have an account. Please log in instead.",
            action: "Go to Login",
            onAction: goToLoginWithPhone,
          });
        } else {
          isLogin ? setLoginErr(msg) : setSignupErr(msg);
        }
      } finally {
        isLogin ? setLoginLoading(false) : setSignupLoading(false);
      }
    },
    [
      loginCC,
      loginPhone,
      signupCC,
      signupPhone,
      signupName,
      signupEmail,
      signupAgree,
      savePhone,
      saveName,
      setView,
      showToast,
      goToSignupWithPhone,
      goToLoginWithPhone,
    ]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") sendOTP(userTab);
    },
    [sendOTP, userTab]
  );

  return (
    <FormCard animKey={`user-phone-${userTab}`}>
      <BackButton onClick={() => navigate("/")} label="Back to home" />
      <FormTabs tab={userTab} onTabChange={switchTab} />

      {userTab === "login" && (
        <div key="login-tab" onKeyDown={handleKeyDown}>
          <div className="card-hd">
            <div className="card-title">
              Welcome <em>back</em>
            </div>
            <div className="card-sub">
              Log in with your registered WhatsApp number
            </div>
          </div>

          <div className="fields">
            <PhoneInput
              id="login-phone"
              countryCode={loginCC}
              onCountryCode={setLoginCC}
              phone={loginPhone}
              onPhone={setLoginPhone}
            />
          </div>

          {loginErr && <ErrorMessage message={loginErr} />}
          {loginHint && (
            <div className="auth-hint-banner">
              <p>{loginHint.text}</p>
              <button type="button" onClick={loginHint.onAction}>
                {loginHint.action}
              </button>
            </div>
          )}

          <SubmitButton
            variant="btn-wa"
            loading={loginLoading}
            onClick={() => sendOTP("login")}
            style={{ marginTop: "1.25rem" }}
          >
            💬 Send OTP on WhatsApp
          </SubmitButton>

          <p className="auth-switch-prompt">
            New to Oraya?{" "}
            <button type="button" className="auth-link-btn" onClick={() => switchTab("signup")}>
              Create an account
            </button>
          </p>
        </div>
      )}

      {userTab === "signup" && (
        <div key="signup-tab" onKeyDown={handleKeyDown}>
          <div className="card-hd">
            <div className="card-title">
              Create <em>account</em>
            </div>
            <div className="card-sub">
              Sign up — then add your profile & Nagpur address
            </div>
          </div>

          <div className="fields">
            <InputField
              label="Full Name"
              icon="👤"
              type="text"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              placeholder="Priya Sharma"
              autoComplete="name"
              delay={0}
            />

            <PhoneInput
              id="signup-phone"
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
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="priya@email.com"
              autoComplete="email"
              delay={2}
            />

            <Checkbox
              id="signup-agree"
              checked={signupAgree}
              onChange={(e) => setSignupAgree(e.target.checked)}
            >
              I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
            </Checkbox>
          </div>

          {signupErr && <ErrorMessage message={signupErr} />}
          {signupHint && (
            <div className="auth-hint-banner auth-hint-banner--info">
              <p>{signupHint.text}</p>
              <button type="button" onClick={signupHint.onAction}>
                {signupHint.action}
              </button>
            </div>
          )}

          <SubmitButton
            variant="btn-wa"
            loading={signupLoading}
            onClick={() => sendOTP("signup")}
            style={{ marginTop: "1rem" }}
          >
            💬 Send OTP on WhatsApp
          </SubmitButton>

          <p className="auth-switch-prompt">
            Already registered?{" "}
            <button type="button" className="auth-link-btn" onClick={() => switchTab("login")}>
              Log in
            </button>
          </p>
        </div>
      )}
    </FormCard>
  );
}
