import API from "./api";
import cmsStorage, {
  getPublished,
  getOperationsStatus,
  setOperationsStatus,
  KEYS,
  pushAdminNotification,
} from "./cmsStorage";

async function fetchOrLocal(apiCall, storageKey, publishedOnly = true) {
  try {
    const { data } = await apiCall();
    const list = data?.items ?? data ?? [];
    if (Array.isArray(list) && list.length) {
      cmsStorage.set(storageKey, list);
      return publishedOnly ? list.filter((x) => x.isActive !== false) : list;
    }
  } catch {
    /* fallback */
  }
  return publishedOnly ? getPublished(storageKey) : cmsStorage.get(storageKey);
}

export const getServiceCategories = () =>
  fetchOrLocal(() => API.get("/cms/service-categories"), KEYS.serviceCategories);

export const getServices = () =>
  fetchOrLocal(() => API.get("/cms/services"), KEYS.services);

export const getProductCategories = () =>
  fetchOrLocal(() => API.get("/cms/product-categories"), KEYS.productCategories);

export const getProducts = () =>
  fetchOrLocal(() => API.get("/cms/products"), KEYS.products);

export const getOffers = () =>
  fetchOrLocal(() => API.get("/cms/offers"), KEYS.offers);

export const getHeroSlides = () =>
  fetchOrLocal(() => API.get("/cms/hero-slides"), KEYS.heroSlides);

export const getMakeupBanners = () =>
  fetchOrLocal(() => API.get("/cms/makeup-banners"), KEYS.makeupBanners);

export async function getOperations() {
  try {
    const { data } = await API.get("/cms/operations");
    const status = data?.operations ?? data;
    if (status && typeof status === "object") {
      setOperationsStatus(status);
    }
  } catch {
    /* fallback to local cache */
  }
  return getOperationsStatus();
}

export const getApprovedReviews = () => {
  const list = cmsStorage.get(KEYS.reviews);
  return list.filter((r) => r.status === "approved" && r.isActive !== false);
};

export async function submitReview(payload) {
  try {
    const { data } = await API.post("/reviews", payload);
    return data?.review ?? data;
  } catch (err) {
    if (err?.response?.status) throw err;
    const review = {
      id: `rev_${Date.now()}`,
      ...payload,
      status: "pending",
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    const list = cmsStorage.get(KEYS.reviews);
    cmsStorage.set(KEYS.reviews, [review, ...list]);
    pushAdminNotification({
      type: "review",
      title: "New review pending",
      message: `${payload.name} · ${payload.rating}★ · ${payload.targetName || payload.targetType}`,
      payload: review,
    });
    return review;
  }
}
