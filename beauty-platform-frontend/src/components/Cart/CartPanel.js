import { Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPanel.css";

function CartPanel() {
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    subtotal,
  } = useCart();

  return (
    <Offcanvas
      show={cartOpen}
      onHide={() => setCartOpen(false)}
      placement="end"
      className="cart-offcanvas"
    >
      <Offcanvas.Header closeButton className="cart-panel-header">
        <Offcanvas.Title className="cart-panel-title">Your Cart</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="cart-panel-body">
        {!cartItems.length ? (
          <div className="cart-empty-state">
            <h4>Your cart is empty</h4>
            <p>Add products to see them here.</p>
          </div>
        ) : (
          <div className="cart-item-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-thumb">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-info">
                  <h5>{item.name}</h5>
                  <p>₹{item.price}</p>

                  <div className="cart-qty-control">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                </div>

                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </Offcanvas.Body>

      <div className="cart-panel-footer">
        <div className="cart-total-row">
          <span>Total</span>
          <strong>₹{subtotal}</strong>
        </div>

        <div className="cart-footer-actions">
          <Link to="/cart" className="btn cart-outline-btn" onClick={() => setCartOpen(false)}>
            View Cart
          </Link>

          <Link
            to="/checkout"
            className="btn cart-primary-btn"
            onClick={() => setCartOpen(false)}
          >
            Checkout
          </Link>
        </div>
      </div>
    </Offcanvas>
  );
}

export default CartPanel;