// src/auth/components/InputField.js
import React, { useState } from 'react';

/**
 * Reusable labelled input field.
 *
 * Props:
 *  label       string
 *  icon        emoji/string shown on left
 *  type        'text' | 'email' | 'password' | 'tel'  (default 'text')
 *  value       string
 *  onChange    (e) => void
 *  placeholder string
 *  autoComplete string
 *  name        string
 *  delay       animation delay index (0–3) for staggered fadeUp
 *  extraStyle  object  — applied to wrapper .field
 */
export default function InputField({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  name,
  delay = 0,
  extraStyle,
}) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const inputType  = isPassword ? (showPw ? 'text' : 'password') : type;

  return (
    <div
      className="field"
      style={{ animationDelay: `${delay * 0.05}s`, ...extraStyle }}
    >
      {label && <label>{label}</label>}
      <div className={`input-wrap${isPassword ? ' has-eye' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className="auth-input"
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          name={name}
        />
        {isPassword && (
          <button
            className="eye-btn"
            type="button"
            tabIndex={-1}
            onClick={() => setShowPw(v => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  );
}