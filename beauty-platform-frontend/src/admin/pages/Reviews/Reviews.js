import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { listReviews, updateReview, deleteReview } from "../../services/adminApi";
import "../../styles/admin-pages.css";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setReviews(await listReviews());
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = reviews.filter((r) => filter === "all" || r.status === filter);

  const setStatus = async (item, status) => {
    await updateReview({ ...item, status, isActive: status === "approved" });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteReview(id);
    load();
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Reviews</h1>
            <p>Approve feedback before it appears on the homepage</p>
          </div>
        </header>

        <div className="admin-tabs">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button key={f} type="button" className={`admin-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Rating</th><th>For</th><th>Review</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.name}</strong></td>
                  <td>{"★".repeat(r.rating || 0)}</td>
                  <td>{r.targetName || r.service || r.targetType}</td>
                  <td style={{ maxWidth: 220 }}>{r.text}</td>
                  <td><span className={`admin-badge ${r.status === "approved" ? "ok" : r.status === "pending" ? "pending" : "off"}`}>{r.status || "pending"}</span></td>
                  <td>
                    {r.status !== "approved" && <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => setStatus(r, "approved")}>Approve</button>}{" "}
                    {r.status !== "rejected" && <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setStatus(r, "rejected")}>Reject</button>}{" "}
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => remove(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="admin-empty">No reviews in this filter.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
