const bookingsService = require('./bookings.service');

exports.getSlots = async (req, res, next) => {
  try {
    const date = req.query.date;
    if (!date) {
      return res.status(400).json({ message: 'date query parameter is required' });
    }
    const slots = await bookingsService.getAvailableSlots(date);
    res.json({ slots });
  } catch (err) {
    next(err);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await bookingsService.createSimpleBooking(req.body);
    res.status(201).json({ message: 'Booking request submitted', booking });
  } catch (err) {
    next(err);
  }
};

exports.createCustomPackage = async (req, res, next) => {
  try {
    const userId = req.user?.userId || null;
    const booking = await bookingsService.createCustomPackageBooking(req.body, userId);
    res.status(201).json({ message: 'Package booking created', booking });
  } catch (err) {
    next(err);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const booking = await bookingsService.checkoutBooking(req.body, userId);
    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    next(err);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await bookingsService.getUserBookings(req.user.userId);
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

exports.adminListBookings = async (req, res, next) => {
  try {
    const bookings = await bookingsService.getAllBookings();
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

exports.adminUpdateStatus = async (req, res, next) => {
  try {
    const booking = await bookingsService.updateBookingStatus(
      req.params.id,
      req.body.status
    );
    res.json({ message: 'Status updated', booking });
  } catch (err) {
    next(err);
  }
};

exports.adminGetBookingSlots = async (req, res, next) => {
  try {
    const data = await bookingsService.adminGetBookingSlots();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.adminSetBookingSlots = async (req, res, next) => {
  try {
    const data = await bookingsService.adminSetBookingSlots(req.body);
    res.json({ message: 'Time slots updated', ...data });
  } catch (err) {
    next(err);
  }
};
