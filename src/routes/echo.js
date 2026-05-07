const Router = require('express').Router;
const echoController = require('../controllers/echoController');

const router = Router();

router.post('/', echoController.echo);

module.exports = router;
