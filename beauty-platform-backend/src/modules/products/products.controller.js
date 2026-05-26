const productsService = require('./products.service');

const sendItems = (res, items) => res.json({ items });

exports.listCategories = async (req, res, next) => {
  try {
    sendItems(res, await productsService.getPublicCategories());
  } catch (e) {
    next(e);
  }
};

exports.listProducts = async (req, res, next) => {
  try {
    const category = req.query.category;
    const items = category
      ? await productsService.getProductsByCategory(category)
      : await productsService.getPublicProducts();
    sendItems(res, items);
  } catch (e) {
    next(e);
  }
};

exports.search = async (req, res, next) => {
  try {
    const items = await productsService.searchProducts(req.query.q || req.query.search);
    sendItems(res, items);
  } catch (e) {
    next(e);
  }
};

exports.adminListCategories = async (req, res, next) => {
  try {
    sendItems(res, await productsService.adminListCategories());
  } catch (e) {
    next(e);
  }
};

exports.adminSaveCategory = async (req, res, next) => {
  try {
    res.json({ item: await productsService.adminSaveCategory(req.body) });
  } catch (e) {
    next(e);
  }
};

exports.adminDeleteCategory = async (req, res, next) => {
  try {
    await productsService.adminDeleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (e) {
    next(e);
  }
};

exports.adminListProducts = async (req, res, next) => {
  try {
    sendItems(res, await productsService.adminListProducts());
  } catch (e) {
    next(e);
  }
};

exports.adminSaveProduct = async (req, res, next) => {
  try {
    res.json({ item: await productsService.adminSaveProduct(req.body) });
  } catch (e) {
    next(e);
  }
};

exports.adminDeleteProduct = async (req, res, next) => {
  try {
    await productsService.adminDeleteProduct(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (e) {
    next(e);
  }
};
