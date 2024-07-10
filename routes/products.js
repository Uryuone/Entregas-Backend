const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta raíz GET /
router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// Ruta GET /:pid
router.get('/:pid', (req, res) => {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

// Ruta POST /
router.post('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const newProduct = {
    id: (products.length ? Math.max(...products.map(p => p.id)) + 1 : 1).toString(),
    ...req.body,
    status: req.body.status !== undefined ? req.body.status : true
  };
  products.push(newProduct);
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

// Ruta PUT /:pid
router.put('/:pid', (req, res) => {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const index = products.findIndex(p => p.id === req.params.pid);
  if (index !== -1) {
    const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
    products[index] = updatedProduct;
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
    res.json(updatedProduct);
  } else {
    res.status(404).send('Product not found');
  }
});

// Ruta DELETE /:pid
router.delete('/:pid', (req, res) => {
  let products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  products = products.filter(p => p.id !== req.params.pid);
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
  res.status(204).send();
});

module.exports = router;
