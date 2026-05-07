const Router = require('express').Router;
const healthRoutes = require('./health');
const echoRoutes = require('./echo');
const userRoutes = require('./userRoutes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/echo', echoRoutes);
router.use('/users', userRoutes);

module.exports = router;
