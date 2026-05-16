const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';  //user123
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

generateHash();

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};