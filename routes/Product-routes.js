const express = require('express');
const ProductSchema = require('../models/Product-models');

const router = express.Router();

router.get('/get-products', async(req, res, next) => {
    try {

        let productsCountInDB = undefined;
        if (!parseInt(req.query.sendTotalProductsCount)) {
            productsCountInDB = await ProductSchema.ProductSchema.countDocuments();
        }

        let pageNumber = parseInt(req.query.page) || 1;

        const pageSize = parseInt(req.query.pageSize) || 3;

        if (req.query.page <= 0 || req.query.page >= Math.ceil(productsCountInDB / pageSize)) pageNumber = 1;

        const skip = (pageNumber - 1) * pageSize;

        const products = await ProductSchema.ProductSchema.find().skip(skip).limit(pageSize);
        if (products.length === 0) {
            res.status(403).json({ message: 'No products found' });
        } else {
            res.status(200).json({ products, productsCountInDB, productsPageNumber: pageNumber });
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/:productID', async(req, res, next) => {
    try {
        const product = await ProductSchema.ProductSchema.findById(req.params.productID);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json(product);
        }
    } catch (err) {
        console.log(err);
    }
})

exports.router = router;