const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    meetingDetails: {
      location: {
        type: String,
        required: true,
        enum: [
          "Main Gate",
          "Library",
          "Canteen",
          "Admin Building",
          "Hostel Block A",
          "Hostel Block B",
          "Sports Complex",
          "Academic Block 1",
          "Academic Block 2",
          "Parking Area",
        ],
      },
      date: {
        type: Date,
        required: true,
      },
      timeSlot: {
        type: String,
        required: true,
        enum: [
          "09:00 AM - 10:00 AM",
          "10:00 AM - 11:00 AM",
          "11:00 AM - 12:00 PM",
          "12:00 PM - 01:00 PM",
          "01:00 PM - 02:00 PM",
          "02:00 PM - 03:00 PM",
          "03:00 PM - 04:00 PM",
          "04:00 PM - 05:00 PM",
          "05:00 PM - 06:00 PM",
        ],
      },
      notes: {
        type: String,
        maxlength: 500,
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "UPI", "Bank Transfer"],
      default: "Cash on Delivery",
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
