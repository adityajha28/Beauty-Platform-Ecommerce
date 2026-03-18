import API from "./api";

export const createBooking = async (bookingData) => {
  return API.post("/bookings", bookingData);
};

export const createCustomPackageBooking = async (packageData) => {
  return API.post("/bookings/custom-package", packageData);
};

export const getAvailableSlots = async (date) => {
  return API.get(`/bookings/slots?date=${date}`);
};

export const getUserBookings = () =>
  API.get("/bookings/user");