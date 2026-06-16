const express = require("express");
const {
  submitFeedback,
  getAllFeedback,
  getMyFeedback,
  getRecentFeedback, 
  updateFeedbackStatus,
  deleteFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(submitFeedback).get(protect, getAllFeedback);
router.route("/recent").get(getRecentFeedback); 
router.route("/my-feedback").get(protect, getMyFeedback);
router
  .route("/:id")
  .put(protect, updateFeedbackStatus)
  .delete(protect, deleteFeedback);

module.exports = router;
