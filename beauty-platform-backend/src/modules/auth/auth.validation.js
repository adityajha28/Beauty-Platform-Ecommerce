const { normalizePhone, isValidIndianMobile } = require('../../utils/phone');
const AppError = require('../../utils/appError');

function validatePhoneBody(req, res, next) {
  const { phone } = req.body;
  const normalized = normalizePhone(phone);

  if (!normalized || !isValidIndianMobile(normalized)) {
    return next(
      new AppError('Please provide a valid WhatsApp number with country code (e.g. +919876543210)', 400)
    );
  }

  req.normalizedPhone = normalized;
  next();
}

function validateVerifyOtpBody(req, res, next) {
  const { phone, otp } = req.body;
  const normalized = normalizePhone(phone);

  if (!normalized || !isValidIndianMobile(normalized)) {
    return next(new AppError('Invalid phone number', 400));
  }

  const code = String(otp || '').replace(/\D/g, '');
  if (code.length !== 6) {
    return next(new AppError('OTP must be 6 digits', 400));
  }

  req.normalizedPhone = normalized;
  req.otpCode = code;
  next();
}

function validateRegisterBody(req, res, next) {
  const { name, email } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return next(new AppError('Name is required', 400));
  }
  if (email && typeof email === 'string' && email.trim()) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) return next(new AppError('Invalid email address', 400));
  }
  req.profileName = name.trim();
  req.profileEmail = email ? String(email).trim() : '';
  next();
}

module.exports = {
  validatePhoneBody,
  validateVerifyOtpBody,
  validateRegisterBody,
};
