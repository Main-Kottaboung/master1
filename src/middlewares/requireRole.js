/**
 * requireRole - Role-based authorization middleware
 * Requires authentication AND a specific role
 * Useful for admin panels, protected features
 */

const { ApiError } = require('../utils/apiError');

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Required role: ${allowedRoles.join(' or ')}`));
    }

    next();
  };
}

module.exports = requireRole;
