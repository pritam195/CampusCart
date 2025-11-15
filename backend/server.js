const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Load env vars
dotenv.config();
// console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);
// console.log("Cloudinary Config:", {
//   name: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secret: process.env.CLOUDINARY_API_SECRET ? "****" : "MISSING",
// });

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: [
      "https://campus-cart-delta.vercel.app", // replace with actual Vercel URL
    ],
    credentials: true,
  })
);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/feedback", feedbackRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Student Resale API" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
