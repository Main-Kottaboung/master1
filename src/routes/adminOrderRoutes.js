/**
 * Admin Order Routes
 * Protected by requireAuth + requireRole('admin')
 */

const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const requireRole = require('../middlewares/requireRole');
const { param, body, validationResult } = require('express-validator');
const adminOrderController = require('../controllers/adminOrderController');

// Validation middleware
function handleValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
}

// Apply authentication + admin role check to all routes
router.use(requireAuth);
router.use(requireRole('admin'));

// GET /api/admin/orders - List orders
router.get('/', adminOrderController.listOrders);

// GET /api/admin/orders/stats/overview - Statistics
router.get('/stats/overview', adminOrderController.getStatistics);

// GET /api/admin/orders/:id - Get single order
router.get(
  '/:id',
  param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer'),
  handleValidationResult,
  adminOrderController.getOrder
);

// PUT /api/admin/orders/:id/status - Update order status
router.put(
  '/:id/status',
  param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer'),
  body('status')
    .isIn(['pending', 'paid', 'shipped', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  handleValidationResult,
  adminOrderController.updateOrderStatus
);

module.exports = router;
