const userService = require('../services/userService');

exports.getUsers = (req, res, next) => {
  try {
    const users = userService.getAllUsers();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUser = (req, res, next) => {
  try {
    const user = userService.getUserById(req.params.id);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.createUser = (req, res, next) => {
  try {
    const user = userService.createUser(req.body);
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = (req, res, next) => {
  try {
    const user = userService.updateUser(req.params.id, req.body);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = (req, res, next) => {
  try {
    const user = userService.deleteUser(req.params.id);
    res.json({ data: user, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
