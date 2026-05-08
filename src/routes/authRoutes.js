const Router = require('express').Router;
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/requestValidators');

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

module.exports = router;
