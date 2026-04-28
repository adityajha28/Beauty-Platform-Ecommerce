const { verifyToken } = require('./auth.middleware');
const { isAdmin } = require('./admin.middleware');

exports.adminAuth = [verifyToken, isAdmin];