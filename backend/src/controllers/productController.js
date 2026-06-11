const Product = require("../models/ProductModel");

// @desc    Lấy tất cả sản phẩm thời trang
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi Server: " + error.message,
    });
  }
};

// @desc    Lấy chi tiết 1 sản phẩm
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết sản phẩm: " + error.message,
    });
  }
};

// @desc    Tạo mới sản phẩm
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    const products = await Product.insertMany(data);

    return res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công!",
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Lỗi dữ liệu: " + error.message,
    });
  }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm: " + error.message,
    });
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm: " + error.message,
    });
  }
};

// @desc    Viết bình luận / đánh giá sản phẩm
// @route   POST /api/products/:id/reviews
const createProductReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập số sao và nội dung đánh giá",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const review = {
      name: name || "Khách hàng",
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((total, item) => total + item.rating, 0) /
      product.reviews.length;

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Đánh giá sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi gửi đánh giá: " + error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
