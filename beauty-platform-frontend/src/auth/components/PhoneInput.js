// src/auth/components/PhoneInput.js
import React from 'react';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', label: '🇮🇳 +91' },
  { code: '+1',  flag: '🇺🇸', label: '🇺🇸 +1'  },
  { code: '+44', flag: '🇬🇧', label: '🇬🇧 +44' },
  { code: '+971',flag: '🇦🇪', label: '🇦🇪 +971'},
];

/**
 * Phone number input with country code selector.
 *
 * Props:
 *  countryCode    string  e.g. '+91'
 *  onCountryCode  (code) => void
 *  phone          string
 *  onPhone        (val) => void
 *  delay          number  animation delay index
 */
export default function PhoneInput({
  countryCode,
  onCountryCode,
  phone,
  onPhone,
  delay = 0,
}) {
  return (
    <div className="field" style={{ animationDelay: `${delay * 0.05}s` }}>
      <label>WhatsApp Number</label>
      <div className="phone-row">
        <select
          className="country-select"
          value={countryCode}
          onChange={e => onCountryCode(e.target.value)}
          aria-label="Country code"
        >
          {COUNTRY_CODES.map(c => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <div className="input-wrap" style={{ flex: 1 }}>
          <span className="input-icon">📱</span>
          <input
            className="auth-input"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={e => onPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="98765 43210"
            autoComplete="tel"
          />
        </div>
      </div>
    </div>
  );
}

export { COUNTRY_CODES };