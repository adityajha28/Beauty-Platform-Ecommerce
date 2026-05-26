import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../layout/AdminLayout";
import AdminModal from "../../components/AdminModal";
import { listOffers, saveOffer, deleteOffer } from "../../services/adminApi";
import { uid } from "../../../services/cmsStorage";
import "../../styles/admin-pages.css";

const empty = () => ({
  id: "", title: "", badge: "", description: "", code: "", discountPercent: "",
  image: "", link: "/services", isActive: true,
});

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty());

  const load = useCallback(async () => {
    setOffers(await listOffers());
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    await saveOffer({
      ...form,
      id: form.id || uid("off"),
      discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
    });
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    await deleteOffer(id);
    load();
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Offers</h1>
            <p>Promotions shown in the hero carousel and across the site</p>
          </div>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => { setForm(empty()); setModal("edit"); }}>
            + Add offer
          </button>
        </header>

        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Image</th><th>Title</th><th>Badge</th><th>Code</th><th>Discount</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id}>
                  <td><img src={o.image} alt="" className="admin-thumb" /></td>
                  <td><strong>{o.title}</strong></td>
                  <td>{o.badge}</td>
                  <td>{o.code || "—"}</td>
                  <td>{o.discountPercent ? `${o.discountPercent}%` : "—"}</td>
                  <td><span className={`admin-badge ${o.isActive ? "ok" : "off"}`}>{o.isActive ? "Active" : "Hidden"}</span></td>
                  <td>
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => { setForm({ ...o }); setModal("edit"); }}>Edit</button>{" "}
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(o.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {offers.length === 0 && <p className="admin-empty">No offers yet.</p>}
        </div>

        <AdminModal open={modal === "edit"} title={form.id ? "Edit offer" : "Add offer"} onClose={() => setModal(null)}>
          <form className="admin-form" onSubmit={handleSave}>
            <div className="admin-field"><label>Title</label><input value={form.title || ""} onChange={(e) => set("title", e.target.value)} required /></div>
            <div className="admin-field"><label>Badge</label><input value={form.badge || ""} onChange={(e) => set("badge", e.target.value)} placeholder="EXCLUSIVE, NEW…" /></div>
            <div className="admin-field"><label>Description</label><textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
            <div className="admin-field"><label>Coupon code</label><input value={form.code || ""} onChange={(e) => set("code", e.target.value)} /></div>
            <div className="admin-field"><label>Discount %</label><input type="number" value={form.discountPercent ?? ""} onChange={(e) => set("discountPercent", e.target.value)} /></div>
            <div className="admin-field"><label>Image URL</label><input value={form.image || ""} onChange={(e) => set("image", e.target.value)} /></div>
            <div className="admin-field"><label>Link path</label><input value={form.link || ""} onChange={(e) => set("link", e.target.value)} placeholder="/services or /products" /></div>
            <label><input type="checkbox" checked={form.isActive !== false} onChange={(e) => set("isActive", e.target.checked)} /> Active</label>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary">Save</button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </form>
        </AdminModal>
      </div>
    </AdminLayout>
  );
}
