import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const payload = {
      customer: formData,
      items: cartItems,
      subtotal,
    };

    console.log("Place order payload:", payload);
    alert("Order placed successfully.");
    clearCart();
  };

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <Container fluid="lg">
          <div className="checkout-head">
            <h1>Checkout</h1>
            <p>Complete your purchase and delivery details.</p>
          </div>

          <Row className="g-4">
            <Col lg={7}>
              <form className="checkout-form-card" onSubmit={handlePlaceOrder}>
                <Row className="g-3">
                  <Col xs={12}>
                    <label className="checkout-label">Full Name</label>
                    <input
                      className="form-control checkout-input"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <label className="checkout-label">Phone</label>
                    <input
                      className="form-control checkout-input"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <label className="checkout-label">Email</label>
                    <input
                      className="form-control checkout-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col xs={12}>
                    <label className="checkout-label">Address</label>
                    <textarea
                      rows="4"
                      className="form-control checkout-input"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <label className="checkout-label">City</label>
                    <input
                      className="form-control checkout-input"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <label className="checkout-label">Pincode</label>
                    <input
                      className="form-control checkout-input"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col xs={12}>
                    <label className="checkout-label">Payment Method</label>
                    <select
                      className="form-select checkout-input"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                    >
                      <option value="COD">Cash on Delivery</option>
                      <option value="ONLINE">Online Payment</option>
                    </select>
                  </Col>
                </Row>

                <button type="submit" className="btn place-order-btn w-100 mt-3">
                  Place Order
                </button>
              </form>
            </Col>

            <Col lg={5}>
              <div className="checkout-summary-card">
                <h3>Order Summary</h3>

                <div className="checkout-order-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="checkout-order-item">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>

                <div className="checkout-total-row">
                  <span>Total</span>
                  <strong>₹{subtotal}</strong>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}

export default Checkout;