/**
 * Admin Order Controller
 * Handles requests for admin-only order management
 */

const adminOrderService = require('../services/adminOrderService');

/**
 * GET /api/admin/orders
 * List all orders with filtering, sorting, pagination
 */
async function listOrders(req, res, next) {
  try {
    const { page, limit, status, userId, search, sortBy, sortDir } = req.query;

    const result = await adminOrderService.listOrdersForAdmin({
      page,
      limit,
      status,
      userId,
      search,
      sortBy,
      sortDir,
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/orders/:id
 * Get a single order with full details
 */
async function getOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await adminOrderService.getOrderForAdmin(id);
    return res.json({ data: order });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/admin/orders/:id/status
 * Update order status with state machine validation
 * Body: { status: "paid" | "shipped" | "completed" | "cancelled" }
 */
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'status is required',
      });
    }

    const updatedOrder = await adminOrderService.updateOrderStatus(id, status);
    return res.json({ data: updatedOrder });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/orders/stats/overview
 * Get order statistics for dashboard
 */
async function getStatistics(req, res, next) {
  try {
    const stats = await adminOrderService.getOrderStatistics();
    return res.json({ data: stats });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listOrders,
  getOrder,
  updateOrderStatus,
  getStatistics,
};
