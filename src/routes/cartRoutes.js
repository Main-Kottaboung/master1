const Router = require('express').Router;
const requireAuth = require('../middlewares/requireAuth');
const cartController = require('../controllers/cartController');
const {
  validateAddCartItem,
  validateUpdateCartItem,
  validateCartItemId,
} = require('../middlewares/cartValidators');

const router = Router();

router.use(requireAuth);

router.get('/', cartController.getCart);
router.post('/items', validateAddCartItem, cartController.addItem);
router.put('/items/:id', validateUpdateCartItem, cartController.updateItem);
router.delete('/items/:id', validateCartItemId, cartController.removeItem);

module.exports = router;
