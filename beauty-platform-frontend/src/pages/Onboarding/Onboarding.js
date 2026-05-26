import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import AddressForm from "../../components/user/AddressForm";
import { useUser } from "../../context/UserContext";
import { userStorage } from "../../utils/userStorage";
import authService, { AUTH_FLOW_KEY, tokenStorage } from "../../auth/services/authService";
import { updateProfile } from "../../services/userService";
import { SERVICE_AREA_LABEL } from "../../constants/location";
import "./Onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { saveAddress, phone, updateProfile: syncProfile } = useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(() => userStorage.getDisplayName());
  const [email, setEmail] = useState(() => userStorage.getProfile()?.email || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const profile = userStorage.getProfile();
    const nextName = userStorage.getDisplayName();
    if (nextName) setName(nextName);
    if (profile?.email) setEmail(profile.email);
  }, [phone]);

  const token = tokenStorage.getAccess();
  if (!token) {
    return <Navigate to="/auth?mode=signup" replace />;
  }

  const flow = sessionStorage.getItem(AUTH_FLOW_KEY);
  const isSignupFlow = flow === "signup" || userStorage.getIsNewUser();

  if (!isSignupFlow && userStorage.isOnboardingDone()) {
    const redirect = params.get("redirect") || "/account";
    return <Navigate to={decodeURIComponent(redirect)} replace />;
  }

  const handleProfileNext = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await updateProfile({ name: name.trim(), email: email.trim(), phone });
    userStorage.setUserName(name.trim());
    try {
      await authService.completeProfile(phone, name.trim(), email.trim());
    } catch {
      /* non-blocking — local profile still saved */
    }
    setStep(2);
  };

  const handleSaveAddress = async (form) => {
    setSaving(true);
    await saveAddress(form);
    userStorage.setOnboardingDone(true);
    userStorage.setIsNewUser(false);
    sessionStorage.removeItem(AUTH_FLOW_KEY);
    await syncProfile({ name: name.trim(), email: email.trim() });
    setSaving(false);
    const redirect = params.get("redirect") || "/account";
    navigate(decodeURIComponent(redirect), { replace: true });
  };

  return (
    <motion.div className="onboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="onboard-header">
        <BrandLogo to="/" size="sm" />
        <span className="onboard-step-label">Step {step} of 2</span>
      </header>

      <div className="onboard-progress">
        <div className={`onboard-progress-dot${step >= 1 ? " active" : ""}`} />
        <div className={`onboard-progress-line${step >= 2 ? " active" : ""}`} />
        <div className={`onboard-progress-dot${step >= 2 ? " active" : ""}`} />
      </div>

      <div className="onboard-body">
        {step === 1 && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="onboard-card"
          >
            <div className="onboard-hero">
              <span className="onboard-emoji" aria-hidden="true">👋</span>
              <h1>Complete your profile</h1>
              <p>Tell us a bit about you before we set up delivery in {SERVICE_AREA_LABEL}.</p>
            </div>

            <form className="uc-form" onSubmit={handleProfileNext}>
              <label className="uc-field">
                <span>Full name *</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
              </label>
              <label className="uc-field">
                <span>Email (optional)</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </label>
              <label className="uc-field">
                <span>WhatsApp</span>
                <input value={phone || userStorage.getPhone()} readOnly className="uc-readonly" />
              </label>
              <button type="submit" className="uc-btn-primary">Continue to address</button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="address"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="onboard-card"
          >
            <div className="onboard-hero">
              <span className="onboard-emoji" aria-hidden="true">📍</span>
              <h1>Add your address</h1>
              <p>We serve <strong>{SERVICE_AREA_LABEL}</strong> for salon at-home & product delivery.</p>
            </div>
            <AddressForm onSubmit={handleSaveAddress} submitLabel={saving ? "Saving…" : "Finish & go to account"} />
            <button type="button" className="onboard-back-link" onClick={() => setStep(1)}>
              ← Back to profile
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
