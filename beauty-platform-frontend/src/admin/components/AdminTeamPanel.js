import { useState, useEffect, useCallback } from "react";
import { listAdminTeam, createAdminUser } from "../services/adminApi";

export default function AdminTeamPanel() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAdmins(await listAdminTeam());
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await createAdminUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      setSuccess(`Admin ${form.email} created successfully`);
      setForm({ name: "", email: "", password: "", confirm: "" });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create admin user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-card admin-card-padded" style={{ marginBottom: "1.5rem" }}>
      <header className="admin-page-header" style={{ marginBottom: "1rem" }}>
        <div>
          <h2 className="admin-section-title" style={{ marginBottom: "0.35rem" }}>Admin team</h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
            Create additional admin accounts for your team. Share login credentials securely.
          </p>
        </div>
      </header>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Admin name"
            />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="admin@orayabeauty.in"
              required
            />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
          </div>
          <div className="admin-field">
            <label>Confirm password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
              placeholder="Repeat password"
              required
            />
          </div>
        </div>

        {error && <p className="admin-msg-error">{error}</p>}
        {success && <p className="admin-msg-success">{success}</p>}

        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={submitting}
          style={{ marginTop: "0.75rem" }}
        >
          {submitting ? "Creating…" : "+ Create admin user"}
        </button>
      </form>

      <h3 className="admin-section-title" style={{ marginTop: "1.25rem" }}>Existing admins</h3>
      {loading ? (
        <p className="admin-empty">Loading…</p>
      ) : (
        <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.adminId}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      {!loading && admins.length === 0 && (
        <p className="admin-empty">No admin accounts found.</p>
      )}
    </section>
  );
}
