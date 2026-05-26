import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../layout/AdminLayout";
import AdminModal from "../../components/AdminModal";
import {
  listHeroSlides, saveHeroSlide, deleteHeroSlide,
  listMakeupBanners, saveMakeupBanner, deleteMakeupBanner,
} from "../../services/adminApi";
import { uid } from "../../../services/cmsStorage";
import "../../styles/admin-pages.css";

const emptyHero = () => ({ id: "", image: "", sortOrder: 0, isActive: true });
const emptyBanner = () => ({
  id: "", title: "", subtitle: "", badge: "", description: "", image: "",
  ctaLabel: "Book Now", link: "/services", sortOrder: 0, isActive: true,
});

export default function AdminContent() {
  const [tab, setTab] = useState("hero");
  const [heroSlides, setHeroSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = useCallback(async () => {
    const [h, b] = await Promise.all([listHeroSlides(), listMakeupBanners()]);
    setHeroSlides(h.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    setBanners(b.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      id: form.id || uid(tab === "hero" ? "hero" : "mk"),
      sortOrder: Number(form.sortOrder) || 0,
    };
    if (tab === "hero") await saveHeroSlide(payload);
    else await saveMakeupBanner(payload);
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    if (tab === "hero") await deleteHeroSlide(id);
    else await deleteMakeupBanner(id);
    load();
  };

  const activeBanners = banners.filter((b) => b.isActive !== false);

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>Homepage content</h1>
            <p>Hero background carousel and makeup section banners (min. 3 recommended)</p>
          </div>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => { setForm(tab === "hero" ? emptyHero() : emptyBanner()); setModal("edit"); }}>
            + Add {tab === "hero" ? "slide" : "banner"}
          </button>
        </header>

        {tab === "makeup" && activeBanners.length < 3 && (
          <p className="admin-badge pending" style={{ display: "block", marginBottom: "1rem", padding: "0.75rem" }}>
            Add at least 3 active makeup banners for the home carousel.
          </p>
        )}

        <div className="admin-tabs">
          <button type="button" className={`admin-tab${tab === "hero" ? " active" : ""}`} onClick={() => setTab("hero")}>Hero backgrounds</button>
          <button type="button" className={`admin-tab${tab === "makeup" ? " active" : ""}`} onClick={() => setTab("makeup")}>Makeup banners</button>
        </div>

        <div className="admin-card admin-table-wrap">
          {tab === "hero" ? (
            <table className="admin-table">
              <thead><tr><th>Preview</th><th>Sort</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {heroSlides.map((s) => (
                  <tr key={s.id}>
                    <td><img src={s.image} alt="" className="admin-thumb" style={{ width: 120, height: 56 }} /></td>
                    <td>{s.sortOrder}</td>
                    <td><span className={`admin-badge ${s.isActive ? "ok" : "off"}`}>{s.isActive ? "Active" : "Hidden"}</span></td>
                    <td>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => { setForm({ ...s }); setModal("edit"); }}>Edit</button>{" "}
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Title</th><th>Badge</th><th>CTA</th><th>Sort</th><th>Actions</th></tr></thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id}>
                    <td><img src={b.image} alt="" className="admin-thumb" /></td>
                    <td><strong>{b.title}</strong><br /><span style={{ fontSize: "0.75rem", color: "#64748b" }}>{b.subtitle}</span></td>
                    <td>{b.badge}</td>
                    <td>{b.ctaLabel}</td>
                    <td>{b.sortOrder}</td>
                    <td>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => { setForm({ ...b }); setModal("edit"); }}>Edit</button>{" "}
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <AdminModal open={modal === "edit"} title={form.id ? "Edit" : "Add"} onClose={() => setModal(null)}>
          <form className="admin-form" onSubmit={handleSave}>
            {tab === "hero" ? (
              <>
                <div className="admin-field"><label>Image URL</label><input value={form.image || ""} onChange={(e) => set("image", e.target.value)} required /></div>
                <div className="admin-field"><label>Sort order</label><input type="number" value={form.sortOrder ?? ""} onChange={(e) => set("sortOrder", e.target.value)} /></div>
              </>
            ) : (
              <>
                <div className="admin-field"><label>Title</label><input value={form.title || ""} onChange={(e) => set("title", e.target.value)} required /></div>
                <div className="admin-field"><label>Subtitle</label><input value={form.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} /></div>
                <div className="admin-field"><label>Badge</label><input value={form.badge || ""} onChange={(e) => set("badge", e.target.value)} /></div>
                <div className="admin-field"><label>Description</label><textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
                <div className="admin-field"><label>Image URL</label><input value={form.image || ""} onChange={(e) => set("image", e.target.value)} required /></div>
                <div className="admin-field"><label>CTA label</label><input value={form.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} /></div>
                <div className="admin-field"><label>Link</label><input value={form.link || ""} onChange={(e) => set("link", e.target.value)} /></div>
                <div className="admin-field"><label>Sort order</label><input type="number" value={form.sortOrder ?? ""} onChange={(e) => set("sortOrder", e.target.value)} /></div>
              </>
            )}
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
