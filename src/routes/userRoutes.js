const Router = require('express').Router;
const userController = require('../controllers/userController');
const { validateCreateUser, validateUpdateUser } = require('../middlewares/requestValidators');

const router = Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', validateCreateUser, userController.createUser);
router.put('/:id', validateUpdateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
