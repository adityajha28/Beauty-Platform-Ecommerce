const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const repo = require('./admin.repository');
const AppError = require('../../utils/appError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapAdminPublic(admin) {
  return {
    adminId: admin.adminId,
    email: admin.email,
    name: admin.name || 'Admin',
    role: admin.role,
    createdAt: admin.createdAt,
    createdBy: admin.createdBy || null,
  };
}

exports.listAdminUsers = async () => {
  const admins = await repo.listAdmins();
  return admins.map(mapAdminPublic);
};

exports.createAdminUser = async ({ email, password, name }, createdByAdminId) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!EMAIL_RE.test(normalizedEmail)) {
    throw new AppError('Please provide a valid email address', 400);
  }
  if (!password || String(password).length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  const existing = await repo.findByEmail(normalizedEmail);
  if (existing) {
    throw new AppError('An admin account with this email already exists', 409);
  }

  const hash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  const adminId = `admin-${uuidv4().slice(0, 8)}`;

  const record = {
    adminId,
    email: normalizedEmail,
    password: hash,
    role: 'admin',
    name: String(name || '').trim() || normalizedEmail.split('@')[0],
    createdAt: now,
    createdBy: createdByAdminId || null,
  };

  await repo.createAdmin(record);

  return {
    message: 'Admin user created successfully',
    admin: mapAdminPublic(record),
  };
};
