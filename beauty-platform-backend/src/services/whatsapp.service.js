const env = require('../config/env');
const AppError = require('../utils/appError');

function isConfigured() {
  return Boolean(
    env.whatsappAccessToken &&
      env.whatsappPhoneNumberId &&
      !env.otpDevMode
  );
}

function buildTemplatePayload(otpCode) {
  const language = { code: env.whatsappLanguageCode };

  if (env.whatsappTemplateType === 'authentication') {
    return {
      name: env.whatsappOtpTemplateName,
      language,
      components: [
        {
          type: 'body',
          parameters: [{ type: 'text', text: otpCode }],
        },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [{ type: 'text', text: otpCode }],
        },
      ],
    };
  }

  return {
    name: env.whatsappOtpTemplateName,
    language,
    components: [
      {
        type: 'body',
        parameters: [{ type: 'text', text: otpCode }],
      },
    ],
  };
}

function parseMetaError(status, bodyText) {
  try {
    const data = JSON.parse(bodyText);
    const err = data?.error;
    if (err?.error_user_msg) return err.error_user_msg;
    if (err?.message) return err.message;
  } catch {
    /* ignore */
  }
  return `WhatsApp API error (${status})`;
}

/**
 * Sends OTP via Meta WhatsApp Cloud API.
 * Falls back to console logging when OTP_DEV_MODE or credentials missing.
 */
async function sendOtpViaWhatsApp(phoneE164, otpCode) {
  const digitsOnly = phoneE164.replace(/\D/g, '');

  if (!/^\d{10,15}$/.test(digitsOnly)) {
    throw new AppError('Invalid phone number for WhatsApp delivery', 400);
  }

  if (env.otpDevMode) {
    console.log('\n--- OTP (dev mode — not sent via WhatsApp) ---');
    console.log(`  Phone: ${phoneE164}`);
    console.log(`  Code:  ${otpCode}`);
    console.log('  Set WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID in .env');
    console.log('  Set OTP_DEV_MODE=false to enable live WhatsApp.\n');
    return { dev: true, delivered: false };
  }

  if (!env.whatsappAccessToken || !env.whatsappPhoneNumberId) {
    throw new AppError('WhatsApp is not configured on the server', 503);
  }

  const url = `${env.whatsappApiUrl.replace(/\/$/, '')}/${env.whatsappPhoneNumberId}/messages`;

  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: digitsOnly,
    type: 'template',
    template: buildTemplatePayload(otpCode),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.whatsappAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = { raw: responseText };
  }

  if (!res.ok) {
    const detail = parseMetaError(res.status, responseText);
    console.error('[WhatsApp API]', res.status, responseText);

    if (env.nodeEnv !== 'production') {
      throw new AppError(`WhatsApp delivery failed: ${detail}`, 502);
    }
    throw new AppError('Failed to send OTP via WhatsApp. Please try again later.', 502);
  }

  const messageId = data?.messages?.[0]?.id;
  console.log(`[WhatsApp] OTP sent to ${phoneE164} (message id: ${messageId || 'n/a'})`);

  return { dev: false, delivered: true, messageId, data };
}

function getWhatsAppStatus() {
  return {
    configured: isConfigured(),
    devMode: env.otpDevMode,
    templateName: env.whatsappOtpTemplateName,
    templateType: env.whatsappTemplateType,
    languageCode: env.whatsappLanguageCode,
    phoneNumberIdSet: Boolean(env.whatsappPhoneNumberId),
  };
}

module.exports = {
  sendOtpViaWhatsApp,
  isConfigured,
  getWhatsAppStatus,
};
