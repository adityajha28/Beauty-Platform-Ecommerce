import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cmsStorage, { KEYS } from "../../services/cmsStorage";
import "./AdminTopbar.css";

const TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/operations": "Operations control",
  "/admin/services": "Services",
  "/admin/products": "Products",
  "/admin/offers": "Offers",
  "/admin/content": "Homepage content",
  "/admin/orders": "Orders",
  "/admin/bookings": "Bookings",
  "/admin/users": "Users",
  "/admin/reviews": "Reviews",
};

export default function AdminTopbar({ onMenuToggle, menuOpen = false }) {
  const { pathname } = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const list = cmsStorage.get(KEYS.adminNotifications);
      setUnread(list.filter((n) => !n.read).length);
    };
    refresh();
    window.addEventListener("storage", refresh);
    const id = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener("storage", refresh);
      clearInterval(id);
    };
  }, [pathname]);

  const title = TITLES[pathname] || "Admin";

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={onMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="admin-topbar-titles">
          <span className="admin-topbar-eyebrow">Oraya Beauty</span>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="admin-topbar-actions">
        <Link to="/admin/dashboard#notifications" className="admin-notif-btn">
          <span className="admin-notif-label">Alerts</span>
          {unread > 0 && <span className="admin-notif-badge">{unread}</span>}
        </Link>
        <span className="admin-topbar-user" title="Signed in as admin">
          <span className="admin-user-avatar" aria-hidden="true">A</span>
          <span className="admin-user-name">Admin</span>
        </span>
      </div>
    </header>
  );
}
