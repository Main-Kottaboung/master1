const prisma = require('../utils/prisma');
const { ApiError } = require('../utils/apiError');

function toNumber(v) {
  return Number(v);
}

function mapOrderItem(item) {
  return {
    id: item.id,
    productId: item.productId || null,
    snapshotTitle: item.snapshotTitle,
    snapshotPrice: item.snapshotPrice,
    quantity: item.quantity,
    subtotal: item.subtotal,
    createdAt: item.createdAt,
  };
}

function mapOrder(order) {
  const items = (order.items || []).map(mapOrderItem);
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    totalAmount: order.totalAmount,
    totalQuantity: order.totalQuantity,
    items,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

async function listOrdersForUser(userId) {
  const numeric = toNumber(userId);
  const orders = await prisma.order.findMany({
    where: { userId: numeric },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return orders.map(mapOrder);
}

async function getOrderById(userId, orderId) {
  const order = await prisma.order.findUnique({
    where: { id: toNumber(orderId) },
    include: { items: true },
  });

  if (!order || order.userId !== toNumber(userId)) {
    throw new ApiError(404, 'Order not found');
  }

  return mapOrder(order);
}

async function createOrderFromCart(userId) {
  const numericUserId = toNumber(userId);

  // Load cart with products
  const cart = await prisma.cart.findUnique({
    where: { userId: numericUserId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  // Validate stock and compute totals
  const lineItems = cart.items.map((it) => {
    if (!it.product) {
      throw new ApiError(404, 'Product in cart not found');
    }
    if (it.quantity > it.product.stock) {
      throw new ApiError(409, `Insufficient stock for product ${it.product.id}`);
    }

    const subtotal = Number((it.product.price * it.quantity).toFixed(2));
    return {
      productId: it.product.id,
      snapshotTitle: it.product.title,
      snapshotPrice: it.product.price,
      quantity: it.quantity,
      subtotal,
    };
  });

  const totalAmount = lineItems.reduce((s, li) => s + li.subtotal, 0);
  const totalQuantity = lineItems.reduce((s, li) => s + li.quantity, 0);

  // Transaction: create order, create items, decrement stock, clear cart items
  const result = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: numericUserId,
        status: 'pending',
        totalAmount,
        totalQuantity,
        items: {
          create: lineItems.map((li) => ({
            productId: li.productId,
            snapshotTitle: li.snapshotTitle,
            snapshotPrice: li.snapshotPrice,
            quantity: li.quantity,
            subtotal: li.subtotal,
          })),
        },
      },
      include: { items: true },
    });

    // decrement product stock for each line item
    for (const li of lineItems) {
      await tx.product.update({
        where: { id: li.productId },
        data: { stock: { decrement: li.quantity } },
      });
    }

    // clear cart items
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  return mapOrder(result);
}

module.exports = {
  listOrdersForUser,
  getOrderById,
  createOrderFromCart,
};
