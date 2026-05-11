const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const requireAuth = require('../middlewares/requireAuth');
const requireRole = require('../middlewares/requireRole');
const { validateCreateProduct, validateUpdateProduct } = require('../middlewares/productValidators');

// Public
router.get('/', productsController.index);
router.get('/:slug', productsController.show);

// Admin protected
router.post('/', requireAuth, requireRole('admin'), validateCreateProduct, productsController.create);
router.put('/:id', requireAuth, requireRole('admin'), validateUpdateProduct, productsController.update);
router.delete('/:id', requireAuth, requireRole('admin'), productsController.remove);

module.exports = router;
