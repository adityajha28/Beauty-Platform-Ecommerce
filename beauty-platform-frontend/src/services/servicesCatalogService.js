/**
 * Services catalog API
 */
import API from './api';

function pickItems(data) {
  return data?.items ?? [];
}

export async function fetchCategories() {
  try {
    const { data } = await API.get('/services/categories');
    const items = pickItems(data);
    return items.length ? items : [];
  } catch {
    return [];
  }
}

export async function fetchServicesByCategory(categorySlugOrName) {
  if (!categorySlugOrName) return [];
  try {
    const { data } = await API.get('/services', {
      params: { category: categorySlugOrName },
    });
    return pickItems(data);
  } catch {
    return [];
  }
}

export async function fetchAllServices() {
  try {
    const { data } = await API.get('/cms/services');
    return pickItems(data);
  } catch {
    return [];
  }
}

export async function searchServices(query) {
  const q = String(query || '').trim();
  if (!q || q.length < 2) return [];
  try {
    const { data } = await API.get('/services/search', { params: { q } });
    return pickItems(data);
  } catch {
    return [];
  }
}

export async function fetchPopularServices(limit = 6) {
  try {
    const { data } = await API.get('/services/popular', { params: { limit } });
    return pickItems(data);
  } catch {
    return [];
  }
}

export async function fetchPackages() {
  try {
    const { data } = await API.get('/services/packages');
    return pickItems(data);
  } catch {
    return [];
  }
}
