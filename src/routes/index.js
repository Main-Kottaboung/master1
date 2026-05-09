const Router = require('express').Router;
const healthRoutes = require('./health');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const adminRoutes = require('./adminRoutes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
