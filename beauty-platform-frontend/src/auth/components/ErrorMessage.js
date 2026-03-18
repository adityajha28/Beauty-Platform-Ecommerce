// src/auth/components/ErrorMessage.js
import React from 'react';

/**
 * Inline error banner shown inside form cards.
 * @param {string} message
 */
export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="error-msg" role="alert">
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  );
}