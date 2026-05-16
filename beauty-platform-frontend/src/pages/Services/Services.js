// src/pages/Services/Services.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";

import "./Services.css";

/* ─── NATIVE ICONS ─── */
const IcoClock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoStar = () => <svg viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IcoCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoVerified = () => <svg viewBox="0 0 24 24" fill="#16A34A" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>;
const IcoRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>;

/* ─── GETLOOK STYLE CATEGORY DATA ─── */
const CATEGORIES = [
  { name: "Special Packages", img: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=150" },
  { name: "Korean Special", img: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=150" },
  { name: "Salon At Home", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=150" },
  { name: "Waxing", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=150" },
  { name: "Hydra Facial", img: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=150" }
];

/* ─── MOCK SERVICES GENERATOR ─── */
const generateMockServices = (category) => {
  if (category === "Special Packages") return [];
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${category}-${i}`,
    name: `${category} Premium Care ${i + 1}`,
    price: 499 + i * 150,
    originalPrice: 799 + i * 150,
    duration: `${30 + i * 15} mins`,
    rating: (4.2 + (i % 5) * 0.1).toFixed(1),
    reviews: 120 + i * 45,
    image: `https://images.unsplash.com/photo-${1515377905703 + i}?q=80&w=200&auto=format&fit=crop`,
    description: "Includes hygienic single-use kits, premium products, and post-care."
  }));
};

const PKG_SERVICES = [
  "Korean Deep Detox Cleanup", "Vitamin C Pedicure", "Vitamin C Manicure",
  "Face Neck Detan", "Face Neck Bleach", "Hot Oil Head Massage",
  "Foot Massage", "Full Arms Normal Waxing", "Half Legs Normal Waxing"
];

export default function Services() {
  const navigate = useNavigate();
  
  // UI States
  const [activeCategory, setActiveCategory] = useState("Special Packages");
  const [activeTab, setActiveTab] = useState("Book Any 4 Services");
  const [standardServices, setStandardServices] = useState([]);
  
  // Package Builder State
  const [selectedPkgServices, setSelectedPkgServices] = useState([
    "Korean Deep Detox Cleanup", "Vitamin C Pedicure", "Vitamin C Manicure", "Face Neck Detan"
  ]);
  const [pkgQty, setPkgQty] = useState(1);

  // Cart State
  const [cart, setCart] = useState({});

  // ─── EFFECTS ───
  useEffect(() => {
    setStandardServices(generateMockServices(activeCategory));
  }, [activeCategory]);

  // ─── HANDLERS ───
  const togglePkgService = (service) => {
    setSelectedPkgServices(prev => {
      if (prev.includes(service)) return prev.filter(s => s !== service);
      if (prev.length >= (activeTab.includes("4") ? 4 : 5)) return prev; 
      return [...prev, service];
    });
  };

  // ✅ FIXED: Name matches exactly what is used in the JSX
  const syncToCart = (newQty) => {
    setPkgQty(newQty);
    if (newQty === 0) {
      const newCart = { ...cart };
      delete newCart["special-pkg"];
      setCart(newCart);
    } else {
      setCart(prev => ({
        ...prev,
        "special-pkg": { 
          id: "special-pkg", 
          name: "Custom Salon Package", 
          price: 999, 
          original: 1549, 
          quantity: newQty 
        }
      }));
    }
  };

  const handleStandardAdd = (service) => {
    setCart(prev => ({
      ...prev,
      [service.id]: { ...service, quantity: 1, original: service.originalPrice }
    }));
  };

  const handleStandardQty = (id, delta) => {
    setCart(prev => {
      const newCart = { ...prev };
      const newQty = newCart[id].quantity + delta;
      if (newQty <= 0) delete newCart[id];
      else newCart[id].quantity = newQty;
      return newCart;
    });
  };

  const handleProceed = () => {
    // Direct redirect to auth page as requested
    navigate("/auth");
  };

  // Cart Totals
  const totalItems = Object.values(cart).reduce((s, i) => s + i.quantity, 0);
  const totalPrice = Object.values(cart).reduce((s, i) => s + (i.price * i.quantity), 0);
  const totalSaved = Object.values(cart).reduce((s, i) => s + ((i.original - i.price) * i.quantity), 0);

  return (
    <div className="gl-layout">
      <Navbar />

      {/* ─── STICKY TOP CATEGORY TRACK ─── */}
      <div className="gl-cat-scroller-wrapper">
        <div className="gl-cat-scroller">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.name} 
              className={`gl-cat-item ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(cat.name);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="gl-cat-img"><img src={cat.img} alt={cat.name} loading="lazy" /></div>
              <span className="gl-cat-text">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="gl-main">
        <div className="gl-content-area">
          
          {activeCategory === "Special Packages" ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              
              {/* Package Tabs */}
              <div className="gl-tabs-track">
                <button className={`gl-tab ${activeTab === "Book Any 4 Services" ? "active" : ""}`} onClick={() => setActiveTab("Book Any 4 Services")}>Book Any 4 Services</button>
                <button className={`gl-tab ${activeTab === "Book Any 5 Services (Premium)" ? "active" : ""}`} onClick={() => setActiveTab("Book Any 5 Services (Premium)")}>Book Any 5 Services (Premium)</button>
              </div>

              <h2 className="gl-section-title">{activeTab}</h2>

              {/* Package Builder Card */}
              <div className="gl-pkg-container">
                
                {/* 4 Images Row */}
                <div className="gl-img-row">
                  <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=200" alt="Facial" />
                  <img src="https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=200" alt="Hands" />
                  <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=200" alt="Feet" />
                  <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=200" alt="Mask" />
                </div>

                {/* Title & Qty Row */}
                <div className="gl-title-row">
                  <div className="gl-title-left">
                    <h3>Choose Any {activeTab.includes("4") ? "4" : "5"} Services</h3>
                    <span className="gl-time"><IcoClock /> 120 mins</span>
                  </div>
                  
                  {/* Plus Minus Box */}
                  <div className="gl-qty-controls">
                    <button onClick={() => syncToCart(Math.max(0, pkgQty - 1))}>−</button>
                    <span>{pkgQty}</span>
                    <button onClick={() => syncToCart(pkgQty + 1)}>+</button>
                  </div>
                </div>

                <div className="gl-proof">7.6k+ women booked in last 7 days</div>

                {/* Pricing */}
                <div className="gl-price-row">
                  <span className="gl-price">₹999</span>
                  <span className="gl-mrp">₹1549</span>
                  <span className="gl-discount"><IcoVerified /> 35% OFF</span>
                </div>

                {/* Checklist exactly like image */}
                <div className="gl-checklist">
                  {PKG_SERVICES.map(service => {
                    const isChecked = selectedPkgServices.includes(service);
                    return (
                      <label key={service} className="gl-check-item">
                        <div className={`gl-checkbox ${isChecked ? "checked" : ""}`}>
                          {isChecked && <IcoCheck />}
                        </div>
                        <input type="checkbox" checked={isChecked} onChange={() => togglePkgService(service)} hidden />
                        <span>{service}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Coupon */}
                <div className="gl-coupon">
                  <div className="gl-coupon-logo">GETLOOK</div>
                  <div className="gl-coupon-info">
                    <strong>SAVE FLAT Rs.250</strong>
                    <span>Use code - GET250 | Min Order 1799</span>
                  </div>
                  <button>GET250</button>
                </div>

                {!cart["special-pkg"] && (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="gl-add-pkg-btn" 
                    onClick={() => syncToCart(1)}
                  >
                    Add Package to Cart
                  </motion.button>
                )}

              </div>
            </motion.div>
          ) : (
            
            /* ─── STANDARD SERVICES LIST ─── */
            <div className="gl-standard-services">
              <h2 className="gl-section-title">{activeCategory}</h2>
              <div className="gl-service-list">
                <AnimatePresence>
                  {standardServices.map((svc, i) => (
                    <motion.div 
                      key={svc.id} 
                      className="gl-svc-card"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="gl-svc-info">
                        <h3 className="gl-svc-title">{svc.name}</h3>
                        <div className="gl-svc-meta">
                          <span className="gl-rating"><IcoStar/> {svc.rating} ({svc.reviews})</span>
                          <span className="gl-time"><IcoClock/> {svc.duration}</span>
                        </div>
                        <div className="gl-price-block">
                          <span className="gl-price">₹{svc.price}</span>
                          <span className="gl-mrp">₹{svc.originalPrice}</span>
                        </div>
                        <p className="gl-desc">{svc.description}</p>
                      </div>

                      <div className="gl-svc-action">
                        <div className="gl-svc-img">
                          <img src={svc.image} alt={svc.name} loading="lazy" />
                        </div>
                        {!cart[svc.id] ? (
                          <motion.button whileTap={{ scale: 0.9 }} className="gl-add-btn" onClick={() => handleStandardAdd(svc)}>
                            ADD
                          </motion.button>
                        ) : (
                          <div className="gl-qty-controls">
                            <button onClick={() => handleStandardQty(svc.id, -1)}>−</button>
                            <span>{cart[svc.id].quantity}</span>
                            <button onClick={() => handleStandardQty(svc.id, 1)}>+</button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
          
        </div>
      </main>

      {/* ─── BOTTOM PROCEED BAR ─── */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            className="gl-bottom-bar" 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="gl-bb-left">
              <span className="gl-bb-items">{totalItems} Item{totalItems > 1 ? 's' : ''}</span>
              <span className="gl-bb-saved">Saved ₹{totalSaved}</span>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="gl-bb-proceed" 
              onClick={handleProceed}
            >
              Proceed <IcoRight />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}