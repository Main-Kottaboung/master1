const Router = require('express').Router;
const healthController = require('../controllers/healthController');

const router = Router();

router.get('/', healthController.getHealth);

module.exports = router;
