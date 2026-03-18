// src/auth/components/Checkbox.js
import React from 'react';

/**
 * Styled checkbox row with label text.
 *
 * Props:
 *  id        string
 *  checked   boolean
 *  onChange  (e) => void
 *  children  ReactNode  — label content (can include <a> tags)
 */
export default function Checkbox({ id, checked, onChange, children }) {
  return (
    <div className="check-row">
      <input
        className="check-input"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
}