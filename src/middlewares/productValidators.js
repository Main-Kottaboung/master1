const { body, validationResult } = require('express-validator');

const validateCreateProduct = [
  body('title').isString().notEmpty().withMessage('title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('stock must be a non-negative integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const validateUpdateProduct = [
  body('title').optional().isString(),
  body('price').optional().isFloat({ gt: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

module.exports = { validateCreateProduct, validateUpdateProduct };
