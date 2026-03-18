// src/auth/layout/DecoPanel.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

/* ─── CONTENT CONFIG PER MODE ─── */
const DECO_CONTENT = {
  user: {
    badgeClass:   'user',
    badgeText:    'Customer Portal',
    headline:     <>Beauty that comes<br /><span>to you.</span></>,
    sub:          'Book professional beauty services from the comfort of your home. Trusted experts, seamless booking, delivered to your door.',
    features: [
      { ico: '📍', text: 'Door-to-door service across Nagpur' },
      { ico: '💬', text: 'Login instantly with WhatsApp OTP' },
      { ico: '⭐', text: 'Verified & trusted beauty experts' },
    ],
  },
  admin: {
    badgeClass:   'admin',
    badgeText:    'Admin Panel',
    headline:     <>Manage the <br /><span>entire platform.</span></>,
    sub:          'Access the Bella Beauty admin dashboard — bookings, services, products, users and analytics in one place.',
    features: [
      { ico: '📊', text: 'Full platform analytics & KPIs' },
      { ico: '📅', text: 'Manage all bookings and experts' },
      { ico: '🔐', text: 'Secure JWT-based admin session' },
    ],
  },
};

export default function DecoPanel() {
  const { mode } = useAuth();
  const content  = DECO_CONTENT[mode] ?? DECO_CONTENT.user;

  return (
    <aside className="deco">
      {/* Background layers */}
      <div className="deco-bg"    aria-hidden="true" />
      <div className="deco-grain" aria-hidden="true" />
      <div className="deco-mode-line" aria-hidden="true" />

      {/* Floating orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />
      <div className="orb orb-4" aria-hidden="true" />

      {/* Decorative concentric rings */}
      <div className="deco-ring" aria-hidden="true" />
      <div className="deco-ring" aria-hidden="true" />
      <div className="deco-ring" aria-hidden="true" />

      {/* Brand */}
      <div className="deco-brand">
        <div className="deco-icon" aria-hidden="true">✦</div>
        <div className="deco-name">
          Bella <em>Beauty</em>
        </div>
        <div className="deco-tagline">Nagpur's finest at your doorstep</div>
      </div>

      {/* Mode badge — re-mounts on mode change to replay animation */}
      <div key={`badge-${mode}`} className={`deco-mode-badge ${content.badgeClass}`}>
        <span className="badge-dot" aria-hidden="true" />
        <span>{content.badgeText}</span>
      </div>

      {/* Headline + subtext */}
      <div className="deco-copy">
        <div className="deco-headline" key={`headline-${mode}`}>
          {content.headline}
        </div>
        <div className="deco-sub" key={`sub-${mode}`}>
          {content.sub}
        </div>
      </div>

      {/* Feature list — re-renders on mode change */}
      <div className="deco-features" key={`feats-${mode}`}>
        {content.features.map((f, i) => (
          <div className="feat" key={i}>
            <div className="feat-ico" aria-hidden="true">{f.ico}</div>
            <span>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Bottom copyright */}
      <div className="deco-bottom">
        © {new Date().getFullYear()} Bella Beauty · Nagpur, Maharashtra
      </div>
    </aside>
  );
}