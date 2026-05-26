import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import FloatingCartFab from "../../components/FloatingCartFab/FloatingCartFab";
import CartPanel from "../../components/Cart/CartPanel";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import "./Wishlist.css";

const IcoHeart = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const IcoTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

export default function Wishlist() {
  const navigate = useNavigate();
  const { items, wishlistCount, removeFromWishlist } = useWishlist();
  const { addToCart, productCount, productItems, productSubtotal, setCartOpen, setCartType } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, "product");
    toast.success("Added to cart");
  };

  const previewImage = productItems[0]?.image;

  return (
    <div className="wl-page">
      <Navbar />

      <header className="wl-header">
        <div>
          <h1>Your Wishlist</h1>
          <p>{wishlistCount} saved item{wishlistCount !== 1 ? "s" : ""}</p>
        </div>
        <button type="button" className="wl-shop-btn" onClick={() => navigate("/products")}>
          Continue shopping
        </button>
      </header>

      <main className="wl-main">
        {wishlistCount === 0 ? (
          <div className="wl-empty">
            <div className="wl-empty-icon" aria-hidden="true"><IcoHeart filled /></div>
            <h2>Your wishlist is empty</h2>
            <p>Save products you love and shop them anytime.</p>
            <button type="button" onClick={() => navigate("/products")}>
              Explore products
            </button>
          </div>
        ) : (
          <div className="wl-grid">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className="wl-card"
                >
                  <button
                    type="button"
                    className="wl-remove"
                    onClick={() => {
                      removeFromWishlist(item.id);
                      toast.success("Removed from wishlist");
                    }}
                    aria-label={`Remove ${item.name}`}
                  >
                    <IcoTrash />
                  </button>

                  <div className="wl-card-img" onClick={() => navigate("/products")} role="presentation">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    {item.discount > 0 && (
                      <span className="wl-badge">{item.discount}% off</span>
                    )}
                  </div>

                  <div className="wl-card-body">
                    {item.category && <span className="wl-cat">{item.category}</span>}
                    <h3>{item.name}</h3>
                    <div className="wl-price-row">
                      <span className="wl-price">₹{item.price?.toLocaleString("en-IN")}</span>
                      {item.originalPrice > item.price && (
                        <span className="wl-mrp">₹{item.originalPrice?.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                    <div className="wl-actions">
                      <button type="button" className="wl-add-cart" onClick={() => handleAddToCart(item)}>
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        className="wl-buy"
                        onClick={() => {
                          handleAddToCart(item);
                          setCartOpen(true);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
        <motion.div className="wl-spacer" aria-hidden="true" />
      </main>

      <FloatingCartFab
        itemCount={productCount}
        previewImage={previewImage}
        subtotal={productSubtotal}
        onClick={() => {
          setCartType("product");
          setCartOpen(true);
        }}
        label="View cart"
      />

      <CartPanel />
      <BottomNav />
    </div>
  );
}
