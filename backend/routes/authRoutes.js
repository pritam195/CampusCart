const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  sendOtp,
  verifyOtp,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, upload.single("avatar"), updateProfile);
router.put("/update-password", protect, updatePassword);

module.exports = router;
