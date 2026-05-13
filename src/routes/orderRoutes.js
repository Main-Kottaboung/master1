const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const { validateOrderId } = require('../middlewares/orderValidators');
const orderController = require('../controllers/orderController');

router.use(requireAuth);

router.post('/', orderController.createOrder);
router.get('/', orderController.listOrders);
router.get('/:id', validateOrderId, orderController.getOrder);

module.exports = router;
