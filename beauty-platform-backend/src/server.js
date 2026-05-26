require('./config/env');

const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
  if (env.otpDevMode) {
    console.log('WhatsApp OTP: DEV MODE (codes logged here — set WHATSAPP_* in .env + OTP_DEV_MODE=false)');
  } else {
    console.log(`WhatsApp OTP: LIVE (template: ${env.whatsappOtpTemplateName}, type: ${env.whatsappTemplateType})`);
  }
});
