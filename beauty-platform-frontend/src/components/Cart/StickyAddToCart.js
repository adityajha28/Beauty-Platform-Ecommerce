// src/components/Cart/StickyAddToCart.js
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./StickyAddToCart.css";

export default function StickyAddToCart({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    // Simulate backend network delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 600)); 
    addToCart(product);
    setIsAdding(false);
  };

  if (!product) return null;

  return (
    <div className="sticky-bar-wrapper">
      <div className="sticky-add-bar">
        <div className="sticky-meta">
          <span className="sticky-title">{product.name}</span>
          <span className="sticky-price">₹{product.price?.toLocaleString()}</span>
        </div>

        <button 
          className={`sticky-btn ${isAdding ? "is-loading" : ""}`}
          onClick={handleAdd}
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}