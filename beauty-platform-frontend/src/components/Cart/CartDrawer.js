// src/components/Cart/CartDrawer.js
import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import "./CartDrawer.css";

export default function CartDrawer({ open, onClose }) {
  const { cartItems, removeFromCart, subtotal } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className={`cd-backdrop ${open ? "is-visible" : ""}`} onClick={onClose} />
      
      <div className={`cd-bottom-sheet ${open ? "is-open" : ""}`}>
        <div className="cd-drag-handle" onClick={onClose}></div>
        
        <div className="cd-header">
          <h3>Your Cart</h3>
          <button className="cd-close" onClick={onClose}>✕</button>
        </div>

        <div className="cd-body">
          {!cartItems?.length ? (
            <p className="cd-empty">No items in cart.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cd-item">
                <img src={item.image} alt={item.name} />
                <div className="cd-item-meta">
                  <h4>{item.name}</h4>
                  <p>₹{item.price?.toLocaleString()}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="cd-remove">Remove</button>
              </div>
            ))
          )}
        </div>

        {cartItems?.length > 0 && (
          <div className="cd-footer">
            <div className="cd-total"><span>Total</span> <strong>₹{subtotal?.toLocaleString()}</strong></div>
            <button className="cd-checkout-btn" onClick={onClose}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}