import API from './api';

function pickItems(data) {
  return data?.items ?? [];
}

export async function fetchProductCategories() {
  try {
    const { data } = await API.get('/products/categories');
    return pickItems(data);
  } catch {
    return [];
  }
}

export async function fetchProducts(category) {
  try {
    const { data } = await API.get('/products', {
      params: category ? { category } : {},
    });
    return pickItems(data);
  } catch {
    return [];
  }
}

export async function searchProducts(query) {
  const q = String(query || '').trim();
  if (!q || q.length < 2) return [];
  try {
    const { data } = await API.get('/products/search', { params: { q } });
    return pickItems(data);
  } catch {
    return [];
  }
}
