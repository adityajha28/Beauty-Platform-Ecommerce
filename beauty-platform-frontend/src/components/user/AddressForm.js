import { useState } from "react";
import { DEFAULT_CITY, DEFAULT_STATE } from "../../constants/location";
import "./user-components.css";

const LABELS = ["Home", "Work", "Other"];

export default function AddressForm({ initial = {}, onSubmit, submitLabel = "Save Address" }) {
  const [form, setForm] = useState({
    label: initial.label || "Home",
    line1: initial.line1 || "",
    line2: initial.line2 || "",
    landmark: initial.landmark || "",
    city: initial.city || DEFAULT_CITY,
    state: initial.state || DEFAULT_STATE,
    pincode: initial.pincode || "",
    isDefault: initial.isDefault ?? true,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.line1.trim()) {
      setError("House / flat / building is required");
      return;
    }
    if (form.pincode.length !== 6) {
      setError("Enter a valid 6-digit pincode");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form className="uc-form" onSubmit={handleSubmit}>
      <p className="uc-area-note">
        We currently serve <strong>Nagpur, Maharashtra</strong> only.
      </p>

      <div className="uc-label-row">
        {LABELS.map((l) => (
          <button
            key={l}
            type="button"
            className={`uc-label-chip${form.label === l ? " active" : ""}`}
            onClick={() => setForm((p) => ({ ...p, label: l }))}
          >
            {l}
          </button>
        ))}
      </div>

      <label className="uc-field">
        <span>House / Flat / Building *</span>
        <input name="line1" value={form.line1} onChange={handleChange} placeholder="Flat 302, Rose Apartments" required />
      </label>

      <label className="uc-field">
        <span>Street / Area</span>
        <input name="line2" value={form.line2} onChange={handleChange} placeholder="Civil Lines" />
      </label>

      <label className="uc-field">
        <span>Landmark</span>
        <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Near XYZ Mall" />
      </label>

      <div className="uc-row">
        <label className="uc-field">
          <span>City</span>
          <input name="city" value={form.city} readOnly className="uc-readonly" />
        </label>
        <label className="uc-field">
          <span>State</span>
          <input name="state" value={form.state} readOnly className="uc-readonly" />
        </label>
      </div>

      <label className="uc-field">
        <span>Pincode *</span>
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="440001"
          maxLength={6}
          inputMode="numeric"
          required
        />
      </label>

      <label className="uc-check">
        <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
        Set as default address
      </label>

      {error && <p className="uc-error">{error}</p>}

      <button type="submit" className="uc-btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}
