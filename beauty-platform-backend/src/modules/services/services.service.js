const { v4: uuidv4 } = require('uuid');
const repo = require('./services.repository');
const { toSlug } = require('../../utils/slug');
const AppError = require('../../utils/appError');

function mapServiceForPublic(service, category) {
  return {
    id: service.id,
    name: service.name,
    price: service.price,
    originalPrice: service.originalPrice || Math.round(service.price * 1.25),
    duration: service.duration ? `${service.duration} mins` : service.durationLabel || '45 mins',
    rating: service.rating || '4.8',
    reviews: service.reviews ?? 120,
    image: service.image,
    description: service.description || '',
    itemType: 'service',
    category: category?.name || service.categoryName || '',
    categoryId: service.categoryId,
    isPopular: !!service.isPopular,
  };
}

exports.getPublicCategories = () => repo.listCategories({ activeOnly: true });

exports.getPublicServices = () => repo.listServices({ activeOnly: true });

exports.getServicesByCategoryParam = async (categoryParam) => {
  if (!categoryParam) return [];

  const category = await repo.findCategoryBySlugOrName(categoryParam);
  if (!category) return [];

  const services = await repo.listServices({
    activeOnly: true,
    categoryId: category.id,
  });

  return services.map((s) => mapServiceForPublic(s, category));
};

exports.searchServices = async (query) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q || q.length < 2) return [];

  const [services, categories] = await Promise.all([
    repo.listServices({ activeOnly: true }),
    repo.listCategories({ activeOnly: true }),
  ]);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  return services
    .filter((s) => {
      const catName = catMap[s.categoryId]?.name?.toLowerCase() || '';
      return (
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        catName.includes(q)
      );
    })
    .map((s) => mapServiceForPublic(s, catMap[s.categoryId]));
};

exports.getPopularServices = async (limit = 6) => {
  const [services, categories] = await Promise.all([
    repo.listServices({ activeOnly: true }),
    repo.listCategories({ activeOnly: true }),
  ]);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const popular = services.filter((s) => s.isPopular);
  const list = (popular.length ? popular : services).slice(0, limit);
  return list.map((s) => mapServiceForPublic(s, catMap[s.categoryId]));
};

exports.getPackages = async () => {
  const services = await repo.listServices({ activeOnly: true });
  return services
    .filter((s) => s.isPackage)
    .map((s) => mapServiceForPublic(s, null));
};

exports.getOperations = async () => {
  const stored = await repo.getOperations();
  return (
    stored || {
      servicesOpen: true,
      productsOpen: true,
      serviceMessage: 'Service bookings are temporarily paused. Please check back soon.',
      productMessage: 'Product orders are temporarily paused. Please check back soon.',
      globalBanner: '',
    }
  );
};

/* ── Admin ── */

exports.adminListCategories = () => repo.listCategories();
exports.adminListServices = () => repo.listServices();

exports.adminSaveCategory = async (body) => {
  if (!body.name?.trim()) throw new AppError('Category name is required', 400);
  const id = body.id || `cat_${uuidv4().slice(0, 8)}`;
  return repo.upsertCategory({
    ...body,
    id,
    name: body.name.trim(),
    slug: body.slug || toSlug(body.name),
  });
};

exports.adminDeleteCategory = async (id) => {
  const services = await repo.listServices({ categoryId: id });
  if (services.length) {
    throw new AppError('Remove or reassign services in this category first', 409);
  }
  await repo.deleteCategory(id);
};

exports.adminSaveService = async (body) => {
  if (!body.name?.trim()) throw new AppError('Service name is required', 400);
  if (!body.categoryId) throw new AppError('Category is required', 400);

  const category = await repo.getCategoryById(body.categoryId);
  if (!category) throw new AppError('Category not found', 404);

  const id = body.id || `svc_${uuidv4().slice(0, 8)}`;
  return repo.upsertService({
    ...body,
    id,
    name: body.name.trim(),
    categoryName: category.name,
  });
};

exports.adminDeleteService = (id) => repo.deleteService(id);

exports.adminGetOperations = () => exports.getOperations();

exports.adminUpdateOperations = (body) => repo.setOperations(body);

exports.resolveServicesFromCartItems = async (items = []) => {
  const resolved = [];
  let subtotal = 0;

  for (const item of items) {
    if (item.id?.startsWith('pkg-') || item.isPackage) {
      const price = Number(item.price) || 0;
      subtotal += price * (Number(item.quantity) || 1);
      resolved.push({ ...item, resolvedPrice: price });
      continue;
    }

    const dbService = await repo.getServiceById(item.id);
    if (!dbService || dbService.isActive === false) {
      throw new AppError(`Service unavailable: ${item.name || item.id}`, 400);
    }

    const qty = Number(item.quantity) || 1;
    const lineTotal = dbService.price * qty;
    subtotal += lineTotal;
    resolved.push({
      ...item,
      id: dbService.id,
      name: dbService.name,
      price: dbService.price,
      duration: dbService.duration,
      image: dbService.image,
      quantity: qty,
      resolvedPrice: dbService.price,
    });
  }

  return { resolved, subtotal };
};
