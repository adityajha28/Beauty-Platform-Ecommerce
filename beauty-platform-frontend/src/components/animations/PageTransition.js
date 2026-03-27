// src/components/animations/PageTransition.js
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Advanced Page Transition
 * - Mimics native app navigation (Scale + Fade)
 * - Backend Ready: Works seamlessly with data-fetching delays
 */
function PageTransition({ children }) {
  const location = useLocation();

  const variants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      y: 10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1], // Custom "Expo" easing for luxury feel
        staggerChildren: 0.1,    // Allows internal elements to cascade
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        // Prevents layout shifts on mobile during transition
        style={{ width: "100%", originY: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;