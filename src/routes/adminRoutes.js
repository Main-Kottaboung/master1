const Router = require('express').Router;
const authorize = require('../middlewares/authorize');
const userService = require('../services/userService');

const router = Router();

// Admin-only: list all users including internal fields (for admin view)
router.get('/users', authorize('admin'), (req, res) => {
  // NOTE: userService.getAllUsers returns sanitized users without password
  res.json({ data: userService.getAllUsers() });
});

module.exports = router;
