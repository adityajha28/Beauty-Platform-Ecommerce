// src/components/cards/ServiceCard.js
import { useState, useEffect } from "react";
import BookingForm from "../forms/BookingForm"; // Assuming this exists in your project
import "./ServiceCard.css";

/* ─── NATIVE ICONS ─── */
const IcoClock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

function ServiceCard({ service }) {
  const [showBooking, setShowBooking] = useState(false);

  // Lock body scroll when native modal is open
  useEffect(() => {
    document.body.style.overflow = showBooking ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showBooking]);

  if (!service) return null; // Backend safety

  return (
    <>
      <div className="lux-service-card">
        <div className="svc-img-wrap">
          <img src={service.image} alt={service.name} loading="lazy" />
          <span className="svc-badge">{service.category}</span>
        </div>

        <div className="svc-body">
          <h3 className="svc-name">{service.name}</h3>
          <p className="svc-desc">{service.description}</p>

          <div className="svc-meta">
            <span className="svc-price">₹{service.price?.toLocaleString()}</span>
            <span className="svc-duration"><IcoClock /> {service.duration} min</span>
          </div>

          <button className="svc-book-btn" onClick={() => setShowBooking(true)}>
            Book Service
          </button>
        </div>
      </div>

      {/* ─── CUSTOM NATIVE BOTTOM SHEET / MODAL ─── */}
      <div className={`svc-modal-backdrop ${showBooking ? "is-visible" : ""}`} onClick={() => setShowBooking(false)} />
      
      <div className={`svc-modal-panel ${showBooking ? "is-open" : ""}`}>
        <div className="svc-modal-drag" onClick={() => setShowBooking(false)}></div>
        <div className="svc-modal-header">
          <h4>Book {service.name}</h4>
          <button className="svc-close-btn" onClick={() => setShowBooking(false)}>
            <IcoClose />
          </button>
        </div>
        <div className="svc-modal-content">
          {/* Your Booking Form Component */}
          <BookingForm 
            prefilledService={service} 
            onSuccess={() => setShowBooking(false)} 
            onClose={() => setShowBooking(false)} 
          />
        </div>
      </div>
    </>
  );
}

export default ServiceCard;