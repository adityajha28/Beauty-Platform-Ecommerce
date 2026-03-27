// src/components/drawers/FilterDrawer.js
import { useEffect } from "react";
import "./FilterDrawer.css";

const IcoClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function FilterDrawer({ open, onClose, sortBy, setSortBy, priceRange, setPriceRange, clearFilters }) {
  
  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  return (
    <>
      <div className={`filter-backdrop ${open ? "is-open" : ""}`} onClick={onClose} aria-hidden="true" />
      
      <div className={`filter-panel ${open ? "is-open" : ""}`}>
        
        {/* Mobile Drag Handle */}
        <div className="filter-drag-handle" />

        <div className="filter-header">
          <h2>Refine Search</h2>
          <button className="filter-close-btn" onClick={onClose} aria-label="Close"><IcoClose /></button>
        </div>

        <div className="filter-content">
          
          <div className="filter-section">
            <label className="filter-label">Sort By</label>
            <div className="filter-chips">
              {[
                { key: "popular", label: "Most Popular" },
                { key: "rating", label: "Top Rated" },
                { key: "price-asc", label: "Price: Low to High" },
                { key: "price-desc", label: "Price: High to Low" },
              ].map(s => (
                <button 
                  key={s.key} 
                  className={`filter-chip ${sortBy === s.key ? "active" : ""}`} 
                  onClick={() => setSortBy(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Price Range</label>
            <div className="filter-chips">
              {[
                { key: "all", label: "Any Price" },
                { key: "0-500", label: "Under ₹500" },
                { key: "500-1500", label: "₹500 - ₹1,500" },
                { key: "1500+", label: "Over ₹1,500" },
              ].map(p => (
                <button 
                  key={p.key} 
                  className={`filter-chip ${priceRange === p.key ? "active" : ""}`} 
                  onClick={() => setPriceRange(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="filter-footer">
          <button className="filter-clear-btn" onClick={clearFilters}>Reset</button>
          <button className="filter-apply-btn" onClick={onClose}>Show Results</button>
        </div>

      </div>
    </>
  );
}