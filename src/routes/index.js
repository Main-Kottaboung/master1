const Router = require('express').Router;
const healthRoutes = require('./health');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const adminRoutes = require('./adminRoutes');
const productsRoutes = require('./productsRoutes');
const categoriesRoutes = require('./categoriesRoutes');
const cartRoutes = require('./cartRoutes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/cart', cartRoutes);

module.exports = router;
