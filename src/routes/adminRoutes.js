const Router = require('express').Router;
const authorize = require('../middlewares/authorize');
const userService = require('../services/userService');

const router = Router();

// Admin-only: list all users including internal fields (for admin view)
router.get('/users', authorize('admin'), async (req, res, next) => {
  try {
    // NOTE: userService.getAllUsers returns sanitized users without password
    const users = await userService.getAllUsers();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
