const Router = require('express').Router;
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/requestValidators');

const router = Router();

/**
 * PUBLIC ROUTES (no authentication required)
 */

// POST /api/auth/register
// Request: { name, email, password, role? }
// Response: { data: user, token }
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login
// Request: { email, password }
// Response: { data: user, token }
router.post('/login', validateLogin, authController.login);

module.exports = router;
