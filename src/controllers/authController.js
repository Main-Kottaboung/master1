const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ data: user, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ data: user, token });
  } catch (err) {
    next(err);
  }
};
