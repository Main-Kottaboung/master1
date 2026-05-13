const { body, param, validationResult } = require('express-validator');

function handleValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
}

const validateAddCartItem = [
  body('productId').isInt({ gt: 0 }).withMessage('productId must be a positive integer'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be at least 1'),
  handleValidationResult,
];

const validateUpdateCartItem = [
  param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer'),
  body('quantity').isInt({ min: 1 }).withMessage('quantity must be at least 1'),
  handleValidationResult,
];

const validateCartItemId = [
  param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer'),
  handleValidationResult,
];

module.exports = {
  validateAddCartItem,
  validateUpdateCartItem,
  validateCartItemId,
};
