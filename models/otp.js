const mongoose = require("mongoose");
const schema = mongoose.Schema;

const OtpSchema = new schema({
  userId: { type: String },
  otp: { type: String },
  verified: { type: Boolean },
  expiresAt: { type: Date },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Otp", OtpSchema);
