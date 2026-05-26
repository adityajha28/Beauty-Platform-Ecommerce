const adminUsersService = require('./admin.users.service');

exports.listAdmins = async (req, res, next) => {
  try {
    const admins = await adminUsersService.listAdminUsers();
    res.json({ admins });
  } catch (err) {
    next(err);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const data = await adminUsersService.createAdminUser(
      { email, password, name },
      req.user?.userId
    );
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};
