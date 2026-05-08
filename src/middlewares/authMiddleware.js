const jwt = require('jsonwebtoken');
const config = require('../config');
const userService = require('../services/userService');
const { ApiError } = require('../utils/apiError');

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization required'));
  }

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await userService.getUserById(payload.sub);
    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = authMiddleware;
