import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./ScrollToTop.css";

/** Pages that scroll inside a pane instead of the window */
const INNER_SCROLL_ROOT_IDS = ["qc-main-scroll"];

const IcoUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

function readScrollTop() {
  let top = window.scrollY || document.documentElement.scrollTop || 0;
  for (const id of INNER_SCROLL_ROOT_IDS) {
    const el = document.getElementById(id);
    if (el) top = Math.max(top, el.scrollTop);
  }
  return top;
}

export default function ScrollToTop({ threshold = 200 }) {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(readScrollTop() > threshold);
    const innerEls = [];

    const bindInner = () => {
      for (const id of INNER_SCROLL_ROOT_IDS) {
        const el = document.getElementById(id);
        if (el && !innerEls.includes(el)) {
          innerEls.push(el);
          el.addEventListener("scroll", onScroll, { passive: true });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    bindInner();
    onScroll();

    const retry = window.setTimeout(() => {
      bindInner();
      onScroll();
    }, 150);

    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("scroll", onScroll);
      innerEls.forEach((el) => el.removeEventListener("scroll", onScroll));
    };
  }, [threshold, location.pathname]);

  const scrollUp = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    for (const id of INNER_SCROLL_ROOT_IDS) {
      document.getElementById(id)?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="scroll-to-top-btn"
          onClick={scrollUp}
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
        >
          <IcoUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
