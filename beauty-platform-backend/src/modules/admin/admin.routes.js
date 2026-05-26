const router = require('express').Router();
const { adminAuth } = require('../../middleware/adminAuth.middleware');
const servicesController = require('../services/services.controller');
const bookingsController = require('../bookings/bookings.controller');
const productsController = require('../products/products.controller');
const contentController = require('../content/content.controller');
const adminUsersController = require('./admin.users.controller');
const customersAdminController = require('../users/users.admin.controller');
const { COLLECTIONS } = require('../content/content.service');

router.get('/dashboard', adminAuth, (req, res) => {
  res.json({
    message: 'Welcome to Admin Dashboard',
    user: req.user,
  });
});

/* Service categories */
router.get('/service-categories', adminAuth, servicesController.adminListCategories);
router.post('/service-categories', adminAuth, servicesController.adminSaveCategory);
router.delete('/service-categories/:id', adminAuth, servicesController.adminDeleteCategory);

/* Services */
router.get('/services', adminAuth, servicesController.adminListServices);
router.post('/services', adminAuth, servicesController.adminSaveService);
router.delete('/services/:id', adminAuth, servicesController.adminDeleteService);

/* Product categories */
router.get('/product-categories', adminAuth, productsController.adminListCategories);
router.post('/product-categories', adminAuth, productsController.adminSaveCategory);
router.delete('/product-categories/:id', adminAuth, productsController.adminDeleteCategory);

/* Products */
router.get('/products', adminAuth, productsController.adminListProducts);
router.post('/products', adminAuth, productsController.adminSaveProduct);
router.delete('/products/:id', adminAuth, productsController.adminDeleteProduct);

/* Marketing content */
router.get('/offers', adminAuth, contentController.adminList(COLLECTIONS.offers));
router.post('/offers', adminAuth, contentController.adminSave(COLLECTIONS.offers));
router.delete('/offers/:id', adminAuth, contentController.adminDelete(COLLECTIONS.offers));

router.get('/hero-slides', adminAuth, contentController.adminList(COLLECTIONS.heroSlides));
router.post('/hero-slides', adminAuth, contentController.adminSave(COLLECTIONS.heroSlides));
router.delete('/hero-slides/:id', adminAuth, contentController.adminDelete(COLLECTIONS.heroSlides));

router.get('/makeup-banners', adminAuth, contentController.adminList(COLLECTIONS.makeupBanners));
router.post('/makeup-banners', adminAuth, contentController.adminSave(COLLECTIONS.makeupBanners));
router.delete('/makeup-banners/:id', adminAuth, contentController.adminDelete(COLLECTIONS.makeupBanners));

router.get('/reviews', adminAuth, contentController.adminList(COLLECTIONS.reviews));
router.put('/reviews/:id', adminAuth, contentController.adminSave(COLLECTIONS.reviews));
router.delete('/reviews/:id', adminAuth, contentController.adminDelete(COLLECTIONS.reviews));

/* Operations */
router.get('/operations', adminAuth, servicesController.adminGetOperations);
router.put('/operations', adminAuth, servicesController.adminUpdateOperations);

/* Bookings */
router.get('/bookings', adminAuth, bookingsController.adminListBookings);
router.patch('/bookings/:id/status', adminAuth, bookingsController.adminUpdateStatus);
router.get('/booking-slots', adminAuth, bookingsController.adminGetBookingSlots);
router.put('/booking-slots', adminAuth, bookingsController.adminSetBookingSlots);

/* Customers (registered app users) */
router.get('/users', adminAuth, customersAdminController.listUsers);
router.get('/users/:id', adminAuth, customersAdminController.getUser);
router.get('/stats', adminAuth, customersAdminController.dashboardStats);

/* Admin team */
router.get('/team', adminAuth, adminUsersController.listAdmins);
router.post('/team', adminAuth, adminUsersController.createAdmin);

module.exports = router;
