const Product = require('../models/product');

// Obtener productos con filtros, paginación y ordenamiento
exports.getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const products = await Product.paginate(filter, options);
    res.status(200).json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Crear producto
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.status(200).json({ status: 'success', message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Renderizar vista de productos con paginación
exports.renderProductsView = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Renderizar vista de detalles de un producto
exports.renderProductDetailsView = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.render('productDetails', { product });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

