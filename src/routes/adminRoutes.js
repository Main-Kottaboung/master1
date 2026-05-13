const Router = require('express').Router;
const requireAuth = require('../middlewares/requireAuth');
const requireRole = require('../middlewares/requireRole');
const userService = require('../services/userService');
const adminOrderRoutes = require('./adminOrderRoutes');

const router = Router();

/**
 * PROTECTED ROUTES (Authentication + Admin Role required)
 */

// GET /api/admin/users
// Requires: Bearer token + admin role
// Returns: List of all users (sanitized, no passwords)
router.get('/users', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

// Mount admin order routes at /api/admin/orders
router.use('/orders', adminOrderRoutes);

module.exports = router;
