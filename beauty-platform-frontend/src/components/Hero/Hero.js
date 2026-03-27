// src/components/Hero/Hero.js
import { useState, useEffect } from "react";
import "./Hero.css";

/* ─── BACKEND-READY MOCK DATA ─── */
const OFFERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    tag: "Exclusive",
    title: "Bridal Radiance",
    desc: "Complete luxury makeover with 20% off for the bridal season."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    tag: "Trending",
    title: "Keratin Spa",
    desc: "Revitalize your hair with our advanced signature keratin formula."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop",
    tag: "New Arrival",
    title: "24K Gold Facial",
    desc: "Experience ultimate skin hydration with our new premium therapy."
  }
];

/* ─── SVG ICONS ─── */
const IcoLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IcoSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IcoSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M3 12h18M8.5 8.5l7 7M15.5 8.5l-7 7" />
  </svg>
);

const IcoArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Backend-Ready Carousel Auto-Play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % OFFERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log("Searching backend for:", searchQuery);
    // Navigate to results or trigger API
  };

  return (
    <section id="hero" className="app-hero">
      
      {/* ─── 1. LUXURY SALON/SPA BACKGROUND IMAGE ─── */}
      <div className="app-hero-bg">
        <div className="app-hero-overlay" />
      </div>

      <div className="app-hero-ui">
        
        {/* ─── 2. TOP: SEARCH BAR & ACTION BUTTONS ─── */}
        <div className="app-hero-top">
          
          {/* Dynamic App-Style Search Card */}
          <div className="reveal-drop delay-1 w-100">
            <form 
              className={`glass-search-bar ${isSearchFocused ? "is-focused" : ""}`} 
              onSubmit={handleSearch}
            >
              <div className="glass-search-loc">
                <div className="loc-icon-pulse">
                  <IcoLocation />
                </div>
                <div className="loc-text">
                  <span className="loc-label">Current Location</span>
                  <span className="loc-city">Nagpur, Maharashtra</span>
                </div>
              </div>
              
              <div className="glass-search-div" />
              
              <div className="glass-search-field">
                <input 
                  type="text" 
                  className="glass-search-input"
                  placeholder="Search haircuts, makeup, spa..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <button type="submit" className="glass-search-btn" aria-label="Search">
                  <IcoSearch />
                </button>
              </div>
            </form>
          </div>

          {/* PREMIUM ACTION BUTTONS */}
          <div className="reveal-drop delay-2 w-100">
            <div className="app-hero-actions">
              <button className="btn-premium-book">
                <span>Book Now</span>
                <IcoArrowRight />
              </button>
              <button className="btn-premium-explore">
                <IcoSparkle />
                <span>Explore Services</span>
              </button>
            </div>
          </div>

        </div>

        {/* ─── 3. BOTTOM: ELEVATED OFFERS CAROUSEL ─── */}
        <div 
          className="app-hero-bottom reveal-slide-up delay-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="glass-promo-card">
            
            {OFFERS.map((offer, index) => {
              const isActive = index === activeSlide;
              return (
                <div 
                  key={offer.id} 
                  className={`glass-promo-slide ${isActive ? "is-active" : ""}`}
                >
                  <div className="promo-img-wrap">
                    <img src={offer.image} alt={offer.title} loading="lazy" />
                  </div>
                  
                  <div className="promo-text-wrap">
                    <span className="promo-badge">{offer.tag}</span>
                    <h3 className="promo-title">{offer.title}</h3>
                    <p className="promo-desc">{offer.desc}</p>
                  </div>
                </div>
              );
            })}

            {/* Premium Dash Indicators */}
            <div className="promo-nav-cluster">
              {OFFERS.map((_, index) => (
                <button 
                  key={index}
                  className={`promo-dash ${index === activeSlide ? "is-active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`View offer ${index + 1}`}
                >
                  <div className="promo-dash-fill" />
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}