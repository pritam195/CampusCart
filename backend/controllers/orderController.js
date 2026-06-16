const Order = require("../models/Order");
const Product = require("../models/Products");
const Cart = require("../models/Cart");




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

      
      product.status = "Reserved";
      await product.save();

      orders.push(order);
    }

    
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 }
    );

    
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

    
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only seller can update order status",
      });
    }

    order.status = status;

    
    if (status === "Completed") {
      order.completedAt = Date.now();
      const product = await Product.findById(order.product);
      if (product) {
        product.status = "Sold";
        await product.save();
      }
    }

    
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




exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    
    if (
      order.buyer.toString() !== req.user._id.toString() &&
      order.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    
    if (order.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed order",
      });
    }

    order.status = "Cancelled";
    await order.save();

    
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
