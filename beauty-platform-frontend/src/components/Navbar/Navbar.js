// src/components/Navbar/Navbar.js
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MobileDrawer from "../MobileDrawer/MobileDrawer";
import { useCart }  from "../../context/CartContext";
import { tokenStorage } from "../../auth/services/authService";
import authService from "../../auth/services/authService";
import "./Navbar.css";

/* ─── NAV LINKS config ─── */
const NAV_LINKS = [
  { to: "/",         label: "Home"     },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/careers",  label: "Careers"  },
];

/* ─── SVG ICONS (inline — no extra dependency) ─── */
const CartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" className="chevron-ico" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ─── helper: get initials from name ─── */
const initials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "ME";

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const { cartCount, setCartOpen } = useCart();

  /* ── Auth state ── */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role,       setRole]       = useState(null);   // 'customer' | 'admin' | null
  const [userName,   setUserName]   = useState("");

  /* ── UI state ── */
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [hamActive,    setHamActive]    = useState(false);

  const profileRef = useRef(null);

  /* ── Read auth on every route change ── */
  useEffect(() => {
    const token    = tokenStorage.getAccess();
    const userRole = tokenStorage.getRole();
    const name     = localStorage.getItem("bb_user_name") || "";

    setIsLoggedIn(!!token);
    setRole(userRole);
    setUserName(name);
  }, [location.pathname]);

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  /* ── Close profile on route change ── */
  useEffect(() => setProfileOpen(false), [location.pathname]);

  /* ── Hamburger sync with drawer ── */
  useEffect(() => {
    setHamActive(drawerOpen);
  }, [drawerOpen]);

  /* ── Logout ── */
  const handleLogout = useCallback(async () => {
    setProfileOpen(false);
    await authService.logout();
    setIsLoggedIn(false);
    setRole(null);
    setUserName("");
    navigate("/auth");
  }, [navigate]);

  /* ── Active link check ── */
  const isActive = useCallback(
    (to) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to),
    [location.pathname]
  );

  /* ── Navigate to auth with mode param ── */
  const goLogin  = () => navigate("/auth");
  const goSignup = () => navigate("/auth");

  return (
    <>
      <header id="hdr" className={scrolled ? "up" : ""}>
        <div className="wrap nav">

          {/* ── Hamburger (mobile) ── */}
          <button
            className={`ham${hamActive ? " x" : ""}`}
            onClick={() => setDrawerOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={drawerOpen}
          >
            <i /><i /><i />
          </button>

          {/* ── Logo ── */}
          <Link to="/" className="logo" aria-label="Bella Beauty home">
            <span>Bella</span>
            <span className="logo-dot" aria-hidden="true" />
          </Link>

          {/* ── Desktop nav links ── */}
          <ul className="nav-links" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={isActive(to) ? "cur" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right icons ── */}
          <div className="nav-end">

            {/* Cart button — shown for non-admin users */}
            {role !== "admin" && (
              <button
                className="ico-btn"
                onClick={() => setCartOpen(true)}
                aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              >
                <CartIcon />
                {cartCount > 0 && (
                  <span className="cart-dot" aria-hidden="true">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* ── LOGGED OUT: Login / Sign Up ── */}
            {!isLoggedIn && (
              <div className="nav-auth-btns">
                <button className="nav-login" onClick={goLogin}>
                  Login
                </button>
                <button className="nav-signup" onClick={goSignup}>
                  Sign Up
                </button>
              </div>
            )}

            {/* ── LOGGED IN CUSTOMER: Profile avatar ── */}
            {isLoggedIn && role === "customer" && (
              <div className="profile-wrap" ref={profileRef}>
                <button
                  className="profile-btn customer"
                  onClick={() => setProfileOpen(v => !v)}
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="profile-av customer-av">
                    {userName ? initials(userName) : <UserIcon />}
                  </div>
                  {userName && (
                    <span className="profile-name">{userName.split(" ")[0]}</span>
                  )}
                  <ChevronDown />
                </button>

                {/* Customer dropdown */}
                {profileOpen && (
                  <div className="profile-dropdown" role="menu">
                    <div className="dropdown-header">
                      <div className="dh-av customer-av">{initials(userName)}</div>
                      <div>
                        <div className="dh-name">{userName || "My Account"}</div>
                        <div className="dh-role">Customer</div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile"   className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <span className="di-ico">👤</span> My Profile
                    </Link>
                    <Link to="/profile"   className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <span className="di-ico">📅</span> My Bookings
                    </Link>
                    <Link to="/cart"      className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <span className="di-ico">🛍️</span> My Orders
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" role="menuitem" onClick={handleLogout}>
                      <span className="di-ico">↪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── LOGGED IN ADMIN: Gold shield avatar ── */}
            {isLoggedIn && role === "admin" && (
              <div className="profile-wrap" ref={profileRef}>
                <button
                  className="profile-btn admin"
                  onClick={() => setProfileOpen(v => !v)}
                  aria-label="Admin menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="profile-av admin-av">
                    <ShieldIcon />
                    <span className="admin-av-badge" aria-hidden="true" />
                  </div>
                  <span className="profile-name admin-name">Admin</span>
                  <ChevronDown />
                </button>

                {/* Admin dropdown */}
                {profileOpen && (
                  <div className="profile-dropdown admin-dropdown" role="menu">
                    <div className="dropdown-header admin-header">
                      <div className="dh-av admin-av-sm">
                        <ShieldIcon />
                      </div>
                      <div>
                        <div className="dh-name">{userName || "Admin"}</div>
                        <div className="dh-role admin-role">Super Admin</div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/admin/dashboard" className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <span className="di-ico">📊</span> Dashboard
                    </Link>
                    <Link to="/admin/bookings"  className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <span className="di-ico">📅</span> Bookings
                    </Link>
                    <Link to="/admin/users"     className="dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <span className="di-ico">👥</span> Users
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" role="menuitem" onClick={handleLogout}>
                      <span className="di-ico">↪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>{/* /nav-end */}

        </div>{/* /wrap nav */}
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        isLoggedIn={isLoggedIn}
        role={role}
        userName={userName}
        onLogout={handleLogout}
      />
    </>
  );
}