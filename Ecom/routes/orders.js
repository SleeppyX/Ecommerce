const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator')

// GET: All orders
router.get('/', async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user_id', 'username email')
            .populate('products.product_id', 'name price');
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

// GET: Order by ID
router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user_id', 'username email')
            .populate('products.product_id', 'name price');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        next(error);
    }
});

// POST: Create a new order
router.post(
    '/',
    [
        body('user_id').notEmpty().withMessage('User ID is required'),
        body('products')
            .isArray({ min: 1 })
            .withMessage('Products must be an array with at least one item'),
        body('products.*.product_id').notEmpty().withMessage('Product ID is required'),
        body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { user_id, products } = req.body;

            let total_price = 0;
            for (const item of products) {
                const product = await Product.findById(item.product_id);
                if (!product) return res.status(404).json({ error: `Product ID ${item.product_id} not found` });
                total_price += product.price * item.quantity;
            }

            const newOrder = await Order.create({ user_id, products, total_price });
            res.status(201).json({ message: 'Order created successfully', order: newOrder });
        } catch (error) {
            next(error);
        }
    }
);

// DELETE: Delete an order
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order deleted successfully', order: deletedOrder });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
