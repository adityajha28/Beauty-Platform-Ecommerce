// src/components/Footer/Footer.js
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Footer.css";

/* ─── NATIVE ICONS ─── */
const IcoSend = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IcoInsta = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const IcoFace = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Backend-ready newsletter submission
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setEmail("");
    setIsSubmitting(false);
    // You would add a toast notification here
  };

  // Framer Motion Orchestration
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <footer className="lux-footer">
      <motion.div 
        className="lux-footer-container"
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }} // Triggers when 20% visible
      >
        
        {/* 1. Brand & Newsletter */}
        <motion.div className="footer-brand-col" variants={itemVars}>
          <Link to="/" className="footer-logo">
            <span className="footer-logo-spark">✦</span>
            Bella<span>Beauty</span>
          </Link>
          <p className="footer-desc">
            Redefining luxury beauty. Premium salon services and exclusive cosmetics curated for your perfect glow.
          </p>
          
          <form className="footer-newsletter" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Join our VIP list" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={isSubmitting} aria-label="Subscribe">
              {isSubmitting ? "..." : <IcoSend />}
            </button>
          </form>
        </motion.div>

        {/* 2. Quick Links */}
        <motion.div className="footer-links-col" variants={itemVars}>
          <h4>Explore</h4>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/services">Salon Services</Link>
            <Link to="/products">Cosmetics Store</Link>
            <Link to="/careers">Careers</Link>
          </nav>
        </motion.div>

        {/* 3. Customer */}
        <motion.div className="footer-links-col" variants={itemVars}>
          <h4>Client Care</h4>
          <nav>
            <Link to="/profile">My Account</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/contact">Support</Link>
          </nav>
        </motion.div>

        {/* 4. Contact & Socials */}
        <motion.div className="footer-contact-col" variants={itemVars}>
          <h4>Contact Us</h4>
          <div className="contact-details">
            <p><strong>T:</strong> +91 99999 99999</p>
            <p><strong>E:</strong> luxury@bellabeauty.com</p>
            <p><strong>A:</strong> Premium Arcade, Nagpur, MH</p>
          </div>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><IcoInsta /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><IcoFace /></a>
          </div>
        </motion.div>

      </motion.div>

      <div className="lux-footer-bottom">
        <p>© {new Date().getFullYear()} Bella Beauty. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="dot-sep">•</span>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;