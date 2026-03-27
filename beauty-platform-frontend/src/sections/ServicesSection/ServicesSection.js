// src/sections/ServicesSection/ServicesSection.js
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceCard from "../../components/cards/ServiceCard";
import PackageBuilder from "../../components/PackageBuilder/PackageBuilder"; // Assuming this exists
import "./ServicesSection.css";

export default function ServicesSection({ services = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamically generate categories from the backend data
  const categories = useMemo(() => {
    const cats = services.map(s => s.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (activeCategory === "All") return services;
    return services.filter((service) => service.category === activeCategory);
  }, [activeCategory, services]);

  if (!services.length) return null;

  return (
    <section id="services" className="lux-services-sec">
      <div className="lux-container">
        
        <div className="lux-sec-header">
          <span className="lux-sec-chip">Salon Services</span>
          <h2 className="lux-sec-title">
            Choose a service or build <em>your own package</em>
          </h2>
          <p className="lux-sec-subtitle">
            Mobile-first salon booking experience with individual services, bundled beauty care, and custom package selection.
          </p>
        </div>

        {/* Scrollable Tabs */}
        <div className="lux-tabs-container">
          <div className="lux-tabs-scroll">
            {categories.map((category) => (
              <button
                key={category}
                className={`lux-tab ${activeCategory === category ? "is-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Service Grid */}
        <motion.div layout className="lux-service-grid">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <PackageBuilder services={services} />
      </div>
    </section>
  );
}