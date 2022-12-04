const Razorpay = require("razorpay");
const crypto = require("crypto");

const express = require("express");
const User = require("../models/users");
const PaymentDetails = require("../models/paymentDetails");
const router = express.Router();

//  Test Keys
// const key_id = "rzp_test_xdAejQGKOPNYNY";
// const key_secret = "Ey9yuSX8AR2EsL0UqhwmelSd";
// Live Keys
const key_id = "rzp_live_W1p1K0JxgXoWNT";
const key_secret = "0jXupcNuG8aItaSGux15GQDb";

class OldPayment {
  constructor({
    paymentId,
    amount,
    currency,
    receipt,
    tries,
    status,
    expiresAt,
    createdAt,
  }) {
    this.paymentId = paymentId;
    this.amount = amount;
    this.currency = currency;
    this.receipt = receipt;
    this.tries = tries;
    this.status = status;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
  }
}

router.get("/", async (req, res, next) => {
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
      const userId = token.name;
      const instance = new Razorpay({
        key_id,
        key_secret,
      });
      const options = {
        // amount: 36500, //365.00
        // amount: 36500, //365.00
        amount: 9900, //99.00
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
      };
      instance.orders.create(options, async (error, order) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Something Went Wrong!" });
        }
        const { id: paymentId, amount, currency, receipt, status } = order;
        const paymentDetails = await PaymentDetails.findOne({
          userId,
        });
        if (paymentDetails) {
          // On Update
          if (paymentDetails.paymentHistory) paymentDetails.paymentHistory = [];
          paymentDetails.paymentHistory.push(new OldPayment(paymentDetails));
          paymentDetails.paymentId = paymentId;
          paymentDetails.amount = amount;
          paymentDetails.currency = currency;
          paymentDetails.receipt = receipt;
          paymentDetails.status = status;
          paymentDetails.createdAt = new Date();
          PaymentDetails.findOneAndUpdate(
            { _id: paymentDetails._id },
            paymentDetails
          );
        } else {
          // First Time Payment
          const newPaymentDetails = new PaymentDetails({
            userId,
            paymentId,
            amount,
            currency,
            receipt,
            status,
            createdAt: new Date(),
            paymentHistory: [],
          });
          await newPaymentDetails.save();
        }
        res.status(200).json({
          ...order,
          key: key_id,
          description: `Order Id : ${paymentId}`,
          orderId: paymentId,
        });
      });
    } else {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

router.post("/verify", async (req, res) => {
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
      const userId = token.name;
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;
      console.log("req.body", req.body);
      const sign = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSign = crypto
        .createHmac("sha256", key_secret)
        .update(sign.toString())
        .digest("hex");

      if (razorpaySignature === expectedSign) {
        const accessExpiresAt = new Date();
        accessExpiresAt.setMonth(accessExpiresAt.getMonth() + 3);
        const paymentDetails = await PaymentDetails.findOne({
          userId,
        });
        if (paymentDetails) {
          paymentDetails.status = "success";
          paymentDetails.expiresAt = accessExpiresAt;
          paymentDetails.updatedAt = new Date();
          await PaymentDetails.findOneAndUpdate(
            { _id: paymentDetails._id },
            paymentDetails
          );
        }
        await User.findOneAndUpdate(
          { _id: userId },
          {
            accessExpiresAt,
          }
        );
        return res
          .status(200)
          .json({ accessExpiresAt, message: "Payment verified successfully" });
      } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
      }
    }
    return res.status(500).json({ message: "Something went wrong!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;
