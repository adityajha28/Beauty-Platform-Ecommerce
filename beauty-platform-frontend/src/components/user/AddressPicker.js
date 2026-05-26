import { Link } from "react-router-dom";
import "./user-components.css";

export default function AddressPicker({ addresses, selectedId, onSelect }) {
  if (!addresses.length) {
    return (
      <div className="addr-picker">
        <p className="uc-area-note">No saved address. Add one to continue.</p>
        <Link to="/profile?tab=addresses" className="uc-btn-primary" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Add Address
        </Link>
      </div>
    );
  }

  return (
    <div className="addr-picker">
      {addresses.map((addr) => (
        <button
          key={addr.id}
          type="button"
          className={`addr-card${selectedId === addr.id ? " selected" : ""}`}
          onClick={() => onSelect(addr)}
        >
          <span className="addr-card-radio" aria-hidden="true" />
          <div className="addr-card-body">
            <strong>{addr.label} · {addr.pincode}</strong>
            <p>
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ""}
              {addr.landmark ? ` · ${addr.landmark}` : ""}
              <br />
              {addr.city}, {addr.state}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
