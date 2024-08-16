const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');

// Rutas para renderizar vistas
router.get('/products', productController.renderProductsView);
router.get('/products/:pid', productController.renderProductDetailsView);
router.get('/carts/:cid', cartController.renderCartView);

module.exports = router;
