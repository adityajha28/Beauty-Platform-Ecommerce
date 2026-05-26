// src/components/Cart/CartPanel.js
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPanel.css";

const IcoClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
  </svg>
);
const IcoBag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

function CartItemRow({ item, type, index, onDecrease, onIncrease, onRemove }) {
  return (
    <div
      className="cp-item-row"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <img src={item.image} alt={item.name} className="cp-item-img" loading="lazy" />
      <div className="cp-item-info">
        <h5>{item.name}</h5>
        <p className="cp-item-price">₹{item.price?.toLocaleString()}</p>
        <div className="cp-qty-controls">
          <button type="button" onClick={() => onDecrease(item.id)} disabled={item.quantity <= 1}>
            −
          </button>
          <span>{item.quantity}</span>
          <button type="button" onClick={() => onIncrease(item.id)}>+</button>
        </div>
      </div>
      <button
        type="button"
        className="cp-remove-btn"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
      >
        <IcoTrash />
      </button>
    </div>
  );
}

export default function CartPanel() {
  const {
    cartOpen,
    setCartOpen,
    cartType,
    setCartType,
    productItems,
    serviceItems,
    productCount,
    serviceCount,
    productSubtotal,
    serviceSubtotal,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const isService = cartType === "service";
  const activeItems = isService ? serviceItems : productItems;
  const activeSubtotal = isService ? serviceSubtotal : productSubtotal;
  const activeCount = isService ? serviceCount : productCount;

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  return (
    <>
      <div
        className={`cp-backdrop ${cartOpen ? "is-visible" : ""}`}
        onClick={() => setCartOpen(false)}
        aria-hidden={!cartOpen}
      />

      <aside className={`cp-panel ${cartOpen ? "is-open" : ""}`} aria-label="Shopping cart">
        <div className="cp-header">
          <h3 className="cp-title">Your carts</h3>
          <button type="button" className="cp-close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <IcoClose />
          </button>
        </div>

        <div className="cp-tabs" role="tablist" aria-label="Cart type">
          <button
            type="button"
            role="tab"
            aria-selected={!isService}
            className={`cp-tab${!isService ? " active" : ""}`}
            onClick={() => setCartType("product")}
          >
            Products
            {productCount > 0 && <span className="cp-tab-badge">{productCount}</span>}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isService}
            className={`cp-tab${isService ? " active" : ""}`}
            onClick={() => setCartType("service")}
          >
            Services
            {serviceCount > 0 && <span className="cp-tab-badge">{serviceCount}</span>}
          </button>
        </div>

        <div className="cp-body">
          {!activeItems.length ? (
            <div className="cp-empty-state">
              <div className="cp-empty-icon">
                <IcoBag />
              </div>
              <h4>{isService ? "No services yet" : "No products yet"}</h4>
              <p>
                {isService
                  ? "Add services from the Services page — your product cart stays saved."
                  : "Add products from the shop — your service cart stays saved."}
              </p>
              <Link
                to={isService ? "/services" : "/products"}
                className="cp-continue-btn"
                onClick={() => setCartOpen(false)}
              >
                Browse {isService ? "services" : "products"}
              </Link>
            </div>
          ) : (
            <div className="cp-item-list">
              {activeItems.map((item, i) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  type={cartType}
                  index={i}
                  onDecrease={(id) => decreaseQty(id, cartType)}
                  onIncrease={(id) => increaseQty(id, cartType)}
                  onRemove={(id) => removeFromCart(id, cartType)}
                />
              ))}
            </div>
          )}

          {(productCount > 0 || serviceCount > 0) && (
            <p className="cp-other-cart-hint">
              {isService && productCount > 0 && (
                <>
                  <strong>{productCount}</strong> product{productCount !== 1 ? "s" : ""} in your other cart ·{" "}
                  <button type="button" className="cp-link-btn" onClick={() => setCartType("product")}>
                    View products
                  </button>
                </>
              )}
              {!isService && serviceCount > 0 && (
                <>
                  <strong>{serviceCount}</strong> service{serviceCount !== 1 ? "s" : ""} in your other cart ·{" "}
                  <button type="button" className="cp-link-btn" onClick={() => setCartType("service")}>
                    View services
                  </button>
                </>
              )}
            </p>
          )}
        </div>

        {activeItems.length > 0 && (
          <div className="cp-footer">
            <div className="cp-total-row">
              <span>Subtotal ({activeCount} items)</span>
              <strong>₹{activeSubtotal?.toLocaleString()}</strong>
            </div>
            <p className="cp-taxes-note">
              {isService
                ? "Taxes and booking details at checkout."
                : "Taxes and shipping calculated at checkout."}
            </p>

            <div className="cp-action-grid">
              <Link
                to={`/cart?tab=${isService ? "services" : "products"}`}
                className="cp-btn-outline"
                onClick={() => setCartOpen(false)}
              >
                View cart
              </Link>
              <Link
                to={`/checkout?type=${isService ? "service" : "product"}`}
                className="cp-btn-primary"
                onClick={() => setCartOpen(false)}
              >
                {isService ? "Book now" : "Checkout"}
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
