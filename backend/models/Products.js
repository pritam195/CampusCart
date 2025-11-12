const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a product title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Books",
        "Electronics",
        "Furniture",
        "Clothing",
        "Sports",
        "Stationery",
        "Other",
      ],
    },
    condition: {
      type: String,
      required: [true, "Please specify the condition"],
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    images: [
      {
        type: String,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },
    location: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for search optimization
productSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
