const { param, validationResult } = require('express-validator');

function handleValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
}

const validateOrderId = [
  param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer'),
  handleValidationResult,
];

module.exports = { validateOrderId };
