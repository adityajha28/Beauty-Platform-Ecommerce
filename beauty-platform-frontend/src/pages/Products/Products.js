// src/pages/Products/Products.js
import { useEffect, useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion, AnimatePresence } from "framer-motion";

/* ─── GLOBAL CONTEXT ─── */
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import CartPanel from "../../components/Cart/CartPanel";
import FloatingCartFab from "../../components/FloatingCartFab/FloatingCartFab";
import FilterDrawer from "../../components/drawers/FilterDrawer";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import OperationsNotice from "../../components/OperationsNotice/OperationsNotice";
import useOperationsStatus from "../../hooks/useOperationsStatus";
import {
  fetchProductCategories,
  fetchProducts,
  searchProducts,
} from "../../services/productsCatalogService";
import "./Products.css";
/* ─── ICONS ─── */
const IcoSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoHeart = ({ filled }) => <svg viewBox="0 0 24 24" fill={filled ? "#16a34a" : "none"} stroke={filled ? "#16a34a" : "#c0c0c0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IcoFilter = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>;
const IcoSort = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
const IcoDown = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcoStar = () => <svg viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IcoClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;



const ITEMS_PER_PAGE = 12;

export default function Products() {
  
  // ✅ Connected to Global Cart Context
  const { productItems, addToCart, productCount, productSubtotal, setCartOpen, setCartType } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const ops = useOperationsStatus();
  const ordersPaused = ops.productsOpen === false;

  useEffect(() => {
    setCartType("product");
  }, [setCartType]);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI & Filter State
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState("all");
  const [page, setPage] = useState(1);

  // Quick View Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    (async () => {
      const cats = await fetchProductCategories();
      const withDeals = [{ name: "Top Deals", icon: "✨", id: "top-deals" }, ...cats.map((c) => ({
        name: c.name,
        icon: "✨",
        id: c.id,
        image: c.image,
      }))];
      setCategories(withDeals);
      if (withDeals.length) setActiveCategory(withDeals[0].name);
    })();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = searchQuery.trim();
        let list = [];
        if (q.length >= 2) {
          list = await searchProducts(q);
        } else if (activeCategory === "Top Deals") {
          const all = await fetchProducts();
          list = all.slice(0, 12).map((p) => ({
            ...p,
            originalPrice: Math.round(p.price * 1.3),
            discount: 30,
            category: "Top Deals",
          }));
        } else {
          list = await fetchProducts(activeCategory);
        }
        if (!cancelled) {
          setProducts(
            list.map((p) => ({
              ...p,
              originalPrice: p.originalPrice || Math.round(p.price * 1.25),
              rating: p.rating || 4.8,
              reviewCount: p.reviewCount || 100,
              discount: p.discount || Math.round((1 - p.price / (p.originalPrice || p.price * 1.25)) * 100),
              description: p.description || "",
            }))
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, searchQuery.trim().length >= 2 ? 300 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [activeCategory, searchQuery]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (ordersPaused) {
      toast.error(
        ops.productMessage || "Product orders are temporarily paused."
      );
      return;
    }
    const added = addToCart(product, "product");
    if (added !== false) {
      toast.success(`${product.name} added to cart!`);
      if (selectedProduct) setSelectedProduct(null);
    }
  };

  // Cross-Filtering Logic
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchCat = p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = priceRange === "all" ? true :
                         priceRange === "0-500" ? p.price <= 500 :
                         priceRange === "500-1500" ? p.price > 500 && p.price <= 1500 : p.price > 1500;
      return matchCat && matchSearch && matchPrice;
    });

    switch (sortBy) {
      case "price-asc": return list.sort((a,b) => a.price - b.price);
      case "price-desc": return list.sort((a,b) => b.price - a.price);
      case "rating": return list.sort((a,b) => b.rating - a.rating);
      default: return list; 
    }
  }, [products, activeCategory, searchQuery, sortBy, priceRange]);

  const visibleProducts = useMemo(() => filteredProducts.slice(0, page * ITEMS_PER_PAGE), [filteredProducts, page]);
  const loadMoreProducts = () => setPage(prev => prev + 1);

  // Reset pagination when filters change
  useEffect(() => { setPage(1); }, [activeCategory, searchQuery, sortBy, priceRange]);

  const activeFilterCount = (sortBy !== "popular" ? 1 : 0) + (priceRange !== "all" ? 1 : 0);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedProduct]);

  return (
    <>
      <Navbar />

      <div className="qc-layout">
        
        {/* ─── LEFT SIDEBAR (Always vertical on all devices) ─── */}
        <aside className="qc-sidebar">
          <div className="qc-sidebar-inner">
            {categories.map(cat => (
              <button
                key={cat.name}
                className={`qc-cat-btn ${activeCategory === cat.name ? "active" : ""}`}
                onClick={() => { setActiveCategory(cat.name); setSearchQuery(""); }}
              >
                <div className="cat-icon-circle">{cat.icon}</div>
                <span className="cat-name">{cat.name}</span>
                {activeCategory === cat.name && <motion.div layoutId="catIndicator" className="cat-indicator" />}
              </button>
            ))}
          </div>
        </aside>

        {/* ─── RIGHT PANE (Products & Filters) ─── */}
        <main className="qc-main" id="qc-main-scroll">
          
          <OperationsNotice scope="products" />

          <div className="qc-sticky-header">
            <div className="qc-brand-row">
              <BrandLogo to="/" size="sm" className="qc-brand" showText={false} />
              <div className="qc-header-titles">
                <h1 className="qc-page-title">{activeCategory}</h1>
                <span className="qc-loc">Delivering to: <strong>Nagpur, MH</strong> <IcoDown/></span>
              </div>
            </div>

            {/* Native Search Bar */}
            <div className="qc-search-box">
              <IcoSearch />
              <input 
                type="text" 
                placeholder={`Search in ${activeCategory}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && <button className="qc-clear-btn" onClick={() => setSearchQuery("")}><IcoClose/></button>}
            </div>
            
            {/* Filter Pills */}
            <div className="qc-pill-track">
              <button className={`qc-pill ${activeFilterCount ? "active" : ""}`} onClick={() => setFilterOpen(true)}>
                <IcoFilter /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`} <IcoDown/>
              </button>
              <button className="qc-pill" onClick={() => setFilterOpen(true)}>
                <IcoSort /> Sort <IcoDown/>
              </button>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="qc-grid-wrapper">
            {loading ? (
              <div className="qc-loader"><div className="spinner-ring"/></div>
            ) : (
              <InfiniteScroll
                dataLength={visibleProducts.length}
                next={loadMoreProducts}
                hasMore={visibleProducts.length < filteredProducts.length}
                loader={<div className="qc-loader"><div className="spinner-ring"/></div>}
                scrollableTarget="qc-main-scroll"
              >
                {/* ✅ STRICT 2-COLUMN GRID */}
                <div className="qc-grid">
                  <AnimatePresence mode="popLayout">
                    {visibleProducts.map(product => (
                      <motion.div
                        key={product.id} layout
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="qc-card"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="qc-img-wrap">
                          <img src={product.image} alt={product.name} loading="lazy" />
                          <button
                            type="button"
                            className={`qc-heart${isInWishlist(product.id) ? " active" : ""}`}
                            onClick={async (e) => {
                              e.stopPropagation();
                              const added = await toggleWishlist(product);
                              toast.success(added ? "Saved to wishlist" : "Removed from wishlist");
                            }}
                            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <IcoHeart filled={isInWishlist(product.id)} />
                          </button>
                        </div>
                        
                        <div className="qc-body">
                          <h3 className="qc-title">{product.name}</h3>
                          
                          <div className="qc-rating">
                            <div className="qc-stars"><IcoStar/><IcoStar/><IcoStar/><IcoStar/><IcoStar/></div>
                            <span>({product.reviewCount})</span>
                          </div>

                          <div className="qc-delivery-tag"><span className="qc-green-dot"/> {product.tag}</div>
                          
                          <div className="qc-price-block">
                            <div className="qc-discount-text">{product.discount}% OFF</div>
                            <div className="qc-price-row">
                              <span className="qc-price">₹{product.price}</span>
                              <span className="qc-mrp">MRP ₹{product.originalPrice}</span>
                            </div>
                          </div>
                          
                          {/* ✅ App-style ADD button */}
                          <motion.button
                            className={`qc-add-btn${ordersPaused ? " disabled" : ""}`}
                            whileTap={{ scale: ordersPaused ? 1 : 0.92 }}
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={ordersPaused}
                            aria-disabled={ordersPaused}
                            title={ordersPaused ? ops.productMessage : "Add to cart"}
                          >
                            {ordersPaused ? "UNAVAILABLE" : "ADD"}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {!visibleProducts.length && (
                  <div className="qc-empty">
                    <p>No products match your search.</p>
                    <button onClick={() => { setSearchQuery(""); setSortBy("popular"); setPriceRange("all"); }}>Clear Filters</button>
                  </div>
                )}
                
                {/* Safe space at bottom for floating cart */}
                <div style={{ height: "140px" }} />
              </InfiniteScroll>
            )}
          </div>
        </main>


      <FloatingCartFab
        className="floating-cart-fab--products"
        itemCount={productCount}
        previewImage={productItems[0]?.image}
        subtotal={productSubtotal}
        onClick={() => {
          setCartType("product");
          setCartOpen(true);
        }}
        label="View cart"
      />


      </div>

      <BottomNav />
      <CartPanel />

      <FilterDrawer 
        open={filterOpen} onClose={() => setFilterOpen(false)} 
        sortBy={sortBy} setSortBy={setSortBy} 
        priceRange={priceRange} setPriceRange={setPriceRange} 
        clearFilters={() => { setSortBy("popular"); setPriceRange("all"); }}
      />

      {/* ─── QUICK VIEW MODAL (BLURRED BACKGROUND) ─── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="qv-overlay-wrapper">
            <motion.div className="qv-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} />
            
            <motion.div className="qv-modal" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 250 }}>
              <button className="qv-close-btn" onClick={() => setSelectedProduct(null)}><IcoClose /></button>
              
              <div className="qv-img-container">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <span className="qv-badge">{selectedProduct.discount}% OFF</span>
              </div>
              
              <div className="qv-details">
                <span className="qv-category">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                <div className="qv-rating-row"><div className="qv-stars"><IcoStar/><IcoStar/><IcoStar/><IcoStar/><IcoStar/></div><span>{selectedProduct.reviewCount} Ratings</span></div>
                <div className="qv-price-row"><span className="qv-price">₹{selectedProduct.price}</span><span className="qv-mrp">MRP ₹{selectedProduct.originalPrice}</span><span className="qv-tax-note">(Inclusive of all taxes)</span></div>
                <div className="qv-divider" />
                <div className="qv-desc-section">
                  <h3>Product Details</h3>
                  <p>{selectedProduct.description}</p>
                  <ul className="qv-highlights"><li>✓ Dermatologist Tested</li><li>✓ Cruelty-Free</li><li>✓ Express {selectedProduct.tag} Delivery</li></ul>
                </div>
              </div>

              <div className="qv-footer">
                <motion.button
                  className={`qv-add-btn${ordersPaused ? " disabled" : ""}`}
                  whileTap={{ scale: ordersPaused ? 1 : 0.95 }}
                  onClick={(e) => handleAddToCart(e, selectedProduct)}
                  disabled={ordersPaused}
                >
                  {ordersPaused
                    ? "Currently unavailable"
                    : `Add to Cart — ₹${selectedProduct.price}`}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}