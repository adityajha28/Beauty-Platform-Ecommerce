const usersService = require('./users.service');
const bookingsRepository = require('../bookings/bookings.repository');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await usersService.listCustomers();
    res.json({ users, total: users.length });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await usersService.getCustomerById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.dashboardStats = async (req, res, next) => {
  try {
    const users = await usersService.listCustomers();
    let bookings = [];
    try {
      bookings = await bookingsRepository.listAll();
    } catch {
      bookings = [];
    }

    const revenue = bookings.reduce((sum, b) => sum + (Number(b.amount) || Number(b.total) || 0), 0);

    res.json({
      users: users.length,
      bookings: bookings.length,
      orders: 0,
      revenue,
    });
  } catch (err) {
    next(err);
  }
};
