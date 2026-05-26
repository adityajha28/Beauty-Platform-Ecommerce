import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../layout/AdminLayout";
import AdminModal from "../../components/AdminModal";
import {
  listProductCategories,
  saveProductCategory,
  deleteProductCategory,
  listProducts,
  saveProduct,
  deleteProduct,
} from "../../services/adminApi";
import { uid } from "../../../services/cmsStorage";
import "../../styles/admin-pages.css";

const emptyCat = () => ({ id: "", name: "", slug: "", image: "", description: "", sortOrder: 0, isActive: true });
const emptyPrd = () => ({
  id: "", categoryId: "", name: "", price: "", stock: "", image: "", description: "", badge: "", isActive: true,
});

export default function AdminProducts() {
  const [tab, setTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = useCallback(async () => {
    const [cats, prds] = await Promise.all([listProductCategories(), listProducts()]);
    setCategories(cats);
    setProducts(prds);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setForm(tab === "categories" ? emptyCat() : emptyPrd());
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
      id: form.id || uid(tab === "categories" ? "pcat" : "prd"),
      sortOrder: Number(form.sortOrder) || 0,
      price: form.price !== undefined ? Number(form.price) : undefined,
      stock: form.stock !== undefined ? Number(form.stock) : undefined,
      slug: form.slug || form.name?.toLowerCase().replace(/\s+/g, "-"),
    };
    if (tab === "categories") await saveProductCategory(payload);
    else await saveProduct(payload);
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    if (tab === "categories") await deleteProductCategory(id);
    else await deleteProduct(id);
    load();
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Products</h1>
            <p>Manage product categories and catalog items</p>
          </div>
          <button type="button" className="admin-btn admin-btn-primary" onClick={openNew}>
            + Add {tab === "categories" ? "category" : "product"}
          </button>
        </header>

        <div className="admin-tabs">
          <button type="button" className={`admin-tab${tab === "categories" ? " active" : ""}`} onClick={() => setTab("categories")}>Categories</button>
          <button type="button" className={`admin-tab${tab === "products" ? " active" : ""}`} onClick={() => setTab("products")}>Products</button>
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
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td><img src={p.image} alt="" className="admin-thumb" /></td>
                    <td><strong>{p.name}</strong>{p.badge && <span className="admin-badge pending" style={{ marginLeft: 6 }}>{p.badge}</span>}</td>
                    <td>{categories.find((c) => c.id === p.categoryId)?.name || "—"}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock ?? "—"}</td>
                    <td>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEdit(p)}>Edit</button>{" "}
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {(tab === "categories" ? categories : products).length === 0 && (
            <p className="admin-empty">No items yet. Add your first {tab === "categories" ? "category" : "product"}.</p>
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
                <div className="admin-field"><label>Stock</label><input type="number" value={form.stock ?? ""} onChange={(e) => set("stock", e.target.value)} /></div>
                <div className="admin-field"><label>Badge</label><input value={form.badge || ""} onChange={(e) => set("badge", e.target.value)} placeholder="Bestseller, New…" /></div>
                <div className="admin-field"><label>Image URL</label><input value={form.image || ""} onChange={(e) => set("image", e.target.value)} /></div>
                <div className="admin-field"><label>Description</label><textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
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
