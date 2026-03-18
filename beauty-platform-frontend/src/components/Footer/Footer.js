import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <h2 className="footer-logo">
            Bella<span className="logo-dot"></span>
          </h2>

          <p className="footer-desc">
            Premium beauty services and cosmetics delivered
            with luxury salon experience.
          </p>

        </div>

        {/* Quick Links */}
        <div className="footer-links">

          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/products">Products</Link>
          <Link to="/careers">Careers</Link>

        </div>

        {/* Customer */}
        <div className="footer-links">

          <h4>Customer</h4>

          <Link to="/profile">My Profile</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>

        </div>

        {/* Contact */}
        <div className="footer-contact">

          <h4>Contact</h4>

          <p>📞 +91 9999999999</p>
          <p>📧 support@bellabeauty.com</p>
          <p>📍 Nagpur, India</p>

        </div>

      </div>

      <div className="footer-bottom">

        <p>© {new Date().getFullYear()} Bella Beauty. All rights reserved.</p>

      </div>

    </footer>
  );
}

export default Footer;