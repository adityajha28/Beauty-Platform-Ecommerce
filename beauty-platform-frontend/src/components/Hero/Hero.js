// src/components/Hero/Hero.js
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getHeroSlides, getOffers } from "../../services/cmsService";
import useOperationsStatus from "../../hooks/useOperationsStatus";
import "./Hero.css";

/* ─── ICONS ─── */
const IcoSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IcoArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IcoSparkle = () => (
  <svg viewBox="0 0 24 24" fill="#F59E0B" stroke="none" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IcoPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export default function Hero() {
  const navigate = useNavigate();
  const ops = useOperationsStatus();
  const bookingsPaused = ops.servicesOpen === false;
  const [heroImages, setHeroImages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [offerIndex, setOfferIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([getHeroSlides(), getOffers()]).then(([slides, cmsOffers]) => {
      if (slides?.length) setHeroImages(slides.map((s) => s.image).filter(Boolean));
      if (cmsOffers?.length) {
        setOffers(
          cmsOffers.map((o) => ({
            id: o.id,
            badge: o.badge || "OFFER",
            title: o.title,
            desc: o.description,
            img: o.image,
            link: o.link || "/services",
          }))
        );
      }
    });
  }, []);

  useEffect(() => {
    if (!heroImages.length) return undefined;
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(bgTimer);
  }, [heroImages.length]);

  useEffect(() => {
    if (!offers.length) return undefined;
    const offerTimer = setInterval(() => {
      setOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(offerTimer);
  }, [offers.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q.length >= 2) navigate(`/services?search=${encodeURIComponent(q)}`);
    else navigate("/services");
  };

  const handleBookNow = () => navigate("/auth");
  const handleExplore = () => navigate("/services");

  const goToOffer = useCallback((idx) => setOfferIndex(idx), []);

  const currentOffer = offers[offerIndex] || offers[0];

  return (
    <section className="sh-hero" aria-label="Discover beauty services">
      <motion.div className="sh-bg-container" aria-hidden="true">
        <AnimatePresence mode="popLayout">
          {heroImages[bgIndex] && (
            <motion.img
              key={bgIndex}
              src={heroImages[bgIndex]}
              alt=""
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 0.32, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="sh-bg-img"
            />
          )}
        </AnimatePresence>
        <motion.div className="sh-bg-overlay" aria-hidden="true" />
        <div className="sh-bg-glow" />
      </motion.div>

      <div className="sh-shell">
        <header className="sh-headline">
          <span className="sh-eyebrow">Premium home salon</span>
          <h1 className="sh-title">
            Beauty that <em>glows</em>
          </h1>
          <p className="sh-subtitle">Book makeup, hair &amp; spa — delivered to your door in Nagpur.</p>
        </header>

        <div className="sh-stack">
          <form className="sh-search" onSubmit={handleSearch}>
            <div className="sh-loc-row">
              <span className="sh-loc-icon" aria-hidden="true">
                <IcoPin />
              </span>
              <div className="sh-loc-text">
                <span className="sh-loc-label">Current location</span>
                <span className="sh-loc-value">Nagpur, Maharashtra</span>
              </div>
            </div>

            <div className="sh-search-row">
              <input
                type="search"
                className="sh-search-input"
                placeholder="Search haircuts, makeup, spa…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search services"
              />
              <button type="submit" className="sh-search-btn" aria-label="Search">
                <IcoSearch />
              </button>
            </div>
          </form>

          <div className="sh-actions">
            <motion.button
              type="button"
              whileHover={bookingsPaused ? undefined : { scale: 1.02 }}
              whileTap={bookingsPaused ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className={`sh-btn-book${bookingsPaused ? " disabled" : ""}`}
              onClick={handleBookNow}
              disabled={bookingsPaused}
              aria-disabled={bookingsPaused}
              title={bookingsPaused ? ops.serviceMessage : "Book a service"}
            >
              {bookingsPaused ? (
                "Bookings paused"
              ) : (
                <>
                  <span className="sh-btn-book-label">Book Now</span>
                  <span className="sh-btn-book-arrow" aria-hidden="true">
                    <IcoArrowRight />
                  </span>
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              className="sh-btn-explore"
              onClick={handleExplore}
            >
              <IcoSparkle />
              <span className="sh-btn-text-full">Explore Services</span>
              <span className="sh-btn-text-short">Explore</span>
            </motion.button>
          </div>

          {currentOffer && (
          <div className="sh-offer-zone">
            <AnimatePresence mode="wait">
              <motion.article
                key={currentOffer.id}
                className="sh-offer-card"
                role="button"
                tabIndex={0}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                onClick={() => navigate(currentOffer.link)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(currentOffer.link);
                  }
                }}
              >
                <motion.div className="sh-offer-img">
                  <img src={currentOffer.img} alt="" loading="lazy" />
                </motion.div>

                <div className="sh-offer-details">
                  <span className="sh-offer-badge">{currentOffer.badge}</span>
                  <h3 className="sh-offer-title">{currentOffer.title}</h3>
                  <p className="sh-offer-desc">{currentOffer.desc}</p>
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="sh-offer-dots" role="tablist" aria-label="Offers">
              {offers.map((offer, idx) => (
                <button
                  key={offer.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === offerIndex}
                  aria-label={`Offer ${idx + 1}: ${offer.title}`}
                  className={`sh-dot ${idx === offerIndex ? "active" : ""}`}
                  onClick={() => goToOffer(idx)}
                />
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
