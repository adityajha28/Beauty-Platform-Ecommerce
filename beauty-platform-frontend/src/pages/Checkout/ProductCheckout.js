import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import AddressPicker from "../../components/user/AddressPicker";
import CouponBox from "../../components/user/CouponBox";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { createOrder } from "../../services/orderService";
import { processPayment } from "../../services/paymentService";
import { markCouponUsed } from "../../services/couponService";
import { userStorage } from "../../utils/userStorage";
import "./checkout-shared.css";

export default function ProductCheckout() {
  const navigate = useNavigate();
  const { productItems: cartItems, productSubtotal: subtotal, clearCart } = useCart();
  const { addresses, defaultAddress, refreshOrders, userName, phone } = useUser();

  const [selectedAddr, setSelectedAddr] = useState(defaultAddress);
  const [coupon, setCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [loading, setLoading] = useState(false);

  const discount = coupon?.discountAmount || 0;
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + delivery);

  const handlePay = async () => {
    if (!selectedAddr) {
      alert("Please select a delivery address");
      return;
    }
    if (!cartItems.length) {
      navigate("/products");
      return;
    }

    setLoading(true);
    const orderId = `ord_${Date.now()}`;

    const payment = await processPayment({
      amount: total,
      method: paymentMethod,
      referenceType: "order",
      referenceId: orderId,
    });

    if (!payment.success) {
      setLoading(false);
      alert("Payment failed. Please try again.");
      return;
    }

    const order = await createOrder({
      id: orderId,
      type: "product",
      items: cartItems,
      subtotal,
      discount,
      deliveryFee: delivery,
      total,
      couponCode: coupon?.code,
      paymentMethod,
      paymentId: payment.paymentId,
      paymentStatus: payment.status,
      address: selectedAddr,
      customer: { name: userName, phone },
      status: paymentMethod === "COD" ? "pending" : "confirmed",
    });

    if (coupon?.isFirstUserOffer) markCouponUsed("product");

    clearCart("product");
    await refreshOrders();
    setLoading(false);
    navigate(`/checkout/success?type=order&id=${order.id}`, { replace: true });
  };

  if (!cartItems.length) {
    return (
      <>
        <Navbar />
        <main className="checkout-app">
          <p>Your cart is empty. <Link to="/products">Continue shopping</Link></p>
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
          <Link to="/cart" className="checkout-back">‹ Back to cart</Link>
          <h1>Product checkout</h1>
        </header>

        <div className="checkout-steps">
          <div className="checkout-step done" />
          <div className="checkout-step active" />
          <div className="checkout-step" />
        </div>

        <section className="checkout-section">
          <h2>Delivery address</h2>
          <AddressPicker
            addresses={addresses.length ? addresses : userStorage.getAddresses()}
            selectedId={selectedAddr?.id}
            onSelect={setSelectedAddr}
          />
        </section>

        <section className="checkout-section">
          <h2>Items ({cartItems.length})</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item-row">
              <span>{item.name} × {item.quantity}</span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
        </section>

        <section className="checkout-section">
          <h2>Coupon</h2>
          <CouponBox type="product" subtotal={subtotal} applied={coupon} onApply={setCoupon} />
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
                {m === "ONLINE" ? "💳 UPI / Card / Netbanking" : "💵 Cash on Delivery"}
              </button>
            ))}
          </div>
        </section>

        <section className="checkout-section">
          <div className="checkout-line"><span>Subtotal</span><span>₹{subtotal}</span></div>
          {discount > 0 && (
            <div className="checkout-line discount">
              <span>Coupon</span><span>−₹{discount}</span>
            </div>
          )}
          <div className="checkout-line">
            <span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
          </div>
          <div className="checkout-line total">
            <span>Total</span><span>₹{total}</span>
          </div>
        </section>
      </main>

      <div className="checkout-sticky-bar">
        <button type="button" onClick={handlePay} disabled={loading}>
          {loading ? "Processing…" : `Pay ₹${total}`}
        </button>
      </div>
      <BottomNav />
    </>
  );
}
