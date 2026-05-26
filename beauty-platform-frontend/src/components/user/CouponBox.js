import { useState } from "react";
import { validateCoupon, getSuggestedCoupon } from "../../services/couponService";
import "./user-components.css";

export default function CouponBox({ type, subtotal, onApply, applied }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const suggest = getSuggestedCoupon(type);

  const handleApply = async () => {
    if (!code.trim()) {
      setMsg("Enter a coupon code");
      return;
    }
    setLoading(true);
    setMsg("");
    const result = await validateCoupon(code, type, subtotal);
    setLoading(false);
    if (result.valid) {
      onApply(result);
      setMsg(result.message);
    } else {
      setMsg(result.message || "Invalid coupon");
      onApply(null);
    }
  };

  const applySuggested = () => {
    if (suggest?.code) {
      setCode(suggest.code);
    }
  };

  if (applied) {
    return (
      <div className="coupon-box">
        <div className="coupon-applied">
          <span>✓ {applied.code} (−₹{applied.discountAmount})</span>
          <button type="button" onClick={() => onApply(null)}>Remove</button>
        </div>
      </div>
    );
  }

  return (
    <div className="coupon-box">
      {suggest && (
        <p className="coupon-suggest">
          🎁 {suggest.label} — use <button type="button" className="uc-refund-btn" style={{ display: "inline" }} onClick={applySuggested}>{suggest.code}</button>
        </p>
      )}
      <div className="coupon-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon"
        />
        <button type="button" onClick={handleApply} disabled={loading}>
          {loading ? "…" : "Apply"}
        </button>
      </div>
      {msg && <p className={`coupon-msg${applied ? " ok" : ""}`}>{msg}</p>}
    </div>
  );
}
