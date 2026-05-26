const router = require('express').Router();
const controller = require('./products.controller');

router.get('/categories', controller.listCategories);
router.get('/search', controller.search);
router.get('/', controller.listProducts);

module.exports = router;
