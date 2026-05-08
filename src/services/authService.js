const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./userService');
const config = require('../config');
const { ApiError } = require('../utils/apiError');

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  // ensure unique email
  const existing = userService.getAllUsers().find((u) => u.email === email);
  if (existing) throw new ApiError(409, 'Email already in use');

  const hashed = await bcrypt.hash(password, 10);
  const user = userService.createUser({ name, email, password: hashed });

  const token = jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

  return { user, token };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const all = userService.getAllUsers();
  const userRaw = require('../database/userDatabase').find((u) => u.email === email);

  if (!userRaw || !userRaw.password) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const match = await bcrypt.compare(password, userRaw.password);
  if (!match) throw new ApiError(401, 'Invalid credentials');

  const token = jwt.sign({ sub: userRaw.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

  const user = userService.getUserById(userRaw.id);
  return { user, token };
}

module.exports = { register, login };
