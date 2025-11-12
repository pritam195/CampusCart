const express = require("express");
const { upload } = require("../config/cloudinary");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getProducts);
router.route("/").post(protect, upload.array("images", 5), createProduct);
router.route("/my-listings").get(protect, getMyListings);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
