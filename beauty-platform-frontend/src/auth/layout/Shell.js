// src/auth/layout/Shell.js
import React from 'react';
import DecoPanel    from './DecoPanel';
import MobileHeader from './MobileHeader';

/**
 * Outer layout shell.
 * - Desktop: 50% deco panel left | 50% form panel right
 * - Mobile : deco hides, sticky brand header shows at top
 *
 * Props:
 *  children   ReactNode  — should be the <FormPanel> (right side)
 */
export default function Shell({ children }) {
  return (
    <div className="auth-root">
      {/* Sticky brand header — visible only on mobile via CSS */}
      <MobileHeader />

      <div className="auth-shell">
        {/* Left: decorative luxury panel */}
        <DecoPanel />

        {/* Right: form area */}
        <main className="form-panel">
          {children}
        </main>
      </div>
    </div>
  );
}