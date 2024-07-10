const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta POST /
router.post('/', (req, res) => {
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const newCart = {
    id: (carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1).toString(),
    products: []
  };
  carts.push(newCart);
  fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));
  res.status(201).json(newCart);
});

// Ruta GET /:cid
router.get('/:cid', (req, res) => {
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).send('Cart not found');
  }
});

// Ruta POST /:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const cart = carts.find(c => c.id === req.params.cid);
  const product = products.find(p => p.id === req.params.pid);

  if (cart && product) {
    const cartProduct = cart.products.find(p => p.product === req.params.pid);
    if (cartProduct) {
      cartProduct.quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));
    res.json(cart);
  } else {
    res.status(404).send('Cart or Product not found');
  }
});

module.exports = router;
