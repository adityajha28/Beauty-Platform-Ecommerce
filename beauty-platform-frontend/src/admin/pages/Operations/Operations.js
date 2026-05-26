import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  fetchOperationsStatus,
  updateOperationsStatus,
} from "../../services/adminApi";
import { DEFAULT_OPERATIONS } from "../../../services/cmsStorage";
import "../../styles/admin-pages.css";
import "./Operations.css";

const IcoCheck = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IcoPause = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

export default function AdminOperations() {
  const [status, setStatus] = useState(DEFAULT_OPERATIONS);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    (async () => {
      const current = await fetchOperationsStatus();
      setStatus(current);
    })();
  }, []);

  const set = (k, v) => setStatus((s) => ({ ...s, [k]: v }));

  const persist = async (patch = {}) => {
    setSaving(true);
    const next = await updateOperationsStatus({ ...status, ...patch });
    setStatus(next);
    setSavedAt(new Date());
    setSaving(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    persist();
  };

  const formatStamp = (d) =>
    d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <AdminLayout>
      <div className="admin-page admin-ops">
        <header className="admin-page-header">
          <div>
            <h1>Operations control</h1>
            <p>
              Pause or resume bookings and orders site-wide. Users see an
              unavailable notice and the “Book / Add to Cart” buttons stay
              disabled until you resume.
            </p>
          </div>
          {savedAt && !saving && (
            <span className="admin-badge ok ops-saved">
              Saved at {formatStamp(savedAt)}
            </span>
          )}
        </header>

        <form className="admin-card ops-card" onSubmit={handleSubmit}>
          <div className="ops-toggle-row">
            <div className="ops-toggle-info">
              <h3>
                <span className="ops-icon services">💆‍♀️</span> Service bookings
              </h3>
              <p>Controls every “Book Now” button on the site & checkout.</p>
              <span
                className={`admin-badge ${
                  status.servicesOpen ? "ok" : "off"
                }`}
              >
                {status.servicesOpen ? (
                  <>
                    <IcoCheck /> Accepting bookings
                  </>
                ) : (
                  <>
                    <IcoPause /> Paused
                  </>
                )}
              </span>
            </div>

            <label className="ops-switch">
              <input
                type="checkbox"
                checked={!!status.servicesOpen}
                onChange={(e) =>
                  persist({ servicesOpen: e.target.checked })
                }
              />
              <span />
            </label>
          </div>

          <div className="admin-field">
            <label>Message shown when services are paused</label>
            <textarea
              rows={2}
              value={status.serviceMessage || ""}
              onChange={(e) => set("serviceMessage", e.target.value)}
              placeholder={DEFAULT_OPERATIONS.serviceMessage}
            />
          </div>

          <hr className="ops-sep" />

          <div className="ops-toggle-row">
            <div className="ops-toggle-info">
              <h3>
                <span className="ops-icon products">🛍️</span> Product orders
              </h3>
              <p>Controls every “Add to Cart” / “Buy Now” on the storefront.</p>
              <span
                className={`admin-badge ${
                  status.productsOpen ? "ok" : "off"
                }`}
              >
                {status.productsOpen ? (
                  <>
                    <IcoCheck /> Accepting orders
                  </>
                ) : (
                  <>
                    <IcoPause /> Paused
                  </>
                )}
              </span>
            </div>

            <label className="ops-switch">
              <input
                type="checkbox"
                checked={!!status.productsOpen}
                onChange={(e) =>
                  persist({ productsOpen: e.target.checked })
                }
              />
              <span />
            </label>
          </div>

          <div className="admin-field">
            <label>Message shown when products are paused</label>
            <textarea
              rows={2}
              value={status.productMessage || ""}
              onChange={(e) => set("productMessage", e.target.value)}
              placeholder={DEFAULT_OPERATIONS.productMessage}
            />
          </div>

          <hr className="ops-sep" />

          <div className="admin-field">
            <label>Global announcement banner (optional)</label>
            <input
              value={status.globalBanner || ""}
              onChange={(e) => set("globalBanner", e.target.value)}
              placeholder="e.g. Diwali special — same-day appointments may be limited"
            />
          </div>

          <div className="ops-quick-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() =>
                persist({ servicesOpen: false, productsOpen: false })
              }
              disabled={saving}
            >
              Pause everything
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() =>
                persist({ servicesOpen: true, productsOpen: true })
              }
              disabled={saving}
            >
              Resume everything
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save messages"}
            </button>
          </div>
        </form>

        <div className="admin-card ops-preview">
          <h3>Live preview — what users will see</h3>
          {status.globalBanner && (
            <div className="ops-preview-banner global">
              📢 {status.globalBanner}
            </div>
          )}
          {!status.servicesOpen && (
            <div className="ops-preview-banner pause">
              <strong>Services paused:</strong>{" "}
              {status.serviceMessage || DEFAULT_OPERATIONS.serviceMessage}
            </div>
          )}
          {!status.productsOpen && (
            <div className="ops-preview-banner pause">
              <strong>Products paused:</strong>{" "}
              {status.productMessage || DEFAULT_OPERATIONS.productMessage}
            </div>
          )}
          {status.servicesOpen &&
            status.productsOpen &&
            !status.globalBanner && (
              <p className="admin-empty" style={{ padding: "1rem" }}>
                All systems go — customers see the full site.
              </p>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
