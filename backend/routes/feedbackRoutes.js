const express = require("express");
const {
  submitFeedback,
  getAllFeedback,
  getMyFeedback,
  getRecentFeedback, // Add this
  updateFeedbackStatus,
  deleteFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(submitFeedback).get(protect, getAllFeedback);
router.route("/recent").get(getRecentFeedback); // Add this - BEFORE /my-feedback
router.route("/my-feedback").get(protect, getMyFeedback);
router
  .route("/:id")
  .put(protect, updateFeedbackStatus)
  .delete(protect, deleteFeedback);

module.exports = router;
