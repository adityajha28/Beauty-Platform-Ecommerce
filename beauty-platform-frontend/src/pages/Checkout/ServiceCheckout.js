import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import AddressPicker from "../../components/user/AddressPicker";
import CouponBox from "../../components/user/CouponBox";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { createServiceBooking, getAvailableSlots } from "../../services/bookingService";
import { processPayment } from "../../services/paymentService";
import { markCouponUsed } from "../../services/couponService";
import { userStorage } from "../../utils/userStorage";
import "./checkout-shared.css";

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function ServiceCheckout() {
  const navigate = useNavigate();
  const { serviceItems: cartItems, serviceSubtotal: subtotal, clearCart } = useCart();
  const { addresses, defaultAddress, refreshBookings, userName, phone } = useUser();

  const [selectedAddr, setSelectedAddr] = useState(defaultAddress);
  const [coupon, setCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [date, setDate] = useState(tomorrowISO());
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const discount = coupon?.discountAmount || 0;
  const visitFee = 0;
  const total = Math.max(0, subtotal - discount + visitFee);

  useEffect(() => {
    getAvailableSlots(date).then(setSlots);
    setSlot("");
  }, [date]);

  const handlePay = async () => {
    if (!selectedAddr) {
      alert("Please select your service address in Nagpur");
      return;
    }
    if (!slot) {
      alert("Please select a time slot");
      return;
    }
    if (!cartItems.length) {
      navigate("/services");
      return;
    }

    setLoading(true);
    const bookingId = `bkg_${Date.now()}`;

    const payment = await processPayment({
      amount: total,
      method: paymentMethod,
      referenceType: "booking",
      referenceId: bookingId,
    });

    if (!payment.success) {
      setLoading(false);
      alert("Payment failed. Please try again.");
      return;
    }

    const serviceName = cartItems.map((i) => i.name).join(", ");
    const booking = await createServiceBooking({
      id: bookingId,
      type: "service",
      items: cartItems,
      serviceName,
      subtotal,
      discount,
      total,
      amount: total,
      couponCode: coupon?.code,
      paymentMethod,
      paymentId: payment.paymentId,
      paymentStatus: payment.status,
      date,
      slot,
      address: selectedAddr,
      customer: { name: userName, phone },
      status: paymentMethod === "COD" ? "pending" : "confirmed",
    });

    if (coupon?.isFirstUserOffer) markCouponUsed("service");

    clearCart("service");
    await refreshBookings();
    setLoading(false);
    navigate(`/checkout/success?type=booking&id=${booking.id}`, { replace: true });
  };

  if (!cartItems.length) {
    return (
      <>
        <Navbar />
        <main className="checkout-app">
          <p>No services selected. <Link to="/services">Browse services</Link></p>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="checkout-app">
        <header className="checkout-app-head">
          <Link to="/services" className="checkout-back">‹ Back to services</Link>
          <h1>Book services</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "0.25rem 0 0" }}>
            Yes Madam–style at-home booking in Nagpur
          </p>
        </header>

        <div className="checkout-steps">
          <div className="checkout-step done" />
          <div className="checkout-step done" />
          <div className="checkout-step active" />
        </div>

        <section className="checkout-section">
          <h2>Services</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item-row">
              <span>{item.name} × {item.quantity}</span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
        </section>

        <section className="checkout-section">
          <h2>Date & time</h2>
          <label className="uc-field">
            <span>Preferred date</span>
            <input type="date" value={date} min={tomorrowISO()} onChange={(e) => setDate(e.target.value)} />
          </label>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, margin: "0.75rem 0 0.5rem", color: "var(--muted)" }}>Time slot</p>
          <div className="slot-grid">
            {slots.length === 0 ? (
              <p className="slot-empty-msg">
                No slots available for this date. Try another date or contact us on WhatsApp.
              </p>
            ) : (
              slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`slot-chip${slot === s ? " selected" : ""}`}
                  onClick={() => setSlot(s)}
                >
                  {s}
                </button>
              ))
            )}
          </div>
        </section>

        <section className="checkout-section">
          <h2>Service address</h2>
          <AddressPicker
            addresses={addresses.length ? addresses : userStorage.getAddresses()}
            selectedId={selectedAddr?.id}
            onSelect={setSelectedAddr}
          />
        </section>

        <section className="checkout-section">
          <h2>Coupon</h2>
          <CouponBox type="service" subtotal={subtotal} applied={coupon} onApply={setCoupon} />
        </section>

        <section className="checkout-section">
          <h2>Payment</h2>
          <div className="checkout-pay-options">
            {["ONLINE", "COD"].map((m) => (
              <button
                key={m}
                type="button"
                className={`checkout-pay-opt${paymentMethod === m ? " selected" : ""}`}
                onClick={() => setPaymentMethod(m)}
              >
                {m === "ONLINE" ? "💳 Pay now (UPI / Card)" : "💵 Pay after service (COD)"}
              </button>
            ))}
          </div>
        </section>

        <section className="checkout-section">
          <div className="checkout-line"><span>Subtotal</span><span>₹{subtotal}</span></div>
          {discount > 0 && (
            <div className="checkout-line discount"><span>Coupon</span><span>−₹{discount}</span></div>
          )}
          <div className="checkout-line total"><span>Total</span><span>₹{total}</span></div>
        </section>
      </main>

      <div className="checkout-sticky-bar">
        <button type="button" onClick={handlePay} disabled={loading}>
          {loading ? "Confirming…" : `Confirm booking · ₹${total}`}
        </button>
      </div>
      <BottomNav />
    </>
  );
}
