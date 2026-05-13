const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const slugify = require('../utils/slugify');

async function listProducts(options = {}) {
  const {
    page = 1,
    limit = 20,
    q,
    category,
    minPrice,
    maxPrice,
    sort = 'createdAt',
    order = 'desc',
  } = options;

  const where = {};

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (category) {
    const normalizedCategory = String(category).trim();

    if (!isNaN(Number(normalizedCategory))) {
      where.categoryId = Number(normalizedCategory);
    } else {
      where.category = {
        is: {
          OR: [
            {
              slug: normalizedCategory.toLowerCase(),
            },
            {
              name: normalizedCategory,
            },
          ],
        },
      };
    }

    console.log('CATEGORY:', category);
    console.log('WHERE:', JSON.stringify(where, null, 2));
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.AND = [];

    if (minPrice !== undefined) {
      where.AND.push({
        price: { gte: Number(minPrice) },
      });
    }

    if (maxPrice !== undefined) {
      where.AND.push({
        price: { lte: Number(maxPrice) },
      });
    }
  }

  const take = Math.min(100, Number(limit) || 20);
  const skip = (Number(page) - 1) * take;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sort]: order,
      },
      include: {
        images: true,
        category: true,
      },
    }),

    prisma.product.count({ where }),
  ]);

  return {
    data: items,
    meta: {
      total,
      page: Number(page),
      limit: take,
      pages: Math.ceil(total / take) || 1,
    },
  };
}

async function getProductBySlug(slug) {
  return prisma.product.findUnique({ where: { slug }, include: { images: true, category: true } });
}

async function createProduct(payload) {
  const {
    title,
    description,
    price,
    stock = 0,
    featured = false,
    categoryId,
    images = [],
    slug,
  } = payload;

  const productSlug = slug || `${slugify(title)}-${Date.now().toString().slice(-5)}`;

  const created = await prisma.product.create({
    data: {
      title,
      slug: productSlug,
      description,
      price: Number(price),
      stock: Number(stock),
      featured: Boolean(featured),
      category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
      images: images.length
        ? { create: images.map((i, idx) => ({ url: i.url, altText: i.altText, sortOrder: i.sortOrder ?? idx })) }
        : undefined,
    },
    include: { images: true, category: true },
  });

  return created;
}

async function updateProduct(id, payload) {
  const updateData = { ...payload };
  if (updateData.title && !updateData.slug) {
    updateData.slug = `${slugify(updateData.title)}-${Date.now().toString().slice(-4)}`;
  }

  // handle images separately (simple approach: replace all images if provided)
  const images = updateData.images;
  delete updateData.images;

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      ...updateData,
      price: updateData.price !== undefined ? Number(updateData.price) : undefined,
      stock: updateData.stock !== undefined ? Number(updateData.stock) : undefined,
      category: updateData.categoryId ? { connect: { id: Number(updateData.categoryId) } } : undefined,
      images: images
        ? { deleteMany: {}, create: images.map((i, idx) => ({ url: i.url, altText: i.altText, sortOrder: i.sortOrder ?? idx })) }
        : undefined,
    },
    include: { images: true, category: true },
  });

  return updated;
}

async function deleteProduct(id) {
  return prisma.product.delete({ where: { id: Number(id) } });
}

module.exports = {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
