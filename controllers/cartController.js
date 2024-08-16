const Cart = require('../models/cart');

// Crear carrito
exports.createCart = async (req, res) => {
  try {
    const newCart = new Cart();
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Obtener carrito por ID
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Agregar producto al carrito
exports.addProductToCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const { pid } = req.params;
    const { quantity } = req.body;

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Eliminar producto del carrito
exports.removeProductFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const { pid } = req.params;

    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Actualizar carrito con un arreglo de productos
exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Actualizar cantidad de un producto en el carrito
exports.updateProductQuantity = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const { pid } = req.params;
    const { quantity } = req.body;

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity = quantity;
      const updatedCart = await cart.save();
      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Eliminar todos los productos del carrito
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.products = [];
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Renderizar vista del carrito
exports.renderCartView = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.render('cart', { cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
