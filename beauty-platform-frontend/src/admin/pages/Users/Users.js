import { useState, useEffect, Fragment } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { listUsers } from "../../services/adminApi";
import { userStorage } from "../../../utils/userStorage";
import "../../styles/admin-pages.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const apiUsers = await listUsers();
        setUsers(apiUsers);
      } catch (err) {
        setUsers([]);
        setError(err?.response?.data?.message || "Could not load users from the server.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const orders = userStorage.getOrders();
  const bookings = userStorage.getBookings();

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Users</h1>
            <p>Customer profiles, contact details, and activity summary</p>
          </div>
        </header>

        <div className="admin-stat-grid" style={{ marginBottom: "1.25rem" }}>
          <div className="admin-stat"><strong>{users.length}</strong><span>Registered users</span></div>
          <div className="admin-stat"><strong>{orders.length}</strong><span>Product orders</span></div>
          <div className="admin-stat"><strong>{bookings.length}</strong><span>Service bookings</span></div>
        </div>

        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Email</th><th>Addresses</th><th>Details</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <Fragment key={u.id}>
                  <tr>
                    <td><strong>{u.name || "—"}</strong></td>
                    <td>{u.phone || "—"}</td>
                    <td>{u.email || "—"}</td>
                    <td>{(u.addresses || []).length}</td>
                    <td>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setExpanded(expanded === u.id ? null : u.id)}>
                        {expanded === u.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expanded === u.id && (
                    <tr>
                      <td colSpan={5}>
                        <div style={{ padding: "0.5rem 0", fontSize: "0.85rem" }}>
                          <p><strong>Orders:</strong> {orders.filter((o) => o.customer?.phone === u.phone).length}</p>
                          <p><strong>Bookings:</strong> {bookings.filter((b) => b.customer?.phone === u.phone).length}</p>
                          {(u.addresses || []).map((a, i) => (
                            <p key={i}><strong>Address {i + 1}:</strong> {a.line1}, {a.city} {a.pincode}</p>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          {loading && <p className="admin-empty">Loading users…</p>}
          {!loading && error && <p className="admin-empty admin-msg-error">{error}</p>}
          {!loading && !error && users.length === 0 && (
            <p className="admin-empty">No registered customers yet. Users appear here after WhatsApp sign-up.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
