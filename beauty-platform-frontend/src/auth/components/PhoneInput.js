// src/auth/components/PhoneInput.js
import React from "react";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", label: "🇮🇳 +91" },
  { code: "+1", flag: "🇺🇸", label: "🇺🇸 +1" },
  { code: "+44", flag: "🇬🇧", label: "🇬🇧 +44" },
  { code: "+971", flag: "🇦🇪", label: "🇦🇪 +971" },
];

/** Format 10 digits as "98765 43210" for readability */
export function formatPhoneDigits(digits) {
  const d = (digits || "").replace(/\D/g, "").slice(0, 10);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)} ${d.slice(5)}`;
}

export function stripPhoneDigits(value) {
  return (value || "").replace(/\D/g, "").slice(0, 10);
}

export default function PhoneInput({
  countryCode,
  onCountryCode,
  phone,
  onPhone,
  delay = 0,
  id = "phone-input",
}) {
  const display = formatPhoneDigits(phone);

  const handleChange = (e) => {
    onPhone(stripPhoneDigits(e.target.value));
  };

  return (
    <div className="field phone-field" style={{ animationDelay: `${delay * 0.05}s` }}>
      <label htmlFor={id}>WhatsApp Number</label>
      <div className="phone-row">
        <select
          className="country-select"
          value={countryCode}
          onChange={(e) => onCountryCode(e.target.value)}
          aria-label="Country code"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="phone-input-box">
          <span className="phone-prefix" aria-hidden="true">
            {countryCode}
          </span>
          <input
            id={id}
            className="auth-input phone-input-native"
            type="tel"
            inputMode="numeric"
            maxLength={11}
            value={display}
            onChange={handleChange}
            placeholder="98765 43210"
            autoComplete="tel-national"
          />
        </div>
      </div>
      <p className="phone-hint">Enter your 10-digit WhatsApp number</p>
    </div>
  );
}

export { COUNTRY_CODES };
