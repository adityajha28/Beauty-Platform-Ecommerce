import API from "./api";
import { userStorage } from "../utils/userStorage";

/** First-user offers — admin will manage via /admin/coupons later */
export const FIRST_USER_OFFERS = {
  service: {
    type: "service",
    label: "First 3 service bookings",
    maxUses: 3,
    discountPercent: 15,
    codes: ["ORAYA-SVC-1", "ORAYA-SVC-2", "ORAYA-SVC-3"],
  },
  product: {
    type: "product",
    label: "First 3 product orders",
    maxUses: 3,
    discountPercent: 10,
    codes: ["ORAYA-PROD-1", "ORAYA-PROD-2", "ORAYA-PROD-3"],
  },
};

function getLocalOfferForType(type) {
  const offer = FIRST_USER_OFFERS[type];
  const usage = userStorage.getCouponUsage();
  const used = usage[type] || 0;
  if (used >= offer.maxUses) return null;
  return {
    code: offer.codes[used],
    discountPercent: offer.discountPercent,
    label: `${offer.label} (${used + 1}/${offer.maxUses})`,
    remaining: offer.maxUses - used,
  };
}

/**
 * POST /coupons/validate — falls back to local first-user offers
 * @returns {{ valid, code, discountAmount, discountPercent, message }}
 */
export async function validateCoupon(code, type, subtotal) {
  const normalized = (code || "").trim().toUpperCase();

  try {
    const { data } = await API.post("/coupons/validate", {
      code: normalized,
      type,
      subtotal,
    });
    return data;
  } catch {
    const offer = FIRST_USER_OFFERS[type];
    const usage = userStorage.getCouponUsage();
    const used = usage[type] || 0;

    if (used >= offer.maxUses) {
      return { valid: false, message: "You have used all first-user offers for this category." };
    }

    const expectedCode = offer.codes[used];
    if (normalized !== expectedCode) {
      const hint = getLocalOfferForType(type);
      return {
        valid: false,
        message: hint
          ? `Try your offer code: ${hint.code}`
          : "Invalid coupon code.",
      };
    }

    const discountPercent = offer.discountPercent;
    const discountAmount = Math.round((subtotal * discountPercent) / 100);

    return {
      valid: true,
      code: normalized,
      discountPercent,
      discountAmount,
      message: `${discountPercent}% off applied!`,
      isFirstUserOffer: true,
    };
  }
}

export function getSuggestedCoupon(type) {
  return getLocalOfferForType(type);
}

export function markCouponUsed(type) {
  return userStorage.incrementCouponUsage(type);
}

/** GET /coupons/active — for profile display */
export async function fetchActiveCoupons() {
  try {
    const { data } = await API.get("/coupons/active");
    return data?.coupons ?? [];
  } catch {
    return Object.values(FIRST_USER_OFFERS).map((o) => {
      const usage = userStorage.getCouponUsage();
      const used = usage[o.type] || 0;
      return {
        type: o.type,
        label: o.label,
        discountPercent: o.discountPercent,
        used,
        maxUses: o.maxUses,
        nextCode: used < o.maxUses ? o.codes[used] : null,
      };
    });
  }
}
