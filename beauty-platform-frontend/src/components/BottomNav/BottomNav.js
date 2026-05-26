// src/components/BottomNav/BottomNav.js
import { useLocation, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import "./BottomNav.css";

/* ─── MODERN NATIVE ICONS ─── */
const IcoHome = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.1" : "0"} />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IcoServices = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.15" : "0"} />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const IcoShop = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.1" : "0"} />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const IcoCart = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" fill={active ? "currentColor" : "none"} />
    <circle cx="20" cy="21" r="1" fill={active ? "currentColor" : "none"} />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.1" : "0"} />
  </svg>
);

const IcoProfile = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.1" : "0"} />
    <circle cx="12" cy="7" r="4" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.1" : "0"} />
  </svg>
);

/* ─── NAVIGATION CONFIG ─── */
const TABS = [
  { path: "/", id: "home", label: "Home", Icon: IcoHome },
  { path: "/services", id: "services", label: "Services", Icon: IcoServices },
  { path: "/products", id: "shop", label: "Shop", Icon: IcoShop },
  { path: "/cart", id: "cart", label: "Cart", Icon: IcoCart },
  { path: "/account", id: "profile", label: "Profile", Icon: IcoProfile },
];

function isTabActive(tab, pathname) {
  if (tab.id === "profile") {
    return pathname === "/account" || pathname.startsWith("/profile");
  }
  if (tab.path === "/") return pathname === "/";
  return pathname === tab.path || pathname.startsWith(`${tab.path}/`);
}

export default function BottomNav() {
  const location = useLocation();
  // Fetch cart count from context for backend readiness
  const { cartCount } = useCart(); 

  return (
    <nav className="mob-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mbn-container">
        {TABS.map((tab) => {
          const isActive = isTabActive(tab, location.pathname);

          return (
            <NavLink 
              key={tab.id} 
              to={tab.path} 
              className="mbn-link"
            >
              {/* Framer Motion Wrap for native tap feedback */}
              <motion.div 
                className={`mbn-item ${isActive ? "is-active" : ""}`}
                whileTap={{ scale: 0.88 }}
              >
                
                {/* Sliding Glass Background Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="mbn-indicator" 
                    className="mbn-active-bg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="mbn-icon-wrapper">
                  <tab.Icon active={isActive} />
                  
                  {/* Dynamic Backend Cart Badge */}
                  {tab.id === "cart" && cartCount > 0 && (
                    <motion.span 
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="mbn-badge"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </div>

                <span className="mbn-label">{tab.label}</span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}