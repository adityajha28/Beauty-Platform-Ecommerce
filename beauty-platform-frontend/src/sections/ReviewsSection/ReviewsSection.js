// src/sections/ReviewsSection/ReviewsSection.js
import { motion } from "framer-motion";
import "./ReviewsSection.css";

const IcoStar = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

export default function ReviewsSection({ reviews = [] }) {
  if (!reviews.length) return null;

  return (
    <section className="rev-sec">
      <div className="app-container">
        <h2 className="sec-title">Client <em>Love</em></h2>
        
        <div className="rev-scroll-row">
          {reviews.map((rev, i) => (
            <motion.div 
              key={rev.id} className="rev-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            >
              <div className="rev-stars">
                {[...Array(5)].map((_, index) => <span key={index} className={index < rev.rating ? "star-fill" : "star-empty"}><IcoStar /></span>)}
              </div>
              <p className="rev-text">"{rev.text}"</p>
              <div className="rev-author">
                <div className="rev-avatar">{rev.name.charAt(0)}</div>
                <div>
                  <h4>{rev.name}</h4>
                  <span>{rev.service}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}