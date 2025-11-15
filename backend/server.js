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
// Configure CORS whitelist and handling
const whitelist = [
  process.env.FRONTEND_URL || "https://campus-cart-delta.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://campuscart-ckro.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Enable pre-flight across the board
app.options("*", cors());

// Fallback: always set common CORS headers (helps if some response skips cors middleware)
app.use((req, res, next) => {
  const origin = req.headers.origin || process.env.FRONTEND_URL;
  if (origin && whitelist.indexOf(origin) !== -1) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});


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
