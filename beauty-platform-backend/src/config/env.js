require('dotenv').config();

const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Warning: ${key} is not set. Auth will fail until you configure .env`);
  }
}

const hasWhatsAppCreds =
  Boolean(process.env.WHATSAPP_ACCESS_TOKEN?.trim()) &&
  Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID?.trim());

const otpDevModeExplicit =
  process.env.OTP_DEV_MODE === 'true' || process.env.OTP_DEV_MODE === '1';
const otpDevModeOff =
  process.env.OTP_DEV_MODE === 'false' || process.env.OTP_DEV_MODE === '0';

const otpDevMode = otpDevModeOff
  ? false
  : otpDevModeExplicit
    ? true
    : !hasWhatsAppCreds;

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',

  dynamoEndpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  dynamoRegion: process.env.DYNAMODB_REGION || 'local',

  otpLength: Number(process.env.OTP_LENGTH) || 6,
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 5,
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS) || 3,
  otpPepper: process.env.OTP_PEPPER || process.env.JWT_SECRET || 'dev-otp-pepper-change-me',
  otpDevMode,

  whatsappApiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v21.0',
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() || '',
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN?.trim() || '',
  whatsappOtpTemplateName: process.env.WHATSAPP_OTP_TEMPLATE_NAME || 'oraya_otp',
  whatsappTemplateType: process.env.WHATSAPP_TEMPLATE_TYPE || 'authentication',
  whatsappLanguageCode: process.env.WHATSAPP_LANGUAGE_CODE || 'en',

  adminSeedEmail: process.env.ADMIN_SEED_EMAIL || 'admin@orayabeauty.in',
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || '',
};
