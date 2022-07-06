require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const CORS = require('cors');
const crypto = require('crypto');
const uuid = require('uuid');
const Razorpay = require('razorpay');
const path = require('path');

const UserRoutes = require('./routes/User-routes');
const ProductRoutes = require('./routes/Product-routes');
const CartRoutes = require('./routes/Cart-routes');
const userTokenVerification = require('./Verification/userTokenVerifications');

const app = express();

// // CORS Headers => Required for cross-origin/ cross-server communication
// // app.use((req, res, next) => {
// //     res.setHeader('Access-Control-Allow-Origin', '*');
// //     res.setHeader(
// //         'Access-Control-Allow-Headers',
// //         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
// //     );
// //     res.setHeader(
// //         'Access-Control-Allow-Methods',
// //         'GET, POST, PATCH, DELETE, OPTIONS'
// //     );
// //     next();
// // });

app.use(CORS({
    credentials: true,
    origin: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));

app.use(cookieParser());

app.post('/payment', async(req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const response = await razorpay.orders.create({
        amount: 5000,
        currency: 'INR',
        receipt: 'App',
        payment_capture: 1
    });
    res.json(response);
})

app.use('/user', UserRoutes.router);

app.use('/products', ProductRoutes.router);

app.use('/cart', userTokenVerification.router, CartRoutes.router);

__dirname = path.resolve();
process.env.PWD = process.cwd();

if (process.env.ENVIRONMENT === 'production') {
    app.use(express.static(path.join(process.env.PWD, 'frontend', 'build')));
    app.use('*', (req, res) => {
        res.sendFile(path.join(process.env.PWD, 'frontend', 'build', 'index.html'));
    })
}

try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION_URI, () => {
        console.log('Connected to database');
        try {
            app.listen(process.env.PORT || 3000, () => {
                console.log(`Server running at port ${process.env.PORT || 3000}`)
            })
        } catch (err) {
            console.log(err);
        }
    })
} catch (err) {
    console.log(err);
}