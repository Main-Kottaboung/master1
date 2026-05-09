const Router = require('express').Router;
const requireAuth = require('../middlewares/requireAuth');

const router = Router();

/**
 * PROTECTED ROUTES (JWT authentication required)
 */

// GET /api/profile
// Requires: Bearer token
// Returns: Current authenticated user
router.get('/', requireAuth, (req, res) => {
  res.json({ data: req.user });
});

module.exports = router;
