const express = require("express");
const {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.route("/").post(createOrder);
router.route("/buyer").get(getBuyerOrders);
router.route("/seller").get(getSellerOrders);
router.route("/:id").get(getOrder).delete(cancelOrder);
router.route("/:id/status").put(updateOrderStatus);

module.exports = router;
