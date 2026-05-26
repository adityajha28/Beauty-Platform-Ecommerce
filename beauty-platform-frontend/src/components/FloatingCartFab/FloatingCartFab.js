import { motion, AnimatePresence } from "framer-motion";
import "./FloatingCartFab.css";

const IcoCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const IcoChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * Amazon-style centered floating cart pill.
 * @param {number} itemCount
 * @param {string} [previewImage]
 * @param {number} [subtotal]
 * @param {Function} onClick
 * @param {string} [label]
 * @param {string} [className]
 */
export default function FloatingCartFab({
  itemCount = 0,
  previewImage,
  subtotal,
  onClick,
  label = "View cart",
  className = "",
}) {
  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          type="button"
          className={`floating-cart-fab ${className}`.trim()}
          onClick={onClick}
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          whileTap={{ scale: 0.96 }}
          aria-label={`${label}, ${itemCount} items`}
        >
          <span className="fcf-thumb">
            {previewImage ? (
              <img src={previewImage} alt="" />
            ) : (
              <span className="fcf-thumb-fallback"><IcoCart /></span>
            )}
          </span>
          <span className="fcf-text">
            <span className="fcf-label">{label}</span>
            <span className="fcf-meta">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
              {subtotal != null && ` · ₹${subtotal.toLocaleString("en-IN")}`}
            </span>
          </span>
          <span className="fcf-arrow"><IcoChevron /></span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
