const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    emailOtp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, 
    },
  }
);

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);
