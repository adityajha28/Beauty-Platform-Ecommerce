// src/auth/otp/OTPTimer.js
import React from 'react';

/**
 * OTP countdown timer with resend button.
 *
 * Props:
 *  seconds    number   — remaining seconds (0 = expired)
 *  isExpired  boolean
 *  onResend   () => void
 */
export default function OTPTimer({ seconds, isExpired, onResend }) {
  return (
    <div className="otp-timer">
      {!isExpired ? (
        <span>
          Resend OTP in <b>{seconds}s</b>
        </span>
      ) : (
        <button
          className="resend-btn"
          onClick={onResend}
          type="button"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
}