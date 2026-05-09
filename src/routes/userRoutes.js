const Router = require('express').Router;
const requireAuth = require('../middlewares/requireAuth');
const requireRole = require('../middlewares/requireRole');
const userController = require('../controllers/userController');
const { validateCreateUser, validateUpdateUser } = require('../middlewares/requestValidators');

const router = Router();

/**
 * USER MANAGEMENT ROUTES
 * Current: Public (for admin/internal use)
 * Recommended for ecommerce: Protect with requireAuth + requireRole('admin')
 * 
 * To enable admin protection, uncomment the middleware in each route:
 * Example: router.get('/', requireAuth, requireRole('admin'), userController.getUsers);
 */

// GET /api/users
// Currently public; list all users
router.get('/', userController.getUsers);

// GET /api/users/:id
// Currently public; get specific user
router.get('/:id', userController.getUser);

// POST /api/users
// Currently public; create user (admin operation)
router.post('/', validateCreateUser, userController.createUser);

// PUT /api/users/:id
// Currently public; update user (admin operation)
router.put('/:id', validateUpdateUser, userController.updateUser);

// DELETE /api/users/:id
// Currently public; delete user (admin operation)
router.delete('/:id', userController.deleteUser);

module.exports = router;
