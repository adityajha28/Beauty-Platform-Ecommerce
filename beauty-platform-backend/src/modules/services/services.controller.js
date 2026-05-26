const servicesService = require('./services.service');

const sendItems = (res, items) => res.json({ items });

exports.listCategories = async (req, res, next) => {
  try {
    const items = await servicesService.getPublicCategories();
    sendItems(res, items);
  } catch (err) {
    next(err);
  }
};

exports.listServices = async (req, res, next) => {
  try {
    const items = await servicesService.getPublicServices();
    sendItems(res, items);
  } catch (err) {
    next(err);
  }
};

exports.listByCategory = async (req, res, next) => {
  try {
    const category = req.query.category;
    const items = await servicesService.getServicesByCategoryParam(category);
    sendItems(res, items);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const q = req.query.q || req.query.search || '';
    const items = await servicesService.searchServices(q);
    sendItems(res, items);
  } catch (err) {
    next(err);
  }
};

exports.popular = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 20);
    const items = await servicesService.getPopularServices(limit);
    sendItems(res, items);
  } catch (err) {
    next(err);
  }
};

exports.listPackages = async (req, res, next) => {
  try {
    const items = await servicesService.getPackages();
    sendItems(res, items);
  } catch (err) {
    next(err);
  }
};

exports.getOperations = async (req, res, next) => {
  try {
    const operations = await servicesService.getOperations();
    res.json({ operations });
  } catch (err) {
    next(err);
  }
};

/* Admin */

exports.adminListCategories = async (req, res, next) => {
  try {
    const items = await servicesService.adminListCategories();
    sendItems(res, items);
  } catch (err) {
    next(err);
  }
};

exports.adminSaveCategory = async (req, res, next) => {
  try {
    const item = await servicesService.adminSaveCategory(req.body);
    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
};

exports.adminDeleteCategory = async (req, res, next) => {
  try {
    await servicesService.adminDeleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

exports.adminListServices = async (req, res, next) => {
  try {
    const items = await servicesService.adminListServices();
    sendItems(res, items);
  } catch (err) {
    next(err);
  }
};

exports.adminSaveService = async (req, res, next) => {
  try {
    const item = await servicesService.adminSaveService(req.body);
    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
};

exports.adminDeleteService = async (req, res, next) => {
  try {
    await servicesService.adminDeleteService(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
};

exports.adminGetOperations = async (req, res, next) => {
  try {
    const operations = await servicesService.adminGetOperations();
    res.json({ operations });
  } catch (err) {
    next(err);
  }
};

exports.adminUpdateOperations = async (req, res, next) => {
  try {
    const operations = await servicesService.adminUpdateOperations(req.body);
    res.json({ operations });
  } catch (err) {
    next(err);
  }
};
