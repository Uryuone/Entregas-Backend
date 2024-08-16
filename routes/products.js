const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = query ? { category: query } : {};

        const products = await Product.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {});

        const count = await Product.countDocuments(filter);

        res.json({
            status: 'success',
            payload: products,
            totalPages: Math.ceil(count / limit),
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page * limit < count ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page * limit < count,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
            nextLink: page * limit < count ? `/api/products?limit=${limit}&page=${page + 1}` : null
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
