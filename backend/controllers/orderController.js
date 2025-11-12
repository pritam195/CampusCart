const Order = require("../models/Order");
const Product = require("../models/Products");
const Cart = require("../models/Cart");

// @desc    Create order with meeting details
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, meetingDetails, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    const orders = [];

    // Create separate orders for each product (since different sellers)
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        continue;
      }

      if (product.status !== "Available") {
        return res.status(400).json({
          success: false,
          message: `Product ${product.title} is not available`,
        });
      }

      // Create order
      const order = await Order.create({
        buyer: req.user._id,
        seller: product.seller,
        product: item.productId,
        quantity: item.quantity || 1,
        totalAmount: product.price * (item.quantity || 1),
        meetingDetails,
        paymentMethod,
        status: "Pending",
      });

      // Update product status to Reserved
      product.status = "Reserved";
      await product.save();

      orders.push(order);
    }

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 }
    );

    // Populate order details
    const populatedOrders = await Order.find({
      _id: { $in: orders.map((o) => o._id) },
    })
      .populate("buyer", "name email phone university")
      .populate("seller", "name email phone university")
      .populate("product", "title price images category");

    res.status(201).json({
      success: true,
      message: "Orders created successfully",
      orders: populatedOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get buyer's orders
// @route   GET /api/orders/buyer
// @access  Private
exports.getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("seller", "name email phone university")
      .populate("product", "title price images category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get seller's orders
// @route   GET /api/orders/seller
// @access  Private
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate("buyer", "name email phone university")
      .populate("product", "title price images category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email phone university")
      .populate("seller", "name email phone university")
      .populate("product", "title price images category condition location");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is buyer or seller
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status (seller confirms, marks complete)
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only seller can update status
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only seller can update order status",
      });
    }

    order.status = status;

    // If completed, update product status to Sold and remove from availability
    if (status === "Completed") {
      order.completedAt = Date.now();
      const product = await Product.findById(order.product);
      if (product) {
        product.status = "Sold";
        await product.save();
      }
    }

    // If cancelled, make product available again
    if (status === "Cancelled") {
      const product = await Product.findById(order.product);
      if (product) {
        product.status = "Available";
        await product.save();
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("buyer", "name email phone university")
      .populate("seller", "name email phone university")
      .populate("product", "title price images category");

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel order (buyer or seller)
// @route   DELETE /api/orders/:id
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is buyer or seller
    if (
      order.buyer.toString() !== req.user._id.toString() &&
      order.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // Can only cancel if pending or confirmed
    if (order.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed order",
      });
    }

    order.status = "Cancelled";
    await order.save();

    // Make product available again
    const product = await Product.findById(order.product);
    if (product) {
      product.status = "Available";
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
