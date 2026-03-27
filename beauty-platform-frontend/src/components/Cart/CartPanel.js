// src/components/Cart/CartPanel.js
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPanel.css";

/* ─── NATIVE SVG ICONS ─── */
const IcoClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>;
const IcoBag = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;

export default function CartPanel() {
  const {
    cartOpen, setCartOpen, cartItems,
    increaseQty, decreaseQty, removeFromCart, subtotal,
  } = useCart();

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  return (
    <>
      {/* Glass Backdrop */}
      <div 
        className={`cp-backdrop ${cartOpen ? "is-visible" : ""}`} 
        onClick={() => setCartOpen(false)} 
      />

      {/* Side Drawer Panel */}
      <aside className={`cp-panel ${cartOpen ? "is-open" : ""}`}>
        
        <div className="cp-header">
          <h3 className="cp-title">Your Cart <span>({cartItems.length})</span></h3>
          <button className="cp-close-btn" onClick={() => setCartOpen(false)}>
            <IcoClose />
          </button>
        </div>

        <div className="cp-body">
          {!cartItems?.length ? (
            <div className="cp-empty-state">
              <div className="cp-empty-icon"><IcoBag /></div>
              <h4>Your cart is empty</h4>
              <p>Discover our premium products and luxury services.</p>
              <button className="cp-continue-btn" onClick={() => setCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cp-item-list">
              {cartItems.map((item, i) => (
                <div key={item.id} className="cp-item-row" style={{ animationDelay: `${i * 0.05}s` }}>
                  <img src={item.image} alt={item.name} className="cp-item-img" loading="lazy" />
                  
                  <div className="cp-item-info">
                    <h5>{item.name}</h5>
                    <p className="cp-item-price">₹{item.price?.toLocaleString()}</p>
                    
                    <div className="cp-qty-controls">
                      <button onClick={() => decreaseQty(item.id)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                  </div>

                  <button className="cp-remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                    <IcoTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions only show if items exist */}
        {cartItems?.length > 0 && (
          <div className="cp-footer">
            <div className="cp-total-row">
              <span>Subtotal</span>
              <strong>₹{subtotal?.toLocaleString()}</strong>
            </div>
            <p className="cp-taxes-note">Taxes and shipping calculated at checkout.</p>
            
            <div className="cp-action-grid">
              <Link to="/cart" className="cp-btn-outline" onClick={() => setCartOpen(false)}>
                View Cart
              </Link>
              <Link to="/checkout" className="cp-btn-primary" onClick={() => setCartOpen(false)}>
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}