import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { listBookings, updateBookingStatus, markNotificationRead } from "../../services/adminApi";
import cmsStorage, { KEYS } from "../../../services/cmsStorage";
import "../../styles/admin-pages.css";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listBookings();
      setBookings(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDetail = (b) => {
    setSelected(b);
    const notifs = cmsStorage.get(KEYS.adminNotifications);
    const match = notifs.find((n) => n.type === "booking" && n.payload?.id === b.id && !n.read);
    if (match) markNotificationRead(match.id);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      await load();
      if (selected?.id === id) {
        setSelected((s) => (s ? { ...s, status } : s));
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Bookings</h1>
            <p>Service appointments from checkout and booking requests</p>
          </div>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={load}>
            Refresh
          </button>
        </header>

        <div className="admin-card admin-table-wrap">
          {loading ? (
            <p className="admin-empty">Loading bookings…</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Date / Slot</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>#{String(b.id).slice(-8)}</td>
                    <td>
                      <strong>
                        {b.serviceName || b.items?.map((i) => i.name).join(", ") || "—"}
                      </strong>
                    </td>
                    <td>
                      {b.customer?.name || "—"}
                      <br />
                      <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
                        {b.customer?.phone}
                      </span>
                    </td>
                    <td>
                      {b.date || "—"} {b.slot || ""}
                    </td>
                    <td>₹{b.total ?? b.amount ?? 0}</td>
                    <td>
                      <select
                        className="admin-select-sm"
                        value={b.status || "pending"}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => openDetail(b)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && bookings.length === 0 && (
            <p className="admin-empty">
              No bookings yet. New bookings appear after customers complete service checkout.
            </p>
          )}
        </div>

        {selected && (
          <div className="admin-card" style={{ marginTop: "1rem", padding: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>Booking details</h3>
            <pre
              style={{
                fontSize: "0.78rem",
                overflow: "auto",
                background: "#f8fafc",
                padding: "1rem",
                borderRadius: 10,
              }}
            >
              {JSON.stringify(selected, null, 2)}
            </pre>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}