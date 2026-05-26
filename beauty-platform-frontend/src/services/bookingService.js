import API from "./api";
import { userStorage } from "../utils/userStorage";
import { getBookingSlots } from "./cmsStorage";

export const createBooking = async (bookingData) => {
  const { data } = await API.post("/bookings", bookingData);
  return data;
};

export const createCustomPackageBooking = async (packageData) => {
  const { data } = await API.post("/bookings/custom-package", packageData);
  return data;
};

export const getAvailableSlots = async (date) => {
  try {
    const { data } = await API.get(`/bookings/slots?date=${encodeURIComponent(date)}`);
    return data?.slots ?? [];
  } catch {
    return getBookingSlots();
  }
};

export const getUserBookings = async () => {
  try {
    const { data } = await API.get("/bookings/user");
    const bookings = data?.bookings ?? [];
    if (bookings.length) userStorage.setBookings(bookings);
    return bookings;
  } catch {
    return userStorage.getBookings();
  }
};

/**
 * POST /bookings/checkout — service booking after payment (auth required)
 */
export const createServiceBooking = async (payload) => {
  const { data } = await API.post("/bookings/checkout", payload);
  const saved = data?.booking ?? data;
  if (saved?.id) userStorage.addBooking(saved);
  return saved;
};

export const getBookingById = async (id) => {
  const local = userStorage.getBookings().find((b) => b.id === id);
  if (local) return local;
  return null;
};

/** Admin: all bookings */
export const getAdminBookings = async () => {
  const { data } = await API.get("/admin/bookings");
  return data?.bookings ?? [];
};

/** Admin: update booking status */
export const updateBookingStatus = async (id, status) => {
  const { data } = await API.patch(`/admin/bookings/${id}/status`, { status });
  return data?.booking ?? data;
};
