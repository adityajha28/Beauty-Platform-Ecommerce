// src/sections/AdBannerSection/AdBannerSection.js
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./AdBannerSection.css";

const IcoSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M3 12h18M8.5 8.5l7 7M15.5 8.5l-7 7" />
  </svg>
);

export default function AdBannerSection() {
  const navigate = useNavigate();

  return (
    <section className="ad-sec app-container">
      <motion.div 
        className="ad-banner-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        onClick={() => navigate("/services?category=Makeup")}
      >
        
        {/* Animated Background Image */}
        <div className="ad-bg">
          {/* Using a highly relatable, stunning makeup portrait */}
          <motion.img 
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1400&auto=format&fit=crop" 
            alt="Luxury Party Makeup" 
            loading="eager" 
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <div className="ad-overlay" />
        </div>

        {/* Floating Animated Sparkles */}
        <motion.div className="ad-sparkle ad-sp-1" animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4], rotate: [0, 15, 0] }} transition={{ duration: 3.5, repeat: Infinity }}><IcoSparkle /></motion.div>
        <motion.div className="ad-sparkle ad-sp-2" animate={{ y: [0, 15, 0], opacity: [0.2, 0.9, 0.2], rotate: [0, -15, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}><IcoSparkle /></motion.div>

        {/* Glassmorphism Content Box */}
        <div className="ad-glass-content">
          <motion.span 
            className="ad-badge"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            Signature Service
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          >
            Flawless Party <em>Makeup</em>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          >
            Book our elite makeup artists for your next big event. Look stunning, feel unstoppable.
          </motion.p>
          
          <motion.button 
            className="ad-btn-glow"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Appointment <span className="btn-arrow">→</span>
          </motion.button>
        </div>

      </motion.div>
    </section>
  );
}