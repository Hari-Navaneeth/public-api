const express = require('express');
const District = require('../models/districts');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        District.find((err, data) => {
            const data_arr = [];
            if (err) return next(err);
            else {
                for (const data_obj of data) {
                    data_arr.push(data_obj.district);
                }
            }
            console.log(data_arr);
            res.status(200).json(data_arr);
        });
    } catch (error) {
        next(error)
    }
})

module.exports = router;