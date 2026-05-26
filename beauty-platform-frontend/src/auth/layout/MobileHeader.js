import React from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo/BrandLogo";

export default function MobileHeader() {
  const navigate = useNavigate();

  return (
    <header className="auth-mob-header">
      <button
        type="button"
        className="auth-mob-back"
        onClick={() => navigate("/")}
        aria-label="Back to home"
      >
        <span className="auth-mob-back-icon" aria-hidden="true">←</span>
        <span className="auth-mob-back-label">Home</span>
      </button>

      <BrandLogo to={null} size="sm" className="auth-mob-brand" showText />

      <div className="auth-mob-spacer" aria-hidden="true" />
    </header>
  );
}
