import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./user-components.css";

const REASONS = [
  "Service not as described",
  "Professional did not arrive",
  "Product damaged / wrong item",
  "Duplicate order",
  "Other",
];

export default function RefundModal({ open, onClose, onSubmit, title, amount }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ reason, notes });
    setLoading(false);
    setNotes("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="refund-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="refund-sheet"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Request Refund</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "0 0 1rem" }}>
              {title} · ₹{amount}
            </p>
            <form onSubmit={handleSubmit}>
              <label className="uc-field">
                <span>Reason</span>
                <select value={reason} onChange={(e) => setReason(e.target.value)}>
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="uc-field">
                <span>Additional notes</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional details…" />
              </label>
              <div className="refund-actions">
                <button type="button" className="cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="submit" disabled={loading}>
                  {loading ? "Submitting…" : "Submit Request"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
