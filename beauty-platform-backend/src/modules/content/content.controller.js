const contentService = require('./content.service');

const sendItems = (res, items) => res.json({ items });

exports.listOffers = async (req, res, next) => {
  try {
    sendItems(res, await contentService.getPublicOffers());
  } catch (e) {
    next(e);
  }
};

exports.listHeroSlides = async (req, res, next) => {
  try {
    sendItems(res, await contentService.getPublicHeroSlides());
  } catch (e) {
    next(e);
  }
};

exports.listMakeupBanners = async (req, res, next) => {
  try {
    sendItems(res, await contentService.getPublicMakeupBanners());
  } catch (e) {
    next(e);
  }
};

exports.listReviews = async (req, res, next) => {
  try {
    sendItems(res, await contentService.getApprovedReviews());
  } catch (e) {
    next(e);
  }
};

exports.submitReview = async (req, res, next) => {
  try {
    const review = await contentService.submitReview(req.body);
    res.status(201).json({ message: 'Review submitted for approval', review });
  } catch (e) {
    next(e);
  }
};

/* Admin */
exports.adminList = (collection) => async (req, res, next) => {
  try {
    sendItems(res, await contentService.adminList(collection));
  } catch (e) {
    next(e);
  }
};

exports.adminSave = (collection) => async (req, res, next) => {
  try {
    const item = await contentService.adminSave(collection, req.body);
    res.json({ item });
  } catch (e) {
    next(e);
  }
};

exports.adminDelete = (collection) => async (req, res, next) => {
  try {
    await contentService.adminDelete(collection, req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
};
