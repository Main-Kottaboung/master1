/**
 * optionalAuth - Attempts to load user from JWT if present
 * Does NOT fail if token is missing or invalid
 * Useful for: personalization, profile endpoints that work for guest users, etc.
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const userService = require('../services/userService');

async function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return next();
  }

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await userService.getUserById(payload.sub);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Silently ignore invalid tokens—optional auth allows requests to continue
  }
  next();
}

module.exports = optionalAuth;
