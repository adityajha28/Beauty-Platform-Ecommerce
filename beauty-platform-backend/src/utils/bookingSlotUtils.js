const { DEFAULT_SLOTS } = require('../constants/bookingSlots');

const SLOT_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

function toMinutes(label) {
  const m = String(label).trim().match(SLOT_RE);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (h < 1 || h > 12 || min < 0 || min > 59) return null;
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

function fromTimeInput(value) {
  if (!value || typeof value !== 'string') return null;
  const [hStr, mStr] = value.split(':');
  const h = parseInt(hStr, 10);
  const min = parseInt(mStr, 10);
  if (Number.isNaN(h) || Number.isNaN(min) || h < 0 || h > 23 || min < 0 || min > 59) {
    return null;
  }
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
}

function normalizeSlot(label) {
  const trimmed = String(label || '').trim();
  const m = trimmed.match(SLOT_RE);
  if (!m) return null;
  const hour = String(parseInt(m[1], 10)).padStart(2, '0');
  const min = String(parseInt(m[2], 10)).padStart(2, '0');
  return `${hour}:${min} ${m[3].toUpperCase()}`;
}

function sortSlots(slots) {
  return [...slots].sort((a, b) => toMinutes(a) - toMinutes(b));
}

function dedupeSlots(slots) {
  const seen = new Set();
  const out = [];
  for (const raw of slots) {
    const n = normalizeSlot(raw);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return sortSlots(out);
}

function sanitizeSlotList(slots) {
  if (!Array.isArray(slots)) return [...DEFAULT_SLOTS];
  const cleaned = dedupeSlots(slots);
  return cleaned.length ? cleaned : [...DEFAULT_SLOTS];
}

module.exports = {
  SLOT_RE,
  toMinutes,
  fromTimeInput,
  normalizeSlot,
  sortSlots,
  dedupeSlots,
  sanitizeSlotList,
};
