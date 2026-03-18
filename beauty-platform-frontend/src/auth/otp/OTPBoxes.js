// src/auth/otp/OTPBoxes.js
import React, { useRef, useEffect, useCallback } from 'react';

/**
 * 6-box OTP input grid.
 *
 * Props:
 *  value       string  — 6-char string, '' padded
 *  onChange    (otp: string) => void
 *  onComplete  (otp: string) => void  — called when all 6 filled
 *  autoFocus   boolean
 */
export default function OTPBoxes({ value = '', onChange, onComplete, autoFocus = true }) {
  const refs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null),
  ];

  // Focus first box on mount
  useEffect(() => {
    if (autoFocus) setTimeout(() => refs[0].current?.focus(), 120);
  }, []); // eslint-disable-line

  const updateAt = useCallback((idx, char) => {
    const arr = value.split('').concat(Array(6).fill('')).slice(0, 6);
    arr[idx]  = char;
    const next = arr.join('');
    onChange(next);
    if (next.replace(/\s/g, '').length === 6 && !next.includes(' ')) {
      onComplete?.(next);
    }
  }, [value, onChange, onComplete]);

  const handleKeyDown = useCallback((e, idx) => {
    if (e.key === 'Backspace') {
      if (!value[idx] && idx > 0) {
        refs[idx - 1].current?.focus();
        updateAt(idx - 1, '');
      } else {
        updateAt(idx, '');
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      refs[idx - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      refs[idx + 1].current?.focus();
    }
  }, [value, updateAt, refs]);

  const handleInput = useCallback((e, idx) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    if (!char) return;
    updateAt(idx, char);
    if (idx < 5) refs[idx + 1].current?.focus();
  }, [updateAt, refs]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const padded = pasted.padEnd(6, ' ');
    onChange(padded.slice(0, 6));
    const focusIdx = Math.min(pasted.length, 5);
    refs[focusIdx].current?.focus();
    if (pasted.length === 6) onComplete?.(pasted);
  }, [onChange, onComplete, refs]);

  return (
    <div className="otp-boxes">
      {refs.map((ref, idx) => {
        const digit = value[idx] || '';
        return (
          <input
            key={idx}
            ref={ref}
            className={`otp-box${digit ? ' filled' : ''}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={digit.trim()}
            onKeyDown={e  => handleKeyDown(e, idx)}
            onChange={e   => handleInput(e, idx)}
            onPaste={handlePaste}
            onFocus={e    => e.target.select()}
            aria-label={`OTP digit ${idx + 1}`}
            autoComplete="one-time-code"
          />
        );
      })}
    </div>
  );
}