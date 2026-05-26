import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/operations", label: "Operations", icon: "⏸️" },
  { to: "/admin/services", label: "Services", icon: "💆‍♀️" },
  { to: "/admin/products", label: "Products", icon: "🛍️" },
  { to: "/admin/offers", label: "Offers", icon: "🏷️" },
  { to: "/admin/content", label: "Homepage", icon: "🖼️" },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
  { to: "/admin/bookings", label: "Bookings", icon: "📅" },
  { to: "/admin/time-slots", label: "Time slots", icon: "🕐" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/reviews", label: "Reviews", icon: "⭐" },
];

export default function AdminSidebar({ open = false, onNavigate }) {
  return (
    <aside className={`admin-sidebar${open ? " open" : ""}`} aria-label="Admin navigation">
      <div className="admin-sidebar-head">
        <div className="admin-sidebar-brand-wrap">
          <span className="admin-sidebar-logo" aria-hidden="true">O</span>
          <div>
            <h2 className="admin-sidebar-brand">Oraya Admin</h2>
            <span className="admin-sidebar-tag">Control panel</span>
          </div>
        </div>
        <button
          type="button"
          className="admin-sidebar-close"
          aria-label="Close menu"
          onClick={onNavigate}
        >
          ×
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {LINKS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={onNavigate}
          >
            <span className="admin-nav-icon" aria-hidden="true">{icon}</span>
            <span className="admin-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-foot">
        <a href="/" className="admin-sidebar-store-link">
          ← View storefront
        </a>
      </div>
    </aside>
  );
}
