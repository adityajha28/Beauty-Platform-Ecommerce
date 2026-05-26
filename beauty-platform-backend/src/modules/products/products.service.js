const { v4: uuidv4 } = require('uuid');
const repo = require('./products.repository');
const { toSlug } = require('../../utils/slug');
const AppError = require('../../utils/appError');

function mapProduct(p, category) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    image: p.image,
    description: p.description || '',
    badge: p.badge || '',
    rating: p.rating || 4.8,
    category: category?.name || p.categoryName || '',
    categoryId: p.categoryId,
    itemType: 'product',
  };
}

exports.getPublicCategories = () => repo.listCategories({ activeOnly: true });
exports.getPublicProducts = async () => {
  const [products, categories] = await Promise.all([
    repo.listProducts({ activeOnly: true }),
    repo.listCategories({ activeOnly: true }),
  ]);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  return products.map((p) => mapProduct(p, catMap[p.categoryId]));
};

exports.getProductsByCategory = async (categoryParam) => {
  if (!categoryParam) return exports.getPublicProducts();
  const category = await repo.findCategoryBySlugOrName(categoryParam);
  if (!category) return [];
  const products = await repo.listProducts({ activeOnly: true, categoryId: category.id });
  return products.map((p) => mapProduct(p, category));
};

exports.searchProducts = async (query) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q || q.length < 2) return [];
  const products = await exports.getPublicProducts();
  return products.filter(
    (p) =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
  );
};

exports.adminListCategories = () => repo.listCategories();
exports.adminListProducts = () => repo.listProducts();

exports.adminSaveCategory = async (body) => {
  if (!body.name?.trim()) throw new AppError('Category name is required', 400);
  const id = body.id || `pcat_${uuidv4().slice(0, 8)}`;
  return repo.upsertCategory({
    ...body,
    id,
    name: body.name.trim(),
    slug: body.slug || toSlug(body.name),
  });
};

exports.adminDeleteCategory = async (id) => {
  const products = await repo.listProducts({ categoryId: id });
  if (products.length) throw new AppError('Remove products in this category first', 409);
  await repo.deleteCategory(id);
};

exports.adminSaveProduct = async (body) => {
  if (!body.name?.trim()) throw new AppError('Product name is required', 400);
  if (!body.categoryId) throw new AppError('Category is required', 400);
  const id = body.id || `prd_${uuidv4().slice(0, 8)}`;
  const cats = await repo.listCategories();
  const cat = cats.find((c) => c.id === body.categoryId);
  return repo.upsertProduct({
    ...body,
    id,
    name: body.name.trim(),
    categoryName: cat?.name,
  });
};

exports.adminDeleteProduct = (id) => repo.deleteProduct(id);
