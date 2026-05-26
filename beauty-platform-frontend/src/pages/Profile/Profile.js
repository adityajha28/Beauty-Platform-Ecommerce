import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import AddressForm from "../../components/user/AddressForm";
import RefundModal from "../../components/user/RefundModal";
import { useUser } from "../../context/UserContext";
import { userStorage } from "../../utils/userStorage";
import { requestRefund, markOrderRefundPending, markBookingRefundPending } from "../../services/refundService";
import { fetchActiveCoupons } from "../../services/couponService";
import "../../components/user/user-components.css";
import "./Profile.css";

const initials = (n = "") =>
  n.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "O";

const TABS = [
  { id: "overview", label: "Profile", short: "Profile", icon: "👤" },
  { id: "addresses", label: "Addresses", short: "Address", icon: "📍" },
  { id: "bookings", label: "Bookings", short: "Bookings", icon: "✨" },
  { id: "orders", label: "Orders", short: "Orders", icon: "📦" },
  { id: "coupons", label: "Offers", short: "Offers", icon: "🎁" },
  { id: "refunds", label: "Refunds", short: "Refunds", icon: "↩️" },
];

function OrderBookingCard({ item, type, onRefund }) {
  const status = (item.status || "confirmed").replace(/_/g, " ");
  const canRefund = !["refund_pending", "cancelled", "refunded"].includes(item.status);

  return (
    <div className="uc-order-card">
      <div className="uc-order-head">
        <span className="uc-order-id">#{item.id?.slice(-8) || "—"}</span>
        <span className={`uc-status ${item.status || "confirmed"}`}>{status}</span>
      </div>
      <p className="uc-order-items">
        {type === "booking"
          ? `${item.serviceName || item.items?.map((i) => i.name).join(", ") || "Service"} · ${item.date || ""} ${item.slot || ""}`
          : item.items?.map((i) => `${i.name}×${i.quantity}`).join(", ") || "Product order"}
      </p>
      <div className="uc-order-foot">
        <span className="uc-order-total">₹{item.total ?? item.amount ?? 0}</span>
        {canRefund && (
          <button type="button" className="uc-refund-btn" onClick={() => onRefund(item)}>
            Request refund
          </button>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "overview";
  const {
    profile,
    addresses,
    orders,
    bookings,
    refunds,
    coupons,
    saveAddress,
    updateProfile,
    refreshOrders,
    refreshBookings,
    refreshRefunds,
    userName,
    phone,
  } = useUser();

  const [name, setName] = useState(() => userStorage.getDisplayName() || userName || "");
  const [email, setEmail] = useState(() => profile?.email || userStorage.getProfile()?.email || "");
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [refundTarget, setRefundTarget] = useState(null);
  const [offerList, setOfferList] = useState(coupons);
  const [saving, setSaving] = useState(false);

  const displayName = name || userName || profile?.name || "Guest";
  const displayPhone = phone || profile?.phone || "";

  useEffect(() => {
    setName(userName || profile?.name || "");
    setEmail(profile?.email || "");
  }, [userName, profile]);

  useEffect(() => {
    fetchActiveCoupons().then(setOfferList);
  }, [coupons]);

  const setTab = (id) => setParams({ tab: id });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, email });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async ({ reason, notes }) => {
    if (!refundTarget) return;
    const isOrder = refundTarget.type === "order";
    await requestRefund({
      orderId: isOrder ? refundTarget.item.id : undefined,
      bookingId: !isOrder ? refundTarget.item.id : undefined,
      type: refundTarget.type,
      reason,
      notes,
      amount: refundTarget.item.total ?? refundTarget.item.amount,
    });
    if (isOrder) markOrderRefundPending(refundTarget.item.id);
    else markBookingRefundPending(refundTarget.item.id);
    await refreshOrders();
    await refreshBookings();
    await refreshRefunds();
  };

  return (
    <>
      <Navbar />
      <main className={`profile-app${tab === "overview" ? " profile-app--overview" : ""}`}>
        <header className="profile-app-head">
          <div className="profile-head-row">
            <Link to="/account" className="profile-back" aria-label="Back to account">
              <span className="profile-back-ico" aria-hidden="true">‹</span>
              <span>Account</span>
            </Link>
          </div>
          <h1>{TABS.find((t) => t.id === tab)?.label || "Profile"}</h1>
        </header>

        <div className="profile-tabs-wrap">
          <nav className="profile-tabs-nav" role="tablist" aria-label="Profile sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                aria-current={tab === t.id ? "page" : undefined}
                className={`profile-tab${tab === t.id ? " active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                <span className="profile-tab-ico" aria-hidden="true">{t.icon}</span>
                <span className="profile-tab-label">{t.short}</span>
              </button>
            ))}
          </nav>
        </div>

        <motion.div
          key={tab}
          className="profile-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {tab === "overview" && (
            <div className="profile-overview">
              <div className="profile-overview-hero">
                <div className="profile-overview-av">{initials(displayName)}</div>
                <div className="profile-overview-meta">
                  <p className="profile-overview-greet">Your profile</p>
                  <h2 className="profile-overview-name">{displayName}</h2>
                  <p className="profile-overview-phone">{displayPhone || "Phone not set"}</p>
                </div>
              </div>

              <div className="profile-card profile-card--form">
                <h3 className="profile-card-title">Edit details</h3>
                <p className="profile-card-hint">Phone is linked to your login and cannot be changed here.</p>

                <div className="profile-form">
                  <label className="uc-field profile-field">
                    <span>Full name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </label>
                  <label className="uc-field profile-field">
                    <span>Phone</span>
                    <input value={displayPhone} readOnly className="uc-readonly" aria-readonly="true" />
                  </label>
                  <label className="uc-field profile-field">
                    <span>Email</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="uc-btn-primary profile-save-inline"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>

              <div className="profile-save-dock">
                <button
                  type="button"
                  className="profile-save-dock-btn"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          )}

          {tab === "addresses" && (
            <>
              {addresses.map((a) => (
                <motion.div key={a.id} className="profile-addr-card">
                  <strong>{a.label} · {a.isDefault ? "Default" : ""}</strong>
                  <p>{a.line1}, {a.line2} {a.landmark && `· ${a.landmark}`}<br />{a.city}, {a.state} — {a.pincode}</p>
                </motion.div>
              ))}
              {!showAddrForm ? (
                <button type="button" className="uc-btn-secondary w-100" onClick={() => setShowAddrForm(true)}>
                  + Add new address
                </button>
              ) : (
                <div className="profile-card">
                  <AddressForm
                    onSubmit={async (f) => {
                      await saveAddress(f);
                      setShowAddrForm(false);
                    }}
                    submitLabel="Save address"
                  />
                </div>
              )}
            </>
          )}

          {tab === "bookings" && (
            <div className="profile-list">
              {bookings.length === 0 ? (
                <p className="profile-empty">No bookings yet. <Link to="/services">Book a service</Link></p>
              ) : (
                bookings.map((b) => (
                  <OrderBookingCard
                    key={b.id}
                    item={b}
                    type="booking"
                    onRefund={(item) => setRefundTarget({ type: "booking", item })}
                  />
                ))
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="profile-list">
              {orders.length === 0 ? (
                <p className="profile-empty">No orders yet. <Link to="/products">Shop now</Link></p>
              ) : (
                orders.map((o) => (
                  <OrderBookingCard
                    key={o.id}
                    item={o}
                    type="order"
                    onRefund={(item) => setRefundTarget({ type: "order", item })}
                  />
                ))
              )}
            </div>
          )}

          {tab === "coupons" && (
            <div className="profile-list">
              {offerList.map((o) => (
                <div key={o.type} className="profile-offer-card">
                  <strong>{o.label}</strong>
                  <p>{o.discountPercent}% off · Used {o.used}/{o.maxUses}</p>
                  {o.nextCode ? (
                    <code className="profile-code">{o.nextCode}</code>
                  ) : (
                    <span className="profile-used-up">All offers used</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "refunds" && (
            <div className="profile-list">
              {refunds.length === 0 ? (
                <p className="profile-empty">No refund requests yet.</p>
              ) : (
                refunds.map((r) => (
                  <div key={r.id} className="uc-order-card">
                    <div className="uc-order-head">
                      <span className="uc-order-id">#{r.id?.slice(-8)}</span>
                      <span className={`uc-status ${r.status}`}>{r.status}</span>
                    </div>
                    <p className="uc-order-items">{r.reason}</p>
                    <p className="uc-order-total">₹{r.amount}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </main>

      <RefundModal
        open={!!refundTarget}
        onClose={() => setRefundTarget(null)}
        onSubmit={handleRefund}
        title={refundTarget?.type === "order" ? "Product order" : "Service booking"}
        amount={refundTarget?.item?.total ?? refundTarget?.item?.amount ?? 0}
      />

      <BottomNav />
    </>
  );
}
