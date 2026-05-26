const authService = require('./auth.service');
const { getWhatsAppStatus } = require('../../services/whatsapp.service');

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const data = await authService.adminLoginService(normalizedEmail, password);
    return res.status(200).json({ message: 'Login successful', ...data });
  } catch (error) {
    next(error);
  }
};

exports.sendOtp = async (req, res, next) => {
  try {
    const mode = req.body.mode === 'login' || req.body.mode === 'signup' ? req.body.mode : undefined;
    const data = await authService.sendOtpService(req.normalizedPhone, mode);
    const whatsapp = getWhatsAppStatus();
    return res.status(200).json({
      ...data,
      channel: whatsapp.devMode ? 'dev_console' : 'whatsapp',
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const data = await authService.verifyOtpService(req.normalizedPhone, req.otpCode);
    return res.status(200).json({
      message: 'OTP verified successfully',
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

exports.registerCustomer = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const data = await authService.registerCustomerService(
      req.user.userId,
      req.profileName,
      req.profileEmail
    );

    return res.status(200).json({
      message: 'Profile updated successfully',
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const data = await authService.refreshTokenService(refreshToken);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logoutService(refreshToken);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.otpConfig = async (req, res) => {
  const status = getWhatsAppStatus();
  res.json({
    whatsappEnabled: status.configured,
    devMode: status.devMode,
    message: status.devMode
      ? 'OTP is printed in the backend terminal (development mode).'
      : 'OTP is sent via WhatsApp.',
  });
};
