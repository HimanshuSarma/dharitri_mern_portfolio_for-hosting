const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(async(req, res, next) => {
    if (!req.cookies.jwt) {
        res.status(401).clearCookie('jwt').json({ message: 'Please login with your account.' });
    } else {
        try {
            const userPayload = jwt.verify(req.cookies.jwt, process.env.JWT_SK);
            if (userPayload && userPayload._id) {
                req.userPayload = userPayload;
                next();
            } else {
                return res.status(401).clearCookie('jwt').json({ message: 'Please login with your account.' });
            }
        } catch (err) {
            console.log(err, 'token invalid');
            res.status(401).clearCookie('jwt').json({ message: 'Please login with your account.' });
        }
    }
})


exports.router = router;