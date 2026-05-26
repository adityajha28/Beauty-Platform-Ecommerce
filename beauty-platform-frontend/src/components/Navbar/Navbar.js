// src/components/Navbar/Navbar.js
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { tokenStorage } from "../../auth/services/authService";
import authService from "../../auth/services/authService";
import MobileDrawer from "../MobileDrawer/MobileDrawer";
import BrandLogo from "../BrandLogo/BrandLogo";
import useIsMobile from "../../hooks/useIsMobile";
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

const IcoHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
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

const IcoAccount = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" aria-hidden="true">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
  </svg>
);
const IcoCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" aria-hidden="true">
    <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>
  </svg>
);
const IcoGift = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" aria-hidden="true">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
);
const IcoLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IcoHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IcoProducts = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const CUSTOMER_MENU = [
  { to: "/account", label: "Your account", Icon: IcoAccount },
  { to: "/profile?tab=orders", label: "Orders", Icon: IcoBox },
  { to: "/profile?tab=bookings", label: "Bookings", Icon: IcoCalendar },
  { to: "/wishlist", label: "Wishlist", Icon: IcoHeart },
  { to: "/profile?tab=addresses", label: "Addresses", Icon: IcoPin },
  { to: "/profile?tab=coupons", label: "Coupons", Icon: IcoGift },
];

const ADMIN_MENU = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: IcoHome },
  { to: "/admin/bookings", label: "Bookings", Icon: IcoCalendar },
  { to: "/admin/products", label: "Products", Icon: IcoProducts },
  { to: "/admin/users", label: "Users", Icon: IcoAccount },
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
  const { wishlistCount } = useWishlist();
  const isMobile = useIsMobile();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role,       setRole]       = useState(null);
  const [userName,   setUserName]   = useState("");

  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartBounce,  setCartBounce]  = useState(false);

  const profileRef = useRef(null);
  const dropdownRef = useRef(null);
  const prevCount  = useRef(cartCount);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 16 });

  const syncAuthUi = useCallback(() => {
    setIsLoggedIn(!!tokenStorage.getAccess());
    setRole(tokenStorage.getRole());
    const stored = localStorage.getItem("bb_user_name") || "";
    let profileName = "";
    try {
      const raw = localStorage.getItem("oraya_user_profile");
      profileName = raw ? JSON.parse(raw)?.name || "" : "";
    } catch {
      profileName = "";
    }
    setUserName(stored || profileName);
  }, []);

  useEffect(() => {
    syncAuthUi();
    window.addEventListener("oraya-auth-changed", syncAuthUi);
    return () => window.removeEventListener("oraya-auth-changed", syncAuthUi);
  }, [syncAuthUi]);

  useEffect(() => {
    syncAuthUi();
  }, [location.pathname, syncAuthUi]);

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
    const lock = drawerOpen || (!isMobile && profileOpen);
    document.body.style.overflow = lock ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen, isMobile, profileOpen]);

  const updateMenuPosition = useCallback(() => {
    if (!profileRef.current) return;
    const rect = profileRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 10,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, []);

  useEffect(() => {
    if (!profileOpen || isMobile) return;
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [profileOpen, isMobile, updateMenuPosition]);

  useEffect(() => {
    if (!profileOpen) return;
    const onPointer = (e) => {
      const inTrigger = profileRef.current?.contains(e.target);
      const inMenu = dropdownRef.current?.contains(e.target);
      if (!inTrigger && !inMenu) setProfileOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
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

  const menuItems = role === "admin" ? ADMIN_MENU : CUSTOMER_MENU;
  const displayName = userName?.trim() || (role === "admin" ? "Admin" : "Guest");
  const firstName = displayName.split(/\s+/)[0];

  const openProfile = () => {
    setDrawerOpen(false);
    setProfileOpen(true);
  };

  const profileMenu = profileOpen && !isMobile
    ? createPortal(
        <>
          <button
            type="button"
            className="prof-menu-backdrop"
            aria-label="Close menu"
            onClick={() => setProfileOpen(false)}
          />
          <div
            ref={dropdownRef}
            className={`prof-dropdown${role === "admin" ? " admin-dd" : ""}`}
            role="menu"
            aria-label="Account menu"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <div className="dd-head">
              <div className={`dd-av ${role === "admin" ? "av-admin" : "av-customer"}`}>
                {role === "admin" ? <IcoShield /> : initials(displayName)}
              </div>
              <div className="dd-head-text">
                <div className="dd-name">{displayName}</div>
                <div className={`dd-role${role === "admin" ? " dd-role-admin" : ""}`}>
                  {role === "admin" ? "Administrator" : "Oraya member"}
                </div>
              </div>
            </div>

            {role !== "admin" && (
              <Link
                to="/account"
                className="dd-account-cta"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                Manage your account
              </Link>
            )}

            <div className="dd-menu-group">
              <p className="dd-group-label">{role === "admin" ? "Admin panel" : "Quick links"}</p>
              {menuItems.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="dd-item"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <span className="dd-ico" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="dd-label">{label}</span>
                </Link>
              ))}
            </div>

            <div className="dd-footer">
              <button type="button" className="dd-item dd-logout" role="menuitem" onClick={handleLogout}>
                <span className="dd-ico" aria-hidden="true">
                  <IcoLogout />
                </span>
                <span className="dd-label">Sign out</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )
    : null;


  return (
    <>
      <header id="hdr" className={scrolled ? "scrolled" : ""}>
        <div className="nav-wrap nav-row">
          <BrandLogo to="/" className="brand-logo--nav" size="md" />

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
              <Link
                to="/wishlist"
                className={`nav-icon-btn nav-wishlist-btn${location.pathname === "/wishlist" ? " active" : ""}`}
                aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
              >
                <IcoHeart />
                {wishlistCount > 0 && (
                  <span className="cart-badge wishlist-badge" aria-hidden="true">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {role !== "admin" && (
              <button className={`nav-icon-btn${cartBounce ? " cart-bounce" : ""}`} onClick={() => setCartOpen(true)} aria-label="Cart">
                <IcoCart />
                {cartCount > 0 && <span className="cart-badge" aria-hidden="true">{cartCount > 99 ? "99+" : cartCount}</span>}
              </button>
            )}

            {/* Desktop Auth - Hidden on Mobile */}
            {!isLoggedIn ? (
              <div className="nav-auth-pair">
                <button className="btn-login"  onClick={() => navigate("/auth?mode=login")}>Login</button>
                <button className="btn-signup" onClick={() => navigate("/auth?mode=signup")}>
                  Sign Up<span className="btn-signup-star" aria-hidden="true">✦</span>
                </button>
              </div>
            ) : !isMobile ? (
              <div className="prof-wrap" ref={profileRef}>
                <button
                  type="button"
                  className={`prof-btn${role === "admin" ? " prof-btn-admin" : ""}${profileOpen ? " is-open" : ""}`}
                  onClick={() => (profileOpen ? setProfileOpen(false) : openProfile())}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                >
                  <div className={`prof-av ${role === "admin" ? "av-admin" : "av-customer"}`}>
                    {role === "admin" ? <IcoShield /> : (userName ? initials(userName) : <IcoUser />)}
                  </div>
                  <span className="prof-name">{role === "admin" ? "Admin" : firstName}</span>
                  <IcoChevron />
                </button>
              </div>
            ) : null}

            {/* Hamburger - ONLY VISIBLE ON MOBILE via CSS */}
            <button
              className={`hamburger${drawerOpen ? " is-open" : ""}`}
              onClick={() => {
                setProfileOpen(false);
                setDrawerOpen((v) => !v);
              }}
              aria-label="Menu"
            >
              <span className="hb-line hb-top"    aria-hidden="true" />
              <span className="hb-line hb-mid"    aria-hidden="true" />
              <span className="hb-line hb-bottom" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {profileMenu}

      <MobileDrawer
        open={drawerOpen} setOpen={setDrawerOpen} isLoggedIn={isLoggedIn}
        role={role} userName={userName} onLogout={handleLogout}
        cartCount={cartCount} setCartOpen={setCartOpen}
      />

    </>
  );
}