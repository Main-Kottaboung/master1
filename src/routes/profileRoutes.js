const Router = require('express').Router;
const auth = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', auth, (req, res) => {
  res.json({ data: req.user });
});

module.exports = router;
