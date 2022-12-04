const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PaymentDetailsSchema = new schema({
  userId: { type: String },
  expiresAt: { type: Date },
  paymentId: { type: String },
  amount: { type: String },
  currency: { type: String },
  receipt: { type: String },
  // update to zero for success attempts and increment for failure attempts
  tries: { type: Number },
  status: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  paymentHistory: [
    {
      paymentId: { type: String },
      amount: { type: String },
      currency: { type: String },
      receipt: { type: String },
      tries: { type: Number },
      status: { type: String },
      createdAt: { type: Date },
      expiresAt: { type: Date },
      createdAt: { type: Date },
    },
  ],
});

module.exports = mongoose.model("PaymentDetails", PaymentDetailsSchema);
