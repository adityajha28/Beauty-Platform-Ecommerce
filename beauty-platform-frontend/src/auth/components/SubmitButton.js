// src/auth/components/SubmitButton.js
import React from 'react';

/**
 * Full-width submit button with integrated loading spinner.
 *
 * Props:
 *  onClick    () => void
 *  loading    boolean
 *  variant    'btn-wa' | 'btn-user' | 'btn-admin'
 *  children   ReactNode  — button label (text + optional icon)
 *  style      object
 *  type       'button' | 'submit'
 */
export default function SubmitButton({
  onClick,
  loading = false,
  variant = 'btn-user',
  children,
  style,
  type = 'button',
}) {
  return (
    <button
      className={`submit-btn ${variant}`}
      onClick={onClick}
      disabled={loading}
      type={type}
      style={style}
    >
      {loading ? (
        <span className="btn-spinner" aria-label="Loading" />
      ) : (
        children
      )}
    </button>
  );
}