import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as wishlistService from "../services/wishlistService";

const STORAGE_KEY = "oraya_wishlist_v1";

const WishlistContext = createContext(null);

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStored(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadStored);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    saveStored(items);
  }, [items]);

  /** Call after login when backend is wired */
  const hydrateFromApi = useCallback(async () => {
    setSyncing(true);
    try {
      const remote = await wishlistService.fetchWishlist();
      if (Array.isArray(remote)) setItems(remote);
    } finally {
      setSyncing(false);
    }
  }, []);

  const isInWishlist = useCallback(
    (id) => items.some((item) => String(item.id) === String(id)),
    [items]
  );

  const addToWishlist = useCallback(async (product) => {
    if (!product?.id) return false;
    setItems((prev) => {
      if (prev.some((p) => String(p.id) === String(product.id))) return prev;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice ?? product.mrp,
          image: product.image,
          category: product.category,
          rating: product.rating,
          reviewCount: product.reviewCount,
          discount: product.discount,
          addedAt: Date.now(),
        },
      ];
    });
    try {
      await wishlistService.addWishlistItem(product.id);
    } catch {
      /* offline-first: local state already updated */
    }
    return true;
  }, []);

  const removeFromWishlist = useCallback(async (id) => {
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
    try {
      await wishlistService.removeWishlistItem(id);
    } catch {
      /* local state already updated */
    }
  }, []);

  const toggleWishlist = useCallback(
    async (product) => {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        return false;
      }
      await addToWishlist(product);
      return true;
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  const wishlistCount = items.length;

  const value = useMemo(
    () => ({
      items,
      wishlistCount,
      syncing,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      hydrateFromApi,
    }),
    [
      items,
      wishlistCount,
      syncing,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      hydrateFromApi,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
