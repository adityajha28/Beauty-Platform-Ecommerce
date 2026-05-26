/**
 * Normalize to E.164-style: +[country][number], digits only after +.
 */
function normalizePhone(input) {
  if (!input || typeof input !== 'string') return null;

  let raw = input.trim().replace(/[\s-]/g, '');
  if (!raw.startsWith('+')) {
    if (/^[6-9]\d{9}$/.test(raw)) raw = `+91${raw}`;
    else return null;
  }

  const digits = raw.slice(1);
  if (!/^\d{10,15}$/.test(digits)) return null;

  return `+${digits}`;
}

function isValidIndianMobile(phone) {
  return /^\+91[6-9]\d{9}$/.test(phone);
}

module.exports = { normalizePhone, isValidIndianMobile };
