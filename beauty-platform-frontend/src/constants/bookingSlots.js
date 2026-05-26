export const DEFAULT_BOOKING_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const SLOT_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

export function normalizeSlotLabel(label) {
  const trimmed = String(label || "").trim();
  const m = trimmed.match(SLOT_RE);
  if (!m) return null;
  const hour = String(parseInt(m[1], 10)).padStart(2, "0");
  const min = String(parseInt(m[2], 10)).padStart(2, "0");
  return `${hour}:${min} ${m[3].toUpperCase()}`;
}

export function slotToMinutes(label) {
  const m = String(label).trim().match(SLOT_RE);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

export function sortSlotLabels(slots) {
  return [...slots].sort((a, b) => slotToMinutes(a) - slotToMinutes(b));
}

export function timeInputToSlot(value) {
  if (!value) return null;
  const [hStr, mStr] = value.split(":");
  const h = parseInt(hStr, 10);
  const min = parseInt(mStr, 10);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${period}`;
}
