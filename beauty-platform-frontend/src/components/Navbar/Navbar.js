// src/components/Navbar/Navbar.js
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { tokenStorage } from "../../auth/services/authService";
import authService from "../../auth/services/authService";
import MobileDrawer from "../MobileDrawer/MobileDrawer";
import "./Navbar.css";

/* ─── NAV LINKS ────────────────────────────────────────── */
const NAV_LINKS = [
  { to: "/",         label: "Home",     emoji: "🏠" },
  { to: "/services", label: "Services", emoji: "✨" },
  { to: "/products", label: "Products", emoji: "🛍️" },
  { to: "/careers",  label: "Careers",  emoji: "💼" },
];

/* ─── SVG ICONS ─────────────────────────────────────────── */
const IcoCart = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const IcoUser = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IcoShield = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
  </svg>
);

const IcoChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" className="chev" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IcoHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IcoServices = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
  </svg>
);

const IcoProducts = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const IcoCareers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
  </svg>
);

const IcoBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
);

const BOTTOM_TABS = [
  { to: "/",         label: "Home",     Icon: IcoHome     },
  { to: "/services", label: "Services", Icon: IcoServices },
  { to: "/products", label: "Shop",     Icon: IcoProducts },
  { to: "/careers",  label: "Careers",  Icon: IcoCareers  },
];

/* ─── HELPER ────────────────────────────────────────────── */
const initials = (n = "") => n.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "ME";

/* ═══════════════════════════════════════════════════════════
   NAVBAR COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { cartCount, setCartOpen } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role,       setRole]       = useState(null);
  const [userName,   setUserName]   = useState("");

  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartBounce,  setCartBounce]  = useState(false);

  const profileRef = useRef(null);
  const prevCount  = useRef(cartCount);

  useEffect(() => {
    setIsLoggedIn(!!tokenStorage.getAccess());
    setRole(tokenStorage.getRole());
    setUserName(localStorage.getItem("bb_user_name") || "");
  }, [location.pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 650);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [profileOpen]);

  useEffect(() => {
    setDrawerOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(async () => {
    setProfileOpen(false);
    setDrawerOpen(false);
    await authService.logout();
    setIsLoggedIn(false);
    setRole(null);
    setUserName("");
    navigate("/auth");
  }, [navigate]);

  const isActive = useCallback((to) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to), [location.pathname]);

  const Dropdown = () => (
    <div className={`prof-dropdown ${role === "admin" ? "admin-dd" : ""}`} role="menu">
      <div className={`dd-head ${role === "admin" ? "dd-head-admin" : ""}`}>
        <div className={`dd-av ${role === "admin" ? "av-admin" : "av-customer"}`}>
          {role === "admin" ? <IcoShield /> : initials(userName)}
        </div>
        <div>
          <div className="dd-name">{userName || (role === "admin" ? "Admin" : "My Account")}</div>
          <div className={`dd-role ${role === "admin" ? "dd-role-admin" : ""}`}>
            {role === "admin" ? "⚡ Super Admin" : "✨ Beauty Member"}
          </div>
        </div>
      </div>
      <div className="dd-sep" />
      {role === "admin"
        ? [
            { to: "/admin/dashboard", label: "Dashboard",  ico: "📊" },
            { to: "/admin/bookings",  label: "Bookings",   ico: "📅" },
            { to: "/admin/products",  label: "Products",   ico: "🛍️" },
            { to: "/admin/users",     label: "Users",      ico: "👥" },
          ].map(({ to, label, ico }, i) => (
            <Link key={to} to={to} className="dd-item" role="menuitem" style={{ animationDelay: `${i * 45}ms` }} onClick={() => setProfileOpen(false)}>
              <span className="dd-ico">{ico}</span>{label}
            </Link>
          ))
        : [
            { to: "/profile", label: "My Profile",  ico: "👤" },
            { to: "/profile", label: "My Bookings", ico: "📅" },
            { to: "/cart",    label: "My Orders",   ico: "🛍️" },
          ].map(({ to, label, ico }, i) => (
            <Link key={label} to={to} className="dd-item" role="menuitem" style={{ animationDelay: `${i * 45}ms` }} onClick={() => setProfileOpen(false)}>
              <span className="dd-ico">{ico}</span>{label}
            </Link>
          ))
      }
      <div className="dd-sep" />
      <button className="dd-item dd-logout" role="menuitem" onClick={handleLogout}>
        <span className="dd-ico">↪</span>Sign Out
      </button>
    </div>
  );

  return (
    <>
      <header id="hdr" className={scrolled ? "scrolled" : ""}>
        <div className="wrap nav-row">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-gem">✦</span>
            <span className="nav-logo-name">Bella<span className="nav-logo-dot" aria-hidden="true" />Beauty</span>
          </Link>

          {/* Desktop Nav - Hidden on Mobile */}
          <ul className="nav-links" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={isActive(to) ? "active" : ""}>
                  {label}
                  {isActive(to) && <span className="link-bar" aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-end">
            {role !== "admin" && (
              <button className={`nav-icon-btn${cartBounce ? " cart-bounce" : ""}`} onClick={() => setCartOpen(true)} aria-label="Cart">
                <IcoCart />
                {cartCount > 0 && <span className="cart-badge" aria-hidden="true">{cartCount > 99 ? "99+" : cartCount}</span>}
              </button>
            )}

            {/* Desktop Auth - Hidden on Mobile */}
            {!isLoggedIn ? (
              <div className="nav-auth-pair">
                <button className="btn-login"  onClick={() => navigate("/auth")}>Login</button>
                <button className="btn-signup" onClick={() => navigate("/auth")}>
                  Sign Up<span className="btn-signup-star" aria-hidden="true">✦</span>
                </button>
              </div>
            ) : (
              <div className="prof-wrap" ref={profileRef}>
                <button className={`prof-btn${role === "admin" ? " prof-btn-admin" : ""}`} onClick={() => setProfileOpen(v => !v)} aria-expanded={profileOpen}>
                  <div className={`prof-av ${role === "admin" ? "av-admin" : "av-customer"}`}>
                    {role === "admin" ? <IcoShield /> : (userName ? initials(userName) : <IcoUser />)}
                    {role === "admin" && <span className="online-dot" aria-hidden="true" />}
                  </div>
                  <span className="prof-name">{role === "admin" ? "Admin" : (userName?.split(" ")[0] || "Account")}</span>
                  <IcoChevron />
                </button>
                {profileOpen && <Dropdown />}
              </div>
            )}

            {/* Hamburger - ONLY VISIBLE ON MOBILE via CSS */}
            <button className={`hamburger${drawerOpen ? " is-open" : ""}`} onClick={() => setDrawerOpen(v => !v)} aria-label="Menu">
              <span className="hb-line hb-top"    aria-hidden="true" />
              <span className="hb-line hb-mid"    aria-hidden="true" />
              <span className="hb-line hb-bottom" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen} setOpen={setDrawerOpen} isLoggedIn={isLoggedIn}
        role={role} userName={userName} onLogout={handleLogout}
        cartCount={cartCount} setCartOpen={setCartOpen}
      />

      {/* Bottom Tab Bar - ONLY VISIBLE ON MOBILE via CSS */}
      <nav className="bottom-nav" aria-label="App navigation">
        <div className="bn-inner">
          {BOTTOM_TABS.map(({ to, label, Icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} className={`bn-item${active ? " bn-active" : ""}`}>
                <span className="bn-icon"><Icon />{active && <span className="bn-glow" aria-hidden="true" />}</span>
                <span className="bn-label">{label}</span>
                {active && <span className="bn-activebar" aria-hidden="true" />}
              </Link>
            );
          })}
          <div className="bn-fab-wrap">
            <Link to="/services" className="bn-fab" aria-label="Book a service">
              <IcoBook /><span className="bn-fab-ring" aria-hidden="true" />
            </Link>
            <span className="bn-fab-label">Book</span>
          </div>
        </div>
      </nav>
    </>
  );
}