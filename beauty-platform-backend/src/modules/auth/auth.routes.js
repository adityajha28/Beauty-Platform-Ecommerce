const router = require('express').Router();
const controller = require('./auth.controller');
const {
  validatePhoneBody,
  validateVerifyOtpBody,
  validateRegisterBody,
} = require('./auth.validation');
const { verifyToken } = require('../../middleware/auth.middleware');
const { loginLimiter, otpSendLimiter, otpVerifyLimiter } = require('../../middleware/rateLimit');

router.post('/admin/login', loginLimiter, controller.adminLogin);

router.get('/customer/otp-config', controller.otpConfig);
router.post('/customer/send-otp', otpSendLimiter, validatePhoneBody, controller.sendOtp);
router.post('/customer/verify-otp', otpVerifyLimiter, validateVerifyOtpBody, controller.verifyOtp);
router.post('/customer/register', verifyToken, validateRegisterBody, controller.registerCustomer);

router.post('/refresh-token', controller.refreshToken);
router.post('/logout', controller.logout);

module.exports = router;
