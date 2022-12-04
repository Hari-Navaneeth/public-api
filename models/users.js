const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  profession: [
    {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      // required: true
    },
  ],
  email: { type: String },
  mobile: { type: String },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["user-verified", "user-approval-pending"],
    default: "user-approval-pending",
  },
  school: { type: String },
  artTeacher: { type: Boolean },
  class: { type: String },
  dateOfBirth: { type: Date },
  district: {
    type: String,
    // required: true
  },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  // Payment
  accessExpiresAt: { type: Date },
  paymentDetails: { type: String },
});

module.exports = mongoose.model("Users", UserSchema);
