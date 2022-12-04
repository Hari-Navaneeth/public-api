const express = require('express');
const School = require('../models/schools');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        let new_data=[];
        School.find((err, data) => {
            if (err) return next(err);
            else {
                data = data.filter((dist) => {
                    return (req.query.district).toLowerCase() == (dist.district).toLowerCase()
                })
                new_data = data.map(({ schoolName, _id }) => ({ "label": schoolName, "value": _id }))
            }
            res.status(200).send(new_data);
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router;