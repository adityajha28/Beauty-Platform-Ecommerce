import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, subtotal } = useCart();

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <Container fluid="lg">
          <div className="page-head-wrap">
            <h1>Your Cart</h1>
            <p>Review items before checkout.</p>
          </div>

          <Row className="g-4">
            <Col lg={8}>
              <div className="cart-page-card">
                {!cartItems.length ? (
                  <div className="cart-page-empty">
                    <h3>No items added yet</h3>
                    <p>Start shopping to fill your cart.</p>
                    <Link to="/products" className="btn cart-shop-btn">
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div className="cart-page-item" key={item.id}>
                      <img src={item.image} alt={item.name} className="cart-page-image" />

                      <div className="cart-page-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price}</p>

                        <div className="cart-page-qty">
                          <button onClick={() => decreaseQty(item.id)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => increaseQty(item.id)}>+</button>
                        </div>
                      </div>

                      <button
                        className="cart-page-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Col>

            <Col lg={4}>
              <div className="cart-summary-box">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>₹{subtotal}</strong>
                </div>
                <Link to="/checkout" className="btn cart-checkout-btn w-100">
                  Proceed to Checkout
                </Link>
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

export default Cart;