/**
 * Wishlist API — replace mock implementations when backend is ready.
 *
 * Expected endpoints:
 *   GET    /api/wishlist
 *   POST   /api/wishlist          body: { productId }
 *   DELETE /api/wishlist/:productId
 */

// import api from './api';

export async function fetchWishlist() {
  // const { data } = await api.get('/wishlist');
  // return data.items;
  return null;
}

export async function addWishlistItem(productId) {
  // const { data } = await api.post('/wishlist', { productId });
  // return data.item;
  return { productId };
}

export async function removeWishlistItem(productId) {
  // await api.delete(`/wishlist/${productId}`);
  return { productId };
}

export async function syncWishlist(localItems) {
  // const { data } = await api.post('/wishlist/sync', { items: localItems });
  // return data.items;
  return localItems;
}
