// src/pages/Services/Services.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import CartPanel from "../../components/Cart/CartPanel";
import FloatingCartFab from "../../components/FloatingCartFab/FloatingCartFab";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import OperationsNotice from "../../components/OperationsNotice/OperationsNotice";
import useOperationsStatus from "../../hooks/useOperationsStatus";
import { useCart } from "../../context/CartContext";
import * as catalogService from "../../services/servicesCatalogService";

import "./Services.css";

const IcoClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoStar = () => (
  <svg viewBox="0 0 24 24" fill="#F59E0B" stroke="none" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IcoCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoVerified = () => (
  <svg viewBox="0 0 24 24" fill="#16A34A" stroke="#fff" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
  </svg>
);
const IcoSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IcoPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);

const PKG_ID = "special-pkg";
const PACKAGES_SLUG = "special-packages";

function isPackagesCategory(cat) {
  return cat?.slug === PACKAGES_SLUG || cat?.name === "Special Packages";
}

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    serviceItems,
    addToCart,
    increaseQty,
    decreaseQty,
    serviceCount,
    serviceSubtotal,
    setCartOpen,
    setCartType,
  } = useCart();

  const cartItems = serviceItems;
  const incService = useCallback((id) => increaseQty(id, "service"), [increaseQty]);
  const decService = useCallback((id) => decreaseQty(id, "service"), [decreaseQty]);

  useEffect(() => {
    setCartType("service");
  }, [setCartType]);

  const ops = useOperationsStatus();
  const bookingsPaused = ops.servicesOpen === false;

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("Book Any 4 Services");
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [pkgServiceOptions, setPkgServiceOptions] = useState([]);
  const [selectedPkgServices, setSelectedPkgServices] = useState([]);

  const isPackages = isPackagesCategory(activeCategory);
  const maxPkg = activeTab.includes("4") ? 4 : 5;

  /* Load categories from API */
  useEffect(() => {
    (async () => {
      const cats = await catalogService.fetchCategories();
      setCategories(cats);
      const urlCat = searchParams.get("category");
      const match =
        cats.find((c) => c.name === urlCat || c.slug === urlCat) || cats[0];
      if (match) setActiveCategory(match);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync URL search param */
  useEffect(() => {
    const q = searchParams.get("search") || "";
    if (q !== searchQuery) setSearchQuery(q);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Load services: search mode vs category mode */
  useEffect(() => {
    if (!activeCategory && !searchQuery.trim()) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = searchQuery.trim();
        if (q.length >= 2) {
          const results = await catalogService.searchServices(q);
          if (!cancelled) setServices(results);
        } else if (isPackagesCategory(activeCategory)) {
          const all = await catalogService.fetchAllServices();
          if (!cancelled) {
            setServices([]);
            setPkgServiceOptions(all.map((s) => s.name).filter(Boolean));
            if (!selectedPkgServices.length && all.length) {
              setSelectedPkgServices(all.slice(0, 4).map((s) => s.name));
            }
          }
        } else if (activeCategory) {
          const list = await catalogService.fetchServicesByCategory(activeCategory.name);
          if (!cancelled) setServices(list);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, searchQuery.trim().length >= 2 ? 300 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeCategory, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);
      const next = new URLSearchParams(searchParams);
      if (value.trim()) next.set("search", value);
      else next.delete("search");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const selectCategory = useCallback(
    (cat) => {
      setActiveCategory(cat);
      handleSearchChange("");
      const next = new URLSearchParams(searchParams);
      next.set("category", cat.name);
      next.delete("search");
      setSearchParams(next, { replace: true });
    },
    [handleSearchChange, searchParams, setSearchParams]
  );

  const cartMap = useMemo(() => {
    const m = {};
    cartItems.forEach((item) => { m[item.id] = item; });
    return m;
  }, [cartItems]);

  const displayServices = services;

  const togglePkgService = (service) => {
    setSelectedPkgServices((prev) => {
      if (prev.includes(service)) return prev.filter((s) => s !== service);
      if (prev.length >= maxPkg) return prev;
      return [...prev, service];
    });
  };

  const addPackageToCart = () => {
    if (bookingsPaused) {
      toast.error(ops.serviceMessage || "Service bookings are temporarily paused.");
      return;
    }
    if (cartMap[PKG_ID]) {
      incService(PKG_ID);
    } else {
      const ok = addToCart({
        id: PKG_ID,
        name: `Custom Package (${maxPkg} services)`,
        price: 999,
        originalPrice: 1549,
        image: activeCategory?.image || pkgServiceOptions[0]?.image,
        itemType: "service",
        category: "Packages",
        selectedServices: selectedPkgServices,
        packageTab: activeTab,
        quantity: 1,
      }, "service");
      if (ok === false) return;
    }
    toast.success("Package added to cart");
  };

  const changePackageQty = (delta) => {
    if (!cartMap[PKG_ID] && delta > 0) {
      addPackageToCart();
      return;
    }
    if (delta > 0) incService(PKG_ID);
    else decService(PKG_ID);
  };

  const handleAddService = (service) => {
    if (bookingsPaused) {
      toast.error(ops.serviceMessage || "Service bookings are temporarily paused.");
      return;
    }
    const ok = addToCart({ ...service, quantity: 1 }, "service");
    if (ok !== false) toast.success("Added to cart");
  };

  const totalSaved = cartItems.reduce(
    (s, i) => s + ((i.originalPrice || i.original || 0) - i.price) * i.quantity,
    0
  );

  const previewImage = cartItems[0]?.image;

  return (
    <div className="svc-app">
      <Navbar />

      <div className="svc-shell">
        <OperationsNotice scope="services" />

        <header className="svc-top">
          <BrandLogo to="/" className="svc-brand" size="sm" />
          <div className="svc-top-meta">
            <span className="svc-top-label">Salon at home</span>
            <span className="svc-top-loc"><IcoPin /> Nagpur, MH</span>
          </div>
        </header>

        <div className="svc-search">
          <IcoSearch />
          <input
            type="search"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search services"
          />
        </div>

        {!searchQuery.trim() && (
          <div className="svc-cat-rail">
            <div className="svc-cat-track">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`svc-cat ${activeCategory?.id === cat.id ? "active" : ""}`}
                  onClick={() => selectCategory(cat)}
                >
                  <span className="svc-cat-img">
                    <img src={cat.image} alt="" loading="lazy" />
                  </span>
                  <span className="svc-cat-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="svc-main">
          {searchQuery.trim().length >= 2 ? (
            <>
              <h2 className="svc-section-title">Search results</h2>
              {loading ? (
                <div className="svc-loader"><span className="svc-spinner" /></div>
              ) : (
                <ServiceList
                  services={displayServices}
                  cartMap={cartMap}
                  bookingsPaused={bookingsPaused}
                  ops={ops}
                  onAdd={handleAddService}
                  onDecrease={decService}
                  onIncrease={incService}
                />
              )}
            </>
          ) : isPackages ? (
            <PackagesPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              maxPkg={maxPkg}
              cartMap={cartMap}
              pkgServiceOptions={pkgServiceOptions}
              selectedPkgServices={selectedPkgServices}
              togglePkgService={togglePkgService}
              changePackageQty={changePackageQty}
              addPackageToCart={addPackageToCart}
              bookingsPaused={bookingsPaused}
              ops={ops}
            />
          ) : (
            <>
              <h2 className="svc-section-title">{activeCategory?.name || "Services"}</h2>
              {loading ? (
                <div className="svc-loader"><span className="svc-spinner" /></div>
              ) : (
                <ServiceList
                  services={displayServices}
                  cartMap={cartMap}
                  bookingsPaused={bookingsPaused}
                  ops={ops}
                  onAdd={handleAddService}
                  onDecrease={decService}
                  onIncrease={incService}
                />
              )}
            </>
          )}
          <div className="svc-bottom-space" aria-hidden="true" />
        </main>
      </div>

      <AnimatePresence>
        {serviceCount > 0 && totalSaved > 0 && (
          <motion.div
            className="svc-saved-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            You save ₹{totalSaved} on this order
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingCartFab
        className="floating-cart-fab--services"
        itemCount={serviceCount}
        previewImage={previewImage}
        subtotal={serviceSubtotal}
        onClick={() => {
          setCartType("service");
          setCartOpen(true);
        }}
        label="View cart"
      />

      <CartPanel />
      <BottomNav />
    </div>
  );
}

function ServiceList({ services, cartMap, bookingsPaused, ops, onAdd, onDecrease, onIncrease }) {
  return (
    <div className="svc-list">
      <AnimatePresence>
        {services.map((svc, i) => (
          <motion.article
            key={svc.id}
            className="svc-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="svc-card-info">
              <h3>{svc.name}</h3>
              <div className="svc-card-meta">
                <span><IcoStar /> {svc.rating} ({svc.reviews})</span>
                <span><IcoClock /> {svc.duration}</span>
              </div>
              <div className="svc-price-line">
                <span className="svc-price">₹{svc.price}</span>
                {svc.originalPrice && <span className="svc-mrp">₹{svc.originalPrice}</span>}
              </div>
              <p>{svc.description}</p>
            </div>
            <div className="svc-card-side">
              <div className="svc-card-thumb">
                <img src={svc.image} alt={svc.name} loading="lazy" />
              </div>
              {!cartMap[svc.id] ? (
                <button
                  type="button"
                  className={`svc-add${bookingsPaused ? " disabled" : ""}`}
                  onClick={() => onAdd(svc)}
                  disabled={bookingsPaused}
                >
                  {bookingsPaused ? "—" : "ADD"}
                </button>
              ) : (
                <div className="svc-qty">
                  <button type="button" onClick={() => onDecrease(svc.id)}>−</button>
                  <span>{cartMap[svc.id].quantity}</span>
                  <button type="button" onClick={() => onIncrease(svc.id)}>+</button>
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
      {!services.length && (
        <p className="svc-empty">No services found. Try another category or search term.</p>
      )}
    </div>
  );
}

function PackagesPanel({
  activeTab,
  setActiveTab,
  maxPkg,
  cartMap,
  pkgServiceOptions,
  selectedPkgServices,
  togglePkgService,
  changePackageQty,
  addPackageToCart,
  bookingsPaused,
  ops,
}) {
  return (
    <div className="svc-packages">
      <div className="svc-tabs">
        {["Book Any 4 Services", "Book Any 5 Services (Premium)"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`svc-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.includes("4") ? "Any 4" : "Premium 5"}
          </button>
        ))}
      </div>

      <h2 className="svc-section-title">Build your package</h2>

      <div className="svc-pkg-card">
        <div className="svc-pkg-head">
          <div>
            <h3>Choose any {maxPkg} services</h3>
            <span className="svc-meta"><IcoClock /> ~120 mins</span>
          </div>
          <div className="svc-qty">
            <button type="button" onClick={() => changePackageQty(-1)}>−</button>
            <span>{cartMap[PKG_ID]?.quantity || 0}</span>
            <button type="button" onClick={() => changePackageQty(1)}>+</button>
          </div>
        </div>

        <div className="svc-price-line">
          <span className="svc-price">₹999</span>
          <span className="svc-mrp">₹1549</span>
          <span className="svc-off"><IcoVerified /> 35% OFF</span>
        </div>

        <div className="svc-checklist">
          {pkgServiceOptions.map((name) => {
            const checked = selectedPkgServices.includes(name);
            return (
              <label key={name} className="svc-check">
                <span className={`svc-check-box ${checked ? "on" : ""}`}>
                  {checked && <IcoCheck />}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePkgService(name)}
                  hidden
                />
                <span>{name}</span>
              </label>
            );
          })}
          {!pkgServiceOptions.length && (
            <p className="svc-empty">Add services in Admin to build packages.</p>
          )}
        </div>

        {!cartMap[PKG_ID] && (
          <button
            type="button"
            className={`svc-cta${bookingsPaused ? " disabled" : ""}`}
            onClick={addPackageToCart}
            disabled={bookingsPaused}
          >
            {bookingsPaused ? "Bookings paused" : "Add package to cart"}
          </button>
        )}
      </div>
    </div>
  );
}

