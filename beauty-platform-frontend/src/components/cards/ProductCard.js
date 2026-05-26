// src/components/cards/ProductCard.js
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useDispatch, useSelector } from "react-redux";
import { addWishlist, removeWishlist } from "../../store/wishlistSlice"; 
import toast from "react-hot-toast";
import ProductRating from "../ratings/ProductRating"; // Assuming this exists
import useOperationsStatus from "../../hooks/useOperationsStatus";
import "./ProductCard.css";

/* ─── ICONS ─── */
const IcoHeart = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "#C0395A" : "rgba(0,0,0,0.2)"} stroke={filled ? "#C0395A" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const IcoCartAdd = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const ops = useOperationsStatus();
  const ordersPaused = ops.productsOpen === false;

  // Backend readiness
  const wishlistItems = useSelector((state) => state.wishlist?.items) || [];
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (ordersPaused) {
      toast.error(ops.productMessage || "Product orders are temporarily paused.");
      return;
    }
    setIsAdding(true);
    await new Promise(r => setTimeout(r, 400)); // Mock API delay
    const ok = addToCart(product, "product");
    if (ok !== false) toast.success(`${product.name} added to cart!`);
    setIsAdding(false);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch(removeWishlist(product.id));
      toast("Removed from wishlist");
    } else {
      dispatch(addWishlist(product));
      toast.success("Saved to wishlist ❤️");
    }
  };

  if (!product) return null;

  return (
    <motion.div 
      className="app-prod-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="app-prod-img-box">
        <img src={product.image} alt={product.name} loading="lazy" />
        
        {product.badge && <span className="app-prod-badge">{product.badge}</span>}
        
        <motion.button 
          whileTap={{ scale: 0.8 }} 
          className="app-prod-wish-btn" 
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
        >
          <IcoHeart filled={isWishlisted} />
        </motion.button>
      </div>

      <div className="app-prod-body">
        <span className="app-prod-cat">{product.category || "Beauty"}</span>
        <h3 className="app-prod-title">{product.name}</h3>
        
        <div className="app-prod-rating">
          <ProductRating rating={product.rating || 5} />
        </div>

        <div className="app-prod-footer">
          <span className="app-prod-price">₹{product.price?.toLocaleString()}</span>
          
          <motion.button
            whileTap={{ scale: ordersPaused ? 1 : 0.9 }}
            className={`app-prod-add-btn ${isAdding ? "loading" : ""}${ordersPaused ? " disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={isAdding || ordersPaused}
            aria-label={ordersPaused ? "Unavailable" : "Add to cart"}
            title={ordersPaused ? ops.productMessage : "Add to cart"}
          >
            {isAdding ? "..." : ordersPaused ? "—" : <IcoCartAdd />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;