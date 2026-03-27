// src/components/cards/CategoryCard.js
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./CategoryCard.css";

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link to={`/services?category=${encodeURIComponent(category.name)}`} className="cat-card-link">
      <motion.div 
        className="cat-card"
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="cat-img-box">
          <img src={category.image} alt={category.name} loading="lazy" />
        </div>
        <span className="cat-label">{category.name}</span>
      </motion.div>
    </Link>
  );
}