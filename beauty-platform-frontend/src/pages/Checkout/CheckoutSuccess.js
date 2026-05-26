import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import ReviewPrompt from "../../components/ReviewPrompt/ReviewPrompt";
import { getOrderById } from "../../services/orderService";
import { getBookingById } from "../../services/bookingService";
import "./checkout-shared.css";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const type = params.get("type") || "order";
  const id = params.get("id");

  const record = type === "booking" ? getBookingById(id) : getOrderById(id);
  const isBooking = type === "booking";
  const targetName = isBooking
    ? record?.serviceName || record?.items?.map((i) => i.name).join(", ")
    : record?.items?.map((i) => i.name).join(", ") || "your order";

  return (
    <>
      <Navbar />
      <main className="checkout-app checkout-success">
        <motion.div
          className="success-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="success-icon" aria-hidden="true">✓</span>
          <h1>{isBooking ? "Booking confirmed!" : "Order placed!"}</h1>
          <p>
            {isBooking
              ? "Your beauty professional will arrive at the scheduled time."
              : "We're preparing your order for delivery."}
          </p>
          {id && (
            <p className="success-id">
              Reference: <strong>#{id.slice(-8)}</strong>
            </p>
          )}
          {record && (
            <p className="success-amount">Amount paid: <strong>₹{record.total ?? record.amount}</strong></p>
          )}
          <p className="success-admin-note">
            Details have been sent to the admin dashboard for processing.
          </p>

          {id && (
            <ReviewPrompt
              type={isBooking ? "service" : "product"}
              targetName={targetName}
              referenceId={id}
            />
          )}

          <div className="success-actions">
            <Link to={isBooking ? "/profile?tab=bookings" : "/profile?tab=orders"} className="uc-btn-primary" style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
              View {isBooking ? "bookings" : "orders"}
            </Link>
            <Link to="/account" className="uc-btn-secondary" style={{ textAlign: "center", textDecoration: "none", display: "block", marginTop: "0.5rem" }}>
              My account
            </Link>
            <Link to={isBooking ? "/services" : "/products"} style={{ display: "block", textAlign: "center", marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--r)", fontWeight: 700 }}>
              Continue {isBooking ? "booking" : "shopping"}
            </Link>
          </div>
        </motion.div>
      </main>
      <BottomNav />
      <style>{`
        .checkout-success { display: flex; align-items: center; justify-content: center; min-height: 70dvh; }
        .success-card { background: #fff; border-radius: 20px; padding: 2rem 1.5rem; text-align: center; box-shadow: 0 12px 40px rgba(0,0,0,0.08); width: 100%; }
        .success-icon { width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #15803d; display: grid; place-items: center; font-size: 2rem; margin: 0 auto 1rem; font-weight: 800; }
        .success-card h1 { font-family: var(--serif); margin: 0 0 0.5rem; }
        .success-card p { color: var(--muted); font-size: 0.9rem; margin: 0 0 0.5rem; }
        .success-id, .success-amount { color: var(--ink) !important; }
        .success-admin-note { font-size: 0.78rem !important; padding: 0.65rem; background: var(--r-xl); border-radius: 8px; margin-top: 1rem !important; }
        .success-actions { margin-top: 1.5rem; }
      `}</style>
    </>
  );
}
