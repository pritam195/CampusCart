const Product = require("../models/Products"); 
const { cloudinary } = require("../config/cloudinary");




exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      condition,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    
    const query = { status: "Available" };

    
    if (category && category !== "all") {
      
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    
    if (condition && condition !== "all") {
      
      const formattedCondition = condition.replace(/-/g, " ");
      query.condition = { $regex: new RegExp(`^${formattedCondition}$`, "i") };
    }

    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    
    if (search) {
      query.$text = { $search: search };
    }

    
    let sortOption = { createdAt: -1 }; 
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    
    const products = await Product.find(query)
      .populate("seller", "name email university avatar")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email university phone avatar"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.createProduct = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    console.log("Files received:", req.files);
    const { title, description, price, category, condition, images, location } =
      req.body;
    
    
    let productImages = [];

    if (req.files && req.files.length > 0) {
      
      productImages = req.files.map((file) => file.path);
    } else if (images && Array.isArray(images)) {
      
      productImages = images;
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      images: productImages,
      location,
      seller: req.user._id,
    });

    
    await product.populate("seller", "name email university avatar");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("seller", "name email university avatar");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.getMyListings = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .populate("seller", "name email university avatar");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.getCategoryCounts = async (req, res) => {
  try {
    const counts = await Product.aggregate([
      { $match: { status: "Available" } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    
    const formattedCounts = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      counts: formattedCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
