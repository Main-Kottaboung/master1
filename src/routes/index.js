const Router = require('express').Router;
const healthRoutes = require('./health');
const echoRoutes = require('./echo');

const router = Router();

router.use('/health', healthRoutes);
router.use('/echo', echoRoutes);

module.exports = router;
