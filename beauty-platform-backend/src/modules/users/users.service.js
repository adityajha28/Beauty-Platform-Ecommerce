const usersRepository = require('./users.repository');

function parseAddresses(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapCustomer(user) {
  return {
    id: user.userId,
    userId: user.userId,
    name: user.name || '',
    phone: user.phone || '',
    email: user.email || '',
    role: user.role || 'customer',
    addresses: parseAddresses(user.addresses),
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null,
  };
}

async function listCustomers() {
  const items = await usersRepository.listAll();
  return items
    .filter((u) => u.role === 'customer' || !u.role)
    .map(mapCustomer)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

async function getCustomerById(userId) {
  const user = await usersRepository.getById(userId);
  if (!user || (user.role && user.role !== 'customer')) return null;
  return mapCustomer(user);
}

module.exports = { listCustomers, getCustomerById, mapCustomer };
