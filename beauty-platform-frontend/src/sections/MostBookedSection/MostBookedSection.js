// src/sections/MostBookedSection/MostBookedSection.js
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./MostBookedSection.css";

/* ─── NATIVE ICONS ─── */
const IcoStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const IcoPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function MostBookedSection({ services = [] }) {
  const navigate = useNavigate();

  if (!services.length) return null;

  return (
    <section className="most-booked-sec">
      <div className="app-container">
        
        {/* Section Header */}
        <div className="mb-header-flex">
          <div>
            <h2 className="mb-title">Most <em>Booked</em></h2>
            <p className="mb-subtitle">Highly rated services near you</p>
          </div>
          <button onClick={() => navigate("/services")} className="mb-view-all">
            See All
          </button>
        </div>

        {/* Native Mobile Horizontal Scroll */}
        <motion.div 
          className="mb-scroll-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          {services.map((service) => (
            <motion.div 
              key={service.id} 
              className="mb-mini-card"
              whileTap={{ scale: 0.96 }}
            >
              {/* Image & Badge */}
              <div className="mb-img-box">
                <img src={service.image} alt={service.name} loading="lazy" />
                <div className="mb-rating">
                  4.8 <IcoStar />
                </div>
              </div>

              {/* Content */}
              <div className="mb-info">
                <span className="mb-category">{service.category}</span>
                <h4 className="mb-name">{service.name}</h4>
                <p className="mb-duration">{service.duration} mins</p>
                
                {/* Price & Action Row */}
                <div className="mb-price-row">
                  <span className="mb-price">
                    <span className="mb-price-currency">₹</span>
                    <span className="mb-price-amount">{service.price?.toLocaleString("en-IN")}</span>
                  </span>
                  <button 
                    className="mb-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Trigger your booking modal or cart context here
                      console.log("Quick book clicked for:", service.name);
                    }}
                    aria-label="Book Now"
                  >
                    <IcoPlus />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}