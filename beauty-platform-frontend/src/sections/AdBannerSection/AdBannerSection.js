// src/sections/AdBannerSection/AdBannerSection.js
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./AdBannerSection.css";

const IcoSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M3 12h18M8.5 8.5l7 7M15.5 8.5l-7 7" />
  </svg>
);

const DEFAULT_BANNERS = [
  {
    id: "mk_default",
    title: "Flawless Party Makeup",
    subtitle: "At-home artists · Nagpur",
    badge: "Signature Service",
    description: "Book our elite makeup artists for your next big event.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1400",
    ctaLabel: "Book Appointment",
    link: "/services?category=Makeup",
  },
];

export default function AdBannerSection({ banners = [] }) {
  const navigate = useNavigate();
  const slides = banners.length >= 1 ? banners.filter((b) => b.isActive !== false) : DEFAULT_BANNERS;
  const [index, setIndex] = useState(0);
  const current = slides[index] || slides[0];

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!current) return null;

  const go = () => navigate(current.link || "/services");

  return (
    <section className="ad-sec app-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id || index}
          className="ad-banner-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          onClick={go}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              go();
            }
          }}
        >
          <div className="ad-bg">
            <motion.img
              src={current.image}
              alt={current.title}
              loading="eager"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <div className="ad-overlay" />
          </div>

          <motion.div className="ad-sparkle ad-sp-1" animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 3.5, repeat: Infinity }}><IcoSparkle /></motion.div>
          <motion.div className="ad-sparkle ad-sp-2" animate={{ y: [0, 15, 0], opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}><IcoSparkle /></motion.div>

          <div className="ad-glass-content">
            {current.badge && <span className="ad-badge">{current.badge}</span>}
            <h2>
              {current.title?.includes("<em>") ? (
                <span dangerouslySetInnerHTML={{ __html: current.title }} />
              ) : (
                <>
                  {current.title?.split(" ").slice(0, -1).join(" ")}{" "}
                  <em>{current.title?.split(" ").slice(-1)}</em>
                </>
              )}
            </h2>
            {current.subtitle && <p className="ad-subtitle">{current.subtitle}</p>}
            <p>{current.description}</p>
            <motion.button type="button" className="ad-btn-glow" whileTap={{ scale: 0.95 }}>
              {current.ctaLabel || "Book Now"} <span className="btn-arrow">→</span>
            </motion.button>
          </div>

          {slides.length > 1 && (
            <motion.div className="ad-dots" role="tablist" aria-label="Makeup banners">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`ad-dot${i === index ? " active" : ""}`}
                  aria-selected={i === index}
                  onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
