const { ApiError } = require('../utils/apiError');

// roles: array or single string
function authorize(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    const user = req.user;
    if (!user) return next(new ApiError(401, 'Authorization required'));

    if (!user.role) return next(new ApiError(403, 'Access denied'));

    if (allowed.length && !allowed.includes(user.role)) {
      return next(new ApiError(403, 'Insufficient role'));
    }

    next();
  };
}

module.exports = authorize;
