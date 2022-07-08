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
const { CustomerSchema } = require('./models/User-models');

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

app.post('/payment', userTokenVerification.router, async(req, res) => {

    const userPayload = req.userPayload;

    const user = await CustomerSchema.findById(userPayload._id);

    if (user) {
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

        if (user.orders.length === 0) {
            user.orders.push({ orderID: response.id });
        } else {
            for (let i = 0; i < user.orders.length; i++) {
                if (user.orders[i].orderID === response.id) {
                    console.log('Order already exists');
                } else if (i === user.order.length - 1) {
                    user.orders.push({ orderID: response.id });
                }
            }
        }

        res.json(response);
    }

})

app.use('/user', UserRoutes.router);

app.use('/products', ProductRoutes.router);

app.use('/cart', userTokenVerification.router, CartRoutes.router);

app.post('/payment-verify', (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const crypto = require('crypto')

    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    console.log(digest, req.headers['x-razorpay-signature'])

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
            // process it
        res.json({ status: 'ok' });
    } else {
        // pass it
        res.sendStatus(502);
    }

})

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