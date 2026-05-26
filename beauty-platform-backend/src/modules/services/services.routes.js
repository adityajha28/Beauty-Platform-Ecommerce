const router = require('express').Router();
const controller = require('./services.controller');

/* Public catalog (servicesCatalogService) */
router.get('/categories', controller.listCategories);
router.get('/search', controller.search);
router.get('/popular', controller.popular);
router.get('/packages', controller.listPackages);
router.get('/', controller.listByCategory);

module.exports = router;
