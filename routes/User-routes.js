const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userVerification = require('../Verification/userTokenVerifications');
const UserModels = require('../models/User-models');
const { OrderSchema } = require('../models/Order-models');

const Razorpay = require('razorpay');

const router = express.Router();

router.post('/signup', async(req, res, next) => {
    if (!req.body.name || !req.body.phone_number || !req.body.password) {
        res.status(401).json({ message: 'Incomplete credentials' })
    } else {
        try {
            const checkUser = await UserModels.CustomerSchema.find({ phone_number: req.body.phone_number, name: req.body.name });
            if (checkUser.length > 0) {
                res.status(409).json({ message: 'User already exists' });
            } else if (checkUser.length === 0) {
                const password = await bcrypt.hash(req.body.password, 10);
                const user = new UserModels.CustomerSchema({...req.body,
                    phone_number: parseInt(req.body.phone_number),
                    pincode: req.body.pincode ? parseInt(req.body.pincode) : '',
                    password
                });
                const response = await user.save();
                if (req.cookies.jwt) {
                    res.status(200).clearCookie('jwt').json({
                        _id: response._id,
                        name: response.name,
                        phone_number: response.phone_number,
                        state: response.state,
                        district: response.district,
                        town_city: response.town_city,
                        business_add: response.business_add,
                        post_office: response.post_office,
                        pincode: response.pincode,
                        time_of_business: response.time_of_business,
                        price: response.price,
                        photo: response.photo
                    });
                } else {
                    res.status(200).json({
                        _id: response._id,
                        name: response.name,
                        phone_number: response.phone_number,
                        state: response.state,
                        district: response.district,
                        town_city: response.town_city,
                        business_add: response.business_add,
                        post_office: response.post_office,
                        pincode: response.pincode,
                        time_of_business: response.time_of_business,
                        price: response.price,
                        photo: response.photo
                    });
                }
            }
        } catch (err) {
            console.log((err));
        }
    }
})

router.post('/login', async(req, res, next) => {
    const expiry = parseInt(process.env.JWT_CUSTOMER_SK_EXPIRY);
    try {
        if (!req.body.phone_number || !req.body.name || !req.body.password) {
            res.status(401).json({ message: 'Please fill out all the input fields to log in' });
        } else {
            const userFetchFromDB = await UserModels.CustomerSchema.find({
                name: req.body.name,
                phone_number: parseInt(req.body.phone_number)
            });

            if (userFetchFromDB.length === 0) {
                // Condition when the login credentials are incorrect...
                res.status(401).json({ message: 'Login credentials incorrect' });
            } else if (userFetchFromDB[0]._id) {
                // Condition when the login credentials are correct...
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, userFetchFromDB[0].password);
                if (isPasswordCorrect) {
                    const payload = {
                        _id: userFetchFromDB[0]._id,
                        name: req.body.name
                    }

                    const token = jwt.sign(payload, process.env.JWT_SK);
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: true,
                        maxAge: expiry,
                        expires: new Date(Date.now() + expiry)
                    }).status(200).json({ message: 'Login successfull', expiresIn: expiry });
                } else {
                    res.status(401).json({ message: 'Password is incorrect. Please try again' });
                }
            }

        }
    } catch (err) {
        console.log(err);
    }
})


router.get('/user-addresses', userVerification.router, async(req, res) => {
    const userPayload = req.userPayload;

    try {
        const user = await UserModels.CustomerSchema.findById(userPayload._id);
        if (user) {
            res.status(200).json(user.shippingAddresses);
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/user-address', userVerification.router, async(req, res) => {
    const userPayload = req.userPayload;
    try {
        const user = await UserModels.CustomerSchema.findById(userPayload._id);

        if (user) {
            res.status(200).json({ payload: user.mostRecentUsedShippingAddress });
        } else {
            res.status(401).clearCookie('jwt').json({ message: 'User not found.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Some error occurred. Please try again.' });
    }
})

router.post('/update-user-address', userVerification.router, async(req, res) => {
    const userPayload = req.userPayload;
    try {
        const user = await UserModels.CustomerSchema.findById(userPayload._id);

        if (req.body.newAddress) {
            user.shippingAddresses.push(req.body.payload);
        }

        user.selectedShippingAddress = req.body.payload;
        await user.save();

        const updatedUser = await UserModels.CustomerSchema.findById(userPayload._id);
        res.status(200).json({ payload: updatedUser.selectedShippingAddress, message: 'Address added successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Some error occurred. Please try again.' });
    }
});

router.get('/get-user-selected-cart', userVerification.router, async(req, res) => {
    const userPayload = req.userPayload;
    try {

        const user = await UserModels.CustomerSchema.findById(userPayload._id);

        if (user.selectedShippingAddress) {
            res.status(200).json({ payload: user.selectedShippingAddress });
        } else {
            res.status(404).json({ payload: null });
        }
    } catch (err) {
        res.status(500).json({ message: 'Some error occurred. Please try again.' });
    }
})

router.get('/get-orders', userVerification.router, async(req, res) => {
    const userPayload = req.userPayload;

    try {
        const user = await UserModels.CustomerSchema.findById(userPayload._id).populate('orders.orderItems.product');

        if (user && user._id) {
            const orders = [];
            for (let i = 0; i < user.orders.length; i++) {
                if (user.orders[i].isPaid) {
                    orders.push(user.orders[i]);
                }
            }

            res.status(200).json({ payload: orders });

        } else {
            res.status(401).clearCookie('jwt').json({ payload: "User doesn't exist in the database." });
        }


    } catch (err) {
        res.status(500).json({ message: 'Some error occurred. Please try again.' });
    }
})

router.get('/payment-status/:orderID', userVerification.router, async(req, res) => {
    const userPayload = req.userPayload;
    const orderID = req.params.orderID;

    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const order = await instance.orders.fetch(orderID);

        const userOrders = await OrderSchema.find({ 'orders.userID': userPayload._id });

        if (order) {
            if (order.status === 'paid') {

                // Do this in the payment-varify route on production....
                for (let i = 0; i < userOrders[0].orders.length; i++) {
                    if (userOrders[0].orders[i].orderID === order.id) {
                        userOrders[0].orders[i].entity = order.entity;
                        userOrders[0].orders[i].amount = order.amount;
                        userOrders[0].orders[i].amount_paid = order.amount_paid;
                        userOrders[0].orders[i].receipt = order.receipt;
                        userOrders[0].orders[i].status = order.status;
                        userOrders[0].orders[i].attempts = order.attempts;
                        userOrders[0].orders[i].created_at = order.created_at;
                    }
                }

                await userOrders[0].save();
                // Do this in the payment-varify route on production....

                res.status(200).json({ payload: true });
            } else if (order.status !== 'paid') {
                res.status(200).json({ payload: false });
            }
        } else if (!order) {
            res.status(200).json({ payload: null });
        }

    } catch (err) {
        res.status(500).json({ message: 'Some error occurred. Please try again.' });
    }
})

router.get('/check-login', async(req, res, next) => {

    if (req.cookies.jwt) {
        try {
            const payload = jwt.verify(req.cookies.jwt, process.env.JWT_SK);
            if (payload._id) {
                res.status(200).json({ message: 'User authenticated' });
            }
        } catch (err) {
            res.clearCookie('jwt').status(401).json({ message: 'Authentication failed' });
        }

    } else {
        res.status(404).json({ message: 'Token not found' });
    }
})


router.get('/logout', async(req, res, next) => {
    if (req.cookies.jwt) {
        res.clearCookie('jwt').sendStatus(204);
    } else {
        res.status(404).json({ message: 'Token not found' })
    }
})

router.get('/productsPageNumber', async(req, res, next) => {
    if (req.cookies.jwt) {
        const payload = jwt.verify(req.cookies.jwt, process.env.JWT_SK);
        if (payload._id) {
            const user = await UserModels.CustomerSchema.findById(payload._id);
            res.status(200).json({ defaultProductsPageNumber: user.defaultProductsPageNumber });
        } else
            res.status(200).json({ defaultProductsPageNumber: 1 });
    } else {
        res.status(200).json({ defaultProductsPageNumber: 1 });
    }

})

exports.router = router;