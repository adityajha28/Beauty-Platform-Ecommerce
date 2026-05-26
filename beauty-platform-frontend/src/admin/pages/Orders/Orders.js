import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { userStorage } from "../../../utils/userStorage";
import cmsStorage, { KEYS } from "../../../services/cmsStorage";
import { markNotificationRead } from "../../services/adminApi";
import "../../styles/admin-pages.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => setOrders(userStorage.getOrders());

  useEffect(() => { load(); }, []);

  const openDetail = (o) => {
    setSelected(o);
    const notifs = cmsStorage.get(KEYS.adminNotifications);
    const match = notifs.find((n) => n.type === "order" && n.payload?.id === o.id && !n.read);
    if (match) markNotificationRead(match.id);
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Orders</h1>
            <p>Product orders — synced from checkout and API</p>
          </div>
        </header>

        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Items</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{String(o.id).slice(-8)}</td>
                  <td>{(o.items || []).map((i) => i.name).join(", ") || "—"}</td>
                  <td>{o.customer?.name || "—"}<br /><span style={{ color: "#64748b", fontSize: "0.78rem" }}>{o.customer?.phone}</span></td>
                  <td>₹{o.total ?? 0}</td>
                  <td>{o.paymentMethod || "—"}</td>
                  <td><span className={`admin-badge ${o.status === "confirmed" ? "ok" : "pending"}`}>{o.status || "pending"}</span></td>
                  <td><button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openDetail(o)}>Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="admin-empty">No orders yet.</p>}
        </div>

        {selected && (
          <div className="admin-card" style={{ marginTop: "1rem", padding: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>Order details</h3>
            <pre style={{ fontSize: "0.78rem", overflow: "auto", background: "#f8fafc", padding: "1rem", borderRadius: 10 }}>{JSON.stringify(selected, null, 2)}</pre>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setSelected(null)}>Close</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
