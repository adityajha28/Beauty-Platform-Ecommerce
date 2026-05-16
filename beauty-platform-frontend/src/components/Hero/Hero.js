// src/components/Hero/Hero.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

/* ─── ICONS ─── */
const IcoSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoArrowRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoSparkle = () => <svg viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

/* ─── LIVE BACKGROUND IMAGES (2-Second Carousel) ─── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop", // Makeup
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1600&auto=format&fit=crop", // Hair
  "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1600&auto=format&fit=crop"  // Spa
];

/* ─── OFFERS DATA ─── */
const OFFERS = [
  {
    id: 1,
    badge: "EXCLUSIVE",
    title: "Bridal Radiance",
    desc: "Complete luxury makeover with 20% off for the bridal season.",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop",
    link: "/services?category=Packages"
  },
  {
    id: 2,
    badge: "COUPON",
    title: "Premium Skincare",
    desc: "Get flat ₹500 off on our glowing skin bundle. Code: GLOW500",
    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=200&auto=format&fit=crop",
    link: "/products"
  },
  {
    id: 3,
    badge: "NEW LAUNCH",
    title: "Keratin Spa Therapy",
    desc: "Introductory offer: Smooth, frizz-free hair at just ₹1999.",
    img: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=200&auto=format&fit=crop",
    link: "/services?category=Hair Care"
  }
];

export default function Hero() {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [offerIndex, setOfferIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Background Carousel (2 seconds)
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 2000);
    return () => clearInterval(bgTimer);
  }, []);

  // Offer Slider (5 seconds)
  useEffect(() => {
    const offerTimer = setInterval(() => {
      setOfferIndex((prev) => (prev + 1) % OFFERS.length);
    }, 5000);
    return () => clearInterval(offerTimer);
  }, []);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleBookNow = () => navigate("/auth");
  const handleExplore = () => navigate("/services");

  const currentOffer = OFFERS[offerIndex];

  return (
    <section className="sh-hero">
      
      {/* ─── BACKGROUND CAROUSEL & OVERLAY ─── */}
      <div className="sh-bg-container">
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={bgIndex}
            src={HERO_IMAGES[bgIndex]}
            alt="Salon Background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }} /* Kept very dim to match dark screenshot */
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="sh-bg-img"
          />
        </AnimatePresence>
        <div className="sh-bg-overlay" />
      </div>

      {/* ─── FOREGROUND CONTENT (Single Screen Viewport) ─── */}
      <div className="sh-content">
        
        {/* 1. EXACT SEARCH BAR */}
        <form className="sh-search-bar" onSubmit={handleSearch}>
          <div className="sh-loc-block">
            <span className="sh-loc-label">CURRENT LOCATION</span>
            <span className="sh-loc-value">Nagpur, Maharashtra</span>
          </div>
          
          <div className="sh-divider" />
          
          <div className="sh-input-block">
            <input 
              type="text" 
              placeholder="Search haircuts, makeup, spa..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="sh-search-btn">
              <IcoSearch />
            </button>
          </div>
        </form>

        {/* 2. COMPACT APP-STYLE ACTION BUTTONS */}
        <div className="sh-actions">
          <motion.button whileTap={{ scale: 0.95 }} className="sh-btn-book" onClick={handleBookNow}>
            Book Now <IcoArrowRight />
          </motion.button>
          
          <motion.button whileTap={{ scale: 0.95 }} className="sh-btn-explore" onClick={handleExplore}>
            <IcoSparkle /> Explore Services
          </motion.button>
        </div>

        {/* 3. RUNNING OFFER SLIDER */}
        <div className="sh-offer-wrapper">
          <motion.div 
            className="sh-offer-card"
            key={currentOffer.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(currentOffer.link)}
          >
            <div className="sh-offer-img">
              <img src={currentOffer.img} alt={currentOffer.title} />
            </div>
            
            <div className="sh-offer-details">
              <span className="sh-offer-badge">{currentOffer.badge}</span>
              <h3 className="sh-offer-title">{currentOffer.title}</h3>
              <p className="sh-offer-desc">{currentOffer.desc}</p>
            </div>

            <div className="sh-offer-dots">
              {OFFERS.map((_, idx) => (
                <div key={idx} className={`sh-dot ${idx === offerIndex ? "active" : ""}`} />
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}