const cartService = require('../services/cartService');

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json({ data: cart });
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const cart = await cartService.addCartItem(req.user.id, req.body);
    res.status(201).json({ data: cart });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const cart = await cartService.updateCartItem(req.user.id, req.params.id, req.body);
    res.json({ data: cart });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const cart = await cartService.removeCartItem(req.user.id, req.params.id);
    res.json({ data: cart });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
};
