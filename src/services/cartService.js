const prisma = require('../utils/prisma');
const { ApiError } = require('../utils/apiError');

function toNumber(value) {
  return Number(value);
}

function mapProduct(product) {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    stock: product.stock,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      altText: image.altText,
      sortOrder: image.sortOrder,
    })),
  };
}

function mapCartItem(item) {
  const subtotal = item.quantity * item.product.price;

  return {
    id: item.id,
    quantity: item.quantity,
    subtotal,
    product: mapProduct(item.product),
  };
}

function mapCart(cart) {
  const items = cart.items.map(mapCartItem);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    totalQuantity,
    total,
    itemCount: items.length,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
}

async function findCartForUser(userId) {
  return prisma.cart.findUnique({
    where: { userId: toNumber(userId) },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      },
    },
  });
}

async function getOrCreateCartForUser(userId) {
  const numericUserId = toNumber(userId);
  const cart = await prisma.cart.upsert({
    where: { userId: numericUserId },
    update: {},
    create: { userId: numericUserId },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      },
    },
  });

  return cart;
}

async function getCart(userId) {
  const cart = await getOrCreateCartForUser(userId);
  return mapCart(cart);
}

async function addCartItem(userId, payload) {
  const numericUserId = toNumber(userId);
  const productId = toNumber(payload.productId);
  const quantity = payload.quantity ? toNumber(payload.quantity) : 1;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (quantity < 1) {
    throw new ApiError(400, 'quantity must be at least 1');
  }

  if (quantity > product.stock) {
    throw new ApiError(409, 'Requested quantity exceeds available stock');
  }

  const cart = await prisma.$transaction(async (tx) => {
    const activeCart = await tx.cart.upsert({
      where: { userId: numericUserId },
      update: {},
      create: { userId: numericUserId },
    });

    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: activeCart.id,
          productId,
        },
      },
    });

    const nextQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

    if (nextQuantity > product.stock) {
      throw new ApiError(409, 'Requested quantity exceeds available stock');
    }

    if (existingItem) {
      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQuantity },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: activeCart.id,
          productId,
          quantity,
        },
      });
    }

    return tx.cart.findUnique({
      where: { id: activeCart.id },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });
  });

  return mapCart(cart);
}

async function updateCartItem(userId, itemId, payload) {
  const quantity = toNumber(payload.quantity);
  if (quantity < 1) {
    throw new ApiError(400, 'quantity must be at least 1');
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: toNumber(itemId) },
    include: {
      cart: true,
      product: true,
    },
  });

  if (!cartItem || cartItem.cart.userId !== toNumber(userId)) {
    throw new ApiError(404, 'Cart item not found');
  }

  if (quantity > cartItem.product.stock) {
    throw new ApiError(409, 'Requested quantity exceeds available stock');
  }

  await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
  });

  const cart = await findCartForUser(userId);
  return mapCart(cart);
}

async function removeCartItem(userId, itemId) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: toNumber(itemId) },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== toNumber(userId)) {
    throw new ApiError(404, 'Cart item not found');
  }

  await prisma.cartItem.delete({
    where: { id: cartItem.id },
  });

  const cart = await findCartForUser(userId);
  return mapCart(cart);
}

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
};
