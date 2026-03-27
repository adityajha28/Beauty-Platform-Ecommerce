// src/pages/Products/Products.js
import { useEffect, useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion, AnimatePresence } from "framer-motion";

/* ─── GLOBAL COMPONENTS ─── */
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BottomNav from "../../components/BottomNav/BottomNav";
import CartPanel from "../../components/Cart/CartPanel"; // ✅ IMPORTED CART PANEL

/* ─── PAGE COMPONENTS ─── */
import ProductCard from "../../components/cards/ProductCard";
import SkeletonCard from "../../components/loaders/SkeletonCard";
import FilterDrawer from "../../components/drawers/FilterDrawer";

import "./Products.css";

/* ─── ICONS ─── */
const IcoSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoFilter = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>;

const ITEMS_PER_PAGE = 12;
const CATEGORIES = ["All", "Skincare", "Haircare", "Cosmetics", "Tools", "Wellness"];

// Curated high-end beauty image IDs from Unsplash
const IMG_IDS = [
  "1620916566398-39f1143ab7be", "1556228578-0d85b1a4d571", "1596462502278-27bf85033e5a",
  "1608248543803-ba4f8c70ae0b", "1571781926291-c477ebfd024b", "1616683693504-3ea7e9ad6fec",
  "1522337660859-02fbefca4702", "1512496015851-a1c8bfa34628", "1580870059868-b7b51b327bbf"
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState("all");
  
  // UI States
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // MOCK DATA: Simulating a backend response with curated images
      const data = Array.from({ length: 48 }, (_, i) => ({
        id: i + 1,
        name: `Luxury Beauty Essential ${i + 1}`,
        category: CATEGORIES[(i % 5) + 1],
        price: [499, 899, 1299, 1999][i % 4],
        originalPrice: i % 3 === 0 ? [799, 1299, 1899, 2499][i % 4] : null,
        rating: 4.0 + (i % 5) * 0.2,
        reviewCount: 24 + i * 3,
        image: `https://images.unsplash.com/photo-${IMG_IDS[i % IMG_IDS.length]}?q=80&w=400&auto=format&fit=crop`,
        badge: i === 0 ? "Best Seller" : i === 3 ? "New" : null
      }));
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  // Cross-Filtering Logic
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchPrice = priceRange === "all" ? true :
                         priceRange === "0-500" ? p.price <= 500 :
                         priceRange === "500-1500" ? p.price > 500 && p.price <= 1500 : p.price > 1500;
      return matchSearch && matchCat && matchPrice;
    });

    switch (sortBy) {
      case "price-asc": return list.sort((a,b) => a.price - b.price);
      case "price-desc": return list.sort((a,b) => b.price - a.price);
      case "rating": return list.sort((a,b) => b.rating - a.rating);
      default: return list; // popular
    }
  }, [products, searchQuery, activeCategory, sortBy, priceRange]);

  const visibleProducts = useMemo(() => filteredProducts.slice(0, page * ITEMS_PER_PAGE), [filteredProducts, page]);

  // Reset pagination on filter change
  useEffect(() => { setPage(1); }, [searchQuery, activeCategory, sortBy, priceRange]);

  const activeFilterCount = (sortBy !== "popular" ? 1 : 0) + (priceRange !== "all" ? 1 : 0);

  // Animation variants for the staggered grid effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <Navbar />

      {/* Dynamic Animated Background */}
      <div className="dynamic-liquid-bg" aria-hidden="true" />

      <div className="shop-wrapper">
        
        {/* ─── STICKY APP NAV (Search + Categories) ─── */}
        <div className="shop-sticky-bar">
          <div className="shop-container">
            
            <div className="shop-search-row">
              <div className={`app-search-box ${isSearchFocused ? "focused" : ""}`}>
                <IcoSearch />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && <button className="clear-btn" onClick={() => setSearchQuery("")}>✕</button>}
              </div>

              <button className={`app-filter-btn ${activeFilterCount ? "active" : ""}`} onClick={() => setFilterOpen(true)}>
                <IcoFilter />
                {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
              </button>
            </div>

            <div className="app-cat-scroll">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`app-cat-pill ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ─── MAIN GRID ─── */}
        <main className="shop-main shop-container">
          
          <div className="shop-meta-row">
            <span className="results-count">{filteredProducts.length} premium items found</span>
          </div>

          {loading ? (
            <div className="app-grid">
              {Array(8).fill().map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <InfiniteScroll
              dataLength={visibleProducts.length}
              next={() => setPage(p => p + 1)}
              hasMore={visibleProducts.length < filteredProducts.length}
              loader={<div className="scroll-loader"><div className="spinner-ring" /></div>}
              style={{ overflow: "visible" }}
            >
              <motion.div 
                className="app-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={activeCategory + sortBy + priceRange} // Retriggers animation on filter change
              >
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants} layout>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {!visibleProducts.length && (
                <motion.div 
                  className="shop-empty"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="empty-icon">✨</div>
                  <h3>No matches found</h3>
                  <p>Try adjusting your search or clearing your filters to discover more.</p>
                  <button className="reset-btn" onClick={() => { setSearchQuery(""); setActiveCategory("All"); setPriceRange("all"); setSortBy("popular"); }}>
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </InfiniteScroll>
          )}

        </main>
      </div>

      <Footer />
      <BottomNav />
      
      {/* ✅ ADDED CART PANEL HERE */}
      <CartPanel /> 

      {/* ─── REDESIGNED FILTER DRAWER ─── */}
      <FilterDrawer 
        open={filterOpen} 
        onClose={() => setFilterOpen(false)} 
        sortBy={sortBy} setSortBy={setSortBy} 
        priceRange={priceRange} setPriceRange={setPriceRange} 
        clearFilters={() => { setSortBy("popular"); setPriceRange("all"); }}
      />
    </>
  );
}