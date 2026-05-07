const { ApiError } = require('../utils/apiError');

function notFoundHandler(req, res, next) {
  const err = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(err);
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const payload = {
    status: 'error',
    statusCode,
    message,
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
