// src/pages/NotFound/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../../auth/services/authService';

/**
 * 404 Not Found page.
 * Matches Bella Beauty's rose/gold design tokens.
 * Inline styles used here intentionally — no extra CSS file needed
 * for a single-use utility page.
 */
export default function NotFound() {
  const navigate   = useNavigate();
  const role       = tokenStorage.getRole();
  const isLoggedIn = tokenStorage.isLoggedIn();

  const goHome = () => {
    if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <div style={styles.root}>
      {/* Background blob */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {/* Brand mark */}
        <div style={styles.brand}>
          <span style={styles.brandIco}>✦</span>
          <span style={styles.brandName}>Bella Beauty</span>
        </div>

        {/* 404 display */}
        <div style={styles.code}>404</div>

        <h1 style={styles.title}>
          Page not <em style={styles.em}>found</em>
        </h1>

        <p style={styles.sub}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* CTA buttons */}
        <div style={styles.btns}>
          <button style={styles.btnPrimary} onClick={goHome}>
            ← {isLoggedIn && role === 'admin' ? 'Back to Dashboard' : 'Back to Home'}
          </button>

          {!isLoggedIn && (
            <button
              style={styles.btnGhost}
              onClick={() => navigate('/auth')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Inline style objects ── */
const styles = {
  root: {
    minHeight: '100vh',
    background: '#FDF8F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-80px', right: '-80px',
    width: '320px', height: '320px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(192,57,90,.08), transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-60px', left: '-60px',
    width: '260px', height: '260px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(191,140,90,.07), transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    textAlign: 'center',
    maxWidth: '420px',
    width: '100%',
    position: 'relative',
    zIndex: 1,
    animation: 'none',
  },
  brand: {
    display: 'inline-flex', alignItems: 'center', gap: '.5rem',
    marginBottom: '2rem',
  },
  brandIco: {
    width: '32px', height: '32px', borderRadius: '9px',
    background: '#C0395A',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '.9rem', color: '#fff',
  },
  brandName: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.2rem', fontWeight: 600, color: '#1E1015',
  },
  code: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '7rem', fontWeight: 700, lineHeight: 1,
    color: '#C0395A', opacity: .15,
    marginBottom: '-1.5rem',
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '2.2rem', fontWeight: 600,
    color: '#1E1015', lineHeight: 1.2,
    marginBottom: '.85rem',
  },
  em: {
    color: '#C0395A', fontStyle: 'italic',
  },
  sub: {
    fontSize: '.82rem', color: '#7A5060',
    lineHeight: 1.65, marginBottom: '2rem',
  },
  btns: {
    display: 'flex', gap: '.65rem',
    justifyContent: 'center', flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '.72rem 1.5rem',
    background: 'linear-gradient(135deg, #C0395A, #962C46)',
    color: '#fff', border: 'none', borderRadius: '11px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '.84rem', fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(192,57,90,.28)',
    transition: 'all .26s ease',
  },
  btnGhost: {
    padding: '.72rem 1.5rem',
    background: 'transparent',
    color: '#C0395A',
    border: '1.5px solid #C0395A',
    borderRadius: '11px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '.84rem', fontWeight: 700,
    cursor: 'pointer',
    transition: 'all .26s ease',
  },
};