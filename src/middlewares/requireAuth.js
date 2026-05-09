/**
 * requireAuth - Enforces JWT authentication
 * Terminates request with 401 if no valid token or user not found
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const userService = require('../services/userService');
const { ApiError } = require('../utils/apiError');

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization required'));
  }

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await userService.getUserById(payload.sub);
    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = requireAuth;
