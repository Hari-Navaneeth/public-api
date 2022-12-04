const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', async (req, res, next) => res.status(200).send("Welcome to Pynemonk"));
router.use('/auth', require('./auth'));
router.use('/schools', require('./school'));
router.use('/districts', require('./districts'));
router.use('/reports', require('./reports'));

router.use(function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'Secret1234', function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false, message: 'Failed to authenticate token.'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.status(403).send({
            success: false,
            message: 'please provide the token'
        })
    }
});

router.use('/users', require('./users'));
router.use('/order', require('./order'));
router.use('/videos', require('./videos'));
router.use('/participants', require('./participants'));

module.exports = router;