const productsService = require('../services/productsService');

async function index(req, res, next) {
  try {
    const opts = {
      page: req.query.page,
      limit: req.query.limit,
      q: req.query.q,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      sort: req.query.sort || 'createdAt',
      order: req.query.order || 'desc',
    };

    const result = await productsService.listProducts(opts);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const slug = req.params.slug;
    const product = await productsService.getProductBySlug(slug);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = req.body;
    const created = await productsService.createProduct(payload);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await productsService.updateProduct(id, payload);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await productsService.deleteProduct(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { index, show, create, update, remove };
