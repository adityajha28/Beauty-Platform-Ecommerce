// src/auth/components/BackButton.js
import React from 'react';

/**
 * ← Back link used in OTPView and ForgotPasswordView.
 * @param {Function} onClick
 * @param {string}   label
 */
export default function BackButton({ onClick, label = 'Back' }) {
  return (
    <button className="back-link" onClick={onClick} type="button">
      <span className="back-arrow">←</span>
      {label}
    </button>
  );
}