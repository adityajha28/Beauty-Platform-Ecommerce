// src/components/ui/FloatingBookingButton.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./FloatingBookingButton.css";

/* ─── NATIVE ICON ─── */
const IcoCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
  </svg>
);

/**
 * Advanced Floating Booking Button
 * @param {string} label - The main CTA text
 * @param {string} targetRoute - Dynamic route from backend
 * @param {string} promoText - Optional promotional badge (e.g., "20% Off")
 */
function FloatingBookingButton({ 
  label = "Book Service", 
  targetRoute = "/services", 
  promoText = null 
}) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll direction detection for immersive app feel
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down past 100px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fbb-wrapper"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.button
            className="fbb-btn"
            onClick={() => navigate(targetRoute)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
          >
            <div className="fbb-glow-ring" />
            
            <span className="fbb-icon">
              <IcoCalendar />
            </span>
            
            <span className="fbb-label">{label}</span>

            {/* Backend-Driven Promotional Badge */}
            {promoText && (
              <span className="fbb-promo-badge">
                {promoText}
              </span>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingBookingButton;