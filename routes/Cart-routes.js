const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/User-models');
const ProductSchema = require('../models/Product-models');

const router = express.Router();

router.patch('/patch-cart', async(req, res, next) => {

    const doesProductExist = await ProductSchema.ProductSchema.findById(req.body.product.productID);

    if (!doesProductExist) {
        res.status(404).json({ message: 'Product does not exist' });
    } else if (!req.cookies.jwt) {
        res.status(401).json({ message: 'Please login to perform this task' });
    } else {
        const userPayload = req.userPayload;
        try {
            const userDocument = await UserSchema.CustomerSchema.findById(userPayload._id);

            if (!userDocument) {
                return res.status(401).clearCookie('jwt').json({ message: 'User not found.' });
            }

            if (userDocument.cart.length === 0) {
                userDocument.cart.push({ product: req.body.product.productID, qty: req.body.product.qty });
            } else {
                for (let i = 0; i < userDocument.cart.length; i++) {
                    if (userDocument.cart[i].product.equals(req.body.product.productID)) {
                        userDocument.cart[i].qty = req.body.product.qty;
                        break;
                    } else if (!userDocument.cart[i].product.equals(req.body.product.productID) && i === userDocument.cart.length - 1) {
                        userDocument.cart.push({ product: req.body.product.productID, qty: req.body.product.qty });
                        break;
                    }
                }
            }

            await userDocument.save();
            res.status(200).json({ message: `${req.body.operation === 'add-product' ? 'Product was added to cart' : 
                req.body.operation === 'update-cart-item-qty' ? 'Quantity of Product was updated' : 'The cart has been updated'}` });
        } catch (err) {
            console.log(err, 'catch');
            res.status(500).json({ message: 'Some error occured. Please try again' });
        }
    }
});

router.get('/get-cart', async(req, res, next) => {
    try {
        const userPayload = req.userPayload;
        let userDocument = await UserSchema.CustomerSchema.findById(userPayload._id).populate('cart.product');
        if (!userDocument) {
            res.status(401).clearCookie('jwt').json({ message: 'User not found.' });
        } else {
            res.status(200).json({ cart: userDocument.cart });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Some error occured. Please try again' });
    }
})

router.get('/get-cart-item/:productID', async(req, res, next) => {
    const productID = req.params.productID;
    try {
        const userPayload = req.userPayload;
        let userDocument = await UserSchema.CustomerSchema.findById(userPayload._id).populate('cart.product');

        if (!userDocument) {
            return res.status(401).clearCookie('jwt').json({ message: 'User not found.' });
        }

        for (let i = 0; i < userDocument.cart.length; i++) {
            if (userDocument.cart[i].product.equals(productID)) {
                res.status(200).json({ _id: userDocument.cart[i]._id, qty: userDocument.cart[i].qty });
                return;
            } else if (!userDocument.cart[i].product.equals(req.body.productID) && i === userDocument.cart.length - 1) {
                res.status(404).json({ message: 'Cart item does not exist' });
                return;
            }
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Some error occured. Please try again' });
    }
})


router.delete('/delete-cart-item/:productID', async(req, res, next) => {
    try {
        const userPayload = req.userPayload;
        let userDocument = await UserSchema.CustomerSchema.findById(userPayload._id).populate('cart.product');

        if (!userDocument) {
            return res.status(401).clearCookie('jwt').json({ message: 'User not found' });
        }

        for (let i = 0; i < userDocument.cart.length; i++) {
            if (userDocument.cart[i].product.equals(req.params.productID)) {
                userDocument.cart.splice(i, 1);
                break;
            } else if (!userDocument.cart[i].product.equals(req.params.productID) && i === userDocument.cart.length - 1) {
                res.status(404).json({ message: 'Product does not exist' });
            }
        }

        await userDocument.save();
        res.status(200).json({ message: 'Product deleted from cart' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Some error occured. Please try again' });
    }
})


exports.router = router;