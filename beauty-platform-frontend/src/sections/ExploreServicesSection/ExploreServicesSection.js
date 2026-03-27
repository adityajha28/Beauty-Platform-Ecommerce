// src/sections/ExploreServicesSection/ExploreServicesSection.js
import { motion } from "framer-motion";
import CategoryCard from "../../components/cards/CategoryCard";
import "./ExploreServicesSection.css";

export default function ExploreServicesSection({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className="explore-sec">
      <div className="app-container">
        <div className="sec-header">
          <h2 className="sec-title">Explore our <em>Services</em></h2>
        </div>

        <motion.div 
          className="cat-grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}