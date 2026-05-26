import API from "../../services/api";
import cmsStorage, {
  upsertItem,
  removeItem,
  uid,
  pushAdminNotification,
  getOperationsStatus,
  setOperationsStatus,
  getBookingSlots,
  setBookingSlots,
  KEYS,
} from "../../services/cmsStorage";
import { userStorage } from "../../utils/userStorage";

const localOnly = { skipAuthRedirect: true };

async function adminFetch(method, url, body, storageKey) {
  try {
    const res =
      method === "get"
        ? await API.get(url, localOnly)
        : method === "post"
        ? await API.post(url, body, localOnly)
        : method === "put"
        ? await API.put(url, body, localOnly)
        : await API.delete(url, localOnly);
    const list = res.data?.items ?? res.data ?? [];
    if (Array.isArray(list)) {
      cmsStorage.set(storageKey, list);
      return list;
    }
    if (res.data?.item) {
      upsertItem(storageKey, res.data.item);
      return res.data.item;
    }
    return res.data;
  } catch {
    if (method === "get") return cmsStorage.get(storageKey);
    if (method === "delete") {
      removeItem(storageKey, body.id);
      return true;
    }
    return upsertItem(storageKey, { ...body, id: body.id || uid(storageKey.slice(0, 3)) });
  }
}

/* ── Service categories ── */
export const listServiceCategories = () => adminFetch("get", "/admin/service-categories", null, KEYS.serviceCategories);
export const saveServiceCategory = (item) => adminFetch("post", "/admin/service-categories", item, KEYS.serviceCategories);
export const deleteServiceCategory = (id) => adminFetch("delete", `/admin/service-categories/${id}`, { id }, KEYS.serviceCategories);

/* ── Services ── */
export const listServices = () => adminFetch("get", "/admin/services", null, KEYS.services);
export const saveService = (item) => adminFetch("post", "/admin/services", item, KEYS.services);
export const deleteService = (id) => adminFetch("delete", `/admin/services/${id}`, { id }, KEYS.services);

/* ── Product categories ── */
export const listProductCategories = () => adminFetch("get", "/admin/product-categories", null, KEYS.productCategories);
export const saveProductCategory = (item) => adminFetch("post", "/admin/product-categories", item, KEYS.productCategories);
export const deleteProductCategory = (id) => adminFetch("delete", `/admin/product-categories/${id}`, { id }, KEYS.productCategories);

/* ── Products ── */
export const listProducts = () => adminFetch("get", "/admin/products", null, KEYS.products);
export const saveProduct = (item) => adminFetch("post", "/admin/products", item, KEYS.products);
export const deleteProduct = (id) => adminFetch("delete", `/admin/products/${id}`, { id }, KEYS.products);

/* ── Offers ── */
export const listOffers = () => adminFetch("get", "/admin/offers", null, KEYS.offers);
export const saveOffer = (item) => adminFetch("post", "/admin/offers", item, KEYS.offers);
export const deleteOffer = (id) => adminFetch("delete", `/admin/offers/${id}`, { id }, KEYS.offers);

/* ── Hero & makeup ── */
export const listHeroSlides = () => adminFetch("get", "/admin/hero-slides", null, KEYS.heroSlides);
export const saveHeroSlide = (item) => adminFetch("post", "/admin/hero-slides", item, KEYS.heroSlides);
export const deleteHeroSlide = (id) => adminFetch("delete", `/admin/hero-slides/${id}`, { id }, KEYS.heroSlides);

export const listMakeupBanners = () => adminFetch("get", "/admin/makeup-banners", null, KEYS.makeupBanners);
export const saveMakeupBanner = (item) => adminFetch("post", "/admin/makeup-banners", item, KEYS.makeupBanners);
export const deleteMakeupBanner = (id) => adminFetch("delete", `/admin/makeup-banners/${id}`, { id }, KEYS.makeupBanners);

/* ── Reviews ── */
export const listReviews = () => adminFetch("get", "/admin/reviews", null, KEYS.reviews);
export const updateReview = (item) => adminFetch("put", `/admin/reviews/${item.id}`, item, KEYS.reviews);
export const deleteReview = (id) => adminFetch("delete", `/admin/reviews/${id}`, { id }, KEYS.reviews);

/* ── Notifications ── */
export const listNotifications = () => {
  try {
    return API.get("/admin/notifications").then((r) => r.data?.notifications ?? cmsStorage.get(KEYS.adminNotifications));
  } catch {
    return Promise.resolve(cmsStorage.get(KEYS.adminNotifications));
  }
};

export const markNotificationRead = (id) => {
  const list = cmsStorage.get(KEYS.adminNotifications).map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  cmsStorage.set(KEYS.adminNotifications, list);
  return API.patch(`/admin/notifications/${id}/read`, null, localOnly).catch(() => {});
};

/* ── Users / orders / bookings ── */
export const listUsers = async () => {
  const { data } = await API.get("/admin/users", localOnly);
  return data?.users ?? [];
};

export const listBookings = async () => {
  try {
    const { data } = await API.get("/admin/bookings");
    return data?.bookings ?? [];
  } catch {
    return userStorage.getBookings();
  }
};

export const updateBookingStatus = (id, status) =>
  API.patch(`/admin/bookings/${id}/status`, { status });

export const getDashboardStats = async () => {
  const orders = userStorage.getOrders();
  let bookings = [];
  let users = 0;
  let revenue = 0;

  try {
    const { data } = await API.get("/admin/stats", localOnly);
    users = data?.users ?? 0;
    bookings = data?.bookings ?? 0;
    revenue = data?.revenue ?? 0;
  } catch {
    try {
      users = (await listUsers()).length;
    } catch {
      users = 0;
    }
    try {
      bookings = (await listBookings()).length;
    } catch {
      bookings = userStorage.getBookings().length;
    }
    revenue = [...orders, ...userStorage.getBookings()].reduce(
      (s, x) => s + (x.total || x.amount || 0),
      0
    );
  }

  const notifications = cmsStorage.get(KEYS.adminNotifications);
  const reviews = cmsStorage.get(KEYS.reviews).filter((r) => r.status === "pending");
  return {
    users,
    orders: orders.length,
    bookings: typeof bookings === "number" ? bookings : bookings.length,
    revenue,
    unreadNotifications: notifications.filter((n) => !n.read).length,
    pendingReviews: reviews.length,
  };
};

/* ── Operations control (booking / ordering availability) ── */
export const fetchOperationsStatus = async () => {
  try {
    const { data } = await API.get("/admin/operations", localOnly);
    const status = data?.operations ?? data;
    if (status && typeof status === "object") {
      setOperationsStatus(status);
      return getOperationsStatus();
    }
  } catch {
    /* fall through */
  }
  return getOperationsStatus();
};

/* ── Admin team ── */
export const listAdminTeam = async () => {
  const { data } = await API.get("/admin/team");
  return data?.admins ?? [];
};

export const createAdminUser = async ({ email, password, name }) => {
  const { data } = await API.post("/admin/team", { email, password, name });
  return data;
};

export const updateOperationsStatus = async (payload) => {
  try {
    const { data } = await API.put("/admin/operations", payload, localOnly);
    const status = data?.operations ?? data ?? payload;
    return setOperationsStatus(status);
  } catch {
    return setOperationsStatus(payload);
  }
};

/* ── Booking time slots ── */
export const fetchBookingSlots = async () => {
  try {
    const { data } = await API.get("/admin/booking-slots", localOnly);
    const slots = data?.slots;
    if (Array.isArray(slots) && slots.length) {
      return setBookingSlots(slots);
    }
  } catch {
    /* fall through */
  }
  return { slots: getBookingSlots(), updatedAt: null };
};

export const updateBookingSlots = async (slots) => {
  try {
    const { data } = await API.put("/admin/booking-slots", { slots }, localOnly);
    if (Array.isArray(data?.slots) && data.slots.length) {
      return setBookingSlots(data.slots);
    }
  } catch {
    /* fall through */
  }
  return setBookingSlots(slots);
};

export { pushAdminNotification };
