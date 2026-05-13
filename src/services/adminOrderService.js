/**
 * Admin Order Service
 * Handles admin-level order operations:
 * - List orders with pagination, filtering, sorting
 * - Get order details with user info
 * - Update order status with state machine validation
 * - Generate order statistics
 */

const prisma = require('../utils/prisma');
const { ApiError } = require('../utils/apiError');
const { OrderStatus, isValidTransition, getAllowedTransitions } = require('../utils/orderConstants');

function toNumber(v) {
  return Number(v);
}

/**
 * Map order with user info for admin response
 */
function mapOrderWithUser(order) {
  const items = (order.items || []).map((item) => ({
    id: item.id,
    productId: item.productId || null,
    snapshotTitle: item.snapshotTitle,
    snapshotPrice: item.snapshotPrice,
    quantity: item.quantity,
    subtotal: item.subtotal,
    createdAt: item.createdAt,
  }));

  return {
    id: order.id,
    userId: order.userId,
    user: order.user
      ? {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        }
      : null,
    status: order.status,
    totalAmount: order.totalAmount,
    totalQuantity: order.totalQuantity,
    items,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

/**
 * Build WHERE clause for filtering
 */
function buildWhereClause(filters) {
  const where = {};

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    where.status = filters.status;
  }

  // Filter by userId
  if (filters.userId) {
    where.userId = toNumber(filters.userId);
  }

  // Search: order id or user email
  if (filters.search) {
    const searchNum = parseInt(filters.search, 10);
    where.OR = [
      { id: isNaN(searchNum) ? undefined : searchNum },
      { user: { email: { contains: filters.search } } },
    ].filter((cond) => Object.values(cond).some((v) => v !== undefined));
  }

  return where;
}

/**
 * Build ORDER BY clause for sorting
 */
function buildOrderBy(sortBy = 'createdAt', sortDir = 'desc') {
  const allowedFields = ['createdAt', 'totalAmount', 'status'];
  const field = allowedFields.includes(sortBy) ? sortBy : 'createdAt';
  const direction = sortDir === 'asc' ? 'asc' : 'desc';

  return { [field]: direction };
}

/**
 * List orders for admin with filtering, sorting, pagination
 * @param {object} options - { page, limit, status, userId, search, sortBy, sortDir }
 * @returns {object} { data, meta: { page, limit, total, pages, pending, paid, shipped, completed, cancelled } }
 */
async function listOrdersForAdmin(options = {}) {
  const page = Math.max(1, toNumber(options.page) || 1);
  const limit = Math.max(1, Math.min(100, toNumber(options.limit) || 20));
  const skip = (page - 1) * limit;

  const where = buildWhereClause({
    status: options.status,
    userId: options.userId,
    search: options.search,
  });

  const orderBy = buildOrderBy(options.sortBy, options.sortDir);

  // Fetch orders with user info
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  // Fetch status counts for stats
  const statusCounts = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  });

  const stats = {
    pending: 0,
    paid: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
  };

  statusCounts.forEach((sc) => {
    if (stats.hasOwnProperty(sc.status)) {
      stats[sc.status] = sc._count;
    }
  });

  return {
    data: orders.map(mapOrderWithUser),
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      ...stats,
    },
  };
}

/**
 * Get single order for admin with full details
 */
async function getOrderForAdmin(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: toNumber(orderId) },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: true,
    },
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return mapOrderWithUser(order);
}

/**
 * Update order status with state machine validation
 * Ensures only valid transitions are allowed
 */
async function updateOrderStatus(orderId, newStatus) {
  const order = await prisma.order.findUnique({
    where: { id: toNumber(orderId) },
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Validate new status
  if (!Object.values(OrderStatus).includes(newStatus)) {
    throw new ApiError(400, `Invalid status: ${newStatus}`);
  }

  // Validate transition
  if (!isValidTransition(order.status, newStatus)) {
    const allowed = getAllowedTransitions(order.status);
    throw new ApiError(
      400,
      `Cannot transition from ${order.status} to ${newStatus}. Allowed: ${allowed.join(', ')}`
    );
  }

  // Update status
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: newStatus },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: true,
    },
  });

  return mapOrderWithUser(updatedOrder);
}

/**
 * Get order statistics for dashboard
 * Returns aggregated data for each status
 */
async function getOrderStatistics() {
  const [
    totalOrders,
    totalRevenue,
    statusBreakdown,
    avgOrderValue,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      _avg: { totalAmount: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
  ]);

  const breakdown = {};
  statusBreakdown.forEach((sb) => {
    breakdown[sb.status] = {
      count: sb._count,
      revenue: sb._sum.totalAmount || 0,
    };
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    avgOrderValue: avgOrderValue._avg.totalAmount || 0,
    breakdown,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      email: o.user?.email || 'unknown',
      status: o.status,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt,
    })),
  };
}

module.exports = {
  listOrdersForAdmin,
  getOrderForAdmin,
  updateOrderStatus,
  getOrderStatistics,
};
