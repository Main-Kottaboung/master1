const orderService = require('../services/orderService');

async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const order = await orderService.createOrderFromCart(userId);
    return res.status(201).json({ data: order });
  } catch (err) {
    return next(err);
  }
}

async function listOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const orders = await orderService.listOrdersForUser(userId);
    return res.json({ data: orders });
  } catch (err) {
    return next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const order = await orderService.getOrderById(userId, orderId);
    return res.json({ data: order });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createOrder,
  listOrders,
  getOrder,
};
