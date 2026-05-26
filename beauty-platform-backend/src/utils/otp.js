const crypto = require('crypto');
const env = require('../config/env');

function generateOtpCode(length = env.otpLength) {
  const max = 10 ** length;
  const num = crypto.randomInt(0, max);
  return String(num).padStart(length, '0');
}

function hashOtp(otp, phone) {
  return crypto
    .createHmac('sha256', env.otpPepper)
    .update(`${phone}:${otp}`)
    .digest('hex');
}

function verifyOtpHash(otp, phone, storedHash) {
  const candidate = hashOtp(otp, phone);
  if (!storedHash || candidate.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(storedHash));
}

function otpExpiresAtMs() {
  return Date.now() + env.otpExpiryMinutes * 60 * 1000;
}

module.exports = {
  generateOtpCode,
  hashOtp,
  verifyOtpHash,
  otpExpiresAtMs,
};
