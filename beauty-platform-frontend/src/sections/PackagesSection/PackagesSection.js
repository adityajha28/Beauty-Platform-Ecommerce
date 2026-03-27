// src/sections/PackagesSection/PackagesSection.js
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./PackagesSection.css";

const IcoMagic = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;
const IcoArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

export default function PackagesSection({ packages = [] }) {
  const navigate = useNavigate();

  return (
    <section className="pkg-sec">
      <div className="app-container">
        <div className="sec-header-flex">
          <div>
            <h2 className="sec-title">Curated <em>Packages</em></h2>
            <p className="sec-subtitle">Value bundles for your ultimate glow</p>
          </div>
        </div>

        <div className="pkg-scroll-row">
          
          {/* CUSTOM PACKAGE CREATOR CARD */}
          <motion.div 
            className="pkg-card custom-pkg-card"
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/services?category=Custom")}
          >
            <div className="custom-pkg-content">
              <div className="magic-icon"><IcoMagic /></div>
              <h3>Create Your Own Package</h3>
              <p>Select any 3+ services and get a flat 15% off instantly.</p>
              <button className="custom-btn">Build Now <IcoArrow /></button>
            </div>
            <div className="custom-pkg-bg" />
          </motion.div>

          {/* PRE-MADE PACKAGES */}
          {packages.map((pkg, i) => (
            <motion.div 
              key={pkg.id} 
              className="pkg-card standard-pkg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/services?category=Packages`)}
            >
              <div className="pkg-img-box">
                <img src={pkg.image} alt={pkg.name} loading="lazy" />
                <span className="pkg-discount">{pkg.discount} Off</span>
              </div>
              <div className="pkg-info">
                <h4>{pkg.name}</h4>
                <p className="pkg-includes">{pkg.servicesIncluded.join(" • ")}</p>
                <div className="pkg-price-row">
                  <div className="price-block">
                    <span className="price-new">₹{pkg.price}</span>
                    <span className="price-old">₹{pkg.originalPrice}</span>
                  </div>
                  <button className="pkg-add-btn">+</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}