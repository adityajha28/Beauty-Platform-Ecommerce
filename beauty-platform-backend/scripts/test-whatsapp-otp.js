/**
 * Send a test OTP via Meta WhatsApp Cloud API.
 *
 * Usage:
 *   node scripts/test-whatsapp-otp.js +919876543210
 *
 * Requires .env:
 *   WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, OTP_DEV_MODE=false
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const env = require('../src/config/env');
const { sendOtpViaWhatsApp } = require('../src/services/whatsapp.service');
const { generateOtpCode } = require('../src/utils/otp');

async function main() {
  const phone = process.argv[2];
  if (!phone) {
    console.error('Usage: node scripts/test-whatsapp-otp.js +919876543210');
    process.exit(1);
  }

  if (env.otpDevMode) {
    console.error('OTP_DEV_MODE is on or WhatsApp credentials missing. Set credentials and OTP_DEV_MODE=false in .env');
    process.exit(1);
  }

  const code = generateOtpCode();
  console.log(`Sending test OTP ${code} to ${phone} (template: ${env.whatsappOtpTemplateName})...`);

  try {
    const result = await sendOtpViaWhatsApp(phone, code);
    console.log('Success:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

main();
