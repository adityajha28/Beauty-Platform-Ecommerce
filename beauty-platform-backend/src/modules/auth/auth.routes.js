const router = require('express').Router();
const controller = require('./auth.controller');

router.post('/admin/login', controller.adminLogin);
// router.post('/admin/login', loginLimiter, controller.adminLogin);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', controller.logout);

module.exports = router;