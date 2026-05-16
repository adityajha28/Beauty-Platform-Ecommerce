// src/pages/Products/Products.js
import { useEffect, useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ─── GLOBAL CONTEXT ─── */
import { useCart } from "../../context/CartContext"; 
import toast from "react-hot-toast";

/* ─── GLOBAL COMPONENTS ─── */
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import CartPanel from "../../components/Cart/CartPanel";
import FilterDrawer from "../../components/drawers/FilterDrawer";

/* ─── ICONS ─── */
const IcoSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoHeart = ({ filled }) => <svg viewBox="0 0 24 24" fill={filled ? "#16a34a" : "none"} stroke={filled ? "#16a34a" : "#c0c0c0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IcoFilter = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>;
const IcoSort = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
const IcoDown = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcoArrowRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoStar = () => <svg viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IcoClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

import "./Products.css";

const ITEMS_PER_PAGE = 12;

const CATEGORIES = [
  { name: "Top Deals", icon: "✨" },
  { name: "Skincare", icon: "🧴" },
  { name: "Haircare", icon: "💆‍♀️" },
  { name: "Cosmetics", icon: "💄" },
  { name: "Tools", icon: "✂️" },
  { name: "Fragrance", icon: "🌸" },
  { name: "Wellness", icon: "🌿" }
];

export default function Products() {
  const navigate = useNavigate();
  
  // ✅ Connected to Global Cart Context
  const { cart, addToCart } = useCart(); 
  const totalCartItems = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI & Filter State
  const [activeCategory, setActiveCategory] = useState("Top Deals");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState("all");
  const [page, setPage] = useState(1);

  // Quick View Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Premium Beauty Formula ${i + 1} - Flawless Radiance`,
        category: CATEGORIES[(i % 6) + 1].name,
        price: 899 + (i * 50),
        originalPrice: 1299 + (i * 50),
        rating: 4.0 + (i % 5) * 0.2,
        reviewCount: 168 + i * 12,
        image: `https://images.unsplash.com/photo-${1556228578 + (i % 5)}?q=80&w=400&auto=format&fit=crop`,
        tag: i % 3 === 0 ? "15 MINS" : "EXPRESS",
        discount: Math.round((1 - (899 + i * 50) / (1299 + i * 50)) * 100),
        description: "Experience ultimate luxury with this advanced formula designed to rejuvenate and enhance your natural beauty. Dermatologist tested, cruelty-free, and crafted with premium botanical extracts for visible results."
      }));

      const topDeals = data.slice(0, 10).map(p => ({ ...p, id: p.id + 100, category: "Top Deals", discount: 45, price: Math.floor(p.price * 0.7) }));
      setProducts([...topDeals, ...data]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); 
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    if(selectedProduct) setSelectedProduct(null); 
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
            {CATEGORIES.map(cat => (
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
          
          <div className="qc-sticky-header">
            <div className="qc-header-row">
              <h1 className="qc-page-title">{activeCategory}</h1>
              <span className="qc-loc">Delivering to: <strong>Nagpur, MH</strong> <IcoDown/></span>
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
                          <button className="qc-heart" onClick={(e) => { e.stopPropagation(); toast.success("Added to Wishlist"); }}><IcoHeart filled={false} /></button>
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
                            className="qc-add-btn" 
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            ADD
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

        {/* ─── FLOATING VIEW CART BUTTON (Reference Match) ─── */}
        <AnimatePresence>
          {totalCartItems > 0 && (
            <motion.div 
              className="qc-floating-cart-wrapper"
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              onClick={() => navigate("/cart")}
            >
              <div className="qc-floating-cart">
                <div className="fc-left">
                  <div className="fc-img-stack">
                    <img src={cart[0]?.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=100"} alt="Cart" />
                  </div>
                  <div className="fc-text">
                    <span className="fc-title">View cart</span>
                    <span className="fc-count">{totalCartItems} Item{totalCartItems > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="fc-arrow"><IcoArrowRight /></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <motion.button className="qv-add-btn" whileTap={{ scale: 0.95 }} onClick={(e) => handleAddToCart(e, selectedProduct)}>
                  Add to Cart — ₹{selectedProduct.price}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}