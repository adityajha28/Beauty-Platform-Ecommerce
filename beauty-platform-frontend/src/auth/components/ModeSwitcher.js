// src/auth/components/ModeSwitcher.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ModeSwitcher() {
  const { mode, setMode } = useAuth();

  return (
    <div className="mode-switcher">
      <button
        className={`mode-btn${mode === 'user' ? ' active' : ''}`}
        onClick={() => setMode('user')}
        type="button"
      >
        <span className="mode-ico">👤</span>
        Customer
      </button>
      <button
        className={`mode-btn${mode === 'admin' ? ' active' : ''}`}
        onClick={() => setMode('admin')}
        type="button"
      >
        <span className="mode-ico">🔐</span>
        Admin
      </button>
    </div>
  );
}