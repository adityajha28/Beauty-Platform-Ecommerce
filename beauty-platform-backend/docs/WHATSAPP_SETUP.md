# Meta WhatsApp OTP — setup for Oraya Beauty

Customer sign-up and login use **phone OTP** delivered through the **WhatsApp Cloud API**. The backend already exposes:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/customer/send-otp` | Send OTP (`mode`: `login` \| `signup`) |
| `POST /api/auth/customer/verify-otp` | Verify code, get JWT |
| `POST /api/auth/customer/register` | Complete profile (auth required) |
| `GET /api/auth/customer/otp-config` | Whether WhatsApp is live or dev mode |

---

## 1. Create Meta app & WhatsApp product

1. Go to [Meta for Developers](https://developers.facebook.com/) → **My Apps** → **Create App**.
2. Choose **Business** (or **Other** if Business is not available).
3. Add product **WhatsApp** → **Set up**.
4. Under **WhatsApp** → **API Setup**, note:
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - **Temporary access token** (for testing) or create a **System User** token in Business Manager for production → `WHATSAPP_ACCESS_TOKEN`

5. Add your **test phone numbers** in API Setup (required until the app is live and template is approved for production).

---

## 2. Create the OTP message template

In **WhatsApp Manager** (linked from the developer app) → **Message templates** → **Create template**.

### Option A — Authentication template (recommended)

- **Category:** Authentication  
- **Name:** e.g. `oraya_otp` (must match `WHATSAPP_OTP_TEMPLATE_NAME`)  
- **Language:** English  
- Body includes the verification code placeholder (Meta’s authentication layout).  
- Include **Copy code** button if offered by the template builder.

Set in `.env`:

```env
WHATSAPP_OTP_TEMPLATE_NAME=oraya_otp
WHATSAPP_TEMPLATE_TYPE=authentication
WHATSAPP_LANGUAGE_CODE=en
```

### Option B — Utility template (simpler body)

Example body:

> Your Oraya Beauty verification code is **{{1}}**. Valid for 5 minutes. Do not share this code.

- **Category:** Utility  
- One variable `{{1}}` = 6-digit OTP  

Set in `.env`:

```env
WHATSAPP_OTP_TEMPLATE_NAME=oraya_otp_utility
WHATSAPP_TEMPLATE_TYPE=utility
WHATSAPP_LANGUAGE_CODE=en
```

Submit the template and wait for **Approved** status before production sends.

---

## 3. Configure backend `.env`

Copy from `.env.example` and fill:

```env
WHATSAPP_API_URL=https://graph.facebook.com/v21.0
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxx...
WHATSAPP_OTP_TEMPLATE_NAME=oraya_otp
WHATSAPP_TEMPLATE_TYPE=authentication
WHATSAPP_LANGUAGE_CODE=en

# Turn off console-only OTP when credentials are ready
OTP_DEV_MODE=false
```

**Dev behaviour:** If `WHATSAPP_ACCESS_TOKEN` is empty, or `OTP_DEV_MODE=true`, OTP is **only printed in the backend terminal** (no WhatsApp charge).

Restart the API after changing `.env`.

---

## 4. Test

```bash
# Health check — auth.whatsappOtp should be "live"
curl http://localhost:5000/api/health

# OTP config
curl http://localhost:5000/api/auth/customer/otp-config

# Send OTP (use a number added as test recipient in Meta)
curl -X POST http://localhost:5000/api/auth/customer/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+919876543210\",\"mode\":\"signup\"}"

# Or direct WhatsApp test script
npm run whatsapp:test -- +919876543210
```

Check the phone for the WhatsApp message. Then verify on the site at `/auth` or via:

```bash
curl -X POST http://localhost:5000/api/auth/customer/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+919876543210\",\"otp\":\"123456\"}"
```

---

## 5. Go live (production)

1. Complete **Meta Business Verification** and connect a real WhatsApp Business number.  
2. Use a **permanent** System User token with `whatsapp_business_messaging` permission (not the 24h test token).  
3. Ensure template is **Approved** for production (not only test numbers).  
4. Set `NODE_ENV=production` and `OTP_DEV_MODE=false`.  
5. Monitor Meta **WhatsApp** → **Insights** for delivery failures.

---

## Troubleshooting

| Error / symptom | Fix |
|-----------------|-----|
| `(#131030) Recipient phone number not in allowed list` | Add number under API Setup → test numbers, or go live. |
| `Template name does not exist` | Template name/language must match exactly (`en` vs `en_US`). |
| `Parameter count mismatch` | Use `utility` for body-only templates; `authentication` if template has copy-code button. |
| OTP in terminal only | Set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `OTP_DEV_MODE=false`. |
| 502 with Meta message in dev | Read response in API logs; fix template or token. |

Phone numbers must be **E.164** (e.g. `+919876543210`). The app normalizes Indian 10-digit input to `+91…`.
