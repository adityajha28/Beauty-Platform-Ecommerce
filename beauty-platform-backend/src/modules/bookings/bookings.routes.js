const router = require('express').Router();
const controller = require('./bookings.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { bookingLimiter } = require('../../middleware/rateLimit');

router.get('/slots', controller.getSlots);

router.post('/', bookingLimiter, controller.createBooking);
router.post('/custom-package', bookingLimiter, controller.createCustomPackage);

router.get('/user', verifyToken, controller.getUserBookings);
router.post('/checkout', verifyToken, bookingLimiter, controller.checkout);

module.exports = router;
