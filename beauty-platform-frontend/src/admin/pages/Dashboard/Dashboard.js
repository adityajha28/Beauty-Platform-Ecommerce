import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import AdminTeamPanel from "../../components/AdminTeamPanel";
import { getDashboardStats, listNotifications, markNotificationRead } from "../../services/adminApi";
import cmsStorage, { KEYS } from "../../../services/cmsStorage";
import "../../styles/admin-pages.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0, orders: 0, revenue: 0, bookings: 0, unreadNotifications: 0, pendingReviews: 0,
  });
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    setStats(await getDashboardStats());
    try {
      const list = await listNotifications();
      setNotifications(Array.isArray(list) ? list : cmsStorage.get(KEYS.adminNotifications));
    } catch {
      setNotifications(cmsStorage.get(KEYS.adminNotifications));
    }
  };

  useEffect(() => { load(); }, []);

  const handleNotif = (n) => {
    markNotificationRead(n.id);
    load();
    if (n.type === "order") window.location.href = "/admin/orders";
    else if (n.type === "booking") window.location.href = "/admin/bookings";
    else if (n.type === "review") window.location.href = "/admin/reviews";
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of your Oraya Beauty platform</p>
          </div>
        </header>

        <div className="admin-stat-grid">
          <div className="admin-stat"><strong>{stats.users}</strong><span>Users</span></div>
          <div className="admin-stat"><strong>{stats.orders}</strong><span>Orders</span></div>
          <div className="admin-stat"><strong>{stats.bookings}</strong><span>Bookings</span></div>
          <div className="admin-stat"><strong>₹{stats.revenue.toLocaleString("en-IN")}</strong><span>Revenue</span></div>
          <div className="admin-stat"><strong>{stats.unreadNotifications}</strong><span>Unread alerts</span></div>
          <div className="admin-stat"><strong>{stats.pendingReviews}</strong><span>Pending reviews</span></div>
        </div>

        <AdminTeamPanel />

        <div className="admin-quick-links">
          <Link to="/admin/operations" className="admin-btn admin-btn-primary">Pause / resume orders</Link>
          <Link to="/admin/services" className="admin-btn admin-btn-secondary">Manage services</Link>
          <Link to="/admin/products" className="admin-btn admin-btn-secondary">Manage products</Link>
          <Link to="/admin/content" className="admin-btn admin-btn-secondary">Homepage images</Link>
          <Link to="/admin/reviews" className="admin-btn admin-btn-secondary">Moderate reviews</Link>
        </div>

        <h2 className="admin-section-title">Recent notifications</h2>
        <div className="admin-notif-list" id="notifications">
          {notifications.slice(0, 15).map((n) => (
            <button
              key={n.id}
              type="button"
              className={`admin-notif-item${n.read ? "" : " unread"}`}
              onClick={() => handleNotif(n)}
            >
              <strong>{n.title}</strong>
              <span>{n.message}</span>
              <span className="admin-notif-time">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </button>
          ))}
          {notifications.length === 0 && (
            <p className="admin-empty">No notifications yet. Orders and bookings will appear here.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
