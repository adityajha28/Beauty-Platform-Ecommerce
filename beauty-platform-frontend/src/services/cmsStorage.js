/**
 * Local CMS store — used when admin API is unavailable.
 * Public site reads published content via cmsService.js
 */

import { DEFAULT_BOOKING_SLOTS, normalizeSlotLabel, sortSlotLabels } from "../constants/bookingSlots";

const KEYS = {
  serviceCategories: "oraya_cms_service_categories",
  services: "oraya_cms_services",
  productCategories: "oraya_cms_product_categories",
  products: "oraya_cms_products",
  offers: "oraya_cms_offers",
  heroSlides: "oraya_cms_hero_slides",
  makeupBanners: "oraya_cms_makeup_banners",
  reviews: "oraya_cms_reviews",
  adminNotifications: "oraya_admin_notifications",
  adminUsers: "oraya_admin_users_mirror",
  operations: "oraya_cms_operations",
  bookingSlots: "oraya_cms_booking_slots",
  seeded: "oraya_cms_seeded",
};

export const DEFAULT_OPERATIONS = {
  servicesOpen: true,
  productsOpen: true,
  serviceMessage: "Service bookings are temporarily paused. Please check back soon.",
  productMessage: "Product orders are temporarily paused. Please check back soon.",
  globalBanner: "",
  updatedAt: null,
};

export function getOperationsStatus() {
  const raw = localStorage.getItem(KEYS.operations);
  if (!raw) return { ...DEFAULT_OPERATIONS };
  try {
    return { ...DEFAULT_OPERATIONS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_OPERATIONS };
  }
}

export function getBookingSlots() {
  const raw = localStorage.getItem(KEYS.bookingSlots);
  if (!raw) return [...DEFAULT_BOOKING_SLOTS];
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed?.slots) ? parsed.slots : parsed;
    if (!Array.isArray(list) || !list.length) return [...DEFAULT_BOOKING_SLOTS];
    const cleaned = list.map(normalizeSlotLabel).filter(Boolean);
    return cleaned.length ? sortSlotLabels(cleaned) : [...DEFAULT_BOOKING_SLOTS];
  } catch {
    return [...DEFAULT_BOOKING_SLOTS];
  }
}

export function setBookingSlots(slots) {
  const cleaned = sortSlotLabels(
    [...new Set(slots.map(normalizeSlotLabel).filter(Boolean))]
  );
  const payload = {
    slots: cleaned.length ? cleaned : [...DEFAULT_BOOKING_SLOTS],
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEYS.bookingSlots, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent("oraya:booking-slots", { detail: payload }));
  return payload;
}

export function setOperationsStatus(next) {
  const merged = {
    ...getOperationsStatus(),
    ...next,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEYS.operations, JSON.stringify(merged));
  /* Notify same-tab listeners (storage event only fires cross-tab) */
  window.dispatchEvent(new CustomEvent("oraya:operations", { detail: merged }));
  return merged;
}

function read(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export { KEYS };

export const cmsStorage = {
  get: read,
  set: write,
  KEYS,
};

export function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function upsertItem(key, item) {
  const list = read(key);
  const idx = list.findIndex((x) => x.id === item.id);
  const next = { ...item, updatedAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = { ...list[idx], ...next };
  else list.unshift({ ...next, createdAt: next.createdAt || new Date().toISOString() });
  write(key, list);
  return next;
}

export function removeItem(key, id) {
  const list = read(key).filter((x) => x.id !== id);
  write(key, list);
}

export function getPublished(key) {
  return read(key).filter((x) => x.isActive !== false && x.status !== "draft");
}

export function pushAdminNotification(notification) {
  const list = read(KEYS.adminNotifications);
  const entry = {
    id: uid("ntf"),
    read: false,
    createdAt: new Date().toISOString(),
    ...notification,
  };
  write(KEYS.adminNotifications, [entry, ...list].slice(0, 200));
  return entry;
}

function seedIfNeeded() {
  if (localStorage.getItem(KEYS.seeded)) return;

  write(KEYS.serviceCategories, [
    { id: "cat_wax", name: "Waxing", slug: "waxing", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400", sortOrder: 1, isActive: true },
    { id: "cat_facial", name: "Facial", slug: "facial", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400", sortOrder: 2, isActive: true },
    { id: "cat_makeup", name: "Makeup", slug: "makeup", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400", sortOrder: 3, isActive: true },
  ]);

  write(KEYS.services, [
    { id: "svc_1", categoryId: "cat_makeup", name: "Party Makeup", price: 2499, duration: 60, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600", description: "HD party makeup at home.", isActive: true, isPopular: true },
    { id: "svc_2", categoryId: "cat_facial", name: "24K Gold Facial", price: 1999, duration: 45, image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600", description: "Luxury gold facial treatment.", isActive: true, isPopular: true },
  ]);

  write(KEYS.productCategories, [
    { id: "pcat_skin", name: "Skincare", slug: "skincare", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400", sortOrder: 1, isActive: true },
    { id: "pcat_hair", name: "Haircare", slug: "haircare", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400", sortOrder: 2, isActive: true },
  ]);

  write(KEYS.products, [
    { id: "prd_1", categoryId: "pcat_skin", name: "Vitamin C Serum", price: 899, stock: 50, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400", description: "Brightening serum.", badge: "Bestseller", isActive: true },
  ]);

  write(KEYS.offers, [
    { id: "off_1", title: "Bridal Radiance", badge: "EXCLUSIVE", description: "20% off bridal season.", code: "BRIDE20", discountPercent: 20, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400", link: "/services", isActive: true },
  ]);

  write(KEYS.heroSlides, [
    { id: "hero_1", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600", sortOrder: 1, isActive: true },
    { id: "hero_2", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1600", sortOrder: 2, isActive: true },
    { id: "hero_3", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1600", sortOrder: 3, isActive: true },
  ]);

  write(KEYS.makeupBanners, [
    { id: "mk_1", title: "Flawless Party Makeup", subtitle: "At-home artists · Nagpur", badge: "Signature Service", description: "Book certified MUAs for parties & events.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1400", ctaLabel: "Book Makeup", link: "/services?category=Makeup", sortOrder: 1, isActive: true },
    { id: "mk_2", title: "Bridal Glow", subtitle: "Premium bridal packages", badge: "Bridal", description: "Complete bridal makeup & hair.", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1400", ctaLabel: "Explore", link: "/services", sortOrder: 2, isActive: true },
    { id: "mk_3", title: "Engagement Look", subtitle: "HD & airbrush", badge: "Trending", description: "Camera-ready makeup.", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1400", ctaLabel: "Book Now", link: "/services", sortOrder: 3, isActive: true },
  ]);

  write(KEYS.reviews, [
    { id: "rev_1", name: "Priya Sharma", rating: 5, targetType: "service", targetName: "Bridal Makeup", text: "Flawless for 12 hours!", status: "approved", isActive: true, createdAt: new Date().toISOString() },
  ]);

  localStorage.setItem(KEYS.seeded, "true");
}

seedIfNeeded();

export default cmsStorage;
