import API from "./api";
import { userStorage } from "../utils/userStorage";

const REFUNDS_KEY = "oraya_refunds";

function getLocalRefunds() {
  try {
    return JSON.parse(localStorage.getItem(REFUNDS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalRefunds(list) {
  localStorage.setItem(REFUNDS_KEY, JSON.stringify(list));
}

/**
 * POST /refunds/request
 * @param {{ orderId?, bookingId?, reason, amount, type: 'order'|'booking' }}
 */
export async function requestRefund(payload) {
  const entry = {
    id: `ref_${Date.now()}`,
    ...payload,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    const { data } = await API.post("/refunds/request", payload);
    const saved = data?.refund ?? entry;
    const list = getLocalRefunds();
    saveLocalRefunds([saved, ...list]);
    return saved;
  } catch {
    const list = getLocalRefunds();
    saveLocalRefunds([entry, ...list]);
    return entry;
  }
}

/** GET /refunds/user */
export async function getUserRefunds() {
  try {
    const { data } = await API.get("/refunds/user");
    return data?.refunds ?? getLocalRefunds();
  } catch {
    return getLocalRefunds();
  }
}

/** Sync order/booking status locally after refund request */
export function markOrderRefundPending(orderId) {
  const orders = userStorage.getOrders().map((o) =>
    o.id === orderId ? { ...o, status: "refund_pending", refundStatus: "pending" } : o
  );
  userStorage.setOrders(orders);
}

export function markBookingRefundPending(bookingId) {
  const bookings = userStorage.getBookings().map((b) =>
    b.id === bookingId ? { ...b, status: "refund_pending", refundStatus: "pending" } : b
  );
  userStorage.setBookings(bookings);
}
