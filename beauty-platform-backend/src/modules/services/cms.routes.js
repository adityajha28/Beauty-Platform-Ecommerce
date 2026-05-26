const router = require('express').Router();
const servicesController = require('./services.controller');
const contentController = require('../content/content.controller');
const productsController = require('../products/products.controller');

/* Services CMS */
router.get('/service-categories', servicesController.listCategories);
router.get('/services', servicesController.listServices);
router.get('/operations', servicesController.getOperations);

/* Products CMS */
router.get('/product-categories', productsController.listCategories);
router.get('/products', productsController.listProducts);

/* Marketing content */
router.get('/offers', contentController.listOffers);
router.get('/hero-slides', contentController.listHeroSlides);
router.get('/makeup-banners', contentController.listMakeupBanners);

/* Reviews */
router.get('/reviews', contentController.listReviews);

module.exports = router;
