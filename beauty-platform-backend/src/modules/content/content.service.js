const { v4: uuidv4 } = require('uuid');
const repo = require('./content.repository');
const AppError = require('../../utils/appError');

const COLLECTIONS = {
  offers: 'offers',
  heroSlides: 'hero-slides',
  makeupBanners: 'makeup-banners',
  reviews: 'reviews',
};

exports.getPublicOffers = () => repo.list(COLLECTIONS.offers, { activeOnly: true });
exports.getPublicHeroSlides = () => repo.list(COLLECTIONS.heroSlides, { activeOnly: true });
exports.getPublicMakeupBanners = () => repo.list(COLLECTIONS.makeupBanners, { activeOnly: true });
exports.getApprovedReviews = async () => {
  const items = await repo.list(COLLECTIONS.reviews, { activeOnly: true });
  return items.filter((r) => r.status === 'approved');
};

exports.adminList = (collection) => repo.list(collection);
exports.adminSave = async (collection, body) => {
  if (!body.id && !body.title && !body.name && !body.text) {
    throw new AppError('Invalid content payload', 400);
  }
  const id = body.id || `${collection.slice(0, 3)}_${uuidv4().slice(0, 8)}`;
  return repo.upsert(collection, { ...body, id });
};
exports.adminDelete = (collection, id) => repo.remove(collection, id);

exports.submitReview = async (body) => {
  const id = `rev_${uuidv4().slice(0, 8)}`;
  return repo.upsert(COLLECTIONS.reviews, {
    id,
    name: body.name?.trim(),
    rating: Number(body.rating) || 5,
    text: body.text?.trim(),
    targetType: body.targetType || 'service',
    targetName: body.targetName || '',
    status: 'pending',
    isActive: false,
  });
};

exports.COLLECTIONS = COLLECTIONS;
