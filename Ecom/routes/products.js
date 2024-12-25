const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

router.post(
    '/',
    [
        body('id').isNumeric().withMessage('ID must be a number'),
        body('name').notEmpty().withMessage('Name is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
        body('category').notEmpty().withMessage('Category is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            const existingProduct = await Product.findOne({ id: req.body.id });
            if (existingProduct) {
                return res.status(400).json({ error: 'Product ID already exists' });
            }
            const newProduct = await Product.create(req.body);
            res.status(201).json({ message: 'Product created successfully', product: newProduct });

            
        } catch (error) {
            next(error);
        }
    }
);

router.put('/:id', async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
