// src/components/Footer/Footer.js
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BrandLogo from "../BrandLogo/BrandLogo";
import {
  BRAND_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_URL,
} from "../../constants/brand";
import "./Footer.css";

const IcoInsta = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IcoFace = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);
const IcoSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l1.4 4.3L18 8l-4.6 1.7L12 14l-1.4-4.3L6 8l4.6-1.7L12 2zm7 9l.9 2.7L22 14l-2.1.8L19 18l-.9-2.7L16 14l2.1-.8L19 11zm-14 0l.9 2.7L8 14l-2.1.8L5 18l-.9-2.7L2 14l2.1-.8L5 11z" />
  </svg>
);

function Footer() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
  };

  return (
    <footer className="lux-footer">
      <motion.div
        className="footer-orb footer-orb--1"
        aria-hidden="true"
        animate={{ x: [0, 24, 0], y: [0, -16, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="footer-orb footer-orb--2"
        aria-hidden="true"
        animate={{ x: [0, -20, 0], y: [0, 12, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="footer-cta-strip"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="footer-cta-icon" aria-hidden="true">
          <IcoSparkle />
        </span>
        <motion.div className="footer-cta-text">
          <strong>Your glow, our craft</strong>
          <span>Book salon services or shop premium cosmetics today.</span>
        </motion.div>
        <Link to="/services" className="footer-cta-btn">
          Book Now
        </Link>
      </motion.div>

      <motion.div
        className="lux-footer-container"
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div className="footer-brand-col" variants={itemVars}>
          <BrandLogo to="/" className="footer-logo brand-logo--footer" size="md" />
          <p className="footer-desc">
            Redefining luxury beauty. Premium salon services and exclusive cosmetics curated for your perfect glow.
          </p>
          <div className="footer-tagline">
            <span className="footer-tagline-dot" />
            Nagpur · Since 2024
          </div>
        </motion.div>

        <motion.div className="footer-links-col" variants={itemVars}>
          <h4>Explore</h4>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/services">Salon Services</Link>
            <Link to="/products">Cosmetics Store</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/careers">Careers</Link>
          </nav>
        </motion.div>

        <motion.div className="footer-links-col" variants={itemVars}>
          <h4>Client Care</h4>
          <nav>
            <Link to="/profile">My Account</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/contact">Support</Link>
          </nav>
        </motion.div>

        <motion.div className="footer-contact-col" variants={itemVars}>
          <h4>Contact Us</h4>
          <motion.div
            className="contact-details"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p variants={itemVars}>
              <strong>T:</strong> {CONTACT_PHONE_DISPLAY}
            </motion.p>
            <motion.p variants={itemVars}>
              <strong>E:</strong> {CONTACT_EMAIL}
            </motion.p>
            <motion.p variants={itemVars}>
              <strong>A:</strong> Premium Arcade, Nagpur, MH
            </motion.p>
          </motion.div>
          <div className="footer-socials">
            <motion.a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
              whileHover={{ y: -5, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <IcoInsta />
            </motion.a>
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="footer-social-wa"
              whileHover={{ y: -5, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="footer-wa-ico" aria-hidden="true">💬</span>
            </motion.a>
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              whileHover={{ y: -5, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <IcoFace />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="lux-footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
        <motion.div
          className="footer-legal"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          <Link to="/privacy">Privacy Policy</Link>
          <span className="dot-sep">•</span>
          <Link to="/terms">Terms of Service</Link>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer;
