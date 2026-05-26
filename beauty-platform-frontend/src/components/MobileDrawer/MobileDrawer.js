import { useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "../BrandLogo/BrandLogo";
import { BRAND_NAME, WHATSAPP_URL } from "../../constants/brand";
import "./MobileDrawer.css";

const NAV_LINKS = [
  { to: "/", label: "Home", emoji: "🏠" },
  { to: "/services", label: "Services", emoji: "✨" },
  { to: "/products", label: "Products", emoji: "🛍️" },
  { to: "/careers", label: "Careers", emoji: "💼" },
];

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", emoji: "📊" },
  { to: "/admin/bookings", label: "Bookings", emoji: "📅" },
  { to: "/admin/products", label: "Products", emoji: "🛍️" },
  { to: "/admin/users", label: "Users", emoji: "👥" },
];

const IcoShield = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>
);
const IcoUser = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const initials = (n = "") =>
  n.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "ME";

export default function MobileDrawer({
  open,
  setOpen,
  isLoggedIn = false,
  role = null,
  userName = "",
  onLogout,
  cartCount = 0,
  setCartOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = useCallback(
    (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)),
    [location.pathname]
  );
  const go = useCallback(
    (path) => {
      setOpen(false);
      navigate(path);
    },
    [setOpen, navigate]
  );
  const closeAnd = useCallback(
    (fn) => {
      setOpen(false);
      fn?.();
    },
    [setOpen]
  );

  return (
    <>
      <div
        className={`md-backdrop${open ? " md-backdrop--open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-drawer"
        className={`md-panel${open ? " md-panel--open" : ""}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="md-header">
          <BrandLogo to="/" className="md-brand" size="sm" onClick={() => setOpen(false)} />
          <button type="button" className="md-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <span /><span />
          </button>
        </div>

        {!isLoggedIn ? (
          <div className="md-auth">
            <button type="button" className="md-btn-login" onClick={() => go("/auth?mode=login")}>
              Login
            </button>
            <button type="button" className="md-btn-signup" onClick={() => go("/auth?mode=signup")}>
              Sign Up <span>✦</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="md-profile md-profile--tap"
            onClick={() => go(role === "admin" ? "/admin/dashboard" : "/account")}
          >
            <div className={`md-profile-av ${role === "admin" ? "md-av-admin" : "md-av-customer"}`}>
              {role === "admin" ? <IcoShield /> : userName ? initials(userName) : <IcoUser />}
            </div>
            <div className="md-profile-info">
              <div className="md-profile-name">{userName || (role === "admin" ? "Admin" : "Account")}</div>
              <div className={`md-profile-role${role === "admin" ? " md-role-admin" : ""}`}>
                {role === "admin" ? "Administrator" : "Use Profile tab below for account"}
              </div>
            </div>
            <span className="md-profile-chevron" aria-hidden="true">›</span>
          </button>
        )}

        <nav className="md-nav-block" aria-label="Main navigation">
          <p className="md-section-label">Browse</p>
          <ul className="md-nav-list">
            {NAV_LINKS.map(({ to, label, emoji }, i) => (
              <li key={to} className="md-nav-item" style={{ animationDelay: open ? `${i * 50}ms` : "0ms" }}>
                <Link
                  to={to}
                  className={`md-link${isActive(to) ? " md-link--active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="md-link-icon">{emoji}</span>
                  <span className="md-link-label">{label}</span>
                  <span className="md-link-arrow">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isLoggedIn && role === "admin" && (
          <nav className="md-nav-block" aria-label="Admin navigation">
            <p className="md-section-label">Admin panel</p>
            <ul className="md-nav-list">
              {ADMIN_LINKS.map(({ to, label, emoji }, i) => (
                <li
                  key={to}
                  className="md-nav-item"
                  style={{ animationDelay: open ? `${(NAV_LINKS.length + i) * 50}ms` : "0ms" }}
                >
                  <Link
                    to={to}
                    className={`md-link md-link--admin${isActive(to) ? " md-link--active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="md-link-icon">{emoji}</span>
                    <span className="md-link-label">{label}</span>
                    <span className="md-link-arrow">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="md-quick">
          <p className="md-section-label">Quick actions</p>
          <div className="md-quick-grid">
            <button type="button" className="md-qcard" onClick={() => go("/services")}>
              <span className="md-qcard-ico">📅</span>
              <span className="md-qcard-label">Book</span>
            </button>
            {role !== "admin" && (
              <button type="button" className="md-qcard" onClick={() => closeAnd(() => setCartOpen?.(true))}>
                <span className="md-qcard-ico">🛒</span>
                <span className="md-qcard-label">Cart{cartCount > 0 ? ` (${cartCount})` : ""}</span>
              </button>
            )}
            <button type="button" className="md-qcard" onClick={() => go("/wishlist")}>
              <span className="md-qcard-ico">❤️</span>
              <span className="md-qcard-label">Wishlist</span>
            </button>
            <a
              className="md-qcard"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              <span className="md-qcard-ico">💬</span>
              <span className="md-qcard-label">Chat</span>
            </a>
          </div>
        </div>

        {isLoggedIn && (
          <button
            type="button"
            className="md-logout"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
          >
            <span>↪</span> Sign out
          </button>
        )}

        <div className="md-footer">
          <span>✦ {BRAND_NAME}</span>
        </div>
      </div>
    </>
  );
}
