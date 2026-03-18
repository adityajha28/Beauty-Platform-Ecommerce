// src/auth/components/FormCard.js
import React from 'react';

/**
 * White rounded card that wraps all form content.
 * Re-mounts (and therefore re-animates) when `animKey` changes.
 */
export default function FormCard({ children, animKey }) {
  return (
    <div className="form-card" key={animKey}>
      {children}
    </div>
  );
}