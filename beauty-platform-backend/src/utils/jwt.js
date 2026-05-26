const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateAccessToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.accessTokenExpiry,
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiry,
  });

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
