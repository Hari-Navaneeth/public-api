const express = require("express");
const User = require("../models/users");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    // const apiToken =
    //   req.body.token || req.query.token || req.headers["x-access-token"];
    // if (apiToken) {
    //   jwt.verify(apiToken, "Secret1234", function (err, decoded) {
    //     if (err) {
    //       return res.status(401).send({
    //         success: false,
    //         message: "Failed to authenticate token.",
    //       });
    //     } else {
    //       req.decoded = decoded;
    //     }
    //   });
    // } else {
    //   return res.status(403).send({
    //     success: false,
    //     message: "please provide the token",
    //   });
    // }

    if (req.decoded) {
      const token = req.decoded;
      const id = token.name;
      User.findById(id, (err, data) => {
        if (err) return next(err);
        res.status(200).send(data);
      });
    } else {
      User.find((err, data) => {
        if (err) return next(err);
        res.status(200).send(data);
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/", (req, res, next) => {
  try {
    // const apiToken =
    //   req.body.token || req.query.token || req.headers["x-access-token"];
    // if (apiToken) {
    //   jwt.verify(apiToken, "Secret1234", function (err, decoded) {
    //     if (err) {
    //       return res.status(401).send({
    //         success: false,
    //         message: "Failed to authenticate token.",
    //       });
    //     } else {
    //       req.decoded = decoded;
    //     }
    //   });
    // } else {
    //   return res.status(403).send({
    //     success: false,
    //     message: "please provide the token",
    //   });
    // }
    if (req.query.id) {
      User.findOneAndDelete(req.query.id, (err, data) => {
        if (err) return next(err);
        res.status(200).send(data);
      });
    } else {
      User.deleteMany((err) => {
        if (err) return next(err);
        res.status(200).send("All data deleted");
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
