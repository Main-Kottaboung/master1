const { ApiError } = require('../utils/apiError');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedRoles = ['user', 'admin'];

function buildError(message) {
  return new ApiError(400, message);
}

function validateEmail(email) {
  return typeof email === 'string' && emailPattern.test(email.trim());
}

function validateRole(role) {
  return role === undefined || allowedRoles.includes(role);
}

function validateRegister(req, res, next) {
  const { name, email, password, role } = req.body ?? {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(buildError('Name must be at least 2 characters long'));
  }

  if (!validateEmail(email)) {
    return next(buildError('A valid email is required'));
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(buildError('Password must be at least 6 characters long'));
  }

  if (!validateRole(role)) {
    return next(buildError('Role must be either user or admin'));
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body ?? {};

  if (!validateEmail(email)) {
    return next(buildError('A valid email is required'));
  }

  if (!password || typeof password !== 'string') {
    return next(buildError('Password is required'));
  }

  next();
}

function validateCreateUser(req, res, next) {
  const { name, email, role } = req.body ?? {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(buildError('Name must be at least 2 characters long'));
  }

  if (!validateEmail(email)) {
    return next(buildError('A valid email is required'));
  }

  if (!validateRole(role)) {
    return next(buildError('Role must be either user or admin'));
  }

  next();
}

function validateUpdateUser(req, res, next) {
  const { name, email, role } = req.body ?? {};
  const hasName = typeof name === 'string' && name.trim().length > 0;
  const hasEmail = typeof email === 'string' && email.trim().length > 0;
  const hasRole = role !== undefined;

  if (!hasName && !hasEmail && !hasRole) {
    return next(buildError('At least one field is required to update user'));
  }

  if (hasEmail && !validateEmail(email)) {
    return next(buildError('A valid email is required'));
  }

  if (hasRole && !validateRole(role)) {
    return next(buildError('Role must be either user or admin'));
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
};
