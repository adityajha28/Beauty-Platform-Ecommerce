import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../layout/AdminLayout";
import AdminModal from "../../components/AdminModal";
import {
  listServiceCategories,
  saveServiceCategory,
  deleteServiceCategory,
  listServices,
  saveService,
  deleteService,
} from "../../services/adminApi";
import { uid } from "../../../services/cmsStorage";
import "../../styles/admin-pages.css";

const emptyCat = () => ({ id: "", name: "", slug: "", image: "", description: "", sortOrder: 0, isActive: true });
const emptySvc = () => ({
  id: "", categoryId: "", name: "", price: "", duration: "", image: "", description: "",
  isActive: true, isPopular: false,
});

export default function AdminServices() {
  const [tab, setTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = useCallback(async () => {
    const [cats, svcs] = await Promise.all([listServiceCategories(), listServices()]);
    setCategories(cats);
    setServices(svcs);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setForm(tab === "categories" ? emptyCat() : emptySvc());
    setModal("edit");
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setModal("edit");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      id: form.id || uid(tab === "categories" ? "cat" : "svc"),
      sortOrder: Number(form.sortOrder) || 0,
      price: form.price !== undefined ? Number(form.price) : undefined,
      duration: form.duration !== undefined ? Number(form.duration) : undefined,
      slug: form.slug || form.name?.toLowerCase().replace(/\s+/g, "-"),
    };
    if (tab === "categories") await saveServiceCategory(payload);
    else await saveService(payload);
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    if (tab === "categories") await deleteServiceCategory(id);
    else await deleteService(id);
    load();
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Services</h1>
            <p>Manage service categories and individual services</p>
          </div>
          <button type="button" className="admin-btn admin-btn-primary" onClick={openNew}>
            + Add {tab === "categories" ? "category" : "service"}
          </button>
        </header>

        <div className="admin-tabs">
          <button type="button" className={`admin-tab${tab === "categories" ? " active" : ""}`} onClick={() => setTab("categories")}>Categories</button>
          <button type="button" className={`admin-tab${tab === "services" ? " active" : ""}`} onClick={() => setTab("services")}>Services</button>
        </div>

        <div className="admin-card admin-table-wrap">
          {tab === "categories" ? (
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Slug</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td><img src={c.image} alt="" className="admin-thumb" /></td>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.slug}</td>
                    <td><span className={`admin-badge ${c.isActive ? "ok" : "off"}`}>{c.isActive ? "Active" : "Hidden"}</span></td>
                    <td>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEdit(c)}>Edit</button>{" "}
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Duration</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td><img src={s.image} alt="" className="admin-thumb" /></td>
                    <td><strong>{s.name}</strong></td>
                    <td>{categories.find((c) => c.id === s.categoryId)?.name || "—"}</td>
                    <td>₹{s.price}</td>
                    <td>{s.duration} min</td>
                    <td>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEdit(s)}>Edit</button>{" "}
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {(tab === "categories" ? categories : services).length === 0 && (
            <p className="admin-empty">No items yet. Add your first {tab === "categories" ? "category" : "service"}.</p>
          )}
        </div>

        <AdminModal open={modal === "edit"} title={form.id ? "Edit" : "Add"} onClose={() => setModal(null)}>
          <form className="admin-form" onSubmit={handleSave}>
            {tab === "categories" ? (
              <>
                <div className="admin-field"><label>Name</label><input value={form.name || ""} onChange={(e) => set("name", e.target.value)} required /></div>
                <div className="admin-field"><label>Slug</label><input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} /></div>
                <div className="admin-field"><label>Image URL</label><input value={form.image || ""} onChange={(e) => set("image", e.target.value)} /></div>
                <div className="admin-field"><label>Description</label><textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
              </>
            ) : (
              <>
                <div className="admin-field">
                  <label>Category</label>
                  <select value={form.categoryId || ""} onChange={(e) => set("categoryId", e.target.value)} required>
                    <option value="">Select…</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="admin-field"><label>Name</label><input value={form.name || ""} onChange={(e) => set("name", e.target.value)} required /></div>
                <div className="admin-field"><label>Price (₹)</label><input type="number" value={form.price ?? ""} onChange={(e) => set("price", e.target.value)} required /></div>
                <div className="admin-field"><label>Duration (min)</label><input type="number" value={form.duration ?? ""} onChange={(e) => set("duration", e.target.value)} /></div>
                <div className="admin-field"><label>Image URL</label><input value={form.image || ""} onChange={(e) => set("image", e.target.value)} /></div>
                <div className="admin-field"><label>Description</label><textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
                <label><input type="checkbox" checked={!!form.isPopular} onChange={(e) => set("isPopular", e.target.checked)} /> Popular service</label>
              </>
            )}
            <label><input type="checkbox" checked={form.isActive !== false} onChange={(e) => set("isActive", e.target.checked)} /> Active / visible on site</label>
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
