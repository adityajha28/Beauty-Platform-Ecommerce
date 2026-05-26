import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./ReviewsSection.css";

const IcoStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const IcoQuote = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M10 18c0-4.4 2.6-7.4 6.5-9.2L15 5.5C8.8 8.2 5 13.2 5 19.5V26h10v-8H10zm14 0c0-4.4 2.6-7.4 6.5-9.2L29 5.5c-6.2 2.7-10 7.7-10 14v6.5h10v-8H24z" />
  </svg>
);

function StarRow({ rating, delay = 0 }) {
  return (
    <div className="rev-stars" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className={i < rating ? "star-fill" : "star-empty"}
          initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + i * 0.06, type: "spring", stiffness: 380, damping: 18 }}
        >
          <IcoStar />
        </motion.span>
      ))}
    </div>
  );
}

function ReviewCard({ rev, index, isActive }) {
  const initial = (rev.name || "G").trim().charAt(0).toUpperCase();

  return (
    <motion.article
      className={`rev-card${isActive ? " rev-card--active" : ""}`}
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      data-index={index}
    >
      <motion.div
        className="rev-card-glow"
        animate={isActive ? { opacity: 1 } : { opacity: 0.35 }}
        transition={{ duration: 0.4 }}
      />
      <div className="rev-card-inner">
        <div className="rev-quote-ico">
          <IcoQuote />
        </div>
        <StarRow rating={rev.rating || 5} delay={index * 0.05} />
        <p className="rev-text">{rev.text}</p>
        <motion.div
          className="rev-author"
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.06 }}
        >
          <div className="rev-avatar-wrap">
            <div className="rev-avatar">{initial}</div>
            <span className="rev-verified" title="Verified client">✓</span>
          </div>
          <div className="rev-author-meta">
            <h4>{rev.name}</h4>
            {rev.service && <span className="rev-service-tag">{rev.service}</span>}
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function ReviewsSection({ reviews = [] }) {
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  const scrollToIndex = useCallback((index) => {
    const row = scrollRef.current;
    if (!row) return;
    const card = row.children[index];
    if (!card) return;
    const left = card.offsetLeft - (row.clientWidth - card.clientWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    setActive(index);
  }, []);

  const handleScroll = useCallback(() => {
    const row = scrollRef.current;
    if (!row || !row.children.length) return;
    const center = row.scrollLeft + row.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    [...row.children].forEach((el, i) => {
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  }, []);

  useEffect(() => {
    const row = scrollRef.current;
    if (!row) return undefined;
    row.addEventListener("scroll", handleScroll, { passive: true });
    return () => row.removeEventListener("scroll", handleScroll);
  }, [handleScroll, reviews.length]);

  useEffect(() => {
    if (reviews.length < 2 || paused) return undefined;
    const timer = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % reviews.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length, paused, scrollToIndex]);

  if (!reviews.length) return null;

  return (
    <section className="rev-sec" aria-labelledby="reviews-heading">
      <motion.div
        className="rev-bg-orb rev-bg-orb--1"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="rev-bg-orb rev-bg-orb--2"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div className="app-container">
        <motion.header
          className="rev-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="rev-rating-pill"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <span className="rev-rating-num">{avgRating}</span>
            <span className="rev-rating-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="rev-pill-star">
                  <IcoStar />
                </span>
              ))}
            </span>
            <span className="rev-rating-count">{reviews.length}+ happy clients</span>
          </motion.div>

          <motion.h2
            id="reviews-heading"
            className="rev-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <motion.span
              className="rev-title-top"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Client
            </motion.span>
            <motion.span
              className="rev-title-accent"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.28 }}
            >
              Love
            </motion.span>
          </motion.h2>
          <motion.blockquote
            className="rev-quote"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.38 }}
          >
            <p className="rev-quote-text">
              Real stories from brides, parties &amp; everyday glam
            </p>
          </motion.blockquote>
        </motion.header>

        <div
          className="rev-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <button
            type="button"
            className="rev-nav rev-nav--prev"
            aria-label="Previous review"
            onClick={() => scrollToIndex((active - 1 + reviews.length) % reviews.length)}
          >
            ‹
          </button>

          <div className="rev-scroll-mask">
            <motion.div
              ref={scrollRef}
              className="rev-scroll-row"
              role="list"
              aria-label="Customer reviews"
            >
              {reviews.map((rev, i) => (
                <ReviewCard key={rev.id || i} rev={rev} index={i} isActive={active === i} />
              ))}
            </motion.div>
          </div>

          <button
            type="button"
            className="rev-nav rev-nav--next"
            aria-label="Next review"
            onClick={() => scrollToIndex((active + 1) % reviews.length)}
          >
            ›
          </button>
        </div>

        <div className="rev-dots" role="tablist" aria-label="Review slides">
          {reviews.map((rev, i) => (
            <button
              key={rev.id || i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to review ${i + 1}`}
              className={`rev-dot${active === i ? " active" : ""}`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>

        <motion.p
          className="rev-swipe-hint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Swipe to explore more
        </motion.p>
      </motion.div>
    </section>
  );
}
